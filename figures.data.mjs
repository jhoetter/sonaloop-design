/**
 * sonaloop-figures — single source of truth.
 *
 * FIGURES are the design system's high-fidelity illustrative plates — large,
 * technical, fine-line isometric drawings (think the "FIG 0.2" plates on the
 * Linear marketing site) that anchor feature sections on marketing pages and
 * docs. They sit above icons in fidelity but work exactly like them under the
 * hood: authored ONCE here, then `scripts/gen.mjs` emits both consumers:
 *
 *   src/index.ts                       → React components  (LoopFigure …)
 *   py/sonaloop_icons/__init__.py       → figure("loop")    (Python-SSR)
 *
 * ── Conventions ────────────────────────────────────────────────────────────
 * Every figure shares one 480×400 viewBox and is drawn on `currentColor`
 * with a fixed stroke vocabulary, so plates stay consistent side by side:
 *
 *   silhouettes      stroke-width 1.1 · stroke-opacity .5
 *   inner edges      stroke-width 1   · stroke-opacity .3
 *   hairline detail  stroke-width 1   · stroke-opacity .18
 *   surface fills    fill-opacity .04 (top faces catch a little light)
 *
 * Geometry is COMPUTED, not hand-plotted: the helpers below project 3-D plan
 * coordinates (x right-down · y left-down · z up) through a true 30° isometric
 * camera and emit rounded paths. Edit dimensions/layout, never raw path data.
 * The module is pure deterministic JS — it runs in Node (codegen) and straight
 * in the browser (the docs site imports it live).
 *
 * Animatable sub-parts carry `data-part`; the codegen stamps
 * `pi-fig pi-fig-<name>` on each <svg> and `styles/hifi-anim.css` adds the
 * opt-in (`.pi-animate`) hover gesture, exactly like the hi-fi icons.
 *
 * After editing, run:  npm run gen
 */

export const FIGURE_VIEWBOX = '0 0 480 400';

/* ── isometric toolkit ──────────────────────────────────────────────────── */

const ISO_X = Math.cos(Math.PI / 6); // 30° axes
const ISO_Y = 0.5;
// Circles drawn on a top (z) plane project to axis-aligned ellipses with
// these radius factors (rx = r·√2·cos30, ry = r·√2·sin30).
const ERX = Math.SQRT2 * ISO_X;
const ERY = Math.SQRT2 * ISO_Y;

const num = (v) => {
  const r = Math.round(v * 100) / 100;
  return Object.is(r, -0) ? 0 : r;
};

/** A projector maps plan (x, y, z) → screen [sx, sy], placed at (ox, oy). */
const projector = (ox, oy) => (x, y, z = 0) =>
  [num(ox + (x - y) * ISO_X), num(oy + (x + y) * ISO_Y - z)];

/** Closed polygon with quadratic-rounded corners (radius r, in screen px). */
function ring(pts, r) {
  const n = pts.length;
  let d = '';
  for (let i = 0; i < n; i++) {
    const p = pts[i];
    const a = pts[(i - 1 + n) % n];
    const b = pts[(i + 1) % n];
    const la = Math.hypot(p[0] - a[0], p[1] - a[1]) || 1;
    const lb = Math.hypot(b[0] - p[0], b[1] - p[1]) || 1;
    const ra = Math.min(r, la / 2);
    const rb = Math.min(r, lb / 2);
    const p1 = [num(p[0] - ((p[0] - a[0]) / la) * ra), num(p[1] - ((p[1] - a[1]) / la) * ra)];
    const p2 = [num(p[0] + ((b[0] - p[0]) / lb) * rb), num(p[1] + ((b[1] - p[1]) / lb) * rb)];
    d += `${i ? 'L' : 'M'}${p1[0]} ${p1[1]}Q${p[0]} ${p[1]} ${p2[0]} ${p2[1]}`;
  }
  return d + 'Z';
}

/** Open polyline, rounded at the interior vertices. */
function bend(pts, r) {
  let d = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const p = pts[i];
    const a = pts[i - 1];
    const b = pts[i + 1];
    const la = Math.hypot(p[0] - a[0], p[1] - a[1]) || 1;
    const lb = Math.hypot(b[0] - p[0], b[1] - p[1]) || 1;
    const ra = Math.min(r, la / 2);
    const rb = Math.min(r, lb / 2);
    d += `L${num(p[0] - ((p[0] - a[0]) / la) * ra)} ${num(p[1] - ((p[1] - a[1]) / la) * ra)}`;
    d += `Q${p[0]} ${p[1]} ${num(p[0] + ((b[0] - p[0]) / lb) * rb)} ${num(p[1] + ((b[1] - p[1]) / lb) * rb)}`;
  }
  const e = pts[pts.length - 1];
  return d + `L${e[0]} ${e[1]}`;
}

