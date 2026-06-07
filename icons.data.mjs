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

  // ── Method icons (purpose-built for the website's 5 research methods + pressure-test) ──
  // jtbd — forces of progress: a strong "pull" arrow forward, a weaker "push/hold"
  // arrow back, meeting at the moment of switch (pivot node). Distinct from
  // `exchange` (a circular swap) — these are opposing linear forces.
  jtbd: {
    label: 'JtbdIcon',
    body: '<circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none"/><path d="M14 12h6.5M17.5 8.5L21 12l-3.5 3.5"/><path d="M10 12H3.5M6.5 9.5L3.5 12l3 2.5"/>',
  },
  // pricing-research — willingness-to-pay sensitivity: a price tag over a range
  // slider (the acceptable band, with a knob you move).
  pricingResearch: {
    label: 'PricingResearchIcon',
    body: '<path d="M12.7 3.5H6.5A1.3 1.3 0 0 0 5.2 4.8V11a1.6 1.6 0 0 0 .47 1.13l5.2 5.2a1.6 1.6 0 0 0 2.26 0l4.4-4.4a1.6 1.6 0 0 0 0-2.26l-5.2-5.2A1.6 1.6 0 0 0 12.7 3.5z"/><circle cx="8.6" cy="7.4" r="1.2"/><path d="M4 21h16"/><circle cx="14" cy="21" r="1.7" fill="currentColor" stroke="none"/>',
  },
  // positioning — does the message land on the intended position: a map pin
  // dropped on a precise point (the position you claim in the market).
  positioning: {
    label: 'PositioningIcon',
    body: '<path d="M12 21s6.5-6.1 6.5-11A6.5 6.5 0 0 0 5.5 10c0 4.9 6.5 11 6.5 11z"/><circle cx="12" cy="10" r="2.4"/>',
  },
  // design-thinking-hmw — divergence: one pain point branches into several
  // How-Might-We opportunities.
  designThinkingHmw: {
    label: 'DesignThinkingHmwIcon',
    body: '<circle cx="5" cy="12" r="2.2"/><circle cx="19" cy="5.5" r="2.2"/><circle cx="19" cy="12" r="2.2"/><circle cx="19" cy="18.5" r="2.2"/><path d="M7.2 12h2.3M16.8 12h-2.3M9.5 12c2.5 0 2-6.5 5.3-6.5M9.5 12c2.5 0 2 6.5 5.3 6.5"/>',
  },
  // continuous-discovery — a standing panel that recurs and remembers: a cyclical
  // loop arrow with time ticks (it comes back around, week over week).
  continuousDiscovery: {
    label: 'ContinuousDiscoveryIcon',
    body: '<path d="M20 12a8 8 0 1 1-2.3-5.6"/><path d="M20 4v3.2h-3.2"/><path d="M12 8v4l2.6 1.6"/>',
  },
  // pressure-test — stress a decision before you ship: a gauge dial with the
  // needle pushed into the high zone.
  pressureTest: {
    label: 'PressureTestIcon',
    body: '<path d="M3.5 17a8.5 8.5 0 0 1 17 0"/><path d="M3.5 17h2M18.5 17h2M12 8.5V7M6.4 11.4l-1-1M17.6 11.4l1-1"/><path d="M12 17l4.2-4.6"/><circle cx="12" cy="17" r="1.3" fill="currentColor" stroke="none"/>',
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
  // ── Sonaloop product family — full sonaloop mark + corner badge chip ───────────
  // full sonaloop mark + small cloud badge chip (bottom-right)
  'sonaloop-cloud': {
    label: 'SonaloopCloudIcon',
    body: '<defs><mask id="slCloudBadgeR"><rect width="24" height="24" fill="white"/><path d="M16.8 13.8H20A3 3 0 0 1 23 16.8V20A3 3 0 0 1 20 23H16.8A3 3 0 0 1 13.8 20V16.8A3 3 0 0 1 16.8 13.8Z" fill="black"/></mask></defs><g mask="url(#slCloudBadgeR)"><path data-part="loop" d="M17 12L17.31 12.62L17.49 13.3L17.51 14.01L17.35 14.69L17 15.29L16.49 15.77L15.87 16.1L15.19 16.28L14.5 16.33L13.84 16.28L13.25 16.17L12.72 16.07L12.23 16.01L11.77 16.01L11.28 16.07L10.75 16.17L10.16 16.28L9.5 16.33L8.81 16.28L8.13 16.1L7.51 15.77L7 15.29L6.65 14.69L6.49 14.01L6.51 13.3L6.69 12.62L7 12L7.37 11.46L7.76 11L8.12 10.59L8.41 10.2L8.65 9.79L8.83 9.34L9.01 8.83L9.22 8.26L9.5 7.67L9.88 7.09L10.38 6.59L10.98 6.22L11.65 6.03L12.35 6.03L13.02 6.22L13.62 6.59L14.12 7.09L14.5 7.67L14.78 8.26L14.99 8.83L15.17 9.34L15.35 9.79L15.59 10.2L15.88 10.59L16.24 11L16.63 11.46L17 12Z"/><circle cx="12" cy="3.7" r="1.85"/><circle cx="19.19" cy="16.15" r="1.85"/><circle cx="4.81" cy="16.15" r="1.85"/></g><path data-part="badge" d="M17.1 14.7H19.7A2.4 2.4 0 0 1 22.1 17.1V19.7A2.4 2.4 0 0 1 19.7 22.1H17.1A2.4 2.4 0 0 1 14.7 19.7V17.1A2.4 2.4 0 0 1 17.1 14.7ZM16.07 20.47h4.66a1.52 1.52 0 0 0 0.23 -3.03 2.15 2.15 0 0 0 -4.09 -0.54 1.54 1.54 0 0 0 -0.81 3.57z" fill-rule="evenodd" fill="currentColor"/>',
  },
  // full sonaloop mark + small flask badge chip (bottom-right)
  'sonaloop-research': {
    label: 'SonaloopResearchIcon',
    body: '<defs><mask id="slResBadgeR"><rect width="24" height="24" fill="white"/><path d="M16.8 13.8H20A3 3 0 0 1 23 16.8V20A3 3 0 0 1 20 23H16.8A3 3 0 0 1 13.8 20V16.8A3 3 0 0 1 16.8 13.8Z" fill="black"/></mask></defs><g mask="url(#slResBadgeR)"><path data-part="loop" d="M17 12L17.31 12.62L17.49 13.3L17.51 14.01L17.35 14.69L17 15.29L16.49 15.77L15.87 16.1L15.19 16.28L14.5 16.33L13.84 16.28L13.25 16.17L12.72 16.07L12.23 16.01L11.77 16.01L11.28 16.07L10.75 16.17L10.16 16.28L9.5 16.33L8.81 16.28L8.13 16.1L7.51 15.77L7 15.29L6.65 14.69L6.49 14.01L6.51 13.3L6.69 12.62L7 12L7.37 11.46L7.76 11L8.12 10.59L8.41 10.2L8.65 9.79L8.83 9.34L9.01 8.83L9.22 8.26L9.5 7.67L9.88 7.09L10.38 6.59L10.98 6.22L11.65 6.03L12.35 6.03L13.02 6.22L13.62 6.59L14.12 7.09L14.5 7.67L14.78 8.26L14.99 8.83L15.17 9.34L15.35 9.79L15.59 10.2L15.88 10.59L16.24 11L16.63 11.46L17 12Z"/><circle cx="12" cy="3.7" r="1.85"/><circle cx="19.19" cy="16.15" r="1.85"/><circle cx="4.81" cy="16.15" r="1.85"/></g><path data-part="badge" d="M17.1 14.7H19.7A2.4 2.4 0 0 1 22.1 17.1V19.7A2.4 2.4 0 0 1 19.7 22.1H17.1A2.4 2.4 0 0 1 14.7 19.7V17.1A2.4 2.4 0 0 1 17.1 14.7ZM17.31 16.42L19.49 16.42L19.49 17.68L20.67 20.45L20.25 21.2L16.55 21.2L16.13 20.45L17.31 17.68Z" fill-rule="evenodd" fill="currentColor"/>',
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
  // ── Method icons (48×48 twins) ───────────────────────────────────────────────
  jtbd: {
    label: 'JtbdHifi',
    body:
      '<circle cx="24" cy="24" r="20" fill="currentColor" fill-opacity="0.05" stroke="none"/>' +
      // strong "pull" force forward
      '<path data-part="pull" d="M27 24h13M34 17l7 7-7 7" stroke-width="2.5"/>' +
      // weaker "push/hold" force back
      '<path data-part="push" d="M21 24H10M15 18l-5 6 5 6" stroke-width="1.75" stroke-opacity="0.6"/>' +
      // the moment of switch (pivot)
      '<circle cx="24" cy="24" r="3" fill="currentColor" fill-opacity="0.2" stroke-width="1.75"/>',
  },
  pricingResearch: {
    label: 'PricingResearchHifi',
    body:
      // a price tag
      '<path data-part="tag" d="M25.4 6H13A2.6 2.6 0 0 0 10.4 8.6V21a3.2 3.2 0 0 0 .94 2.26l10.4 10.4a3.2 3.2 0 0 0 4.52 0l8.8-8.8a3.2 3.2 0 0 0 0-4.52L24.66 9.94A3.2 3.2 0 0 0 25.4 6z" fill="currentColor" fill-opacity="0.08" stroke-width="2"/>' +
      '<circle cx="17.2" cy="13.8" r="2.4" stroke-width="1.75"/>' +
      // a willingness-to-pay range slider with a knob
      '<path d="M7 42h34" stroke-width="2"/>' +
      '<circle data-part="knob" cx="28" cy="42" r="3.4" fill="currentColor" fill-opacity="0.2" stroke-width="2"/>',
  },
  positioning: {
    label: 'PositioningHifi',
    body:
      '<circle cx="24" cy="20" r="18" fill="currentColor" fill-opacity="0.05" stroke="none"/>' +
      '<path data-part="pin" d="M24 43s12-11.3 12-20.5A12 12 0 0 0 12 22.5C12 31.7 24 43 24 43z" fill="currentColor" fill-opacity="0.1" stroke-width="2"/>' +
      '<circle data-part="dot" cx="24" cy="21" r="4.5" fill="currentColor" fill-opacity="0.2" stroke-width="1.75"/>',
  },
  designThinkingHmw: {
    label: 'DesignThinkingHmwHifi',
    body:
      '<circle cx="24" cy="24" r="20" fill="currentColor" fill-opacity="0.05" stroke="none"/>' +
      // branches diverging from the pain point
      '<path data-part="branches" d="M16 24h4M28 11h-2c-4 0-3.5 13-8 13M28 24h-4M28 37h-2c-4 0-3.5-13-8-13" stroke-width="1.75" stroke-opacity="0.6"/>' +
      // the source node (pain) + three opportunity nodes
      '<circle data-part="src" cx="11" cy="24" r="4" fill="currentColor" fill-opacity="0.2" stroke-width="2"/>' +
      '<circle data-part="leaf" cx="33" cy="11" r="3.6" fill="currentColor" fill-opacity="0.1" stroke-width="2"/>' +
      '<circle data-part="leaf" cx="33" cy="24" r="3.6" fill="currentColor" fill-opacity="0.1" stroke-width="2"/>' +
      '<circle data-part="leaf" cx="33" cy="37" r="3.6" fill="currentColor" fill-opacity="0.1" stroke-width="2"/>',
  },
  continuousDiscovery: {
    label: 'ContinuousDiscoveryHifi',
    body:
      '<circle cx="24" cy="24" r="20" fill="currentColor" fill-opacity="0.05" stroke="none"/>' +
      // a recurring cycle that comes back around
      '<path data-part="cycle" d="M40 24a16 16 0 1 1-4.7-11.3" fill="currentColor" fill-opacity="0.06" stroke-width="2"/>' +
      '<path data-part="cycle" d="M40 8v7h-7" stroke-width="2"/>' +
      // a clock face — it remembers across time
      '<path d="M24 16v8l5 3" stroke-width="1.75" stroke-opacity="0.7"/>',
  },
  pressureTest: {
    label: 'PressureTestHifi',
    body:
      '<circle cx="24" cy="26" r="20" fill="currentColor" fill-opacity="0.05" stroke="none"/>' +
      // the gauge dial
      '<path data-part="dial" d="M7 34a17 17 0 0 1 34 0z" fill="currentColor" fill-opacity="0.08" stroke-width="2"/>' +
      // dial ticks
      '<path d="M7 34h3M38 34h3M24 17v3M11.6 21.6l2.1 2.1M36.4 21.6l-2.1 2.1" stroke-width="1.5" stroke-opacity="0.6"/>' +
      // the needle pushed into the high zone
      '<path data-part="needle" d="M24 34l9-9" stroke-width="2.5"/>' +
      '<circle cx="24" cy="34" r="2.6" fill="currentColor" fill-opacity="0.25" stroke-width="1.75"/>',
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
  // ── Sonaloop product family — full sonaloop mark + corner badge chip ───────────
  // full sonaloop mark + small cloud badge chip (bottom-right)
  'sonaloop-cloud': {
    label: 'SonaloopCloudHifi',
    body: '<defs><mask id="slCloudBadgeH"><rect width="48" height="48" fill="white"/><path d="M35 29.4H41A5.6 5.6 0 0 1 46.6 35V41A5.6 5.6 0 0 1 41 46.6H35A5.6 5.6 0 0 1 29.4 41V35A5.6 5.6 0 0 1 35 29.4Z" fill="black"/></mask></defs><g mask="url(#slCloudBadgeH)"><path data-part="loop" d="M37.5 24L38.14 25.49L38.53 27.09L38.62 28.75L38.34 30.38L37.69 31.91L36.7 33.23L35.42 34.28L33.94 35.04L32.35 35.5L30.75 35.69L29.2 35.68L27.75 35.55L26.42 35.38L25.18 35.24L24 35.19L22.82 35.24L21.58 35.38L20.25 35.55L18.8 35.68L17.25 35.69L15.65 35.5L14.06 35.04L12.58 34.28L11.3 33.23L10.31 31.91L9.66 30.38L9.38 28.75L9.47 27.09L9.86 25.49L10.5 24L11.28 22.66L12.12 21.48L12.94 20.41L13.67 19.4L14.31 18.41L14.86 17.36L15.36 16.22L15.88 14.98L16.48 13.66L17.25 12.31L18.22 11.02L19.41 9.87L20.8 8.97L22.36 8.39L24 8.19L25.64 8.39L27.2 8.97L28.59 9.87L29.78 11.02L30.75 12.31L31.52 13.66L32.12 14.98L32.64 16.22L33.14 17.36L33.69 18.4L34.33 19.4L35.06 20.41L35.88 21.48L36.72 22.66L37.5 24ZM31.5 24L30.75 23.29L30.01 22.72L29.36 22.26L28.84 21.84L28.49 21.4L28.29 20.88L28.18 20.23L28.11 19.44L27.99 18.51L27.75 17.5L27.34 16.5L26.74 15.58L25.95 14.84L25.01 14.36L24 14.19L22.99 14.36L22.05 14.84L21.26 15.58L20.66 16.5L20.25 17.5L20.01 18.51L19.89 19.44L19.82 20.23L19.71 20.88L19.51 21.41L19.16 21.84L18.64 22.26L17.99 22.72L17.25 23.29L16.5 24L15.83 24.86L15.34 25.84L15.09 26.9L15.14 27.94L15.5 28.91L16.16 29.7L17.04 30.27L18.07 30.58L19.17 30.65L20.25 30.5L21.24 30.2L22.1 29.84L22.83 29.51L23.45 29.27L24 29.19L24.55 29.27L25.17 29.51L25.9 29.84L26.76 30.2L27.75 30.5L28.83 30.65L29.93 30.58L30.96 30.27L31.84 29.7L32.5 28.91L32.86 27.94L32.91 26.9L32.66 25.84L32.17 24.86L31.5 24Z" fill="currentColor" fill-opacity="0.1" fill-rule="evenodd" stroke-width="2"/><circle cx="24" cy="6" r="3.6" fill="currentColor" fill-opacity="0.1" stroke-width="2"/><circle cx="39.59" cy="33" r="3.6" fill="currentColor" fill-opacity="0.1" stroke-width="2"/><circle cx="8.41" cy="33" r="3.6" fill="currentColor" fill-opacity="0.1" stroke-width="2"/></g><path data-part="badge" d="M35.6 31H40.4A4.6 4.6 0 0 1 45 35.6V40.4A4.6 4.6 0 0 1 40.4 45H35.6A4.6 4.6 0 0 1 31 40.4V35.6A4.6 4.6 0 0 1 35.6 31ZM33.52 41.99h8.97a2.93 2.93 0 0 0 0.45 -5.83 4.14 4.14 0 0 0 -7.86 -1.03 2.97 2.97 0 0 0 -1.55 6.86z" fill-rule="evenodd" fill="currentColor"/>',
  },
  // full sonaloop mark + small flask badge chip (bottom-right)
  'sonaloop-research': {
    label: 'SonaloopResearchHifi',
    body: '<defs><mask id="slResBadgeH"><rect width="48" height="48" fill="white"/><path d="M35 29.4H41A5.6 5.6 0 0 1 46.6 35V41A5.6 5.6 0 0 1 41 46.6H35A5.6 5.6 0 0 1 29.4 41V35A5.6 5.6 0 0 1 35 29.4Z" fill="black"/></mask></defs><g mask="url(#slResBadgeH)"><path data-part="loop" d="M37.5 24L38.14 25.49L38.53 27.09L38.62 28.75L38.34 30.38L37.69 31.91L36.7 33.23L35.42 34.28L33.94 35.04L32.35 35.5L30.75 35.69L29.2 35.68L27.75 35.55L26.42 35.38L25.18 35.24L24 35.19L22.82 35.24L21.58 35.38L20.25 35.55L18.8 35.68L17.25 35.69L15.65 35.5L14.06 35.04L12.58 34.28L11.3 33.23L10.31 31.91L9.66 30.38L9.38 28.75L9.47 27.09L9.86 25.49L10.5 24L11.28 22.66L12.12 21.48L12.94 20.41L13.67 19.4L14.31 18.41L14.86 17.36L15.36 16.22L15.88 14.98L16.48 13.66L17.25 12.31L18.22 11.02L19.41 9.87L20.8 8.97L22.36 8.39L24 8.19L25.64 8.39L27.2 8.97L28.59 9.87L29.78 11.02L30.75 12.31L31.52 13.66L32.12 14.98L32.64 16.22L33.14 17.36L33.69 18.4L34.33 19.4L35.06 20.41L35.88 21.48L36.72 22.66L37.5 24ZM31.5 24L30.75 23.29L30.01 22.72L29.36 22.26L28.84 21.84L28.49 21.4L28.29 20.88L28.18 20.23L28.11 19.44L27.99 18.51L27.75 17.5L27.34 16.5L26.74 15.58L25.95 14.84L25.01 14.36L24 14.19L22.99 14.36L22.05 14.84L21.26 15.58L20.66 16.5L20.25 17.5L20.01 18.51L19.89 19.44L19.82 20.23L19.71 20.88L19.51 21.41L19.16 21.84L18.64 22.26L17.99 22.72L17.25 23.29L16.5 24L15.83 24.86L15.34 25.84L15.09 26.9L15.14 27.94L15.5 28.91L16.16 29.7L17.04 30.27L18.07 30.58L19.17 30.65L20.25 30.5L21.24 30.2L22.1 29.84L22.83 29.51L23.45 29.27L24 29.19L24.55 29.27L25.17 29.51L25.9 29.84L26.76 30.2L27.75 30.5L28.83 30.65L29.93 30.58L30.96 30.27L31.84 29.7L32.5 28.91L32.86 27.94L32.91 26.9L32.66 25.84L32.17 24.86L31.5 24Z" fill="currentColor" fill-opacity="0.1" fill-rule="evenodd" stroke-width="2"/><circle cx="24" cy="6" r="3.6" fill="currentColor" fill-opacity="0.1" stroke-width="2"/><circle cx="39.59" cy="33" r="3.6" fill="currentColor" fill-opacity="0.1" stroke-width="2"/><circle cx="8.41" cy="33" r="3.6" fill="currentColor" fill-opacity="0.1" stroke-width="2"/></g><path data-part="badge" d="M35.6 31H40.4A4.6 4.6 0 0 1 45 35.6V40.4A4.6 4.6 0 0 1 40.4 45H35.6A4.6 4.6 0 0 1 31 40.4V35.6A4.6 4.6 0 0 1 35.6 31ZM35.92 34.24L40.08 34.24L40.08 36.64L42.32 41.92L41.52 43.36L34.48 43.36L33.68 41.92L35.92 36.64Z" fill-rule="evenodd" fill="currentColor"/>',
  },
};
