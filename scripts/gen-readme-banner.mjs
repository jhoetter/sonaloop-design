/**
 * Render the Sonaloop README banner — painterly canvas + the brand lockup
 * (monochrome loop mark + "sona" in Sona Mono + "loop" in Sona Pixel), matching
 * the shared `.sl-logo`. Just the logo over the canvas — no tagline. On-brand
 * (Cursor-leaning, warm neutral) per BRANDING.md.
 *
 *   node scripts/gen-readme-banner.mjs [canvas] [outfile]
 *     canvas   basename in images/canvas (default: abstract-light)
 *     outfile  png path (default: preview/banner-<canvas>.png)
 *
 * Dev-only. Needs playwright-core + sharp (devDependencies) + a Chromium.
 */
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { homedir } from 'node:os';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright-core');
const sharp = require('sharp');

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const canvas = process.argv[2] || 'abstract-light';
const out = resolve(root, process.argv[3] || `preview/banner-${canvas}.png`);

// Logical banner geometry (≈ 4:1). Rendered @2x, then downscaled for file size.
const W = 1600, H = 400;

const b64 = async (p, mime) => `data:${mime};base64,${(await readFile(p)).toString('base64')}`;
const bg = await b64(resolve(root, `images/canvas/${canvas}.jpg`), 'image/jpeg');
const mono = await b64(resolve(root, 'fonts/SonaMono-Variable.woff2'), 'font/woff2');
const pixel = await b64(resolve(root, 'fonts/SonaPixel-Line.woff2'), 'font/woff2');

// Brand ink (light theme --sl-ink). The lockup is monochrome.
const INK = '#1A1815';
// The 24×24 loop mark (SonaloopIcon), monochrome to match the shared .sl-logo.
const mark = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${INK}" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
  <path d="M17 12L17.31 12.62L17.49 13.3L17.51 14.01L17.35 14.69L17 15.29L16.49 15.77L15.87 16.1L15.19 16.28L14.5 16.33L13.84 16.28L13.25 16.17L12.72 16.07L12.23 16.01L11.77 16.01L11.28 16.07L10.75 16.17L10.16 16.28L9.5 16.33L8.81 16.28L8.13 16.1L7.51 15.77L7 15.29L6.65 14.69L6.49 14.01L6.51 13.3L6.69 12.62L7 12L7.37 11.46L7.76 11L8.12 10.59L8.41 10.2L8.65 9.79L8.83 9.34L9.01 8.83L9.22 8.26L9.5 7.67L9.88 7.09L10.38 6.59L10.98 6.22L11.65 6.03L12.35 6.03L13.02 6.22L13.62 6.59L14.12 7.09L14.5 7.67L14.78 8.26L14.99 8.83L15.17 9.34L15.35 9.79L15.59 10.2L15.88 10.59L16.24 11L16.63 11.46L17 12Z"/>
  <circle fill="${INK}" stroke="none" cx="12" cy="3.7" r="1.85"/>
  <circle fill="${INK}" stroke="none" cx="19.19" cy="16.15" r="1.85"/>
  <circle fill="${INK}" stroke="none" cx="4.81" cy="16.15" r="1.85"/>
</svg>`;

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
  @font-face{font-family:'Sona Mono';src:url(${mono}) format('woff2');font-weight:100 900;font-display:block}
  @font-face{font-family:'Sona Pixel';src:url(${pixel}) format('woff2');font-weight:400;font-display:block}
  *{margin:0;box-sizing:border-box}
  #banner{position:relative;width:${W}px;height:${H}px;overflow:hidden;background:#FAF8F3}
  #banner .art{position:absolute;inset:0;background:url(${bg}) center/cover no-repeat}
  /* warm paper scrim — keep the canvas visible but lift the logo */
  #banner .scrim{position:absolute;inset:0;background:
     radial-gradient(120% 90% at 50% 42%, rgba(250,248,243,.78) 0%, rgba(250,248,243,.50) 45%, rgba(250,248,243,.30) 100%);}
  #banner .ring{position:absolute;inset:0;box-shadow:inset 0 0 0 1px rgba(26,24,21,.08)}
  #banner .content{position:absolute;inset:0;display:flex;
     align-items:center;justify-content:center}
  /* The shared .sl-logo lockup, em-based at banner scale. */
  #banner .sl-logo{display:inline-flex;align-items:baseline;gap:.16em;
     color:${INK};white-space:nowrap;font-size:118px}
  #banner .sl-logo__mark{display:inline-flex;align-items:center;justify-content:center;
     flex:none;align-self:baseline;color:${INK}}
  #banner .sl-logo .sl-logo__mark svg{width:1.08em;height:1.08em;overflow:visible;transform:translateY(.27em)}
  #banner .sl-logo__word{display:inline-flex;align-items:baseline;font-family:'Sona Mono',ui-monospace,monospace;
     font-weight:500;line-height:1;letter-spacing:.01em;text-transform:lowercase}
  #banner .sl-logo__loop{font-family:'Sona Pixel',ui-monospace,monospace;font-size:1.05em;
     letter-spacing:0;text-transform:none;margin-left:.04em}
</style></head><body>
  <div id="banner">
    <div class="art"></div>
    <div class="scrim"></div>
    <div class="content">
      <span class="sl-logo"><span class="sl-logo__mark">${mark}</span><span class="sl-logo__word">sona<span class="sl-logo__loop">loop</span></span></span>
    </div>
    <div class="ring"></div>
  </div>
</body></html>`;

async function findChromium() {
  const base = process.env.PLAYWRIGHT_BROWSERS_PATH || resolve(homedir(), '.cache/ms-playwright');
  if (!existsSync(base)) return undefined;
  const dirs = (await readdir(base)).filter((d) => d.startsWith('chromium-')).sort().reverse();
  for (const d of dirs)
    for (const p of ['chrome-mac/Chromium.app/Contents/MacOS/Chromium', 'chrome-linux64/chrome', 'chrome-linux/chrome']) {
      const exe = resolve(base, d, p);
      if (existsSync(exe)) return exe;
    }
  return undefined;
}

const browser = await chromium.launch({ executablePath: await findChromium(), args: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage'] });
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 2 });
await page.setContent(html, { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(150);
const shot = await page.$('#banner').then((el) => el.screenshot());
await browser.close();

await mkdir(dirname(out), { recursive: true });
// Downscale to 2400w for a crisp-but-reasonable file.
await sharp(shot).resize(2400).png({ quality: 90 }).toFile(out);
console.log(`wrote ${out}`);