const seg = (a, b) => `M${a[0]} ${a[1]}L${b[0]} ${b[1]}`;

/* stroke vocabulary */
const SIL = 'stroke-width="1.1" stroke-opacity="0.5"';
const EDGE = 'stroke-opacity="0.3"';
const HAIR = 'stroke-opacity="0.18"';
const path = (d, attrs) => `<path d="${d}" ${attrs}/>`;

/**
 * A rounded isometric box at plan offset (px, py), base height z0, dims w×d×h.
 * Renders a rounded silhouette hexagon, the visible top-face edges, a faint
 * top-face fill, and (for tall boxes) the front vertical edge.
 *
 * The silhouette is filled with `var(--sl-fig-surface, transparent)`: set that
 * variable to the plate's background colour and boxes OCCLUDE whatever sits
 * behind them (the reference look); leave it unset and the figure degrades to
 * a clean x-ray wireframe. Boxes must be emitted back-to-front.
 */
function isoBox(P, px, py, w, d, h, r, z0 = 0) {
  const p = (x, y, z) => P(px + x, py + y, z0 + z);
  let out = path(
    ring([p(0, 0, h), p(w, 0, h), p(w, 0, 0), p(w, d, 0), p(0, d, 0), p(0, d, h)], r),
    `${SIL} style="fill:var(--sl-fig-surface,transparent)"`,
  );
  out += path(bend([p(w, 0, h), p(w, d, h), p(0, d, h)], r), EDGE);
  out += path(
    ring([p(0, 0, h), p(w, 0, h), p(w, d, h), p(0, d, h)], r),
    'fill="currentColor" fill-opacity="0.04" stroke="none"',
  );
  if (h > r * 4) out += path(seg(p(w, d, h - r), p(w, d, r)), EDGE);
  return out;
}

/** A small grid of "vent" dots on a top face (each dot iso-projected). */
function vents(P, px, py, z, x0, y0, nx, ny, s = 7) {
  let out = '';
  for (let i = 0; i < nx; i++) {
    for (let j = 0; j < ny; j++) {
      const [cx, cy] = P(px + x0 + i * s, py + y0 + j * s, z);
      out += `<ellipse cx="${cx}" cy="${cy}" rx="1.1" ry="0.64" fill="currentColor" fill-opacity="0.5" stroke="none"/>`;
    }
  }
  return out;
}

/** A circle of radius r drawn on a top (z) plane → projected ellipse. */
function planeEllipse(P, cx, cy, z, r, attrs) {
  const [ex, ey] = P(cx, cy, z);
  return `<ellipse cx="${ex}" cy="${ey}" rx="${num(r * ERX)}" ry="${num(r * ERY)}" ${attrs}/>`;
}

/* ── FIG 0.1 · loop — the layered, longitudinal memory ──────────────────── */
/* An exploded stack: five strata fused into a column, a floating lid carrying
   the Sonaloop loop-and-three-nodes mark in plan view, dotted lift lines. */
function figLoop() {
  const P = projector(240, 208);
  const W = 168;            // plan footprint (square)
  const SLAB = 22;          // stratum height
  const STEP = 27.5;        // stratum pitch (height + gap)

  let slabs = '';
  for (let i = 0; i < 5; i++) {
    slabs += `<g data-part="slab-${i + 1}">${isoBox(P, 0, 0, W, W, SLAB, 7, i * STEP)}</g>`;
  }

  const lidZ = 170;
  const lidTop = lidZ + 13;
  const lid = `<g data-part="lid">${isoBox(P, 0, 0, W, W, 13, 7, lidZ)}</g>`;

  // The mark, engraved in plan: the loop ring, a faint inner echo, three nodes.
  const cx = W / 2;
  const R = 52;
  let mark = planeEllipse(P, cx, cx, lidTop, R, 'stroke-opacity="0.55"');
  mark += planeEllipse(P, cx, cx, lidTop, 34, `${HAIR} stroke-dasharray="0.2 5" stroke-linecap="round"`);
  for (const deg of [90, 210, 330]) {
    const t = (deg * Math.PI) / 180;
    mark += planeEllipse(
      P, cx + R * Math.cos(t), cx + R * Math.sin(t), lidTop, 6,
      'stroke-opacity="0.55" fill="currentColor" fill-opacity="0.1"',
    );
  }
  mark = `<g data-part="mark">${mark}</g>`;

  // Dotted lift lines at the four plan corners, lid → stack.
  const stackTop = 4 * STEP + SLAB;
  let links = '';
  for (const [x, y] of [[0, 0], [W, 0], [W, W], [0, W]]) {
    links += path(seg(P(x, y, lidZ - 5), P(x, y, stackTop + 5)),
      'stroke-opacity="0.5" stroke-dasharray="0.2 3.4" stroke-linecap="round"');
  }
  links = `<g data-part="links">${links}</g>`;

  return slabs + links + lid + mark;
}

