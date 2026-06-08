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
 *   <EffortImpactChart items={[{ label: 'Auto shopping list', x: 2, y: 5 }]} />
 */
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
