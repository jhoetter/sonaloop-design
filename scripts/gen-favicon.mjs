/**
 * Favicon generator — the Sonaloop mark, from the single source (icons.data.mjs).
 *
 *   node scripts/gen-favicon.mjs
 *
 * Emits a theme-aware SVG favicon (indigo, lighter in dark) plus raster fallbacks, straight
 * from the `sonaloop` icon geometry so the tab icon can never drift from the brand mark:
 *   sonaloop-design/site/favicon.svg            (the docs site)
 *   ../sonaloop-website/public/favicon.svg      (+ favicon.ico, favicon-32/192.png, apple-touch-icon.png)
 * The inspector inlines the same SVG as a data-URI (see sonaloop/web — _FAVICON_SVG).
 *
 * Brand indigo #5e6ad2 (light) / #7c84e8 (dark). No deps beyond `sharp` (already a devDep).
 */
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import sharp from 'sharp';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const { regular } = await import(resolve(root, 'icons.data.mjs'));
const body = regular.sonaloop.body; // <path data-part="loop" …/> + 3 node <circle>s

// Recolour the icon body: the loop path is stroked, the node circles are filled. We tag the
// loop with class "s" (stroke) and circles with "f" (fill) so one <style> themes both.
const themedBody = body
  .replace('<path ', '<path class="s" ')
  .replace(/<circle /g, '<circle class="f" ');

// viewBox tightened a touch around the mark so it fills a square tab icon well.
const VB = '1.5 1 21 21';
const svg = (themeAware) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${VB}" fill="none" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round">
<style>.s{stroke:#5e6ad2}.f{fill:#5e6ad2}${themeAware ? '@media(prefers-color-scheme:dark){.s{stroke:#7c84e8}.f{fill:#7c84e8}}' : ''}</style>
${themedBody}
</svg>`;

const themed = svg(true);   // served favicon.svg — follows the OS theme
const solid = svg(false);   // for rasters (no media query → predictable colour)

// ── write the SVG to the docs site + the website ──────────────────────────────────
await writeFile(resolve(root, 'site/favicon.svg'), themed);
const webPublic = resolve(root, '../sonaloop-website/public');
await writeFile(resolve(webPublic, 'favicon.svg'), themed);

// ── rasters from the solid SVG (transparent background) ───────────────────────────
const png = (size) => sharp(Buffer.from(solid)).resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png();
await png(32).toFile(resolve(webPublic, 'favicon-32.png'));
await png(192).toFile(resolve(webPublic, 'favicon-192.png'));
await png(180).toFile(resolve(webPublic, 'apple-touch-icon.png'));

// favicon.ico = a single 32×32 PNG wrapped in a minimal ICO container (all modern browsers
// accept PNG-in-ICO; the SVG is the primary anyway).
const ico32 = await png(32).toBuffer();
const ico = Buffer.alloc(6 + 16 + ico32.length);
ico.writeUInt16LE(0, 0); ico.writeUInt16LE(1, 2); ico.writeUInt16LE(1, 4);          // header: reserved, type=icon, count=1
ico.writeUInt8(32, 6); ico.writeUInt8(32, 7); ico.writeUInt8(0, 8); ico.writeUInt8(0, 9);
ico.writeUInt16LE(1, 10); ico.writeUInt16LE(32, 12);                                 // planes, bpp
ico.writeUInt32LE(ico32.length, 14); ico.writeUInt32LE(22, 18);                      // size, offset
ico32.copy(ico, 22);
await writeFile(resolve(webPublic, 'favicon.ico'), ico);

console.log('favicon: site/favicon.svg, website public/{favicon.svg,favicon.ico,favicon-32.png,favicon-192.png,apple-touch-icon.png}');
