/**
 * sonaloop-design — chart components (React side).
 *
 * Static, token-driven, print-safe charts that emit the shared `.sl-chart`/`.sl-bar*`/`.sl-pie*`/
 * `.sl-quad*`/`.sl-legend*` classes (styles/components.css). The Python-SSR side is
 * py/sonaloop_icons/charts.py; the CSS is the one styling source. Load it once:
 *   import 'sonaloop-design/components.css';
 *
 *   <BarChart items={[{ label: 'Plan', value: 8 }, { label: 'Cook', value: 3 }]} />
 *   <StackedBarChart items={[{ label: 'Pricing', segments: [{ label: 'For', value: 6 }, { label: 'Against', value: 2 }] }]} />
 *   <PieChart items={[{ label: 'Support', value: 12 }, { label: 'Oppose', value: 4 }]} donut />
 *   <GaugeChart items={[{ label: 'Confidence', value: 72 }]} />
 *   <DivergingBarChart items={[{ label: 'Pricing', positive: 6, negative: 2 }]} />
 *   <HeatmapChart columns={['A', 'B']} rows={[{ label: 'Cost', values: [2, 5] }]} />
 *   <DotPlotChart items={[{ label: 'Trust the AI', values: [2, 3, 3, 4, 5] }]} />
 *   <LineChart series={[{ label: 'Confidence', points: [2, 3, 5, 4, 6] }]} labels={['R1', 'R2', 'R3', 'R4', 'R5']} />
 *   <EffortImpactChart items={[{ label: 'Auto shopping list', x: 2, y: 5 }]} />
 *   <BurnupChart series={[{ label: 'Done', points: [0, 2, 5, 8] }]} target={12} now={3} />
 *   <StackedAreaChart series={[{ label: 'For', points: [2, 4, 6] }, { label: 'Against', points: [3, 2, 1] }]} />
 *   <ColumnChart items={[{ label: '1', value: 2 }, { label: '2', value: 5 }]} table />
 *   <StripChart items={[{ label: 'WTP', values: [9, 12, 15, 29] }]} unit="€" />
 *   <StatsChart items={[{ label: 'Personas', value: 16 }, { label: 'Agreement', value: '72%', sub: '+9 vs R1' }]} />
 *   <ProgressStripChart items={[{ label: 'Validated', value: 9 }, { label: 'Open', value: 4 }]} />
 *   <Sparkline values={[3, 5, 4, 6, 5, 8]} />
 *   <ProgressPie value={11} max={16} />
 */
import { Fragment } from 'react';
import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';

const SERIES = ['var(--c1)', 'var(--c2)', 'var(--c3)', 'var(--c4)', 'var(--c5)', 'var(--c6)', 'var(--c7)'];
const seriesColor = (i: number, color?: string) => color ?? SERIES[i % SERIES.length];
const fmt = (v: number) => (Number.isInteger(v) ? String(v) : `${v}`);
// Escape, then render inline markdown (**bold**, *italic*/_italic_, `code`) so labels authored in
// Markdown read like the rest of a report instead of showing raw `**`.
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const inlineMd = (s: string) => esc(s)
  .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  .replace(/__(.+?)__/g, '<strong>$1</strong>')
  .replace(/(?<!\w)\*(.+?)\*(?!\w)/g, '<em>$1</em>')
  .replace(/(?<!\w)_(.+?)_(?!\w)/g, '<em>$1</em>')
  .replace(/`(.+?)`/g, '<code>$1</code>');
const MD = ({ t, ...rest }: { t: string } & HTMLAttributes<HTMLSpanElement>) =>
  <span {...rest} dangerouslySetInnerHTML={{ __html: inlineMd(t) }} />;
const Title = ({ title }: { title?: string }) =>
  title ? <div className="sl-chart__title" dangerouslySetInnerHTML={{ __html: inlineMd(title) }} /> : null;
type Sv = CSSProperties & Record<string, string | number>;

export interface BarItem { label: string; value: number; color?: string }
export function BarChart({ items, title, maxValue, showValues = true }:
  { items: BarItem[]; title?: string; maxValue?: number; showValues?: boolean }) {
  const rows = items.filter((it) => Number.isFinite(it.value));
  if (!rows.length) return null;
  const mx = maxValue || Math.max(...rows.map((it) => it.value)) || 1;
  return (
    <figure className="sl-chart">
      <Title title={title} />
      <div className="sl-bars">
        {rows.map((it, i) => (
          <div className="sl-bar" key={i}>
            <MD t={it.label} className="sl-bar__label" title={it.label} />
            <span className="sl-bar__track">
              <span className="sl-bar__fill" style={{ '--v': `${Math.max(0, Math.min(100, (it.value / mx) * 100))}%`, '--c': seriesColor(i, it.color) } as Sv} />
            </span>
            {showValues && <span className="sl-bar__val">{fmt(it.value)}</span>}
          </div>
        ))}
      </div>
    </figure>
  );
}

