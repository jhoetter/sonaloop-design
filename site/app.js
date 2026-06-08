/**
 * sonaloop-design — documentation site.
 *
 * A small dependency-free SPA (hash-routed) that documents the design system the way the
 * Geist (Vercel) site does: Foundations · Brands · Components, a ⌘K search palette, and a
 * light/dark toggle. Every swatch, icon and component shown is pulled LIVE from the single
 * sources of truth — tokens.data.mjs, icons.data.mjs and /styles/components.css — so the
 * docs can never drift from what ships. Served from the repo root by scripts/serve.py.
 */
import { inspector, scales, fonts } from '/tokens.data.mjs';
import { regular, hifi } from '/icons.data.mjs';
import { blocks as websiteBlocks } from '/site/website.previews.mjs';
import { usage as websiteUsage, source as websiteSource } from '/site/website.usage.mjs';

// Where the local marketing site runs (its `npm run dev`), so the "Used on" chips open the real page.
const WEBSITE_ORIGIN = 'http://localhost:3000';

/* ── tiny helpers ──────────────────────────────────────────────────────────────── */
const $ = (sel, root = document) => root.querySelector(sel);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const theme = () => document.documentElement.dataset.theme || 'light';

const svgReg = (name, cls = '') => {
  const spec = regular[name];
  if (!spec) return '';
  return `<svg class="pi pi-${name} ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${spec.body}</svg>`;
};
const svgHifi = (name, cls = '') => {
  const spec = hifi[name];
  if (!spec) return '';
  return `<svg class="pi-hifi pi-hifi-${name} ${cls}" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${spec.body}</svg>`;
};

let uid = 0;
const nextId = () => `dsx${++uid}`;

const clipboardSvg = (cls) => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>`;
const checkSvg = (cls) => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 13l4 4L19 7"/></svg>`;
// A .sl-copy button carries BOTH glyphs; `.is-copied` (toggled in the click handler) swaps them.
const copyIco = () => clipboardSvg('sl-copy__ico') + checkSvg('sl-copy__check');

/* ── shared content builders ───────────────────────────────────────────────────── */
function preview(inner, { center = false } = {}) {
  const id = nextId();
  return `
  <div class="ds-preview" data-preview="${id}">
    <div class="ds-preview-bar">
      <span class="ds-pv-label">Preview</span>
      <span class="ds-top-spacer"></span>
      <div class="ds-seg ds-seg--text" role="group" aria-label="Density">
        <button class="ds-seg-btn" data-density="app">App · dense</button>
        <button class="ds-seg-btn is-active" data-density="web">Web · airy</button>
      </div>
    </div>
    <div class="ds-preview-stage flavor-web ${center ? 'is-center' : ''}" data-stage>${inner}</div>
  </div>`;
}

function code(lang, src) {
  const id = nextId();
  return `
  <div class="ds-code">
    <div class="ds-code-head">
      <span class="ds-code-lang">${esc(lang)}</span>
      <button class="ds-copy" data-copy="${id}">
        ${clipboardSvg('ds-copy__ico')}${checkSvg('ds-copy__check')}
        <span>Copy</span>
      </button>
    </div>
    <pre><code id="${id}">${esc(src)}</code></pre>
  </div>`;
}

const table = (cols, rows) => `
  <table class="ds-table">
    <thead><tr>${cols.map((c) => `<th>${esc(c)}</th>`).join('')}</tr></thead>
    <tbody>${rows.map((r) => `<tr>${r.map((cell, i) => `<td>${i === 0 ? `<span class="mono">${esc(cell)}</span>` : cell}</td>`).join('')}</tr>`).join('')}</tbody>
  </table>`;

const h2 = (id, t) => `<h2 class="ds-h2" id="${id}">${esc(t)}</h2>`;
const p = (html) => `<p class="ds-p">${html}</p>`;

/* ── charts (live previews — mirror py/sonaloop_icons/charts.py + src/charts.tsx so the docs
   render from the same .sl-chart* contract) ──────────────────────────────────────────── */
const CHART_SERIES = ['var(--c1)', 'var(--c2)', 'var(--c3)', 'var(--c4)', 'var(--c5)', 'var(--c6)', 'var(--c7)'];
const chSeriesColor = (it, i) => it.color || CHART_SERIES[i % CHART_SERIES.length];
// escape + inline markdown (**bold**, *italic*/_italic_, `code`) for chart labels — matches charts.py _md
const chMd = (s) => esc(s)
  .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  .replace(/__(.+?)__/g, '<strong>$1</strong>')
  .replace(/(?<!\w)\*(.+?)\*(?!\w)/g, '<em>$1</em>')
  .replace(/(?<!\w)_(.+?)_(?!\w)/g, '<em>$1</em>')
  .replace(/`(.+?)`/g, '<code>$1</code>');
const chTitle = (t) => (t ? `<div class="sl-chart__title">${chMd(t)}</div>` : '');

function chartBar(items, { title = '' } = {}) {
  const mx = Math.max(...items.map((it) => it.value)) || 1;
  const bars = items.map((it, i) => `<div class="sl-bar"><span class="sl-bar__label">${chMd(it.label)}</span>`
    + `<span class="sl-bar__track"><span class="sl-bar__fill" style="--v:${Math.max(0, Math.min(100, (it.value / mx) * 100))}%;--c:${chSeriesColor(it, i)}"></span></span>`
    + `<span class="sl-bar__val">${it.value}</span></div>`).join('');
  return `<figure class="sl-chart">${chTitle(title)}<div class="sl-bars">${bars}</div></figure>`;
}

function chartPie(items, { title = '', donut = true } = {}) {
  const total = items.reduce((s, it) => s + it.value, 0) || 1;
  let acc = 0; const stops = [];
  const legend = items.map((it, i) => {
    const c = chSeriesColor(it, i); const start = (acc / total) * 100; acc += it.value;
    stops.push(`${c} ${start.toFixed(2)}% ${((acc / total) * 100).toFixed(2)}%`);
    return `<span class="sl-legend__item"><span class="sl-legend__sw" style="--c:${c}"></span>`
      + `<span class="sl-legend__label">${chMd(it.label)}</span>`
      + `<span class="sl-legend__val">${it.value} · ${Math.round((it.value / total) * 100)}%</span></span>`;
  }).join('');
  return `<figure class="sl-chart">${chTitle(title)}<div class="sl-pie-wrap">`
    + `<div class="sl-pie${donut ? ' sl-pie--donut' : ''}" style="--slices:conic-gradient(${stops.join(', ')})" role="img"></div>`
    + `<div class="sl-legend">${legend}</div></div></figure>`;
}

const chLeverage = (x, y) => { const d = y - x; return d >= 2 ? 'var(--sl-green)' : d >= 1 ? 'var(--sl-accent)' : d <= -1 ? 'var(--sl-red)' : 'var(--sl-amber)'; };
function chartEffort(items, { title = '', xLabel = 'Effort', yLabel = 'Value', quadrants = ['Quick wins', 'Big bets', 'Fill-ins', 'Time sinks'] } = {}) {
  const dots = items.map((it, i) => `<span class="sl-quad__dot" style="--x:${((it.x - 1) / 4) * 100}%;--y:${(1 - (it.y - 1) / 4) * 100}%;--c:${it.color || chLeverage(it.x, it.y)}">${i + 1}</span>`).join('');
  const legend = items.map((it, i) => `<span class="sl-legend__item"><span class="sl-legend__num" style="--c:${it.color || chLeverage(it.x, it.y)}">${i + 1}</span>`
    + `<span class="sl-legend__label">${chMd(it.label)}</span>`
    + `<span class="sl-legend__val">${xLabel[0]}${it.x}·${yLabel[0]}${it.y}</span></span>`).join('');
  const q = (i, cls) => `<span class="sl-quad__q sl-quad__q--${cls}">${esc(quadrants[i] || '')}</span>`;
  return `<figure class="sl-chart">${chTitle(title)}<div class="sl-quad-wrap"><div class="sl-quad-ylab">${esc(yLabel)}</div>`
    + `<div class="sl-quad"><div class="sl-quad__gx"></div><div class="sl-quad__gy"></div>${q(0, 'tl')}${q(1, 'tr')}${q(2, 'bl')}${q(3, 'br')}${dots}</div>`
    + `<div class="sl-quad-xlab">${esc(xLabel)}</div></div><div class="sl-legend" style="margin-top:.9em">${legend}</div></figure>`;
}

/* "Used on the website" — the consumer pages auto-detected from the sibling marketing site by
   scripts/gen-website-usage.mjs. Blocks rendered inside another block (no direct page import) get
   a short note instead of a list. */
const USAGE_FALLBACK = {
  'mega-menu': 'Rendered inside the <b>Navbar</b> (opens on hover) — not imported directly by pages.',
  'cta-band': 'Embedded in the <b>Footer</b> by default; also drop-in standalone mid-page.',
};
// Dynamic :slug routes have no real URL — open the parent collection page instead.
const liveHref = (to) => WEBSITE_ORIGIN + (to.replace(/\/:[^/]+$/, '') || '/');

function websiteConsumers(block) {
  const list = websiteUsage[block] || [];
  if (!list.length) {
    const note = USAGE_FALLBACK[block];
    return note ? `${h2(`${block}-used`, 'Used on the website')}${p(note)}` : '';
  }
  const chips = list.map((u) => u.to
    ? `<a class="ds-usechip" href="${esc(liveHref(u.to))}" target="_blank" rel="noopener">${esc(u.name)}<code>${esc(u.to)}</code></a>`
    : `<span class="ds-usechip">${esc(u.name)}</span>`).join('');
  return `${h2(`${block}-used`, 'Used on the website')}
    ${p(`Auto-detected from the marketing site — <b>${list.length}</b> ${list.length === 1 ? 'page composes' : 'pages compose'} this block. Each opens the live page on your local dev server (<code>${esc(WEBSITE_ORIGIN)}</code>):`)}
    <div class="ds-usechips">${chips}</div>`;
}

// "Source" link — detected (scripts/gen-website-usage.mjs reads src/website.tsx), never hardcoded.
function websiteSourceLink(block) {
  const s = websiteSource[block];
  if (!s) return '';
  return `<p class="ds-source"><span class="ds-source__ico">${svgReg('jtbd')}</span>`
    + `Source: <a href="${esc(s.href)}" target="_blank" rel="noopener"><code>${esc(s.file)}</code> › ${esc(s.export)}${s.line ? ` <span class="ds-source__line">L${s.line}</span>` : ''}</a></p>`;
}

/* Website-section page — a real shared component (sonaloop-design/website), shadcn-style. The
   preview is the ACTUAL component, server-rendered from src/website.tsx by
   scripts/gen-website-previews.mjs (so it can never drift / be a mockup), and the code shows the
   React import + usage. The full-bleed `markup` HTML is read from site/website.previews.mjs. */
function websitePage({ id, block, title, desc, usage, notes }) {
  const markup = websiteBlocks[block] || '';
  return `
    <p class="ds-eyebrow">Website</p>
    <h1 class="ds-h1">${esc(title)}</h1>
    <p class="ds-lead">${desc}</p>
    ${websiteSourceLink(block)}
    <div class="ds-preview ds-preview--web">
      <div class="ds-preview-bar">
        <span class="ds-pv-label">Preview</span>
        <span class="ds-top-spacer"></span>
        <span class="ds-pv-note">Live · real component · theme-aware</span>
      </div>
      <div class="ds-preview-stage ds-web-stage">${markup}</div>
    </div>
    ${h2(`${id}-usage`, 'Usage')}
    ${p(`A real, prop-driven React component — own-the-source, composed across the whole site (shadcn-style). Import it from <code>sonaloop-design/website</code>; load <code>sonaloop-design/components.css</code> + <code>sonaloop-design/website.css</code> once, and provide a router adapter via <code>SonaloopLinkProvider</code> for client-side links (it falls back to <code>&lt;a&gt;</code>).`)}
    ${code('tsx', usage)}
    ${websiteConsumers(block)}
    ${notes || ''}
  `;
}

function componentPage({ id, title, desc, demo, react, markup, python, variants, notes }) {
  return `
    <p class="ds-eyebrow">Component</p>
    <h1 class="ds-h1">${esc(title)}</h1>
    <p class="ds-lead">${desc}</p>
    ${preview(demo)}
    ${variants ? h2(`${id}-variants`, 'Variants') + table(variants.cols, variants.rows) : ''}
    ${h2(`${id}-usage`, 'Usage')}
    ${p(`The styling lives once in <code>styles/components.css</code> as <code>.sl-*</code> classes. The website uses the typed React wrapper; the Python-SSR inspector emits the same classes onto its own markup — identical rendering, no shared component code.`)}
    <h3 class="ds-h3">React · sonaloop-design/components</h3>
    ${code('tsx', react)}
    <h3 class="ds-h3">Markup · class contract (any stack)</h3>
    ${code('html', markup)}
    ${python ? `<h3 class="ds-h3">Python SSR · sonaloop inspector</h3>${code('python', python)}` : ''}
    ${notes || ''}
  `;
}