/* ── FIG 0.2 · council — the standing panel ─────────────────────────────── */
/* A cluster of independent volumes — different heights and footprints, each
   with its own quiet vent grid — plus one faint echo block: a voice not yet
   at the table. */
function figCouncil() {
  const P = projector(251, 137);
  const a = { px: 0, py: 0, w: 80, d: 80, h: 108 };
  const b = { px: 104, py: 22, w: 92, d: 92, h: 68 };
  const c = { px: 0, py: 98, w: 80, d: 82, h: 38 };
  const d = { px: 104, py: 130, w: 82, d: 82, h: 58 };
  const g = { px: 104, py: 230, w: 72, d: 72, h: 24 };

  const block = (o, part, vent) =>
    `<g data-part="${part}">${isoBox(P, o.px, o.py, o.w, o.d, o.h, 8)}${vent || ''}</g>`;

  // back-to-front (by plan x+y) so the occluder fills layer correctly
  return (
    block(a, 'blk-a', vents(P, a.px, a.py, a.h, 14, 14, 4, 4)) +
    block(c, 'blk-c') +
    block(b, 'blk-b', vents(P, b.px, b.py, b.h, 14, 14, 3, 3)) +
    block(d, 'blk-d', vents(P, d.px, d.py, d.h, 12, 12, 3, 3)) +
    `<g data-part="ghost" opacity="0.32">${isoBox(P, g.px, g.py, g.w, g.d, g.h, 8)}</g>`
  );
}

/* ── FIG 0.3 · signal — deliberation settling into signal ───────────────── */
/* A damped waveform built from upright panels: one strike, a counter-lobe,
   then ripples flattening toward the loop's steady state. */
function figSignal() {
  const P = projector(305, 201);
  const NPANEL = 14;
  const PITCH = 18;       // plan pitch along y
  const WPANEL = 104;     // panel width (x)
  const DPANEL = 8;       // panel thickness (y)

  let out = '';
  for (let j = 0; j < NPANEL; j++) {
    const h = num(6 + 170 * Math.exp(-0.32 * j) * Math.abs(Math.cos(0.55 * j)));
    const py = j * PITCH;
    let panel = isoBox(P, 0, py, WPANEL, DPANEL, h, 2.8);
    if (h > 60) {
      // tall panels read as screens — a hairline inset bezel on the front face
      const q = (x, z) => P(x, py + DPANEL, z);
      panel += path(ring([q(7, h - 7), q(WPANEL - 7, h - 7), q(WPANEL - 7, 7), q(7, 7)], 2), HAIR);
    }
    out += `<g data-part="slat-${j + 1}">${panel}</g>`;
  }
  return out;
}

/* ── the figures ────────────────────────────────────────────────────────── */
/* Order defines the plate numbering (FIG 0.1 …). `label` is the React export;
   `title` + `note` are the canonical plate caption copy. */
export const figures = {
  loop: {
    label: 'LoopFigure',
    fig: '0.1',
    title: 'Built for the long run',
    note: 'Councils write into a layered, longitudinal memory — every loop adds a stratum.',
    body: figLoop(),
  },
  council: {
    label: 'CouncilFigure',
    fig: '0.2',
    title: 'Deliberation, not consensus',
    note: 'A standing panel of synthetic personas — independent voices that disagree on the record.',
    body: figCouncil(),
  },
  signal: {
    label: 'SignalFigure',
    fig: '0.3',
    title: 'Signal over noise',
    note: 'Deliberation damps the noise; what remains settles into the signal you act on.',
    body: figSignal(),
  },
};