export interface PieItem { label: string; value: number; color?: string }
export function PieChart({ items, title, donut = true, showValues = true }:
  { items: PieItem[]; title?: string; donut?: boolean; showValues?: boolean }) {
  const rows = items.filter((it) => it.value > 0);
  const total = rows.reduce((s, it) => s + it.value, 0);
  if (!rows.length || total <= 0) return null;
  let acc = 0;
  const stops = rows.map((it, i) => {
    const start = (acc / total) * 100;
    acc += it.value;
    return `${seriesColor(i, it.color)} ${start.toFixed(2)}% ${((acc / total) * 100).toFixed(2)}%`;
  });
  return (
    <figure className="sl-chart">
      <Title title={title} />
      <div className="sl-pie-wrap">
        <div className={donut ? 'sl-pie sl-pie--donut' : 'sl-pie'} role="img"
          style={{ '--slices': `conic-gradient(${stops.join(', ')})` } as Sv} />
        <div className="sl-legend">
          {rows.map((it, i) => (
            <span className="sl-legend__item" key={i}>
              <span className="sl-legend__sw" style={{ '--c': seriesColor(i, it.color) } as Sv} />
              <MD t={it.label} className="sl-legend__label" />
              {showValues && <span className="sl-legend__val">{fmt(it.value)} · {Math.round((it.value / total) * 100)}%</span>}
            </span>
          ))}
        </div>
      </div>
    </figure>
  );
}

export interface StackSegment { label: string; value: number; color?: string }
export interface StackedBarItem { label: string; segments: StackSegment[] }
export function StackedBarChart({ items, title, maxValue, showValues = true }:
  { items: StackedBarItem[]; title?: string; maxValue?: number; showValues?: boolean }) {
  const rows = items.filter((it) => it.segments?.some((s) => Number.isFinite(s.value)));
  if (!rows.length) return null;
  // Series identity (and colour) is shared across rows, keyed by segment label in first-seen order —
  // so the same series reads as the same colour in every bar and in the legend.
  const keys: string[] = [];
  for (const it of rows) for (const s of it.segments) if (!keys.includes(s.label)) keys.push(s.label);
  const colorOf = (s: StackSegment) => s.color ?? SERIES[Math.max(0, keys.indexOf(s.label)) % SERIES.length];
  const totals = rows.map((it) => it.segments.reduce((n, s) => n + Math.max(0, s.value || 0), 0));
  const mx = maxValue || Math.max(...totals) || 1;
  const legend = keys.map((k) => ({ label: k, color: colorOf(rows.flatMap((it) => it.segments).find((s) => s.label === k)!) }));
  return (
    <figure className="sl-chart">
      <Title title={title} />
      <div className="sl-bars">
        {rows.map((it, i) => (
          <div className="sl-bar" key={i}>
            <MD t={it.label} className="sl-bar__label" title={it.label} />
            <span className="sl-bar__track">
              <span className="sl-bar__fill sl-bar__fill--stack" style={{ '--v': `${Math.min(100, (totals[i] / mx) * 100)}%` } as Sv}>
                {it.segments.filter((s) => s.value > 0).map((s, j) => (
                  <span className="sl-bar__seg" key={j} title={`${s.label}: ${fmt(s.value)}`}
                    style={{ flexGrow: s.value, '--c': colorOf(s) } as Sv} />
                ))}
              </span>
            </span>
            {showValues && <span className="sl-bar__val">{fmt(totals[i])}</span>}
          </div>
        ))}
      </div>
      <div className="sl-legend sl-legend--row" style={{ marginTop: '.9em' }}>
        {legend.map((l, i) => (
          <span className="sl-legend__item" key={i}>
            <span className="sl-legend__sw" style={{ '--c': l.color } as Sv} />
            <MD t={l.label} className="sl-legend__label" />
          </span>
        ))}
      </div>
    </figure>
  );
}

export interface GaugeItem { label: string; value: number; max?: number; color?: string }
export function GaugeChart({ items, title, max = 100, showValues = true }:
  { items: GaugeItem[]; title?: string; max?: number; showValues?: boolean }) {
  const rows = items.filter((it) => Number.isFinite(it.value));
  if (!rows.length) return null;
  return (
    <figure className="sl-chart">
      <Title title={title} />
      <div className="sl-gauges">
        {rows.map((it, i) => {
          const m = it.max || max || 1;
          const pct = Math.max(0, Math.min(100, (it.value / m) * 100));
          return (
            <div className="sl-gauge-item" key={i}>
              <div className="sl-gauge" role="img" style={{ '--p': pct, '--c': seriesColor(i, it.color) } as Sv}>
                <span className="sl-gauge__val">{Math.round(pct)}%</span>
              </div>
              <MD t={it.label} className="sl-gauge__label" />
              {showValues && m !== 100 && <span className="sl-gauge__sub">{fmt(it.value)} / {fmt(m)}</span>}
            </div>
          );
        })}
      </div>
    </figure>
  );
}