/* ── FOUNDATIONS ───────────────────────────────────────────────────────────────── */
function pageIntroduction() {
  const cell = (href, canvas, h, sub) => `
    <a class="ds-hero-cell" href="${href}">
      <div class="ds-hero-canvas">${canvas}</div>
      <h3>${h}</h3><p>${sub}</p>
    </a>`;

  const iconNames = ['overview', 'councils', 'syntheses', 'projects', 'personas', 'memory', 'analytics', 'target',
    'compass', 'bulb', 'search', 'pencil', 'star', 'check', 'plan', 'prototype'];
  const iconsCanvas = `<div class="ds-canvas-icons">${iconNames.map((n) => svgReg(n)).join('')}</div>`;
  const colorBars = ['ink', 'accent', 'blue', 'violet', 'red', 'amber', 'green', 'skep']
    .map((k) => `<i style="background:${inspector[theme()][k]}"></i>`).join('');
  const compCanvas = `<div style="display:flex;flex-direction:column;gap:10px;align-items:center">
      <div style="display:flex;gap:8px"><button class="sl-btn sl-btn--primary">Run council</button><button class="sl-btn">Export</button></div>
      <div style="display:flex;gap:6px"><span class="sl-badge sl-badge--positive">For 3</span><span class="sl-badge sl-badge--warning">Conditional</span><span class="sl-badge sl-badge--negative">Against</span></div>
    </div>`;
  const chartsCanvas = `<div class="sl-chart"><div class="sl-pie sl-pie--donut" style="width:78px;height:78px;--slices:conic-gradient(var(--c1) 0 55%,var(--c2) 55% 80%,var(--c3) 80% 100%)"></div></div>`;
  const webCanvas = `<div class="ds-canvas-web"><div class="wb">
      <div class="wb-bar">${svgReg('sonaloop')}<div class="wb-links"><i></i><i></i><i></i></div><span class="sl-btn sl-btn--primary wb-cta">Install</span></div>
      <div class="wb-body"><div class="wb-h" style="width:80%"></div><div class="wb-h" style="width:54%"></div>
        <div class="wb-actions"><span class="sl-btn sl-btn--primary">Get started</span><span class="sl-btn">Docs</span></div></div>
    </div></div>`;

  return `
    <h1 class="ds-h1">Sonaloop Design System</h1>
    <p class="ds-lead">The single source of truth for building consistent Sonaloop experiences — the React marketing site and the Python-SSR inspector, skinned from one set of tokens, icons and components.</p>
    <div class="ds-hero-grid">
      ${cell('#/brand', `<div class="ds-canvas-brand">${svgReg('sonaloop')}<span>Sonaloop</span></div>`, 'Brand Assets', 'How to work with the Sonaloop mark and wordmark.')}
      ${cell('#/icons', iconsCanvas, 'Icons', 'A stroke icon set tailored for research &amp; council tools.')}
      ${cell('#/button', compCanvas, 'Components', 'Building blocks shared across React and Python SSR.')}
      ${cell('#/colors', `<div class="ds-canvas-colors">${colorBars}</div>`, 'Colors', 'A near-white warm light + cool dark, accessible system.')}
      ${cell('#/layout', `<div class="ds-canvas-grid"></div>`, 'Layout', 'Spacing, radii and the grid that hold every surface together.')}
      ${cell('#/typography', `<div class="ds-canvas-type"><span>Sona</span><span class="mono">Sona Mono</span></div>`, 'Typeface', 'Sona, Sona Mono &amp; Sona Pixel — Sonaloop&#39;s own type.')}
      ${cell('#/chart-bar', chartsCanvas, 'Charts', 'Bar, pie/donut &amp; effort·impact — print &amp; PDF-safe.')}
      ${cell('#/web-navbar', webCanvas, 'Website', 'Marketing blocks — navbar, mega-menu, cards, hero &amp; footer.')}
    </div>
    <div class="ds-callout" style="margin-top:32px">
      <span class="ico">${svgReg('bulb')}</span>
      <p><b>One source, two consumers.</b> Author values once in <code>tokens.data.mjs</code> / <code>icons.data.mjs</code> / <code>components.css</code>, run <code>make gen</code>, and the website (Tailwind preset) and inspector (vendored Python) both update. A pre-commit drift guard keeps them honest.</p>
    </div>
  `;
}

const COLOR_GROUPS = [
  ['Surfaces', ['bg', 'sidebar', 'panel', 'panel-2', 'overlay', 'hover', 'sel'],
    'Backgrounds from page to elevated overlay. Near-white & warm in light, a cool ladder from #101113 in dark.'],
  ['Content', ['ink', 'muted', 'faint'],
    'Text colours. <code>ink</code> for primary, <code>muted</code> for secondary, <code>faint</code> for the quietest labels.'],
  ['Lines', ['line', 'line-2'],
    'Hairlines & dividers. Kept very quiet so structure reads without boxing everything in.'],
  ['Accent', ['accent', 'accent-weak', 'accent-ink'],
    'Indigo <code>#5e6ad2</code> — used sparingly for selection, focus and the single primary action.'],
  ['Semantic', ['green', 'amber', 'red', 'violet', 'blue', 'skep'],
    'Council verdicts & status: support (green), conditional (amber), opposition (red), shift (violet), info (blue), skeptical (skep).'],
];

function pageColors() {
  const t = inspector[theme()];
  const swatch = (k) => {
    const v = t[k];
    return `<button class="ds-swatch" data-copy-text="${esc(v)}" title="Click to copy ${esc(v)}">
      <div class="chip" style="background:${esc(v)}"></div>
      <div class="meta"><span class="name">--${k}</span><span class="val">${esc(v)}</span></div>
    </button>`;
  };
  const groups = COLOR_GROUPS.map(([name, keys, blurb]) => `
    ${h2(`color-${name.toLowerCase()}`, name)}
    ${p(blurb)}
    <div class="ds-swatches">${keys.map(swatch).join('')}</div>
  `).join('');

  return `
    <p class="ds-eyebrow">Foundations</p>
    <h1 class="ds-h1">Colors</h1>
    <p class="ds-lead">A high-contrast, accessible system: a near-white warm-neutral light palette and a cool <code>#101113</code> dark, with indigo as the one accent. Values are theme-aware — toggle the theme in the top bar to see both. Click any swatch to copy.</p>
    <div class="ds-callout"><span class="ico">${svgReg('bulb')}</span><p>Every value below is read live from <code>tokens.data.mjs</code> for the <b>${theme()}</b> theme. The website consumes them as RGB triplets (for Tailwind opacity), the inspector as hex — generated, never hand-copied.</p></div>
    ${groups}
  `;
}

/* A full glyph specimen for one family — uppercase, lowercase, figures, punctuation.
 * `fam` is any CSS font-family value (e.g. var(--sl-sans)); every cell copies its glyph. */
function specimen(label, fam) {
  const set = (chars) => chars.map((ch) =>
    `<button class="ds-glyph" data-copy-text="${esc(ch)}" title="Copy &quot;${esc(ch)}&quot;">${esc(ch)}</button>`).join('');
  const upper = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'];
  const lower = [...'abcdefghijklmnopqrstuvwxyz'];
  const digits = [...'0123456789'];
  const punct = [...'.,:;!?\'"·…—–-_(){}[]/\\&@#%*+=<>$€'];
  const row = (title, chars) => `
    <div class="ds-glyph-row">
      <div class="ds-glyph-label">${esc(title)}</div>
      <div class="ds-glyph-grid">${set(chars)}</div>
    </div>`;
  return `
    <div class="ds-specimen" style="font-family:${fam}">
      <div class="ds-specimen-head">
        <span class="ds-specimen-name">${esc(label)}</span>
        <span class="ds-specimen-aa">Aa</span>
      </div>
      ${row('Uppercase', upper)}
      ${row('Lowercase', lower)}
      ${row('Figures', digits)}
      ${row('Punctuation', punct)}
    </div>`;
}

function pageTypography() {
  const scaleRows = [
    ['t-xl', scales['t-xl'], 'Council verdict / page titles'],
    ['t-lg', scales['t-lg'], 'Section headings'],
    ['t-prose', scales['t-prose'], 'Long-form synthesis prose'],
    ['t-md', scales['t-md'], 'Emphasis & sub-headings'],
    ['t-body', scales['t-body'], 'Inspector body — the dense baseline'],
    ['t-sm', scales['t-sm'], 'Secondary metadata'],
    ['t-xs', scales['t-xs'], 'Mono eyebrows & tags'],
  ];
  const rows = scaleRows.map(([k, v, use]) => `
    <div class="ds-type-row">
      <div class="ds-type-meta">--${k} · ${v}<br><span style="opacity:.7">${esc(use)}</span></div>
      <div class="ds-type-sample" style="font-size:${v}">Memory-grounded councils</div>
    </div>`).join('');

  return `
    <p class="ds-eyebrow">Foundations</p>
    <h1 class="ds-h1">Typography</h1>
    <p class="ds-lead"><b>Sona</b> is Sonaloop's own typeface. Two cuts do all the work: <b>Sona</b> for everything readable and <b>Sona Mono</b> for eyebrows, tags, code and data. Both are self-hosted from this repo (<code>/fonts</code>) — no third-party dependency. <span style="color:var(--sl-muted)">Today Sona is built on <a href="https://vercel.com/font" target="_blank" rel="noopener">Geist</a> (SIL OFL-1.1); see the Sona roadmap in BRANDING.md for the path to a fully bespoke face.</span></p>

    ${h2('type-families', 'Families')}
    <div class="ds-grid-3">
      <div class="ds-tile" style="padding:28px">
        <div class="lbl">Sona · UI &amp; prose</div>
        <div style="font-size:40px;letter-spacing:-.03em;margin:10px 0 4px">Sona</div>
        <div style="font-size:14px;color:var(--sl-muted)">The quick brown fox jumps over 1,234 personas.</div>
        <div class="mono" style="font-family:var(--sl-mono);font-size:12px;color:var(--sl-faint);margin-top:10px">${esc(fonts.sans.join(', '))}</div>
      </div>
      <div class="ds-tile" style="padding:28px">
        <div class="lbl">Sona Mono · labels &amp; data</div>
        <div style="font-family:var(--sl-mono);font-size:40px;letter-spacing:-.02em;margin:10px 0 4px">Sona Mono</div>
        <div style="font-family:var(--sl-mono);font-size:14px;color:var(--sl-muted)">council_24105090 · 4 voices · ⌘K</div>
        <div class="mono" style="font-family:var(--sl-mono);font-size:12px;color:var(--sl-faint);margin-top:10px">${esc(fonts.mono.join(', '))}</div>
      </div>
      <div class="ds-tile" style="padding:28px">
        <div class="lbl">Sona Pixel · display only</div>
        <div style="font-family:var(--sl-pixel);font-size:40px;letter-spacing:.01em;margin:10px 0 4px">Sona</div>
        <div style="font-family:var(--sl-pixel);font-size:14px;color:var(--sl-muted)">LOADING · 24105090</div>
        <div class="mono" style="font-family:var(--sl-mono);font-size:12px;color:var(--sl-faint);margin-top:10px">${esc(fonts.pixel.join(', '))}</div>
      </div>
    </div>

    ${h2('type-specimen', 'Character set')}
    ${p('Every glyph in both cuts — uppercase, lowercase, figures and punctuation. Use it to check letterforms, spacing and the sans-vs-mono difference. Click any glyph to copy it.')}
    ${specimen('Sona', 'var(--sl-sans)')}
    ${specimen('Sona Mono', 'var(--sl-mono)')}

    ${h2('type-pixel', 'Sona Pixel · display')}
    ${p('A finely-gridded bitmap display face — Sona\'s letterforms rendered as pixels — for special technical moments (loaders, council ids, a "research instrument" flourish). <b>Never for body text.</b> Built on Geist Pixel (SIL OFL-1.1), renamed Geist → Sona, the same OFL-derived status as the text faces.')}
    ${p('Five fills share one design — pick per context. <code>--sl-pixel</code> / <code>font-pixel</code> defaults to <b>Line</b> (delicate outlined cells); each fill is also exposed by name.')}
    <div class="ds-pixel-grid">
      ${[
        ['Line', "'Sona Pixel Line'", 'Hollow outlined cells — delicate. ★ the default.'],
        ['Square', "'Sona Pixel Square'", 'Solid blocks — crisp, neutral.'],
        ['Circle', "'Sona Pixel Circle'", 'Round dots — soft, echoes the loop mark.'],
        ['Grid', "'Sona Pixel Grid'", 'Blocks with gaps — schematic, blueprint-y.'],
        ['Triangle', "'Sona Pixel Triangle'", 'Triangular pixels — most decorative.'],
      ].map(([name, fam, note]) => `
        <div class="ds-pixel-card">
          <div class="lbl">Sona Pixel · ${esc(name)}</div>
          <div class="ds-pixel-sample" style="font-family:${fam}">SONALOOP</div>
          <div class="ds-pixel-sub" style="font-family:${fam}">council_24105090<br>0123456789</div>
          <div class="ds-pixel-note">${note}</div>
        </div>`).join('')}
    </div>

    ${h2('type-scale', 'Type scale')}
    ${p('A compact scale tuned for an information-dense inspector that still breathes on the airy marketing site. Sizes are tokens, so a single edit re-tunes both.')}
    ${rows}

    ${h2('type-weights', 'Weights')}
    <div class="ds-weights">
      <div style="font-weight:400">Regular<small>400</small></div>
      <div style="font-weight:500">Medium<small>500</small></div>
      <div style="font-weight:600">Semibold<small>600</small></div>
      <div style="font-weight:700">Bold<small>700</small></div>
    </div>

    ${h2('type-eyebrow', 'Mono eyebrow')}
    ${p('The recurring uppercase mono label — section kickers, tags, metadata. It is its own component, <code>.sl-eyebrow</code>.')}
    ${preview('<span class="sl-eyebrow">Synthesis · executive summary</span>', { center: true })}
  `;
}

function pageMaterials() {
  const t = inspector[theme()];
  const surfaces = ['bg', 'sidebar', 'panel', 'panel-2', 'overlay'];
  const tiles = surfaces.map((k) => `
    <div class="ds-tile" style="background:${t[k]}">
      <div class="lbl">--${k}</div><div class="nm">${esc(t[k])}</div>
    </div>`).join('');

  const shadowTile = (k, label) => `
    <div class="ds-tile" style="box-shadow:${t[k]};border-color:transparent">
      <div class="lbl">--${k}</div><div class="nm">${label}</div>
    </div>`;

  const radii = [['radius-sm', scales['radius-sm']], ['radius', scales['radius']], ['pill', '999px']]
    .map(([k, v]) => `<div><div class="box" style="border-radius:${v === '999px' ? '999px' : v}"></div><small>--${k} · ${v}</small></div>`).join('');

  return `
    <p class="ds-eyebrow">Foundations</p>
    <h1 class="ds-h1">Materials</h1>
    <p class="ds-lead">Surfaces, elevation and the radii that give Sonaloop its quiet, layered feel. The top bar and search palette use a translucent, blurred material; everything else is a flat near-white (or cool-dark) ladder.</p>

    ${h2('mat-surfaces', 'Surface ladder')}
    ${p('From the page background up to an elevated overlay. The steps are deliberately small — depth comes from a hairline and a faint shadow, not heavy contrast.')}
    <div class="ds-tiles">${tiles}</div>

    ${h2('mat-elevation', 'Elevation')}
    ${p('Two shadow tokens carry all elevation: a barely-there <code>shadow-sm</code> for resting cards and a soft <code>shadow-lg</code> for popovers, menus and the command palette.')}
    <div class="ds-tiles">${shadowTile('shadow-sm', 'Resting card')}${shadowTile('shadow-lg', 'Overlay / popover')}</div>

    ${h2('mat-translucent', 'Translucent material')}
    ${p('The top bar and palette sit on a <code>backdrop-filter: blur()</code> over a colour-mix of the background — content scrolls softly beneath them. (Look at the bar above as you scroll.)')}

    ${h2('mat-radii', 'Radii')}
    <div class="ds-radii">${radii}</div>
  `;
}

