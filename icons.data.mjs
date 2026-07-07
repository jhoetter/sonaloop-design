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

// ── Regular 24×24 Office/domain icons ───────────────────────────────────────
// These are the Office-AI compatibility glyphs. Keep them explicit: a mapped
// export with a generic placeholder is still a broken icon in the product UI.
const svg = (...parts) => parts.join('');
const rect = (x, y, width, height, rx = 1.8) =>
  `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${rx}"/>`;
const lineRows = (...rows) => rows.map(([x, y, width]) => `<path d="M${x} ${y}h${width}"/>`).join('');
const docBody = (mark) =>
  svg(
    '<path d="M7 3.5h7l3 3V20a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 6 20V5a1.5 1.5 0 0 1 1-1.5z"/>',
    '<path d="M14 3.5V7h3"/>',
    mark,
  );
const slideBody = (mark) =>
  svg(rect(4, 5, 16, 12, 2), '<path d="M8 21h8M12 17v4"/>', mark);
const tableBody = (mark) =>
  svg(rect(4, 5, 16, 14, 1.8), '<path d="M4 10h16M4 14h16M9 5v14M15 5v14"/>', mark);
const bubbleBody = (tail, mark = '') =>
  svg(`<path d="${tail}"/>`, mark);

const officeIconBodies = {
  alignCenter: lineRows([7, 6, 10], [5, 10, 14], [7, 14, 10], [6, 18, 12]),
  alignCenterHorizontal: svg('<path d="M12 4v16"/>', '<rect x="5" y="7" width="14" height="4" rx="1.2"/><rect x="7" y="14" width="10" height="4" rx="1.2"/>'),
  alignCenterVertical: svg('<path d="M4 12h16"/>', '<rect x="6" y="5" width="4" height="14" rx="1.2"/><rect x="14" y="7" width="4" height="10" rx="1.2"/>'),
  alignEndHorizontal: svg('<path d="M19 4v16"/>', '<rect x="5" y="7" width="14" height="4" rx="1.2"/><rect x="9" y="14" width="10" height="4" rx="1.2"/>'),
  alignEndVertical: svg('<path d="M4 19h16"/>', '<rect x="6" y="5" width="4" height="14" rx="1.2"/><rect x="14" y="9" width="4" height="10" rx="1.2"/>'),
  alignHorizontalDistributeCenter: svg('<path d="M4 6v12M20 6v12"/>', '<rect x="6" y="8" width="4" height="8" rx="1"/><rect x="14" y="8" width="4" height="8" rx="1"/><path d="M12 5v14"/>'),
  alignJustify: lineRows([5, 6, 14], [5, 10, 14], [5, 14, 14], [5, 18, 14]),
  alignLeft: lineRows([5, 6, 14], [5, 10, 9], [5, 14, 13], [5, 18, 7]),
  alignRight: lineRows([5, 6, 14], [10, 10, 9], [6, 14, 13], [12, 18, 7]),
  alignStartHorizontal: svg('<path d="M5 4v16"/>', '<rect x="5" y="7" width="14" height="4" rx="1.2"/><rect x="5" y="14" width="10" height="4" rx="1.2"/>'),
  alignStartVertical: svg('<path d="M4 5h16"/>', '<rect x="6" y="5" width="4" height="14" rx="1.2"/><rect x="14" y="5" width="4" height="10" rx="1.2"/>'),
  alignVerticalDistributeCenter: svg('<path d="M6 4h12M6 20h12"/>', '<rect x="8" y="6" width="8" height="4" rx="1"/><rect x="8" y="14" width="8" height="4" rx="1"/><path d="M5 12h14"/>'),
  alignVerticalJustifyCenter: svg('<path d="M4 12h16"/>', '<rect x="6" y="5" width="5" height="5" rx="1"/><rect x="13" y="14" width="5" height="5" rx="1"/>'),
  alignVerticalJustifyEnd: svg('<path d="M4 19h16"/>', '<rect x="6" y="5" width="5" height="14" rx="1"/><rect x="13" y="10" width="5" height="9" rx="1"/>'),
  alignVerticalJustifyStart: svg('<path d="M4 5h16"/>', '<rect x="6" y="5" width="5" height="14" rx="1"/><rect x="13" y="5" width="5" height="9" rx="1"/>'),
  arrowDownToLine: '<path d="M12 4v12M8 12l4 4 4-4M6 20h12"/>',
  arrowDownZA: svg('<path d="M5 5v12M2.8 14.8 5 17l2.2-2.2"/>', '<path d="M13 5h5l-5 6h5M13 18h5M14 18l1.8-5 1.8 5M14.7 16h2.2"/>'),
  arrowLeftRight: '<path d="M4 12h16M8 8l-4 4 4 4M16 8l4 4-4 4"/>',
  arrowLeftToLine: '<path d="M20 12H7M11 8l-4 4 4 4M4 5v14"/>',
  arrowRightToLine: '<path d="M4 12h13M13 8l4 4-4 4M20 5v14"/>',
  arrowUpAZ: svg('<path d="M5 19V7M2.8 9.2 5 7l2.2 2.2"/>', '<path d="M14 6l1.8 5 1.8-5M14.7 8h2.2M13 18h5l-5-6h5"/>'),
  arrowUpDown: '<path d="M12 4v16M8 8l4-4 4 4M8 16l4 4 4-4"/>',
  arrowUpToLine: '<path d="M12 20V8M8 12l4-4 4 4M6 4h12"/>',
  asterisk: '<path d="M12 4v16M5.1 8l13.8 8M18.9 8 5.1 16"/>',
  barChart3: svg('<path d="M4 20h16"/>', '<rect x="6" y="11" width="2.8" height="6" rx="1"/><rect x="10.6" y="6" width="2.8" height="11" rx="1"/><rect x="15.2" y="9" width="2.8" height="8" rx="1"/>'),
  bold: '<path d="M8 5h5a3 3 0 0 1 0 6H8zM8 11h6a3.5 3.5 0 0 1 0 7H8zM8 5v13"/>',
  bookOpen: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 4H11v16H6.5A2.5 2.5 0 0 0 4 22zM20 5.5A2.5 2.5 0 0 0 17.5 4H13v16h4.5A2.5 2.5 0 0 1 20 22z"/><path d="M7 8h2.2M15 8h2.2"/>',
  brush: '<path d="M15.5 4.5 19.5 8.5 10 18H6v-4z"/><path d="M4 20c2.4-.2 3.5-.9 4-2"/>',
  calculator: svg(rect(5, 3.5, 14, 17, 2), '<path d="M8 7h8M8 11h2M12 11h2M16 11h0M8 15h2M12 15h2M16 15h0M8 18h6"/>'),
  checkCheck: '<path d="M3.5 12.5 7 16l6.5-8M11 13l3 3 6.5-8"/>',
  chevronRight: '<path d="M9 6l6 6-6 6"/>',
  chevronsDown: '<path d="M7 7l5 5 5-5M7 13l5 5 5-5"/>',
  chevronsLeftRightEllipsis: '<path d="M8 7 3 12l5 5M16 7l5 5-5 5"/><circle cx="10.5" cy="12" r="0.7" fill="currentColor" stroke="none"/><circle cx="13.5" cy="12" r="0.7" fill="currentColor" stroke="none"/>',
  chevronsUp: '<path d="M7 11l5-5 5 5M7 17l5-5 5 5"/>',
  chevronUp: '<path d="M6 15l6-6 6 6"/>',
  clipboardCopy: '<path d="M9 4h6l1 2h2a1.5 1.5 0 0 1 1.5 1.5V20A1.5 1.5 0 0 1 18 21.5H6A1.5 1.5 0 0 1 4.5 20V7.5A1.5 1.5 0 0 1 6 6h2z"/><path d="M9 4.5h6M9 12h6M9 16h4"/><path d="M14 10h4v4"/>',
  clipboardPaste: '<path d="M9 4h6l1 2h2a1.5 1.5 0 0 1 1.5 1.5V20A1.5 1.5 0 0 1 18 21.5H6A1.5 1.5 0 0 1 4.5 20V7.5A1.5 1.5 0 0 1 6 6h2z"/><path d="M9 4.5h6M8 12h5M8 16h4"/><path d="M16 11v6M13.5 14.5 16 17l2.5-2.5"/>',
  combine: '<path d="M7 7h7a3 3 0 0 1 0 6H7a3 3 0 0 1 0-6z"/><path d="M10 11h7a3 3 0 0 1 0 6h-7a3 3 0 0 1 0-6z"/>',
  copyMinus: '<rect x="7" y="7" width="12" height="12" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1"/><path d="M10 13h6"/>',
  cornerDownLeft: '<path d="M19 5v7a4 4 0 0 1-4 4H6M10 12l-4 4 4 4"/>',
  cornerDownRight: '<path d="M5 5v7a4 4 0 0 0 4 4h9M14 12l4 4-4 4"/>',
  cornerUpLeft: '<path d="M19 19v-7a4 4 0 0 0-4-4H6M10 4 6 8l4 4"/>',
  dollarSign: '<path d="M12 3v18M16.5 7.5c-1.2-1-3-1.4-4.7-1.1-1.8.3-3 1.4-3 2.8 0 1.6 1.5 2.3 3.4 2.8 2.2.5 4.1 1.2 4.1 3.2 0 1.7-1.5 2.9-3.8 3.1-1.8.2-3.7-.3-5-1.4"/>',
  eyeOff: '<path d="M3 3l18 18"/><path d="M10.8 10.8A2 2 0 0 0 13.2 13.2"/><path d="M6.7 6.7C4.7 8 3.3 9.9 2.5 12c1.7 4.2 5 6.5 9.5 6.5 1.5 0 2.9-.3 4.1-.8"/><path d="M19.3 15.4c1-.9 1.7-2.1 2.2-3.4-1.7-4.2-5-6.5-9.5-6.5-.9 0-1.8.1-2.6.3"/>',
  archive: '<path d="M4 6h16v4H4z"/><path d="M6 10v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-8"/><path d="M10 14h4"/>',
  codeFile: docBody('<path d="M10 11l-2 2 2 2M14 11l2 2-2 2M13 10l-2 6"/>'),
  imageFile: docBody('<rect x="9" y="11" width="5.5" height="4.5" rx="1"/><path d="M9 16l2-2 1.4 1.4 1.1-1.1L15 16"/>'),
  spreadsheetFile: docBody('<path d="M9 11h6M9 14h6M9 17h6M11 11v6M13.5 11v6"/>'),
  documentFile: docBody('<path d="M9 11h6M9 14h6M9 17h4"/>'),
  pdfFile: docBody('<path d="M8.5 16v-5h2a1.5 1.5 0 0 1 0 3h-2M12.5 16v-5h1.7a2.5 2.5 0 0 1 0 5zM17 16v-5h2.5M17 13h2"/>'),
  frame: slideBody('<path d="M7 8h10v6H7z"/>'),
  grid3x3: '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M9.3 4v16M14.7 4v16M4 9.3h16M4 14.7h16"/>',
  gitBranch: '<circle cx="6" cy="5" r="2"/><circle cx="6" cy="19" r="2"/><circle cx="18" cy="12" r="2"/><path d="M6 7v10M8 5h3a5 5 0 0 1 5 5v0"/>',
  gitCommit: '<path d="M3.5 12h6M14.5 12h6"/><circle cx="12" cy="12" r="3.2"/>',
  gitPullRequest: '<circle cx="6" cy="5" r="2"/><circle cx="6" cy="19" r="2"/><circle cx="18" cy="19" r="2"/><path d="M6 7v10M18 17v-4a4 4 0 0 0-4-4H9"/><path d="M11 6 8 9l3 3"/>',
  gitPush: '<path d="M12 16V4M8 8l4-4 4 4"/><path d="M5 20h14"/><path d="M7 20v-3a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v3"/>',
  gitStatus: '<path d="M4 6h6M4 12h10M4 18h7"/><circle cx="17.5" cy="6" r="2"/><circle cx="19" cy="18" r="2"/><path d="M17.5 8v3.5a3 3 0 0 0 3 3H21"/>',
  group: '<rect x="5" y="6" width="7" height="7" rx="1.2"/><rect x="12" y="11" width="7" height="7" rx="1.2"/><path d="M8.5 13v2.5H12"/>',
  hand: '<path d="M8 12V6.5a1.5 1.5 0 0 1 3 0V12M11 11V5a1.5 1.5 0 0 1 3 0v7M14 11V6.5a1.5 1.5 0 0 1 3 0v7.5"/><path d="M8 12.5 6.8 11a1.8 1.8 0 0 0-2.8 2.2l4 5.1a5 5 0 0 0 4 1.9h1.8A5.2 5.2 0 0 0 19 15v-3.5"/>',
  hash: '<path d="M9 4 7 20M17 4l-2 16M4 9h16M3 15h16"/>',
  heading: '<path d="M6 5v14M18 5v14M6 12h12M12 19h6"/>',
  highlighter: '<path d="M14 4 20 10 11 19H7l-3-3z"/><path d="M4 20h9M13 5l6 6"/>',
  history: '<path d="M4 7v5h5"/><path d="M5.8 16A7.5 7.5 0 1 0 5 9.5"/><path d="M12 8v4l3 1.8"/>',
  image: '<rect x="4" y="5" width="16" height="14" rx="2"/><circle cx="9" cy="10" r="1.4"/><path d="M6.5 17l4.2-4.2 2.6 2.6 1.8-1.8L18.5 17"/>',
  indent: '<path d="M4 6h16M12 10h8M12 14h8M4 18h16M4 10l4 2-4 2z" fill="currentColor" stroke="none"/>',
  italic: '<path d="M10 5h7M7 19h7M14 5l-4 14"/>',
  keyboard: '<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M6 10h.1M9 10h.1M12 10h.1M15 10h.1M18 10h.1M7 14h10"/>',
  layers: '<path d="M12 3.5 21 8l-9 4.5L3 8z"/><path d="M3 12l9 4.5L21 12"/><path d="M3 16l9 4.5L21 16"/>',
  layoutTemplate: slideBody('<path d="M7 8h4v6H7zM13 8h4M13 11h4M13 14h3"/>'),
  lightbulb: '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.8 10.6c.5.5.8 1 .8 1.6V16h6v-.8c0-.6.3-1.1.8-1.6A6 6 0 0 0 12 3z"/><path d="M12 7v4"/>',
  link2: '<path d="M10 13a3.5 3.5 0 0 0 5 0l3-3a3.5 3.5 0 0 0-5-5l-1.4 1.4"/><path d="M14 11a3.5 3.5 0 0 0-5 0l-3 3a3.5 3.5 0 0 0 5 5l1.4-1.4"/>',
  listOrdered: '<path d="M10 6h10M10 12h10M10 18h10"/><path d="M4 5h1v4M4 9h2M4 12.5h2l-2 3h2M4 18h2M6 18v3M4 21h2"/>',
  listTree: '<path d="M6 5v14M6 7h5M6 13h5M11 7v3h5M11 13v3h5"/><circle cx="18" cy="10" r="1" fill="currentColor" stroke="none"/><circle cx="18" cy="16" r="1" fill="currentColor" stroke="none"/>',
  loader: '<path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" opacity="0.35"/><path d="M12 3v3M18.4 5.6l-2.1 2.1M21 12h-3"/>',
  maximize: '<path d="M8 4H4v4M16 4h4v4M8 20H4v-4M16 20h4v-4"/><path d="M4 4l5 5M20 4l-5 5M4 20l5-5M20 20l-5-5"/>',
  merge: tableBody('<path d="M7 7l4 5-4 5M17 7l-4 5 4 5"/>'),
  messageCircle: '<path d="M20.5 11.5a8.2 8.2 0 0 1-11.7 7.4L4 20l1.1-4.5A8.2 8.2 0 1 1 20.5 11.5z"/><path d="M8 10h8M8 13h5"/>',
  messageSquare: bubbleBody('M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z', '<path d="M7 9h10M7 12.5h6"/>'),
  messageSquarePlus: bubbleBody('M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z', '<path d="M12 8v6M9 11h6"/>'),
  minus: '<path d="M5 12h14"/>',
  monitorPlay: slideBody('<path d="M10 9v4l4-2z" fill="currentColor" stroke="none"/>'),
  moreHorizontal: '<circle cx="6" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="18" cy="12" r="1" fill="currentColor" stroke="none"/>',
  mousePointer2: '<path d="M5 3l13 9-5.8 1.1 3.3 6.1-2.8 1.5-3.3-6.2L5 18z"/>',
  mousePointerClick: '<path d="M5 3l10 13-5.5-1.6L7 20z"/><path d="M13 4l1-2M17 7l2-1M17 12h3"/>',
  move: '<path d="M12 3v18M8 7l4-4 4 4M8 17l4 4 4-4M3 12h18M7 8l-4 4 4 4M17 8l4 4-4 4"/>',
  moveDown: '<path d="M12 4v15M8 15l4 4 4-4"/>',
  moveHorizontal: '<path d="M4 12h16M8 8l-4 4 4 4M16 8l4 4-4 4"/><rect x="10" y="10" width="4" height="4" rx="1"/>',
  moveRight: '<path d="M4 12h15M15 8l4 4-4 4"/>',
  moveUp: '<path d="M12 20V5M8 9l4-4 4 4"/>',
  moveVertical: '<path d="M12 4v16M8 8l4-4 4 4M8 16l4 4 4-4"/><rect x="10" y="10" width="4" height="4" rx="1"/>',
  outdent: '<path d="M4 6h16M12 10h8M12 14h8M4 18h16M8 10l-4 2 4 2z" fill="currentColor" stroke="none"/>',
  paintbrush: '<path d="M15 4l5 5-9 9H7v-4z"/><path d="M5 20c0-2 1-3 3-3"/>',
  paintBucket: '<path d="M4 13 12 5l7 7-7 7z"/><path d="M8 9l7 7"/><path d="M19 14c1.3 1.4 2 2.6 2 3.7A2.7 2.7 0 0 1 18.3 20 2.7 2.7 0 0 1 16 17.7c0-1.1.7-2.3 2-3.7z"/>',
  palette: '<path d="M12 4a8 8 0 0 0 0 16h1.2a1.8 1.8 0 0 0 1.3-3l-.4-.5a1.6 1.6 0 0 1 1.2-2.7H17a3 3 0 0 0 3-3C20 6.8 16.4 4 12 4z"/><circle cx="8.5" cy="10" r="0.8" fill="currentColor" stroke="none"/><circle cx="11.5" cy="8" r="0.8" fill="currentColor" stroke="none"/><circle cx="14.7" cy="10" r="0.8" fill="currentColor" stroke="none"/>',
  penLine: '<path d="M5 19l4.5-1 9-9-3.5-3.5-9 9z"/><path d="M13.5 7 17 10.5M4 22h16"/>',
  percent: '<path d="M19 5 5 19"/><circle cx="7.5" cy="7.5" r="2"/><circle cx="16.5" cy="16.5" r="2"/>',
  pilcrow: '<path d="M13 5v14M17 5v14M13 5H9.5a3.5 3.5 0 0 0 0 7H13"/>',
  presentationFile: docBody('<rect x="9" y="11" width="6" height="4" rx="0.8"/><path d="M11 17h2M12 15v2"/>'),
  printer: '<path d="M7 8V4h10v4M7 17H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2"/><rect x="7" y="14" width="10" height="7" rx="1.2"/><path d="M9 17h6"/>',
  printerCheck: '<path d="M7 8V4h10v4M7 17H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2"/><rect x="7" y="14" width="10" height="7" rx="1.2"/><path d="M9.5 17.5l1.8 1.8 3.2-3.6"/>',
  rectangleHorizontal: '<rect x="3.5" y="8" width="17" height="8" rx="2"/><path d="M7 12h10"/>',
  redo2: '<path d="M18 7h-6a6 6 0 1 0 5.2 9"/><path d="M15 4l3 3-3 3"/>',
  refreshCw: '<path d="M20 7v5h-5"/><path d="M19.1 12A7 7 0 0 0 6.3 7.8M4 17v-5h5"/><path d="M4.9 12a7 7 0 0 0 12.8 4.2"/>',
  repeat: '<path d="M17 3l4 4-4 4"/><path d="M3 11V9a2 2 0 0 1 2-2h16"/><path d="M7 21l-4-4 4-4"/><path d="M21 13v2a2 2 0 0 1-2 2H3"/>',
  replace: '<path d="M4 7h9a3 3 0 0 1 0 6H8"/><path d="M8 9l-4 4 4 4M20 17h-9a3 3 0 0 1 0-6h5"/><path d="M16 15l4-4-4-4"/>',
  reply: '<path d="M9 7 4 12l5 5"/><path d="M5 12h8a6 6 0 0 1 6 6v1"/>',
  rotateCcw: '<path d="M4 7v5h5"/><path d="M5.1 12a7 7 0 1 0 2-5"/>',
  rotateCw: '<path d="M20 7v5h-5"/><path d="M18.9 12a7 7 0 1 1-2-5"/>',
  ruler: '<path d="M4 15 15 4l5 5L9 20z"/><path d="M8 15l-1.5-1.5M11 12l-1.5-1.5M14 9l-1.5-1.5M17 8l-2-2"/>',
  save: '<path d="M5 4h12l2 2v14H5z"/><path d="M8 4v6h8V4M8 20v-6h8v6"/>',
  scissors: '<circle cx="6" cy="7" r="2.5"/><circle cx="6" cy="17" r="2.5"/><path d="M8.2 8.2 19 19M8.2 15.8 19 5"/>',
  scrollText: '<path d="M7 4h10a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/><path d="M8 8h8M8 12h8M8 16h5"/><path d="M17 4c-1.1 0-2 .9-2 2v13"/>',
  separatorHorizontal: '<path d="M4 12h16"/><path d="M12 5v4M12 15v4"/>',
  shapes: '<circle cx="8" cy="8" r="3"/><rect x="13" y="5" width="6" height="6" rx="1"/><path d="M12 20 7 14h10z"/>',
  sigma: '<path d="M18 5H7l6 7-6 7h11"/>',
  sliders: '<path d="M4 7h7M15 7h5M4 17h5M13 17h7"/><circle cx="13" cy="7" r="2"/><circle cx="11" cy="17" r="2"/>',
  snowflake: '<path d="M12 3v18M5 6l14 12M19 6 5 18M8 3.8 12 8l4-4.2M8 20.2 12 16l4 4.2"/>',
  spline: '<path d="M5 17c4-10 10 4 14-6"/><circle cx="5" cy="17" r="2"/><circle cx="19" cy="11" r="2"/><path d="M7 17h3M16 11h3"/>',
  split: tableBody('<path d="M12 7v10M9 10l3-3 3 3M9 14l3 3 3-3"/>'),
  squareDashed: '<rect x="4" y="4" width="16" height="16" rx="2" stroke-dasharray="3 3"/>',
  stickyNote: '<path d="M6 4h12v10l-6 6H6z"/><path d="M12 20v-6h6"/><path d="M8.5 8h7M8.5 11h5"/>',
  strikethrough: '<path d="M7 7c1.1-1.4 2.7-2 5-2 2.5 0 4.3.9 5 2.5M5 12h14M16.5 16.5c-.9 1.7-2.7 2.5-5.1 2.5-2.1 0-4-.7-5.2-2"/>',
  table: tableBody(''),
  table2: svg(rect(3.5, 5, 17, 14, 1.8), '<path d="M3.5 9h17M3.5 14h17M8 5v14M14 9v10"/>'),
  tableCellsMerge: svg(rect(4, 5, 16, 14, 1.8), '<path d="M4 10h16M4 14h16M9 5v5M15 14v5"/><path d="M8 12h8M12 9l3 3-3 3M12 9l-3 3 3 3"/>'),
  tableProperties: svg(rect(4, 5, 16, 14, 1.8), '<path d="M4 10h16M9 5v14"/><circle cx="15" cy="15" r="2.5"/><path d="M15 13.5V15l1 1"/>'),
  trendingUp: '<path d="M4 17 9 12l4 4 7-8"/><path d="M15 8h5v5"/>',
  triangle: '<path d="M12 4 21 20H3z"/>',
  type: '<path d="M5 6V4h14v2M12 4v16M9 20h6"/>',
  underline: '<path d="M7 5v6a5 5 0 0 0 10 0V5M5 20h14"/>',
  undo2: '<path d="M6 7h6a6 6 0 1 1-5.2 9"/><path d="M9 4 6 7l3 3"/>',
  ungroup: '<rect x="4" y="5" width="7" height="7" rx="1.2"/><rect x="13" y="12" width="7" height="7" rx="1.2"/><path d="M11 8h2M11 15h2"/>',
  unlink: '<path d="M13.5 10.5a3.5 3.5 0 0 0-4.5.5l-3 3a3.5 3.5 0 0 0 5 5l1.2-1.2"/><path d="M10.5 13.5a3.5 3.5 0 0 0 4.5-.5l3-3a3.5 3.5 0 0 0-5-5l-1.2 1.2"/><path d="M4 4l16 16"/>',
  video: slideBody('<path d="M8 9h5v4H8z"/><path d="M13 10.2 17 8v6l-4-2.2z"/>'),
  wand2: '<path d="M4 20 16 8"/><path d="M14 4l1 3 3 1-3 1-1 3-1-3-3-1 3-1z"/><path d="M6 4l.6 1.8L8.4 6.4 6.6 7 6 8.8 5.4 7 3.6 6.4l1.8-.6z"/>',
  workflow: '<rect x="4" y="5" width="5" height="5" rx="1.2"/><rect x="15" y="5" width="5" height="5" rx="1.2"/><rect x="9.5" y="15" width="5" height="5" rx="1.2"/><path d="M9 7.5h6M17.5 10v2a3 3 0 0 1-3 3h-2M6.5 10v2a3 3 0 0 0 3 3h2"/>',
  wrapText: '<path d="M4 6h16M4 10h12a4 4 0 0 1 0 8h-2"/><path d="M16 15l-3 3 3 3M4 14h6"/>',
  zoomIn: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="M21 21l-5.8-5.8M10.5 7.5v6M7.5 10.5h6"/>',
};