export interface DivergingItem { label: string; positive: number; negative: number }
export function DivergingBarChart({ items, title, positiveLabel = 'Positive', negativeLabel = 'Negative',
  positiveColor = 'var(--sl-green)', negativeColor = 'var(--sl-red)', maxValue, showValues = true }:
  { items: DivergingItem[]; title?: string; positiveLabel?: string; negativeLabel?: string;
    positiveColor?: string; negativeColor?: string; maxValue?: number; showValues?: boolean }) {
  const rows = items.filter((it) => Number.isFinite(it.positive) || Number.isFinite(it.negative));
  if (!rows.length) return null;
  const mx = maxValue || Math.max(...rows.map((it) => Math.max(Math.abs(it.positive || 0), Math.abs(it.negative || 0)))) || 1;
  return (
    <figure className="sl-chart">
      <Title title={title} />
      <div className="sl-dbars">
        {rows.map((it, i) => {
          const pos = Math.max(0, it.positive || 0), neg = Math.max(0, it.negative || 0);
          return (
            <div className="sl-dbar" key={i}>
              <MD t={it.label} className="sl-dbar__label" title={it.label} />
              <span className="sl-dbar__neg"><span className="sl-dbar__fill" style={{ '--v': `${(neg / mx) * 100}%`, '--c': negativeColor } as Sv} /></span>
              <span className="sl-dbar__pos"><span className="sl-dbar__fill" style={{ '--v': `${(pos / mx) * 100}%`, '--c': positiveColor } as Sv} /></span>
              {showValues && <span className="sl-dbar__val">+{fmt(pos)} · −{fmt(neg)}</span>}
            </div>
          );
        })}
      </div>
      <div className="sl-legend sl-legend--row" style={{ marginTop: '.9em' }}>
        <span className="sl-legend__item"><span className="sl-legend__sw" style={{ '--c': positiveColor } as Sv} /><MD t={positiveLabel} className="sl-legend__label" /></span>
        <span className="sl-legend__item"><span className="sl-legend__sw" style={{ '--c': negativeColor } as Sv} /><MD t={negativeLabel} className="sl-legend__label" /></span>
      </div>
    </figure>
  );
}

export interface HeatmapRow { label: string; values: number[] }
export function HeatmapChart({ columns, rows, title, minValue, maxValue, color = 'var(--sl-accent)', showValues = true }:
  { columns: string[]; rows: HeatmapRow[]; title?: string; minValue?: number; maxValue?: number; color?: string; showValues?: boolean }) {
  const data = rows.filter((r) => Array.isArray(r.values));
  if (!data.length || !columns.length) return null;
  const all = data.flatMap((r) => r.values).filter((v) => Number.isFinite(v));
  const mn = minValue ?? Math.min(...all, 0);
  const mx = maxValue ?? Math.max(...all, 1);
  const tint = (v: number) => {
    const p = mx === mn ? 0 : Math.max(0, Math.min(100, ((v - mn) / (mx - mn)) * 100));
    return `color-mix(in srgb, ${color} ${p.toFixed(0)}%, var(--sl-surface-2))`;
  };
  return (
    <figure className="sl-chart">
      <Title title={title} />
      <div className="sl-heat" style={{ gridTemplateColumns: `minmax(4.5em, auto) repeat(${columns.length}, minmax(2em, 1fr))` } as Sv}>
        <span className="sl-heat__corner" />
        {columns.map((c, i) => <MD key={`c${i}`} t={c} className="sl-heat__col" />)}
        {data.map((r, ri) => (
          <Fragment key={ri}>
            <MD t={r.label} className="sl-heat__row" title={r.label} />
            {columns.map((_, ci) => {
              const v = r.values[ci];
              return <span className="sl-heat__cell" key={ci}
                style={Number.isFinite(v) ? { background: tint(v) } : undefined}>{Number.isFinite(v) && showValues ? fmt(v) : ''}</span>;
            })}
          </Fragment>
        ))}
      </div>
    </figure>
  );
}

