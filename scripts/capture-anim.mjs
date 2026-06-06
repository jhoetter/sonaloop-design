/**
 * Capture icon hover-animations as frame "filmstrips" for visual review.
 *
 *   node scripts/capture-anim.mjs [specs] [outfile]
 *
 *   specs   comma list of `hifi:<name>` / `reg:<name>`, or a group keyword:
 *             all | hifi | reg   (default: a representative sample)
 *           e.g.  node scripts/capture-anim.mjs hifi:settings,reg:circle
 *                 node scripts/capture-anim.mjs hifi out/hifi.png
 *   outfile png path (default: preview/anim-film.png)
 *
 * Each row = one icon; columns = 6 frames over ~0.5s of its real CSS animation,
 * rendered in headless Chromium (so what you see is what ships). The animation
 * layer is opt-in, so each icon is rendered with `.pi-animate` here.
 *
 * Dev-only. Needs `playwright-core` + `sharp` (devDependencies) and a Chromium
 * (auto-detected from the Playwright cache, or run `npx playwright install
 * chromium`). Not part of the published package.
 */
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { readFile, writeFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { homedir } from 'node:os';

const require = createRequire(import.meta.url);
let chromium, sharp;
try {
  ({ chromium } = require('playwright-core'));
  sharp = require('sharp');
} catch {
  console.error('Missing dev deps. Run:  npm i -D playwright-core sharp');
  process.exit(1);
}

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const css = await readFile(resolve(root, 'styles/hifi-anim.css'), 'utf8');
const { regular, hifi } = await import(resolve(root, 'icons.data.mjs'));

const arg = process.argv[2] || 'sample';
const out = resolve(root, process.argv[3] || 'preview/anim-film.png');
const SAMPLE = ['hifi:settings', 'hifi:search', 'hifi:check', 'hifi:circle',
  'hifi:exchange', 'hifi:star', 'reg:settings', 'reg:circle', 'reg:plus',
  'reg:councils', 'reg:wave', 'reg:half'];

let specs;
if (arg === 'all') specs = [...Object.keys(hifi).map((n) => `hifi:${n}`), ...Object.keys(regular).map((n) => `reg:${n}`)];
else if (arg === 'hifi') specs = Object.keys(hifi).map((n) => `hifi:${n}`);
else if (arg === 'reg') specs = Object.keys(regular).map((n) => `reg:${n}`);
else if (arg === 'sample') specs = SAMPLE;
else specs = arg.split(',').map((s) => s.trim()).filter(Boolean);

const FRAMES = [25, 110, 195, 285, 380, 470]; // ms after hover

function svgFor(spec) {
  const [kind, name] = spec.split(':');
  const set = kind === 'hifi' ? hifi : regular;
  if (!set[name]) throw new Error(`unknown icon: ${spec}`);
  const cls = kind === 'hifi' ? `pi-hifi pi-hifi-${name}` : `pi pi-${name}`;
  const vb = kind === 'hifi' ? '0 0 48 48' : '0 0 24 24';
  const sw = kind === 'hifi' ? '' : ' stroke-width="1.75"';
  return `<svg class="${cls} pi-animate" width="92" height="92" viewBox="${vb}" fill="none" stroke="currentColor"${sw} stroke-linecap="round" stroke-linejoin="round">${set[name].body}</svg>`;
}

// Auto-detect a Chromium binary from the Playwright cache (fallback to letting
// playwright-core resolve its own bundled revision).
async function findChromium() {
  const base = process.env.PLAYWRIGHT_BROWSERS_PATH || resolve(homedir(), '.cache/ms-playwright');
  if (!existsSync(base)) return undefined;
  const dirs = (await readdir(base)).filter((d) => d.startsWith('chromium-')).sort().reverse();
  for (const d of dirs) {
    for (const p of ['chrome-linux64/chrome', 'chrome-linux/chrome', 'chrome-mac/Chromium.app/Contents/MacOS/Chromium']) {
      const exe = resolve(base, d, p);
      if (existsSync(exe)) return exe;
    }
  }
  return undefined;
}

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
  body{margin:0;background:#fff;color:#1f2933}
  .row{display:flex;flex-wrap:wrap}
  .cell{width:120px;height:120px;display:flex;align-items:center;justify-content:center;background:#fff}
  ${css}
</style></head><body><div class="row">${specs.map((s, i) => `<div class="cell" id="ic-${i}">${svgFor(s)}</div>`).join('')}</div></body></html>`;

const executablePath = await findChromium();
const browser = await chromium.launch({ executablePath, args: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage'] });
const page = await browser.newPage({ deviceScaleFactor: 2, reducedMotion: 'no-preference' });
await page.setContent(html, { waitUntil: 'load' });
await page.waitForTimeout(200);

const FW = 110, LBLW = 96;
const rows = [];
for (let i = 0; i < specs.length; i++) {
  const el = await page.$(`#ic-${i}`);
  await el.hover();
  const frames = [];
  let last = 0;
  for (const t of FRAMES) {
    await page.waitForTimeout(t - last); last = t;
    frames.push(await sharp(await el.screenshot()).resize(FW, FW).toBuffer());
  }
  await page.mouse.move(5, 5);
  await page.waitForTimeout(120);
  rows.push({ label: specs[i], frames });
}
await browser.close();

const W = LBLW + FRAMES.length * FW;
const H = rows.length * FW;
const overlays = [];
rows.forEach((r, ri) => {
  const y = ri * FW;
  overlays.push({
    input: Buffer.from(`<svg width="${LBLW}" height="${FW}"><rect width="100%" height="100%" fill="#f6f8fa"/><text x="8" y="${FW / 2}" font-family="monospace" font-size="13" fill="#1f2933">${r.label}</text></svg>`),
    top: y, left: 0,
  });
  r.frames.forEach((f, fi) => overlays.push({ input: f, top: y, left: LBLW + fi * FW }));
});
await sharp({ create: { width: W, height: H, channels: 3, background: '#fff' } }).composite(overlays).png().toFile(out);
console.log(`wrote ${out}  (${rows.length} icons × ${FRAMES.length} frames)`);