const officeRegularNames = Object.keys(officeIconBodies);

function officeIconLabel(name) {
  return `${name.charAt(0).toUpperCase()}${name.slice(1)}Icon`;
}

const officeRegular = Object.fromEntries(
  officeRegularNames.map((name) => [
    name,
    {
      label: officeIconLabel(name),
      body: officeIconBodies[name],
    },
  ])
);

const sonamillTraceBody = '<path data-part="mill" fill-rule="evenodd" d="M11.34 1.18L10.68 1.51L10.23 1.97L9.86 2.75L9.77 3.37L9.86 3.98L10.10 4.56L10.43 4.97L10.43 5.10L10.23 5.22L9.61 5.88L9.07 6.83L8.70 8.06L7.30 9.71L6.97 10.33L6.77 10.95L6.72 11.40L6.64 11.49L6.31 11.40L5.49 11.40L5.04 11.53L4.46 11.86L4.09 12.23L3.76 12.85L3.63 13.46L3.68 14.08L3.80 14.45L4.13 15.03L4.58 15.44L5.12 15.73L6.11 15.85L6.56 15.77L6.89 15.61L7.01 15.65L6.52 20.55L6.56 21.13L6.77 21.38L7.01 21.50L16.99 21.50L17.28 21.38L17.52 20.96L17.07 15.69L17.23 15.65L17.98 15.85L18.59 15.81L18.96 15.69L19.58 15.32L19.87 15.03L20.20 14.45L20.37 13.71L20.32 13.18L20.08 12.52L19.83 12.14L19.29 11.69L18.47 11.40L17.69 11.40L17.48 11.49L17.32 11.40L17.23 10.74L16.74 9.67L15.34 8.02L15.09 7.12L14.72 6.29L14.14 5.51L13.65 5.10L13.65 4.97L14.14 4.23L14.27 3.74L14.23 2.79L13.94 2.13L13.52 1.64L12.82 1.22L12.33 1.10L11.75 1.10ZM11.67 2.50L12.37 2.50L12.78 2.83L12.91 3.08L12.91 3.70L12.70 4.03L12.33 4.27L11.71 4.27L11.51 4.15L11.18 3.78L11.09 3.53L11.13 3.08L11.30 2.79ZM11.42 6.05L11.79 5.92L12.45 5.96L12.82 6.13L13.32 6.58L13.81 7.45L14.23 8.77L15.26 9.92L15.75 10.62L16.00 11.36L15.96 11.94L15.75 12.39L15.30 12.85L15.05 12.97L14.43 12.97L14.10 12.85L13.32 12.35L12.58 11.57L12.25 11.44L11.84 11.44L11.51 11.57L10.60 12.52L10.10 12.85L9.61 13.01L9.20 13.01L8.74 12.85L8.33 12.43L8.13 12.10L8.04 11.36L8.33 10.58L9.82 8.81L9.98 8.48L10.19 7.61L10.64 6.75L11.01 6.33ZM17.98 12.72L18.22 12.72L18.59 12.85L18.88 13.13L19.01 13.46L19.01 13.75L18.88 14.08L18.59 14.37L18.31 14.49L17.89 14.49L17.56 14.33L17.28 13.96L17.23 13.42L17.40 13.09L17.65 12.85ZM5.74 12.72L6.07 12.72L6.40 12.85L6.64 13.09L6.81 13.46L6.81 13.71L6.68 14.08L6.52 14.29L6.11 14.49L5.65 14.49L5.41 14.37L5.12 14.08L4.99 13.79L4.99 13.46L5.16 13.09L5.36 12.89ZM8.58 14.33L9.90 14.33L10.48 14.16L11.13 13.83L12.00 13.05L12.08 13.05L12.66 13.59L13.61 14.12L14.43 14.33L15.46 14.29L15.75 16.39L15.79 17.30L16.12 20.14L15.54 20.22L13.77 20.18L13.73 18.33L13.48 17.63L13.07 17.17L12.82 17.01L12.29 16.84L11.79 16.84L11.34 16.97L10.93 17.21L10.68 17.46L10.48 17.83L10.35 18.20L10.31 20.18L8.00 20.22L7.96 19.85Z" fill="currentColor" stroke="none"/>';