export interface DotPlotItem { label: string; values: number[]; color?: string }
export function DotPlotChart({ items, title, minValue = 1, maxValue = 5, showMean = true }:
  { items: DotPlotItem[]; title?: string; minValue?: number; maxValue?: number; showMean?: boolean }) {
  const rows = items.filter((it) => Array.isArray(it.values) && it.values.some((v) => Number.isFinite(v)));
  if (!rows.length) return null;
  const span = (maxValue - minValue) || 1;
  const xOf = (v: number) => `${Math.max(0, Math.min(100, ((v - minValue) / span) * 100))}%`;
  return (
    <figure className="sl-chart">
      <Title title={title} />
      <div className="sl-dots">
        {rows.map((it, i) => {
          const vals = it.values.filter((v) => Number.isFinite(v));
          const mean = Math.round((vals.reduce((s, v) => s + v, 0) / vals.length) * 10) / 10;
          const c = it.color ?? SERIES[i % SERIES.length];
          return (
            <div className="sl-dot-row" key={i}>
              <MD t={it.label} className="sl-dot-label" title={it.label} />
              <span className="sl-dot-track">
                {vals.map((v, j) => <span className="sl-dot-pt" key={j} style={{ left: xOf(v), '--c': c } as Sv} />)}
                {showMean && <span className="sl-dot-mean" style={{ left: xOf(mean), '--c': c } as Sv} title={`mean ${fmt(mean)}`} />}
              </span>
              <span className="sl-dot-val">{fmt(mean)}</span>
            </div>
          );
        })}
      </div>
      <div className="sl-dot-scale"><span /><span className="sl-dot-scale__axis"><span>{fmt(minValue)}</span><span>{fmt(maxValue)}</span></span><span /></div>
    </figure>
  );
}

export interface LineSeries { label: string; points: number[]; color?: string }
const Grid = ({ w, h }: { w: number; h: number }) => (
  <>{[0.25, 0.5, 0.75].map((q) => <line className="sl-line__grid" key={q} x1="0" y1={(h * q).toFixed(1)} x2={w} y2={(h * q).toFixed(1)} />)}</>
);
export function LineChart({ series, title, labels, minValue, maxValue, showDots = true, target }:
  { series: LineSeries[]; title?: string; labels?: string[]; minValue?: number; maxValue?: number; showDots?: boolean; target?: number }) {
  const lines = series.filter((s) => Array.isArray(s.points) && s.points.filter((v) => Number.isFinite(v)).length > 1);
  if (!lines.length) return null;
  const all = lines.flatMap((s) => s.points).filter((v) => Number.isFinite(v));
  if (Number.isFinite(target)) all.push(target!);
  const mn = minValue ?? Math.min(...all);
  const mx = maxValue ?? Math.max(...all);
  const span = (mx - mn) || 1;
  const W = 100, H = 40;
  const xy = (pts: number[]) => pts.map((v, i) => [(i / (pts.length - 1)) * W, H - ((v - mn) / span) * H] as const);
  return (
    <figure className="sl-chart">
      <Title title={title} />
      <div className="sl-line">
        <svg viewBox={`0 0 ${W} ${H}`} role="img">
          <Grid w={W} h={H} />
          <line className="sl-line__axis" x1="0" y1={H} x2={W} y2={H} />
          {Number.isFinite(target) && (() => {
            const y = (H - ((target! - mn) / span) * H).toFixed(2);
            return <line className="sl-line__ref" x1="0" y1={y} x2={W} y2={y} />;
          })()}
          {lines.map((s, i) => {
            const pts = xy(s.points.filter((v) => Number.isFinite(v)));
            const poly = pts.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(' ');
            return (
              <g key={i} style={{ '--c': s.color ?? SERIES[i % SERIES.length] } as Sv}>
                {lines.length === 1 && <polygon className="sl-line__area" points={`0,${H} ${poly} ${pts[pts.length - 1][0].toFixed(2)},${H}`} />}
                <polyline className="sl-line__path" points={poly} />
                {showDots && pts.map(([x, y], j) => <circle className="sl-line__dot" key={j} cx={x.toFixed(2)} cy={y.toFixed(2)} r="1.4" />)}
              </g>
            );
          })}
        </svg>
        {labels?.length ? <div className="sl-line__labels">{labels.map((l, i) => <span key={i}>{l}</span>)}</div> : null}
      </div>
      {lines.length > 1 && (
        <div className="sl-legend sl-legend--row" style={{ marginTop: '.6em' }}>
          {lines.map((s, i) => (
            <span className="sl-legend__item" key={i}>
              <span className="sl-legend__sw" style={{ '--c': s.color ?? SERIES[i % SERIES.length] } as Sv} />
              <MD t={s.label} className="sl-legend__label" />
            </span>
          ))}
        </div>
      )}
    </figure>
  );
}

