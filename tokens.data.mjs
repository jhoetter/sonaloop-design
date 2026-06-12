/**
 * Design tokens — the single source of truth for Sonaloop's colour system.
 * Author values here ONCE; `node scripts/gen-tokens.mjs` emits:
 *   styles/tokens.css              R G B triplets, website var names (Tailwind)
 *   py/sonaloop_icons/tokens.py    hex CSS string, inspector var names (sonaloop app)
 * Both consumers keep their own var names — only the VALUES live here, so the
 * website and the app can never drift again. See BRANDING.md.
 *
 * Brand: near-white warm-neutral light + cool dark (#101113). Indigo accent
 * #5e6ad2, used sparingly. Dark is the canonical cool palette (not warm-espresso).
 */

// ── Shared brand primitives (identical on every surface; change once, both update) ──
const C = {
  // light
  ink: '#1a1815', muted: '#635e56',
  indigo: '#5e6ad2', indigoDeep: '#4a54c4', indigo2: '#7c84e8',
  blue: '#3d7fc4', violet: '#7a5ed1', green: '#3d9b6b', amber: '#b87a25', red: '#cf4d5f', skep: '#c2683f',
  // dark
  inkD: '#e6e7ea', mutedD: '#8a8f98',
  indigoD: '#7c84e8', indigo2D: '#9ea4ff',
  blueD: '#5e9fe0', violetD: '#9a8cff', greenD: '#4cb782', amberD: '#d9a23b', redD: '#e0566a', skepD: '#d98a63',
};