const sonaProductRegular = {
  sonafile: {
    label: 'SonafileIcon',
    body: svg(
      '<path data-part="file" d="M7.8 3.6h5.8L18 8v11.2a1.8 1.8 0 0 1-1.8 1.8H7.8A1.8 1.8 0 0 1 6 19.2V5.4a1.8 1.8 0 0 1 1.8-1.8z"/>',
      '<path d="M13.4 3.8v3.8a1.3 1.3 0 0 0 1.3 1.3h3.1"/>',
      '<circle data-part="dot" cx="12.1" cy="16.2" r="1.85" fill="currentColor" stroke="none"/>',
    ),
  },
  sonatile: {
    label: 'SonatileIcon',
    body: svg(
      '<path data-part="tile" d="M17.1 12.7V7.2A2.2 2.2 0 0 0 14.9 5H7.2A2.2 2.2 0 0 0 5 7.2v8.1a2.2 2.2 0 0 0 2.2 2.2h5.3"/>',
      '<circle data-part="dot" cx="16.8" cy="17.3" r="1.85" fill="currentColor" stroke="none"/>',
    ),
  },
  sonamesh: {
    label: 'SonameshIcon',
    body: svg(
      '<circle cx="7" cy="6" r="1.35" fill="currentColor" stroke="none"/><circle cx="12" cy="6" r="0.75" fill="currentColor" stroke="none"/><circle cx="17" cy="6" r="1.35" fill="currentColor" stroke="none"/>',
      '<circle cx="7" cy="12" r="0.8" fill="currentColor" stroke="none"/><circle data-part="center" cx="12" cy="12" r="2.05" fill="currentColor" stroke="none"/><circle cx="17" cy="12" r="0.8" fill="currentColor" stroke="none"/>',
      '<circle cx="7" cy="18" r="1.35" fill="currentColor" stroke="none"/><circle cx="12" cy="18" r="0.75" fill="currentColor" stroke="none"/><circle cx="17" cy="18" r="1.35" fill="currentColor" stroke="none"/>',
    ),
  },
  sonamill: {
    label: 'SonamillIcon',
    body: sonamillTraceBody,
  },
  sonapage: {
    label: 'SonapageIcon',
    body: svg(
      '<rect x="5" y="4" width="5.8" height="14.4" rx="0.7"/>',
      '<rect x="13.3" y="4.2" width="5.6" height="5.6" rx="0.7"/>',
      '<path data-part="corner" d="M18.9 13.5h-4.8v4.8"/>',
      '<circle data-part="dot" cx="18.2" cy="17.6" r="1.75" fill="currentColor" stroke="none"/>',
    ),
  },
  sonaseed: {
    label: 'SonaseedIcon',
    body: svg(
      '<path data-part="seed" d="M17.9 8.3A6.8 6.8 0 1 0 16.2 16.9"/>',
      '<circle data-part="dot" cx="16.7" cy="17.1" r="1.85" fill="currentColor" stroke="none"/>',
    ),
  },
  sonatask: {
    label: 'SonataskIcon',
    body: svg(
      '<path data-part="lines" d="M6.2 6.4h10.1M6.2 11.7h10.1M6.2 16.9h8.2"/>',
      '<circle data-part="dot" cx="18.1" cy="16.9" r="1.75" fill="currentColor" stroke="none"/>',
    ),
  },
};

