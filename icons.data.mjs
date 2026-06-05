/**
 * persona-icons — single source of truth.
 *
 * Every icon is authored ONCE here as neutral SVG inner-markup, then
 * `scripts/gen.mjs` emits two consumers from it:
 *
 *   src/index.ts                      → React/TSX components  (persona-website)
 *   py/persona_icons/__init__.py      → Python SVG helpers    (persona-council)
 *
 * Keep this file the only place icon geometry lives. After editing, run:
 *   npm run gen      (or: node scripts/gen.mjs)
 *
 * ── Conventions ────────────────────────────────────────────────────────────
 * regular : 24×24 viewBox, stroke-based, currentColor, strokeWidth ~1.75.
 *           `body` is the inner SVG markup (no <svg> wrapper). Stroke/fill come
 *           from the wrapper (React) or CSS `svg.ic` (council), so paths stay
 *           geometry-only unless an element needs an explicit fill override.
 * hifi    : 48×48 viewBox display icons. Children may carry their own fills
 *           (fill-opacity 0.06–0.12) and a stroke hierarchy of 2 / 1.5 / 0.75.
 *
 * IMPORTANT: `body` is injected via innerHTML in BOTH consumers (the React
 * component uses dangerouslySetInnerHTML), so it is raw SVG — write attributes
 * in kebab-case (`fill-opacity`, `stroke-width`, `stroke-opacity`,
 * `stroke-linecap`…), NOT JSX camelCase. camelCase silently no-ops, e.g. a
 * `fill-opacity` glow would render as a solid blob.
 *
 * `cls`   : optional extra CSS class applied by the Python helper (the council
 *           styles e.g. `.star` separately). Ignored by the React side.
 */

