/**
 * Brand asset generator.
 *
 * Emits downloadable Sonaloop logo assets from the canonical icon geometry and local Sona fonts:
 *   brand/sonaloop-icon.svg + PNG squares
 *   brand/sonaloop-wordmark.svg + PNG widths
 *   brand/sonaloop-lockup.svg + PNG widths
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const outDir = resolve(root, 'brand');
const { regular } = await import(resolve(root, 'icons.data.mjs'));

const INK = '#1a1815';
const SONA_MONO = readFileSync(resolve(root, 'fonts/SonaMono-Variable.woff2')).toString('base64');
const SONA_PIXEL = readFileSync(resolve(root, 'fonts/SonaPixel-Line.woff2')).toString('base64');
const MARK_BODY = regular.sonaloop.body
  .replace('<path ', '<path class="s" ')
  .replace(/<circle /g, '<circle class="f" ');

const fontCss = `
@font-face{font-family:'Sona Mono';src:url(data:font/woff2;base64,${SONA_MONO}) format('woff2');font-weight:100 900;font-style:normal;font-display:block}
@font-face{font-family:'Sona Pixel';src:url(data:font/woff2;base64,${SONA_PIXEL}) format('woff2');font-weight:400;font-style:normal;font-display:block}`;

const baseCss = `
.logo-asset{color:${INK}}
.s{stroke:currentColor}
.f{fill:currentColor}
.word-sona{font-family:'Sona Mono';font-weight:500;font-size:128px;letter-spacing:.01em;fill:currentColor}
.word-loop{font-family:'Sona Pixel';font-weight:400;font-size:134.4px;letter-spacing:0;fill:currentColor}`;

function svgDocument({ width, height, viewBox, body, css = '' }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="${viewBox}" fill="none">
<defs><style>${fontCss}${baseCss}${css}</style></defs>
${body}
</svg>`;
}

function markSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="1.5 1 21 21" fill="none" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" class="logo-asset">
<style>.logo-asset{color:${INK}}.s{stroke:currentColor}.f{fill:currentColor}</style>
${MARK_BODY}
</svg>`;
}

async function svgBounds(page, svg, selector) {
  await page.setContent(`<!doctype html><html><body style="margin:0;background:transparent">${svg}</body></html>`);
  await page.evaluate(() => document.fonts.ready);
  return page.$eval(selector, (el) => {
    const b = el.getBBox();
    return { x: b.x, y: b.y, width: b.width, height: b.height };
  });
}

async function textProbe(page, text, cls, fontSize) {
  const x = 100;
  const y = 180;
  const svg = svgDocument({
    width: 900,
    height: 320,
    viewBox: '0 0 900 320',
    body: `<g class="logo-asset"><text id="probe" class="${cls}" x="${x}" y="${y}" font-size="${fontSize}">${text}</text></g>`,
  });
  const box = await svgBounds(page, svg, '#probe');
  return { ...box, leftBearing: box.x - x, right: box.x + box.width };
}

function textGroup({ x, baseline }) {
  return `<text class="word-sona" x="${x.toFixed(2)}" y="${baseline.toFixed(2)}">sona</text>
<text class="word-loop" x="__LOOP_X__" y="${baseline.toFixed(2)}">loop</text>`;
}

function markGroup({ x, y, size }) {
  return `<svg x="${x.toFixed(2)}" y="${y.toFixed(2)}" width="${size.toFixed(2)}" height="${size.toFixed(2)}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" overflow="visible">
${MARK_BODY}
</svg>`;
}

async function makeWordAsset(page, kind) {
  const baseline = 180;
  const fontSize = 128;
  const loopFontSize = fontSize * 1.05;
  const gap = fontSize * 0.04;
  const left = 100;
  const sona = await textProbe(page, 'sona', 'word-sona', fontSize);
  const loop = await textProbe(page, 'loop', 'word-loop', loopFontSize);
  const text = textGroup({ x: left, baseline }).replace('__LOOP_X__', (sona.right + gap - loop.leftBearing).toFixed(2));

  const content = kind === 'wordmark'
    ? text
    : `${markGroup({
        x: left,
        y: baseline - (fontSize * 1.08) + (fontSize * 0.27),
        size: fontSize * 1.08,
      })}
${textGroup({ x: left + (fontSize * 1.08) + (fontSize * 0.16), baseline })
        .replace('__LOOP_X__', (left + (fontSize * 1.08) + (fontSize * 0.16) + (sona.right - left) + gap - loop.leftBearing).toFixed(2))}`;

  const probeSvg = svgDocument({
    width: 1200,
    height: 340,
    viewBox: '0 0 1200 340',
    body: `<g id="asset" class="logo-asset" stroke-linecap="round" stroke-linejoin="round">${content}</g>`,
  });
  const bounds = await svgBounds(page, probeSvg, '#asset');
  const margin = kind === 'wordmark' ? 18 : 20;
  const viewX = Math.max(0, bounds.x - margin);
  const viewY = Math.max(0, bounds.y - margin);
  const viewW = bounds.width + margin * 2;
  const viewH = bounds.height + margin * 2;
  return svgDocument({
    width: Math.ceil(viewW),
    height: Math.ceil(viewH),
    viewBox: `${viewX.toFixed(2)} ${viewY.toFixed(2)} ${viewW.toFixed(2)} ${viewH.toFixed(2)}`,
    body: `<g class="logo-asset" stroke-linecap="round" stroke-linejoin="round">${content}</g>`,
  });
}

async function renderPng(page, svg, file, { width, height = null }) {
  const dataUri = `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
  const h = height || Math.max(320, Math.ceil(width / 2));
  await page.setViewportSize({ width: Math.ceil(width), height: Math.ceil(h) });
  await page.setContent(`<!doctype html><html><body style="margin:0;background:transparent"><img id="asset" alt="" src="${dataUri}" style="display:block;width:${width}px;${height ? `height:${height}px;` : 'height:auto;'}"></body></html>`);
  await page.waitForFunction(() => {
    const img = document.getElementById('asset');
    return img && img.complete && img.naturalWidth > 0;
  });
  const img = page.locator('#asset');
  const box = await img.boundingBox();
  if (!box) throw new Error(`Could not render ${file}`);
  if (box.height > h) await page.setViewportSize({ width: Math.ceil(width), height: Math.ceil(box.height) });
  await img.screenshot({ path: resolve(outDir, file), omitBackground: true });
}

await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ deviceScaleFactor: 1 });

const icon = markSvg();
const wordmark = await makeWordAsset(page, 'wordmark');
const lockup = await makeWordAsset(page, 'lockup');

await writeFile(resolve(outDir, 'sonaloop-icon.svg'), icon);
await writeFile(resolve(outDir, 'sonaloop-wordmark.svg'), wordmark);
await writeFile(resolve(outDir, 'sonaloop-lockup.svg'), lockup);

for (const size of [256, 512, 1024]) {
  await renderPng(page, icon, `sonaloop-icon-${size}.png`, { width: size, height: size });
}
for (const width of [1024, 2048]) {
  await renderPng(page, wordmark, `sonaloop-wordmark-${width}w.png`, { width });
  await renderPng(page, lockup, `sonaloop-lockup-${width}w.png`, { width });
}

await browser.close();

console.log('brand assets: brand/{sonaloop-icon,sonaloop-wordmark,sonaloop-lockup}.{svg,png}');