export const regular = {
  ...officeRegular,
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
  folderOpen: {
    label: 'FolderOpenIcon',
    // An expanded folder — its front flap tilted open. Used in file trees to mark an open directory.
    body: '<path data-part="folder" d="M6 14l1.45-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.55 6a2 2 0 0 1-1.94 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2"/>',
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
  phone: {
    label: 'PhoneIcon',
    body: '<rect x="7" y="2.8" width="10" height="18.4" rx="2.2"/><path d="M10.2 5.5h3.6"/><circle cx="12" cy="18" r="0.75" fill="currentColor" stroke="none"/>',
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
  // Like HalfIcon but a 270° wedge — the next step along the progress ring (e.g. "in review").
  threeQuarter: {
    label: 'ThreeQuarterIcon',
    body: '<circle cx="12" cy="12" r="7.5"/><path d="M12 12L12 4.5A7.5 7.5 0 1 1 4.5 12Z" fill="currentColor" stroke="none"/>',
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
  // expand — the slide-over's "open as full page" control (Notion-style diagonal arrows).
  expand: {
    label: 'ExpandIcon',
    body: '<path d="M14 4h6v6"/><path d="M20 4l-6.5 6.5"/><path d="M10 20H4v-6"/><path d="M4 20l6.5-6.5"/>',
  },
  collapse: {
    label: 'CollapseIcon',
    body: '<path d="M4 14h6v6"/><path d="M10 14l-6.5 6.5"/><path d="M20 10h-6V4"/><path d="M14 10l6.5-6.5"/>',
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
  // arrowRight's exact mirror — a full back/previous arrow (`back` stays the bare chevron).
  arrowLeft: {
    label: 'ArrowLeftIcon',
    body: '<path d="M20 12H6M11 6l-6 6 6 6"/>',
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
  // ── Canvas authoring tools ─────────────────────────────────────────────────
  // These keep editor rails semantically clear instead of reusing research or
  // generic file glyphs for high-frequency creation tools.
  canvasSelect: {
    label: 'CanvasSelectIcon',
    body: '<path d="M5 3.8 18.8 12 13 13.4l3.4 6-2.8 1.6-3.5-6.2L5 18z"/><path d="M16.5 4.5h3v3M19.5 4.5l-4 4"/>',
  },
  canvasFrame: {
    label: 'CanvasFrameIcon',
    body: '<rect x="4" y="5" width="16" height="14" rx="1.4"/><path d="M7 5v14M17 5v14M4 8h16M4 16h16"/>',
  },
  textCursor: {
    label: 'TextCursorIcon',
    body: '<path d="M8 5h8M8 19h8M12 5v14"/><path d="M6.5 8V6.5A1.5 1.5 0 0 1 8 5h8a1.5 1.5 0 0 1 1.5 1.5V8M6.5 16v1.5A1.5 1.5 0 0 0 8 19h8a1.5 1.5 0 0 0 1.5-1.5V16"/>',
  },
  vectorPen: {
    label: 'VectorPenIcon',
    body: '<path d="M5 19l4.2-1 8.3-8.3-3.2-3.2L6 14.8z"/><path d="M12.8 8l3.2 3.2"/><circle cx="5" cy="19" r="1.3"/><circle cx="18.5" cy="5.5" r="1.3"/><path d="M15.8 8.2 18.5 5.5"/>',
  },
  autoLayout: {
    label: 'AutoLayoutIcon',
    body: '<rect x="4" y="6" width="16" height="12" rx="2"/><path d="M8 10h8M8 14h8"/><path d="M17 8l3-2.5M17 16l3 2.5M7 8 4 5.5M7 16 4 18.5"/>',
  },
  minimap: {
    label: 'MinimapIcon',
    body: '<rect x="3.5" y="5" width="17" height="14" rx="2"/><rect data-part="viewport" x="8" y="8.25" width="8" height="5.5" rx="1" fill="currentColor" fill-opacity="0.1"/><path d="M6.5 16h3.2M14.3 16h3.2"/><circle cx="7" cy="8.6" r="0.8" fill="currentColor" stroke="none"/><circle cx="17" cy="15.4" r="0.8" fill="currentColor" stroke="none"/>',
  },

  // ── Persona & simulation (product core) ──────────────────────────────────────
  // The lived-memory vocabulary: a persona's SOUL, their calendar/activity,
  // inner thoughts, verbatim evidence, sentiment, and council dialogue.
  soul: {
    label: 'SoulIcon',
    // SOUL.md — the persona's core. A heart (the affective centre we simulate).
    body: '<path data-part="heart" d="M12 20.3C12 20.3 3.5 15 3.5 8.9A4.7 4.7 0 0 1 12 6.1a4.7 4.7 0 0 1 8.5 2.8C20.5 15 12 20.3 12 20.3z"/>',
  },
  calendar: {
    label: 'CalendarIcon',
    // timestamped calendars — one "today" day marked.
    body: '<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 9.5h17"/><path d="M8 3.5v3M16 3.5v3"/><circle data-part="day" cx="8.5" cy="14" r="1.1" fill="currentColor" stroke="none"/>',
  },
  activity: {
    label: 'ActivityIcon',
    // activity logs — a heartbeat/pulse trace.
    body: '<path d="M3 12h4l2.5-7 4 14 2.5-7H21"/>',
  },
  thought: {
    label: 'ThoughtIcon',
    // inner thoughts — a thought cloud with trailing bubbles.
    body: '<path data-part="cloud" d="M7.5 15.5a4 4 0 0 1-1-7.9 4.5 4.5 0 0 1 8.5-1.4A3.8 3.8 0 0 1 16.5 15.5z"/><circle data-part="d1" cx="6" cy="18" r="1.1" fill="currentColor" stroke="none"/><circle data-part="d2" cx="3.8" cy="20.6" r="0.8" fill="currentColor" stroke="none"/>',
  },
  quote: {
    label: 'QuoteIcon',
    // evidence — a verbatim quotation (the customer's own words).
    body: '<path d="M4 13.5c0-3.6 1.6-5.9 5-6.5v2.4C7.2 9.9 6.4 11 6.4 12.5H9V18H4zM14 13.5c0-3.6 1.6-5.9 5-6.5v2.4c-1.8.5-2.6 1.6-2.6 3.1H19V18h-5z"/>',
  },
  sentiment: {
    label: 'SentimentIcon',
    // sentiment breakdown — a mood face (the felt response to a concept).
    body: '<circle cx="12" cy="12" r="9"/><path data-part="mouth" d="M8.5 14.5a4.5 4.5 0 0 0 7 0"/><circle cx="9" cy="10" r="0.9" fill="currentColor" stroke="none"/><circle cx="15" cy="10" r="0.9" fill="currentColor" stroke="none"/>',
  },
  chat: {
    label: 'ChatIcon',
    // a single dialogue turn — a speech bubble with two text lines.
    body: '<path data-part="bubble" d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path data-part="lines" d="M7 9h10M7 12.5h6"/>',
  },
  messages: {
    label: 'MessagesIcon',
    // a back-and-forth — two overlapping bubbles (the council exchange).
    body: '<path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2z"/><path data-part="b2" d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1"/>',
  },
  mic: {
    label: 'MicIcon',
    // synthetic respondents / interviews — a microphone on its stand.
    body: '<rect data-part="capsule" x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0"/><path d="M12 17.5V21M9 21h6"/>',
  },
  sparkles: {
    label: 'SparklesIcon',
    // AI generation / synthesis spark — a large 4-point star + a small one.
    body: '<path data-part="spark" d="M12 3l1.7 4.8L18.5 9.5 13.7 11.2 12 16l-1.7-4.8L5.5 9.5 10.3 7.8z"/><path d="M18 14l.8 2.2 2.2.8-2.2.8L18 20l-.8-2.2L15 17l2.2-.8z"/>',
  },
  network: {
    label: 'NetworkIcon',
    // the research graph — three nodes wired into one structure.
    body: '<circle cx="6" cy="7" r="2.4"/><circle cx="18" cy="7" r="2.4"/><circle cx="12" cy="18" r="2.4"/><path d="M8.3 7.3h7.4M7.3 9l3.5 6.7M16.7 9l-3.5 6.7"/>',
  },
  avatar: {
    label: 'AvatarIcon',
    // a generated persona portrait — a figure framed in a rounded card.
    body: '<rect x="4" y="4" width="16" height="16" rx="4"/><circle cx="12" cy="10" r="2.6"/><path d="M7 17.8a5 5 0 0 1 10 0"/>',
  },
  clipboard: {
    label: 'ClipboardIcon',
    // a study / survey instrument — a clipboard with text lines.
    body: '<rect x="5" y="5" width="14" height="16" rx="2"/><path d="M9 5V4.2A1.2 1.2 0 0 1 10.2 3h3.6A1.2 1.2 0 0 1 15 4.2V5z"/><path data-part="lines" d="M8.5 11h7M8.5 14.5h5"/>',
  },

  // ── Operations pipeline (intake → quote → delivered) ─────────────────────────
  inbox: {
    label: 'InboxIcon',
    // intake — a new request lands in the tray.
    body: '<path d="M22 12h-6l-2 3h-4l-2-3H2"/><path data-part="tray" d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>',
  },
  invoice: {
    label: 'InvoiceIcon',
    // the quote / offer — a receipt with a torn foot and line items.
    body: '<path d="M5 3.5h14v17l-2.3-1.3-2.3 1.3-2.4-1.3-2.4 1.3-2.3-1.3L5 20.5z"/><path data-part="lines" d="M8.5 8h7M8.5 11.5h7M8.5 15h4"/>',
  },
  package: {
    label: 'PackageIcon',
    // the delivered study — a sealed box.
    body: '<path d="M16.5 9.4 7.5 4.21"/><path data-part="box" d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>',
  },
  verified: {
    label: 'VerifiedIcon',
    // accepted / verified — a scalloped seal with a check.
    body: '<path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><path data-part="check" d="m9 12 2 2 4-4"/>',
  },

  // ── Cloud · SaaS · privacy · CLI/MCP ─────────────────────────────────────────
  cloud: {
    label: 'CloudIcon',
    body: '<path data-part="cloud" d="M7 18.5h10.2a4 4 0 0 0 .3-8A6 6 0 0 0 6.2 9.4 3.8 3.8 0 0 0 7 18.5z"/>',
  },
  shield: {
    label: 'ShieldIcon',
    // privacy is the core promise (no server-side text-LLM calls).
    body: '<path data-part="shield" d="M12 3l8 3v5.6c0 4.9-3.4 8.3-8 9.4-4.6-1.1-8-4.5-8-9.4V6z"/>',
  },
  shieldCheck: {
    label: 'ShieldCheckIcon',
    body: '<path data-part="shield" d="M12 3l8 3v5.6c0 4.9-3.4 8.3-8 9.4-4.6-1.1-8-4.5-8-9.4V6z"/><path data-part="check" d="M9 11.8l2 2 4-4"/>',
  },
  lock: {
    label: 'LockIcon',
    body: '<rect x="4.5" y="10.5" width="15" height="10" rx="2.2"/><path data-part="shackle" d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/><circle cx="12" cy="15.5" r="1.1" fill="currentColor" stroke="none"/>',
  },
  key: {
    label: 'KeyIcon',
    // API keys / access tokens.
    body: '<circle data-part="bow" cx="8" cy="15.5" r="4"/><path d="M10.8 12.7L20 3.5"/><path d="M16.5 7l2.6 2.6M13.7 9.8l2 2"/>',
  },
  creditCard: {
    label: 'CreditCardIcon',
    // billing / subscription.
    body: '<rect x="3" y="5.5" width="18" height="13" rx="2.5"/><path d="M3 10h18"/><path data-part="chip" d="M7 14.5h3.5"/>',
  },
  upload: {
    label: 'UploadIcon',
    body: '<path data-part="arrow" d="M12 16V4M7.5 8.5L12 4l4.5 4.5"/><path d="M4.5 16.5V18a2.5 2.5 0 0 0 2.5 2.5h10a2.5 2.5 0 0 0 2.5-2.5v-1.5"/>',
  },
  download: {
    label: 'DownloadIcon',
    body: '<path data-part="arrow" d="M12 4v12M7.5 11.5L12 16l4.5-4.5"/><path d="M4.5 16.5V18a2.5 2.5 0 0 0 2.5 2.5h10a2.5 2.5 0 0 0 2.5-2.5v-1.5"/>',
  },
  sync: {
    label: 'SyncIcon',
    // refresh / CRON re-sync (the persona DB is kept current).
    body: '<path d="M20.5 11.5A8.5 8.5 0 0 0 6 6.2L3.5 8.5"/><path d="M3.5 12.5A8.5 8.5 0 0 0 18 17.8l2.5-2.3"/><path d="M3.5 4.5v4h4M20.5 19.5v-4h-4"/>',
  },
  globe: {
    label: 'GlobeIcon',
    body: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><ellipse cx="12" cy="12" rx="4" ry="9"/>',
  },
  terminal: {
    label: 'TerminalIcon',
    // the sonaloop CLI.
    body: '<rect x="3" y="4" width="18" height="16" rx="2.5"/><path data-part="prompt" d="M7 9l3.2 3-3.2 3"/><path d="M12.5 15h4.5"/>',
  },
  command: {
    label: 'CommandIcon',
    // the MCP / command surface.
    body: '<path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"/>',
  },
  database: {
    label: 'DatabaseIcon',
    // sonaloop-data — the persona catalog.
    body: '<ellipse cx="12" cy="6" rx="7.5" ry="3"/><path d="M4.5 6v6c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3V6"/><path d="M4.5 12v6c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3v-6"/>',
  },

  // ── General chrome (cross-product UI controls) ───────────────────────────────
  mail: {
    label: 'MailIcon',
    body: '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path data-part="flap" d="M3.5 7.5l8.5 5.5 8.5-5.5"/>',
  },
  send: {
    label: 'SendIcon',
    body: '<path data-part="plane" d="M21 3.5L3 10.2l7.2 2.6L13 20z"/><path d="M21 3.5L10.2 12.8"/>',
  },
  bell: {
    label: 'BellIcon',
    body: '<path data-part="bell" d="M6 17V10a6 6 0 0 1 12 0v7l1.5 2h-15z"/><path d="M10 19.5a2.2 2.2 0 0 0 4 0"/>',
  },
  filter: {
    label: 'FilterIcon',
    body: '<path d="M3.5 5.5h17l-6.5 8v5l-4 2v-7z"/>',
  },
  sort: {
    label: 'SortIcon',
    body: '<path d="M7 4.5v15M7 19.5l-2.6-2.6M7 19.5l2.6-2.6"/><path d="M17 19.5v-15M17 4.5l-2.6 2.6M17 4.5l2.6 2.6"/>',
  },
  more: {
    label: 'MoreIcon',
    body: '<circle cx="12" cy="5" r="1.6" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none"/><circle cx="12" cy="19" r="1.6" fill="currentColor" stroke="none"/>',
  },
  info: {
    label: 'InfoIcon',
    body: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><circle cx="12" cy="7.9" r="0.8" fill="currentColor" stroke="none"/>',
  },
  help: {
    label: 'HelpIcon',
    body: '<circle cx="12" cy="12" r="9"/><path d="M9.4 9.3a2.7 2.7 0 0 1 5.2 1c0 1.8-2.6 2-2.6 4"/><circle cx="12" cy="17.4" r="0.8" fill="currentColor" stroke="none"/>',
  },
  trash: {
    label: 'TrashIcon',
    body: '<path data-part="lid" d="M4 6.5h16M9 6.5V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1.5"/><path d="M6.5 6.5l1 12.2A2 2 0 0 0 9.5 20.5h5a2 2 0 0 0 2-1.8l1-12.2"/><path d="M10 10.5v6M14 10.5v6"/>',
  },
  copy: {
    label: 'CopyIcon',
    body: '<rect data-part="sheet" x="8" y="8" width="12" height="12" rx="2.5"/><path d="M16 8V5.5A1.5 1.5 0 0 0 14.5 4H5.5A1.5 1.5 0 0 0 4 5.5v9A1.5 1.5 0 0 0 5.5 16H8"/>',
  },
  file: {
    label: 'FileIcon',
    body: '<path d="M6 3h7l5 5v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path data-part="fold" d="M13 3v5h5"/>',
  },
  home: {
    label: 'HomeIcon',
    body: '<path data-part="roof" d="M3.5 11.5L12 4l8.5 7.5"/><path d="M5.5 10.2V19a1 1 0 0 0 1 1H10v-5.5h4V20h3.5a1 1 0 0 0 1-1v-8.8"/>',
  },
  play: {
    label: 'PlayIcon',
    body: '<path d="M7 5.2l11.5 6.8L7 18.8z"/>',
  },
  pause: {
    label: 'PauseIcon',
    body: '<rect x="7" y="5" width="3.5" height="14" rx="1.2"/><rect x="13.5" y="5" width="3.5" height="14" rx="1.2"/>',
  },
  eye: {
    label: 'EyeIcon',
    body: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle data-part="pupil" cx="12" cy="12" r="2.8"/>',
  },
  bookmark: {
    label: 'BookmarkIcon',
    body: '<path data-part="mark" d="M6 4h12a1 1 0 0 1 1 1v15.5l-7-4-7 4V5a1 1 0 0 1 1-1z"/>',
  },
  flag: {
    label: 'FlagIcon',
    body: '<path d="M5 21V4"/><path data-part="cloth" d="M5 4.5h12.5l-2.2 3.5 2.2 3.5H5z"/>',
  },
  list: {
    label: 'ListIcon',
    body: '<path data-part="lines" d="M8 6h12M8 12h12M8 18h12"/><circle cx="4" cy="6" r="1.1" fill="currentColor" stroke="none"/><circle cx="4" cy="12" r="1.1" fill="currentColor" stroke="none"/><circle cx="4" cy="18" r="1.1" fill="currentColor" stroke="none"/>',
  },
  book: {
    label: 'BookIcon',
    // docs / knowledge base.
    body: '<path d="M5 4.5A1.5 1.5 0 0 1 6.5 3H18a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H6.5A1.5 1.5 0 0 0 5 20.5z"/><path data-part="cover" d="M5 17.5A1.5 1.5 0 0 1 6.5 16H19"/>',
  },
  rocket: {
    label: 'RocketIcon',
    // get started / launch — an upright rocket (twin of RocketHifi).
    body: '<path data-part="rocket" d="M12 2.5c2.6 2.7 3.7 5.8 3.7 9.5V16H8.3v-4c0-3.7 1.1-6.8 3.7-9.5z"/><path d="M8.3 13l-2.8 2.2v3l2.8-1.6M15.7 13l2.8 2.2v3l-2.8-1.6"/><circle cx="12" cy="9" r="1.6"/><path data-part="flame" d="M10.3 19c0 1.7 1.7 3.2 1.7 3.2s1.7-1.5 1.7-3.2z" fill="currentColor" stroke="none"/>',
  },
  trend: {
    label: 'TrendIcon',
    // line chart trending up — outcomes over time.
    body: '<path data-part="line" d="M3 17l5-5 3.5 3L20 6"/><path d="M20 11V6h-5"/>',
  },
  pieChart: {
    label: 'PieChartIcon',
    // breakdown / share — a pie with one highlighted wedge.
    body: '<circle cx="12" cy="12" r="9"/><path data-part="slice" d="M12 12V3a9 9 0 0 1 7.8 4.5z"/>',
  },
  zap: {
    label: 'ZapIcon',
    body: '<path d="M12.5 3L5 13h6l-1 8 8-11h-6z"/>',
  },

  // ── Brand ────────────────────────────────────────────────────────────────────
  // sonaloop — the company logo. A continuous lobed "loop" (rounded-triangle
  // ribbon) binding three nodes; line-art twin of the hi-fi mark. Sized with edge
  // margin so the stroked top node never clips at the viewBox edge.
  sonaloop: {
    label: 'SonaloopIcon',
    body: '<path data-part="loop" d="M17 12L17.31 12.62L17.49 13.3L17.51 14.01L17.35 14.69L17 15.29L16.49 15.77L15.87 16.1L15.19 16.28L14.5 16.33L13.84 16.28L13.25 16.17L12.72 16.07L12.23 16.01L11.77 16.01L11.28 16.07L10.75 16.17L10.16 16.28L9.5 16.33L8.81 16.28L8.13 16.1L7.51 15.77L7 15.29L6.65 14.69L6.49 14.01L6.51 13.3L6.69 12.62L7 12L7.37 11.46L7.76 11L8.12 10.59L8.41 10.2L8.65 9.79L8.83 9.34L9.01 8.83L9.22 8.26L9.5 7.67L9.88 7.09L10.38 6.59L10.98 6.22L11.65 6.03L12.35 6.03L13.02 6.22L13.62 6.59L14.12 7.09L14.5 7.67L14.78 8.26L14.99 8.83L15.17 9.34L15.35 9.79L15.59 10.2L15.88 10.59L16.24 11L16.63 11.46L17 12Z"/><circle cx="12" cy="3.7" r="1.85"/><circle cx="19.19" cy="16.15" r="1.85"/><circle cx="4.81" cy="16.15" r="1.85"/>',
  },
  ...sonaProductRegular,
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
  // full sonaloop mark + small bar-chart badge chip (sonaloop-data)
  'sonaloop-data': {
    label: 'SonaloopDataIcon',
    body: '<defs><mask id="slDataBadgeR"><rect width="24" height="24" fill="white"/><path d="M16.8 13.8H20A3 3 0 0 1 23 16.8V20A3 3 0 0 1 20 23H16.8A3 3 0 0 1 13.8 20V16.8A3 3 0 0 1 16.8 13.8Z" fill="black"/></mask></defs><g mask="url(#slDataBadgeR)"><path data-part="loop" d="M17 12L17.31 12.62L17.49 13.3L17.51 14.01L17.35 14.69L17 15.29L16.49 15.77L15.87 16.1L15.19 16.28L14.5 16.33L13.84 16.28L13.25 16.17L12.72 16.07L12.23 16.01L11.77 16.01L11.28 16.07L10.75 16.17L10.16 16.28L9.5 16.33L8.81 16.28L8.13 16.1L7.51 15.77L7 15.29L6.65 14.69L6.49 14.01L6.51 13.3L6.69 12.62L7 12L7.37 11.46L7.76 11L8.12 10.59L8.41 10.2L8.65 9.79L8.83 9.34L9.01 8.83L9.22 8.26L9.5 7.67L9.88 7.09L10.38 6.59L10.98 6.22L11.65 6.03L12.35 6.03L13.02 6.22L13.62 6.59L14.12 7.09L14.5 7.67L14.78 8.26L14.99 8.83L15.17 9.34L15.35 9.79L15.59 10.2L15.88 10.59L16.24 11L16.63 11.46L17 12Z"/><circle cx="12" cy="3.7" r="1.85"/><circle cx="19.19" cy="16.15" r="1.85"/><circle cx="4.81" cy="16.15" r="1.85"/></g><path data-part="badge" d="M17.1 14.7H19.7A2.4 2.4 0 0 1 22.1 17.1V19.7A2.4 2.4 0 0 1 19.7 22.1H17.1A2.4 2.4 0 0 1 14.7 19.7V17.1A2.4 2.4 0 0 1 17.1 14.7Z M16.5 18.4h1.2v1.9h-1.2z M18.1 16.9h1.2v3.4h-1.2z M19.7 17.9h1.2v2.4h-1.2z" fill-rule="evenodd" fill="currentColor" stroke="none"/>',
  },
  // full sonaloop mark + small browser-window badge chip (sonaloop-website)
  'sonaloop-website': {
    label: 'SonaloopWebsiteIcon',
    body: '<defs><mask id="slWebBadgeR"><rect width="24" height="24" fill="white"/><path d="M16.8 13.8H20A3 3 0 0 1 23 16.8V20A3 3 0 0 1 20 23H16.8A3 3 0 0 1 13.8 20V16.8A3 3 0 0 1 16.8 13.8Z" fill="black"/></mask></defs><g mask="url(#slWebBadgeR)"><path data-part="loop" d="M17 12L17.31 12.62L17.49 13.3L17.51 14.01L17.35 14.69L17 15.29L16.49 15.77L15.87 16.1L15.19 16.28L14.5 16.33L13.84 16.28L13.25 16.17L12.72 16.07L12.23 16.01L11.77 16.01L11.28 16.07L10.75 16.17L10.16 16.28L9.5 16.33L8.81 16.28L8.13 16.1L7.51 15.77L7 15.29L6.65 14.69L6.49 14.01L6.51 13.3L6.69 12.62L7 12L7.37 11.46L7.76 11L8.12 10.59L8.41 10.2L8.65 9.79L8.83 9.34L9.01 8.83L9.22 8.26L9.5 7.67L9.88 7.09L10.38 6.59L10.98 6.22L11.65 6.03L12.35 6.03L13.02 6.22L13.62 6.59L14.12 7.09L14.5 7.67L14.78 8.26L14.99 8.83L15.17 9.34L15.35 9.79L15.59 10.2L15.88 10.59L16.24 11L16.63 11.46L17 12Z"/><circle cx="12" cy="3.7" r="1.85"/><circle cx="19.19" cy="16.15" r="1.85"/><circle cx="4.81" cy="16.15" r="1.85"/></g><path data-part="badge" d="M17.1 14.7H19.7A2.4 2.4 0 0 1 22.1 17.1V19.7A2.4 2.4 0 0 1 19.7 22.1H17.1A2.4 2.4 0 0 1 14.7 19.7V17.1A2.4 2.4 0 0 1 17.1 14.7Z M16.9 16.5h3.0a0.6 0.6 0 0 1 0.6 0.6v2.6a0.6 0.6 0 0 1 -0.6 0.6h-3.0a0.6 0.6 0 0 1 -0.6 -0.6v-2.6a0.6 0.6 0 0 1 0.6 -0.6z M16.6 17.35h3.6v0.5h-3.6z" fill-rule="evenodd" fill="currentColor" stroke="none"/>',
  },
  // full sonaloop mark + small sparkle badge chip (sonaloop-design)
  'sonaloop-design': {
    label: 'SonaloopDesignIcon',
    body: '<defs><mask id="slDesignBadgeR"><rect width="24" height="24" fill="white"/><path d="M16.8 13.8H20A3 3 0 0 1 23 16.8V20A3 3 0 0 1 20 23H16.8A3 3 0 0 1 13.8 20V16.8A3 3 0 0 1 16.8 13.8Z" fill="black"/></mask></defs><g mask="url(#slDesignBadgeR)"><path data-part="loop" d="M17 12L17.31 12.62L17.49 13.3L17.51 14.01L17.35 14.69L17 15.29L16.49 15.77L15.87 16.1L15.19 16.28L14.5 16.33L13.84 16.28L13.25 16.17L12.72 16.07L12.23 16.01L11.77 16.01L11.28 16.07L10.75 16.17L10.16 16.28L9.5 16.33L8.81 16.28L8.13 16.1L7.51 15.77L7 15.29L6.65 14.69L6.49 14.01L6.51 13.3L6.69 12.62L7 12L7.37 11.46L7.76 11L8.12 10.59L8.41 10.2L8.65 9.79L8.83 9.34L9.01 8.83L9.22 8.26L9.5 7.67L9.88 7.09L10.38 6.59L10.98 6.22L11.65 6.03L12.35 6.03L13.02 6.22L13.62 6.59L14.12 7.09L14.5 7.67L14.78 8.26L14.99 8.83L15.17 9.34L15.35 9.79L15.59 10.2L15.88 10.59L16.24 11L16.63 11.46L17 12Z"/><circle cx="12" cy="3.7" r="1.85"/><circle cx="19.19" cy="16.15" r="1.85"/><circle cx="4.81" cy="16.15" r="1.85"/></g><path data-part="badge" d="M17.1 14.7H19.7A2.4 2.4 0 0 1 22.1 17.1V19.7A2.4 2.4 0 0 1 19.7 22.1H17.1A2.4 2.4 0 0 1 14.7 19.7V17.1A2.4 2.4 0 0 1 17.1 14.7Z M18.4 16.0L19.04 17.76L20.8 18.4L19.04 19.04L18.4 20.8L17.76 19.04L16.0 18.4L17.76 17.76Z" fill-rule="evenodd" fill="currentColor" stroke="none"/>',
  },

};

const sonaProductHifi = {
  sonafile: {
    label: 'SonafileHifi',
    body:
      '<path data-part="file" d="M15 7h12l8 8v24a4 4 0 0 1-4 4H15a4 4 0 0 1-4-4V11a4 4 0 0 1 4-4z" fill="currentColor" fill-opacity="0.06" stroke-width="2.25"/>' +
      '<path d="M27 7.5v7a2.5 2.5 0 0 0 2.5 2.5H35" stroke-width="2.25"/>' +
      '<circle data-part="dot" cx="24.2" cy="33" r="4.1" fill="currentColor" stroke="none"/>',
  },
  sonatile: {
    label: 'SonatileHifi',
    body:
      '<path data-part="tile" d="M34 25.4V14.6A4.6 4.6 0 0 0 29.4 10H14.6A4.6 4.6 0 0 0 10 14.6v15.6a4.6 4.6 0 0 0 4.6 4.6h10.6" fill="currentColor" fill-opacity="0.06" stroke-width="2.5"/>' +
      '<circle data-part="dot" cx="33.2" cy="34.4" r="4.1" fill="currentColor" stroke="none"/>',
  },
  sonamesh: {
    label: 'SonameshHifi',
    body:
      '<circle cx="14" cy="12" r="3" fill="currentColor" stroke="none"/><circle cx="24" cy="12" r="1.65" fill="currentColor" stroke="none"/><circle cx="34" cy="12" r="3" fill="currentColor" stroke="none"/>' +
      '<circle cx="14" cy="24" r="1.8" fill="currentColor" stroke="none"/><circle data-part="center" cx="24" cy="24" r="4.6" fill="currentColor" stroke="none"/><circle cx="34" cy="24" r="1.8" fill="currentColor" stroke="none"/>' +
      '<circle cx="14" cy="36" r="3" fill="currentColor" stroke="none"/><circle cx="24" cy="36" r="1.65" fill="currentColor" stroke="none"/><circle cx="34" cy="36" r="3" fill="currentColor" stroke="none"/>',
  },
  sonamill: {
    label: 'SonamillHifi',
    body: '<g transform="scale(2)">' + sonamillTraceBody + '</g>',
  },
  sonapage: {
    label: 'SonapageHifi',
    body:
      '<rect x="10" y="7" width="11.6" height="29.5" rx="1.5" fill="currentColor" fill-opacity="0.06" stroke-width="2.25"/>' +
      '<rect x="27" y="8" width="11" height="11" rx="1.5" fill="currentColor" fill-opacity="0.06" stroke-width="2.25"/>' +
      '<path data-part="corner" d="M38 27H28v10" stroke-width="2.5"/>' +
      '<circle data-part="dot" cx="36.7" cy="36.1" r="4" fill="currentColor" stroke="none"/>',
  },
  sonaseed: {
    label: 'SonaseedHifi',
    body:
      '<path data-part="seed" d="M35.8 17A13.6 13.6 0 1 0 32.4 34" stroke-width="2.75"/>' +
      '<circle data-part="dot" cx="33.2" cy="34.4" r="4.1" fill="currentColor" stroke="none"/>',
  },
  sonatask: {
    label: 'SonataskHifi',
    body:
      '<g data-part="lines" stroke-width="2.75"><path d="M12 12.5h20"/><path d="M12 23.5h20"/><path d="M12 34.5h16"/></g>' +
      '<circle data-part="dot" cx="36.2" cy="34.5" r="4" fill="currentColor" stroke="none"/>',
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
  phone: {
    label: 'PhoneHifi',
    body:
      '<rect data-part="device" x="15" y="4" width="18" height="40" rx="4.5" fill="currentColor" fill-opacity="0.08" stroke-width="2"/>' +
      '<path d="M20 10h8" stroke-width="1.75" stroke-opacity="0.65"/>' +
      '<circle cx="24" cy="37" r="1.7" fill="currentColor" fill-opacity="0.2" stroke-width="1.5"/>',
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
  arrowLeft: {
    label: 'ArrowLeftHifi',
    body:
      '<circle cx="24" cy="24" r="20" fill="currentColor" fill-opacity="0.06" stroke="none"/>' +
      '<path d="M37 24H13M22 14L12 24l10 10" stroke-width="2.5"/>',
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

  // ── Persona & simulation (48×48 twins) ───────────────────────────────────────
  soul: {
    label: 'SoulHifi',
    body:
      '<circle cx="24" cy="24" r="20" fill="currentColor" fill-opacity="0.05" stroke="none"/>' +
      '<path data-part="heart" d="M24 40C24 40 7 29.5 7 17.8A9.4 9.4 0 0 1 24 12.2 9.4 9.4 0 0 1 41 17.8C41 29.5 24 40 24 40z" fill="currentColor" fill-opacity="0.1" stroke-width="2" stroke-linejoin="round"/>',
  },
  calendar: {
    label: 'CalendarHifi',
    body:
      '<rect x="7" y="10" width="34" height="31" rx="4" fill="currentColor" fill-opacity="0.06" stroke-width="2"/>' +
      '<path d="M7 19h34" stroke-width="2"/>' +
      '<path d="M16 6v6M32 6v6" stroke-width="2"/>' +
      '<rect data-part="day" x="14" y="25" width="8" height="8" rx="2" fill="currentColor" fill-opacity="0.85" stroke="none"/>',
  },
  activity: {
    label: 'ActivityHifi',
    body:
      '<circle cx="24" cy="24" r="20" fill="currentColor" fill-opacity="0.05" stroke="none"/>' +
      '<path d="M7 24h7l5-13 8 26 5-13h7" stroke-width="2.25"/>',
  },
  thought: {
    label: 'ThoughtHifi',
    body:
      '<path data-part="cloud" d="M16 31a8 8 0 0 1-2-15.8 9 9 0 0 1 17-2.8A7.6 7.6 0 0 1 33 31z" fill="currentColor" fill-opacity="0.08" stroke-width="2" stroke-linejoin="round"/>' +
      '<circle data-part="d1" cx="13" cy="37" r="2.4" fill="currentColor" fill-opacity="0.1" stroke-width="1.75"/>' +
      '<circle data-part="d2" cx="8" cy="42" r="1.6" fill="currentColor" fill-opacity="0.1" stroke-width="1.5"/>',
  },
  quote: {
    label: 'QuoteHifi',
    body:
      '<circle cx="24" cy="24" r="20" fill="currentColor" fill-opacity="0.05" stroke="none"/>' +
      '<path d="M9 27c0-7 3-11.5 10-13v4.5c-3.5 1-5 3-5 6h5V36H9zM24 27c0-7 3-11.5 10-13v4.5c-3.5 1-5 3-5 6h5V36H24z" fill="currentColor" fill-opacity="0.1" stroke-width="2" stroke-linejoin="round"/>',
  },
  sentiment: {
    label: 'SentimentHifi',
    body:
      '<circle cx="24" cy="24" r="19" fill="currentColor" fill-opacity="0.08" stroke-width="2"/>' +
      '<path data-part="mouth" d="M16 28a9 9 0 0 0 16 0" stroke-width="2"/>' +
      '<circle cx="18" cy="20" r="1.8" fill="currentColor" stroke="none"/>' +
      '<circle cx="30" cy="20" r="1.8" fill="currentColor" stroke="none"/>',
  },
  chat: {
    label: 'ChatHifi',
    body:
      '<path data-part="bubble" d="M42 30a4 4 0 0 1-4 4H14l-8 8V10a4 4 0 0 1 4-4h28a4 4 0 0 1 4 4z" fill="currentColor" fill-opacity="0.08" stroke-width="2" stroke-linejoin="round"/>' +
      '<path data-part="lines" d="M14 18h20M14 25h12" stroke-width="1.75" stroke-opacity="0.6"/>',
  },
  messages: {
    label: 'MessagesHifi',
    body:
      '<path d="M28 19a3 3 0 0 1-3 3H12l-7 7V9a3 3 0 0 1 3-3h17a3 3 0 0 1 3 3z" fill="currentColor" fill-opacity="0.1" stroke-width="2" stroke-linejoin="round"/>' +
      '<path data-part="b2" d="M35 18h4a3 3 0 0 1 3 3v21l-7-7H22a3 3 0 0 1-3-3v-2" fill="currentColor" fill-opacity="0.06" stroke-width="2" stroke-linejoin="round"/>',
  },
  mic: {
    label: 'MicHifi',
    body:
      '<rect data-part="capsule" x="18" y="6" width="12" height="22" rx="6" fill="currentColor" fill-opacity="0.1" stroke-width="2"/>' +
      '<path d="M11 22a13 13 0 0 0 26 0" stroke-width="2"/>' +
      '<path d="M24 35v7M16 42h16" stroke-width="2"/>',
  },
  sparkles: {
    label: 'SparklesHifi',
    body:
      '<path data-part="spark" d="M24 5l3.4 9.6L37 18l-9.6 3.4L24 31l-3.4-9.6L11 18l9.6-3.4z" fill="currentColor" fill-opacity="0.1" stroke-width="2" stroke-linejoin="round"/>' +
      '<path d="M36 28l1.6 4.4L42 34l-4.4 1.6L36 40l-1.6-4.4L30 34l4.4-1.6z" fill="currentColor" fill-opacity="0.1" stroke-width="1.75" stroke-linejoin="round"/>',
  },
  network: {
    label: 'NetworkHifi',
    body:
      '<circle cx="24" cy="24" r="20" fill="currentColor" fill-opacity="0.05" stroke="none"/>' +
      '<path d="M14 15.5l20 0M14.5 17l8 15M33.5 17l-8 15" stroke-width="1.75" stroke-opacity="0.6"/>' +
      '<circle data-part="node" cx="12" cy="14" r="4.5" fill="currentColor" fill-opacity="0.1" stroke-width="2"/>' +
      '<circle data-part="node" cx="36" cy="14" r="4.5" fill="currentColor" fill-opacity="0.1" stroke-width="2"/>' +
      '<circle data-part="node" cx="24" cy="36" r="4.5" fill="currentColor" fill-opacity="0.1" stroke-width="2"/>',
  },
  avatar: {
    label: 'AvatarHifi',
    body:
      '<rect x="7" y="7" width="34" height="34" rx="9" fill="currentColor" fill-opacity="0.06" stroke-width="2"/>' +
      '<circle cx="24" cy="20" r="5.5" fill="currentColor" fill-opacity="0.1" stroke-width="2"/>' +
      '<path d="M13.5 37a10.5 10.5 0 0 1 21 0" stroke-width="2"/>',
  },
  clipboard: {
    label: 'ClipboardHifi',
    body:
      '<rect x="9" y="9" width="30" height="33" rx="4" fill="currentColor" fill-opacity="0.06" stroke-width="2"/>' +
      '<rect x="17" y="5" width="14" height="8" rx="2.5" fill="currentColor" fill-opacity="0.1" stroke-width="2"/>' +
      '<path data-part="lines" d="M16 23h16M16 30h11" stroke-width="1.75" stroke-opacity="0.6"/>',
  },

  // ── Operations pipeline (48×48 twins) ────────────────────────────────────────
  inbox: {
    label: 'InboxHifi',
    body:
      '<path data-part="tray" d="M11 9.5 4.5 23v13a4 4 0 0 0 4 4h31a4 4 0 0 0 4-4V23l-6.5-13.5A4 4 0 0 0 37.4 7H14.6a4 4 0 0 0-3.6 2.5z" fill="currentColor" fill-opacity="0.06" stroke-width="2" stroke-linejoin="round"/>' +
      '<path d="M4.5 23h11l3 5h11l3-5h11" stroke-width="2" stroke-linejoin="round"/>',
  },
  invoice: {
    label: 'InvoiceHifi',
    body:
      '<path d="M10 6h28v36l-4.7-2.7-4.6 2.7-4.7-2.7-4.7 2.7-4.6-2.7L10 42z" fill="currentColor" fill-opacity="0.06" stroke-width="2" stroke-linejoin="round"/>' +
      '<path data-part="lines" d="M17 16h14M17 23h14M17 30h8" stroke-width="1.75" stroke-opacity="0.6"/>',
  },
  package: {
    label: 'PackageHifi',
    body:
      '<path data-part="box" d="M42 32V16a3 3 0 0 0-1.5-2.6l-14-8a3 3 0 0 0-3 0l-14 8A3 3 0 0 0 8 16v16a3 3 0 0 0 1.5 2.6l14 8a3 3 0 0 0 3 0l14-8A3 3 0 0 0 42 32z" fill="currentColor" fill-opacity="0.08" stroke-width="2" stroke-linejoin="round"/>' +
      '<path d="M8.5 14.5 24 23l15.5-8.5M24 23v18" stroke-width="1.75" stroke-opacity="0.6"/>' +
      '<path d="M16 9.5 32 18.5" stroke-width="1.75" stroke-opacity="0.6"/>',
  },
  verified: {
    label: 'VerifiedHifi',
    body:
      '<path d="M7.7 17.2a8 8 0 0 1 9.5-9.5 8 8 0 0 1 13.5 0 8 8 0 0 1 9.6 9.6 8 8 0 0 1 0 13.4 8 8 0 0 1-9.5 9.6 8 8 0 0 1-13.5 0 8 8 0 0 1-9.6-9.5 8 8 0 0 1 0-13.6z" fill="currentColor" fill-opacity="0.1" stroke-width="2" stroke-linejoin="round"/>' +
      '<path data-part="check" d="M18 24l4 4 8-8" stroke-width="2.25"/>',
  },

  // ── Cloud · SaaS · privacy · CLI/MCP (48×48 twins) ───────────────────────────
  cloud: {
    label: 'CloudHifi',
    body:
      '<circle cx="24" cy="24" r="20" fill="currentColor" fill-opacity="0.05" stroke="none"/>' +
      '<path data-part="cloud" d="M15 35h19a7 7 0 0 0 .5-14A10.5 10.5 0 0 0 13.3 17 6.6 6.6 0 0 0 15 35z" fill="currentColor" fill-opacity="0.1" stroke-width="2" stroke-linejoin="round"/>',
  },
  shield: {
    label: 'ShieldHifi',
    body:
      '<path data-part="shield" d="M24 5l15 5.5v10.5c0 9.5-6.4 16-15 18-8.6-2-15-8.5-15-18V10.5z" fill="currentColor" fill-opacity="0.1" stroke-width="2" stroke-linejoin="round"/>',
  },
  shieldCheck: {
    label: 'ShieldCheckHifi',
    body:
      '<path data-part="shield" d="M24 5l15 5.5v10.5c0 9.5-6.4 16-15 18-8.6-2-15-8.5-15-18V10.5z" fill="currentColor" fill-opacity="0.1" stroke-width="2" stroke-linejoin="round"/>' +
      '<path data-part="check" d="M17.5 23.5l4.5 4.5 9-9" stroke-width="2.25"/>',
  },
  lock: {
    label: 'LockHifi',
    body:
      '<rect x="9" y="21" width="30" height="20" rx="4.5" fill="currentColor" fill-opacity="0.08" stroke-width="2"/>' +
      '<path data-part="shackle" d="M16 21v-6a8 8 0 0 1 16 0v6" stroke-width="2"/>' +
      '<circle cx="24" cy="31" r="2.3" fill="currentColor" stroke="none"/>',
  },
  key: {
    label: 'KeyHifi',
    body:
      '<circle cx="24" cy="24" r="20" fill="currentColor" fill-opacity="0.05" stroke="none"/>' +
      '<circle data-part="bow" cx="17" cy="31" r="8" fill="currentColor" fill-opacity="0.1" stroke-width="2"/>' +
      '<path d="M22.7 25.3 39 9" stroke-width="2"/>' +
      '<path d="M33 11l5 5M28 16l4 4" stroke-width="2"/>',
  },
  creditCard: {
    label: 'CreditCardHifi',
    body:
      '<rect x="5" y="11" width="38" height="26" rx="4.5" fill="currentColor" fill-opacity="0.08" stroke-width="2"/>' +
      '<path d="M5 20h38" stroke-width="2"/>' +
      '<path data-part="chip" d="M12 30h9" stroke-width="2" stroke-opacity="0.7"/>',
  },
  globe: {
    label: 'GlobeHifi',
    body:
      '<circle cx="24" cy="24" r="19" fill="currentColor" fill-opacity="0.06" stroke-width="2"/>' +
      '<path d="M5 24h38" stroke-width="1.75" stroke-opacity="0.7"/>' +
      '<ellipse cx="24" cy="24" rx="8.5" ry="19" stroke-width="1.75" stroke-opacity="0.7"/>',
  },
  terminal: {
    label: 'TerminalHifi',
    body:
      '<rect x="6" y="9" width="36" height="30" rx="4" fill="currentColor" fill-opacity="0.06" stroke-width="2"/>' +
      '<path data-part="prompt" d="M14 19l6 5-6 5" stroke-width="2"/>' +
      '<path d="M24 30h9" stroke-width="2"/>',
  },
  command: {
    label: 'CommandHifi',
    body:
      '<circle cx="24" cy="24" r="20" fill="currentColor" fill-opacity="0.05" stroke="none"/>' +
      '<path d="M31 12a5 5 0 0 0-5 5v14a5 5 0 0 0 5 5 5 5 0 0 0 5-5 5 5 0 0 0-5-5H17a5 5 0 0 0-5 5 5 5 0 0 0 5 5 5 5 0 0 0 5-5V17a5 5 0 0 0-5-5 5 5 0 0 0-5 5 5 5 0 0 0 5 5h14a5 5 0 0 0 5-5 5 5 0 0 0-5-5z" fill="currentColor" fill-opacity="0.08" stroke-width="2" stroke-linejoin="round"/>',
  },
  database: {
    label: 'DatabaseHifi',
    body:
      '<ellipse data-part="lid" cx="24" cy="11" rx="15" ry="6" fill="currentColor" fill-opacity="0.1" stroke-width="2"/>' +
      '<path d="M9 11v12c0 3.3 6.7 6 15 6s15-2.7 15-6V11" fill="currentColor" fill-opacity="0.05" stroke-width="2"/>' +
      '<path d="M9 23v12c0 3.3 6.7 6 15 6s15-2.7 15-6V23" stroke-width="2"/>',
  },

  // ── General chrome (48×48 twins, where the icon reads as a tile) ─────────────
  mail: {
    label: 'MailHifi',
    body:
      '<rect x="5" y="10" width="38" height="28" rx="4.5" fill="currentColor" fill-opacity="0.06" stroke-width="2"/>' +
      '<path data-part="flap" d="M6 14l18 12 18-12" stroke-width="2"/>',
  },
  bell: {
    label: 'BellHifi',
    body:
      '<circle cx="24" cy="24" r="20" fill="currentColor" fill-opacity="0.05" stroke="none"/>' +
      '<path data-part="bell" d="M13 32V21a11 11 0 0 1 22 0v11l3 4H10z" fill="currentColor" fill-opacity="0.1" stroke-width="2" stroke-linejoin="round"/>' +
      '<path d="M20 38a4.5 4.5 0 0 0 8 0" stroke-width="2"/>',
  },
  book: {
    label: 'BookHifi',
    body:
      '<path d="M10 8.5A2.5 2.5 0 0 1 12.5 6H38a2 2 0 0 1 2 2v28a2 2 0 0 1-2 2H12.5A2.5 2.5 0 0 0 10 40.5z" fill="currentColor" fill-opacity="0.06" stroke-width="2" stroke-linejoin="round"/>' +
      '<path data-part="cover" d="M10 35.5A2.5 2.5 0 0 1 12.5 33H40" stroke-width="2"/>' +
      '<path d="M19 14h13" stroke-width="1.75" stroke-opacity="0.6"/>',
  },
  rocket: {
    label: 'RocketHifi',
    body:
      '<circle cx="24" cy="24" r="20" fill="currentColor" fill-opacity="0.05" stroke="none"/>' +
      '<path data-part="rocket" d="M24 4c5 5 7 11 7 18v8H17v-8c0-7 2-13 7-18z" fill="currentColor" fill-opacity="0.1" stroke-width="2" stroke-linejoin="round"/>' +
      '<path d="M17 24l-5 4v6l5-3M31 24l5 4v6l-5-3" fill="currentColor" fill-opacity="0.08" stroke-width="2" stroke-linejoin="round"/>' +
      '<circle cx="24" cy="17" r="3" stroke-width="2"/>' +
      '<path data-part="flame" d="M21 38c0 3 3 6 3 6s3-3 3-6z" fill="currentColor" fill-opacity="0.12" stroke-width="2" stroke-linejoin="round"/>',
  },
  trend: {
    label: 'TrendHifi',
    body:
      '<circle cx="24" cy="24" r="20" fill="currentColor" fill-opacity="0.05" stroke="none"/>' +
      '<path data-part="line" d="M8 32l9-9 7 6 12-13" stroke-width="2.25"/>' +
      '<path d="M36 16h-9M36 16v9" stroke-width="2.25"/>',
  },
  pieChart: {
    label: 'PieChartHifi',
    body:
      '<circle cx="24" cy="24" r="19" fill="currentColor" fill-opacity="0.06" stroke-width="2"/>' +
      '<path data-part="slice" d="M24 24V5a19 19 0 0 1 16.5 9.5z" fill="currentColor" fill-opacity="0.18" stroke-width="2" stroke-linejoin="round"/>' +
      '<path d="M24 5v19l16.5 9.5" stroke-width="1.5" stroke-opacity="0.5"/>',
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
  ...sonaProductHifi,
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
  // full sonaloop mark + small bar-chart badge chip (sonaloop-data)
  'sonaloop-data': {
    label: 'SonaloopDataHifi',
    body: '<defs><mask id="slDataBadgeH"><rect width="48" height="48" fill="white"/><path d="M35 29.4H41A5.6 5.6 0 0 1 46.6 35V41A5.6 5.6 0 0 1 41 46.6H35A5.6 5.6 0 0 1 29.4 41V35A5.6 5.6 0 0 1 35 29.4Z" fill="black"/></mask></defs><g mask="url(#slDataBadgeH)"><path data-part="loop" d="M37.5 24L38.14 25.49L38.53 27.09L38.62 28.75L38.34 30.38L37.69 31.91L36.7 33.23L35.42 34.28L33.94 35.04L32.35 35.5L30.75 35.69L29.2 35.68L27.75 35.55L26.42 35.38L25.18 35.24L24 35.19L22.82 35.24L21.58 35.38L20.25 35.55L18.8 35.68L17.25 35.69L15.65 35.5L14.06 35.04L12.58 34.28L11.3 33.23L10.31 31.91L9.66 30.38L9.38 28.75L9.47 27.09L9.86 25.49L10.5 24L11.28 22.66L12.12 21.48L12.94 20.41L13.67 19.4L14.31 18.41L14.86 17.36L15.36 16.22L15.88 14.98L16.48 13.66L17.25 12.31L18.22 11.02L19.41 9.87L20.8 8.97L22.36 8.39L24 8.19L25.64 8.39L27.2 8.97L28.59 9.87L29.78 11.02L30.75 12.31L31.52 13.66L32.12 14.98L32.64 16.22L33.14 17.36L33.69 18.4L34.33 19.4L35.06 20.41L35.88 21.48L36.72 22.66L37.5 24ZM31.5 24L30.75 23.29L30.01 22.72L29.36 22.26L28.84 21.84L28.49 21.4L28.29 20.88L28.18 20.23L28.11 19.44L27.99 18.51L27.75 17.5L27.34 16.5L26.74 15.58L25.95 14.84L25.01 14.36L24 14.19L22.99 14.36L22.05 14.84L21.26 15.58L20.66 16.5L20.25 17.5L20.01 18.51L19.89 19.44L19.82 20.23L19.71 20.88L19.51 21.41L19.16 21.84L18.64 22.26L17.99 22.72L17.25 23.29L16.5 24L15.83 24.86L15.34 25.84L15.09 26.9L15.14 27.94L15.5 28.91L16.16 29.7L17.04 30.27L18.07 30.58L19.17 30.65L20.25 30.5L21.24 30.2L22.1 29.84L22.83 29.51L23.45 29.27L24 29.19L24.55 29.27L25.17 29.51L25.9 29.84L26.76 30.2L27.75 30.5L28.83 30.65L29.93 30.58L30.96 30.27L31.84 29.7L32.5 28.91L32.86 27.94L32.91 26.9L32.66 25.84L32.17 24.86L31.5 24Z" fill="currentColor" fill-opacity="0.1" fill-rule="evenodd" stroke-width="2"/><circle cx="24" cy="6" r="3.6" fill="currentColor" fill-opacity="0.1" stroke-width="2"/><circle cx="39.59" cy="33" r="3.6" fill="currentColor" fill-opacity="0.1" stroke-width="2"/><circle cx="8.41" cy="33" r="3.6" fill="currentColor" fill-opacity="0.1" stroke-width="2"/></g><path data-part="badge" d="M35.6 31H40.4A4.6 4.6 0 0 1 45 35.6V40.4A4.6 4.6 0 0 1 40.4 45H35.6A4.6 4.6 0 0 1 31 40.4V35.6A4.6 4.6 0 0 1 35.6 31Z M33.6 37.5h2.3v4h-2.3z M36.85 34.5h2.3v7h-2.3z M40.1 36.5h2.3v5h-2.3z" fill-rule="evenodd" fill="currentColor" stroke="none"/>',
  },
  // full sonaloop mark + small browser-window badge chip (sonaloop-website)
  'sonaloop-website': {
    label: 'SonaloopWebsiteHifi',
    body: '<defs><mask id="slWebBadgeH"><rect width="48" height="48" fill="white"/><path d="M35 29.4H41A5.6 5.6 0 0 1 46.6 35V41A5.6 5.6 0 0 1 41 46.6H35A5.6 5.6 0 0 1 29.4 41V35A5.6 5.6 0 0 1 35 29.4Z" fill="black"/></mask></defs><g mask="url(#slWebBadgeH)"><path data-part="loop" d="M37.5 24L38.14 25.49L38.53 27.09L38.62 28.75L38.34 30.38L37.69 31.91L36.7 33.23L35.42 34.28L33.94 35.04L32.35 35.5L30.75 35.69L29.2 35.68L27.75 35.55L26.42 35.38L25.18 35.24L24 35.19L22.82 35.24L21.58 35.38L20.25 35.55L18.8 35.68L17.25 35.69L15.65 35.5L14.06 35.04L12.58 34.28L11.3 33.23L10.31 31.91L9.66 30.38L9.38 28.75L9.47 27.09L9.86 25.49L10.5 24L11.28 22.66L12.12 21.48L12.94 20.41L13.67 19.4L14.31 18.41L14.86 17.36L15.36 16.22L15.88 14.98L16.48 13.66L17.25 12.31L18.22 11.02L19.41 9.87L20.8 8.97L22.36 8.39L24 8.19L25.64 8.39L27.2 8.97L28.59 9.87L29.78 11.02L30.75 12.31L31.52 13.66L32.12 14.98L32.64 16.22L33.14 17.36L33.69 18.4L34.33 19.4L35.06 20.41L35.88 21.48L36.72 22.66L37.5 24ZM31.5 24L30.75 23.29L30.01 22.72L29.36 22.26L28.84 21.84L28.49 21.4L28.29 20.88L28.18 20.23L28.11 19.44L27.99 18.51L27.75 17.5L27.34 16.5L26.74 15.58L25.95 14.84L25.01 14.36L24 14.19L22.99 14.36L22.05 14.84L21.26 15.58L20.66 16.5L20.25 17.5L20.01 18.51L19.89 19.44L19.82 20.23L19.71 20.88L19.51 21.41L19.16 21.84L18.64 22.26L17.99 22.72L17.25 23.29L16.5 24L15.83 24.86L15.34 25.84L15.09 26.9L15.14 27.94L15.5 28.91L16.16 29.7L17.04 30.27L18.07 30.58L19.17 30.65L20.25 30.5L21.24 30.2L22.1 29.84L22.83 29.51L23.45 29.27L24 29.19L24.55 29.27L25.17 29.51L25.9 29.84L26.76 30.2L27.75 30.5L28.83 30.65L29.93 30.58L30.96 30.27L31.84 29.7L32.5 28.91L32.86 27.94L32.91 26.9L32.66 25.84L32.17 24.86L31.5 24Z" fill="currentColor" fill-opacity="0.1" fill-rule="evenodd" stroke-width="2"/><circle cx="24" cy="6" r="3.6" fill="currentColor" fill-opacity="0.1" stroke-width="2"/><circle cx="39.59" cy="33" r="3.6" fill="currentColor" fill-opacity="0.1" stroke-width="2"/><circle cx="8.41" cy="33" r="3.6" fill="currentColor" fill-opacity="0.1" stroke-width="2"/></g><path data-part="badge" d="M35.6 31H40.4A4.6 4.6 0 0 1 45 35.6V40.4A4.6 4.6 0 0 1 40.4 45H35.6A4.6 4.6 0 0 1 31 40.4V35.6A4.6 4.6 0 0 1 35.6 31Z M35.2 34.0h5.6a1.2 1.2 0 0 1 1.2 1.2v5.2a1.2 1.2 0 0 1 -1.2 1.2h-5.6a1.2 1.2 0 0 1 -1.2 -1.2v-5.2a1.2 1.2 0 0 1 1.2 -1.2z M34.7 35.4h6.6v0.85h-6.6z" fill-rule="evenodd" fill="currentColor" stroke="none"/>',
  },
  // full sonaloop mark + small sparkle badge chip (sonaloop-design)
  'sonaloop-design': {
    label: 'SonaloopDesignHifi',
    body: '<defs><mask id="slDesignBadgeH"><rect width="48" height="48" fill="white"/><path d="M35 29.4H41A5.6 5.6 0 0 1 46.6 35V41A5.6 5.6 0 0 1 41 46.6H35A5.6 5.6 0 0 1 29.4 41V35A5.6 5.6 0 0 1 35 29.4Z" fill="black"/></mask></defs><g mask="url(#slDesignBadgeH)"><path data-part="loop" d="M37.5 24L38.14 25.49L38.53 27.09L38.62 28.75L38.34 30.38L37.69 31.91L36.7 33.23L35.42 34.28L33.94 35.04L32.35 35.5L30.75 35.69L29.2 35.68L27.75 35.55L26.42 35.38L25.18 35.24L24 35.19L22.82 35.24L21.58 35.38L20.25 35.55L18.8 35.68L17.25 35.69L15.65 35.5L14.06 35.04L12.58 34.28L11.3 33.23L10.31 31.91L9.66 30.38L9.38 28.75L9.47 27.09L9.86 25.49L10.5 24L11.28 22.66L12.12 21.48L12.94 20.41L13.67 19.4L14.31 18.41L14.86 17.36L15.36 16.22L15.88 14.98L16.48 13.66L17.25 12.31L18.22 11.02L19.41 9.87L20.8 8.97L22.36 8.39L24 8.19L25.64 8.39L27.2 8.97L28.59 9.87L29.78 11.02L30.75 12.31L31.52 13.66L32.12 14.98L32.64 16.22L33.14 17.36L33.69 18.4L34.33 19.4L35.06 20.41L35.88 21.48L36.72 22.66L37.5 24ZM31.5 24L30.75 23.29L30.01 22.72L29.36 22.26L28.84 21.84L28.49 21.4L28.29 20.88L28.18 20.23L28.11 19.44L27.99 18.51L27.75 17.5L27.34 16.5L26.74 15.58L25.95 14.84L25.01 14.36L24 14.19L22.99 14.36L22.05 14.84L21.26 15.58L20.66 16.5L20.25 17.5L20.01 18.51L19.89 19.44L19.82 20.23L19.71 20.88L19.51 21.41L19.16 21.84L18.64 22.26L17.99 22.72L17.25 23.29L16.5 24L15.83 24.86L15.34 25.84L15.09 26.9L15.14 27.94L15.5 28.91L16.16 29.7L17.04 30.27L18.07 30.58L19.17 30.65L20.25 30.5L21.24 30.2L22.1 29.84L22.83 29.51L23.45 29.27L24 29.19L24.55 29.27L25.17 29.51L25.9 29.84L26.76 30.2L27.75 30.5L28.83 30.65L29.93 30.58L30.96 30.27L31.84 29.7L32.5 28.91L32.86 27.94L32.91 26.9L32.66 25.84L32.17 24.86L31.5 24Z" fill="currentColor" fill-opacity="0.1" fill-rule="evenodd" stroke-width="2"/><circle cx="24" cy="6" r="3.6" fill="currentColor" fill-opacity="0.1" stroke-width="2"/><circle cx="39.59" cy="33" r="3.6" fill="currentColor" fill-opacity="0.1" stroke-width="2"/><circle cx="8.41" cy="33" r="3.6" fill="currentColor" fill-opacity="0.1" stroke-width="2"/></g><path data-part="badge" d="M35.6 31H40.4A4.6 4.6 0 0 1 45 35.6V40.4A4.6 4.6 0 0 1 40.4 45H35.6A4.6 4.6 0 0 1 31 40.4V35.6A4.6 4.6 0 0 1 35.6 31Z M38 33.2L39.27 36.73L42.8 38L39.27 39.27L38 42.8L36.73 39.27L33.2 38L36.73 36.73Z" fill-rule="evenodd" fill="currentColor" stroke="none"/>',
  },
};
