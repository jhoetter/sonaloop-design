/**
 * sonaloop-icons — single source of truth.
 *
 * Every icon is authored ONCE here as neutral SVG inner-markup, then
 * `scripts/gen.mjs` emits two consumers from it:
 *
 *   src/index.ts                      → React/TSX components  (persona-website)
 *   py/sonaloop_icons/__init__.py      → Python SVG helpers    (sonaloop)
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
// The first 15 are ported verbatim from the sonaloop chrome icon set so
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
    // A folder — distinct from the sonaloop brand mark's three-node loop.
    body: '<path data-part="folder" d="M4 20h16a2 2 0 0 0 2-2V8.5a2 2 0 0 0-2-2h-7.1a2 2 0 0 1-1.6-.8l-.9-1.2a2 2 0 0 0-1.6-.8H4a2 2 0 0 0-2 2V18a2 2 0 0 0 2 2z"/>',
  },
  plan: {
    label: 'PlanIcon',
    // A checklist — the project plan / build-order (distinct from the projects folder).
    body: '<path data-part="checks" d="M3.5 7l1.3 1.3L7.3 5.3M3.5 12l1.3 1.3L7.3 10.3M3.5 17l1.3 1.3L7.3 15.3"/>' +
          '<path data-part="lines" d="M10.8 7H20.5M10.8 12H20.5M10.8 17H17"/>',
  },
  memory: {
    label: 'MemoryIcon',
    body: '<path d="M12 3a4 4 0 0 0-4 4 3.5 3.5 0 0 0-1 6.8V17a3 3 0 0 0 5 2 3 3 0 0 0 5-2v-3.2A3.5 3.5 0 0 0 16 7a4 4 0 0 0-4-4z"/>',
  },
  panel: {
    label: 'PanelIcon',
    body: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16"/>',
  },
  prototype: {
    label: 'PrototypeIcon',
    body: '<rect x="3" y="4.5" width="18" height="15" rx="2"/><path d="M3 9h18"/><circle cx="6.1" cy="6.75" r="0.7" fill="currentColor" stroke="none"/><circle cx="8.5" cy="6.75" r="0.7" fill="currentColor" stroke="none"/>',
  },
  link: {
    label: 'LinkIcon',
    body: '<path d="M10 13a3.5 3.5 0 0 0 5 0l3-3a3.5 3.5 0 0 0-5-5l-1.5 1.5"/><path d="M14 11a3.5 3.5 0 0 0-5 0l-3 3a3.5 3.5 0 0 0 5 5l1.5-1.5"/>',
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

  // ── Brand ────────────────────────────────────────────────────────────────────
  // sonaloop — the company logo. A continuous lobed "loop" (rounded-triangle
  // ribbon) binding three nodes; line-art twin of the hi-fi mark. Sized with edge
  // margin so the stroked top node never clips at the viewBox edge.
  sonaloop: {
    label: 'SonaloopIcon',
    body: '<path data-part="loop" d="M17 12L17.31 12.62L17.49 13.3L17.51 14.01L17.35 14.69L17 15.29L16.49 15.77L15.87 16.1L15.19 16.28L14.5 16.33L13.84 16.28L13.25 16.17L12.72 16.07L12.23 16.01L11.77 16.01L11.28 16.07L10.75 16.17L10.16 16.28L9.5 16.33L8.81 16.28L8.13 16.1L7.51 15.77L7 15.29L6.65 14.69L6.49 14.01L6.51 13.3L6.69 12.62L7 12L7.37 11.46L7.76 11L8.12 10.59L8.41 10.2L8.65 9.79L8.83 9.34L9.01 8.83L9.22 8.26L9.5 7.67L9.88 7.09L10.38 6.59L10.98 6.22L11.65 6.03L12.35 6.03L13.02 6.22L13.62 6.59L14.12 7.09L14.5 7.67L14.78 8.26L14.99 8.83L15.17 9.34L15.35 9.79L15.59 10.2L15.88 10.59L16.24 11L16.63 11.46L17 12Z"/><circle cx="12" cy="3.7" r="1.85"/><circle cx="19.19" cy="16.15" r="1.85"/><circle cx="4.81" cy="16.15" r="1.85"/>',
  },
  // ── Sonaloop product family — alternatives to choose from (enumerated) ──
  // 1. loop in cloud
  'sonaloop-cloud-1': {
    label: 'SonaloopCloud1Icon',
    body: '<path data-part="cloud" d="M7.2 18.5h9.4a3.8 3.8 0 0 0 .6-7.55 5.5 5.5 0 0 0-10.45-1.4A3.9 3.9 0 0 0 7.2 18.5z"/><path data-part="loop" d="M14.7 13.4L14.9 13.77L15.01 14.17L15.01 14.59L14.89 14.99L14.64 15.32L14.3 15.56L13.9 15.7L13.49 15.74L13.09 15.71L12.73 15.64L12.41 15.56L12.13 15.51L11.87 15.51L11.59 15.56L11.27 15.64L10.91 15.71L10.51 15.74L10.1 15.7L9.7 15.56L9.36 15.32L9.11 14.99L8.99 14.59L8.99 14.17L9.1 13.77L9.3 13.4L9.54 13.09L9.78 12.83L9.99 12.6L10.15 12.38L10.27 12.15L10.37 11.87L10.46 11.54L10.59 11.18L10.79 10.82L11.06 10.5L11.4 10.26L11.79 10.12L12.21 10.12L12.6 10.26L12.94 10.5L13.21 10.82L13.41 11.18L13.54 11.54L13.63 11.87L13.73 12.15L13.85 12.38L14.01 12.6L14.22 12.83L14.46 13.09L14.7 13.4Z"/>',
  },
  // 2. deploy/uplink arrow
  'sonaloop-cloud-2': {
    label: 'SonaloopCloud2Icon',
    body: '<path data-part="cloud" d="M7.2 18.5h9.4a3.8 3.8 0 0 0 .6-7.55 5.5 5.5 0 0 0-10.45-1.4A3.9 3.9 0 0 0 7.2 18.5z"/><path data-part="loop" d="M14 11.8L14.14 12.07L14.23 12.37L14.23 12.68L14.14 12.98L13.96 13.22L13.71 13.4L13.41 13.5L13.1 13.54L12.8 13.51L12.54 13.46L12.31 13.4L12.1 13.36L11.9 13.36L11.69 13.4L11.46 13.46L11.2 13.51L10.9 13.54L10.59 13.5L10.29 13.4L10.04 13.22L9.86 12.98L9.77 12.68L9.77 12.37L9.86 12.07L10 11.8L10.18 11.57L10.35 11.38L10.51 11.21L10.63 11.05L10.72 10.87L10.79 10.66L10.86 10.42L10.96 10.16L11.1 9.89L11.3 9.65L11.56 9.47L11.85 9.37L12.15 9.37L12.44 9.47L12.7 9.65L12.9 9.89L13.04 10.16L13.14 10.42L13.21 10.66L13.28 10.87L13.37 11.05L13.49 11.21L13.65 11.38L13.82 11.57L14 11.8Z"/><path d="M12 22.2v-3.4M10 20.4l2-2 2 2"/>',
  },
  // 3. powered (bolt)
  'sonaloop-cloud-3': {
    label: 'SonaloopCloud3Icon',
    body: '<path data-part="cloud" d="M7.2 18.5h9.4a3.8 3.8 0 0 0 .6-7.55 5.5 5.5 0 0 0-10.45-1.4A3.9 3.9 0 0 0 7.2 18.5z"/><path data-part="loop" d="M14 11.6L14.14 11.87L14.23 12.17L14.23 12.48L14.14 12.78L13.96 13.02L13.71 13.2L13.41 13.3L13.1 13.34L12.8 13.31L12.54 13.26L12.31 13.2L12.1 13.16L11.9 13.16L11.69 13.2L11.46 13.26L11.2 13.31L10.9 13.34L10.59 13.3L10.29 13.2L10.04 13.02L9.86 12.78L9.77 12.48L9.77 12.17L9.86 11.87L10 11.6L10.18 11.37L10.35 11.18L10.51 11.01L10.63 10.85L10.72 10.67L10.79 10.46L10.86 10.22L10.96 9.96L11.1 9.69L11.3 9.45L11.56 9.27L11.85 9.17L12.15 9.17L12.44 9.27L12.7 9.45L12.9 9.69L13.04 9.96L13.14 10.22L13.21 10.46L13.28 10.67L13.37 10.85L13.49 11.01L13.65 11.18L13.82 11.37L14 11.6Z"/><path d="M12.6 18.4l-2.6 3.8h2.1l-1.1 2.6 3.4-4.1h-2.1z" fill="currentColor" stroke="none"/>',
  },
  // 4. orbiting nodes
  'sonaloop-cloud-4': {
    label: 'SonaloopCloud4Icon',
    body: '<path data-part="cloud" d="M7.2 18.5h9.4a3.8 3.8 0 0 0 .6-7.55 5.5 5.5 0 0 0-10.45-1.4A3.9 3.9 0 0 0 7.2 18.5z"/><path data-part="loop" d="M14.2 12.4L14.36 12.7L14.45 13.03L14.45 13.37L14.35 13.69L14.15 13.96L13.88 14.16L13.55 14.27L13.21 14.31L12.89 14.28L12.59 14.22L12.34 14.16L12.11 14.12L11.89 14.12L11.66 14.16L11.41 14.22L11.11 14.28L10.79 14.31L10.45 14.27L10.12 14.16L9.85 13.96L9.65 13.69L9.55 13.37L9.55 13.03L9.64 12.7L9.8 12.4L9.99 12.15L10.19 11.94L10.36 11.75L10.5 11.57L10.59 11.38L10.67 11.15L10.75 10.88L10.85 10.59L11.01 10.3L11.23 10.04L11.51 9.84L11.83 9.73L12.17 9.73L12.49 9.84L12.77 10.04L12.99 10.3L13.15 10.59L13.25 10.88L13.33 11.15L13.41 11.38L13.5 11.57L13.64 11.75L13.81 11.94L14.01 12.15L14.2 12.4Z"/><circle cx="5.6" cy="16.2" r="1.05" fill="currentColor" stroke="none"/><circle cx="18.4" cy="16.2" r="1.05" fill="currentColor" stroke="none"/><circle cx="12" cy="6" r="1.05" fill="currentColor" stroke="none"/>',
  },
  // 5. streaming data dots
  'sonaloop-cloud-5': {
    label: 'SonaloopCloud5Icon',
    body: '<path data-part="cloud" d="M7.2 18.5h9.4a3.8 3.8 0 0 0 .6-7.55 5.5 5.5 0 0 0-10.45-1.4A3.9 3.9 0 0 0 7.2 18.5z"/><path data-part="loop" d="M14.2 12.4L14.36 12.7L14.45 13.03L14.45 13.37L14.35 13.69L14.15 13.96L13.88 14.16L13.55 14.27L13.21 14.31L12.89 14.28L12.59 14.22L12.34 14.16L12.11 14.12L11.89 14.12L11.66 14.16L11.41 14.22L11.11 14.28L10.79 14.31L10.45 14.27L10.12 14.16L9.85 13.96L9.65 13.69L9.55 13.37L9.55 13.03L9.64 12.7L9.8 12.4L9.99 12.15L10.19 11.94L10.36 11.75L10.5 11.57L10.59 11.38L10.67 11.15L10.75 10.88L10.85 10.59L11.01 10.3L11.23 10.04L11.51 9.84L11.83 9.73L12.17 9.73L12.49 9.84L12.77 10.04L12.99 10.3L13.15 10.59L13.25 10.88L13.33 11.15L13.41 11.38L13.5 11.57L13.64 11.75L13.81 11.94L14.01 12.15L14.2 12.4Z"/><circle cx="9" cy="21" r="0.95" fill="currentColor" stroke="none"/><circle cx="12" cy="21" r="0.95" fill="currentColor" stroke="none"/><circle cx="15" cy="21" r="0.95" fill="currentColor" stroke="none"/>',
  },
  // 1. flask
  'sonaloop-research-1': {
    label: 'SonaloopResearch1Icon',
    body: '<path data-part="flask" d="M9.5 3.5h5M10.7 3.5v5L6.3 16.8A1.8 1.8 0 0 0 7.9 19.6h8.2a1.8 1.8 0 0 0 1.6-2.8L13.3 8.5v-5"/><path d="M8.2 13.8h7.6" stroke-opacity="0.6"/><path data-part="loop" d="M13.7 15.7L13.82 15.93L13.89 16.19L13.9 16.45L13.82 16.7L13.66 16.91L13.45 17.06L13.2 17.15L12.94 17.17L12.68 17.15L12.46 17.11L12.26 17.06L12.08 17.03L11.92 17.03L11.74 17.06L11.54 17.11L11.32 17.15L11.06 17.17L10.8 17.15L10.55 17.06L10.34 16.91L10.18 16.7L10.1 16.45L10.11 16.19L10.18 15.93L10.3 15.7L10.45 15.5L10.6 15.34L10.73 15.2L10.84 15.06L10.91 14.91L10.97 14.73L11.03 14.53L11.11 14.3L11.24 14.08L11.41 13.87L11.62 13.72L11.87 13.64L12.13 13.64L12.38 13.72L12.59 13.87L12.76 14.08L12.89 14.3L12.97 14.53L13.03 14.73L13.09 14.91L13.16 15.06L13.27 15.2L13.4 15.34L13.55 15.5L13.7 15.7Z"/>',
  },
  // 2. report/deliverable
  'sonaloop-research-2': {
    label: 'SonaloopResearch2Icon',
    body: '<path data-part="page" d="M6.5 3h6.5l4.5 4.5V20a1.5 1.5 0 0 1-1.5 1.5H6.5A1.5 1.5 0 0 1 5 20V4.5A1.5 1.5 0 0 1 6.5 3z"/><path d="M13 3v4.5h4.5" stroke-opacity="0.6"/><path d="M8.2 18.3h7.6" stroke-opacity="0.6"/><path data-part="loop" d="M13.8 12.6L13.96 12.9L14.05 13.23L14.05 13.57L13.95 13.89L13.75 14.16L13.48 14.36L13.15 14.47L12.81 14.51L12.49 14.48L12.19 14.42L11.94 14.36L11.71 14.32L11.49 14.32L11.26 14.36L11.01 14.42L10.71 14.48L10.39 14.51L10.05 14.47L9.72 14.36L9.45 14.16L9.25 13.89L9.15 13.57L9.15 13.23L9.24 12.9L9.4 12.6L9.59 12.35L9.79 12.14L9.96 11.95L10.1 11.77L10.19 11.58L10.27 11.35L10.35 11.08L10.45 10.79L10.61 10.5L10.83 10.24L11.11 10.04L11.43 9.93L11.77 9.93L12.09 10.04L12.37 10.24L12.59 10.5L12.75 10.79L12.85 11.08L12.93 11.35L13.01 11.58L13.1 11.77L13.24 11.95L13.41 12.14L13.61 12.35L13.8 12.6Z"/>',
  },
  // 3. clipboard (managed)
  'sonaloop-research-3': {
    label: 'SonaloopResearch3Icon',
    body: '<path data-part="board" d="M6.5 5.5h11a1.5 1.5 0 0 1 1.5 1.5V20a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 20V7a1.5 1.5 0 0 1 1.5-1.5z"/><path d="M9.2 5.5V5a2.8 2.8 0 0 1 5.6 0v.5" /><path d="M9 4.4h6" stroke-opacity="0.6"/><path data-part="loop" d="M14.1 13.2L14.25 13.48L14.34 13.8L14.34 14.13L14.24 14.43L14.05 14.69L13.79 14.88L13.48 14.99L13.16 15.02L12.85 15L12.57 14.94L12.32 14.88L12.1 14.84L11.9 14.84L11.68 14.88L11.43 14.94L11.15 15L10.84 15.02L10.52 14.99L10.21 14.88L9.95 14.69L9.76 14.43L9.66 14.13L9.66 13.8L9.75 13.48L9.9 13.2L10.09 12.96L10.27 12.76L10.44 12.58L10.56 12.41L10.66 12.22L10.73 12.01L10.8 11.75L10.91 11.48L11.06 11.2L11.27 10.94L11.53 10.75L11.84 10.65L12.16 10.65L12.47 10.75L12.73 10.94L12.94 11.2L13.09 11.48L13.2 11.75L13.27 12.01L13.34 12.22L13.44 12.41L13.56 12.58L13.73 12.76L13.91 12.96L14.1 13.2Z"/><path d="M9.2 17.8l1.4 1.4 2.6-2.6" stroke-opacity="0.55"/>',
  },
  // 4. atom (science)
  'sonaloop-research-4': {
    label: 'SonaloopResearch4Icon',
    body: '<g data-part="orbits"><ellipse cx="12" cy="12" rx="8.6" ry="3.4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="8.6" ry="3.4" transform="rotate(120 12 12)"/></g><path data-part="loop" d="M13.9 12L14.04 12.26L14.12 12.54L14.12 12.84L14.03 13.12L13.86 13.35L13.62 13.52L13.34 13.62L13.05 13.65L12.76 13.63L12.51 13.57L12.29 13.52L12.09 13.49L11.91 13.49L11.71 13.52L11.49 13.57L11.24 13.63L10.95 13.65L10.66 13.62L10.38 13.52L10.14 13.35L9.97 13.12L9.88 12.84L9.88 12.54L9.96 12.26L10.1 12L10.27 11.78L10.44 11.6L10.59 11.44L10.7 11.29L10.78 11.12L10.85 10.92L10.92 10.69L11.01 10.44L11.15 10.19L11.34 9.96L11.58 9.79L11.85 9.69L12.15 9.69L12.42 9.79L12.66 9.96L12.85 10.19L12.99 10.44L13.08 10.69L13.15 10.92L13.22 11.12L13.3 11.29L13.41 11.44L13.56 11.6L13.73 11.78L13.9 12Z"/>',
  },
  // 5. eye (observe)
  'sonaloop-research-5': {
    label: 'SonaloopResearch5Icon',
    body: '<path data-part="eye" d="M3 12s3.2-6 9-6 9 6 9 6-3.2 6-9 6-9-6-9-6z"/><path data-part="loop" d="M14.7 12L14.9 12.37L15.01 12.77L15.01 13.19L14.89 13.59L14.64 13.92L14.3 14.16L13.9 14.3L13.49 14.34L13.09 14.31L12.73 14.24L12.41 14.16L12.13 14.11L11.87 14.11L11.59 14.16L11.27 14.24L10.91 14.31L10.51 14.34L10.1 14.3L9.7 14.16L9.36 13.92L9.11 13.59L8.99 13.19L8.99 12.77L9.1 12.37L9.3 12L9.54 11.69L9.78 11.43L9.99 11.2L10.15 10.98L10.27 10.75L10.37 10.47L10.46 10.14L10.59 9.78L10.79 9.42L11.06 9.1L11.4 8.86L11.79 8.72L12.21 8.72L12.6 8.86L12.94 9.1L13.21 9.42L13.41 9.78L13.54 10.14L13.63 10.47L13.73 10.75L13.85 10.98L14.01 11.2L14.22 11.43L14.46 11.69L14.7 12Z"/>',
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
      // Two distinct people: a full front figure + a full back head & shoulder
      // (the old back person was a floating arc that read as a crooked head).
      '<circle cx="18" cy="18" r="7" fill="currentColor" fill-opacity="0.1" stroke-width="2"/>' +
      '<path d="M6 41a12 12 0 0 1 24 0z" fill="currentColor" fill-opacity="0.1" stroke-width="2"/>' +
      '<circle data-part="peer" cx="34" cy="15" r="5" fill="currentColor" fill-opacity="0.1" stroke-width="1.75"/>' +
      '<path data-part="peer" d="M31 25.5a11 11 0 0 1 11 13.5" stroke-width="1.75"/>',
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
      '<path data-part="top" d="M24 6l18 10-18 10L6 16z" fill="currentColor" fill-opacity="0.1" stroke-width="2"/>' +
      '<path d="M6 24l18 10 18-10" stroke-width="1.75"/>' +
      '<path d="M6 32l18 10 18-10" stroke-width="1.75" stroke-opacity="0.55"/>',
  },
  projects: {
    label: 'ProjectsHifi',
    // A folder with content rows — distinct from the sonaloop brand mark.
    body:
      '<path data-part="folder" d="M8 40h32a4 4 0 0 0 4-4V17a4 4 0 0 0-4-4h-14.2a4 4 0 0 1-3.2-1.6l-1.8-2.4a4 4 0 0 0-3.2-1.6H8a4 4 0 0 0-4 4V36a4 4 0 0 0 4 4z" fill="currentColor" fill-opacity="0.1" stroke-width="2"/>' +
      '<path data-part="rows" d="M14 25h13M14 31h8" stroke-width="1.75" stroke-opacity="0.55"/>',
  },
  plan: {
    label: 'PlanHifi',
    // A checklist board — the project plan / build-order.
    body:
      '<rect x="7" y="6" width="34" height="36" rx="4.5" fill="currentColor" fill-opacity="0.07" stroke-width="2"/>' +
      '<path data-part="checks" d="M13 16l2 2 3.4-4M13 25l2 2 3.4-4M13 34l2 2 3.4-4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<path data-part="lines" d="M23 16h11M23 25h11M23 34h7" stroke-width="1.5" stroke-opacity="0.55"/>',
  },
  memory: {
    label: 'MemoryHifi',
    body:
      '<circle cx="24" cy="24" r="20" fill="currentColor" fill-opacity="0.05" stroke="none"/>' +
      // Symmetric, lobed brain; fissure + sulci stay inside the silhouette.
      '<path data-part="brain" d="M24 9a6.5 6.5 0 0 0-6.4 5.4 5.5 5.5 0 0 0-2.1 9.9 5 5 0 0 0 2.3 7.6 5 5 0 0 0 6.2 4.1 5 5 0 0 0 6.2-4.1 5 5 0 0 0 2.3-7.6 5.5 5.5 0 0 0-2.1-9.9A6.5 6.5 0 0 0 24 9z" fill="currentColor" fill-opacity="0.08" stroke-width="2" stroke-linejoin="round"/>' +
      '<path d="M24 13v20" stroke-width="1.25" stroke-opacity="0.5"/>' +
      '<path data-part="sulci" d="M24 17h4M24 23h-4M24 29h4" stroke-width="1.25" stroke-opacity="0.5"/>',
  },
  panel: {
    label: 'PanelHifi',
    body:
      '<rect x="6" y="9" width="36" height="30" rx="4" fill="currentColor" fill-opacity="0.06" stroke-width="2"/>' +
      '<path d="M19 9v30" stroke-width="1.75"/>' +
      '<path data-part="lines" d="M10.5 16.5h4.5M10.5 22h4.5M10.5 27.5h4.5" stroke-width="1.5" stroke-opacity="0.6"/>',
  },
  settings: {
    label: 'SettingsHifi',
    // A true cog (8 teeth) so it reads as settings, not a sunburst like `sun`.
    body:
      '<path data-part="gear" d="M20.62 9.9L20.87 4.25L27.13 4.25L27.38 9.9L31.58 11.64L35.76 7.82L40.18 12.24L36.36 16.42L38.1 20.62L43.75 20.87L43.75 27.13L38.1 27.38L36.36 31.58L40.18 35.76L35.76 40.18L31.58 36.36L27.38 38.1L27.13 43.75L20.87 43.75L20.62 38.1L16.42 36.36L12.24 40.18L7.82 35.76L11.64 31.58L9.9 27.38L4.25 27.13L4.25 20.87L9.9 20.62L11.64 16.42L7.82 12.24L12.24 7.82L16.42 11.64Z" fill="currentColor" fill-opacity="0.1" stroke-width="2" stroke-linejoin="round"/>' +
      '<circle cx="24" cy="24" r="6.5" fill="currentColor" fill-opacity="0.12" stroke-width="2"/>' +
      '<circle cx="24" cy="24" r="2" fill="currentColor" stroke="none"/>',
  },
  sun: {
    label: 'SunHifi',
    body:
      '<circle data-part="core" cx="24" cy="24" r="8.5" fill="currentColor" fill-opacity="0.12" stroke-width="2"/>' +
      '<path data-part="rays" d="M24 4v6M24 38v6M4 24h6M38 24h6M9.9 9.9l4.3 4.3M33.8 33.8l4.3 4.3M38.1 9.9l-4.3 4.3M14.2 33.8l-4.3 4.3" stroke-width="1.75"/>',
  },
  moon: {
    label: 'MoonHifi',
    body:
      '<circle cx="24" cy="24" r="20" fill="currentColor" fill-opacity="0.05" stroke="none"/>' +
      '<path data-part="moon" d="M40 29A16 16 0 1 1 19 8a12.6 12.6 0 0 0 21 21z" fill="currentColor" fill-opacity="0.1" stroke-width="2"/>',
  },
  monitor: {
    label: 'MonitorHifi',
    body:
      '<rect data-part="screen" x="5" y="8" width="38" height="26" rx="4" fill="currentColor" fill-opacity="0.08" stroke-width="2"/>' +
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
      '<path data-part="bulb" d="M24 8a11 11 0 0 0-7 19.5c1 .9 1.6 1.9 1.6 3V32h10.8v-1.5c0-1.1.6-2.1 1.6-3A11 11 0 0 0 24 8z" fill="currentColor" fill-opacity="0.1" stroke-width="2"/>' +
      '<path d="M18.6 36h10.8M20.5 40h7" stroke-width="1.75"/>' +
      // A filament loop reads as a bulb; the old star looked like a stray glyph.
      '<path data-part="filament" d="M20.5 31v-3.5a3.5 3.5 0 0 1 7 0V31" stroke-width="1.5" stroke-opacity="0.65"/>',
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
      '<path data-part="needle" d="M31 17l-4 10-10 4 4-10z" fill="currentColor" fill-opacity="0.12" stroke-width="1.75"/>' +
      '<circle cx="24" cy="24" r="1.8" fill="currentColor" stroke="none"/>',
  },
  search: {
    label: 'SearchHifi',
    body:
      '<circle data-part="lens" cx="21" cy="21" r="14" fill="currentColor" fill-opacity="0.06" stroke-width="2"/>' +
      '<path data-part="lens" d="M31.5 31.5L42 42" stroke-width="2.5"/>' +
      '<path data-part="lens" d="M21 14a7 7 0 0 0-7 7" stroke-width="1.5" stroke-opacity="0.6"/>',
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
      '<path data-part="mark" d="M24 13v14" stroke-width="2.5"/>' +
      '<circle data-part="mark" cx="24" cy="34" r="1.7" fill="currentColor" stroke="none"/>',
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
      '<path data-part="hand" d="M14 22v16a2.5 2.5 0 0 1-2.5 2.5H8A2.5 2.5 0 0 1 5.5 38V24.5A2.5 2.5 0 0 1 8 22z" fill="currentColor" fill-opacity="0.1" stroke-width="2"/>' +
      '<path data-part="hand" d="M14 22l8.4-14.8a3.6 3.6 0 0 1 6.4 2.8L27 18h11.2a4 4 0 0 1 4 4.6l-2.2 13A4 4 0 0 1 36 40H14z" fill="currentColor" fill-opacity="0.1" stroke-width="2"/>',
  },
  warning: {
    label: 'WarningHifi',
    body:
      '<path d="M20.6 8.6 3.6 38a4 4 0 0 0 3.4 6h34a4 4 0 0 0 3.4-6L27.4 8.6a4 4 0 0 0-6.8 0z" fill="currentColor" fill-opacity="0.1" stroke-width="2"/>' +
      '<path data-part="mark" d="M24 19v9" stroke-width="2.5"/>' +
      '<circle data-part="mark" cx="24" cy="34.5" r="1.7" fill="currentColor" stroke="none"/>',
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
      '<path data-part="pencil" d="M9 39l2.5-8.5L31 11l6 6L17.5 36.5z" fill="currentColor" fill-opacity="0.1" stroke-width="2"/>' +
      '<path data-part="pencil" d="M27 15l6 6" stroke-width="1.75"/>' +
      '<path data-part="pencil" d="M9 39l2.5-8.5" stroke-width="2"/>',
  },

  // ── Brand ────────────────────────────────────────────────────────────────────
  // sonaloop — the company logo. Same house idiom as the rest of the hi-fi set
  // (outline + light currentColor fill + 2px stroke hierarchy, no gradient): a
  // lobed "loop" ribbon binding three nodes. `data-part="loop"` settles on hover.
  sonaloop: {
    label: 'SonaloopHifi',
    body:
      '<path data-part="loop" d="M37.5 24L38.14 25.49L38.53 27.09L38.62 28.75L38.34 30.38L37.69 31.91L36.7 33.23L35.42 34.28L33.94 35.04L32.35 35.5L30.75 35.69L29.2 35.68L27.75 35.55L26.42 35.38L25.18 35.24L24 35.19L22.82 35.24L21.58 35.38L20.25 35.55L18.8 35.68L17.25 35.69L15.65 35.5L14.06 35.04L12.58 34.28L11.3 33.23L10.31 31.91L9.66 30.38L9.38 28.75L9.47 27.09L9.86 25.49L10.5 24L11.28 22.66L12.12 21.48L12.94 20.41L13.67 19.4L14.31 18.41L14.86 17.36L15.36 16.22L15.88 14.98L16.48 13.66L17.25 12.31L18.22 11.02L19.41 9.87L20.8 8.97L22.36 8.39L24 8.19L25.64 8.39L27.2 8.97L28.59 9.87L29.78 11.02L30.75 12.31L31.52 13.66L32.12 14.98L32.64 16.22L33.14 17.36L33.69 18.4L34.33 19.4L35.06 20.41L35.88 21.48L36.72 22.66L37.5 24ZM31.5 24L30.75 23.29L30.01 22.72L29.36 22.26L28.84 21.84L28.49 21.4L28.29 20.88L28.18 20.23L28.11 19.44L27.99 18.51L27.75 17.5L27.34 16.5L26.74 15.58L25.95 14.84L25.01 14.36L24 14.19L22.99 14.36L22.05 14.84L21.26 15.58L20.66 16.5L20.25 17.5L20.01 18.51L19.89 19.44L19.82 20.23L19.71 20.88L19.51 21.41L19.16 21.84L18.64 22.26L17.99 22.72L17.25 23.29L16.5 24L15.83 24.86L15.34 25.84L15.09 26.9L15.14 27.94L15.5 28.91L16.16 29.7L17.04 30.27L18.07 30.58L19.17 30.65L20.25 30.5L21.24 30.2L22.1 29.84L22.83 29.51L23.45 29.27L24 29.19L24.55 29.27L25.17 29.51L25.9 29.84L26.76 30.2L27.75 30.5L28.83 30.65L29.93 30.58L30.96 30.27L31.84 29.7L32.5 28.91L32.86 27.94L32.91 26.9L32.66 25.84L32.17 24.86L31.5 24Z" fill="currentColor" fill-opacity="0.1" fill-rule="evenodd" stroke-width="2"/>' +
      '<circle cx="24" cy="6" r="3.6" fill="currentColor" fill-opacity="0.1" stroke-width="2"/>' +
      '<circle cx="39.59" cy="33" r="3.6" fill="currentColor" fill-opacity="0.1" stroke-width="2"/>' +
      '<circle cx="8.41" cy="33" r="3.6" fill="currentColor" fill-opacity="0.1" stroke-width="2"/>',
  },
  // ── Sonaloop product family — alternatives to choose from (enumerated) ──
  // 1. loop in cloud
  'sonaloop-cloud-1': {
    label: 'SonaloopCloud1Hifi',
    body: '<path data-part="cloud" d="M14.4 37h18.8a7.6 7.6 0 0 0 1.2-15.1 11 11 0 0 0-20.9-2.8A7.8 7.8 0 0 0 14.4 37z" fill="currentColor" fill-opacity="0.1" stroke-width="2"/><path data-part="loop" d="M29.4 26.8L29.79 27.53L30.02 28.35L30.02 29.18L29.77 29.97L29.28 30.64L28.6 31.12L27.81 31.4L26.97 31.49L26.17 31.42L25.45 31.27L24.82 31.12L24.27 31.02L23.73 31.02L23.18 31.12L22.55 31.27L21.83 31.42L21.03 31.49L20.19 31.4L19.4 31.12L18.72 30.64L18.23 29.97L17.98 29.18L17.98 28.35L18.21 27.53L18.6 26.8L19.08 26.18L19.56 25.66L19.98 25.21L20.31 24.77L20.55 24.29L20.73 23.73L20.92 23.08L21.19 22.37L21.57 21.65L22.12 21L22.8 20.51L23.59 20.25L24.41 20.25L25.2 20.51L25.88 21L26.43 21.65L26.81 22.37L27.08 23.08L27.27 23.73L27.45 24.29L27.69 24.77L28.02 25.21L28.44 25.66L28.92 26.18L29.4 26.8Z" stroke-width="1.75"/>',
  },
  // 2. deploy/uplink arrow
  'sonaloop-cloud-2': {
    label: 'SonaloopCloud2Hifi',
    body: '<path data-part="cloud" d="M14.4 37h18.8a7.6 7.6 0 0 0 1.2-15.1 11 11 0 0 0-20.9-2.8A7.8 7.8 0 0 0 14.4 37z" fill="currentColor" fill-opacity="0.1" stroke-width="2"/><path data-part="loop" d="M28 23.6L28.29 24.14L28.46 24.74L28.46 25.37L28.27 25.95L27.91 26.44L27.41 26.8L26.82 27.01L26.2 27.07L25.61 27.02L25.08 26.91L24.61 26.8L24.2 26.73L23.8 26.73L23.39 26.8L22.92 26.91L22.39 27.02L21.8 27.07L21.18 27.01L20.59 26.8L20.09 26.44L19.73 25.95L19.54 25.37L19.54 24.74L19.71 24.14L20 23.6L20.35 23.14L20.71 22.76L21.02 22.42L21.26 22.1L21.44 21.74L21.58 21.33L21.72 20.84L21.92 20.32L22.2 19.78L22.6 19.3L23.11 18.94L23.69 18.75L24.31 18.75L24.89 18.94L25.4 19.3L25.8 19.78L26.08 20.32L26.28 20.84L26.42 21.33L26.56 21.74L26.74 22.1L26.98 22.42L27.29 22.76L27.65 23.14L28 23.6Z" stroke-width="1.75"/><path d="M24 44v-6.6M20 40.2l4-4 4 4" stroke-width="2"/>',
  },
  // 3. powered (bolt)
  'sonaloop-cloud-3': {
    label: 'SonaloopCloud3Hifi',
    body: '<path data-part="cloud" d="M14.4 37h18.8a7.6 7.6 0 0 0 1.2-15.1 11 11 0 0 0-20.9-2.8A7.8 7.8 0 0 0 14.4 37z" fill="currentColor" fill-opacity="0.1" stroke-width="2"/><path data-part="loop" d="M28 23.2L28.29 23.74L28.46 24.34L28.46 24.97L28.27 25.55L27.91 26.04L27.41 26.4L26.82 26.61L26.2 26.67L25.61 26.62L25.08 26.51L24.61 26.4L24.2 26.33L23.8 26.33L23.39 26.4L22.92 26.51L22.39 26.62L21.8 26.67L21.18 26.61L20.59 26.4L20.09 26.04L19.73 25.55L19.54 24.97L19.54 24.34L19.71 23.74L20 23.2L20.35 22.74L20.71 22.36L21.02 22.02L21.26 21.7L21.44 21.34L21.58 20.93L21.72 20.44L21.92 19.92L22.2 19.38L22.6 18.9L23.11 18.54L23.69 18.35L24.31 18.35L24.89 18.54L25.4 18.9L25.8 19.38L26.08 19.92L26.28 20.44L26.42 20.93L26.56 21.34L26.74 21.7L26.98 22.02L27.29 22.36L27.65 22.74L28 23.2Z" stroke-width="1.75"/><path d="M25.2 36.8l-5.2 7.6h4.2l-2.2 5.2 6.8-8.2h-4.2z" fill="currentColor" fill-opacity="0.85" stroke="none"/>',
  },
  // 4. orbiting nodes
  'sonaloop-cloud-4': {
    label: 'SonaloopCloud4Hifi',
    body: '<path data-part="cloud" d="M14.4 37h18.8a7.6 7.6 0 0 0 1.2-15.1 11 11 0 0 0-20.9-2.8A7.8 7.8 0 0 0 14.4 37z" fill="currentColor" fill-opacity="0.1" stroke-width="2"/><path data-part="loop" d="M28.4 24.8L28.72 25.4L28.9 26.06L28.91 26.74L28.7 27.39L28.3 27.93L27.75 28.32L27.1 28.55L26.42 28.62L25.77 28.56L25.18 28.44L24.67 28.32L24.22 28.24L23.78 28.24L23.33 28.32L22.82 28.44L22.23 28.56L21.58 28.62L20.9 28.55L20.25 28.32L19.7 27.93L19.3 27.39L19.09 26.74L19.1 26.06L19.28 25.4L19.6 24.8L19.99 24.29L20.38 23.87L20.72 23.5L20.99 23.15L21.19 22.75L21.34 22.3L21.49 21.77L21.71 21.19L22.02 20.6L22.46 20.07L23.02 19.68L23.66 19.46L24.34 19.46L24.98 19.68L25.54 20.07L25.98 20.6L26.29 21.19L26.51 21.77L26.66 22.3L26.81 22.75L27.01 23.15L27.28 23.5L27.62 23.87L28.01 24.29L28.4 24.8Z" stroke-width="1.75"/><circle cx="11.2" cy="32.4" r="1.7" fill="currentColor" stroke="none"/><circle cx="36.8" cy="32.4" r="1.7" fill="currentColor" stroke="none"/><circle cx="24" cy="12" r="1.7" fill="currentColor" stroke="none"/>',
  },
  // 5. streaming data dots
  'sonaloop-cloud-5': {
    label: 'SonaloopCloud5Hifi',
    body: '<path data-part="cloud" d="M14.4 37h18.8a7.6 7.6 0 0 0 1.2-15.1 11 11 0 0 0-20.9-2.8A7.8 7.8 0 0 0 14.4 37z" fill="currentColor" fill-opacity="0.1" stroke-width="2"/><path data-part="loop" d="M28.4 24.8L28.72 25.4L28.9 26.06L28.91 26.74L28.7 27.39L28.3 27.93L27.75 28.32L27.1 28.55L26.42 28.62L25.77 28.56L25.18 28.44L24.67 28.32L24.22 28.24L23.78 28.24L23.33 28.32L22.82 28.44L22.23 28.56L21.58 28.62L20.9 28.55L20.25 28.32L19.7 27.93L19.3 27.39L19.09 26.74L19.1 26.06L19.28 25.4L19.6 24.8L19.99 24.29L20.38 23.87L20.72 23.5L20.99 23.15L21.19 22.75L21.34 22.3L21.49 21.77L21.71 21.19L22.02 20.6L22.46 20.07L23.02 19.68L23.66 19.46L24.34 19.46L24.98 19.68L25.54 20.07L25.98 20.6L26.29 21.19L26.51 21.77L26.66 22.3L26.81 22.75L27.01 23.15L27.28 23.5L27.62 23.87L28.01 24.29L28.4 24.8Z" stroke-width="1.75"/><circle cx="18" cy="42" r="1.5" fill="currentColor" stroke="none"/><circle cx="24" cy="42" r="1.5" fill="currentColor" stroke="none"/><circle cx="30" cy="42" r="1.5" fill="currentColor" stroke="none"/>',
  },
  // 1. flask
  'sonaloop-research-1': {
    label: 'SonaloopResearch1Hifi',
    body: '<path data-part="flask" d="M19 7h10M21.4 7v10L12.6 33.6A3.6 3.6 0 0 0 15.8 39.2h16.4a3.6 3.6 0 0 0 3.2-5.6L26.6 17V7" fill="currentColor" fill-opacity="0.08" stroke-width="2"/><path d="M16.4 27.6h15.2" stroke-width="1.5" stroke-opacity="0.6"/><path data-part="loop" d="M27.4 31.4L27.65 31.86L27.79 32.37L27.79 32.9L27.63 33.4L27.33 33.82L26.9 34.12L26.4 34.3L25.87 34.35L25.37 34.31L24.91 34.22L24.52 34.12L24.17 34.06L23.83 34.06L23.48 34.12L23.09 34.22L22.63 34.31L22.13 34.35L21.6 34.3L21.1 34.12L20.67 33.82L20.37 33.4L20.21 32.9L20.21 32.37L20.35 31.86L20.6 31.4L20.9 31.01L21.2 30.68L21.47 30.4L21.67 30.12L21.82 29.82L21.94 29.47L22.06 29.06L22.23 28.61L22.47 28.16L22.81 27.75L23.24 27.44L23.74 27.27L24.26 27.27L24.76 27.44L25.19 27.75L25.53 28.16L25.77 28.61L25.94 29.06L26.06 29.47L26.18 29.82L26.33 30.12L26.53 30.4L26.8 30.68L27.1 31.01L27.4 31.4Z" stroke-width="1.6"/>',
  },
  // 2. report/deliverable
  'sonaloop-research-2': {
    label: 'SonaloopResearch2Hifi',
    body: '<path data-part="page" d="M13 6h13l9 9V40a3 3 0 0 1-3 3H13a3 3 0 0 1-3-3V9a3 3 0 0 1 3-3z" fill="currentColor" fill-opacity="0.08" stroke-width="2"/><path d="M26 6v9h9" stroke-width="1.75" stroke-opacity="0.6"/><path d="M16.5 36.6h15" stroke-width="1.5" stroke-opacity="0.6"/><path data-part="loop" d="M27.6 25.2L27.92 25.8L28.1 26.46L28.11 27.14L27.9 27.79L27.5 28.33L26.95 28.72L26.3 28.95L25.62 29.02L24.97 28.96L24.38 28.84L23.87 28.72L23.42 28.64L22.98 28.64L22.53 28.72L22.02 28.84L21.43 28.96L20.78 29.02L20.1 28.95L19.45 28.72L18.9 28.33L18.5 27.79L18.29 27.14L18.3 26.46L18.48 25.8L18.8 25.2L19.19 24.69L19.58 24.27L19.92 23.9L20.19 23.55L20.39 23.15L20.54 22.7L20.69 22.17L20.91 21.59L21.22 21L21.66 20.47L22.22 20.08L22.86 19.86L23.54 19.86L24.18 20.08L24.74 20.47L25.18 21L25.49 21.59L25.71 22.17L25.86 22.7L26.01 23.15L26.21 23.55L26.48 23.9L26.82 24.27L27.21 24.69L27.6 25.2Z" stroke-width="1.6"/>',
  },
  // 3. clipboard (managed)
  'sonaloop-research-3': {
    label: 'SonaloopResearch3Hifi',
    body: '<path data-part="board" d="M13 11h22a3 3 0 0 1 3 3v26a3 3 0 0 1-3 3H13a3 3 0 0 1-3-3V14a3 3 0 0 1 3-3z" fill="currentColor" fill-opacity="0.08" stroke-width="2"/><path d="M18.5 11v-1a5.5 5.5 0 0 1 11 0v1" stroke-width="1.75"/><path d="M18 8.8h12" stroke-width="1.75" stroke-opacity="0.6"/><path data-part="loop" d="M28 26L28.29 26.54L28.46 27.14L28.46 27.77L28.27 28.35L27.91 28.84L27.41 29.2L26.82 29.41L26.2 29.47L25.61 29.42L25.08 29.31L24.61 29.2L24.2 29.13L23.8 29.13L23.39 29.2L22.92 29.31L22.39 29.42L21.8 29.47L21.18 29.41L20.59 29.2L20.09 28.84L19.73 28.35L19.54 27.77L19.54 27.14L19.71 26.54L20 26L20.35 25.54L20.71 25.16L21.02 24.82L21.26 24.5L21.44 24.14L21.58 23.73L21.72 23.24L21.92 22.72L22.2 22.18L22.6 21.7L23.11 21.34L23.69 21.15L24.31 21.15L24.89 21.34L25.4 21.7L25.8 22.18L26.08 22.72L26.28 23.24L26.42 23.73L26.56 24.14L26.74 24.5L26.98 24.82L27.29 25.16L27.65 25.54L28 26Z" stroke-width="1.6"/><path d="M18.4 35.6l2.8 2.8 5.2-5.2" stroke-width="1.75" stroke-opacity="0.55"/>',
  },
  // 4. atom (science)
  'sonaloop-research-4': {
    label: 'SonaloopResearch4Hifi',
    body: '<g data-part="orbits"><ellipse cx="24" cy="24" rx="17" ry="6.8" transform="rotate(60 24 24)" stroke-width="2"/><ellipse cx="24" cy="24" rx="17" ry="6.8" transform="rotate(120 24 24)" stroke-width="2"/></g><path data-part="loop" d="M27.7 24L27.97 24.5L28.12 25.06L28.12 25.63L27.95 26.17L27.62 26.63L27.15 26.96L26.61 27.15L26.04 27.21L25.49 27.16L25 27.06L24.56 26.96L24.18 26.89L23.82 26.89L23.44 26.96L23 27.06L22.51 27.16L21.96 27.21L21.39 27.15L20.85 26.96L20.38 26.63L20.05 26.17L19.88 25.63L19.88 25.06L20.03 24.5L20.3 24L20.63 23.57L20.96 23.22L21.24 22.91L21.47 22.61L21.63 22.28L21.76 21.9L21.89 21.45L22.07 20.96L22.34 20.47L22.71 20.03L23.18 19.69L23.72 19.51L24.28 19.51L24.82 19.69L25.29 20.03L25.66 20.47L25.93 20.96L26.11 21.45L26.24 21.9L26.37 22.28L26.53 22.61L26.76 22.91L27.04 23.22L27.37 23.57L27.7 24Z" stroke-width="1.75"/>',
  },
  // 5. eye (observe)
  'sonaloop-research-5': {
    label: 'SonaloopResearch5Hifi',
    body: '<path data-part="eye" d="M6 24s6.4-12 18-12 18 12 18 12-6.4 12-18 12-18-12-18-12z" fill="currentColor" fill-opacity="0.07" stroke-width="2"/><path data-part="loop" d="M29.4 24L29.79 24.73L30.02 25.55L30.02 26.38L29.77 27.17L29.28 27.84L28.6 28.32L27.81 28.6L26.97 28.69L26.17 28.62L25.45 28.47L24.82 28.32L24.27 28.22L23.73 28.22L23.18 28.32L22.55 28.47L21.83 28.62L21.03 28.69L20.19 28.6L19.4 28.32L18.72 27.84L18.23 27.17L17.98 26.38L17.98 25.55L18.21 24.73L18.6 24L19.08 23.38L19.56 22.86L19.98 22.41L20.31 21.97L20.55 21.49L20.73 20.93L20.92 20.28L21.19 19.57L21.57 18.85L22.12 18.2L22.8 17.71L23.59 17.45L24.41 17.45L25.2 17.71L25.88 18.2L26.43 18.85L26.81 19.57L27.08 20.28L27.27 20.93L27.45 21.49L27.69 21.97L28.02 22.41L28.44 22.86L28.92 23.38L29.4 24Z" stroke-width="1.75"/>',
  },
};