function pageLayout() {
  const spaceKeys = ['s-1', 's-2', 's-3', 's-4', 's-5', 's-6', 's-8'];
  const max = parseInt(scales['s-8']);
  const bars = spaceKeys.map((k) => {
    const px = parseInt(scales[k]);
    return `<div><div class="bar" style="height:${20 + (px / max) * 90}px"></div><small>${k}<br>${px}px</small></div>`;
  }).join('');

  return `
    <p class="ds-eyebrow">Foundations</p>
    <h1 class="ds-h1">Layout</h1>
    <p class="ds-lead">A grid is a huge part of the Sonaloop aesthetic — thin hairlines, generous gutters and a consistent spacing scale keep dense council data legible without feeling boxed in.</p>

    ${h2('layout-grid', 'The grid')}
    ${p('Surfaces are built on a soft hairline grid. The inspector lays out a fixed sidebar + flexible content column; the marketing site centres a max-width prose column. Both pull their dividers from <code>--line</code>.')}
    <div class="ds-preview"><div class="ds-preview-stage is-center"><div class="ds-canvas-grid" style="width:340px;height:160px"></div></div></div>

    ${h2('layout-space', 'Spacing scale')}
    ${p('A 4px-based scale. Author with the tokens, never magic numbers, so rhythm stays consistent across both stacks.')}
    <div class="ds-space-row">${bars}</div>

    ${h2('layout-row', 'Row height')}
    ${p(`The inspector's list rows share one rhythm — <code>--row-h: ${scales['row-h']}</code> — so timelines, council lists and memory tables align to the same baseline.`)}
  `;
}

function pageIcons() {
  const cell = (name, body, hifiVariant) => `
    <button class="ds-icon-cell ${hifiVariant ? 'hifi' : ''}" data-icon="${esc(name)}" data-copy-text="${esc(name)}" title="Click to copy &quot;${esc(name)}&quot;">
      ${hifiVariant ? svgHifi(name, 'pi-animate') : svgReg(name, 'pi-animate')}<span>${esc(name)}</span>
    </button>`;
  const regGrid = Object.keys(regular).map((n) => cell(n, regular[n].body, false)).join('');
  const hifiGrid = Object.keys(hifi).map((n) => cell(n, hifi[n].body, true)).join('');

  return `
    <p class="ds-eyebrow">Foundations</p>
    <h1 class="ds-h1">Icons</h1>
    <p class="ds-lead">A stroke icon set tailored for research and council tools — ${Object.keys(regular).length} regular 24×24 glyphs plus ${Object.keys(hifi).length} hi-fi 48×48 display icons with subtle hover micro-interactions. Hover any icon to see it animate; click to copy its name.</p>
    <div class="ds-icon-search">
      <input class="sl-input" id="icon-filter" placeholder="Filter ${Object.keys(regular).length} icons…" autocomplete="off" />
    </div>

    ${h2('icons-regular', 'Regular · 24×24')}
    ${p('Stroke glyphs on <code>currentColor</code>, ~1.75 stroke. Used throughout chrome, lists and buttons.')}
    <div class="ds-icon-grid" data-icon-grid>${regGrid}</div>

    ${h2('icons-hifi', 'Hi-fi · 48×48')}
    ${p('Display icons with their own fill hierarchy and a one-gesture hover animation (opt-in, respects reduced-motion).')}
    <div class="ds-icon-grid" data-icon-grid>${hifiGrid}</div>

    ${h2('icons-usage', 'Usage')}
    ${code('tsx', `import { CouncilsIcon } from 'sonaloop-design';\n\n<CouncilsIcon className="h-5 w-5" animate />`)}
    ${code('python', `from sonaloop_icons import icon\n\nicon("councils", animate=True)  # → inline <svg class="pi pi-councils …">`)}
  `;
}

// Every canvas pair: light + dark file, shown live from the repo root (/images/<family>/<file>).
// These are the exact files products import via `sonaloop-design/images` (src/images.ts).
const IMAGE_PAIRS = [
  { name: 'canvas',   light: 'canvas/dawn.jpg',          dark: 'canvas/dusk.jpg',          label: 'Canvas', note: 'soft hills under a wide sky' },
  { name: 'abstract', light: 'canvas/abstract-light.jpg', dark: 'canvas/abstract-dark.jpg', label: 'Abstract', note: 'pure colour-field wash, no subject' },
  { name: 'mist',     light: 'canvas/mist-light.jpg',     dark: 'canvas/mist-dark.jpg',     label: 'Mist', note: 'fog over a still reflective plane' },
  { name: 'meadow',   light: 'canvas/meadow-light.jpg',   dark: 'canvas/meadow-dark.jpg',   label: 'Meadow', note: 'soft wildflower field under open sky' },
  { name: 'sky',      light: 'canvas/sky-light.jpg',      dark: 'canvas/sky-dark.jpg',      label: 'Sky', note: 'almost-empty atmospheric sky' },
];

function pageImages() {
  // Each tile shows ONE variant, defaulting to the current theme; the per-tile
  // toggle (or the global theme switch in the top bar) flips between light/dark.
  const cur = theme();
  const tile = (pr) => `
    <figure class="ds-image-tile" data-img-pair data-shown="${cur}">
      <div class="ds-image-frame">
        <img class="img-light" src="/images/${pr.light}" alt="${esc(pr.label)} — light" loading="lazy" />
        <img class="img-dark"  src="/images/${pr.dark}"  alt="${esc(pr.label)} — dark"  loading="lazy" />
      </div>
      <figcaption>
        <span class="nm">${esc(pr.label)} <span class="lbl">${esc(pr.note)}</span></span>
        <span class="ds-img-toggle" role="group" aria-label="Preview theme for ${esc(pr.label)}">
          <button type="button" data-img-theme="light" aria-label="Light" class="${cur === 'light' ? 'is-active' : ''}">${svgReg('sun')}</button>
          <button type="button" data-img-theme="dark" aria-label="Dark" class="${cur === 'dark' ? 'is-active' : ''}">${svgReg('moon')}</button>
        </span>
      </figcaption>
    </figure>`;

  return `
    <p class="ds-eyebrow">Foundations</p>
    <h1 class="ds-h1">Images</h1>
    <p class="ds-lead">A small, curated set of on-brand <strong>reference images</strong> — shared across the products so everyone reaches for the same canonical asset instead of carrying their own copy. These aren't the only images a product may use; they're the blessed variants to start from. Authored once, imported everywhere, just like the icons.</p>

    ${h2('images-canvas', 'Canvas')}
    ${p('Atmospheric, oil-painted backdrops that sit behind heroes, footers and product windows. Every canvas is a matched <strong>light / dark pair</strong> — the dark twin is generated from the light one, so they share a composition and only the palette flips. Toggle a tile (or flip the whole site in the top bar) to compare.')}
    <div class="ds-image-grid">
      ${IMAGE_PAIRS.map(tile).join('')}
    </div>

    ${h2('images-usage', 'Usage')}
    ${p('Each export is the bundler-resolved URL (content-hashed in production), drop-in for <code>&lt;img src&gt;</code> or a CSS <code>background</code>. Each pair exposes <code>.light</code> / <code>.dark</code>, so you pick the right one per theme.')}
    ${code('tsx', `import { canvas, mist } from 'sonaloop-design/images';\n\n<img src={canvas.light} alt="" className="dark:hidden" />\n<img src={canvas.dark}  alt="" className="hidden dark:block" />`)}

    ${h2('images-add', 'Adding & generating')}
    ${p('The canvases are <strong>generated</strong> here as light/dark pairs with OpenAI <code>gpt-image-1</code>: the light variant comes from a prompt, then the dark twin is generated <em>from the light image</em> (same composition, cool night palette). Copy <code>.env.example</code> → <code>.env</code>, add your <code>OPENAI_API_KEY</code>, then:')}
    ${code('bash', `npm run generate-canvas -- mist        # one pair (light, then dark from it)\nnpm run generate-canvas -- --all       # every pair`)}
    ${p('To add a pair, add a key to the <code>PAIRS</code> map in <code>scripts/generate-canvas.mjs</code>, run it, then register the two files in <code>src/images.ts</code> so every repo can import it.')}
  `;
}

/* ── BRANDS ────────────────────────────────────────────────────────────────────── */
function pageBrand() {
  return `
    <p class="ds-eyebrow">Brands</p>
    <h1 class="ds-h1">Sonaloop</h1>
    <p class="ds-lead">The Sonaloop mark is a single continuous loop with three nodes — the feedback loop between personas, councils and synthesis. Pair it with the wordmark set in Geist Sans.</p>

    ${h2('brand-lockup', 'Primary lockup')}
    <div class="ds-brand-hero">${svgReg('sonaloop')}<span class="wm">Sonaloop</span></div>

    ${h2('brand-contrast', 'On light & dark')}
    ${p('The mark is monochrome <code>currentColor</code> — it inverts cleanly. Keep it ink on light surfaces and near-white on dark; avoid placing it on busy imagery or the accent indigo.')}
    <div class="ds-brand-clear">
      <div class="ds-brand-panel">${svgReg('sonaloop')}<span class="wm" style="margin-left:14px">Sonaloop</span></div>
      <div class="ds-brand-panel on-dark">${svgReg('sonaloop')}<span class="wm" style="margin-left:14px">Sonaloop</span></div>
    </div>

    ${h2('brand-family', 'Product family')}
    ${p('Two siblings extend the base mark with a quiet badge — keep the relationship legible, never restyle the core loop.')}
    <div class="ds-brand-clear" style="grid-template-columns:1fr 1fr">
      <div class="ds-brand-panel" style="flex-direction:column;gap:14px">${svgHifi('sonaloop-cloud')}<span class="mono" style="font-family:var(--sl-mono);font-size:12px;color:var(--sl-faint)">Sonaloop Cloud</span></div>
      <div class="ds-brand-panel" style="flex-direction:column;gap:14px">${svgHifi('sonaloop-research')}<span class="mono" style="font-family:var(--sl-mono);font-size:12px;color:var(--sl-faint)">Sonaloop Research</span></div>
    </div>

    ${h2('brand-dont', 'Clear space & misuse')}
    <ul class="ds-ul">
      <li class="ds-li">Keep clear space around the lockup equal to the height of the mark.</li>
      <li class="ds-li">Don't recolour the mark, add gradients, or set it on the indigo accent.</li>
      <li class="ds-li">Don't stretch, rotate or outline the wordmark — Geist Sans, tracking <code>-0.04em</code>.</li>
    </ul>
  `;
}

function pageProduct(name, iconName, blurb) {
  return `
    <p class="ds-eyebrow">Brands</p>
    <h1 class="ds-h1">${esc(name)}</h1>
    <p class="ds-lead">${blurb}</p>
    <div class="ds-brand-hero">${svgHifi(iconName)}<span class="wm" style="font-size:34px">${esc(name)}</span></div>
    ${h2('pf-usage', 'Usage')}
    ${code('tsx', `import { ${iconName === 'sonaloop-cloud' ? 'SonaloopCloudIcon' : 'SonaloopResearchIcon'} } from 'sonaloop-design';`)}
  `;
}

/* ── COMPONENTS ────────────────────────────────────────────────────────────────── */
const cButton = () => componentPage({
  id: 'button', title: 'Button', desc: 'The one action primitive. A single ink-filled <code>primary</code> per view, neutral for secondary actions, indigo <code>accent</code> for the rare highlight, <code>ghost</code> for toolbars.',
  demo: `<button class="sl-btn sl-btn--primary">Run council</button>
    <button class="sl-btn">Export</button>
    <button class="sl-btn sl-btn--accent">New project</button>
    <button class="sl-btn sl-btn--ghost">Cancel</button>
    <button class="sl-btn sl-btn--sm">Small</button>
    <button class="sl-btn" disabled>Disabled</button>`,
  variants: {
    cols: ['Class', 'Variant', 'When to use'],
    rows: [
      ['.sl-btn', 'Default', 'Secondary actions — neutral surface + hairline.'],
      ['.sl-btn--primary', 'Primary', 'The single most important action; ink-filled.'],
      ['.sl-btn--accent', 'Accent', 'A rare highlight (e.g. “New”); indigo-filled.'],
      ['.sl-btn--ghost', 'Ghost', 'Dense toolbars; no border until hover.'],
      ['.sl-btn--sm / --lg', 'Size', 'Compact rows / marketing CTAs.'],
      ['.is-active', 'State', 'Selected/toggled (segmented controls, tabs).'],
      ['[disabled]', 'State', 'Non-interactive; muted, no hover.'],
    ],
  },
  react: `import { Button } from 'sonaloop-design/components';\n\n<Button variant="primary">Run council</Button>\n<Button>Export</Button>\n<Button variant="accent">New project</Button>\n<Button variant="ghost" size="sm">Cancel</Button>`,
  markup: `<button class="sl-btn sl-btn--primary">Run council</button>\n<button class="sl-btn">Export</button>`,
  python: `h("button", {"class_": "sl-btn sl-btn--primary"}, "Run council")`,
});

const cBadge = () => componentPage({
  id: 'badge', title: 'Badge', desc: 'A small filled status pill. The semantic tones map directly to council verdicts so support, conditional and opposition counts scan at a glance.',
  demo: `<span class="sl-badge">Neutral</span>
    <span class="sl-badge sl-badge--accent">Accent</span>
    <span class="sl-badge sl-badge--positive">For 3</span>
    <span class="sl-badge sl-badge--warning">Conditional 2</span>
    <span class="sl-badge sl-badge--negative">Against 1</span>`,
  variants: {
    cols: ['Class', 'Tone', 'Meaning'],
    rows: [
      ['.sl-badge', 'Neutral', 'Counts, generic metadata.'],
      ['.sl-badge--accent', 'Accent', 'Indigo highlight.'],
      ['.sl-badge--positive', 'Positive', 'Support / “For”.'],
      ['.sl-badge--warning', 'Warning', 'Conditional / caution.'],
      ['.sl-badge--negative', 'Negative', 'Opposition / “Against”.'],
    ],
  },
  react: `import { Badge } from 'sonaloop-design/components';\n\n<Badge tone="positive">For 3</Badge>\n<Badge tone="warning">Conditional 2</Badge>\n<Badge tone="negative">Against 1</Badge>`,
  markup: `<span class="sl-badge sl-badge--positive">For 3</span>`,
  python: `h("span", {"class_": "sl-badge sl-badge--positive"}, "For 3")`,
});

const cTag = () => componentPage({
  id: 'tag', title: 'Tag', desc: 'A bordered, uppercase mono label — distinct from the filled Badge. Used for verdict tags (objection, misread, stance-shift), plan tiers and blog categories.',
  demo: `<span class="sl-tag">Conditional</span>
    <span class="sl-tag sl-tag--neutral">Misread</span>
    <span class="sl-tag sl-tag--warm">Objection</span>`,
  variants: {
    cols: ['Class', 'Tone', 'Reads as'],
    rows: [
      ['.sl-tag', 'Accent', 'A shift / notable move.'],
      ['.sl-tag--neutral', 'Neutral', 'Factual category.'],
      ['.sl-tag--warm', 'Warm', 'Pushback / risk.'],
    ],
  },
  react: `import { Tag } from 'sonaloop-design/components';\n\n<Tag>Conditional</Tag>\n<Tag tone="neutral">Misread</Tag>\n<Tag tone="warm">Objection</Tag>`,
  markup: `<span class="sl-tag sl-tag--warm">Objection</span>`,
  python: `h("span", {"class_": "sl-tag sl-tag--warm"}, "Objection")`,
});

const cPill = () => componentPage({
  id: 'pill', title: 'Pill', desc: 'A bordered, rounded label for inline facts — a council name, a voice count, a persona role.',
  demo: `<span class="sl-pill">Council</span>
    <span class="sl-pill">4 personas</span>
    <span class="sl-pill">2026-06-08</span>`,
  react: `import { Pill } from 'sonaloop-design/components';\n\n<Pill>4 personas</Pill>`,
  markup: `<span class="sl-pill">4 personas</span>`,
  python: `h("span", {"class_": "sl-pill"}, "4 personas")`,
});

const cChip = () => componentPage({
  id: 'chip', title: 'Chip', desc: 'A small bordered token with a leading accent dot — for themes, facets and filters.',
  demo: `<span class="sl-chip">Theme: Planning</span>
    <span class="sl-chip">Theme: Budget</span>
    <span class="sl-chip">Theme: Trust</span>`,
  react: `import { Chip } from 'sonaloop-design/components';\n\n<Chip>Theme: Planning</Chip>`,
  markup: `<span class="sl-chip">Theme: Planning</span>`,
  python: `h("span", {"class_": "sl-chip"}, "Theme: Planning")`,
});

const cCard = () => componentPage({
  id: 'card', title: 'Card', desc: 'A surface container with a hairline, soft shadow and title/body subparts — the default frame for synthesis sections, council summaries and settings groups.',
  demo: `<div class="sl-card" style="max-width:340px">
      <span class="sl-eyebrow">Synthesis</span>
      <h4 class="sl-card__title" style="margin-top:6px">Executive summary</h4>
      <p class="sl-card__body">A memory-grounded council reached a clear verdict — broadly supportive, no real opposition.</p>
      <hr class="sl-divider" />
      <div style="display:flex;gap:8px"><button class="sl-btn sl-btn--primary sl-btn--sm">Open</button><button class="sl-btn sl-btn--sm">Export</button></div>
    </div>`,
  variants: {
    cols: ['Class', 'Part', 'Role'],
    rows: [
      ['.sl-card', 'Container', 'Surface + hairline + soft shadow + padding.'],
      ['.sl-card__title', 'Title', 'Semibold heading.'],
      ['.sl-card__body', 'Body', 'Muted, relaxed line-height copy.'],
    ],
  },
  react: `import { Card, CardTitle, CardBody } from 'sonaloop-design/components';\n\n<Card>\n  <CardTitle>Executive summary</CardTitle>\n  <CardBody>A memory-grounded council reached a clear verdict.</CardBody>\n</Card>`,
  markup: `<div class="sl-card">\n  <h4 class="sl-card__title">Executive summary</h4>\n  <p class="sl-card__body">A memory-grounded council reached a clear verdict.</p>\n</div>`,
  python: `h("div", {"class_": "sl-card"},\n  h("h4", {"class_": "sl-card__title"}, "Executive summary"),\n  h("p", {"class_": "sl-card__body"}, "…"))`,
  notes: `<div class="ds-callout"><span class="ico">${svgReg('bulb')}</span><p>Page-level compositions (the website's DrawingFrame, the inspector's panels) are built <b>from</b> this primitive but stay local to each app — the design system shares the primitive, not the page.</p></div>`,
});

const cEyebrow = () => componentPage({
  id: 'eyebrow', title: 'Eyebrow', desc: 'The recurring uppercase mono kicker that labels a section or card — small, tracked, muted.',
  demo: `<div style="display:flex;flex-direction:column;gap:14px;align-items:flex-start">
      <span class="sl-eyebrow">Synthesis · executive summary</span>
      <span class="sl-eyebrow" style="color:var(--sl-accent)">Council · 4 voices</span>
    </div>`,
  react: `import { Eyebrow } from 'sonaloop-design/components';\n\n<Eyebrow as="p">Synthesis · executive summary</Eyebrow>`,
  markup: `<span class="sl-eyebrow">Synthesis · executive summary</span>`,
  python: `h("span", {"class_": "sl-eyebrow"}, "Synthesis")`,
});

const cInput = () => componentPage({
  id: 'input', title: 'Input', desc: 'A single-line text field with a quiet hairline that lifts to the indigo accent + focus ring on focus.',
  demo: `<input class="sl-input" placeholder="Search everything…" style="max-width:320px" />`,
  react: `import { Input } from 'sonaloop-design/components';\n\n<Input placeholder="Search everything…" />`,
  markup: `<input class="sl-input" placeholder="Search everything…" />`,
  python: `h("input", {"class_": "sl-input", "placeholder": "Search…"})`,
});

const cKbd = () => componentPage({
  id: 'kbd', title: 'Kbd', desc: 'A keyboard-key token for shortcuts — mono, bordered, on a faint surface.',
  demo: `<div style="display:flex;align-items:center;gap:8px">Jump to anything <span class="sl-kbd">⌘</span><span class="sl-kbd">K</span></div>`,
  react: `import { Kbd } from 'sonaloop-design/components';\n\nJump to anything <Kbd>⌘</Kbd> <Kbd>K</Kbd>`,
  markup: `<span class="sl-kbd">⌘</span> <span class="sl-kbd">K</span>`,
  python: `h("kbd", {"class_": "sl-kbd"}, "⌘")`,
});

const cDivider = () => componentPage({
  id: 'divider', title: 'Divider', desc: 'A hairline rule that separates groups within a surface — pulled from <code>--line</code> so it stays as quiet as every other border.',
  demo: `<div style="width:100%;max-width:360px"><p class="ds-p" style="margin:0">Above</p><hr class="sl-divider" /><p class="ds-p" style="margin:0">Below</p></div>`,
  react: `import { Divider } from 'sonaloop-design/components';\n\n<Divider />`,
  markup: `<hr class="sl-divider" />`,
  python: `h("hr", {"class_": "sl-divider"})`,
});

const cArrowLink = () => componentPage({
  id: 'arrow-link', title: 'Arrow Link', desc: 'A mono uppercase “more →” link whose gap widens on hover. CSS-only — apply the class to any anchor; it also reacts to a hovered Tailwind <code>group</code> ancestor.',
  demo: `<a href="#/components/button" class="sl-arrow-link">Read the docs <span>→</span></a>`,
  react: `// CSS-only class — no wrapper needed\n<Link to="/method" className="sl-arrow-link">\n  Read the method <ArrowGlyph />\n</Link>`,
  markup: `<a href="…" class="sl-arrow-link">Read the docs <svg>…→…</svg></a>`,
  python: `h("a", {"class_": "sl-arrow-link", "href": url}, "Open", arrow_svg)`,
});