// ── Regular 24×24 chrome icons ───────────────────────────────────────────────
// The first 15 are ported verbatim from the persona-council chrome icon set so
// the app renders pixel-identical after the cutover.
export const regular = {
  overview: {
    label: 'OverviewIcon',
    body: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/>',
  },
  personas: {
    label: 'PersonasIcon',
    body: '<circle cx="9" cy="8" r="3.2"/><path d="M3.5 19a5.5 5.5 0 0 1 11 0"/><path d="M16 5.2a3 3 0 0 1 0 5.6"/><path d="M17.5 19a5.5 5.5 0 0 0-3-4.9"/>',
  },
  councils: {
    label: 'CouncilsIcon',
    body: '<path d="M21 11.5a8.5 8.5 0 0 1-12.5 7.5L4 20l1-4.5A8.5 8.5 0 1 1 21 11.5z"/>',
  },
  syntheses: {
    label: 'SynthesesIcon',
    body: '<path d="M12 3l9 5-9 5-9-5 9-5z"/><path d="M3 13l9 5 9-5"/>',
  },
  projects: {
    label: 'ProjectsIcon',
    body: '<circle cx="6" cy="6" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="12" cy="18" r="2.5"/><path d="M8 7l8 0M7 8l4 8M17 8l-4 8"/>',
  },
  memory: {
    label: 'MemoryIcon',
    body: '<path d="M12 3a4 4 0 0 0-4 4 3.5 3.5 0 0 0-1 6.8V17a3 3 0 0 0 5 2 3 3 0 0 0 5-2v-3.2A3.5 3.5 0 0 0 16 7a4 4 0 0 0-4-4z"/>',
  },
  panel: {
    label: 'PanelIcon',
    body: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16"/>',
  },
  settings: {
    label: 'SettingsIcon',
    body: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
  },
  sun: {
    label: 'SunIcon',
    body: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.4 1.4M17.6 17.6L19 19M19 5l-1.4 1.4M6.4 17.6L5 19"/>',
  },
  moon: {
    label: 'MoonIcon',
    body: '<path d="M20 14.5A8 8 0 1 1 9.5 4a6.3 6.3 0 0 0 10.5 10.5z"/>',
  },
  monitor: {
    label: 'MonitorIcon',
    body: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M9 20h6M12 16v4"/>',
  },
  chevron: {
    label: 'ChevronIcon',
    body: '<path d="M6 9l6 6 6-6"/>',
  },
  back: {
    label: 'BackIcon',
    body: '<path d="M15 18l-6-6 6-6"/>',
  },
  analytics: {
    label: 'AnalyticsIcon',
    body: '<path d="M3 21h18"/><rect x="5" y="11" width="3.4" height="7" rx="1"/><rect x="10.3" y="6" width="3.4" height="12" rx="1"/><rect x="15.6" y="13" width="3.4" height="5" rx="1"/>',
  },
  star: {
    label: 'StarIcon',
    cls: 'star',
    body: '<path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 17.9 6.8 20.6l1-5.8L3.5 9.7l5.9-.9z"/>',
  },
  bulb: {
    label: 'BulbIcon',
    body: '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.8 10.6c.5.5.8 1 .8 1.6V16h6v-.8c0-.6.3-1.1.8-1.6A6 6 0 0 0 12 3z"/>',
  },
  target: {
    label: 'TargetIcon',
    body: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1"/>',
  },
  compass: {
    label: 'CompassIcon',
    body: '<circle cx="12" cy="12" r="9"/><path d="M15.6 8.4l-2 5.2-5.2 2 2-5.2z"/>',
  },
  search: {
    label: 'SearchIcon',
    body: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
  },

  // ── Status family ──────────────────────────────────────────────────────────
  // Available for migrating the council's inline ✓ ◐ ○ ! status glyphs to real
  // icons when desired (see README → "Status glyphs").
  check: {
    label: 'CheckIcon',
    body: '<path d="M5 12.5l4.5 4.5L19 7"/>',
  },
  circle: {
    label: 'CircleIcon',
    body: '<circle cx="12" cy="12" r="7.5"/>',
  },
  half: {
    label: 'HalfIcon',
    body: '<circle cx="12" cy="12" r="7.5"/><path d="M12 4.5a7.5 7.5 0 0 1 0 15z" fill="currentColor" stroke="none"/>',
  },
  alert: {
    label: 'AlertIcon',
    body: '<path d="M12 4.5v8.5"/><circle cx="12" cy="17.6" r="0.7" fill="currentColor" stroke="none"/>',
  },
  close: {
    label: 'CloseIcon',
    body: '<path d="M6 6l12 12M18 6L6 18"/>',
  },
  plus: {
    label: 'PlusIcon',
    body: '<path d="M12 5v14M5 12h14"/>',
  },
  external: {
    label: 'ExternalIcon',
    body: '<path d="M14 4h6v6"/><path d="M20 4l-9 9"/><path d="M18 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5"/>',
  },

  // ── Reaction / notation markers ──────────────────────────────────────────────
  // Replace inline Unicode UI markers (👍 ⚠ ● ◇ ◆ ▸) with real icons.
  thumbsup: {
    label: 'ThumbsUpIcon',
    body: '<path d="M7 11v8a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1h3z"/><path d="M7 11l4.2-7.4a1.8 1.8 0 0 1 3.2 1.4L13.5 9H19a2 2 0 0 1 2 2.3l-1.1 6.5A2 2 0 0 1 17.9 20H7z"/>',
  },
  warning: {
    label: 'WarningIcon',
    body: '<path d="M10.3 4.3 1.8 19a2 2 0 0 0 1.7 3h16.8a2 2 0 0 0 1.7-3L13.7 4.3a2 2 0 0 0-3.4 0z"/><path d="M12 9.5v4"/><circle cx="12" cy="17.3" r="0.6" fill="currentColor" stroke="none"/>',
  },
  dot: {
    label: 'DotIcon',
    body: '<circle cx="12" cy="12" r="5" fill="currentColor" stroke="none"/>',
  },
  diamond: {
    label: 'DiamondIcon',
    body: '<path d="M12 3l9 9-9 9-9-9z"/>',
  },
  diamondFilled: {
    label: 'DiamondFilledIcon',
    body: '<path d="M12 3l9 9-9 9-9-9z" fill="currentColor"/>',
  },
  caretRight: {
    label: 'CaretRightIcon',
    body: '<path d="M9 5l7 7-7 7z" fill="currentColor" stroke="none"/>',
  },
  arrowRight: {
    label: 'ArrowRightIcon',
    body: '<path d="M4 12h14M13 6l6 6-6 6"/>',
  },

  // ── Research-graph notation (maps the suggestions/*.json glyph set) ───────────
  // ◇◆ diverge/converge use diamond/diamondFilled above; these cover the rest.
  square: {
    label: 'SquareIcon',
    body: '<rect x="4" y="4" width="16" height="16" rx="2.5"/>',
  },
  squareSplit: {
    label: 'SquareSplitIcon',
    body: '<rect x="4" y="4" width="16" height="16" rx="2.5"/><rect x="8.5" y="8.5" width="7" height="7" rx="1" fill="currentColor"/>',
  },
  squareRows: {
    label: 'SquareRowsIcon',
    body: '<rect x="4" y="4" width="16" height="16" rx="2.5"/><path d="M4 9.3h16M4 14.6h16"/>',
  },
  squareCols: {
    label: 'SquareColsIcon',
    body: '<rect x="4" y="4" width="16" height="16" rx="2.5"/><path d="M9.3 4v16M14.6 4v16"/>',
  },
  squareGrid: {
    label: 'SquareGridIcon',
    body: '<rect x="4" y="4" width="16" height="16" rx="2.5"/><path d="M12 4v16M4 12h16"/>',
  },
  rectangle: {
    label: 'RectangleIcon',
    body: '<rect x="3" y="8" width="18" height="8" rx="2"/>',
  },
  exchange: {
    label: 'ExchangeIcon',
    body: '<path d="M4 9h14l-3.5-3.5M20 15H6l3.5 3.5"/>',
  },
  wave: {
    label: 'WaveIcon',
    body: '<path d="M3 12c1.5-4 4.5-4 6 0s4.5 4 6 0 4.5-4 6 0"/>',
  },
  pencil: {
    label: 'PencilIcon',
    body: '<path d="M4 20l1-4L16 5l3 3L8 19z"/><path d="M14 7l3 3"/>',
  },
};