const leverage = (x: number, y: number) => {
  const d = y - x;
  return d >= 2 ? 'var(--sl-green)' : d >= 1 ? 'var(--sl-accent)' : d <= -1 ? 'var(--sl-red)' : 'var(--sl-amber)';
};
export interface EffortImpactItem { label: string; x: number; y: number; color?: string }
export function EffortImpactChart({ items, title, xLabel = 'Effort', yLabel = 'Value',
  quadrants = ['Quick wins', 'Big bets', 'Fill-ins', 'Time sinks'] }:
  { items: EffortImpactItem[]; title?: string; xLabel?: string; yLabel?: string; quadrants?: string[] }) {
  const rows = items.filter((it) => it.x && it.y);
  if (!rows.length) return null;
  const ql = [...quadrants, '', '', '', ''];
  const q = (i: number, cls: string): ReactNode => <span className={`sl-quad__q sl-quad__q--${cls}`} key={cls}>{ql[i]}</span>;
  return (
    <figure className="sl-chart">
      <Title title={title} />
      <div className="sl-quad-wrap">
        <div className="sl-quad-ylab">{yLabel}</div>
        <div className="sl-quad">
          <div className="sl-quad__gx" /><div className="sl-quad__gy" />
          {q(0, 'tl')}{q(1, 'tr')}{q(2, 'bl')}{q(3, 'br')}
          {rows.map((it, i) => {
            const c = it.color ?? leverage(it.x, it.y);
            return <span className="sl-quad__dot" key={i}
              style={{ '--x': `${((it.x - 1) / 4) * 100}%`, '--y': `${(1 - (it.y - 1) / 4) * 100}%`, '--c': c } as Sv}>{i + 1}</span>;
          })}
        </div>
        <div className="sl-quad-xlab">{xLabel}</div>
      </div>
      <div className="sl-legend" style={{ marginTop: '.9em' }}>
        {rows.map((it, i) => {
          const c = it.color ?? leverage(it.x, it.y);
          return (
            <span className="sl-legend__item" key={i}>
              <span className="sl-legend__num" style={{ '--c': c } as Sv}>{i + 1}</span>
              <MD t={it.label} className="sl-legend__label" />
              <span className="sl-legend__val">{xLabel[0]}{fmt(it.x)}·{yLabel[0]}{fmt(it.y)}</span>
            </span>
          );
        })}
      </div>
    </figure>
  );
}

/* ── Burnup — progress over time: band-filled lines, dotted target, hatched future ─ */
export function BurnupChart({ series, title, labels, target, now, minValue, maxValue, showDots = true }:
  { series: LineSeries[]; title?: string; labels?: string[]; target?: number; now?: number;
    minValue?: number; maxValue?: number; showDots?: boolean }) {
  const lines = series.filter((s) => Array.isArray(s.points) && s.points.filter((v) => Number.isFinite(v)).length > 1);
  if (!lines.length) return null;
  const all = lines.flatMap((s) => s.points).filter((v) => Number.isFinite(v));
  if (Number.isFinite(target)) all.push(target!);
  const mn = minValue ?? Math.min(...all, 0);
  const mx = maxValue ?? Math.max(...all);
  const span = (mx - mn) || 1;
  const W = 100, H = 40;
  const yOf = (v: number) => H - ((v - mn) / span) * H;
  const n = Math.max(...lines.map((s) => s.points.filter((v) => Number.isFinite(v)).length));
  const xNow = Number.isFinite(now) && n > 1 ? Math.max(0, Math.min(W, (now! / (n - 1)) * W)) : null;
  const hatch: ReactNode[] = [];
  if (xNow !== null && xNow < W) {
    for (let b = Math.floor(xNow) - H; b < W; b += 6) {
      const x1 = Math.max(b, xNow), x2 = Math.min(b + H, W);
      if (x2 > x1) hatch.push(<line className="sl-burnup__hatch" key={b}
        x1={x1.toFixed(2)} y1={(H - (x1 - b)).toFixed(2)} x2={x2.toFixed(2)} y2={(H - (x2 - b)).toFixed(2)} />);
    }
  }
  const firstPt = lines[0].points.find((v) => Number.isFinite(v))!;
  return (
    <figure className="sl-chart">
      <Title title={title} />
      <div className="sl-line">
        <svg viewBox={`0 0 ${W} ${H}`} role="img">
          <Grid w={W} h={H} />
          <line className="sl-line__axis" x1="0" y1={H} x2={W} y2={H} />
          {xNow !== null && xNow < W && <rect className="sl-burnup__future" x={xNow.toFixed(2)} y="0" width={(W - xNow).toFixed(2)} height={H} />}
          {hatch}
          {Number.isFinite(target) && <line className="sl-line__ref" x1="0" y1={yOf(firstPt).toFixed(2)} x2={W} y2={yOf(target!).toFixed(2)} />}
          {lines.map((s, i) => {
            const pts = s.points.filter((v) => Number.isFinite(v)).map((v, j, arr) => [(j / (arr.length - 1)) * W, yOf(v)] as const);
            const poly = pts.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(' ');
            return (
              <g key={i} style={{ '--c': s.color ?? SERIES[i % SERIES.length] } as Sv}>
                <polygon className="sl-line__area" points={`0,${H} ${poly} ${pts[pts.length - 1][0].toFixed(2)},${H}`} />
                <polyline className="sl-line__path" points={poly} />
                {showDots && pts.map(([x, y], j) => <circle className="sl-line__dot" key={j} cx={x.toFixed(2)} cy={y.toFixed(2)} r="1.4" />)}
              </g>
            );
          })}
          {xNow !== null && <line className="sl-line__now" x1={xNow.toFixed(2)} y1="0" x2={xNow.toFixed(2)} y2={H} />}
        </svg>
        {labels?.length ? <div className="sl-line__labels">{labels.map((l, i) => <span key={i}>{l}</span>)}</div> : null}
      </div>
      {lines.length > 1 && (
        <div className="sl-legend sl-legend--row" style={{ marginTop: '.6em' }}>
          {lines.map((s, i) => (
            <span className="sl-legend__item" key={i}>
              <span className="sl-legend__sw" style={{ '--c': s.color ?? SERIES[i % SERIES.length] } as Sv} />
              <MD t={s.label} className="sl-legend__label" />
            </span>
          ))}
        </div>
      )}
    </figure>
  );
}