const cStatusDot = () => componentPage({
  id: 'status-dot', title: 'Status Dot', desc: 'A small coloured presence/verdict dot. The tones match the semantic palette, so a council voice or a live indicator reads instantly.',
  demo: `<div style="display:flex;flex-direction:column;gap:10px;align-items:flex-start;font-size:.95em">
      <span style="display:inline-flex;align-items:center;gap:8px"><span class="sl-dot sl-dot--positive"></span> Supports</span>
      <span style="display:inline-flex;align-items:center;gap:8px"><span class="sl-dot sl-dot--warning"></span> Conditional</span>
      <span style="display:inline-flex;align-items:center;gap:8px"><span class="sl-dot sl-dot--negative"></span> Opposes</span>
      <span style="display:inline-flex;align-items:center;gap:8px"><span class="sl-dot sl-dot--shift"></span> Stance shift</span>
      <span style="display:inline-flex;align-items:center;gap:8px"><span class="sl-dot sl-dot--info"></span> Live</span>
    </div>`,
  variants: { cols: ['Class', 'Tone', 'Meaning'], rows: [
    ['.sl-dot', 'Neutral', 'Generic / muted.'],
    ['.sl-dot--positive', 'Positive', 'Support / online.'],
    ['.sl-dot--warning', 'Warning', 'Conditional.'],
    ['.sl-dot--negative', 'Negative', 'Opposition / error.'],
    ['.sl-dot--shift', 'Shift', 'Stance change.'],
    ['.sl-dot--info', 'Info', 'Informational / live.'],
  ] },
  react: `import { StatusDot } from 'sonaloop-design/components';\n\n<StatusDot tone="positive" /> Supports`,
  markup: `<span class="sl-dot sl-dot--positive"></span>`,
  python: `h("span", {"class_": "sl-dot sl-dot--positive"})`,
});

const cAvatar = () => componentPage({
  id: 'avatar', title: 'Avatar', desc: 'A persona avatar — a generated portrait when available, otherwise tinted initials. Group them to show a council at a glance.',
  demo: `<div style="display:flex;flex-direction:column;gap:18px;align-items:flex-start">
      <div style="display:flex;gap:10px;align-items:center">
        <span class="sl-avatar">LV</span>
        <span class="sl-avatar sl-avatar--blue">TB</span>
        <span class="sl-avatar sl-avatar--violet">MD</span>
        <span class="sl-avatar sl-avatar--green">SK</span>
        <span class="sl-avatar sl-avatar--amber sl-avatar--lg">AW</span>
      </div>
      <div class="sl-avatar-group">
        <span class="sl-avatar sl-avatar--sm">LV</span>
        <span class="sl-avatar sl-avatar--sm sl-avatar--blue">TB</span>
        <span class="sl-avatar sl-avatar--sm sl-avatar--violet">MD</span>
        <span class="sl-avatar sl-avatar--sm sl-avatar--green">SK</span>
      </div>
    </div>`,
  variants: { cols: ['Class', 'Purpose'], rows: [
    ['.sl-avatar', 'Round avatar — initials or an &lt;img&gt;.'],
    ['.sl-avatar--sm / --lg', 'Size.'],
    ['.sl-avatar--blue/violet/green/amber', 'Initials-background tone (persona accent).'],
    ['.sl-avatar-group', 'Overlapping stack (a council).'],
  ] },
  react: `import { Avatar, AvatarGroup } from 'sonaloop-design/components';\n\n<Avatar name="Lena Vogt" tone="blue" />\n<Avatar name="Tom Berger" src="/avatars/tom.png" />\n\n<AvatarGroup>\n  <Avatar name="Lena Vogt" size="sm" />\n  <Avatar name="Tom Berger" size="sm" tone="violet" />\n</AvatarGroup>`,
  markup: `<span class="sl-avatar sl-avatar--blue">LV</span>\n<span class="sl-avatar"><img src="/avatars/tom.png" alt="Tom Berger" /></span>`,
  python: `h("span", {"class_": "sl-avatar sl-avatar--blue"}, "LV")`,
});

