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

const copyIco = () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>';

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
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>
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

  return `
    <h1 class="ds-h1">Sonaloop Design System</h1>
    <p class="ds-lead">The single source of truth for building consistent Sonaloop experiences — the React marketing site and the Python-SSR inspector, skinned from one set of tokens, icons and components.</p>
    <div class="ds-hero-grid">
      ${cell('#/brand', `<div class="ds-canvas-brand">${svgReg('sonaloop')}<span>Sonaloop</span></div>`, 'Brand Assets', 'How to work with the Sonaloop mark and wordmark.')}
      ${cell('#/icons', iconsCanvas, 'Icons', 'A stroke icon set tailored for research &amp; council tools.')}
      ${cell('#/button', compCanvas, 'Components', 'Building blocks shared across React and Python SSR.')}
      ${cell('#/colors', `<div class="ds-canvas-colors">${colorBars}</div>`, 'Colors', 'A near-white warm light + cool dark, accessible system.')}
      ${cell('#/layout', `<div class="ds-canvas-grid"></div>`, 'Layout', 'Spacing, radii and the grid that hold every surface together.')}
      ${cell('#/typography', `<div class="ds-canvas-type"><span>Geist Sans</span><span class="mono">Geist Mono</span></div>`, 'Typeface', 'Geist Sans &amp; Geist Mono — built for product UIs.')}
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
    ${p('A bitmap display face for special technical moments — loaders, council ids, a "research instrument" flourish. <b>Never for body text.</b> It ships in five pixel "fills"; compare them below and pick the one that best resembles the brand (the loop mark leans soft &amp; rounded — see BRANDING.md). The default <code>--sl-pixel</code> family is the Square fill.')}
    <div class="ds-pixel-grid">
      ${[
        ['Square', "'Sona Pixel'", 'Canonical pixel — crisp, technical, neutral.'],
        ['Circle', "'Sona Pixel Circle'", 'Soft, rounded dots — closest to the loop mark. ★ brand-leaning.'],
        ['Grid', "'Sona Pixel Grid'", 'Pixels with gaps — schematic, blueprint-y.'],
        ['Line', "'Sona Pixel Line'", 'Lightest, most diagrammatic.'],
        ['Triangle', "'Sona Pixel Triangle'", 'Most decorative / playful.'],
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

/* ── nav model ─────────────────────────────────────────────────────────────────── */
const NAV = [
  { label: 'Foundations', items: [
    { id: 'introduction', title: 'Introduction', ico: 'overview', render: pageIntroduction },
    { id: 'colors', title: 'Colors', ico: 'half', render: pageColors },
    { id: 'typography', title: 'Typography', ico: 'pencil', render: pageTypography },
    { id: 'materials', title: 'Materials', ico: 'panel', render: pageMaterials },
    { id: 'layout', title: 'Layout', ico: 'squareGrid', render: pageLayout },
    { id: 'icons', title: 'Icons', ico: 'star', render: pageIcons },
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
    { id: 'note', title: 'Note', ico: 'bulb', render: cNote },
    { id: 'stat', title: 'Stat', ico: 'analytics', render: cStat },
    { id: 'progress', title: 'Progress', ico: 'wave', render: cProgress },
    { id: 'segmented', title: 'Segmented · Tabs', ico: 'squareCols', render: cSegmented },
    { id: 'table', title: 'Table', ico: 'squareRows', render: cTable },
    { id: 'breadcrumb', title: 'Breadcrumb', ico: 'caretRight', render: cBreadcrumb },
    { id: 'empty-state', title: 'Empty State', ico: 'square', render: cEmptyState },
    { id: 'snippet', title: 'Snippet · Code', ico: 'jtbd', render: cSnippet },
    { id: 'eyebrow', title: 'Eyebrow', ico: 'wave', render: cEyebrow },
    { id: 'input', title: 'Input', ico: 'search', render: cInput },
    { id: 'kbd', title: 'Kbd', ico: 'squareSplit', render: cKbd },
    { id: 'divider', title: 'Divider', ico: 'exchange', render: cDivider },
    { id: 'arrow-link', title: 'Arrow Link', ico: 'arrowRight', render: cArrowLink },
  ] },
];

const FLAT = NAV.flatMap((g) => g.items);
const byId = (id) => FLAT.find((i) => i.id === id);

/* ── sidebar ──────────────────────────────────────────────────────────────────── */
function renderSidebar() {
  $('#sidebar').innerHTML = NAV.map((g) => `
    <div class="ds-nav-group">
      <p class="ds-nav-label">${esc(g.label)}</p>
      ${g.items.map((it) => `
        <a class="ds-nav-item" href="#/${it.id}" data-nav="${it.id}">
          <span class="ds-nav-ico">${it.ico ? svgReg(it.ico) : ''}</span>${esc(it.title)}
        </a>`).join('')}
    </div>`).join('');
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
async function copyText(text, feedbackEl) {
  try { await navigator.clipboard.writeText(text); } catch { /* ignore */ }
  if (feedbackEl) {
    const span = feedbackEl.querySelector('span');
    const prev = span ? span.textContent : null;
    if (span) { span.textContent = 'Copied'; setTimeout(() => { span.textContent = prev; }, 1100); }
  }
}

document.addEventListener('click', (e) => {
  const copyBtn = e.target.closest('[data-copy]');
  if (copyBtn) {
    const codeEl = document.getElementById(copyBtn.dataset.copy);
    if (codeEl) copyText(codeEl.textContent, copyBtn);
    return;
  }
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
});

function flash(el) {
  el.style.transition = 'outline-color .1s';
  el.style.outline = '2px solid var(--sl-accent)';
  setTimeout(() => { el.style.outline = ''; }, 280);
}

/* ── theme ────────────────────────────────────────────────────────────────────── */
function setTheme(t) {
  document.documentElement.dataset.theme = t;
  try { localStorage.setItem('ds-theme', t); } catch { /* ignore */ }
  document.querySelectorAll('[data-theme-set]').forEach((b) =>
    b.classList.toggle('is-active', b.dataset.themeSet === t));
  // re-render so theme-dependent values (colour hex, surface tiles) refresh
  renderPage();
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
  // theme: stored → system → light
  let t = 'light';
  try { t = localStorage.getItem('ds-theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'); } catch { /* ignore */ }
  document.documentElement.dataset.theme = t;
  document.querySelectorAll('[data-theme-set]').forEach((b) => {
    b.classList.toggle('is-active', b.dataset.themeSet === t);
    b.addEventListener('click', () => setTheme(b.dataset.themeSet));
  });

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
