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

// ── Theme-independent scales (emitted once into the inspector :root) ──────────────
export const scales = {
  radius: '8px', 'radius-sm': '6px', 'row-h': '48px', ease: 'cubic-bezier(.4,0,.2,1)',
  mono: '"Geist Mono",ui-monospace,SFMono-Regular,Menlo,monospace',
  't-xs': '11px', 't-sm': '12px', 't-body': '13px', 't-md': '15px', 't-prose': '16px', 't-lg': '18px', 't-xl': '24px',
  's-1': '4px', 's-2': '8px', 's-3': '12px', 's-4': '16px', 's-5': '20px', 's-6': '24px', 's-8': '32px',
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
