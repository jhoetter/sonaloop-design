// One-off: clone the sonaloop-cloud brand-family icon into data/website/design
// variants (same mark + masked corner chip, different badge emblem) and splice
// them into icons.data.mjs. Run once, then delete.
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const dataPath = resolve(root, 'icons.data.mjs');
const { regular, hifi } = await import(dataPath);

// Badge emblems (cut out of the solid chip via fill-rule=evenodd), authored to
// sit in the chip box — regular: centred ~(18.4,18.4); hifi: centred ~(38,38).
const GLYPH = {
  // sonaloop-data — a mini bar chart (structured data / records).
  'sonaloop-data': {
    r: ' M16.5 18.4h1.2v1.9h-1.2z M18.1 16.9h1.2v3.4h-1.2z M19.7 17.9h1.2v2.4h-1.2z',
    h: ' M33.6 37.5h2.3v4h-2.3z M36.85 34.5h2.3v7h-2.3z M40.1 36.5h2.3v5h-2.3z',
  },
  // sonaloop-website — a browser window (screen + title bar).
  'sonaloop-website': {
    r: ' M16.9 16.5h3.0a0.6 0.6 0 0 1 0.6 0.6v2.6a0.6 0.6 0 0 1 -0.6 0.6h-3.0a0.6 0.6 0 0 1 -0.6 -0.6v-2.6a0.6 0.6 0 0 1 0.6 -0.6z M16.6 17.35h3.6v0.5h-3.6z',
    h: ' M35.2 34.0h5.6a1.2 1.2 0 0 1 1.2 1.2v5.2a1.2 1.2 0 0 1 -1.2 1.2h-5.6a1.2 1.2 0 0 1 -1.2 -1.2v-5.2a1.2 1.2 0 0 1 1.2 -1.2z M34.7 35.4h6.6v0.85h-6.6z',
  },
  // sonaloop-design — a four-point sparkle (craft / polish).
  'sonaloop-design': {
    r: ' M18.4 16.0L19.04 17.76L20.8 18.4L19.04 19.04L18.4 20.8L17.76 19.04L16.0 18.4L17.76 17.76Z',
    h: ' M38 33.2L39.27 36.73L42.8 38L39.27 39.27L38 42.8L36.73 39.27L33.2 38L36.73 36.73Z',
  },
};

const ID = {
  'sonaloop-data': 'Data',
  'sonaloop-website': 'Web',
  'sonaloop-design': 'Design',
};
const LABEL = {
  'sonaloop-data': 'SonaloopData',
  'sonaloop-website': 'SonaloopWebsite',
  'sonaloop-design': 'SonaloopDesign',
};

function clone(srcBody, name, suffix /* 'R' | 'H' */) {
  const idTag = suffix === 'R' ? 'R' : 'H';
  let body = srcBody.replaceAll(`slCloudBadge${idTag}`, `sl${ID[name]}Badge${idTag}`);
  // swap the badge emblem: keep the chip (up to the first Z), append our glyph
  body = body.replace(/(data-part="badge" d=")([^"]*)(")/, (_, p, d, s) => {
    const chip = d.slice(0, d.indexOf('Z') + 1);
    return p + chip + GLYPH[name][suffix === 'R' ? 'r' : 'h'] + s;
  });
  return body;
}

function entry(name, body, hifiSuffix) {
  const label = LABEL[name] + (hifiSuffix ? 'Hifi' : 'Icon');
  const lines = [
    `  '${name}': {`,
    `    label: '${label}',`,
    `    body: ${JSON.stringify(body)},`,
    `  },`,
  ];
  return lines.join('\n') + '\n';
}

let text = await readFile(dataPath, 'utf8');

// ── regular: splice before the regular object's closing `};` ──
const regBlocks = Object.keys(GLYPH)
  .map((n) => entry(n, clone(regular['sonaloop-cloud'].body, n, 'R'), false))
  .join('');
const regAnchor = '};\n\n// ── High-fidelity 48×48 display icons';
if (!text.includes(regAnchor)) throw new Error('regular anchor not found');
text = text.replace(regAnchor, regBlocks + regAnchor);

// ── hifi: splice before the final `};` at EOF ──
const hiBlocks = Object.keys(GLYPH)
  .map((n) => entry(n, clone(hifi['sonaloop-cloud'].body, n, 'H'), true))
  .join('');
text = text.replace(/\n};\n$/, '\n' + hiBlocks + '};\n');

await writeFile(dataPath, text);
console.log('spliced', Object.keys(GLYPH).length, 'family icons (regular + hifi)');