// ── High-fidelity 48×48 display icons ────────────────────────────────────────
// For the website (hero tiles, feature cards, empty states) where a larger
// render lets fills and detail read. currentColor-driven; no hard-coded colors.
// A hi-fi (48×48) twin for EVERY regular icon — same keys as `regular`, with
// fills (fill-opacity 0.05–0.12), a soft glow, and a 2 / 1.75 / 1.25 stroke
// hierarchy. Component name is <Name>Hifi. Authored in raw SVG (kebab-case).
export const hifi = {
  overview: {
    label: 'OverviewHifi',
    body:
      '<rect x="7" y="7" width="15" height="15" rx="3.5" fill="currentColor" fill-opacity="0.1" stroke-width="2"/>' +
      '<rect x="26" y="7" width="15" height="15" rx="3.5" stroke-width="2"/>' +
      '<rect x="26" y="26" width="15" height="15" rx="3.5" fill="currentColor" fill-opacity="0.1" stroke-width="2"/>' +
      '<rect x="7" y="26" width="15" height="15" rx="3.5" stroke-width="2"/>',
  },
  personas: {
    label: 'PersonasHifi',
    body:
      '<circle cx="18" cy="17" r="6.5" fill="currentColor" fill-opacity="0.1" stroke-width="2"/>' +
      '<path d="M6 40a12 12 0 0 1 24 0z" fill="currentColor" fill-opacity="0.1" stroke-width="2"/>' +
      '<path d="M33 11.5a6 6 0 0 1 0 11" stroke-width="1.75"/>' +
      '<path d="M34 40a12 12 0 0 0-6.5-10.6" stroke-width="1.75"/>',
  },
  councils: {
    label: 'CouncilsHifi',
    body:
      '<circle cx="24" cy="24" r="20" fill="currentColor" fill-opacity="0.05" stroke="none"/>' +
      '<path d="M9 19a8 8 0 0 1 8-8h14a8 8 0 0 1 8 8v6a8 8 0 0 1-8 8H20l-7 6v-6.6A8 8 0 0 1 9 25z" fill="currentColor" fill-opacity="0.08" stroke-width="2"/>' +
      '<circle cx="18" cy="22" r="1.8" fill="currentColor" stroke="none"/>' +
      '<circle cx="24" cy="22" r="1.8" fill="currentColor" stroke="none"/>' +
      '<circle cx="30" cy="22" r="1.8" fill="currentColor" stroke="none"/>',
  },
  syntheses: {
    label: 'SynthesesHifi',
    body:
      '<path d="M24 6l18 10-18 10L6 16z" fill="currentColor" fill-opacity="0.1" stroke-width="2"/>' +
      '<path d="M6 24l18 10 18-10" stroke-width="1.75"/>' +
      '<path d="M6 32l18 10 18-10" stroke-width="1.75" stroke-opacity="0.55"/>',
  },
  projects: {
    label: 'ProjectsHifi',
    body:
      '<circle cx="12" cy="13" r="4.5" fill="currentColor" fill-opacity="0.1" stroke-width="2"/>' +
      '<circle cx="36" cy="13" r="4.5" fill="currentColor" fill-opacity="0.1" stroke-width="2"/>' +
      '<circle cx="24" cy="36" r="5.5" fill="currentColor" fill-opacity="0.12" stroke-width="2"/>' +
      '<path d="M16.5 13h15M15 17l7 14M33 17l-7 14" stroke-width="1.75"/>',
  },
  memory: {
    label: 'MemoryHifi',
    body:
      '<circle cx="24" cy="24" r="20" fill="currentColor" fill-opacity="0.05" stroke="none"/>' +
      '<path d="M24 8a7 7 0 0 0-7 7 6 6 0 0 0-1.6 11.8V31a5 5 0 0 0 8.6 3.5A5 5 0 0 0 32.6 31v-4.2A6 6 0 0 0 31 15a7 7 0 0 0-7-7z" fill="currentColor" fill-opacity="0.08" stroke-width="2"/>' +
      '<path d="M24 8v30" stroke-width="1.25" stroke-opacity="0.5"/>' +
      '<path d="M24 17h5M24 24h-6M24 31h5" stroke-width="1.25" stroke-opacity="0.5"/>',
  },
  panel: {
    label: 'PanelHifi',
    body:
      '<rect x="6" y="9" width="36" height="30" rx="4" fill="currentColor" fill-opacity="0.06" stroke-width="2"/>' +
      '<path d="M19 9v30" stroke-width="1.75"/>' +
      '<path d="M10.5 16.5h4.5M10.5 22h4.5M10.5 27.5h4.5" stroke-width="1.5" stroke-opacity="0.6"/>',
  },
  settings: {
    label: 'SettingsHifi',
    body:
      '<circle cx="24" cy="24" r="20" fill="currentColor" fill-opacity="0.05" stroke="none"/>' +
      '<circle cx="24" cy="24" r="6.5" fill="currentColor" fill-opacity="0.12" stroke-width="2"/>' +
      '<path d="M24 6v6.5M24 35.5V42M6 24h6.5M35.5 24H42M11.3 11.3l4.6 4.6M32.1 32.1l4.6 4.6M36.7 11.3l-4.6 4.6M15.9 32.1l-4.6 4.6" stroke-width="1.75"/>',
  },
  sun: {
    label: 'SunHifi',
    body:
      '<circle cx="24" cy="24" r="8.5" fill="currentColor" fill-opacity="0.12" stroke-width="2"/>' +
      '<path d="M24 4v6M24 38v6M4 24h6M38 24h6M9.9 9.9l4.3 4.3M33.8 33.8l4.3 4.3M38.1 9.9l-4.3 4.3M14.2 33.8l-4.3 4.3" stroke-width="1.75"/>',
  },
  moon: {
    label: 'MoonHifi',
    body:
      '<circle cx="24" cy="24" r="20" fill="currentColor" fill-opacity="0.05" stroke="none"/>' +
      '<path d="M40 29A16 16 0 1 1 19 8a12.6 12.6 0 0 0 21 21z" fill="currentColor" fill-opacity="0.1" stroke-width="2"/>',
  },
  monitor: {
    label: 'MonitorHifi',
    body:
      '<rect x="5" y="8" width="38" height="26" rx="4" fill="currentColor" fill-opacity="0.08" stroke-width="2"/>' +
      '<path d="M18 40h12" stroke-width="2"/>' +
      '<path d="M24 34v6" stroke-width="1.75"/>',
  },
  chevron: {
    label: 'ChevronHifi',
    body:
      '<path d="M12 13l12 11 12-11" stroke-width="1.75" stroke-opacity="0.4"/>' +
      '<path d="M12 24l12 11 12-11" stroke-width="2.5"/>',
  },
  back: {
    label: 'BackHifi',
    body:
      '<path d="M31 12L19 24l12 12" stroke-width="2.5"/>' +
      '<path d="M22 12L10 24l12 12" stroke-width="1.75" stroke-opacity="0.4"/>',
  },
  analytics: {
    label: 'AnalyticsHifi',
    body:
      '<path d="M6 42h36" stroke-width="2"/>' +
      '<rect x="9" y="22" width="8" height="14" rx="1.5" fill="currentColor" fill-opacity="0.1" stroke-width="2"/>' +
      '<rect x="20" y="11" width="8" height="25" rx="1.5" fill="currentColor" fill-opacity="0.1" stroke-width="2"/>' +
      '<rect x="31" y="27" width="8" height="9" rx="1.5" fill="currentColor" fill-opacity="0.1" stroke-width="2"/>',
  },
  star: {
    label: 'StarHifi',
    body:
      '<circle cx="24" cy="24" r="20" fill="currentColor" fill-opacity="0.04" stroke="none"/>' +
      '<path d="M24 7l5.2 10.5 11.6 1.7-8.4 8.2 2 11.6L24 35.4 13.6 41l2-11.6L7.2 21.2l11.6-1.7z" fill="currentColor" fill-opacity="0.12" stroke-width="2"/>',
  },
  bulb: {
    label: 'BulbHifi',
    body:
      '<circle cx="24" cy="20" r="18" fill="currentColor" fill-opacity="0.05" stroke="none"/>' +
      '<path d="M24 8a11 11 0 0 0-7 19.5c1 .9 1.6 1.9 1.6 3V32h10.8v-1.5c0-1.1.6-2.1 1.6-3A11 11 0 0 0 24 8z" fill="currentColor" fill-opacity="0.1" stroke-width="2"/>' +
      '<path d="M18.6 36h10.8M20.5 40h7" stroke-width="1.75"/>' +
      '<path d="M24 18l2.2 4.4 4.8.7-3.5 3.4.8 4.8L24 29l-4.3 2.3.8-4.8-3.5-3.4 4.8-.7z" stroke-width="1.1" stroke-opacity="0.65"/>',
  },
  target: {
    label: 'TargetHifi',
    body:
      '<circle cx="24" cy="24" r="18" fill="currentColor" fill-opacity="0.05" stroke-width="2"/>' +
      '<circle cx="24" cy="24" r="11" stroke-width="1.75"/>' +
      '<circle cx="24" cy="24" r="4" fill="currentColor" fill-opacity="0.2" stroke-width="1.5"/>',
  },
  compass: {
    label: 'CompassHifi',
    body:
      '<circle cx="24" cy="24" r="19" fill="currentColor" fill-opacity="0.05" stroke-width="2"/>' +
      '<path d="M31 17l-4 10-10 4 4-10z" fill="currentColor" fill-opacity="0.12" stroke-width="1.75"/>' +
      '<circle cx="24" cy="24" r="1.8" fill="currentColor" stroke="none"/>',
  },
  search: {
    label: 'SearchHifi',
    body:
      '<circle cx="21" cy="21" r="14" fill="currentColor" fill-opacity="0.06" stroke-width="2"/>' +
      '<path d="M31.5 31.5L42 42" stroke-width="2.5"/>' +
      '<path d="M21 14a7 7 0 0 0-7 7" stroke-width="1.5" stroke-opacity="0.6"/>',
  },
  check: {
    label: 'CheckHifi',
    body:
      '<circle cx="24" cy="24" r="20" fill="currentColor" fill-opacity="0.08" stroke-width="2"/>' +
      '<path d="M14 24.5l7 7 13-14" stroke-width="2.5"/>',
  },
  circle: {
    label: 'CircleHifi',
    body: '<circle cx="24" cy="24" r="17" fill="currentColor" fill-opacity="0.06" stroke-width="2"/>',
  },
  half: {
    label: 'HalfHifi',
    body:
      '<circle cx="24" cy="24" r="17" fill="currentColor" fill-opacity="0.06" stroke-width="2"/>' +
      '<path d="M24 7a17 17 0 0 1 0 34z" fill="currentColor" stroke="none"/>',
  },
  alert: {
    label: 'AlertHifi',
    body:
      '<circle cx="24" cy="24" r="20" fill="currentColor" fill-opacity="0.08" stroke-width="2"/>' +
      '<path d="M24 13v14" stroke-width="2.5"/>' +
      '<circle cx="24" cy="34" r="1.7" fill="currentColor" stroke="none"/>',
  },
  close: {
    label: 'CloseHifi',
    body:
      '<circle cx="24" cy="24" r="20" fill="currentColor" fill-opacity="0.06" stroke-width="2"/>' +
      '<path d="M16 16l16 16M32 16L16 32" stroke-width="2.5"/>',
  },
  plus: {
    label: 'PlusHifi',
    body:
      '<circle cx="24" cy="24" r="20" fill="currentColor" fill-opacity="0.06" stroke-width="2"/>' +
      '<path d="M24 14v20M14 24h20" stroke-width="2.5"/>',
  },
  external: {
    label: 'ExternalHifi',
    body:
      '<path d="M34 28v8a4 4 0 0 1-4 4H12a4 4 0 0 1-4-4V18a4 4 0 0 1 4-4h8" fill="currentColor" fill-opacity="0.06" stroke-width="2"/>' +
      '<path d="M28 9h11v11" stroke-width="2"/>' +
      '<path d="M39 9L23 25" stroke-width="2"/>',
  },
  thumbsup: {
    label: 'ThumbsUpHifi',
    body:
      '<path d="M14 22v16a2.5 2.5 0 0 1-2.5 2.5H8A2.5 2.5 0 0 1 5.5 38V24.5A2.5 2.5 0 0 1 8 22z" fill="currentColor" fill-opacity="0.1" stroke-width="2"/>' +
      '<path d="M14 22l8.4-14.8a3.6 3.6 0 0 1 6.4 2.8L27 18h11.2a4 4 0 0 1 4 4.6l-2.2 13A4 4 0 0 1 36 40H14z" fill="currentColor" fill-opacity="0.1" stroke-width="2"/>',
  },
  warning: {
    label: 'WarningHifi',
    body:
      '<path d="M20.6 8.6 3.6 38a4 4 0 0 0 3.4 6h34a4 4 0 0 0 3.4-6L27.4 8.6a4 4 0 0 0-6.8 0z" fill="currentColor" fill-opacity="0.1" stroke-width="2"/>' +
      '<path d="M24 19v9" stroke-width="2.5"/>' +
      '<circle cx="24" cy="34.5" r="1.7" fill="currentColor" stroke="none"/>',
  },
  dot: {
    label: 'DotHifi',
    body:
      '<circle cx="24" cy="24" r="18" fill="currentColor" fill-opacity="0.08" stroke="none"/>' +
      '<circle cx="24" cy="24" r="9" fill="currentColor" stroke="none"/>',
  },
  diamond: {
    label: 'DiamondHifi',
    body: '<path d="M24 6l18 18-18 18L6 24z" fill="currentColor" fill-opacity="0.1" stroke-width="2"/>',
  },
  diamondFilled: {
    label: 'DiamondFilledHifi',
    body:
      '<path d="M24 6l18 18-18 18L6 24z" fill="currentColor" fill-opacity="0.85" stroke="currentColor" stroke-width="2"/>',
  },
  caretRight: {
    label: 'CaretRightHifi',
    body:
      '<circle cx="24" cy="24" r="20" fill="currentColor" fill-opacity="0.06" stroke="none"/>' +
      '<path d="M20 13l13 11-13 11z" fill="currentColor" stroke="none"/>',
  },
  arrowRight: {
    label: 'ArrowRightHifi',
    body:
      '<circle cx="24" cy="24" r="20" fill="currentColor" fill-opacity="0.06" stroke="none"/>' +
      '<path d="M11 24h24M26 14l10 10-10 10" stroke-width="2.5"/>',
  },
  square: {
    label: 'SquareHifi',
    body: '<rect x="8" y="8" width="32" height="32" rx="6" fill="currentColor" fill-opacity="0.08" stroke-width="2"/>',
  },
  squareSplit: {
    label: 'SquareSplitHifi',
    body:
      '<rect x="8" y="8" width="32" height="32" rx="6" fill="currentColor" fill-opacity="0.06" stroke-width="2"/>' +
      '<rect x="17" y="17" width="14" height="14" rx="2.5" fill="currentColor" fill-opacity="0.85" stroke="none"/>',
  },
  squareRows: {
    label: 'SquareRowsHifi',
    body:
      '<rect x="8" y="8" width="32" height="32" rx="6" fill="currentColor" fill-opacity="0.06" stroke-width="2"/>' +
      '<path d="M8 18.7h32M8 29.3h32" stroke-width="1.75"/>',
  },
  squareCols: {
    label: 'SquareColsHifi',
    body:
      '<rect x="8" y="8" width="32" height="32" rx="6" fill="currentColor" fill-opacity="0.06" stroke-width="2"/>' +
      '<path d="M18.7 8v32M29.3 8v32" stroke-width="1.75"/>',
  },
  squareGrid: {
    label: 'SquareGridHifi',
    body:
      '<rect x="8" y="8" width="32" height="32" rx="6" fill="currentColor" fill-opacity="0.06" stroke-width="2"/>' +
      '<path d="M24 8v32M8 24h32" stroke-width="1.75"/>',
  },
  rectangle: {
    label: 'RectangleHifi',
    body: '<rect x="5" y="16" width="38" height="16" rx="4" fill="currentColor" fill-opacity="0.1" stroke-width="2"/>',
  },
  exchange: {
    label: 'ExchangeHifi',
    body:
      '<circle cx="24" cy="24" r="20" fill="currentColor" fill-opacity="0.05" stroke="none"/>' +
      '<path d="M11 19h26l-7-7" stroke-width="2.5"/>' +
      '<path d="M37 29H11l7 7" stroke-width="2.5"/>',
  },
  wave: {
    label: 'WaveHifi',
    body:
      '<circle cx="24" cy="24" r="20" fill="currentColor" fill-opacity="0.05" stroke="none"/>' +
      '<path d="M7 24c3-8 8-8 11 0s8 8 11 0 8-8 11 0" stroke-width="2.5"/>',
  },
  pencil: {
    label: 'PencilHifi',
    body:
      '<path d="M9 39l2.5-8.5L31 11l6 6L17.5 36.5z" fill="currentColor" fill-opacity="0.1" stroke-width="2"/>' +
      '<path d="M27 15l6 6" stroke-width="1.75"/>' +
      '<path d="M9 39l2.5-8.5" stroke-width="2"/>',
  },
};