const cSegmented = () => componentPage({
  id: 'segmented', title: 'Segmented · Tabs', desc: 'A compact control for switching between mutually-exclusive options — install clients on the site, theme & view switchers in the inspector. Horizontal by default; <code>--fill</code> stretches, <code>--stacked</code> puts the icon over the label.',
  demo: `<div style="display:flex;flex-direction:column;gap:18px;align-items:flex-start">
      <div class="sl-segmented" role="group" aria-label="Client">
        <button class="sl-segmented__item is-active">npm</button>
        <button class="sl-segmented__item">pnpm</button>
        <button class="sl-segmented__item">yarn</button>
      </div>
      <div class="sl-segmented sl-segmented--stacked" role="group" aria-label="View" style="width:240px">
        <button class="sl-segmented__item is-active">${svgReg('overview')}<span>Plan</span></button>
        <button class="sl-segmented__item">${svgReg('squareGrid')}<span>Graph</span></button>
        <button class="sl-segmented__item">${svgReg('analytics')}<span>Stats</span></button>
      </div>
    </div>`,
  variants: { cols: ['Class', 'Modifier'], rows: [
    ['.sl-segmented', 'The track.'],
    ['.sl-segmented__item', 'An option; add .is-active for the selected one.'],
    ['.sl-segmented--fill', 'Items stretch to fill the width.'],
    ['.sl-segmented--stacked', 'Icon over label (inspector switchers).'],
  ] },
  react: `import { Segmented } from 'sonaloop-design/components';\n\nconst [client, setClient] = useState('npm');\n\n<Segmented\n  value={client}\n  onChange={setClient}\n  options={[{ value: 'npm' }, { value: 'pnpm' }, { value: 'yarn' }]}\n/>`,
  markup: `<div class="sl-segmented" role="group">\n  <button class="sl-segmented__item is-active">npm</button>\n  <button class="sl-segmented__item">pnpm</button>\n</div>`,
  python: `h("div", {"class_": "sl-segmented sl-segmented--stacked", "role": "group"},\n  h("a", {"class_": "sl-segmented__item is-active", "href": plan_url}, plan_icon, h("span", {}, "Plan")),\n  h("a", {"class_": "sl-segmented__item", "href": graph_url}, graph_icon, h("span", {}, "Graph")))`,
});

const cThemeToggle = () => componentPage({
  id: 'theme-toggle', title: 'Theme Toggle',
  desc: 'The one canonical colour-scheme switch shared by every product — sun (light) · monitor (system, follow the OS) · moon (dark) — built on Segmented with the shared icon set so the glyphs never diverge across repos. Presentational only: each app owns its theme state and passes <code>value</code> + <code>onChange</code> (this docs site uses the very same control in the top bar).',
  demo: `<div class="sl-segmented" role="group" aria-label="Color scheme">
      <button class="sl-segmented__item" aria-label="Light theme">${svgReg('sun')}</button>
      <button class="sl-segmented__item is-active" aria-label="System theme">${svgReg('monitor')}</button>
      <button class="sl-segmented__item" aria-label="Dark theme">${svgReg('moon')}</button>
    </div>`,
  variants: { cols: ['Value', 'Glyph'], rows: [
    ['light', 'sun'], ['system', 'monitor — follows the OS setting'], ['dark', 'moon'],
  ] },
  react: `import { ThemeToggle } from 'sonaloop-design/components';\n\n// the app owns the state (context / store); ThemeToggle is presentational\n<ThemeToggle value={preference} onChange={setPreference} />`,
  markup: `<div class="sl-segmented" role="group" aria-label="Color scheme">\n  <button class="sl-segmented__item" aria-label="Light theme">…sun…</button>\n  <button class="sl-segmented__item is-active" aria-label="System theme">…monitor…</button>\n  <button class="sl-segmented__item" aria-label="Dark theme">…moon…</button>\n</div>`,
  python: `# same classes + same icons (sun / monitor / moon)\nthemes = [("light","sun",t("theme_light")), ("system","monitor",t("theme_system")), ("dark","moon",t("theme_dark"))]\nh("div", {"class_": "sl-segmented sl-segmented--stacked"},\n  [h("button", {"class_": "sl-segmented__item", "data-theme-set": v}, raw(_icon(ic)), h("span", {}, lbl)) for v, ic, lbl in themes])`,
});

const cSnippet = () => componentPage({
  id: 'snippet', title: 'Snippet · Code', desc: 'A one-line command bar and a multi-line code block, both with a copy button. Used for the install command on the site and code samples everywhere (including these docs).',
  demo: `<div style="display:flex;flex-direction:column;gap:16px;width:100%;max-width:440px">
      <div class="sl-snippet sl-snippet--cmd"><code class="sl-snippet__code">npx sonaloop init</code><button class="sl-copy" data-copy-text="npx sonaloop init" aria-label="Copy">${copyIco()}</button></div>
      <div class="sl-code">
        <div class="sl-code__head"><span class="sl-code__lang">tsx</span><button class="sl-copy" data-copy-text="import { Button } from 'sonaloop-design/components';" aria-label="Copy">${copyIco()}</button></div>
        <pre><code>import { Button } from 'sonaloop-design/components';</code></pre>
      </div>
    </div>`,
  react: `import { Snippet, CodeBlock } from 'sonaloop-design/components';\n\n<Snippet code="npx sonaloop init" />\n<CodeBlock lang="tsx" code={"import { Button } from 'sonaloop-design/components';"} />`,
  markup: `<div class="sl-snippet sl-snippet--cmd">\n  <code class="sl-snippet__code">npx sonaloop init</code>\n  <button class="sl-copy">…</button>\n</div>`,
  python: `# the inspector copies share .sl-copy / .sl-snippet too`,
});

const cNote = () => componentPage({
  id: 'note', title: 'Note · Callout', desc: 'An accent-tinted info block to flag a constraint, a result or a caution. Tones reuse the semantic palette.',
  demo: `<div style="display:flex;flex-direction:column;gap:12px;width:100%;max-width:520px">
      <div class="sl-note"><span class="sl-note__icon">${svgReg('bulb')}</span><p class="sl-note__body"><b>One source, two consumers.</b> Edit the token once and both surfaces update.</p></div>
      <div class="sl-note sl-note--positive"><span class="sl-note__icon">${svgReg('check')}</span><p class="sl-note__body">Council reached a clear verdict — broadly supportive.</p></div>
      <div class="sl-note sl-note--warning"><span class="sl-note__icon">${svgReg('warning')}</span><p class="sl-note__body">Two voices were conditional — note the open questions.</p></div>
    </div>`,
  variants: { cols: ['Class', 'Tone'], rows: [
    ['.sl-note', 'Accent (default).'], ['.sl-note--positive', 'Positive / result.'],
    ['.sl-note--warning', 'Caution.'], ['.sl-note--negative', 'Error / blocker.'],
  ] },
  react: `import { Note } from 'sonaloop-design/components';\nimport { BulbIcon } from 'sonaloop-design';\n\n<Note icon={<BulbIcon />}>\n  <b>One source, two consumers.</b> Edit once, both update.\n</Note>`,
  markup: `<div class="sl-note sl-note--positive">\n  <span class="sl-note__icon">…</span>\n  <p class="sl-note__body">Clear verdict.</p>\n</div>`,
  python: `h("div", {"class_": "sl-note"}, h("span", {"class_": "sl-note__icon"}, icon), h("p", {"class_": "sl-note__body"}, text))`,
});

const cEmptyState = () => componentPage({
  id: 'empty-state', title: 'Empty State', desc: 'A calm, centred card for “nothing here yet” and not-found views — a hi-fi product glyph, a title, a line of guidance and an optional action.',
  demo: `<div class="sl-empty">
      <div class="sl-empty__icon">${svgHifi('councils')}</div>
      <h2 class="sl-empty__title">No councils yet</h2>
      <p class="sl-empty__body">Run your first memory-grounded council to see verdicts and sentiment here.</p>
      <button class="sl-btn sl-btn--primary">Run a council</button>
    </div>`,
  react: `import { EmptyState } from 'sonaloop-design/components';\nimport { CouncilsHifi } from 'sonaloop-design';\n\n<EmptyState icon={<CouncilsHifi />} title="No councils yet">\n  Run your first council to see verdicts here.\n</EmptyState>`,
  markup: `<div class="sl-empty">\n  <div class="sl-empty__icon">…</div>\n  <h2 class="sl-empty__title">No councils yet</h2>\n  <p class="sl-empty__body">…</p>\n</div>`,
  python: `_empty_state("No councils yet", "Run your first council…", icon="councils")`,
});

const cBreadcrumb = () => componentPage({
  id: 'breadcrumb', title: 'Breadcrumb', desc: 'The compact ancestry trail in the inspector top bar — project → council → view. Truncates gracefully when space is tight.',
  demo: `<nav class="sl-breadcrumb" aria-label="Breadcrumb" style="font-size:1em">
      <a class="sl-breadcrumb__link" href="#/breadcrumb">Projects</a>
      <span class="sl-breadcrumb__sep"></span>
      <a class="sl-breadcrumb__link" href="#/breadcrumb">Gesünder essen</a>
      <span class="sl-breadcrumb__sep"></span>
      <span class="sl-breadcrumb__current">Evaluation</span>
    </nav>`,
  react: `import { Breadcrumb } from 'sonaloop-design/components';\n\n<Breadcrumb items={[\n  { label: 'Projects', href: '/projects' },\n  { label: 'Gesünder essen', href: '/projects/abc' },\n  { label: 'Evaluation' },\n]} />`,
  markup: `<nav class="sl-breadcrumb">\n  <a class="sl-breadcrumb__link" href="…">Projects</a>\n  <span class="sl-breadcrumb__sep"></span>  <!-- glyph from CSS -->\n  <span class="sl-breadcrumb__current">Evaluation</span>\n</nav>`,
  python: `h("nav", {"class_": "sl-breadcrumb"}, *crumbs)`,
});

const cTable = () => componentPage({
  id: 'table', title: 'Table', desc: 'A quiet hairline table for synthesis data and markdown tables. Hairline-only by default; <code>--bordered</code> boxes every cell.',
  demo: `<table class="sl-table" style="max-width:480px">
      <thead><tr><th>Persona</th><th>Verdict</th><th>Enthusiasm</th></tr></thead>
      <tbody>
        <tr><td>Lena Vogt</td><td>For</td><td>+72</td></tr>
        <tr><td>Tom Berger</td><td>Conditional</td><td>+18</td></tr>
        <tr><td>Mehmet Demir</td><td>For</td><td>+54</td></tr>
        <tr><td>Sabine Kraus</td><td>Conditional</td><td>+9</td></tr>
      </tbody>
    </table>`,
  variants: { cols: ['Class', 'Variant'], rows: [
    ['.sl-table', 'Hairline rows (default).'], ['.sl-table--bordered', 'Every cell boxed (markdown tables).'],
  ] },
  react: `import { Table } from 'sonaloop-design/components';\n\n<Table>\n  <thead>…</thead>\n  <tbody>…</tbody>\n</Table>`,
  markup: `<table class="sl-table">…</table>`,
  python: `'<table class="sl-table sl-table--bordered">…</table>'  # markdown renderer`,
});

const cProgress = () => componentPage({
  id: 'progress', title: 'Progress', desc: 'A thin progress bar for plan completion and any 0–100 ratio. The bar fills from <code>--sl-accent</code> over the quiet track.',
  demo: `<div style="display:flex;flex-direction:column;gap:16px;width:100%;max-width:360px">
      <div><div style="font-size:.8em;color:var(--sl-muted);margin-bottom:6px;font-family:var(--sl-mono)">Plan · 35%</div><div class="sl-progress"><div class="sl-progress__bar" style="width:35%"></div></div></div>
      <div><div style="font-size:.8em;color:var(--sl-muted);margin-bottom:6px;font-family:var(--sl-mono)">Plan · 72%</div><div class="sl-progress"><div class="sl-progress__bar" style="width:72%"></div></div></div>
      <div><div style="font-size:.8em;color:var(--sl-muted);margin-bottom:6px;font-family:var(--sl-mono)">Plan · 100%</div><div class="sl-progress"><div class="sl-progress__bar" style="width:100%"></div></div></div>
    </div>`,
  react: `import { Progress } from 'sonaloop-design/components';\n\n<Progress value={72} />`,
  markup: `<div class="sl-progress"><div class="sl-progress__bar" style="width:72%"></div></div>`,
  python: `h("div", {"class_": "sl-progress"}, h("div", {"class_": "sl-progress__bar", "style": f"width:{pct}%"}))`,
});

const cStat = () => componentPage({
  id: 'stat', title: 'Stat', desc: 'A metric chip — a big number and a label — and a strip of them for the top of a project or persona page.',
  demo: `<div class="sl-stats">
      <div class="sl-stat"><span class="sl-stat__value">2</span><span class="sl-stat__label">councils</span></div>
      <div class="sl-stat"><span class="sl-stat__value">4</span><span class="sl-stat__label">personas</span></div>
      <div class="sl-stat"><span class="sl-stat__value">4</span><span class="sl-stat__label">syntheses</span></div>
      <div class="sl-stat"><span class="sl-stat__value">+38</span><span class="sl-stat__label">avg enthusiasm</span></div>
    </div>`,
  react: `import { Stat, Stats } from 'sonaloop-design/components';\n\n<Stats>\n  <Stat value={2} label="councils" />\n  <Stat value={4} label="personas" />\n</Stats>`,
  markup: `<div class="sl-stat"><span class="sl-stat__value">4</span><span class="sl-stat__label">personas</span></div>`,
  python: `h("div", {"class_": "sl-stat"}, h("span", {"class_": "sl-stat__value"}, n), h("span", {"class_": "sl-stat__label"}, label))`,
});

// The chart section is built from these CHART_TYPES (one page each) — keep this the single list of
// every chart type the design system ships, so the section can never silently miss one.
const chartFigureNote = (snippet) => `<div class="ds-callout" style="margin-top:24px"><span class="ico">${svgReg('bulb')}</span>
    <p>In the Sonaloop inspector a report section embeds this via the <code>chart</code> figure-kind: ${snippet} — the same component, vendored from this design system.</p></div>`;

