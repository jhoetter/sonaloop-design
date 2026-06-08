/**
 * gen-website-usage.mjs — for each shared website block, detect (a) which marketing pages consume
 * it and (b) where its source lives in the design system. Writes the committed site/website.usage.mjs
 * that the docs "Website" section renders (consumer chips that link to the local marketing site, and
 * a "Source" link to the component on GitHub).
 *
 *  - `source` is detected from the LOCAL src/website.tsx (always available) — never hardcoded.
 *  - `usage` is scanned from the sibling marketing site (../sonaloop-website/src); if that repo
 *    isn't present, the previously committed usage map is preserved (source still refreshes).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const outPath = path.join(root, 'site/website.usage.mjs');
const siteSrc = path.resolve(root, '../sonaloop-website/src');

const REPO = 'https://github.com/jhoetter/sonaloop-design';
const BRANCH = 'main';

// docs block id -> the primary exported component (for the "Source" link) + the JSX tags that
// mean "this block is used" (wrapper names + shared export names) for consumer detection.
// A block is either flat ({ export, tags }) or a set of variants ({ variants: { key: { export,
// tags } } }) whose keys match the harness example keys — so usage/source can be computed per
// variant for the stacked "Cards" / "Atoms" concept pages.
const BLOCKS = {
  navbar: { export: 'Navbar', tags: ['Nav', 'Navbar'] },
  'mega-menu': { export: 'MegaMenuPanel', tags: ['MegaMenuPanel'] },
  cards: { variants: {
    content: { export: 'ContentCard', tags: ['FeatureCard', 'LinkCard', 'RelatedRail', 'ContentCard'] },
    pricing: { export: 'PricingCard', tags: ['PricingCard'] },
    ladder: { export: 'LadderCard', tags: ['LadderCard'] },
    verdict: { export: 'VerdictCard', tags: ['VerdictCard'] },
    snippet: { export: 'SnippetCard', tags: ['SnippetCard', 'SnippetVerdict', 'SnippetSentiment', 'SnippetMethodPicker'] },
  } },
  hero: { export: 'Hero', tags: ['HeroContent', 'Hero'] },
  'cta-band': { export: 'CtaBand', tags: ['CtaBand'] },
  footer: { export: 'Footer', tags: ['Footer'] },
  'product-showcase': { export: 'ProductShot', tags: ['ProductShot'] },
  'canvas-showcase': { export: 'CanvasShowcase', tags: ['CanvasShowcase'] },
  'integration-showcase': { export: 'IntegrationShowcase', tags: ['IntegrationShowcase'] },
  'command-palette': { export: 'CommandPalette', tags: ['CommandPalette', 'CommandTrigger'] },
  layout: { export: 'PageSection', tags: ['PageSection', 'PageRuler', 'SectionIntro', 'NoteBand'] },
  'content-atoms': { variants: {
    checklist: { export: 'CheckRow', tags: ['CheckRow'] },
    steps: { export: 'StepRows', tags: ['StepRows'] },
    fields: { export: 'FieldList', tags: ['FieldList'] },
  } },
  'install-block': { export: 'InstallBlock', tags: ['InstallBlock'] },
  faq: { export: 'FaqList', tags: ['FaqList'] },
};

/* ── Source map (always, from the local component file) ──────────────────────────────────── */
const websiteLines = fs.readFileSync(path.join(root, 'src/website.tsx'), 'utf8').split('\n');
const exportLine = (name) => {
  const re = new RegExp(`^export function ${name}\\b`);
  const i = websiteLines.findIndex((l) => re.test(l));
  return i >= 0 ? i + 1 : null;
};
const sourceFor = (name) => {
  const line = exportLine(name);
  return { export: name, file: 'src/website.tsx', line, href: `${REPO}/blob/${BRANCH}/src/website.tsx${line ? `#L${line}` : ''}` };
};
const source = {};
for (const [id, def] of Object.entries(BLOCKS)) {
  source[id] = def.variants
    ? Object.fromEntries(Object.entries(def.variants).map(([k, v]) => [k, sourceFor(v.export)]))
    : sourceFor(def.export);
}

/* ── Usage map (from the sibling site, or preserved) ────────────────────────────────────── */
async function readExistingUsage() {
  if (!fs.existsSync(outPath)) return {};
  try {
    const m = await import(`${pathToFileURL(outPath).href}?t=${Date.now()}`);
    return m.usage ?? {};
  } catch {
    return {};
  }
}

function pageRouteByBase() {
  const app = fs.readFileSync(path.join(siteSrc, 'App.tsx'), 'utf8');
  const importBase = {}; // imported component name -> file basename
  for (const m of app.matchAll(/import\s+(\w+)\s+from\s+['"]([^'"]+)['"]/g)) importBase[m[1]] = m[2].split('/').pop();
  const byBase = {};
  for (const m of app.matchAll(/<Route\s+path="([^"]+)"\s+element=\{<(\w+)/g)) {
    if (m[2] === 'Navigate') continue;
    byBase[importBase[m[2]] ?? m[2]] = m[1];
  }
  return byBase;
}