/* ── Stacked area — composition over a sequence (cumulative flow) ────────────────── */
export function StackedAreaChart({ series, title, labels, maxValue }:
  { series: LineSeries[]; title?: string; labels?: string[]; maxValue?: number }) {
  const bands = series.filter((s) => Array.isArray(s.points) && s.points.some((v) => Number.isFinite(v)));
  if (!bands.length) return null;
  const len = Math.min(...bands.map((s) => s.points.length));
  if (len < 2) return null;
  const vals = bands.map((s) => Array.from({ length: len }, (_, i) => Math.max(0, Number.isFinite(s.points[i]) ? s.points[i] : 0)));
  const totals = Array.from({ length: len }, (_, i) => vals.reduce((sum, v) => sum + v[i], 0));
  const mx = maxValue || Math.max(...totals) || 1;
  const W = 100, H = 40;
  const xOf = (i: number) => (i / (len - 1)) * W;
  const yOf = (v: number) => H - Math.min(1, v / mx) * H;
  let prev = Array.from({ length: len }, () => 0);
  const groups = bands.map((s, k) => {
    const top = prev.map((p, i) => p + vals[k][i]);
    const upper = top.map((v, i) => `${xOf(i).toFixed(2)},${yOf(v).toFixed(2)}`).join(' ');
    const lower = [...prev].reverse().map((v, ri) => `${xOf(len - 1 - ri).toFixed(2)},${yOf(v).toFixed(2)}`).join(' ');
    prev = top;
    return (
      <g key={k} style={{ '--c': s.color ?? SERIES[k % SERIES.length] } as Sv}>
        <polygon className="sl-area__band" points={`${upper} ${lower}`} />
        <polyline className="sl-area__edge" points={upper} />
      </g>
    );
  });
  return (
    <figure className="sl-chart">
      <Title title={title} />
      <div className="sl-line">
        <svg viewBox={`0 0 ${W} ${H}`} role="img">
          <Grid w={W} h={H} />
          <line className="sl-line__axis" x1="0" y1={H} x2={W} y2={H} />
          {groups}
        </svg>
        {labels?.length ? <div className="sl-line__labels">{labels.map((l, i) => <span key={i}>{l}</span>)}</div> : null}
      </div>
      <div className="sl-legend sl-legend--row" style={{ marginTop: '.6em' }}>
        {bands.map((s, i) => (
          <span className="sl-legend__item" key={i}>
            <span className="sl-legend__sw" style={{ '--c': s.color ?? SERIES[i % SERIES.length] } as Sv} />
            <MD t={s.label} className="sl-legend__label" />
          </span>
        ))}
      </div>
    </figure>
  );
}