const cChartBar = () => componentPage({
  id: 'chart-bar', title: 'Bar Chart',
  desc: 'Horizontal labelled bars for <b>rankings & counts</b> — “what helps most”, votes per option, evidence per theme. Each bar fills proportionally to the max (or an explicit <code>maxValue</code>); series colours come from position unless an item sets <code>--c</code>.',
  demo: `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:34px;width:100%;align-items:start">
      ${chartBar([{ label: 'Plan ahead', value: 8 }, { label: 'Batch cook', value: 5 }, { label: 'Order in', value: 3 }, { label: 'Skip it', value: 1 }], { title: 'What helps most' })}
      ${chartBar([{ label: 'Pricing', value: 9, color: 'var(--sl-violet)' }, { label: 'Onboarding', value: 6, color: 'var(--sl-violet)' }, { label: 'Support', value: 4, color: 'var(--sl-violet)' }], { title: 'Mentions per theme (one colour)' })}
    </div>`,
  variants: { cols: ['Prop', 'Type', 'Effect'], rows: [
    ['items', '{label, value, color?}[]', 'The bars. <code>color</code> overrides the positional series colour.'],
    ['title', 'string', 'Optional mono section title above the bars.'],
    ['maxValue', 'number', 'Fix the 100% reference (else the largest value).'],
  ] },
  react: `import { BarChart } from 'sonaloop-design/charts';\n\n<BarChart\n  title="What helps most"\n  items={[{ label: 'Plan ahead', value: 8 }, { label: 'Batch cook', value: 5 }, { label: 'Skip it', value: 1 }]}\n/>`,
  markup: `<figure class="sl-chart">\n  <div class="sl-bars">\n    <div class="sl-bar">\n      <span class="sl-bar__label">Plan ahead</span>\n      <span class="sl-bar__track"><span class="sl-bar__fill" style="--v:100%;--c:var(--c1)"></span></span>\n      <span class="sl-bar__val">8</span>\n    </div>\n  </div>\n</figure>`,
  python: `from sonaloop_icons.charts import bar_chart\n\nbar_chart([{"label": "Plan ahead", "value": 8}, {"label": "Batch cook", "value": 5}], title="What helps most")`,
  notes: chartFigureNote('<code>{kind:"chart", of:"bar", series:[{label, value}]}</code>'),
});

const cChartPie = () => componentPage({
  id: 'chart-pie', title: 'Pie · Donut Chart',
  desc: 'A <b>proportions</b> chart — council stance split, segment distribution, sentiment — drawn with a CSS <code>conic-gradient</code> plus a value/percent legend. Defaults to a <b>donut</b>; pass <code>donut=false</code> for a full pie.',
  demo: `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:34px;width:100%;align-items:center">
      ${chartPie([{ label: 'Support', value: 12 }, { label: 'Conditional', value: 5 }, { label: 'Oppose', value: 3 }], { title: 'Council stance · donut' })}
      ${chartPie([{ label: '18–24', value: 7 }, { label: '25–34', value: 11 }, { label: '35–44', value: 6 }, { label: '45+', value: 3 }], { title: 'Segments · pie', donut: false })}
    </div>`,
  variants: { cols: ['Prop', 'Type', 'Effect'], rows: [
    ['items', '{label, value, color?}[]', 'The slices (values are summed for the proportions).'],
    ['donut', 'boolean = true', 'Donut (hole) vs full pie — adds <code>.sl-pie--donut</code>.'],
    ['title', 'string', 'Optional mono section title.'],
  ] },
  react: `import { PieChart } from 'sonaloop-design/charts';\n\n<PieChart title="Council stance" donut\n  items={[{ label: 'Support', value: 12 }, { label: 'Conditional', value: 5 }, { label: 'Oppose', value: 3 }]}\n/>`,
  markup: `<figure class="sl-chart">\n  <div class="sl-pie-wrap">\n    <div class="sl-pie sl-pie--donut"\n         style="--slices:conic-gradient(var(--c1) 0% 60%, var(--c2) 60% 85%, var(--c3) 85% 100%)"></div>\n    <div class="sl-legend">\n      <span class="sl-legend__item"><span class="sl-legend__sw" style="--c:var(--c1)"></span>\n        <span class="sl-legend__label">Support</span><span class="sl-legend__val">12 · 60%</span></span>\n    </div>\n  </div>\n</figure>`,
  python: `from sonaloop_icons.charts import pie_chart\n\npie_chart([{"label": "Support", "value": 12}, {"label": "Oppose", "value": 3}], donut=True)`,
  notes: chartFigureNote('<code>{kind:"chart", of:"pie", series:[{label, value}]}</code>'),
});

const cChartEffort = () => componentPage({
  id: 'chart-effort-impact', title: 'Effort · Impact Chart',
  desc: 'A <b>2×2 scatter</b> of recommendations — effort (x) against value (y), each on a 1–5 scale. Dots are numbered and auto-tinted by leverage (value − effort), with a numbered legend that stays readable in print. The quadrants read quick-wins / big-bets / fill-ins / time-sinks.',
  demo: `<div style="width:100%;max-width:560px;margin-inline:auto">${chartEffort([
      { label: 'Auto shopping list', x: 2, y: 5 }, { label: '3-recipe starter', x: 2, y: 4 },
      { label: 'In-app coach', x: 4, y: 2 }, { label: 'Full meal plan', x: 5, y: 3 },
    ], { title: 'Effort · impact' })}</div>`,
  variants: { cols: ['Prop', 'Type', 'Effect'], rows: [
    ['items', '{label, x, y, color?}[]', 'Points; <code>x</code> = effort, <code>y</code> = value (1–5).'],
    ['xLabel / yLabel', 'string', 'Axis names (default Effort / Value).'],
    ['quadrants', 'string[4]', 'TL, TR, BL, BR labels (default quick-wins…time-sinks).'],
  ] },
  react: `import { EffortImpactChart } from 'sonaloop-design/charts';\n\n<EffortImpactChart\n  items={[{ label: 'Auto shopping list', x: 2, y: 5 }, { label: 'Full meal plan', x: 5, y: 3 }]}\n/>`,
  markup: `<figure class="sl-chart">\n  <div class="sl-quad-wrap">\n    <div class="sl-quad-ylab">Value</div>\n    <div class="sl-quad">\n      <div class="sl-quad__gx"></div><div class="sl-quad__gy"></div>\n      <span class="sl-quad__dot" style="--x:25%;--y:0%;--c:var(--sl-green)">1</span>\n    </div>\n    <div class="sl-quad-xlab">Effort</div>\n  </div>\n</figure>`,
  python: `from sonaloop_icons.charts import effort_impact\n\neffort_impact([{"label": "Auto shopping list", "x": 2, "y": 5}])  # x=effort, y=value (1..5)`,
  notes: chartFigureNote('<code>{kind:"chart", of:"effort_impact", source_id:"&lt;synthesis&gt;"}</code> (its 2×2 of recommendations)'),
});

const cTextarea = () => componentPage({
  id: 'textarea', title: 'Textarea', desc: 'A multi-line text field — the brief, a prompt, a persona note. Same hairline + focus ring as Input; vertically resizable.',
  demo: `<textarea class="sl-textarea" rows="3" placeholder="Describe the decision the council should weigh in on…" style="max-width:420px">We're considering a weekly meal-prep subscription for busy parents.</textarea>`,
  react: `import { Textarea } from 'sonaloop-design/components';\n\n<Textarea rows={3} placeholder="Describe the decision…" />`,
  markup: `<textarea class="sl-textarea" rows="3" placeholder="Describe the decision…"></textarea>`,
  python: `h("textarea", {"class_": "sl-textarea", "rows": "3", "placeholder": "Describe the decision…"})`,
});

const cSelect = () => componentPage({
  id: 'select', title: 'Select', desc: 'A styled native <code>&lt;select&gt;</code> with a token-driven caret — picking a model, a council preset or a sort order. Native control, so it renders identically in React and Python-SSR and is accessible for free.',
  demo: `<span class="sl-select" style="max-width:260px">
      <select>
        <option>Balanced council (4 voices)</option>
        <option>Skeptics only</option>
        <option>Enthusiasts only</option>
        <option>Custom…</option>
      </select>
    </span>`,
  react: `import { Select } from 'sonaloop-design/components';\n\n<Select defaultValue="balanced">\n  <option value="balanced">Balanced council (4 voices)</option>\n  <option value="skeptics">Skeptics only</option>\n</Select>`,
  markup: `<span class="sl-select">\n  <select>\n    <option>Balanced council (4 voices)</option>\n    <option>Skeptics only</option>\n  </select>\n</span>  <!-- wrapper draws the caret -->`,
  python: `h("span", {"class_": "sl-select"},\n  h("select", {}, *[h("option", {}, name) for name in presets]))`,
});

const cCheckbox = () => componentPage({
  id: 'checkbox', title: 'Checkbox', desc: 'A label-wrapped native checkbox for multi-select choices — which voices to include, which memory sources to ground on. The box is appearance-reset so it tints to the accent when checked.',
  demo: `<div style="display:flex;flex-direction:column;gap:10px;align-items:flex-start">
      <label class="sl-check"><input type="checkbox" checked /><span>Ground on project memory</span></label>
      <label class="sl-check"><input type="checkbox" checked /><span>Include skeptic voices</span></label>
      <label class="sl-check"><input type="checkbox" /><span>Surface open questions only</span></label>
      <label class="sl-check"><input type="checkbox" disabled /><span>Enterprise sources (upgrade)</span></label>
    </div>`,
  react: `import { Checkbox } from 'sonaloop-design/components';\n\n<Checkbox label="Ground on project memory" defaultChecked />\n<Checkbox label="Include skeptic voices" />`,
  markup: `<label class="sl-check"><input type="checkbox" /><span>Ground on project memory</span></label>`,
  python: `h("label", {"class_": "sl-check"}, h("input", {"type": "checkbox"}), h("span", {}, "Ground on project memory"))`,
});

const cRadio = () => componentPage({
  id: 'radio', title: 'Radio', desc: 'A label-wrapped native radio for mutually-exclusive choices — one council size, one synthesis depth. Same <code>.sl-check</code> class as Checkbox; the <code>[type]</code> picks the round shape.',
  demo: `<div style="display:flex;flex-direction:column;gap:10px;align-items:flex-start">
      <label class="sl-check"><input type="radio" name="depth" checked /><span>Quick read — headline verdict</span></label>
      <label class="sl-check"><input type="radio" name="depth" /><span>Standard — verdict + themes</span></label>
      <label class="sl-check"><input type="radio" name="depth" /><span>Deep — full reasoning trace</span></label>
    </div>`,
  variants: { cols: ['Class', 'Shape'], rows: [
    ['.sl-check + input[type=checkbox]', 'Square box, checkmark when on.'],
    ['.sl-check + input[type=radio]', 'Round, filled dot when on.'],
  ] },
  react: `import { Radio } from 'sonaloop-design/components';\n\n<Radio name="depth" label="Quick read" defaultChecked />\n<Radio name="depth" label="Deep" />`,
  markup: `<label class="sl-check"><input type="radio" name="depth" /><span>Quick read</span></label>`,
  python: `h("label", {"class_": "sl-check"}, h("input", {"type": "radio", "name": "depth"}), h("span", {}, "Quick read"))`,
});

const cSwitch = () => componentPage({
  id: 'switch', title: 'Switch', desc: 'A toggle for on/off settings that take effect immediately — auto-run on save, share publicly, reduced motion. For deferred form choices prefer a Checkbox.',
  demo: `<div style="display:flex;flex-direction:column;gap:14px;align-items:flex-start">
      <label class="sl-switch"><input type="checkbox" class="sl-switch__input" checked /><span class="sl-switch__track"></span><span>Auto-run council on save</span></label>
      <label class="sl-switch"><input type="checkbox" class="sl-switch__input" /><span class="sl-switch__track"></span><span>Share synthesis with team</span></label>
      <label class="sl-switch"><input type="checkbox" class="sl-switch__input" disabled /><span class="sl-switch__track"></span><span>Continuous discovery (Research)</span></label>
    </div>`,
  react: `import { Switch } from 'sonaloop-design/components';\n\n<Switch label="Auto-run council on save" defaultChecked />`,
  markup: `<label class="sl-switch">\n  <input type="checkbox" class="sl-switch__input" />\n  <span class="sl-switch__track"></span>\n  <span>Auto-run council on save</span>\n</label>`,
  python: `h("label", {"class_": "sl-switch"},\n  h("input", {"type": "checkbox", "class_": "sl-switch__input"}),\n  h("span", {"class_": "sl-switch__track"}),\n  h("span", {}, "Auto-run council on save"))`,
});

const cField = () => componentPage({
  id: 'field', title: 'Field · Fieldset', desc: 'The composition layer that pairs a label + optional hint or error with any control (Input, Textarea, Select, Checkbox …). <code>.sl-fieldset</code> groups related fields under a legend.',
  demo: `<div style="display:flex;flex-direction:column;gap:18px;max-width:420px;width:100%">
      <div class="sl-field">
        <label class="sl-field__label" for="f-name">Council name<span class="sl-field__req">*</span></label>
        <input class="sl-input" id="f-name" value="Meal-prep subscription" />
        <span class="sl-field__hint">Shown in the breadcrumb and exports.</span>
      </div>
      <div class="sl-field sl-field--invalid">
        <label class="sl-field__label" for="f-voices">Voices</label>
        <span class="sl-select"><select id="f-voices"><option>Choose a preset…</option></select></span>
        <span class="sl-field__error">Pick at least two voices to run a council.</span>
      </div>
      <fieldset class="sl-fieldset">
        <legend class="sl-fieldset__legend">Grounding</legend>
        <label class="sl-check"><input type="checkbox" checked /><span>Project memory</span></label>
        <label class="sl-check"><input type="checkbox" /><span>Uploaded research</span></label>
      </fieldset>
    </div>`,
  variants: { cols: ['Class', 'Part'], rows: [
    ['.sl-field', 'Vertical label + control + hint/error stack.'],
    ['.sl-field__label / __req', 'Label; <code>__req</code> is the red required mark.'],
    ['.sl-field__hint', 'Quiet helper text below the control.'],
    ['.sl-field__error + .sl-field--invalid', 'Error text; the modifier reddens the control border.'],
    ['.sl-fieldset / __legend', 'Bordered group of related fields under a legend.'],
  ] },
  react: `import { Field, Fieldset, Input, Select, Checkbox } from 'sonaloop-design/components';\n\n<Field label="Council name" required hint="Shown in exports." htmlFor="name">\n  <Input id="name" />\n</Field>\n<Field label="Voices" error="Pick at least two voices.">\n  <Select>…</Select>\n</Field>\n<Fieldset legend="Grounding">\n  <Checkbox label="Project memory" defaultChecked />\n</Fieldset>`,
  markup: `<div class="sl-field">\n  <label class="sl-field__label">Council name<span class="sl-field__req">*</span></label>\n  <input class="sl-input" />\n  <span class="sl-field__hint">Shown in exports.</span>\n</div>`,
  python: `h("div", {"class_": "sl-field"},\n  h("label", {"class_": "sl-field__label"}, "Council name"),\n  h("input", {"class_": "sl-input"}),\n  h("span", {"class_": "sl-field__hint"}, "Shown in exports."))`,
});