const TEMPLATE_ROUTES = {
  SolutionTemplate: { name: 'Solution pages', to: '/solutions/:slug' },
  MethodTemplate: { name: 'Method pages', to: '/methods/:slug' },
  ProductTemplate: { name: 'Product pages', to: '/products/:slug' },
};
const humanize = (s) => s.replace(/Page$/, '').replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, (c) => c.toUpperCase());

// For a dynamic `/<collection>/:slug` route, resolve a REAL example page by reading the first
// slug out of the matching content registry — so the chip links to an actual page, not `:slug`.
const COLLECTION_CONTENT = { solutions: 'solutions', methods: 'methods', products: 'products', blog: 'posts' };
function exampleLive(to) {
  const m = to.match(/^\/([^/]+)\/:slug$/);
  if (!m) return undefined;
  const file = COLLECTION_CONTENT[m[1]];
  if (!file) return undefined;
  const p = path.join(siteSrc, 'content', `${file}.ts`);
  if (!fs.existsSync(p)) return undefined;
  const slug = fs.readFileSync(p, 'utf8').match(/slug:\s*['"]([^'"]+)['"]/);
  return slug ? `/${m[1]}/${slug[1]}` : undefined;
}

function walk(dir) {
  let out = [];
  for (const e of fs.readdirSync(dir)) {
    const p = path.join(dir, e);
    if (fs.statSync(p).isDirectory()) out = out.concat(walk(p));
    else if (/\.tsx$/.test(e)) out.push(p);
  }
  return out;
}

function computeUsage() {
  const byBase = pageRouteByBase();
  const files = walk(siteSrc).filter((f) => f.includes('/pages/') || f.includes('/components/templates/'));
  const importsName = (src, n) => new RegExp(`import[^\\n]*\\b${n}\\b[^\\n]*from`).test(src) || new RegExp(`from ['"][^'"]*/${n}['"]`).test(src);
  const usesTag = (src, n) => new RegExp(`<${n}[\\s/>]`).test(src);
  const label = (file) => {
    const base = path.basename(file, '.tsx');
    const entry = TEMPLATE_ROUTES[base] ? { ...TEMPLATE_ROUTES[base] } : { name: humanize(base), to: byBase[base] ?? '' };
    const live = entry.to ? exampleLive(entry.to) : undefined;
    if (live) entry.live = live;
    return entry;
  };

  const matches = (src, tags) => tags.some((t) => usesTag(src, t) && importsName(src, t));
  const pushUnique = (arr, lbl) => { if (!arr.some((u) => u.name === lbl.name && u.to === lbl.to)) arr.push(lbl); };

  const usage = {};
  for (const [id, def] of Object.entries(BLOCKS)) usage[id] = def.variants ? Object.fromEntries(Object.keys(def.variants).map((k) => [k, []])) : [];
  for (const file of files) {
    const src = fs.readFileSync(file, 'utf8');
    const lbl = label(file);
    for (const [id, def] of Object.entries(BLOCKS)) {
      if (def.variants) {
        for (const [k, v] of Object.entries(def.variants)) if (matches(src, v.tags)) pushUnique(usage[id][k], lbl);
      } else if (matches(src, def.tags)) {
        pushUnique(usage[id], lbl);
      }
    }
  }
  const sortLbls = (a) => a.sort((x, y) => x.name.localeCompare(y.name));
  for (const u of Object.values(usage)) Array.isArray(u) ? sortLbls(u) : Object.values(u).forEach(sortLbls);
  return usage;
}

const hasSibling = fs.existsSync(siteSrc);
const usage = hasSibling ? computeUsage() : await readExistingUsage();
if (!hasSibling) console.log('gen-website-usage: ../sonaloop-website not found — preserving committed usage, refreshing source links');

const header = '/* GENERATED by scripts/gen-website-usage.mjs — `usage`: which marketing pages consume each\n'
  + '   block (scanned from ../sonaloop-website); `source`: where each component lives in this repo.\n'
  + '   Docs aid; not in the strict drift guard. */\n';
fs.writeFileSync(outPath, `${header}export const usage = ${JSON.stringify(usage, null, 2)};\n\nexport const source = ${JSON.stringify(source, null, 2)};\n`);
const total = Object.values(usage).reduce((s, a) => s + (Array.isArray(a) ? a.length : Object.values(a).reduce((n, arr) => n + arr.length, 0)), 0);
console.log('site/website.usage.mjs written (usage: %d entries, source: %d blocks)', total, Object.keys(source).length);
