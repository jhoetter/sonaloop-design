/**
 * Generate a clickable, hover-animated preview of every hi-fi icon.
 *
 *   node scripts/gen-anim-preview.mjs   →  preview/animated.html
 *
 * Open the file in a browser and hover each tile to feel the micro-interaction.
 * Uses the real animation stylesheet (styles/hifi-anim.css) and the same
 * `pi-hifi pi-hifi-<name>` classes the codegen emits, so what you see here is
 * exactly what ships. Each tile is `.pi-hover`, so hovering the card animates
 * the icon (the same hook a consumer puts on a button/feature-card).
 */
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const { hifi } = await import(resolve(root, 'icons.data.mjs'));
const css = await readFile(resolve(root, 'styles/hifi-anim.css'), 'utf8');

const cards = Object.entries(hifi)
  .map(
    ([name, spec]) =>
      `<button class="card pi-hover" type="button" title="hover me">` +
      `<svg class="pi-hifi pi-hifi-${name}" width="64" height="64" viewBox="0 0 48 48" ` +
      `fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" ` +
      `aria-hidden="true">${spec.body}</svg>` +
      `<span>${name}</span></button>`,
  )
  .join('\n');

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>sonaloop-icons · hi-fi hover animations</title>
<style>
  :root { color-scheme: light dark; }
  body { margin: 0; font: 14px/1.4 ui-sans-serif, system-ui, sans-serif;
         background: #f6f8fa; color: #1f2933; }
  header { padding: 28px 32px 8px; }
  header h1 { margin: 0 0 4px; font-size: 20px; }
  header p { margin: 0; color: #57606a; }
  .grid { display: grid; gap: 14px; padding: 24px 32px 48px;
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); }
  .card { display: flex; flex-direction: column; align-items: center; gap: 10px;
          padding: 22px 8px 14px; background: #fff; border: 1px solid #d0d7de;
          border-radius: 12px; color: #1f2933; cursor: pointer;
          font: inherit; transition: border-color .2s, box-shadow .2s; }
  .card:hover { border-color: #aeb6bf; box-shadow: 0 2px 10px rgba(0,0,0,.06); }
  .card span { color: #57606a; font-family: ui-monospace, Menlo, monospace; font-size: 11px; }
  @media (prefers-color-scheme: dark) {
    body { background: #0d1117; color: #e6edf3; }
    .card { background: #161b22; border-color: #30363d; color: #e6edf3; }
    .card span { color: #8b949e; }
    header p { color: #8b949e; }
  }
${css}
</style>
</head>
<body>
<header>
  <h1>sonaloop-icons — hi-fi hover animations</h1>
  <p>Hover (or keyboard-focus) any tile. Honors <code>prefers-reduced-motion</code>.</p>
</header>
<main class="grid">
${cards}
</main>
</body>
</html>
`;

await writeFile(resolve(root, 'preview/animated.html'), html);
console.log(`preview/animated.html  (${Object.keys(hifi).length} hi-fi icons, hover to play)`);
