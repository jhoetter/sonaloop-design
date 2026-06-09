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

// Tabbed code blocks — one panel visible at a time. `tabs` = [{ label, lang, src }].
function codeTabs(tabs) {
  const items = tabs.filter(Boolean);
  return `
  <div class="ds-codetabs" data-codetabs>
    <div class="ds-seg ds-seg--text ds-codetabs__tabs" role="tablist">
      ${items.map((t, i) => `<button class="ds-seg-btn${i === 0 ? ' is-active' : ''}" role="tab" data-codetab="${i}">${esc(t.label)}</button>`).join('')}
    </div>
    ${items.map((t, i) => `<div class="ds-codetabs__panel${i === 0 ? '' : ' is-hidden'}" data-codepanel="${i}">${code(t.lang, t.src)}</div>`).join('')}
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

function chartStacked(items, { title = '' } = {}) {
  const keys = []; items.forEach((it) => it.segments.forEach((s) => { if (!keys.includes(s.label)) keys.push(s.label); }));
  const segColor = (s) => s.color || CHART_SERIES[Math.max(0, keys.indexOf(s.label)) % CHART_SERIES.length];
  const totals = items.map((it) => it.segments.reduce((n, s) => n + Math.max(0, s.value || 0), 0));
  const mx = Math.max(...totals) || 1;
  const bars = items.map((it, i) => {
    const segs = it.segments.filter((s) => s.value > 0).map((s) => `<span class="sl-bar__seg" title="${esc(s.label)}: ${s.value}" style="flex-grow:${s.value};--c:${segColor(s)}"></span>`).join('');
    return `<div class="sl-bar"><span class="sl-bar__label">${chMd(it.label)}</span>`
      + `<span class="sl-bar__track"><span class="sl-bar__fill sl-bar__fill--stack" style="--v:${Math.min(100, (totals[i] / mx) * 100)}%">${segs}</span></span>`
      + `<span class="sl-bar__val">${totals[i]}</span></div>`;
  }).join('');
  const first = {}; items.slice().reverse().forEach((it) => it.segments.forEach((s) => { first[s.label] = s; }));
  const legend = keys.map((k) => `<span class="sl-legend__item"><span class="sl-legend__sw" style="--c:${segColor(first[k])}"></span><span class="sl-legend__label">${chMd(k)}</span></span>`).join('');
  return `<figure class="sl-chart">${chTitle(title)}<div class="sl-bars">${bars}</div><div class="sl-legend sl-legend--row" style="margin-top:.9em">${legend}</div></figure>`;
}

function chartGauge(items, { title = '', max = 100 } = {}) {
  const gauges = items.map((it, i) => {
    const m = it.max || max || 1; const pct = Math.max(0, Math.min(100, (it.value / m) * 100));
    const sub = m !== 100 ? `<span class="sl-gauge__sub">${it.value} / ${m}</span>` : '';
    return `<div class="sl-gauge-item"><div class="sl-gauge" role="img" style="--p:${pct};--c:${chSeriesColor(it, i)}">`
      + `<span class="sl-gauge__val">${Math.round(pct)}%</span></div><span class="sl-gauge__label">${chMd(it.label)}</span>${sub}</div>`;
  }).join('');
  return `<figure class="sl-chart">${chTitle(title)}<div class="sl-gauges">${gauges}</div></figure>`;
}

function chartDiverging(items, { title = '', positiveLabel = 'Positive', negativeLabel = 'Negative', positiveColor = 'var(--sl-green)', negativeColor = 'var(--sl-red)' } = {}) {
  const mx = Math.max(...items.map((it) => Math.max(Math.abs(it.positive || 0), Math.abs(it.negative || 0)))) || 1;
  const bars = items.map((it) => {
    const pos = Math.max(0, it.positive || 0), neg = Math.max(0, it.negative || 0);
    return `<div class="sl-dbar"><span class="sl-dbar__label">${chMd(it.label)}</span>`
      + `<span class="sl-dbar__neg"><span class="sl-dbar__fill" style="--v:${(neg / mx) * 100}%;--c:${negativeColor}"></span></span>`
      + `<span class="sl-dbar__pos"><span class="sl-dbar__fill" style="--v:${(pos / mx) * 100}%;--c:${positiveColor}"></span></span>`
      + `<span class="sl-dbar__val">+${pos} · −${neg}</span></div>`;
  }).join('');
  const legend = `<span class="sl-legend__item"><span class="sl-legend__sw" style="--c:${positiveColor}"></span><span class="sl-legend__label">${chMd(positiveLabel)}</span></span>`
    + `<span class="sl-legend__item"><span class="sl-legend__sw" style="--c:${negativeColor}"></span><span class="sl-legend__label">${chMd(negativeLabel)}</span></span>`;
  return `<figure class="sl-chart">${chTitle(title)}<div class="sl-dbars">${bars}</div><div class="sl-legend sl-legend--row" style="margin-top:.9em">${legend}</div></figure>`;
}

function chartHeatmap(columns, rows, { title = '', color = 'var(--sl-accent)' } = {}) {
  const all = rows.flatMap((r) => r.values).filter((v) => Number.isFinite(v));
  const mn = Math.min(...all, 0), mx = Math.max(...all, 1);
  const tint = (v) => `color-mix(in srgb, ${color} ${mx === mn ? 0 : Math.max(0, Math.min(100, ((v - mn) / (mx - mn)) * 100)).toFixed(0)}%, var(--sl-surface-2))`;
  const head = '<span class="sl-heat__corner"></span>' + columns.map((c) => `<span class="sl-heat__col">${chMd(c)}</span>`).join('');
  const body = rows.map((r) => `<span class="sl-heat__row">${chMd(r.label)}</span>`
    + columns.map((_, ci) => { const v = r.values[ci]; return Number.isFinite(v) ? `<span class="sl-heat__cell" style="background:${tint(v)}">${v}</span>` : '<span class="sl-heat__cell"></span>'; }).join('')).join('');
  return `<figure class="sl-chart">${chTitle(title)}<div class="sl-heat" style="grid-template-columns:minmax(4.5em, auto) repeat(${columns.length}, minmax(2em, 1fr))">${head}${body}</div></figure>`;
}

function chartDotPlot(items, { title = '', min = 1, max = 5 } = {}) {
  const span = (max - min) || 1; const xOf = (v) => Math.max(0, Math.min(100, ((v - min) / span) * 100));
  const rows = items.map((it, i) => {
    const vals = it.values.filter((v) => Number.isFinite(v));
    const mean = Math.round((vals.reduce((s, v) => s + v, 0) / vals.length) * 10) / 10;
    const c = it.color || CHART_SERIES[i % CHART_SERIES.length];
    const dots = vals.map((v) => `<span class="sl-dot-pt" style="left:${xOf(v)}%;--c:${c}"></span>`).join('');
    return `<div class="sl-dot-row"><span class="sl-dot-label">${chMd(it.label)}</span>`
      + `<span class="sl-dot-track">${dots}<span class="sl-dot-mean" style="left:${xOf(mean)}%;--c:${c}"></span></span>`
      + `<span class="sl-dot-val">${mean}</span></div>`;
  }).join('');
  const scale = `<div class="sl-dot-scale"><span></span><span class="sl-dot-scale__axis"><span>${min}</span><span>${max}</span></span><span></span></div>`;
  return `<figure class="sl-chart">${chTitle(title)}<div class="sl-dots">${rows}</div>${scale}</figure>`;
}

function chartLine(series, { title = '', labels = null } = {}) {
  const all = series.flatMap((s) => s.points).filter((v) => Number.isFinite(v));
  const mn = Math.min(...all), mx = Math.max(...all), span = (mx - mn) || 1, W = 100, H = 40;
  const xy = (pts) => pts.map((v, i) => [(i / (pts.length - 1)) * W, H - ((v - mn) / span) * H]);
  const paths = series.map((s, i) => {
    const c = s.color || CHART_SERIES[i % CHART_SERIES.length]; const pts = xy(s.points.filter((v) => Number.isFinite(v)));
    const dots = pts.map(([x, y]) => `<circle class="sl-line__dot" cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="1.4"></circle>`).join('');
    return `<g style="--c:${c}"><polyline class="sl-line__path" points="${pts.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(' ')}"></polyline>${dots}</g>`;
  }).join('');
  const svg = `<svg viewBox="0 0 ${W} ${H}" role="img"><line class="sl-line__axis" x1="0" y1="${H}" x2="${W}" y2="${H}"></line>${paths}</svg>`;
  const labs = labels ? `<div class="sl-line__labels">${labels.map((l) => `<span>${esc(l)}</span>`).join('')}</div>` : '';
  const legend = series.length > 1 ? `<div class="sl-legend sl-legend--row" style="margin-top:.6em">${series.map((s, i) => `<span class="sl-legend__item"><span class="sl-legend__sw" style="--c:${s.color || CHART_SERIES[i % CHART_SERIES.length]}"></span><span class="sl-legend__label">${chMd(s.label)}</span></span>`).join('')}</div>` : '';
  return `<figure class="sl-chart">${chTitle(title)}<div class="sl-line">${svg}${labs}</div>${legend}</figure>`;
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
// Open the live page on the local dev server. For dynamic :slug routes the generator resolves a
// real example page (`u.live`, the first slug from the content registry); else fall back to the
// route, stripping any leftover :slug to the parent collection.
const liveHref = (u) => WEBSITE_ORIGIN + (u.live || u.to.replace(/\/:[^/]+$/, '') || '/');

const usechip = (u) => u.to
  ? `<a class="ds-usechip" href="${esc(liveHref(u))}" target="_blank" rel="noopener">${esc(u.name)}<code>${esc(u.to)}</code></a>`
  : `<span class="ds-usechip">${esc(u.name)}</span>`;

// Usage list for a block (flat) or a specific variant (when `key` is given + the block is per-variant).
function usageList(block, key) {
  let u = websiteUsage[block];
  if (u && key && !Array.isArray(u)) u = u[key];
  return Array.isArray(u) ? u : [];
}

function websiteConsumers(block) {
  const list = usageList(block);
  if (!list.length) {
    const note = USAGE_FALLBACK[block];
    return note ? `${h2(`${block}-used`, 'Used on the website')}${p(note)}` : '';
  }
  return `${h2(`${block}-used`, 'Used on the website')}
    ${p(`Auto-detected from the marketing site — <b>${list.length}</b> ${list.length === 1 ? 'page composes' : 'pages compose'} this block. Each opens the live page on your local dev server (<code>${esc(WEBSITE_ORIGIN)}</code>):`)}
    <div class="ds-usechips">${list.map(usechip).join('')}</div>`;
}

// Compact per-variant "Used on" row (no heading) for the stacked variant sections.
function websiteConsumersInline(block, key) {
  const list = usageList(block, key);
  if (!list.length) return '';
  return `<div class="ds-used-inline"><span class="ds-used-inline__label">Used on</span><div class="ds-usechips">${list.map(usechip).join('')}</div></div>`;
}

// "Source" link — detected (scripts/gen-website-usage.mjs reads src/website.tsx), never hardcoded.
// Pass `key` for a per-variant block to link that variant's component.
function websiteSourceLink(block, key) {
  let s = websiteSource[block];
  if (s && key && !s.export) s = s[key];
  if (!s || !s.export) return '';
  return `<p class="ds-source"><span class="ds-source__ico">${svgReg('jtbd')}</span>`
    + `Source: <a href="${esc(s.href)}" target="_blank" rel="noopener"><code>${esc(s.file)}</code> › ${esc(s.export)}${s.line ? ` <span class="ds-source__line">L${s.line}</span>` : ''}</a></p>`;
}

/* Website-section page — a real shared component (sonaloop-design/website), shadcn-style. The
   preview is the ACTUAL component, server-rendered from src/website.tsx by
   scripts/gen-website-previews.mjs (so it can never drift / be a mockup), and the code shows the
   React import + usage. The full-bleed `markup` HTML is read from site/website.previews.mjs. */

function websitePage({ id, block, title, desc, usage, notes }) {
  const data = websiteBlocks[block] || { controls: [], variants: { '': '' }, defaultKey: '' };

  // Concept with several concrete variants: stack each as its own bare preview + code + where it's
  // used (Tailwind-Plus style). The variant name is the section heading, so the preview shows only
  // the component (no repeated label / "live" badge).
  if (data.examples) {
    const sections = data.examples.map((ex) => `
      ${h2(`${id}-${ex.key}`, ex.label)}
      ${websiteSourceLink(block, ex.key)}
      <div class="ds-preview ds-preview--web ds-preview--bare"><div class="ds-preview-stage ds-web-stage">${ex.html}</div></div>
      ${code('tsx', ex.code)}
      ${websiteConsumersInline(block, ex.key)}`).join('');
    return `
    <p class="ds-eyebrow">Website</p>
    <h1 class="ds-h1">${esc(title)}</h1>
    <p class="ds-lead">${desc}</p>
    ${p(`One concept, several variants — each with its own preview, the code below it, and where it's used. All ship from <code>sonaloop-design/website</code>.`)}
    ${sections}
    ${notes || ''}
  `;
  }

  const defaultHtml = data.variants[data.defaultKey] || '';
  // Enumerated prop controls (pre-rendered variants); the bar swaps the stage HTML, no React.
  const controlsBar = data.controls.length ? `
      <div class="ds-wb-controls">
        ${data.controls.map((c) => `
          <span class="ds-wb-ctrl">
            <span class="ds-wb-ctrl__label">${esc(c.label)}</span>
            <span class="ds-seg ds-seg--text" data-wb-ctrl="${esc(c.prop)}">
              ${c.options.map((o, i) => `<button type="button" class="ds-seg-btn${i === 0 ? ' is-active' : ''}" data-wb-opt="${esc(o.key)}">${esc(o.label)}</button>`).join('')}
            </span>
          </span>`).join('')}
      </div>` : '';
  return `
    <p class="ds-eyebrow">Website</p>
    <h1 class="ds-h1">${esc(title)}</h1>
    <p class="ds-lead">${desc}</p>
    ${websiteSourceLink(block)}
    <div class="ds-preview ds-preview--web" data-wb="${esc(block)}">
      <div class="ds-preview-bar">
        <span class="ds-pv-label">Preview</span>
        <span class="ds-top-spacer"></span>
        <span class="ds-pv-note">Live · real component · theme-aware</span>
      </div>
      ${controlsBar}
      <div class="ds-preview-stage ds-web-stage" data-wb-stage>${defaultHtml}</div>
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
    ${codeTabs([
      { label: 'React · sonaloop-design/components', lang: 'tsx', src: react },
      { label: 'Markup · class contract (any stack)', lang: 'html', src: markup },
      python ? { label: 'Python SSR · sonaloop inspector', lang: 'python', src: python } : null,
    ])}
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
      ${cell('#/brand', `<span class="sl-logo" style="font-size:34px"><span class="sl-logo__mark">${svgReg('sonaloop')}</span><span class="sl-logo__word">sona<span class="sl-logo__loop">loop</span></span></span>`, 'Brand Assets', 'How to work with the Sonaloop mark and wordmark.')}
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
    <p class="ds-lead">The Sonaloop mark is a single continuous loop with three nodes — the feedback loop between personas, councils and synthesis. Pair it with the wordmark set in Geist Mono, uppercase. The lockup ships as the <a href="#/components/logo">Logo</a> component (<code>.sl-logo</code>) — every surface renders that one source.</p>

    ${h2('brand-lockup', 'Primary lockup')}
    ${p('This is the live <a href="#/components/logo">Logo</a> component (<code>.sl-logo</code>) — the same lockup the website navbar/footer and the app sidebar render.')}
    <div class="ds-brand-hero"><span class="sl-logo" style="font-size:32px"><span class="sl-logo__mark">${svgReg('sonaloop')}</span><span class="sl-logo__word">sona<span class="sl-logo__loop">loop</span></span></span></div>

    ${h2('brand-contrast', 'On light & dark')}
    ${p('The whole lockup is monochrome <code>--sl-ink</code> — theme-aware, so it inverts cleanly. Never recolour it by hand or set it on busy imagery.')}
    <div class="ds-brand-clear">
      <div class="ds-brand-panel"><span class="sl-logo" style="font-size:20px"><span class="sl-logo__mark">${svgReg('sonaloop')}</span><span class="sl-logo__word">sona<span class="sl-logo__loop">loop</span></span></span></div>
      <div class="ds-brand-panel on-dark" data-theme="dark"><span class="sl-logo" style="font-size:20px"><span class="sl-logo__mark">${svgReg('sonaloop')}</span><span class="sl-logo__word">sona<span class="sl-logo__loop">loop</span></span></span></div>
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
      <li class="ds-li">Don't stretch, rotate or outline the wordmark — Geist Mono, uppercase, tracking <code>0.14em</code>.</li>
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

const cLogo = () => componentPage({
  id: 'logo', title: 'Logo', desc: 'The Sonaloop brand lockup — the loop <a href="#/brand">mark</a> + the <code>sonaloop</code> wordmark, lowercase and tightly set: <code>sona</code> in Sona&nbsp;Mono running straight into a Sona&nbsp;Pixel <code>loop</code> (whose cells echo the mark). The single source of truth for the logo: the React <code>&lt;Logo&gt;</code> and the Python-SSR sidebar both apply <code>.sl-logo</code>, so it never drifts. Monochrome <code>--sl-ink</code> (inverts cleanly), em-based, static. The mark sits on the baseline like a glyph; use <code>--sm</code>/<code>--lg</code> to nudge it. Needs the Sona&nbsp;Mono + Sona&nbsp;Pixel faces loaded.',
  demo: `<div style="display:flex;flex-direction:column;gap:24px;align-items:flex-start">
      <a href="#/logo" class="sl-logo" style="font-size:30px"><span class="sl-logo__mark">${svgReg('sonaloop')}</span><span class="sl-logo__word">sona<span class="sl-logo__loop">loop</span></span></a>
      <span class="sl-logo" style="font-size:18px"><span class="sl-logo__mark">${svgReg('sonaloop')}</span><span class="sl-logo__word">sona<span class="sl-logo__loop">loop</span></span></span>
      <span class="sl-logo sl-logo--lg" style="font-size:48px"><span class="sl-logo__mark">${svgReg('sonaloop')}</span><span class="sl-logo__word">sona<span class="sl-logo__loop">loop</span></span></span>
      <span class="sl-logo"><span class="sl-logo__mark">${svgReg('sonaloop')}</span></span>
    </div>`,
  react: `import { Logo } from 'sonaloop-design/components';\n\n// Wrap in your router's link to make it navigable\n<Link to="/"><Logo /></Link>\n<Logo size="lg" />\n<Logo wordmark={false} />   // mark only`,
  markup: `<a class="sl-logo" href="/">\n  <span class="sl-logo__mark"><!-- 24×24 SonaloopIcon SVG --></span>\n  <span class="sl-logo__word">sona<span class="sl-logo__loop">loop</span></span>\n</a>`,
  python: `h("a", {"class_": "sl-logo", "href": "/"},\n  h("span", {"class_": "sl-logo__mark"}, icon("sonaloop")),\n  h("span", {"class_": "sl-logo__word"}, "sona", h("span", {"class_": "sl-logo__loop"}, "loop")))`,
  notes: `<div class="ds-callout"><span class="ico">${svgReg('bulb')}</span><p>Usage rules (clear space, on-light/dark, the product-family badges) live on the <a href="#/brand">Brand</a> page — this component is just the canonical lockup every app renders.</p></div>`,
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

const cChartStacked = () => componentPage({
  id: 'chart-stacked', title: 'Stacked Bar Chart',
  desc: 'A <b>composition</b> chart — how each category breaks down by series (stance per theme, time per phase). Bars share one scale; series colour is keyed by segment label so a series reads the same in every bar, with a shared legend.',
  demo: `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:34px;width:100%">
      ${chartStacked([
        { label: 'Pricing', segments: [{ label: 'For', value: 6 }, { label: 'Conditional', value: 3 }, { label: 'Against', value: 2 }] },
        { label: 'Onboarding', segments: [{ label: 'For', value: 4 }, { label: 'Conditional', value: 4 }, { label: 'Against', value: 1 }] },
        { label: 'Support', segments: [{ label: 'For', value: 2 }, { label: 'Conditional', value: 3 }, { label: 'Against', value: 5 }] },
      ], { title: 'Council stance per theme' })}
    </div>`,
  variants: { cols: ['Prop', 'Type', 'Effect'], rows: [
    ['items', '{label, segments: {label, value, color?}[]}[]', 'Each bar and its stacked series segments.'],
    ['title', 'string', 'Optional mono section title above the bars.'],
    ['maxValue', 'number', 'Fix the 100% reference (else the largest bar total).'],
  ] },
  react: `import { StackedBarChart } from 'sonaloop-design/charts';\n\n<StackedBarChart\n  title="Council stance per theme"\n  items={[\n    { label: 'Pricing', segments: [{ label: 'For', value: 6 }, { label: 'Conditional', value: 3 }, { label: 'Against', value: 2 }] },\n    { label: 'Support', segments: [{ label: 'For', value: 2 }, { label: 'Conditional', value: 3 }, { label: 'Against', value: 5 }] },\n  ]}\n/>`,
  markup: `<figure class="sl-chart">\n  <div class="sl-bars">\n    <div class="sl-bar">\n      <span class="sl-bar__label">Pricing</span>\n      <span class="sl-bar__track">\n        <span class="sl-bar__fill sl-bar__fill--stack" style="--v:100%">\n          <span class="sl-bar__seg" style="flex-grow:6;--c:var(--c1)"></span>\n          <span class="sl-bar__seg" style="flex-grow:3;--c:var(--c2)"></span>\n          <span class="sl-bar__seg" style="flex-grow:2;--c:var(--c3)"></span>\n        </span>\n      </span>\n      <span class="sl-bar__val">11</span>\n    </div>\n  </div>\n</figure>`,
  python: `from sonaloop_icons.charts import stacked_bar_chart\n\nstacked_bar_chart([\n    {"label": "Pricing", "segments": [{"label": "For", "value": 6}, {"label": "Against", "value": 2}]},\n], title="Council stance per theme")`,
  notes: chartFigureNote('<code>{kind:"chart", of:"stacked_bar", series:[{label, segments}]}</code>'),
});

const cChartGauge = () => componentPage({
  id: 'chart-gauge', title: 'Gauge · Radial Progress',
  desc: 'A <b>radial progress ring</b> — a single KPI, % complete or confidence score. The ring fills <code>value / max</code> and the centre shows the percentage. Pass several items to compare a few KPIs side by side; print- and PDF-safe like the donut.',
  demo: `<div style="width:100%">
      ${chartGauge([
        { label: 'Confidence', value: 72 },
        { label: 'Coverage', value: 58, color: 'var(--sl-violet)' },
        { label: 'Tasks done', value: 9, max: 12, color: 'var(--sl-green)' },
      ], { title: 'Synthesis health' })}
    </div>`,
  variants: { cols: ['Prop', 'Type', 'Effect'], rows: [
    ['items', '{label, value, max?, color?}[]', 'One ring per item; <code>max</code> defaults to the chart <code>max</code>.'],
    ['max', 'number = 100', 'Default scale for items without their own <code>max</code>.'],
    ['title', 'string', 'Optional mono section title.'],
  ] },
  react: `import { GaugeChart } from 'sonaloop-design/charts';\n\n<GaugeChart title="Synthesis health"\n  items={[{ label: 'Confidence', value: 72 }, { label: 'Tasks done', value: 9, max: 12 }]}\n/>`,
  markup: `<figure class="sl-chart">\n  <div class="sl-gauges">\n    <div class="sl-gauge-item">\n      <div class="sl-gauge" role="img" style="--p:72;--c:var(--c1)">\n        <span class="sl-gauge__val">72%</span>\n      </div>\n      <span class="sl-gauge__label">Confidence</span>\n    </div>\n  </div>\n</figure>`,
  python: `from sonaloop_icons.charts import gauge_chart\n\ngauge_chart([{"label": "Confidence", "value": 72}, {"label": "Tasks done", "value": 9, "max": 12}])`,
  notes: chartFigureNote('<code>{kind:"chart", of:"gauge", series:[{label, value, max}]}</code>'),
});

const cChartDiverging = () => componentPage({
  id: 'chart-diverging', title: 'Diverging Bar Chart',
  desc: 'A <b>net sentiment</b> chart — for ↔ against around a centre axis. Negative grows left, positive grows right, both on one magnitude scale, so council stance and before·after shifts read as a lean, not just a count.',
  demo: `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:34px;width:100%">
      ${chartDiverging([
        { label: 'Pricing', positive: 6, negative: 2 }, { label: 'Onboarding', positive: 4, negative: 4 },
        { label: 'Support', positive: 2, negative: 5 }, { label: 'Roadmap', positive: 7, negative: 1 },
      ], { title: 'Council stance', positiveLabel: 'For', negativeLabel: 'Against' })}
    </div>`,
  variants: { cols: ['Prop', 'Type', 'Effect'], rows: [
    ['items', '{label, positive, negative}[]', 'Each row; the two sides share one magnitude scale.'],
    ['positiveLabel / negativeLabel', 'string', 'Legend names (default Positive / Negative).'],
    ['positiveColor / negativeColor', 'string', 'Side colours (default green / red).'],
    ['maxValue', 'number', 'Fix the scale (else the largest magnitude).'],
  ] },
  react: `import { DivergingBarChart } from 'sonaloop-design/charts';\n\n<DivergingBarChart\n  title="Council stance" positiveLabel="For" negativeLabel="Against"\n  items={[{ label: 'Pricing', positive: 6, negative: 2 }, { label: 'Support', positive: 2, negative: 5 }]}\n/>`,
  markup: `<figure class="sl-chart">\n  <div class="sl-dbars">\n    <div class="sl-dbar">\n      <span class="sl-dbar__label">Pricing</span>\n      <span class="sl-dbar__neg"><span class="sl-dbar__fill" style="--v:33%;--c:var(--sl-red)"></span></span>\n      <span class="sl-dbar__pos"><span class="sl-dbar__fill" style="--v:100%;--c:var(--sl-green)"></span></span>\n      <span class="sl-dbar__val">+6 · −2</span>\n    </div>\n  </div>\n</figure>`,
  python: `from sonaloop_icons.charts import diverging_bar_chart\n\ndiverging_bar_chart([{"label": "Pricing", "positive": 6, "negative": 2}],\n                    positive_label="For", negative_label="Against")`,
  notes: chartFigureNote('<code>{kind:"chart", of:"diverging_bar", series:[{label, positive, negative}]}</code>'),
});

const cChartHeatmap = () => componentPage({
  id: 'chart-heatmap', title: 'Heatmap · Matrix Chart',
  desc: 'A <b>2D scoring matrix</b> — option × criteria, or persona × theme. Each cell is tinted by its value via <code>color-mix</code>, so the strong and weak spots of a decision pop at a glance. Print- and PDF-safe.',
  demo: `<div style="width:100%;max-width:520px">
      ${chartHeatmap(['Cost', 'Reach', 'Speed', 'Risk'], [
        { label: 'Build in-house', values: [2, 5, 1, 4] },
        { label: 'Partner', values: [4, 3, 4, 2] },
        { label: 'Buy', values: [5, 4, 5, 3] },
      ], { title: 'Options × criteria (1–5)' })}
    </div>`,
  variants: { cols: ['Prop', 'Type', 'Effect'], rows: [
    ['columns', 'string[]', 'Column headers (the criteria / themes).'],
    ['rows', '{label, values: number[]}[]', 'One row per option; values align to columns.'],
    ['minValue / maxValue', 'number', 'Tint scale (else derived from the data, floored at 0/1).'],
    ['color', 'string', 'Base hue mixed toward surface (default accent).'],
  ] },
  react: `import { HeatmapChart } from 'sonaloop-design/charts';\n\n<HeatmapChart\n  title="Options × criteria"\n  columns={['Cost', 'Reach', 'Speed', 'Risk']}\n  rows={[{ label: 'Build', values: [2, 5, 1, 4] }, { label: 'Buy', values: [5, 4, 5, 3] }]}\n/>`,
  markup: `<figure class="sl-chart">\n  <div class="sl-heat" style="grid-template-columns:minmax(4.5em, auto) repeat(4, minmax(2em, 1fr))">\n    <span class="sl-heat__corner"></span>\n    <span class="sl-heat__col">Cost</span> <!-- … -->\n    <span class="sl-heat__row">Build</span>\n    <span class="sl-heat__cell" style="background:color-mix(in srgb, var(--sl-accent) 25%, var(--sl-surface-2))">2</span>\n  </div>\n</figure>`,
  python: `from sonaloop_icons.charts import heatmap_chart\n\nheatmap_chart(["Cost", "Reach", "Speed", "Risk"],\n              [{"label": "Build", "values": [2, 5, 1, 4]}, {"label": "Buy", "values": [5, 4, 5, 3]}])`,
  notes: chartFigureNote('<code>{kind:"chart", of:"heatmap", columns:[…], series:[{label, values}]}</code>'),
});

const cChartDotPlot = () => componentPage({
  id: 'chart-dot-plot', title: 'Dot · Range Plot',
  desc: 'Where <b>N voices land</b> on a 1–5 scale, per statement — the spread of opinion, not just the mean. Each value is a translucent dot; the taller marker is the average. Surfaces disagreement a single bar would hide.',
  demo: `<div style="width:100%;max-width:520px">
      ${chartDotPlot([
        { label: 'Trust the AI', values: [2, 3, 3, 4, 5] },
        { label: 'Worth the price', values: [1, 2, 2, 3, 3] },
        { label: 'Easy to start', values: [4, 4, 5, 5, 5] },
      ], { title: 'Persona agreement (1–5)' })}
    </div>`,
  variants: { cols: ['Prop', 'Type', 'Effect'], rows: [
    ['items', '{label, values: number[], color?}[]', 'One row per statement; each value is a dot.'],
    ['min / max', 'number = 1 / 5', 'The scale endpoints.'],
    ['showMean', 'boolean = true', 'Draw the mean marker.'],
  ] },
  react: `import { DotPlotChart } from 'sonaloop-design/charts';\n\n<DotPlotChart\n  title="Persona agreement (1–5)"\n  items={[{ label: 'Trust the AI', values: [2, 3, 3, 4, 5] }]}\n/>`,
  markup: `<figure class="sl-chart">\n  <div class="sl-dots">\n    <div class="sl-dot-row">\n      <span class="sl-dot-label">Trust the AI</span>\n      <span class="sl-dot-track">\n        <span class="sl-dot-pt" style="left:25%;--c:var(--c1)"></span>\n        <span class="sl-dot-mean" style="left:60%;--c:var(--c1)"></span>\n      </span>\n      <span class="sl-dot-val">3.4</span>\n    </div>\n  </div>\n</figure>`,
  python: `from sonaloop_icons.charts import dot_plot_chart\n\ndot_plot_chart([{"label": "Trust the AI", "values": [2, 3, 3, 4, 5]}])`,
  notes: chartFigureNote('<code>{kind:"chart", of:"dot_plot", series:[{label, values}]}</code>'),
});

const cChartLine = () => componentPage({
  id: 'chart-line', title: 'Line · Trend Chart',
  desc: 'A <b>trend over a sequence</b> — confidence across council rounds, a metric over time. A static inline-SVG polyline per series (the one chart that needs SVG), still print- and PDF-safe. Multi-series gets a legend.',
  demo: `<div style="width:100%;max-width:520px">
      ${chartLine([
        { label: 'Confidence', points: [2, 3, 3, 4, 5, 6] },
        { label: 'Coverage', points: [1, 2, 4, 4, 5, 5], color: 'var(--sl-violet)' },
      ], { title: 'Across council rounds', labels: ['R1', 'R2', 'R3', 'R4', 'R5', 'R6'] })}
    </div>`,
  variants: { cols: ['Prop', 'Type', 'Effect'], rows: [
    ['series', '{label, points: number[], color?}[]', 'One polyline per series (needs ≥ 2 points).'],
    ['labels', 'string[]', 'Optional x-axis tick labels.'],
    ['minValue / maxValue', 'number', 'Fix the y-range (else derived from the data).'],
    ['showDots', 'boolean = true', 'Draw a marker at each point.'],
  ] },
  react: `import { LineChart } from 'sonaloop-design/charts';\n\n<LineChart\n  title="Across council rounds" labels={['R1', 'R2', 'R3', 'R4', 'R5']}\n  series={[{ label: 'Confidence', points: [2, 3, 3, 4, 6] }]}\n/>`,
  markup: `<figure class="sl-chart">\n  <div class="sl-line">\n    <svg viewBox="0 0 100 40" role="img">\n      <line class="sl-line__axis" x1="0" y1="40" x2="100" y2="40"></line>\n      <g style="--c:var(--c1)">\n        <polyline class="sl-line__path" points="0,32 25,24 50,24 75,16 100,0"></polyline>\n      </g>\n    </svg>\n  </div>\n</figure>`,
  python: `from sonaloop_icons.charts import line_chart\n\nline_chart([{"label": "Confidence", "points": [2, 3, 3, 4, 6]}],\n           labels=["R1", "R2", "R3", "R4", "R5"])`,
  notes: chartFigureNote('<code>{kind:"chart", of:"line", labels:[…], series:[{label, points}]}</code>'),
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
// ── Composites: components built FROM other components (not atomic primitives). ─────
const _navIco = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="3"/></svg>`;
const cAppShell = () => componentPage({
  id: 'app-shell', title: 'App Shell',
  desc: 'The product chrome as ONE composition — a collapsible + drag-resizable sidebar (brand · nav sections with an accent active-bar + icon hover · a bottom user-menu), a resize handle, and a topbar (sidebar toggle · breadcrumb · actions). The sidebar, collapse state, resize and user-menu are tightly coupled (the handle writes <code>--sl-sidebar-w</code>; collapse is shared), so it ships as a single shell rather than loose Sidebar/Header parts. Same source on both stacks: the React <code>&lt;AppShell&gt;</code> and the Python-SSR <code>_layout</code> emit these <code>.sl-app-shell</code> classes; behaviour is <code>_shell.SHELL_JS</code> (vendored). Pair with the <a href="#/command-menu">Command Menu</a> for ⌘K.',
  demo: `<div style="height:380px;border:1px solid var(--sl-line);border-radius:var(--sl-radius);overflow:hidden;font-size:13px">
    <div class="sl-app-shell" style="height:100%;--sl-sidebar-w:208px">
      <aside class="sl-sidebar">
        <div class="sl-brand"><span style="font-weight:600">sonaloop</span></div>
        <div class="sl-sb-scroll">
          <div class="sl-navhead">Workspace</div>
          <nav class="sl-nav">
            <a class="is-active" href="#/app-shell">${_navIco}<span>Projects</span><span class="sl-nav-meta">3</span></a>
            <a href="#/app-shell">${_navIco}<span>Personas</span></a>
            <a href="#/app-shell">${_navIco}<span>Documentation</span></a>
          </nav>
          <div class="sl-navhead">Library</div>
          <nav class="sl-nav">
            <a href="#/app-shell">${_navIco}<span>Councils</span></a>
            <a href="#/app-shell">${_navIco}<span>Reports</span></a>
          </nav>
        </div>
        <div class="sl-usermenu"><button class="sl-um-trigger" type="button"><span class="sl-um-ava">${_navIco}</span><span class="sl-um-name">Settings</span><span class="sl-um-caret"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="m6 9 6 6 6-6"/></svg></span></button></div>
      </aside>
      <div class="sl-resize"></div>
      <div class="sl-main">
        <header class="sl-topbar"><button class="sl-iconbtn" type="button" data-sidebar-toggle><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16"/></svg></button><nav class="sl-breadcrumb"><span class="sl-breadcrumb__current">Projects</span></nav><span class="sl-spacer"></span></header>
        <div class="sl-shell-body" style="padding:22px"><p style="margin:0 0 6px;font-weight:600">Projects</p><p style="margin:0;color:var(--sl-muted)">Resize the sidebar from its right edge, or collapse it with <span class="sl-kbd">[</span>.</p></div>
      </div>
    </div>
  </div>`,
  react: `import { AppShell } from 'sonaloop-design/components';\nimport { ProjectsIcon, PersonasIcon, SettingsIcon } from 'sonaloop-design';\nimport { Logo, ThemeToggle, Breadcrumb } from 'sonaloop-design/components';\n\n<AppShell\n  brand={<Logo size=\"sm\" />}\n  nav={[{ label: 'Workspace', items: [\n    { label: 'Projects', icon: <ProjectsIcon size={16} animate />, active: true, meta: 3, onSelect: goProjects },\n    { label: 'Personas', icon: <PersonasIcon size={16} animate />, onSelect: goPersonas },\n  ] }]}\n  userMenu={{ label: 'Settings', icon: <SettingsIcon size={18} animate />,\n    children: <ThemeToggle value={theme} onChange={setTheme} /> }}\n  topbar={<><Breadcrumb items={[{ label: 'Projects' }]} /><span className=\"sl-spacer\" /></>}\n>\n  {/* main content */}\n</AppShell>`,
  markup: `<div class="sl-app-shell">\n  <aside class="sl-sidebar">\n    <div class="sl-brand">…logo…</div>\n    <div class="sl-sb-scroll">\n      <div class="sl-navhead">Workspace</div>\n      <nav class="sl-nav"><a class="is-active">…</a><a>…</a></nav>\n    </div>\n    <div class="sl-usermenu">…</div>\n  </aside>\n  <div class="sl-resize"></div>\n  <div class="sl-main">\n    <header class="sl-topbar"><button class="sl-iconbtn" data-sidebar-toggle>…</button>…crumbs…</header>\n    …body…\n  </div>\n</div>`,
  python: `# web/_components.py:_layout emits the same .sl-app-shell markup;\n# resize / collapse / user-menu behaviour is _shell.SHELL_JS (vendored from sonaloop-design).\nh("div", {"class_": "sl-app-shell"},\n  h("aside", {"class_": "sl-sidebar"}, brand, nav, user_menu),\n  h("div", {"class_": "sl-resize"}),\n  h("div", {"class_": "sl-main"}, topbar, body)) + SHELL_JS`,
});

const cCommandPalette = () => componentPage({
  id: 'command-palette', title: 'Command Palette ⌘K',
  desc: 'The ONE ⌘K palette, shared across every surface — grouped results, a per-item icon + optional subtitle, full keyboard nav (↑↓ · ↵ · esc) with hover-sync, a footer hint bar, optional async <code>onSearch</code> and router-aware links. It lives in one image-free module (<code>src/command.tsx</code>) and is exported from BOTH <code>sonaloop-design/components</code> (app shells) and <code>sonaloop-design/website</code> (marketing) — same component, no duplication; the Python-SSR app ships its own over the same <code>.sl-cmdk</code> classes.',
  demo: `<div class="sl-cmdk-panel sl-cmdk-panel--inline" style="max-width:520px;margin:0 auto;max-height:none">
    <div class="sl-cmdk-head"><svg class="sl-cmdk-head-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg><input class="sl-cmdk-input" placeholder="Search projects and tickets…" readonly></div>
    <div class="sl-cmdk-list">
      <div class="sl-cmdk-sec">Projects</div>
      <button class="sl-cmdk-item is-active" type="button"><span class="sl-cmdk-title">sonaloop</span><span class="sl-cmdk-sub">MCP server core</span></button>
      <button class="sl-cmdk-item" type="button"><span class="sl-cmdk-title">sonaloop-cloud</span><span class="sl-cmdk-sub">SaaS control-plane</span></button>
      <div class="sl-cmdk-sec">Tickets</div>
      <button class="sl-cmdk-item" type="button"><span class="sl-cmdk-title">Publish on PyPI</span><span class="sl-cmdk-sub">sonaloop</span></button>
    </div>
    <div class="sl-cmdk-foot"><span><span class="sl-kbd">↑↓</span> navigate</span><span><span class="sl-kbd">↵</span> open</span><span><span class="sl-kbd">esc</span> close</span></div>
  </div>`,
  react: `// app shells (e.g. the tracker):\nimport { CommandPalette, CommandTrigger, type CommandGroup } from 'sonaloop-design/components';\n// marketing site — the SAME component, re-exported:\n// import { CommandPalette } from 'sonaloop-design/website';\nimport { useState } from 'react';\n\nconst groups: CommandGroup[] = [\n  { key: 'projects', label: 'Projects', items: [\n    { title: 'sonaloop', subtitle: 'MCP server core', onSelect: () => open('sonaloop') },\n  ] },\n  { key: 'tickets', label: 'Tickets', items: [\n    { title: 'Publish on PyPI', subtitle: 'sonaloop', keywords: 'publish-on-pypi', onSelect: () => open(t) },\n  ] },\n];\n\nfunction App() {\n  const [open, setOpen] = useState(false);\n  return (<>\n    <CommandTrigger onClick={() => setOpen(true)} label=\"Search\" />\n    <CommandPalette open={open} onOpenChange={setOpen} groups={groups} placeholder=\"Search…\" />\n  </>);\n}`,
  markup: `<div class="sl-cmdk"><div class="sl-cmdk-backdrop"></div>\n  <div class="sl-cmdk-panel">\n    <div class="sl-cmdk-head">…search glyph… <input class="sl-cmdk-input"></div>\n    <div class="sl-cmdk-list">\n      <div class="sl-cmdk-sec">Projects</div>\n      <button class="sl-cmdk-item is-active"><span class="sl-cmdk-title">…</span><span class="sl-cmdk-sub">…</span></button>\n    </div>\n    <div class="sl-cmdk-foot">…hints…</div>\n  </div>\n</div>`,
  python: `# The inspector ships its own ⌘K (web/_palette.py) over the same .sl-cmdk classes.`,
});

const XGLYPH = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>`;

const cDrawer = () => componentPage({
  id: 'drawer', title: 'Drawer · Slide-over',
  desc: 'A right/left slide-over peek panel — open a record’s detail over the current page without navigating away. Scrim · sticky header with title + close · scrollable body · optional sticky footer of actions. It <b>animates in and out</b> (a CSS transition driven by <code>.is-open</code>, kept mounted across the close). The React <code>&lt;Drawer&gt;</code> handles that plus ESC-close, body scroll-lock and focus restore; the Python-SSR app toggles the same <code>.sl-drawer</code> over any <code>[data-drawer]</code> link. Pass <code>bare</code> when the children own the whole panel.',
  demo: `<div style="position:relative;width:100%;max-width:560px;height:300px;border:1px solid var(--sl-line);border-radius:var(--sl-radius);overflow:hidden;background:var(--sl-bg)">
    <div style="position:absolute;inset:0;background:color-mix(in srgb,#0a0c10 22%,transparent)"></div>
    <aside class="sl-drawer__panel" style="position:absolute;top:0;right:0;height:100%;width:330px;transform:none">
      <header class="sl-drawer__head"><span class="sl-drawer__title">Persona · Maya Chen</span><button class="sl-overlay-close" aria-label="Close">${XGLYPH}</button></header>
      <div class="sl-drawer__body">
        <p style="margin:0 0 14px;color:var(--sl-muted)">A peek panel layered over the page — close it and you’re exactly where you were.</p>
        <div class="sl-props"><div class="sl-prop"><span class="sl-prop__k">${svgReg('contact')}Role</span><span class="sl-prop__v">Head of Product</span></div><div class="sl-prop"><span class="sl-prop__k">${svgReg('councils')}Councils</span><span class="sl-prop__v">3</span></div></div>
      </div>
      <footer class="sl-drawer__foot"><button class="sl-btn sl-btn--sm">Dismiss</button><button class="sl-btn sl-btn--sm sl-btn--primary">Open full page</button></footer>
    </aside>
  </div>`,
  variants: { cols: ['Prop / class', 'Value', 'Effect'], rows: [
    ['.is-open', 'State', 'Drives the slide-in/out — transitions both ways (React toggles it; the SSR app toggles it in JS).'],
    ['side', 'right · left', 'Edge the panel slides from (<code>.sl-drawer--left</code>).'],
    ['width', 'CSS length', 'Panel width; default <code>min(620px, 94vw)</code>.'],
    ['footer', 'ReactNode', 'A sticky action bar pinned to the bottom.'],
    ['bare', 'boolean', 'No built-in header/body — children own the whole panel (a custom peek).'],
  ] },
  react: `import { Drawer, Button } from 'sonaloop-design/components';\nimport { useState } from 'react';\n\nconst [open, setOpen] = useState(false);\n<Button onClick={() => setOpen(true)}>Open persona</Button>\n<Drawer open={open} onClose={() => setOpen(false)} title=\"Persona · Maya Chen\"\n  footer={<><Button size=\"sm\" onClick={() => setOpen(false)}>Dismiss</Button><Button size=\"sm\" variant=\"primary\">Open full page</Button></>}>\n  …record detail…\n</Drawer>`,
  markup: `<!-- toggle .is-open to slide it in/out (CSS transition both ways) -->\n<div class="sl-drawer is-open"><div class="sl-drawer__scrim"></div>\n  <aside class="sl-drawer__panel" role="dialog" aria-modal="true">\n    <header class="sl-drawer__head"><span class="sl-drawer__title">Title</span>\n      <button class="sl-overlay-close" aria-label="Close">✕</button></header>\n    <div class="sl-drawer__body">…</div>\n    <footer class="sl-drawer__foot">…actions…</footer>\n  </aside>\n</div>`,
  python: `# Any link opens its target page in the slide-over (web/_components.py):\nh("a", {"href": url, "data-drawer": url, "data-drawer-title": title}, label)`,
});

const cModal = () => componentPage({
  id: 'modal', title: 'Modal · Dialog',
  desc: 'A centered modal dialog for focused confirms and short forms. Shares the overlay engine with Drawer (ESC-close, scroll-lock, focus restore). Three sizes; pass <code>hideClose</code> for a forced-choice dialog. For a record peek, prefer the <a href="#/drawer">Drawer</a>.',
  demo: `<div style="position:relative;width:100%;max-width:560px;height:280px;display:flex;align-items:center;justify-content:center;border:1px solid var(--sl-line);border-radius:var(--sl-radius);overflow:hidden;background:var(--sl-bg)">
    <div style="position:absolute;inset:0;background:color-mix(in srgb,#0a0c10 26%,transparent)"></div>
    <div class="sl-modal__panel" style="animation:none;width:360px">
      <header class="sl-modal__head"><h2 class="sl-modal__title">Delete council?</h2><button class="sl-overlay-close" aria-label="Close">${XGLYPH}</button></header>
      <div class="sl-modal__body">This permanently removes the “Pricing v2” council and its 3 sessions. This can’t be undone.</div>
      <footer class="sl-modal__foot"><button class="sl-btn sl-btn--sm">Cancel</button><button class="sl-btn sl-btn--sm sl-btn--accent">Delete</button></footer>
    </div>
  </div>`,
  variants: { cols: ['Prop / class', 'Value', 'Effect'], rows: [
    ['size', 'sm · md · lg', 'Panel width (<code>.sl-modal--sm</code> / <code>--lg</code>).'],
    ['hideClose', 'boolean', 'Drop the header ✕ for a forced choice.'],
    ['footer', 'ReactNode', 'The action row (right-aligned).'],
  ] },
  react: `import { Modal, Button } from 'sonaloop-design/components';\nimport { useState } from 'react';\n\nconst [open, setOpen] = useState(false);\n<Modal open={open} onClose={() => setOpen(false)} title=\"Delete council?\" size=\"sm\"\n  footer={<><Button size=\"sm\" onClick={() => setOpen(false)}>Cancel</Button><Button size=\"sm\" variant=\"accent\">Delete</Button></>}>\n  This permanently removes the council and its sessions.\n</Modal>`,
  markup: `<div class="sl-modal"><div class="sl-modal__scrim"></div>\n  <div class="sl-modal__panel" role="dialog" aria-modal="true">\n    <header class="sl-modal__head"><h2 class="sl-modal__title">Title</h2>\n      <button class="sl-overlay-close" aria-label="Close">✕</button></header>\n    <div class="sl-modal__body">…</div>\n    <footer class="sl-modal__foot">…actions…</footer>\n  </div>\n</div>`,
  python: `# Same .sl-modal class contract from the Python-SSR app.`,
});

const cPopover = () => componentPage({
  id: 'popover', title: 'Popover · Menu',
  desc: 'A small panel anchored to its trigger — row actions, filters, the account menu. Outside-click + ESC dismiss. Triggered by a quiet <code>.sl-toolbtn</code> (or any control). Holds <code>.sl-menu-item</code> rows — an icon · label for actions, or a leading <b>check column</b> + trailing <b>count</b> for selectable option / filter menus — with optional <code>.sl-menu-label</code> headers and <code>.sl-menu-sep</code> dividers. Four placements. <b>Controlled</b> (pass <code>open</code>/<code>onClose</code>) or <b>uncontrolled</b> — omit them and drive it with a render-prop <code>trigger={({open,toggle})=>…}</code> and <code>children={(close)=>…}</code> (so a row closes the menu when chosen).',
  demo: (() => { const chk = '<span class="sl-menu-item__check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13l4 4L19 7"/></svg></span>'; return `<div style="display:flex;gap:40px;flex-wrap:wrap;margin-bottom:170px">
    <div class="sl-popover-wrap">
      <button class="sl-toolbtn">${svgReg('settings')}Display</button>
      <div class="sl-popover sl-popover--bottom-start" style="animation:none;min-width:13rem">
        <div class="sl-menu-label">Show properties</div>
        <button class="sl-menu-item">${chk}<span class="sl-menu-item__label">Priority</span></button>
        <button class="sl-menu-item">${chk}<span class="sl-menu-item__label">Labels</span></button>
        <button class="sl-menu-item"><span class="sl-menu-item__check"></span><span class="sl-menu-item__label">ID</span></button>
      </div>
    </div>
    <div class="sl-popover-wrap">
      <button class="sl-toolbtn">${svgReg('search')}Status</button>
      <div class="sl-popover sl-popover--bottom-start" style="animation:none;min-width:13rem">
        <div class="sl-menu-label">Filter by status</div>
        <button class="sl-menu-item">${chk}<span class="sl-menu-item__label">In progress</span><span class="sl-menu-item__count">8</span></button>
        <button class="sl-menu-item"><span class="sl-menu-item__check"></span><span class="sl-menu-item__label">Backlog</span><span class="sl-menu-item__count">34</span></button>
      </div>
    </div>
  </div>`; })(),
  variants: { cols: ['Class', 'Part', 'Use'], rows: [
    ['.sl-popover--bottom-start · --bottom-end', 'Placement', 'Below the trigger, left- or right-aligned.'],
    ['.sl-popover--top-start · --top-end', 'Placement', 'Above the trigger.'],
    ['.sl-toolbtn', 'Trigger', 'The quiet bordered toolbar pill (also a mode toggle via <code>.is-active</code>).'],
    ['.sl-menu-item__check', 'Row', 'Leading check column — a selectable option / filter row.'],
    ['.sl-menu-item__count', 'Row', 'Trailing count (matches per facet).'],
    ['.sl-menu-field', 'Row', 'A labelled control row (a Select / toggle) — Display / settings menus.'],
  ] },
  react: `import { Popover, MenuItem, ToolbarButton } from 'sonaloop-design/components';\n\n// a filter menu: ToolbarButton trigger + selectable rows with counts (row closes on select)\n<Popover placement=\"bottom-start\"\n  trigger={({ open, toggle }) => <ToolbarButton active={open} icon={<FilterIcon size={15} />} onClick={toggle}>Status</ToolbarButton>}>\n  {(close) => statuses.map((s) => (\n    <MenuItem key={s.id} selected={picked.has(s.id)} count={s.count} onClick={() => toggleStatus(s.id)}>{s.label}</MenuItem>\n  ))}\n</Popover>`,
  markup: `<button class="sl-toolbtn">Status</button>\n<div class="sl-popover sl-popover--bottom-start">\n  <button class="sl-menu-item">\n    <span class="sl-menu-item__check"><!-- check svg when selected --></span>\n    <span class="sl-menu-item__label">In progress</span>\n    <span class="sl-menu-item__count">8</span>\n  </button>\n</div>`,
  python: `# The sidebar account menu (.sl-um-pop) is this pattern, SSR-side.`,
});

const cTabs = () => componentPage({
  id: 'tabs', title: 'Tabs',
  desc: 'In-page section switching. The <b>underline</b> default for a page’s primary sections (docs, detail bodies); the <b>pill</b> variant for compact option sets (a calendar range). Buttons by default (controlled <code>value</code>/<code>onChange</code>); pass a per-item <code>href</code> for navigation tabs. For a settings theme/density toggle, prefer <a href="#/segmented">Segmented</a>.',
  demo: `<div style="display:flex;flex-direction:column;gap:24px;width:100%;max-width:520px">
    <div class="sl-tabs"><button class="sl-tab is-active">${svgReg('overview')}Overview</button><button class="sl-tab">${svgReg('councils')}Sessions</button><button class="sl-tab">Findings</button></div>
    <div class="sl-tabs sl-tabs--pill" style="align-self:flex-start"><button class="sl-tab is-active">Day</button><button class="sl-tab">Week</button><button class="sl-tab">Month</button></div>
  </div>`,
  variants: { cols: ['Class', 'Variant', 'Use'], rows: [
    ['.sl-tabs', 'Underline', 'A page’s primary sections.'],
    ['.sl-tabs--pill', 'Pill', 'Compact, framed option sets.'],
    ['.sl-tab.is-active', 'State', 'The selected tab.'],
  ] },
  react: `import { Tabs } from 'sonaloop-design/components';\nimport { useState } from 'react';\n\nconst [tab, setTab] = useState('overview');\n<Tabs value={tab} onChange={setTab} items={[\n  { key: 'overview', label: 'Overview', icon: <OverviewIcon size={15} /> },\n  { key: 'sessions', label: 'Sessions' },\n  { key: 'findings', label: 'Findings' },\n]} />\n\n// navigation tabs:\n<Tabs variant=\"pill\" value={range} items={[{ key: 'day', label: 'Day', href: '?range=day' }]} />`,
  markup: `<div class="sl-tabs" role="tablist">\n  <button class="sl-tab is-active" role="tab" aria-selected="true">Overview</button>\n  <button class="sl-tab" role="tab">Sessions</button>\n</div>`,
  python: `h("nav", {"class_": "sl-tabs"},\n  h("a", {"class_": "sl-tab on", "href": "?tab=overview"}, "Overview"))`,
});

const cPropertyList = () => componentPage({
  id: 'property-list', title: 'Property List',
  desc: 'A Linear-style key/value panel — an icon + label + value per row. The metadata block on every detail page. Compose <code>&lt;Property&gt;</code> rows inside a <code>&lt;PropertyList&gt;</code>; pass <code>card</code> for a bordered surface. Empty rows are the caller’s to skip.',
  demo: `<div class="sl-props sl-props--card" style="width:100%;max-width:340px">
    <div class="sl-prop"><span class="sl-prop__k">${svgReg('projects')}Project</span><span class="sl-prop__v">Sonaloop Cloud</span></div>
    <div class="sl-prop"><span class="sl-prop__k">${svgReg('personas')}Personas</span><span class="sl-prop__v">4 voices</span></div>
    <div class="sl-prop"><span class="sl-prop__k">${svgReg('clock')}Updated</span><span class="sl-prop__v">2h ago</span></div>
    <div class="sl-prop"><span class="sl-prop__k">${svgReg('check')}Status</span><span class="sl-prop__v"><span class="sl-badge sl-badge--positive">Synthesised</span></span></div>
  </div>`,
  react: `import { PropertyList, Property } from 'sonaloop-design/components';\n\n<PropertyList card>\n  <Property icon={<ProjectsIcon size={14} />} label=\"Project\">Sonaloop Cloud</Property>\n  <Property icon={<PersonasIcon size={14} />} label=\"Personas\">4 voices</Property>\n  <Property icon={<ClockIcon size={14} />} label=\"Updated\">2h ago</Property>\n</PropertyList>`,
  markup: `<div class="sl-props sl-props--card">\n  <div class="sl-prop"><span class="sl-prop__k">…Project</span><span class="sl-prop__v">Sonaloop Cloud</span></div>\n</div>`,
  python: `h("div", {"class_": "sl-prop"},\n  h("span", {"class_": "sl-prop__k"}, icon, "Project"),\n  h("span", {"class_": "sl-prop__v"}, "Sonaloop Cloud"))`,
});

const cPageHeader = () => componentPage({
  id: 'page-header', title: 'Page Header',
  desc: 'The detail-page hero: an optional top slot (eyebrow · pill · breadcrumb), an icon + title, a sub line, and trailing actions kept on the right. The same header block on every record page, so titles and actions never drift.',
  demo: `<div style="width:100%;max-width:560px">
    <header class="sl-page-header">
      <div class="sl-page-header__main">
        <div class="sl-page-header__top"><span class="sl-eyebrow">Council</span><span class="sl-pill">4 personas</span></div>
        <h1 class="sl-page-header__title">${svgReg('councils')}Pricing strategy v2</h1>
        <p class="sl-page-header__sub">Should we move to usage-based pricing for the Cloud tier?</p>
      </div>
      <div class="sl-page-header__actions"><button class="sl-btn sl-btn--sm">Export</button><button class="sl-btn sl-btn--sm sl-btn--primary">Run again</button></div>
    </header>
  </div>`,
  react: `import { PageHeader, Button, Eyebrow, Pill } from 'sonaloop-design/components';\n\n<PageHeader\n  top={<><Eyebrow>Council</Eyebrow><Pill>4 personas</Pill></>}\n  icon={<CouncilsIcon size={22} />}\n  title=\"Pricing strategy v2\"\n  sub=\"Should we move to usage-based pricing for the Cloud tier?\"\n  actions={<><Button size=\"sm\">Export</Button><Button size=\"sm\" variant=\"primary\">Run again</Button></>} />`,
  markup: `<header class="sl-page-header">\n  <div class="sl-page-header__main">\n    <h1 class="sl-page-header__title">Pricing strategy v2</h1>\n    <p class="sl-page-header__sub">…</p>\n  </div>\n  <div class="sl-page-header__actions">…</div>\n</header>`,
  python: `# _hero() in web/_components.py emits the same .sl-page-header block.`,
});

const cDetailLayout = () => componentPage({
  id: 'detail-layout', title: 'Detail Layout',
  desc: 'The record-page scaffold: a content column beside a sticky aside (a <a href="#/property-list">Property List</a>, relations, …), with the <code>&lt;PageRail&gt;</code> scrollspy minimap tracking the page’s section headings by id. The one shell every detail page extends — consistency by construction.',
  demo: `<div class="sl-detail" style="width:100%;max-width:620px;gap:24px;grid-template-columns:minmax(0,1fr) 180px">
    <div class="sl-detail__main">
      <div><h3 style="margin:0 0 6px">Summary</h3><p style="margin:0;color:var(--sl-muted)">The panel converged on usage-based pricing with a per-seat floor.</p></div>
      <div><h3 style="margin:0 0 6px">Findings</h3><p style="margin:0;color:var(--sl-muted)">Three of four voices supported the shift, conditional on a grandfather clause.</p></div>
    </div>
    <div class="sl-detail__aside">
      <nav class="sl-rail"><div class="sl-rail__head">On this page</div><a class="sl-rail__item is-active">Summary</a><a class="sl-rail__item">Findings</a><a class="sl-rail__item">Voices</a></nav>
      <div class="sl-props"><div class="sl-prop"><span class="sl-prop__k">${svgReg('clock')}Updated</span><span class="sl-prop__v">2h ago</span></div></div>
    </div>
  </div>`,
  react: `import { DetailLayout, PageRail, PropertyList, Property } from 'sonaloop-design/components';\n\n<DetailLayout aside={<>\n  <PageRail heading=\"On this page\" items={[\n    { id: 'summary', label: 'Summary' },\n    { id: 'findings', label: 'Findings' },\n  ]} />\n  <PropertyList><Property icon={<ClockIcon size={14} />} label=\"Updated\">2h ago</Property></PropertyList>\n</>}>\n  <section id=\"summary\"><h3>Summary</h3>…</section>\n  <section id=\"findings\"><h3>Findings</h3>…</section>\n</DetailLayout>`,
  markup: `<div class="sl-detail">\n  <div class="sl-detail__main"><section id="summary">…</section></div>\n  <aside class="sl-detail__aside">\n    <nav class="sl-rail"><a class="sl-rail__item is-active">Summary</a></nav>\n  </aside>\n</div>`,
  python: `# detail_page() + _page_rail() in web/_detail.py emit .sl-detail / .sl-rail.`,
});

const cChartSparkline = () => componentPage({
  id: 'chart-sparkline', title: 'Sparkline',
  desc: 'A compact, label-less trend — a filled area line for inline metrics, table cells and stat rows. Auto-scales to its data; pass <code>fill={false}</code> for a bare line. Token-driven colour, print-safe.',
  demo: `<div style="display:flex;align-items:center;gap:28px;flex-wrap:wrap">
    <span class="sl-spark" style="width:130px;height:38px"><svg viewBox="0 0 100 32" preserveAspectRatio="none" style="--c:var(--sl-accent)"><polygon class="sl-spark__fill" points="0,32 0,20 20,24 40,10 60,16 80,5 100,12 100,32"/><polyline class="sl-spark__line" points="0,20 20,24 40,10 60,16 80,5 100,12"/></svg></span>
    <span class="sl-spark" style="width:130px;height:38px"><svg viewBox="0 0 100 32" preserveAspectRatio="none" style="--c:var(--sl-green)"><polyline class="sl-spark__line" points="0,26 20,18 40,22 60,12 80,14 100,4"/></svg></span>
  </div>`,
  react: `import { Sparkline } from 'sonaloop-design/charts';\n\n<Sparkline values={[3, 5, 4, 6, 5, 8]} />\n<Sparkline values={[8, 6, 7, 4, 5, 2]} color=\"var(--sl-green)\" fill={false} width={130} />`,
  markup: `<span class="sl-spark" style="width:130px;height:38px">\n  <svg viewBox="0 0 100 32" preserveAspectRatio="none" style="--c:var(--sl-accent)">\n    <polygon class="sl-spark__fill" points="0,32 0,20 …100,32"/>\n    <polyline class="sl-spark__line" points="0,20 …100,12"/>\n  </svg>\n</span>`,
  python: `# charts.py renders the same .sl-spark SVG.`,
});

const cProse = () => componentPage({
  id: 'prose', title: 'Prose',
  desc: 'The one reading surface for rendered Markdown / long-form content — council findings, syntheses, SOUL docs, report bodies. Apply <code>.sl-prose</code> to the wrapper around the rendered HTML; headings, lists, links, inline <code>code</code>, fenced blocks, blockquotes and tables (via the shared <a href="#/table">Table</a>) are all token-driven, so the same content reads identically across the Python-SSR app and the React surfaces. Em-based — set the container’s <code>font-size</code> to scale the whole block; <code>.sl-prose--sm</code> is the denser inline/aside variant.',
  demo: `<div class="sl-prose" style="max-width:520px">
    <p>The panel converged on <strong>usage-based pricing</strong> with a per-seat floor — three of four voices supported the shift, <em>conditional</em> on a grandfather clause.</p>
    <h3>Key findings</h3>
    <ul><li>Pricing must stay legible to a non-technical buyer.</li><li>Migration needs a <code>grandfather</code> path for existing seats.</li></ul>
    <blockquote>“I’d sign tomorrow if my current plan were protected.” — Maya, Head of Product</blockquote>
  </div>`,
  variants: { cols: ['Class', 'Variant', 'Use'], rows: [
    ['.sl-prose', 'Default', 'Report / synthesis / finding bodies.'],
    ['.sl-prose--sm', 'Dense', 'Inline/aside prose — a card body, a drawer.'],
    ['.sl-prose .sl-table', 'Tables', 'GFM tables render through the shared Table.'],
  ] },
  react: `import 'sonaloop-design/components.css';\n\n// render trusted Markdown (e.g. with 'marked') into the prose surface:\n<div className=\"sl-prose\" dangerouslySetInnerHTML={{ __html: marked.parse(source) }} />`,
  markup: `<div class="sl-prose">\n  <p>Body copy with <strong>bold</strong>, <a href="#">links</a> and <code>code</code>.</p>\n  <h3>Subheading</h3>\n  <ul><li>List item</li></ul>\n  <blockquote>A quoted voice.</blockquote>\n</div>`,
  python: `# The app renders Markdown into the same .sl-prose wrapper (web _md helper).`,
});

const cFilterBar = () => componentPage({
  id: 'filter-bar', title: 'Filter Bar',
  desc: 'A Linear-style faceted filter for a list. A quiet “+ Filter” <a href="#/popover">ToolbarButton</a> opens a two-level menu — pick a facet, then toggle its values (selectable <code>.sl-menu-item</code> rows with per-value counts) — and each non-empty facet becomes a removable chip (<code>.sl-filter-chip</code>) that reopens its value menu. <b>Domain-agnostic</b>: the host passes <code>facets</code> (options · counts · current selection) and gets <code>onToggle</code> / <code>onClearFacet</code> / <code>onClearAll</code> back, so the same bar drives tickets, councils or any other list.',
  demo: (() => { const chk = '<span class="sl-menu-item__check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13l4 4L19 7"/></svg></span>'; return `<div style="width:100%;max-width:560px;margin-bottom:140px">
    <div class="sl-filter-bar">
      <div class="sl-popover-wrap">
        <button class="sl-toolbtn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h16l-6 7.5V19l-4 2v-8.5z"/></svg>Filter</button>
        <div class="sl-popover sl-popover--bottom-start" style="animation:none;min-width:13rem">
          <button class="sl-filter-back">← Status</button>
          <button class="sl-menu-item">${chk}<span class="sl-menu-item__label">In progress</span><span class="sl-menu-item__count">8</span></button>
          <button class="sl-menu-item"><span class="sl-menu-item__check"></span><span class="sl-menu-item__label">Backlog</span><span class="sl-menu-item__count">34</span></button>
          <button class="sl-menu-item"><span class="sl-menu-item__check"></span><span class="sl-menu-item__label">Done</span><span class="sl-menu-item__count">12</span></button>
        </div>
      </div>
      <span class="sl-filter-chip">
        <button class="sl-filter-chip__body"><span class="sl-filter-chip__key">Status</span><span class="sl-filter-chip__op">is</span><span class="sl-filter-chip__val">In progress</span></button>
        <button class="sl-filter-chip__x" aria-label="Clear"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
      </span>
      <button class="sl-filter-clear">Clear</button>
    </div>
  </div>`; })(),
  react: `import { FilterBar, type FilterFacet } from 'sonaloop-design/components';\n\nconst facets: FilterFacet[] = [{\n  key: 'statuses', label: 'Status', icon: <StatusGlyph status=\"todo\" />,\n  selected: filter.statuses,\n  summary: filter.statuses.map((s) => STATUS_LABEL[s]).join(', '),\n  options: STATUSES.map((s) => ({ value: s, count: countOf(s), label: <><StatusGlyph status={s} /> {STATUS_LABEL[s]}</> })),\n}];\n\n<FilterBar facets={facets}\n  onToggle={(key, v) => toggle(key, v)}\n  onClearFacet={(key) => clearFacet(key)}\n  onClearAll={() => setFilter(EMPTY)} />`,
  markup: `<div class="sl-filter-bar">\n  <button class="sl-toolbtn">Filter</button>\n  <span class="sl-filter-chip">\n    <button class="sl-filter-chip__body">Status is In progress</button>\n    <button class="sl-filter-chip__x">✕</button>\n  </span>\n</div>`,
  python: `# Same .sl-filter-bar / .sl-filter-chip + .sl-menu-item contract from the SSR app.`,
});

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
    { id: 'logo', title: 'Logo', ico: 'sonaloop', render: cLogo },
    { id: 'card', title: 'Card', ico: 'rectangle', render: cCard },
    { id: 'note', title: 'Note', ico: 'bulb', render: cNote },
    { id: 'stat', title: 'Stat', ico: 'analytics', render: cStat },
    { id: 'progress', title: 'Progress', ico: 'wave', render: cProgress },
    { id: 'segmented', title: 'Segmented · Tabs', ico: 'squareCols', render: cSegmented },
    { id: 'tabs', title: 'Tabs', ico: 'squareCols', render: cTabs },
    { id: 'theme-toggle', title: 'Theme Toggle', ico: 'monitor', render: cThemeToggle },
    { id: 'table', title: 'Table', ico: 'squareRows', render: cTable },
    { id: 'breadcrumb', title: 'Breadcrumb', ico: 'caretRight', render: cBreadcrumb },
    { id: 'snippet', title: 'Snippet · Code', ico: 'jtbd', render: cSnippet },
    { id: 'prose', title: 'Prose', ico: 'report', render: cProse },
    { id: 'eyebrow', title: 'Eyebrow', ico: 'wave', render: cEyebrow },
    { id: 'input', title: 'Input', ico: 'search', render: cInput },
    { id: 'textarea', title: 'Textarea', ico: 'pencil', render: cTextarea },
    { id: 'select', title: 'Select', ico: 'chevron', render: cSelect },
    { id: 'checkbox', title: 'Checkbox', ico: 'check', render: cCheckbox },
    { id: 'radio', title: 'Radio', ico: 'circle', render: cRadio },
    { id: 'switch', title: 'Switch', ico: 'exchange', render: cSwitch },
    { id: 'kbd', title: 'Kbd', ico: 'squareSplit', render: cKbd },
    { id: 'divider', title: 'Divider', ico: 'exchange', render: cDivider },
    { id: 'arrow-link', title: 'Arrow Link', ico: 'arrowRight', render: cArrowLink },
    { id: 'property-list', title: 'Property List', ico: 'squareRows', render: cPropertyList },
    { id: 'page-header', title: 'Page Header', ico: 'panel', render: cPageHeader },
  ] },
  { label: 'Charts', items: [
    { id: 'chart-bar', title: 'Bar', ico: 'analytics', render: cChartBar },
    { id: 'chart-pie', title: 'Pie · Donut', ico: 'half', render: cChartPie },
    { id: 'chart-effort-impact', title: 'Effort · Impact', ico: 'target', render: cChartEffort },
    { id: 'chart-stacked', title: 'Stacked Bar', ico: 'squareRows', render: cChartStacked },
    { id: 'chart-gauge', title: 'Gauge · Radial', ico: 'continuousDiscovery', render: cChartGauge },
    { id: 'chart-diverging', title: 'Diverging Bar', ico: 'exchange', render: cChartDiverging },
    { id: 'chart-heatmap', title: 'Heatmap · Matrix', ico: 'squareGrid', render: cChartHeatmap },
    { id: 'chart-dot-plot', title: 'Dot · Range', ico: 'wave', render: cChartDotPlot },
    { id: 'chart-line', title: 'Line · Trend', ico: 'analytics', render: cChartLine },
    { id: 'chart-sparkline', title: 'Sparkline', ico: 'wave', render: cChartSparkline },
  ] },
  { label: 'Composites', items: [
    { id: 'app-shell', title: 'App Shell', ico: 'panel', render: cAppShell },
    { id: 'command-palette', title: 'Command Palette ⌘K', ico: 'search', render: cCommandPalette },
    { id: 'drawer', title: 'Drawer · Slide-over', ico: 'panel', render: cDrawer },
    { id: 'modal', title: 'Modal · Dialog', ico: 'square', render: cModal },
    { id: 'popover', title: 'Popover · Menu', ico: 'squareSplit', render: cPopover },
    { id: 'detail-layout', title: 'Detail Layout', ico: 'squareRows', render: cDetailLayout },
    { id: 'filter-bar', title: 'Filter Bar', ico: 'half', render: cFilterBar },
    { id: 'entity', title: 'Entity', ico: 'projects', render: cEntity },
    { id: 'field', title: 'Field · Fieldset', ico: 'settings', render: cField },
    { id: 'empty-state', title: 'Empty State', ico: 'square', render: cEmptyState },
  ] },
  { label: 'Website', items: [
    { id: 'web-navbar', title: 'Navbar', ico: 'panel', render: () => websitePage({
      id: 'web-navbar', block: 'navbar', title: 'Navbar',
      desc: 'The marketing-site top bar: brand · mega-menu triggers · pricing · the primary Install action, with a hamburger below <code>lg</code>. Shown here with the <b>Solutions mega-menu open</b> (a two-column items grid beside a promo card) — it opens on hover-intent and never appears on its own. Pass <code>initialOpenKey</code> to render a panel open.',
      usage: `import { Navbar } from 'sonaloop-design/website';\nimport { megaMenus } from './content/nav';\nimport { useLocation } from 'react-router';\n\n<Navbar menus={megaMenus} currentPath={useLocation().pathname} transparent />` }) },
    { id: 'web-cards', title: 'Cards', ico: 'rectangle', render: () => websitePage({
      id: 'web-cards', block: 'cards', title: 'Cards',
      desc: 'One card concept, several variants. <code>ContentCard</code> is the base — <code>FeatureCard</code> (icon · title · body · action arrow) and <code>LinkCard</code> (the whole-card cross-link; a <code>RelatedRail</code> is just a <code>CardGrid</code> of them) are presets of it. <code>OfferCard</code> is the tier/ladder card (<code>PricingCard</code> / <code>LadderCard</code> presets); <code>VerdictCard</code> is the council proof (always in a grid); and <code>SnippetCard</code> is a feature card with a recessed product-peek stage. All laid out by <code>CardGrid</code>.',
      usage: `import { CardGrid, FeatureCard, LinkCard, RelatedRail, OfferCard, PricingCard, LadderCard } from 'sonaloop-design/website';\n\n// feature\n<CardGrid><FeatureCard icon={<Icon name=\"councils\" size={28} />} title=\"Councils\" action={{ to: '/x', label: 'Explore' }}>…</FeatureCard></CardGrid>\n\n// link (RelatedRail = CardGrid of LinkCards)\n<RelatedRail items={[{ to: '/solutions/x', label: 'Continuous discovery', description: '…', icon: 'continuous-discovery' }]} />\n\n// offer — PricingCard & LadderCard are presets of OfferCard\n<PricingCard name=\"Cloud\" priceLine=\"from €39/mo\" icon=\"cloud\" accent=\"scan\" highlight tag=\"Popular\"\n  inherits=\"Open Core\" features={['Hosted councils & memory']} cta={{ label: 'Start trial', to: '/install' }} />\n<LadderCard name=\"Cloud\" index={1} icon=\"cloud\" accent=\"scan\" priceLine=\"from €39/mo\"\n  summary=\"Hosted councils & memory.\" bullets={['Semantic recall']} primaryCta={{ label: 'Start trial', to: '/install' }} learnMoreTo=\"/products/cloud\" />` }) },
    { id: 'web-hero', title: 'Hero', ico: 'star', render: () => websitePage({
      id: 'web-hero', block: 'hero', title: 'Hero',
      desc: 'The page hero: a mono eyebrow, a balanced serif headline, a lead paragraph and a pair of <code>.sl-btn</code> CTAs, with an optional painterly canvas backdrop.',
      usage: `import { Hero } from 'sonaloop-design/website';\nimport { canvas } from 'sonaloop-design/images';\n\n<Hero kicker=\"Synthetic research\" canvas={canvas}\n  title=\"A focus group that disagrees with you — on the record.\"\n  cta={{ label: 'Install MCP — free', to: '/install' }}\n  secondary={{ label: 'See a sample report', to: '/sample-report' }}>\n  Spin up a deliberative synthetic panel on your own AI.\n</Hero>` }) },
    { id: 'web-footer', title: 'Footer', ico: 'squareRows', render: () => websitePage({
      id: 'web-footer', block: 'footer', title: 'Footer',
      desc: 'The <b>full site footer</b> — the CTA band and the column nav shipped together (they always pair, so they share one page). <code>Footer</code> embeds <code>CtaBand</code> via its default <code>cta</code> prop, so this is the real composition every page renders; pass <code>cta={false}</code> only when a standalone CtaBand already sits above.',
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
    { id: 'web-layout', title: 'Layout · Section', ico: 'squareRows', render: () => websitePage({
      id: 'web-layout', block: 'layout', title: 'Layout · Section',
      desc: 'The page scaffolding used on every page: <code>PageSection</code> (measure + vertical rhythm), <code>SectionIntro</code> (kicker · balanced title · lead), <code>NoteBand</code> (dashed mono aside) and <code>PageRuler</code> (a hairline divider on the measure).',
      usage: `import { PageSection, SectionIntro, NoteBand, PageRuler } from 'sonaloop-design/website';\n\n<PageSection spacing=\"compact\">\n  <SectionIntro index=\"01\" kicker=\"How it works\" title=\"One engine, three ways.\" rule>\n    A calm section header with a lead paragraph.\n  </SectionIntro>\n  <NoteBand>Prices are placeholders pending validation.</NoteBand>\n  <PageRuler className=\"mt-10\" />\n</PageSection>` }) },
    { id: 'web-content-atoms', title: 'Content Atoms', ico: 'check', render: () => websitePage({
      id: 'web-content-atoms', block: 'content-atoms', title: 'Content Atoms',
      desc: 'The genuine non-card content atoms: <code>CheckRow</code> (checklist item, <code>muted</code> variant), <code>StepRows</code> (a numbered bordered stack) and <code>FieldList</code> (2-up label/value). (A numbered <em>card</em> is just <code>&lt;FeatureCard eyebrow="01"&gt;</code> — see Cards.)',
      usage: `import { CheckRow, FieldList, StepRows } from 'sonaloop-design/website';\n\n<ul className=\"space-y-2.5\">\n  <CheckRow>React in hours, not weeks</CheckRow>\n  <CheckRow muted>Optional extra</CheckRow>\n</ul>\n<StepRows steps={[{ n: '01', label: 'Persona', desc: '…' }]} />` }) },
    { id: 'web-install-block', title: 'Install Block', ico: 'jtbd', render: () => websitePage({
      id: 'web-install-block', block: 'install-block', title: 'Install Block',
      desc: 'The MCP setup block — a <code>Segmented</code> client picker (Claude Code · Cursor · Codex) over the one-liner / config, with a copy button. Self-contained; <code>dark</code> pins the dusk surface.',
      usage: `import { InstallBlock } from 'sonaloop-design/website';\n\n<InstallBlock />\n// on a dark surface:\n<InstallBlock dark />` }) },
    { id: 'web-faq', title: 'FAQ List', ico: 'bulb', render: () => websitePage({
      id: 'web-faq', block: 'faq', title: 'FAQ List',
      desc: 'A divide-y question/answer stack — the same FAQ pattern that repeats across Pricing, Install and Home, now one component.',
      usage: `import { FaqList } from 'sonaloop-design/website';\n\n<FaqList items={[\n  { q: 'Why is local free?', a: 'Your own AI writes the text — we sell methodology, not tokens.' },\n  { q: 'Do I need an API key?', a: 'No, not for the core.' },\n]} />` }) },
  ] },
];

const FLAT = NAV.flatMap((g) => g.items);
const byId = (id) => FLAT.find((i) => i.id === id);

/* ── sidebar ──────────────────────────────────────────────────────────────────── */
// Accordion nav: only the section you're currently in is open. Every group renders
// collapsed; renderPage opens the active one (and collapses the rest) on each navigation.
// Components, Charts and Website list alphabetically in the nav; Foundations & Brands keep their curated order.
const NAV_ALPHA = new Set(['Components', 'Charts', 'Website']);
function renderSidebar() {
  $('#sidebar').innerHTML = NAV.map((g) => {
    const items = NAV_ALPHA.has(g.label)
      ? [...g.items].sort((a, b) => a.title.localeCompare(b.title))
      : g.items;
    return `
    <div class="sl-nav-group is-collapsed" data-group="${esc(g.label)}">
      <button type="button" class="sl-navhead" data-nav-toggle="${esc(g.label)}" aria-expanded="false">
        <span>${esc(g.label)}</span>
        <span class="sl-navhead__caret">${svgReg('chevron')}</span>
      </button>
      <nav class="sl-nav">
        ${items.map((it) => `<a href="#/${it.id}" data-nav="${it.id}">${esc(it.title)}</a>`).join('')}
      </nav>
    </div>`;
  }).join('');
}

function setGroupCollapsed(sec, collapsed) {
  sec.classList.toggle('is-collapsed', collapsed);
  sec.querySelector('.sl-navhead')?.setAttribute('aria-expanded', String(!collapsed));
}

// Clicking a section header toggles just that group (lets you peek without navigating).
function toggleNavGroup(label) {
  const sec = document.querySelector(`.sl-nav-group[data-group="${CSS.escape(label)}"]`);
  if (sec) setGroupCollapsed(sec, !sec.classList.contains('is-collapsed'));
}

// On navigation, open the active page's group and collapse every other — so leaving a
// section closes it again.
function syncActiveGroup(id) {
  const label = NAV.find((g) => g.items.some((it) => it.id === id))?.label;
  document.querySelectorAll('.sl-nav-group').forEach((sec) =>
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
  document.querySelectorAll('.sl-nav a').forEach((a) =>
    a.classList.toggle('is-active', a.dataset.nav === id));
  const crumb = $('#crumb');
  if (crumb) {
    const sec = NAV.find((g) => g.items.some((it) => it.id === id))?.label || '';
    crumb.innerHTML = `<span class="sl-breadcrumb__link">${esc(sec)}</span><span class="sl-breadcrumb__sep" aria-hidden="true"></span><span class="sl-breadcrumb__current">${esc(item.title)}</span>`;
  }
  document.title = `Design | sonaloop · ${item.title}`;
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

  // Website-preview controls: toggle the option, recompute the combination key, swap the
  // pre-rendered variant into the stage. Keys mirror the harness: `prop:optKey|prop2:optKey2`.
  const wbOpt = e.target.closest('[data-wb-opt]');
  if (wbOpt) {
    wbOpt.parentElement.querySelectorAll('[data-wb-opt]').forEach((b) => b.classList.toggle('is-active', b === wbOpt));
    const root = wbOpt.closest('[data-wb]');
    const data = websiteBlocks[root.dataset.wb];
    const key = data.controls.map((c) => {
      const active = root.querySelector(`[data-wb-ctrl="${c.prop}"] .is-active`);
      return `${c.prop}:${active.dataset.wbOpt}`;
    }).join('|');
    root.querySelector('[data-wb-stage]').innerHTML = data.variants[key] ?? data.variants[data.defaultKey];
    return;
  }

  const codeTab = e.target.closest('[data-codetab]');
  if (codeTab) {
    const root = codeTab.closest('[data-codetabs]');
    const i = codeTab.dataset.codetab;
    root.querySelectorAll('[data-codetab]').forEach((b) => b.classList.toggle('is-active', b === codeTab));
    root.querySelectorAll('[data-codepanel]').forEach((p) => p.classList.toggle('is-hidden', p.dataset.codepanel !== i));
    return;
  }

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

// Results grouped under muted section headers (Pages · Icons), Linear/Raycast-style.
const PALETTE_GROUPS = [{ kind: 'Page', label: 'Pages' }, { kind: 'Icon', label: 'Icons' }];
let paletteActive = 0;
function renderPaletteList(q) {
  q = q.trim().toLowerCase();
  const matches = (q ? PALETTE_ITEMS.filter((i) => i.title.toLowerCase().includes(q) || i.kind.toLowerCase().includes(q)) : PALETTE_ITEMS.filter((i) => i.kind === 'Page')).slice(0, 40);
  paletteActive = 0;
  const list = $('#palette-list');
  if (!matches.length) { list.innerHTML = `<div class="sl-cmdk-empty">No matches for “${esc(q)}”.</div>`; return; }
  let i = 0, html = '';
  for (const { kind, label } of PALETTE_GROUPS) {
    const g = matches.filter((m) => m.kind === kind);
    if (!g.length) continue;
    html += `<div class="sl-cmdk-sec">${esc(label)}</div>`;
    html += g.map((m) => {
      const ico = m.iconName ? svgReg(m.iconName) : (m.ico ? svgReg(m.ico) : '');
      return `<div class="sl-cmdk-item${i === 0 ? ' is-active' : ''}" data-href="${m.href}" data-i="${i++}">
        <span class="sl-cmdk-ico">${ico}</span>
        <span class="sl-cmdk-title">${esc(m.title)}</span>
      </div>`;
    }).join('');
  }
  list.innerHTML = html;
}

function paletteGo(el) { if (!el) return; location.hash = el.dataset.href; closePalette(); }

/* ── boot ─────────────────────────────────────────────────────────────────────── */
/* App-shell behaviour — the vanilla-JS counterpart of the React <AppShell> / SHELL_JS:
   collapse ([ or the topbar toggle), drag-resize the sidebar, and the bottom settings popover. */
function initShell() {
  const app = $('#app');
  const rz = $('#rz');
  try {
    if (localStorage.getItem('ds-shell:open') === 'false') app.classList.add('is-collapsed');
    const w = localStorage.getItem('ds-shell:width');
    if (w) app.style.setProperty('--sl-sidebar-w', `${w}px`);
  } catch { /* ignore */ }
  const toggle = () => {
    app.classList.toggle('is-collapsed');
    try { localStorage.setItem('ds-shell:open', String(!app.classList.contains('is-collapsed'))); } catch { /* ignore */ }
  };
  document.addEventListener('click', (e) => {
    if (e.target.closest && e.target.closest('[data-sidebar-toggle]')) { e.preventDefault(); toggle(); }
  });
  document.addEventListener('keydown', (e) => {
    const tag = (e.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
    if (e.key === '[') { e.preventDefault(); toggle(); }
  });

  // bottom settings popover
  const um = $('#usermenu');
  const umb = $('#umbtn');
  const ump = $('#umpop');
  const setMenu = (open) => {
    um.classList.toggle('is-open', open);
    if (ump) ump.hidden = !open;
    if (umb) umb.setAttribute('aria-expanded', String(open));
  };
  if (umb) umb.addEventListener('click', (e) => { e.stopPropagation(); setMenu(!um.classList.contains('is-open')); });
  document.addEventListener('click', (e) => { if (um.classList.contains('is-open') && !um.contains(e.target)) setMenu(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

  // drag-resize
  if (rz) {
    let sx = 0; let sw = 264; let resizing = false; let last = 264;
    rz.addEventListener('pointerdown', (e) => {
      e.preventDefault(); resizing = true; sx = e.clientX;
      sw = parseInt(getComputedStyle(app).getPropertyValue('--sl-sidebar-w'), 10) || 264;
      document.body.style.cursor = 'col-resize'; document.body.style.userSelect = 'none';
      rz.setPointerCapture(e.pointerId);
    });
    rz.addEventListener('pointermove', (e) => {
      if (!resizing) return;
      const next = sw + (e.clientX - sx);
      if (next <= 32) { app.classList.add('is-collapsed'); }
      else { last = Math.max(200, Math.min(420, next)); app.style.setProperty('--sl-sidebar-w', `${last}px`); app.classList.remove('is-collapsed'); }
    });
    rz.addEventListener('pointerup', () => {
      if (!resizing) return; resizing = false;
      document.body.style.cursor = ''; document.body.style.userSelect = '';
      try { localStorage.setItem('ds-shell:width', String(last)); } catch { /* ignore */ }
    });
  }
}

function boot() {
  // brand mark + settings-menu glyphs
  $('#brand-mark').innerHTML = svgReg('sonaloop');
  $('#um-ico').innerHTML = svgReg('settings');
  $('#um-caret').innerHTML = svgReg('chevron');
  initShell();
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
  $('#palette-list').addEventListener('click', (e) => paletteGo(e.target.closest('.sl-cmdk-item')));
  $('#palette-list').addEventListener('mousemove', (e) => {
    const el = e.target.closest('.sl-cmdk-item'); if (!el) return;
    const i = +el.dataset.i; if (i !== paletteActive) { paletteActive = i; syncActive([...$('#palette-list').querySelectorAll('.sl-cmdk-item')]); }
  });
  $('#palette-input').addEventListener('input', (e) => renderPaletteList(e.target.value));

  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); $('#palette').hidden ? openPalette() : closePalette(); return; }
    if ($('#palette').hidden) return;
    const items = [...$('#palette-list').querySelectorAll('.sl-cmdk-item')];
    if (e.key === 'Escape') { closePalette(); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); paletteActive = Math.min(paletteActive + 1, items.length - 1); syncActive(items); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); paletteActive = Math.max(paletteActive - 1, 0); syncActive(items); }
    else if (e.key === 'Enter') { e.preventDefault(); paletteGo(items[paletteActive]); }
  });
}

function syncActive(items) {
  items.forEach((el, i) => el.classList.toggle('is-active', i === paletteActive));
  items[paletteActive]?.scrollIntoView({ block: 'nearest' });
}

boot();
