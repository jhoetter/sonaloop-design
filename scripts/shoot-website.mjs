#!/usr/bin/env node
/**
 * shoot-website.mjs — screenshot the sonaloop-website dev server (127.0.0.1:3000)
 * for visual QA. Lives here (not in sonaloop-website) because this repo carries
 * playwright-core + the downloaded Chromium.
 *
 * Usage:
 *   node scripts/shoot-website.mjs page  "/,/pricing"            [light|dark]
 *   node scripts/shoot-website.mjs zoom  "/" footer              [light|dark] [above] [below]
 *
 * page: full-page shot per route. zoom: a 2x clip around a selector's top edge
 * (e.g. footer, .tech-heading) — `above`/`below` set the px window (default 300/500).
 * Output: /tmp/sonaloop-shots/
 */
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';
const BASE = process.env.SHOOT_BASE ?? 'http://127.0.0.1:3000';

const [mode = 'page', routesArg = '/', a3, a4, a5, a6] = process.argv.slice(2);
const OUT = '/tmp/sonaloop-shots';
mkdirSync(OUT, { recursive: true });
const slug = (r) => (r === '/' ? 'home' : r.replace(/^\//, '').replace(/\//g, '_'));

async function newPage(browser, theme) {
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 1100 },
    deviceScaleFactor: mode === 'zoom' ? 2 : 1,
    colorScheme: theme === 'dark' ? 'dark' : 'light',
  });
  return ctx.newPage();
}

async function load(page, route, theme) {
  await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle' });
  await page.evaluate((t) => localStorage.setItem('persona-theme', t), theme);
  await page.reload({ waitUntil: 'networkidle' });
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(800);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);
}

const browser = await chromium.launch();

if (mode === 'page') {
  const theme = a3 || 'light';
  const page = await newPage(browser, theme);
  for (const route of routesArg.split(',')) {
    await load(page, route, theme);
    const path = `${OUT}/${slug(route)}-${theme}.png`;
    await page.screenshot({ path, fullPage: true });
    console.log(path);
  }
} else if (mode === 'zoom') {
  const sel = a3 || 'footer';
  const theme = a4 || 'light';
  const above = Number(a5 ?? 300);
  const below = Number(a6 ?? 500);
  const page = await newPage(browser, theme);
  await load(page, routesArg, theme);
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(500);
  const top = await page.evaluate((s) => {
    const el = document.querySelector(s);
    if (!el) return null;
    return el.getBoundingClientRect().top + window.scrollY;
  }, sel);
  if (top == null) {
    console.error('selector not found:', sel);
    process.exit(1);
  }
  const path = `${OUT}/${slug(routesArg)}-${theme}-zoom-${sel.replace(/[^a-z0-9-]+/gi, '_')}.png`;
  await page.screenshot({ path, fullPage: true, clip: { x: 0, y: Math.max(0, top - above), width: 1440, height: above + below } });
  console.log(path);
} else {
  console.error('unknown mode:', mode);
  process.exit(1);
}

await browser.close();