/* ── Column — thin vertical bars over hairline gridlines (Linear Insights panel) ── */
export interface ColumnItem { label: string; value?: number; segments?: StackSegment[]; color?: string }
export function ColumnChart({ items, title, maxValue, showValues = true, table = false }:
  { items: ColumnItem[]; title?: string; maxValue?: number; showValues?: boolean; table?: boolean }) {
  const totalOf = (it: ColumnItem) => it.segments?.length
    ? it.segments.reduce((n, s) => n + Math.max(0, s.value || 0), 0)
    : (Number.isFinite(it.value) ? it.value! : null);
  const rows = items.map((it) => [it, totalOf(it)] as const).filter((r): r is [ColumnItem, number] => r[1] !== null);
  if (!rows.length) return null;
  const keys: string[] = [];
  for (const [it] of rows) for (const s of it.segments ?? []) if (!keys.includes(s.label)) keys.push(s.label);
  const segColor = (s: StackSegment) => s.color ?? SERIES[Math.max(0, keys.indexOf(s.label)) % SERIES.length];
  const mx = maxValue || Math.max(...rows.map(([, t]) => t)) || 1;
  return (
    <figure className="sl-chart">
      <Title title={title} />
      <div className="sl-cols-wrap">
        <div className="sl-cols-axis"><span>{fmt(mx)}</span><span>{fmt(mx / 2)}</span><span>0</span></div>
        <div className="sl-cols">
          {rows.map(([it, total], i) => {
            const pct = Math.max(0, Math.min(100, (total / mx) * 100));
            return (
              <div className="sl-col" key={i}>
                {showValues && <span className="sl-col__val">{fmt(total)}</span>}
                {it.segments?.length ? (
                  <span className="sl-col__bar sl-col__bar--stack" style={{ '--v': `${pct.toFixed(1)}%` } as Sv}>
                    {[...it.segments].filter((s) => s.value > 0).map((s, j) => (
                      <span className="sl-col__seg" key={j} title={`${s.label}: ${fmt(s.value)}`}
                        style={{ flexGrow: s.value, '--c': segColor(s) } as Sv} />
                    ))}
                  </span>
                ) : (
                  <span className="sl-col__bar" title={`${it.label}: ${fmt(total)}`}
                    style={{ '--v': `${pct.toFixed(1)}%`, '--c': it.color ?? 'var(--c1)' } as Sv} />
                )}
              </div>
            );
          })}
        </div>
        <div className="sl-cols-labels">{rows.map(([it], i) => <MD t={it.label} title={it.label} key={i} />)}</div>
      </div>
      {keys.length > 0 && (
        <div className="sl-legend sl-legend--row" style={{ marginTop: '.7em' }}>
          {keys.map((k, i) => {
            const first = rows.flatMap(([it]) => it.segments ?? []).find((s) => s.label === k)!;
            return (
              <span className="sl-legend__item" key={i}>
                <span className="sl-legend__sw" style={{ '--c': segColor(first) } as Sv} />
                <MD t={k} className="sl-legend__label" />
              </span>
            );
          })}
        </div>
      )}
      {table && (
        <table className="sl-table sl-chart__table">
          <thead>
            {keys.length
              ? <tr><th />{keys.map((k, i) => <th key={i}>{k}</th>)}<th>Total</th></tr>
              : <tr><th /><th>Value</th></tr>}
          </thead>
          <tbody>
            {rows.map(([it, total], i) => (
              <tr key={i}>
                <td>{it.label}</td>
                {keys.length
                  ? <>{keys.map((k, j) => <td key={j}>{fmt(it.segments?.find((s) => s.label === k)?.value ?? 0)}</td>)}<td>{fmt(total)}</td></>
                  : <td>{fmt(total)}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </figure>
  );
}

/* ── Strip — continuous-axis dot strip per category (Linear issue-age pattern) ──── */
export interface StripItem { label: string; values: number[]; color?: string }
export function StripChart({ items, title, minValue, maxValue, unit = '', showMean = true }:
  { items: StripItem[]; title?: string; minValue?: number; maxValue?: number; unit?: string; showMean?: boolean }) {
  const rows = items.filter((it) => Array.isArray(it.values) && it.values.some((v) => Number.isFinite(v)));
  if (!rows.length) return null;
  const all = rows.flatMap((it) => it.values).filter((v) => Number.isFinite(v));
  const mn = minValue ?? Math.min(...all);
  const mx = maxValue ?? Math.max(...all);
  const span = (mx - mn) || 1;
  const xOf = (v: number) => `${Math.max(0, Math.min(100, ((v - mn) / span) * 100))}%`;
  return (
    <figure className="sl-chart">
      <Title title={title} />
      <div className="sl-dots">
        {rows.map((it, i) => {
          const vals = it.values.filter((v) => Number.isFinite(v));
          const mean = Math.round((vals.reduce((s, v) => s + v, 0) / vals.length) * 10) / 10;
          const c = it.color ?? SERIES[i % SERIES.length];
          return (
            <div className="sl-dot-row" key={i}>
              <MD t={it.label} className="sl-dot-label" title={it.label} />
              <span className="sl-dot-track">
                {vals.map((v, j) => <span className="sl-dot-pt" key={j} style={{ left: xOf(v), '--c': c } as Sv} />)}
                {showMean && <span className="sl-dot-mean" style={{ left: xOf(mean), '--c': c } as Sv} title={`mean ${fmt(mean)}${unit}`} />}
              </span>
              <span className="sl-dot-val">{fmt(mean)}{unit}</span>
            </div>
          );
        })}
      </div>
      <div className="sl-dot-scale"><span /><span className="sl-dot-scale__axis">
        <span>{fmt(mn)}{unit}</span><span>{fmt(mn + (mx - mn) / 2)}{unit}</span><span>{fmt(mx)}{unit}</span>
      </span><span /></div>
    </figure>
  );
}

/* ── Stats — KPI number row (small label · big value · optional sub/delta) ─────── */
export interface StatItem { label: string; value: number | string; sub?: string; color?: string }
export function StatsChart({ items, title }: { items: StatItem[]; title?: string }) {
  const rows = items.filter((it) => it.label?.trim() || (it.value !== undefined && it.value !== null && it.value !== ''));
  if (!rows.length) return null;
  return (
    <figure className="sl-chart">
      <Title title={title} />
      <div className="sl-kpis">
        {rows.map((it, i) => (
          <div className="sl-kpi" key={i}>
            <span className="sl-kpi__label">
              {it.color && <span className="sl-kpi__sw" style={{ '--c': it.color } as Sv} />}
              <MD t={it.label} />
            </span>
            <span className="sl-kpi__val">{typeof it.value === 'number' ? fmt(it.value) : it.value}</span>
            {it.sub && <MD t={it.sub} className="sl-kpi__sub" />}
          </div>
        ))}
      </div>
    </figure>
  );
}

/* ── Progress strip — ONE segmented status bar + a count/% legend ───────────────── */
export interface ProgressStripItem { label: string; value: number; color?: string }
export function ProgressStripChart({ items, title, showValues = true }:
  { items: ProgressStripItem[]; title?: string; showValues?: boolean }) {
  const rows = items.filter((it) => it.value > 0);
  const total = rows.reduce((s, it) => s + it.value, 0);
  if (!rows.length || total <= 0) return null;
  return (
    <figure className="sl-chart">
      <Title title={title} />
      <div className="sl-pstrip">
        {rows.map((it, i) => (
          <span className="sl-pstrip__seg" key={i} title={`${it.label}: ${fmt(it.value)}`}
            style={{ flexGrow: it.value, '--c': seriesColor(i, it.color) } as Sv} />
        ))}
      </div>
      <div className="sl-legend sl-legend--row" style={{ marginTop: '.7em' }}>
        {rows.map((it, i) => (
          <span className="sl-legend__item" key={i}>
            <span className="sl-legend__sw" style={{ '--c': seriesColor(i, it.color) } as Sv} />
            <MD t={it.label} className="sl-legend__label" />
            {showValues && <span className="sl-legend__val">{fmt(it.value)} · {Math.round((it.value / total) * 100)}%</span>}
          </span>
        ))}
      </div>
    </figure>
  );
}

/* ── Sparkline — a compact, label-less trend (filled area) for inline/cell use ──── */
export interface SparklineProps extends HTMLAttributes<HTMLSpanElement> {
  values: number[];
  color?: string;
  /** Fill the area under the line. Default true. */
  fill?: boolean;
  width?: number;
  height?: number;
}
export function Sparkline({ values, color = 'var(--sl-accent)', fill = true, width = 96, height = 28, className, ...rest }: SparklineProps) {
  const pts = values.filter((v) => Number.isFinite(v));
  if (pts.length < 2) return null;
  const mn = Math.min(...pts), mx = Math.max(...pts);
  const span = (mx - mn) || 1;
  const W = 100, H = 32, pad = 2;
  const coords = pts.map((v, i) => [(i / (pts.length - 1)) * W, H - pad - ((v - mn) / span) * (H - pad * 2)] as const);
  const line = coords.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(' ');
  return (
    <span className={`sl-spark${className ? ` ${className}` : ''}`} style={{ width, height }} {...rest}>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" role="img" style={{ '--c': color } as Sv}>
        {fill ? <polygon className="sl-spark__fill" points={`0,${H} ${line} ${W},${H}`} /> : null}
        <polyline className="sl-spark__line" points={line} />
      </svg>
    </span>
  );
}

/* ── ProgressPie — a micro inline pie (value/max) for list rows and table cells ── */
export function ProgressPie({ value, max = 100, color = 'var(--sl-accent)', className, ...rest }:
  { value: number; max?: number; color?: string } & HTMLAttributes<HTMLSpanElement>) {
  const pct = max ? Math.max(0, Math.min(100, (value / max) * 100)) : 0;
  return <span className={`sl-mpie${className ? ` ${className}` : ''}`} role="img" title={`${Math.round(pct)}%`}
    style={{ '--p': pct.toFixed(1), '--c': color } as Sv} {...rest} />;
}