const cEntity = () => componentPage({
  id: 'entity', title: 'Entity', desc: 'A list row — a leading visual, a title + description, and trailing meta or actions. The shared primitive for councils, personas, projects and syntheses. Stack rows in <code>.sl-entity-list</code> for one hairline-framed list; add <code>--button</code> to make a row interactive.',
  demo: `<div class="sl-entity-list" style="max-width:440px">
      <div class="sl-entity sl-entity--button">
        <span class="sl-entity__visual">${svgReg('councils')}</span>
        <span class="sl-entity__content">
          <span class="sl-entity__title">Meal-prep subscription</span>
          <span class="sl-entity__desc">4 voices · broadly supportive · 2h ago</span>
        </span>
        <span class="sl-entity__trailing"><span class="sl-badge sl-badge--positive">For 3</span></span>
      </div>
      <div class="sl-entity sl-entity--button">
        <span class="sl-entity__visual">${svgReg('personas')}</span>
        <span class="sl-entity__content">
          <span class="sl-entity__title">Lena Vogt</span>
          <span class="sl-entity__desc">Busy parent · time-poor, value-driven</span>
        </span>
        <span class="sl-entity__trailing">${svgReg('caretRight')}</span>
      </div>
      <div class="sl-entity sl-entity--button">
        <span class="sl-entity__visual">${svgReg('syntheses')}</span>
        <span class="sl-entity__content">
          <span class="sl-entity__title">Pricing tiers — executive summary</span>
          <span class="sl-entity__desc">Conditional · 2 open questions</span>
        </span>
        <span class="sl-entity__trailing"><span class="sl-tag">Conditional</span></span>
      </div>
    </div>`,
  variants: { cols: ['Class', 'Part'], rows: [
    ['.sl-entity', 'One row: visual · content · trailing.'],
    ['.sl-entity--button', 'Interactive row (hover affordance).'],
    ['.sl-entity__visual', 'Leading icon or avatar.'],
    ['.sl-entity__title / __desc', 'Primary line; muted secondary line (both truncate).'],
    ['.sl-entity__trailing', 'Trailing badge, tag, count or chevron.'],
    ['.sl-entity-list', 'Stacks rows under one hairline frame.'],
  ] },
  react: `import { Entity, EntityList } from 'sonaloop-design/components';\nimport { CouncilsIcon, Badge } from 'sonaloop-design';\n\n<EntityList>\n  <Entity button visual={<CouncilsIcon />}\n    title="Meal-prep subscription"\n    desc="4 voices · broadly supportive · 2h ago"\n    trailing={<Badge tone="positive">For 3</Badge>} />\n</EntityList>`,
  markup: `<div class="sl-entity sl-entity--button">\n  <span class="sl-entity__visual">…</span>\n  <span class="sl-entity__content">\n    <span class="sl-entity__title">Meal-prep subscription</span>\n    <span class="sl-entity__desc">4 voices · 2h ago</span>\n  </span>\n  <span class="sl-entity__trailing">…</span>\n</div>`,
  python: `h("div", {"class_": "sl-entity sl-entity--button"},\n  h("span", {"class_": "sl-entity__visual"}, icon("councils")),\n  h("span", {"class_": "sl-entity__content"},\n    h("span", {"class_": "sl-entity__title"}, name),\n    h("span", {"class_": "sl-entity__desc"}, meta)),\n  h("span", {"class_": "sl-entity__trailing"}, badge))`,
});

/* ── nav model ─────────────────────────────────────────────────────────────────── */
const NAV = [
  { label: 'Foundations', items: [
    { id: 'introduction', title: 'Introduction', ico: 'overview', render: pageIntroduction },
    { id: 'colors', title: 'Colors', ico: 'half', render: pageColors },
    { id: 'typography', title: 'Typography', ico: 'pencil', render: pageTypography },
    { id: 'materials', title: 'Materials', ico: 'panel', render: pageMaterials },
    { id: 'layout', title: 'Layout', ico: 'squareGrid', render: pageLayout },
    { id: 'icons', title: 'Icons', ico: 'star', render: pageIcons },
    { id: 'images', title: 'Images', ico: 'panel', render: pageImages },
  ] },
  { label: 'Brands', items: [
    { id: 'brand', title: 'Sonaloop', ico: 'sonaloop', render: pageBrand },
    { id: 'cloud', title: 'Sonaloop Cloud', ico: 'sonaloop-cloud', render: () => pageProduct('Sonaloop Cloud', 'sonaloop-cloud', 'The hosted Sonaloop — councils, syntheses and memory, running for your team.') },
    { id: 'research', title: 'Sonaloop Research', ico: 'sonaloop-research', render: () => pageProduct('Sonaloop Research', 'sonaloop-research', 'The deep design-research surface — continuous discovery, frontier tracking and meta-reports.') },
  ] },
  { label: 'Components', items: [
    { id: 'button', title: 'Button', ico: 'caretRight', render: cButton },
    { id: 'badge', title: 'Badge', ico: 'dot', render: cBadge },
    { id: 'tag', title: 'Tag', ico: 'tag', render: cTag },
    { id: 'pill', title: 'Pill', ico: 'circle', render: cPill },
    { id: 'chip', title: 'Chip', ico: 'diamond', render: cChip },
    { id: 'status-dot', title: 'Status Dot', ico: 'dot', render: cStatusDot },
    { id: 'avatar', title: 'Avatar', ico: 'contact', render: cAvatar },
    { id: 'card', title: 'Card', ico: 'rectangle', render: cCard },
    { id: 'entity', title: 'Entity', ico: 'projects', render: cEntity },
    { id: 'note', title: 'Note', ico: 'bulb', render: cNote },
    { id: 'stat', title: 'Stat', ico: 'analytics', render: cStat },
    { id: 'progress', title: 'Progress', ico: 'wave', render: cProgress },
    { id: 'segmented', title: 'Segmented · Tabs', ico: 'squareCols', render: cSegmented },
    { id: 'theme-toggle', title: 'Theme Toggle', ico: 'monitor', render: cThemeToggle },
    { id: 'table', title: 'Table', ico: 'squareRows', render: cTable },
    { id: 'breadcrumb', title: 'Breadcrumb', ico: 'caretRight', render: cBreadcrumb },
    { id: 'empty-state', title: 'Empty State', ico: 'square', render: cEmptyState },
    { id: 'snippet', title: 'Snippet · Code', ico: 'jtbd', render: cSnippet },
    { id: 'eyebrow', title: 'Eyebrow', ico: 'wave', render: cEyebrow },
    { id: 'input', title: 'Input', ico: 'search', render: cInput },
    { id: 'textarea', title: 'Textarea', ico: 'pencil', render: cTextarea },
    { id: 'select', title: 'Select', ico: 'chevron', render: cSelect },
    { id: 'checkbox', title: 'Checkbox', ico: 'check', render: cCheckbox },
    { id: 'radio', title: 'Radio', ico: 'circle', render: cRadio },
    { id: 'switch', title: 'Switch', ico: 'exchange', render: cSwitch },
    { id: 'field', title: 'Field · Fieldset', ico: 'settings', render: cField },
    { id: 'kbd', title: 'Kbd', ico: 'squareSplit', render: cKbd },
    { id: 'divider', title: 'Divider', ico: 'exchange', render: cDivider },
    { id: 'arrow-link', title: 'Arrow Link', ico: 'arrowRight', render: cArrowLink },
  ] },
  { label: 'Charts', items: [
    { id: 'chart-bar', title: 'Bar', ico: 'analytics', render: cChartBar },
    { id: 'chart-pie', title: 'Pie · Donut', ico: 'half', render: cChartPie },
    { id: 'chart-effort-impact', title: 'Effort · Impact', ico: 'target', render: cChartEffort },
  ] },
  { label: 'Website', items: [
    { id: 'web-navbar', title: 'Navbar', ico: 'panel', render: () => websitePage({
      id: 'web-navbar', block: 'navbar', title: 'Navbar',
      desc: 'The marketing-site top bar: brand · mega-menu triggers · pricing · the primary Install action, with a hamburger below <code>lg</code>. Sticky and translucent, with hover-intent mega panels.',
      usage: `import { Navbar } from 'sonaloop-design/website';\nimport { megaMenus } from './content/nav';\nimport { useLocation } from 'react-router';\n\n<Navbar menus={megaMenus} currentPath={useLocation().pathname} transparent />` }) },
    { id: 'web-mega-menu', title: 'Mega Menu', ico: 'squareGrid', render: () => websitePage({
      id: 'web-mega-menu', block: 'mega-menu', title: 'Mega Menu',
      desc: 'The desktop hover panel rendered standalone: a two-column items grid (icon · label · description) beside a promo card. <code>Navbar</code> mounts this for you on hover; use it directly to compose custom menus.',
      usage: `import { MegaMenuPanel, type MegaMenu } from 'sonaloop-design/website';\n\nconst menu: MegaMenu = {\n  key: 'solutions', label: 'Solutions', to: '/solutions',\n  columns: [{ heading: 'By the job to be done', items: [\n    { to: '/solutions/discovery', label: 'Continuous discovery', description: '…', icon: 'continuous-discovery' },\n  ] }],\n  promo: { eyebrow: 'See it work', title: '…', body: '…', cta: { label: 'See a sample report', to: '/sample-report' } },\n};\n\n<MegaMenuPanel menu={menu} />` }) },
    { id: 'web-app-card', title: 'Cards · Grid', ico: 'rectangle', render: () => websitePage({
      id: 'web-app-card', block: 'app-card', title: 'Cards · Grid',
      desc: 'The <code>FeatureCard</code> atom (icon · title · body · arrow-link) in a responsive <code>CardGrid</code> — the product/method/solution grids that reflow 3 → 2 → 1 columns.',
      usage: `import { CardGrid, FeatureCard, Icon } from 'sonaloop-design/website';\n\n<CardGrid>\n  <FeatureCard icon={<Icon name=\"councils\" size={28} />} title=\"Councils\"\n    action={{ to: '/products/councils', label: 'Explore' }}>\n    Synthetic personas that debate a decision and disagree on the record.\n  </FeatureCard>\n  {/* … */}\n</CardGrid>` }) },
    { id: 'web-related-rail', title: 'Related Rail', ico: 'exchange', render: () => websitePage({
      id: 'web-related-rail', block: 'related-rail', title: 'Related Rail',
      desc: 'A 3-up rail of cross-link cards that stitches the IA together — the relations between solutions, methods and products, rendered from registry items.',
      usage: `import { RelatedRail } from 'sonaloop-design/website';\n\n<RelatedRail items={[\n  { to: '/solutions/discovery', label: 'Continuous discovery', description: '…', icon: 'continuous-discovery' },\n  { to: '/solutions/positioning', label: 'Positioning', description: '…', icon: 'positioning' },\n]} />` }) },
    { id: 'web-hero', title: 'Hero', ico: 'star', render: () => websitePage({
      id: 'web-hero', block: 'hero', title: 'Hero',
      desc: 'The page hero: a mono eyebrow, a balanced serif headline, a lead paragraph and a pair of <code>.sl-btn</code> CTAs, with an optional painterly canvas backdrop.',
      usage: `import { Hero } from 'sonaloop-design/website';\nimport { canvas } from 'sonaloop-design/images';\n\n<Hero kicker=\"Synthetic research\" canvas={canvas}\n  title=\"A focus group that disagrees with you — on the record.\"\n  cta={{ label: 'Install MCP — free', to: '/install' }}\n  secondary={{ label: 'See a sample report', to: '/sample-report' }}>\n  Spin up a deliberative synthetic panel on your own AI.\n</Hero>` }) },
    { id: 'web-cta-band', title: 'CTA Band', ico: 'target', render: () => websitePage({
      id: 'web-cta-band', block: 'cta-band', title: 'CTA Band',
      desc: 'A centred call-to-action band — rendered standalone mid-page, or as the top half of the footer. <code>DEFAULT_CTA</code> ships the install ⇄ sample-report copy.',
      usage: `import { CtaBand, DEFAULT_CTA } from 'sonaloop-design/website';\n\n<CtaBand {...DEFAULT_CTA} />\n\n// or fully custom:\n<CtaBand eyebrow=\"Bring your own AI\" title=\"Run a council that pushes back.\"\n  primary={{ label: 'Install MCP — free', to: '/install' }}\n  secondary={{ label: 'See a sample report', to: '/sample-report' }} />` }) },
    { id: 'web-footer', title: 'Footer', ico: 'squareRows', render: () => websitePage({
      id: 'web-footer', block: 'footer', title: 'Footer',
      desc: 'The site footer: a brand block with positioning copy and tags, the column nav, and a bottom bar. Embeds the CTA Band by default (pass <code>cta={false}</code> to omit, or your own theme toggle).',
      usage: `import { Footer } from 'sonaloop-design/website';\nimport { footerColumns } from './content/nav';\nimport { useTheme } from './contexts/ThemeContext';\n\nconst { preference, setPreference } = useTheme();\n<Footer columns={footerColumns}\n  themeControl={{ value: preference, onChange: setPreference }} />` }) },
    { id: 'web-product-showcase', title: 'Product Showcase', ico: 'panel', render: () => websitePage({
      id: 'web-product-showcase', block: 'product-showcase', title: 'Product Showcase',
      desc: 'A split feature showcase: readable copy on a calm panel beside your product screenshot, framed in a painterly canvas matte. Frame it as the <em>deliverable</em>, not “our UI”. (Preview uses a brand canvas as a stand-in screenshot.)',
      usage: `import { ProductShot } from 'sonaloop-design/website';\n\n<ProductShot src=\"/shots/report.png\"  /* a -light twin is auto-derived */\n  eyebrow=\"The deliverable\" title=\"A report you can hand to the room.\"\n  body=\"Every objection grounded in a quote, every verdict on the record.\"\n  caption=\"Exports to PDF · Markdown\" />` }) },
    { id: 'web-canvas-showcase', title: 'Canvas Showcase', ico: 'square', render: () => websitePage({
      id: 'web-canvas-showcase', block: 'canvas-showcase', title: 'Canvas Showcase',
      desc: 'A screenshot in a browser-framed window rising out of a painterly canvas — the Cursor-style hero shot. Theme-aware: light canvas + light capture in light mode, dark in dark.',
      usage: `import { CanvasShowcase } from 'sonaloop-design/website';\nimport { canvas } from 'sonaloop-design/images';\n\n<CanvasShowcase canvasLight={canvas.light} canvasDark={canvas.dark}\n  shotLight=\"/shots/app-light.png\" shotDark=\"/shots/app-dark.png\" />` }) },
    { id: 'web-integration-showcase', title: 'Integration Showcase', ico: 'jtbd', render: () => websitePage({
      id: 'web-integration-showcase', block: 'integration-showcase', title: 'Integration Showcase',
      desc: 'A believable agent terminal floating on a painterly canvas — the “bring your own AI” moment, with a copyable MCP command and a live-looking council session.',
      usage: `import { IntegrationShowcase } from 'sonaloop-design/website';\n\n<IntegrationShowcase />\n// optional: <IntegrationShowcase command=\"claude mcp add …\" canvas={mist} />` }) },
  ] },
];