// ── Fonts (shared: website Tailwind fontFamily + inspector body/--mono) ───────────
// "Sona" / "Sona Mono" are Sonaloop's OWN typeface names — the brand-stable vocabulary the
// whole system speaks in. They are self-hosted from /fonts (styles/fonts.css). Today Sona is
// *built on* Geist (SIL OFL-1.1, vendored unmodified); the Geist names stay in the stack as a
// resilience fallback, then Inter / system-ui. Swapping the underlying face later (see the
// "Sona roadmap" in BRANDING.md) touches only /fonts + styles/fonts.css — no component churn.
export const fonts = {
  sans: ['"Sona"', '"Geist"', '"Inter"', 'system-ui', 'sans-serif'],
  // serif kept as an alias to Sona so existing `font-serif` headline usages need no churn
  serif: ['"Sona"', '"Geist"', '"Inter"', 'system-ui', 'sans-serif'],
  mono: ['"Sona Mono"', '"Geist Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
  // Sona Pixel — display/accent ONLY (loaders, council ids, "research instrument" flourishes).
  // Sonaloop's OWN clean-room face (no third-party outlines). Default fill = Square; the Loop /
  // Square / Grid / Line fills are separate families (see styles/fonts.css + build_sona_pixel.py).
  pixel: ['"Sona Pixel"', 'ui-monospace', 'monospace'],
};

// ── Theme-independent scales (emitted once into the inspector :root) ──────────────
export const scales = {
  // Radius scale — the SINGLE lever for corner roundness across the website + inspector.
  // Change these and every surface re-skins (go sharp by dropping them toward 0).
  'radius-sm': '6px', radius: '8px', 'radius-lg': '12px', 'radius-full': '9999px',
  // Density — row heights, measured from what the app actually ships and snapped to the
  // 4px grid (see the "Spacing & density" docs page + BRANDING.md):
  //   row-dense  32  the data row (project outline rows, sidebar nav, menu rows)
  //   row        40  the default list row (index/library rows, entity rows)
  //   row-h      48  the chrome row (topbar, sidebar brand, drawer head) — touch-safe
  //   ctl-sm     28  the small square control (icon buttons, calendar arrows)
  // Buttons/inputs stay em-based on purpose (≈30px in the 13px app, ≈36px on the 16px
  // site) — density tokens are for px-sized rows and chrome, not for the em layer.
  'row-dense': '32px', row: '40px', 'row-h': '48px', 'ctl-sm': '28px',
  ease: 'cubic-bezier(.4,0,.2,1)',
  sans: fonts.sans.join(','),
  mono: fonts.mono.join(','),
  pixel: fonts.pixel.join(','),
  // Type scale (the t-* steps; ux-contract §11 T1 gates every rendered size against it):
  //   t-xs 11 eyebrows/micro-meta · t-sm 12 quiet meta/chips · t-body 13 the app UI voice ·
  //   t-md 15 dense reading (turn cards, report base) · t-prose 16 document prose ·
  //   t-lg 18 leads (verdict/question) · t-xl 24 page titles · t-2xl 32 report covers
  't-xs': '11px', 't-sm': '12px', 't-body': '13px', 't-md': '15px', 't-prose': '16px', 't-lg': '18px', 't-xl': '24px', 't-2xl': '32px',
  // Reading measure — the max line length for RUNNING prose (council turns, exec summaries,
  // report sections, verdict/note bodies). Structural elements (rows, charts, rails, headers)
  // keep their container measure; prose stays left-aligned inside it (§11 T2).
  'measure-prose': '70ch',
  's-1': '4px', 's-2': '8px', 's-3': '12px', 's-4': '16px', 's-5': '20px', 's-6': '24px', 's-8': '32px',
  // Vertical rhythm — semantic gap aliases over the s-scale. The ruleset (docs page):
  //   rows in a list      gap 0 + a 1px hairline separator (never gaps between rows)
  //   gap-tight     4px   icon↔label, title↔subtitle, chips in a cluster
  //   gap-item      8px   siblings inside a group (fields in a form, actions in a bar)
  //   gap-group    12px   cards in a grid, groups inside a panel, heading→content
  //   gap-section  24px   between sections of a page / drawer body padding
  //   gap-region   32px   page regions (content column ↔ aside rail)
  // 1–3px stay literal in CSS (optical hairlines/micro-nudges, not rhythm).
  'gap-tight': '4px', 'gap-item': '8px', 'gap-group': '12px', 'gap-section': '24px', 'gap-region': '32px',
};

// ── Website (Tailwind, R G B triplets). NOTE: --line is a BASE colour used at low
// opacity (rgb(var(--line)/0.1)) → ink in light, a quiet grey in dark. ───────────────
export const website = {
  light: {
    paper: '#faf8f3', 'paper-2': '#f1efe8', ink: C.ink, 'ink-2': C.muted, line: C.ink,
    'blueprint-deep': C.indigoDeep, blueprint: C.indigo, 'blueprint-2': C.indigo2, 'blueprint-3': '#ecebf8',
    'scan-blue': C.blue, 'scan-glow': C.indigo2, gold: C.violet, 'gold-2': '#eeeaf8',
  },
  dark: {
    paper: '#101113', 'paper-2': '#1c1d21', ink: C.inkD, 'ink-2': C.mutedD, line: C.mutedD,
    'blueprint-deep': C.indigoD, blueprint: C.indigoD, 'blueprint-2': C.indigo2D, 'blueprint-3': '#1d2030',
    'scan-blue': C.blueD, 'scan-glow': C.indigo2D, gold: C.violetD, 'gold-2': '#2a2a33',
  },
};

// ── Inspector (sonaloop app, hex). Richer structural set; shadows are theme-dependent. ──
export const inspector = {
  light: {
    bg: '#faf8f3', sidebar: '#f6f4ef', panel: '#ffffff', 'panel-2': '#f1efe8', overlay: '#ffffff',
    line: '#e9e5db', 'line-2': '#f0ede5', ink: C.ink, muted: C.muted, faint: '#8c857a',
    accent: C.indigo, 'accent-ink': '#ffffff', 'accent-weak': '#ecebf8', hover: '#f4f1ea', sel: '#ece9df',
    green: C.green, amber: C.amber, red: C.red, violet: C.violet, skep: C.skep, blue: C.blue,
    'shadow-sm': '0 1px 2px rgba(26,24,21,.05)',
    'shadow-lg': '0 8px 28px rgba(26,24,21,.12),0 1px 2px rgba(26,24,21,.07)',
  },
  dark: {
    bg: '#101113', sidebar: '#0d0e10', panel: '#16171a', 'panel-2': '#1c1d21', overlay: '#1a1b1e',
    line: '#23252a', 'line-2': '#1b1d21', ink: C.inkD, muted: C.mutedD, faint: '#6b7076',
    accent: C.indigoD, 'accent-ink': '#ffffff', 'accent-weak': '#1d2030', hover: '#1a1b1f', sel: '#1f2128',
    green: C.greenD, amber: C.amberD, red: C.redD, violet: C.violetD, skep: C.skepD, blue: C.blueD,
    'shadow-sm': '0 1px 2px rgba(0,0,0,.4)',
    'shadow-lg': '0 8px 28px rgba(0,0,0,.45),0 1px 2px rgba(0,0,0,.3)',
  },
};
