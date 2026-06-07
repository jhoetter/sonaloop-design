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
  // memory-entity kinds (purpose-built): a project (briefcase), a single contact, a topic tag.
  briefcase: {
    label: 'BriefcaseIcon',
    body: '<rect x="3" y="7.5" width="18" height="12.5" rx="2"/><path d="M8 7.5V5.8A1.8 1.8 0 0 1 9.8 4h4.4A1.8 1.8 0 0 1 16 5.8v1.7"/><path d="M3 12.5h18"/>',
  },
  contact: {
    label: 'ContactIcon',
    body: '<circle cx="12" cy="8" r="3.4"/><path d="M5.5 19.5a6.5 6.5 0 0 1 13 0"/>',
  },
  tag: {
    label: 'TagIcon',
    body: '<path d="M11.6 3.7H5A1.3 1.3 0 0 0 3.7 5v6.6a1.6 1.6 0 0 0 .47 1.13l8.2 8.2a1.6 1.6 0 0 0 2.26 0l5.6-5.6a1.6 1.6 0 0 0 0-2.26l-8.2-8.2A1.6 1.6 0 0 0 11.6 3.7z"/><circle cx="7.6" cy="7.6" r="1.3"/>',
  },
  clock: {
    label: 'ClockIcon',
    body: '<circle cx="12" cy="12" r="9"/><path d="M12 7.2V12l3.2 1.9"/>',
  },
  report: {
    label: 'ReportIcon',
    // a document with text lines — the meta-report artifact.
    body: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8.5 8h7M8.5 12h7M8.5 16h4"/>',
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
  // ── Sonaloop product family ──────────────────────────────────────────────────
  // sonaloop-cloud — hosted/managed platform: the brand mark "cloud-ified" — a
  // cloud silhouette with the brand rounded-triangle as its hole.
  'sonaloop-cloud': {
    label: 'SonaloopCloudIcon',
    body: '<path data-part="cloud" d="M5.17 21h13.65a4.46 4.46 0 0 0 0.68 -8.87 6.3 6.3 0 0 0 -11.97 -1.58 4.51 4.51 0 0 0 -2.36 10.45zM16.3 12.5L16.08 12.14L15.85 11.82L15.62 11.53L15.41 11.26L15.22 11L15.05 10.74L14.91 10.46L14.78 10.17L14.65 9.85L14.52 9.5L14.35 9.14L14.15 8.78L13.9 8.42L13.6 8.1L13.25 7.82L12.86 7.61L12.44 7.47L12 7.43L11.56 7.47L11.14 7.61L10.75 7.82L10.4 8.1L10.1 8.42L9.85 8.78L9.65 9.14L9.48 9.5L9.35 9.85L9.22 10.17L9.09 10.46L8.95 10.74L8.78 11L8.59 11.26L8.38 11.53L8.15 11.82L7.92 12.14L7.7 12.5L7.52 12.89L7.38 13.31L7.32 13.75L7.33 14.2L7.43 14.63L7.61 15.04L7.87 15.4L8.19 15.69L8.57 15.93L8.99 16.09L9.42 16.19L9.85 16.22L10.27 16.22L10.66 16.18L11.03 16.12L11.37 16.07L11.69 16.04L12 16.03L12.31 16.04L12.63 16.07L12.97 16.12L13.34 16.18L13.73 16.22L14.15 16.22L14.58 16.19L15.01 16.09L15.43 15.93L15.81 15.69L16.13 15.4L16.39 15.04L16.57 14.63L16.67 14.2L16.68 13.75L16.62 13.31L16.48 12.89L16.3 12.5Z" fill-rule="evenodd"/>',
  },
  // sonaloop-research — done-for-you studies: the brand loop with a nucleus dot,
  // ringed by a tilted orbit (an "atom" built from the loop).
  'sonaloop-research': {
    label: 'SonaloopResearchIcon',
    body: '<g data-part="orbits"><path d="M18.85 10.54L18.88 10.97L18.82 11.41L18.66 11.85L18.4 12.3L18.05 12.75L17.61 13.18L17.09 13.6L16.49 13.99L15.83 14.36L15.11 14.68L14.35 14.98L13.55 15.22L12.73 15.42L11.9 15.57L11.07 15.67L10.25 15.72L9.46 15.71L8.71 15.64L8 15.53L7.36 15.36L6.78 15.14L6.28 14.88L5.86 14.57L5.53 14.23L5.29 13.86L5.15 13.46L5.12 13.03L5.18 12.59L5.34 12.15L5.6 11.7L5.95 11.25L6.39 10.82L6.91 10.4L7.51 10.01L8.17 9.64L8.89 9.32L9.65 9.02L10.45 8.78L11.27 8.58L12.1 8.43L12.93 8.33L13.75 8.28L14.54 8.29L15.29 8.36L16 8.47L16.64 8.64L17.22 8.86L17.72 9.12L18.14 9.43L18.47 9.77L18.71 10.14L18.85 10.54Z"/></g><path data-part="loop" d="M16.75 12L16.98 12.44L17.15 12.91L17.24 13.4L17.24 13.91L17.14 14.4L16.94 14.85L16.64 15.25L16.27 15.58L15.83 15.83L15.36 16L14.87 16.09L14.38 16.11L13.9 16.08L13.46 16.02L13.06 15.94L12.68 15.87L12.33 15.82L12 15.8L11.67 15.82L11.32 15.87L10.94 15.94L10.54 16.02L10.1 16.08L9.63 16.11L9.13 16.09L8.64 16L8.17 15.83L7.73 15.58L7.36 15.25L7.06 14.85L6.86 14.4L6.76 13.91L6.76 13.4L6.85 12.91L7.02 12.44L7.25 12L7.51 11.61L7.79 11.26L8.06 10.94L8.31 10.66L8.53 10.38L8.71 10.1L8.86 9.8L8.99 9.48L9.12 9.12L9.25 8.73L9.42 8.31L9.62 7.89L9.89 7.47L10.21 7.09L10.6 6.76L11.03 6.51L11.51 6.35L12 6.3L12.49 6.35L12.97 6.51L13.4 6.76L13.79 7.09L14.11 7.47L14.38 7.89L14.58 8.31L14.75 8.73L14.88 9.12L15.01 9.48L15.14 9.8L15.29 10.1L15.47 10.38L15.69 10.66L15.94 10.94L16.21 11.26L16.49 11.61L16.75 12ZM15 12L14.83 11.75L14.66 11.53L14.49 11.33L14.33 11.15L14.19 10.98L14.08 10.8L13.98 10.61L13.9 10.41L13.82 10.18L13.74 9.93L13.63 9.67L13.5 9.4L13.33 9.14L13.13 8.9L12.89 8.69L12.61 8.53L12.31 8.43L12 8.4L11.69 8.43L11.39 8.53L11.11 8.69L10.87 8.9L10.67 9.14L10.5 9.4L10.37 9.67L10.26 9.93L10.18 10.18L10.1 10.41L10.02 10.61L9.92 10.8L9.81 10.98L9.67 11.15L9.51 11.33L9.34 11.53L9.17 11.75L9 12L8.86 12.28L8.75 12.57L8.69 12.89L8.69 13.2L8.76 13.51L8.88 13.8L9.07 14.05L9.3 14.26L9.58 14.42L9.88 14.53L10.19 14.58L10.5 14.6L10.8 14.58L11.08 14.54L11.33 14.49L11.57 14.44L11.79 14.41L12 14.4L12.21 14.41L12.43 14.44L12.67 14.49L12.92 14.54L13.2 14.58L13.5 14.6L13.81 14.58L14.12 14.53L14.42 14.42L14.7 14.26L14.93 14.05L15.12 13.8L15.24 13.51L15.31 13.2L15.31 12.89L15.25 12.57L15.14 12.28L15 12Z" fill-rule="evenodd"/><circle cx="12" cy="12" r="1.1" fill="currentColor" stroke="none"/>',
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
  // ── Sonaloop product family ──────────────────────────────────────────────────
  // sonaloop-cloud — the brand mark "cloud-ified": a cloud with the rounded-
  // triangle brand hole (currentColor + light fill via even-odd).
  'sonaloop-cloud': {
    label: 'SonaloopCloudHifi',
    body: '<path data-part="cloud" d="M10.35 42h27.3a8.93 8.93 0 0 0 1.37 -17.74 12.6 12.6 0 0 0 -23.94 -3.15 9.03 9.03 0 0 0 -4.73 20.9zM32.6 25L32.17 24.29L31.71 23.64L31.25 23.06L30.82 22.52L30.44 22L30.11 21.47L29.82 20.92L29.56 20.33L29.31 19.69L29.03 19L28.7 18.28L28.3 17.55L27.8 16.84L27.21 16.19L26.51 15.64L25.73 15.21L24.88 14.94L24 14.85L23.12 14.94L22.27 15.21L21.49 15.64L20.79 16.19L20.2 16.84L19.7 17.55L19.3 18.28L18.97 19L18.69 19.69L18.44 20.33L18.18 20.92L17.89 21.47L17.56 22L17.18 22.52L16.75 23.06L16.29 23.64L15.83 24.29L15.4 25L15.03 25.78L14.77 26.63L14.64 27.51L14.66 28.4L14.85 29.27L15.21 30.07L15.73 30.79L16.39 31.39L17.14 31.86L17.97 32.18L18.84 32.37L19.7 32.45L20.53 32.43L21.32 32.35L22.06 32.25L22.74 32.15L23.38 32.08L24 32.05L24.62 32.08L25.26 32.15L25.94 32.25L26.68 32.35L27.47 32.43L28.3 32.45L29.16 32.37L30.03 32.18L30.86 31.86L31.61 31.39L32.27 30.79L32.79 30.07L33.15 29.27L33.34 28.4L33.36 27.51L33.23 26.63L32.97 25.78L32.6 25Z" fill-rule="evenodd" fill="currentColor" fill-opacity="0.12" stroke-width="2"/>',
  },
  // sonaloop-research — the brand loop as an atom: nucleus dot + tilted orbit ring.
  'sonaloop-research': {
    label: 'SonaloopResearchHifi',
    body: '<g data-part="orbits"><path d="M37.69 21.09L37.77 21.94L37.64 22.81L37.32 23.71L36.8 24.6L36.1 25.49L35.22 26.36L34.17 27.19L32.98 27.98L31.65 28.71L30.22 29.37L28.69 29.95L27.1 30.45L25.46 30.85L23.79 31.15L22.14 31.34L20.5 31.43L18.92 31.42L17.42 31.29L16.01 31.06L14.71 30.72L13.56 30.29L12.55 29.76L11.71 29.15L11.05 28.46L10.58 27.71L10.31 26.91L10.23 26.06L10.36 25.19L10.68 24.29L11.2 23.4L11.9 22.51L12.78 21.64L13.83 20.81L15.02 20.02L16.35 19.29L17.78 18.63L19.31 18.05L20.9 17.55L22.54 17.15L24.21 16.85L25.86 16.66L27.5 16.57L29.08 16.58L30.58 16.71L31.99 16.94L33.29 17.28L34.44 17.71L35.45 18.24L36.29 18.85L36.95 19.54L37.42 20.29L37.69 21.09Z" stroke-width="1.85"/></g><path data-part="loop" d="M33.5 24L33.95 24.87L34.29 25.81L34.47 26.81L34.47 27.81L34.27 28.79L33.87 29.7L33.29 30.5L32.54 31.16L31.67 31.67L30.72 32.01L29.73 32.18L28.75 32.23L27.81 32.16L26.92 32.03L26.11 31.88L25.36 31.74L24.67 31.64L24 31.6L23.33 31.64L22.64 31.74L21.89 31.88L21.08 32.03L20.19 32.16L19.25 32.23L18.27 32.18L17.28 32.01L16.33 31.67L15.46 31.16L14.71 30.5L14.13 29.7L13.73 28.79L13.53 27.81L13.53 26.81L13.71 25.81L14.05 24.87L14.5 24L15.03 23.21L15.58 22.52L16.12 21.89L16.62 21.31L17.05 20.76L17.42 20.2L17.72 19.6L17.98 18.95L18.23 18.23L18.5 17.45L18.83 16.62L19.25 15.77L19.78 14.94L20.43 14.18L21.19 13.53L22.06 13.02L23.01 12.71L24 12.6L24.99 12.71L25.94 13.02L26.81 13.53L27.57 14.18L28.22 14.94L28.75 15.77L29.17 16.62L29.5 17.45L29.77 18.23L30.02 18.95L30.28 19.6L30.58 20.2L30.95 20.76L31.38 21.31L31.88 21.89L32.42 22.52L32.97 23.21L33.5 24ZM30 24L29.67 23.5L29.32 23.06L28.98 22.67L28.66 22.3L28.39 21.95L28.16 21.6L27.97 21.22L27.8 20.81L27.64 20.36L27.47 19.86L27.26 19.34L27 18.8L26.67 18.28L26.26 17.8L25.77 17.38L25.22 17.07L24.62 16.87L24 16.8L23.38 16.87L22.78 17.07L22.23 17.38L21.74 17.8L21.33 18.28L21 18.8L20.74 19.34L20.53 19.86L20.36 20.36L20.2 20.81L20.03 21.22L19.84 21.6L19.61 21.95L19.34 22.3L19.02 22.67L18.68 23.06L18.33 23.5L18 24L17.71 24.55L17.5 25.15L17.38 25.77L17.39 26.41L17.51 27.03L17.76 27.6L18.14 28.11L18.61 28.52L19.16 28.84L19.76 29.06L20.38 29.17L21 29.2L21.6 29.16L22.15 29.07L22.67 28.98L23.14 28.89L23.58 28.82L24 28.8L24.42 28.82L24.86 28.89L25.33 28.98L25.85 29.07L26.4 29.16L27 29.2L27.62 29.17L28.24 29.06L28.84 28.84L29.39 28.52L29.86 28.11L30.24 27.6L30.49 27.03L30.61 26.41L30.62 25.77L30.5 25.15L30.29 24.55L30 24Z" fill-rule="evenodd" fill="currentColor" fill-opacity="0.12" stroke-width="2"/><circle cx="24" cy="24" r="2.2" fill="currentColor" stroke="none"/>',
  },
};
