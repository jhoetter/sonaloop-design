/**
 * Generate a visual contact sheet of every icon for the README.
 *
 *   node scripts/gen-preview.mjs   →  preview/gallery.svg
 *
 * Self-contained light card (renders in both GitHub themes). Icons use
 * currentColor; the root sets `color` so strokes + inline fills resolve.
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const { regular, hifi } = await import(resolve(root, 'icons.data.mjs'));

const INK = '#2d333b';
const MUTED = '#57606a';
const BG = '#ffffff';
const BORDER = '#d0d7de';

const PAD = 24;
const W = 832;

function grid(items, { cols, cellW, cellH, iconSize, vb, yStart }) {
  const startX = (W - cols * cellW) / 2;
  let out = '';
  items.forEach(([name, spec], i) => {
    const col = i % cols;
    const rowi = Math.floor(i / cols);
    const cx = startX + col * cellW + cellW / 2;
    const cyTop = yStart + rowi * cellH + 14;
    const ix = cx - iconSize / 2;
    out +=
      `<svg x="${ix.toFixed(1)}" y="${cyTop}" width="${iconSize}" height="${iconSize}" viewBox="${vb}" ` +
      `fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${spec.body}</svg>`;
    out +=
      `<text x="${cx.toFixed(1)}" y="${cyTop + iconSize + 16}" text-anchor="middle" ` +
      `font-family="ui-monospace,SFMono-Regular,Menlo,monospace" font-size="10.5" fill="${MUTED}">${name}</text>`;
  });
  const rows = Math.ceil(items.length / cols);
  return { svg: out, height: rows * cellH };
}

const reg = Object.entries(regular);
const hi = Object.entries(hifi);

let y = PAD + 68;
const header = (label, yy) =>
  `<text x="${PAD}" y="${yy}" font-family="ui-sans-serif,system-ui,sans-serif" font-size="15" font-weight="700" fill="${INK}">${label}</text>`;

let body = '';
body += `<text x="${PAD}" y="${PAD + 18}" font-family="ui-sans-serif,system-ui,sans-serif" font-size="20" font-weight="700" fill="${INK}">sonaloop-icons</text>`;
body += `<text x="${PAD}" y="${PAD + 36}" font-family="ui-sans-serif,system-ui,sans-serif" font-size="12" fill="${MUTED}">${reg.length} regular · ${hi.length} hi-fi — one source of truth for sonaloop + persona-website</text>`;

body += header(`Regular · 24×24  (${reg.length})`, y);
y += 14;
const rg = grid(reg, { cols: 6, cellW: 130, cellH: 84, iconSize: 28, vb: '0 0 24 24', yStart: y });
body += rg.svg;
y += rg.height + 30;

body += header(`Hi-fi · 48×48  (${hi.length})`, y);
y += 14;
const hg = grid(hi, { cols: 4, cellW: 196, cellH: 116, iconSize: 52, vb: '0 0 48 48', yStart: y });
body += hg.svg;
y += hg.height + PAD;

const H = Math.ceil(y);
const svg =
  `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" color="${INK}">` +
  `<rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="14" fill="${BG}" stroke="${BORDER}"/>` +
  body +
  `</svg>\n`;

await mkdir(resolve(root, 'preview'), { recursive: true });
await writeFile(resolve(root, 'preview/gallery.svg'), svg);
console.log(`preview/gallery.svg  (${W}×${H}, ${reg.length} regular + ${hi.length} hi-fi)`);