const FLAT = NAV.flatMap((g) => g.items);
const byId = (id) => FLAT.find((i) => i.id === id);

/* ── sidebar ──────────────────────────────────────────────────────────────────── */
// Accordion nav: only the section you're currently in is open. Every group renders
// collapsed; renderPage opens the active one (and collapses the rest) on each navigation.
function renderSidebar() {
  $('#sidebar').innerHTML = NAV.map((g) => `
    <section class="ds-nav-group is-collapsed" data-group="${esc(g.label)}">
      <button type="button" class="ds-nav-label" data-nav-toggle="${esc(g.label)}" aria-expanded="false">
        <span>${esc(g.label)}</span>
        ${svgReg('chevron', 'ds-nav-chevron')}
      </button>
      <div class="ds-nav-items">
        <div class="ds-nav-items-inner">
          ${g.items.map((it) => `
          <a class="ds-nav-item" href="#/${it.id}" data-nav="${it.id}">${esc(it.title)}</a>`).join('')}
        </div>
      </div>
    </section>`).join('');
}

function setGroupCollapsed(sec, collapsed) {
  sec.classList.toggle('is-collapsed', collapsed);
  sec.querySelector('.ds-nav-label')?.setAttribute('aria-expanded', String(!collapsed));
}

// Clicking a section header toggles just that group (lets you peek without navigating).
function toggleNavGroup(label) {
  const sec = document.querySelector(`.ds-nav-group[data-group="${CSS.escape(label)}"]`);
  if (sec) setGroupCollapsed(sec, !sec.classList.contains('is-collapsed'));
}

// On navigation, open the active page's group and collapse every other — so leaving a
// section closes it again.
function syncActiveGroup(id) {
  const label = NAV.find((g) => g.items.some((it) => it.id === id))?.label;
  document.querySelectorAll('.ds-nav-group').forEach((sec) =>
    setGroupCollapsed(sec, sec.dataset.group !== label));
}

/* ── router ───────────────────────────────────────────────────────────────────── */
function currentId() {
  const h = location.hash.replace(/^#\/?/, '').replace(/^components\//, '');
  return byId(h) ? h : 'introduction';
}

function renderPage() {
  const id = currentId();
  const item = byId(id);
  const idx = FLAT.findIndex((i) => i.id === id);
  const next = FLAT[(idx + 1) % FLAT.length];

  const main = $('#main');
  main.innerHTML = `<article class="ds-page">${item.render()}</article>
    <div class="ds-footer">
      <span class="ds-foot-meta">Edit in <a href="https://github.com/jhoetter/sonaloop-design">sonaloop-design</a> · generated, never hand-copied</span>
      <a class="ds-next" href="#/${next.id}"><small>Next</small><b>${esc(next.title)}</b></a>
    </div>`;

  syncActiveGroup(id);
  document.querySelectorAll('.ds-nav-item').forEach((a) =>
    a.classList.toggle('is-active', a.dataset.nav === id));
  document.title = `${item.title} · Sonaloop Design`;
  main.scrollTo?.(0, 0);
  window.scrollTo(0, 0);
  wirePage(main);
}

/* ── per-page wiring (delegated where possible) ────────────────────────────────── */
function wirePage(root) {
  // icon filter
  const filter = root.querySelector('#icon-filter');
  if (filter) {
    filter.addEventListener('input', () => {
      const q = filter.value.trim().toLowerCase();
      root.querySelectorAll('.ds-icon-cell').forEach((c) => {
        c.style.display = !q || c.dataset.icon.toLowerCase().includes(q) ? '' : 'none';
      });
    });
  }
}

/* ── global delegated interactions (copy, density, swatch copy) ────────────────── */
// Copy + confirm: the clipboard glyph swaps to a green check (via `.is-copied`, styled in the
// shared CSS) and any text label reads "Copied" for ~1.6s — matching the React CopyButton.
async function copyText(text, btn) {
  try { await navigator.clipboard.writeText(text); } catch { /* ignore */ }
  if (!btn) return;
  btn.classList.add('is-copied');
  const label = btn.querySelector('span');
  if (label && btn._copyPrev == null) btn._copyPrev = label.textContent;
  if (label) label.textContent = 'Copied';
  clearTimeout(btn._copyT);
  btn._copyT = setTimeout(() => {
    btn.classList.remove('is-copied');
    if (label && btn._copyPrev != null) { label.textContent = btn._copyPrev; btn._copyPrev = null; }
  }, 1600);
}

document.addEventListener('click', (e) => {
  const navToggle = e.target.closest('[data-nav-toggle]');
  if (navToggle) { toggleNavGroup(navToggle.dataset.navToggle); return; }

  const copyBtn = e.target.closest('[data-copy]');
  if (copyBtn) {
    const codeEl = document.getElementById(copyBtn.dataset.copy);
    if (codeEl) copyText(codeEl.textContent, copyBtn);
    return;
  }
  // Icon-only copy buttons (snippets, code-block heads) confirm on the button itself.
  const slCopy = e.target.closest('.sl-copy[data-copy-text]');
  if (slCopy) { copyText(slCopy.dataset.copyText, slCopy); return; }
  // Other copy-on-click targets (swatches, glyphs, icon cells) get the quick outline flash.
  const swatch = e.target.closest('[data-copy-text]');
  if (swatch) { copyText(swatch.dataset.copyText); flash(swatch); return; }

  const seg = e.target.closest('.sl-segmented__item');
  if (seg && seg.closest('.ds-preview-stage')) {
    seg.parentElement.querySelectorAll('.sl-segmented__item').forEach((b) => b.classList.toggle('is-active', b === seg));
    return;
  }

  const dens = e.target.closest('[data-density]');
  if (dens) {
    const pv = dens.closest('.ds-preview');
    pv.querySelectorAll('[data-density]').forEach((b) => b.classList.toggle('is-active', b === dens));
    const stage = pv.querySelector('[data-stage]');
    stage.classList.toggle('flavor-app', dens.dataset.density === 'app');
    stage.classList.toggle('flavor-web', dens.dataset.density === 'web');
    return;
  }

  const imgTheme = e.target.closest('[data-img-theme]');
  if (imgTheme) {
    const tile = imgTheme.closest('[data-img-pair]');
    tile.dataset.shown = imgTheme.dataset.imgTheme;
    tile.querySelectorAll('[data-img-theme]').forEach((b) => b.classList.toggle('is-active', b === imgTheme));
    return;
  }

  // Click a canvas preview to open it large (the variant currently shown).
  const frameImg = e.target.closest('.ds-image-frame img');
  if (frameImg) {
    openLightbox(frameImg.currentSrc || frameImg.src, frameImg.alt);
    return;
  }
});

function flash(el) {
  el.style.transition = 'outline-color .1s';
  el.style.outline = '2px solid var(--sl-accent)';
  setTimeout(() => { el.style.outline = ''; }, 280);
}

/* ── image lightbox (click a canvas preview to view it large) ──────────────────── */
function lightboxEsc(e) { if (e.key === 'Escape') closeLightbox(); }

function openLightbox(src, alt) {
  let lb = document.getElementById('ds-lightbox');
  if (!lb) {
    lb = document.createElement('div');
    lb.id = 'ds-lightbox';
    lb.className = 'ds-lightbox';
    lb.innerHTML = '<button class="ds-lightbox-close" aria-label="Close (Esc)">✕</button><img alt="" />';
    document.body.appendChild(lb);
    lb.addEventListener('click', (e) => {
      if (e.target === lb || e.target.closest('.ds-lightbox-close')) closeLightbox();
    });
  }
  const img = lb.querySelector('img');
  img.src = src;
  img.alt = alt || '';
  lb.classList.add('is-open');
  document.addEventListener('keydown', lightboxEsc);
}

function closeLightbox() {
  const lb = document.getElementById('ds-lightbox');
  if (lb) lb.classList.remove('is-open');
  document.removeEventListener('keydown', lightboxEsc);
}

/* ── theme ────────────────────────────────────────────────────────────────────── */
// Preference is 'light' | 'dark' | 'system'; 'system' resolves live via the OS setting
// (mirrors sonaloop-website's ThemeContext). The applied `data-theme` is always concrete.
const themeQuery = matchMedia('(prefers-color-scheme: dark)');
let themePref = 'system';

const resolvedTheme = () =>
  themePref === 'system' ? (themeQuery.matches ? 'dark' : 'light') : themePref;

// Paint the resolved theme + active button state. `render` re-renders the page so
// theme-dependent values (colour hex, surface tiles, images) refresh.
function applyTheme(render = true) {
  document.documentElement.dataset.theme = resolvedTheme();
  document.querySelectorAll('[data-theme-set]').forEach((b) =>
    b.classList.toggle('is-active', b.dataset.themeSet === themePref));
  if (render) renderPage();
}

function setTheme(pref) {
  themePref = pref;
  try { localStorage.setItem('ds-theme', pref); } catch { /* ignore */ }
  applyTheme();
}

/* ── search palette ───────────────────────────────────────────────────────────── */
const PALETTE_ITEMS = [
  ...FLAT.map((i) => ({ kind: 'Page', title: i.title, sub: '', href: `#/${i.id}`, ico: i.ico })),
  ...Object.keys(regular).map((n) => ({ kind: 'Icon', title: n, sub: '', href: `#/icons`, iconName: n })),
];

function openPalette() {
  const pal = $('#palette');
  pal.hidden = false;
  const input = $('#palette-input');
  input.value = '';
  renderPaletteList('');
  input.focus();
}
function closePalette() { $('#palette').hidden = true; }

let paletteActive = 0;
function renderPaletteList(q) {
  q = q.trim().toLowerCase();
  const matches = (q ? PALETTE_ITEMS.filter((i) => i.title.toLowerCase().includes(q) || i.kind.toLowerCase().includes(q)) : PALETTE_ITEMS.filter((i) => i.kind === 'Page')).slice(0, 40);
  paletteActive = 0;
  const list = $('#palette-list');
  if (!matches.length) { list.innerHTML = `<div class="ds-palette-empty">No matches for “${esc(q)}”.</div>`; return; }
  list.innerHTML = matches.map((m, i) => `
    <li data-href="${m.href}" class="${i === 0 ? 'is-active' : ''}">
      <span class="pl-ico">${m.iconName ? svgReg(m.iconName) : (m.ico ? svgReg(m.ico) : '')}</span>
      <span>${esc(m.title)}</span>
      <span class="pl-kind">${esc(m.kind)}</span>
    </li>`).join('');
}

function paletteGo(li) { if (!li) return; location.hash = li.dataset.href; closePalette(); }

/* ── boot ─────────────────────────────────────────────────────────────────────── */
function boot() {
  // brand mark
  $('#brand-mark').innerHTML = svgReg('sonaloop');
  // theme preference: stored → system (default). 'system' tracks the OS live.
  try { themePref = localStorage.getItem('ds-theme') || 'system'; } catch { /* ignore */ }
  if (!['light', 'dark', 'system'].includes(themePref)) themePref = 'system';
  applyTheme(false); // paint data-theme + button state; boot's renderPage() handles the first render
  document.querySelectorAll('[data-theme-set]').forEach((b) => {
    if (b.dataset.themeIco) b.innerHTML = svgReg(b.dataset.themeIco); // canonical sun/monitor/moon
    b.addEventListener('click', () => setTheme(b.dataset.themeSet));
  });
  themeQuery.addEventListener('change', () => { if (themePref === 'system') applyTheme(); });

  renderSidebar();
  renderPage();
  window.addEventListener('hashchange', renderPage);

  // search palette
  $('#search-open').addEventListener('click', openPalette);
  $('#palette').addEventListener('click', (e) => { if (e.target.closest('[data-palette-close]')) closePalette(); });
  $('#palette-list').addEventListener('click', (e) => paletteGo(e.target.closest('li')));
  $('#palette-input').addEventListener('input', (e) => renderPaletteList(e.target.value));

  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); $('#palette').hidden ? openPalette() : closePalette(); return; }
    if ($('#palette').hidden) return;
    const items = [...$('#palette-list').querySelectorAll('li')];
    if (e.key === 'Escape') { closePalette(); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); paletteActive = Math.min(paletteActive + 1, items.length - 1); syncActive(items); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); paletteActive = Math.max(paletteActive - 1, 0); syncActive(items); }
    else if (e.key === 'Enter') { e.preventDefault(); paletteGo(items[paletteActive]); }
  });
}

function syncActive(items) {
  items.forEach((li, i) => li.classList.toggle('is-active', i === paletteActive));
  items[paletteActive]?.scrollIntoView({ block: 'nearest' });
}

boot();
