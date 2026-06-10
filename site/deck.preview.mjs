/**
 * Deck previews — paints the PPTX master template as live HTML slides for the docs site.
 *
 * Reads the SAME deck.data.mjs the python-pptx renderer is generated from (palette, frame,
 * type scale, placeholder samples), so the #/deck pages and the exported .pptx cannot drift.
 * Slides are absolutely-positioned 16:9 stages; all units are cqw (container-query width),
 * 1in = 7.5cqw, so a slide paints correctly at any width (gallery thumbs and full pages).
 * Decks are light-theme only — colours come from the palette hexes, NOT the site theme vars.
 */
import { palette as P, frame as F, type as T, tones as TONES } from '/deck.data.mjs';
import { fonts } from '/tokens.data.mjs';

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
// single-quote the family names — these stacks land inside style="…" attributes
const SANS = fonts.sans.join(',').replace(/"/g, "'");
const MONO = fonts.mono.join(',').replace(/"/g, "'");

const IN = (v) => `${(v * (100 / F.width)).toFixed(3)}cqw`;          // inches → cqw
const PT = (pt) => `${(pt * (100 / F.width) / 72).toFixed(3)}cqw`;   // points → cqw
const W = F.width, H = F.height, M = F.margin;

// absolute box (inches in, cqw out)
const box = (x, y, w, h, extra = '') =>
  `position:absolute;left:${IN(x)};top:${IN(y)};width:${IN(w)};height:${IN(h)};${extra}`;

// role-based text style (mirrors _pptx _run): role from TYPE + per-use overrides
function ts(role, { size, color, bold, italic, align, lh = 1.3 } = {}) {
  const r = T[role] || T.body;
  const sz = size ?? r.size;
  const col = color || P[r.color] || P.ink;
  const weight = (bold ?? r.bold) ? 650 : 400;
  return `font-family:${r.mono ? MONO : SANS};font-size:${PT(sz)};font-weight:${weight};`
    + `color:${col};line-height:${lh};${(italic ? 'font-style:italic;' : '')}${align ? `text-align:${align};` : ''}`;
}

const footer = (title) =>
  `<div style="${box(W - 5.0, H - F.footerH, 4.3, 0.3)}${ts('caption', { size: 9, align: 'right' })}">${esc(title)}</div>`;

const rule = (x, y, w, color = P.accent) =>
  `<div style="${box(x, y, w, 0.049)}background:${color};"></div>`;

// the standard heading band: mono numeral chip + 24pt title + accent rule
function header(num, heading) {
  return `<div style="${box(M, F.headerTop, W - 2 * M, F.headerH)}">
      <span style="${ts('title')}">${num ? `<span style="${ts('num')}">${esc(num)}</span>&ensp;` : ''}${esc(heading || '')}</span>
    </div>` + rule(M + 0.02, F.ruleY, F.ruleW);
}

const bullet = (text, color = P.accent, size = 13, gap = 0.09) =>
  `<div style="display:flex;gap:${IN(0.14)};margin-bottom:${IN(gap)};">
     <span style="${ts('body', { size, color, bold: true })}">•</span>
     <span style="${ts('body', { size })}">${esc(text)}</span></div>`;

const initials = (name) => name.split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase();
const chip = (name, d = 0.34, color = P.accent) =>
  `<span style="display:inline-flex;align-items:center;justify-content:center;flex:none;width:${IN(d)};height:${IN(d)};border-radius:50%;background:${P.accentWeak};${ts('attribution', { size: 10, color, bold: true })}">${esc(initials(name))}</span>`;

/* ── mini chart painters (the kinds the samples use; others get a labelled slot) ── */
function chartBar(ch, x, y, w, h) {
  const cats = ch.categories || [], vals = (ch.values || []).map(Number);
  const mx = Math.max(...vals, 1);
  const rows = cats.map((c, i) => `
    <div style="display:flex;align-items:center;gap:${IN(0.12)};height:${IN(Math.min(h / cats.length, 0.5))};">
      <span style="${ts('body', { size: 11 })}flex:0 0 ${IN(Math.min(1.5, w * 0.34))};overflow:hidden;white-space:nowrap;">${esc(c)}</span>
      <span style="flex:1;height:${IN(0.16)};border-radius:${IN(0.08)};background:${P.surface2};overflow:hidden;">
        <span style="display:block;height:100%;width:${(vals[i] / mx) * 100}%;border-radius:${IN(0.08)};background:${P.series[i % P.series.length]};"></span></span>
      <span style="${ts('body', { size: 10, color: P.muted })}flex:0 0 ${IN(0.4)};">${vals[i]}</span>
    </div>`).join('');
  return `<div style="${box(x, y, w, h)}display:flex;flex-direction:column;justify-content:center;">${rows}</div>`;
}

function chartLine(ch, x, y, w, h) {
  const series = ch.series || [], labels = ch.labels || [];
  const all = series.flatMap((s) => s.points), mx = Math.max(...all, 1), mn = Math.min(...all, 0);
  const vw = 600, vh = 600 * (h / w), pad = 14, lh = 26;
  const px = (i, n) => pad + (i / Math.max(n - 1, 1)) * (vw - 2 * pad);
  const py = (v) => pad + (1 - (v - mn) / (mx - mn || 1)) * (vh - 2 * pad - lh);
  const lines = series.map((s, i) => `<polyline fill="none" stroke="${P.series[i % P.series.length]}" stroke-width="3"
      points="${s.points.map((v, j) => `${px(j, s.points.length)},${py(v)}`).join(' ')}"/>`).join('');
  const dots = series.map((s, i) => s.points.map((v, j) =>
    `<circle cx="${px(j, s.points.length)}" cy="${py(v)}" r="4" fill="${P.series[i % P.series.length]}"/>`).join('')).join('');
  const axis = labels.map((l, j) => `<text x="${px(j, labels.length)}" y="${vh - 6}" text-anchor="middle"
      font-size="11" fill="${P.muted}" font-family="${esc(SANS)}">${esc(String(l))}</text>`).join('');
  const legend = series.length > 1 ? `<div style="display:flex;gap:${IN(0.3)};justify-content:center;">${series.map((s, i) =>
    `<span style="display:flex;align-items:center;gap:${IN(0.08)};${ts('caption', { size: 9, color: P.muted })}">
       <span style="width:${IN(0.13)};height:${IN(0.13)};border-radius:${IN(0.04)};background:${P.series[i % P.series.length]};"></span>${esc(s.label)}</span>`).join('')}</div>` : '';
  return `<div style="${box(x, y, w, h)}display:flex;flex-direction:column;">
      <svg viewBox="0 0 ${vw} ${vh}" style="flex:1;width:100%;">${lines}${dots}${axis}</svg>${legend}</div>`;
}

function chartGauge(ch, x, y, w, h) {
  const items = ch.items || [];
  const tiles = items.map((it, i) => {
    const pct = Math.round(((it.value || 0) / (it.max || 100)) * 100);
    const col = P.series[i % P.series.length];
    return `<div style="display:flex;flex-direction:column;align-items:center;gap:${IN(0.08)};">
      <div style="width:${IN(1.6)};height:${IN(1.6)};border-radius:50%;display:flex;align-items:center;justify-content:center;
        background:conic-gradient(${col} ${pct * 3.6}deg, ${P.surface2} 0);">
        <div style="width:70%;height:70%;border-radius:50%;background:${P.bg};display:flex;align-items:center;justify-content:center;${ts('title', { size: 16 })}">${pct}%</div></div>
      <span style="${ts('kpiLabel')}text-align:center;">${esc(it.label)}</span></div>`;
  }).join('');
  return `<div style="${box(x, y, w, h)}display:flex;align-items:center;justify-content:center;gap:${IN(0.3)};">${tiles}</div>`;
}

function chartSlot(ch, x, y, w, h) {
  if (!ch) return '';
  if (ch.type === 'bar' && ch.categories) return chartBar(ch, x, y, w, h);
  if (ch.type === 'line' && ch.series) return chartLine(ch, x, y, w, h);
  if (ch.type === 'gauge' && ch.items) return chartGauge(ch, x, y, w, h);
  return `<div style="${box(x, y, w, h)}border:1px dashed ${P.line};border-radius:${IN(0.12)};display:flex;align-items:center;justify-content:center;${ts('caption')}">
      native ${esc(ch.type || 'chart')} chart — editable in PowerPoint</div>`;
}

/* ── slide painters — geometry mirrors sonaloop/_pptx.py painter-for-painter ────── */
const PAINTERS = {
  cover(s) {
    return rule(0.92, 2.0, 1.0)
      + `<div style="${box(0.9, 2.15, W - 1.8, 3.4)}">
          <div style="${ts('eyebrow')}letter-spacing:.08em;">${esc((s.eyebrow || '').toUpperCase())}</div>
          <div style="${ts('display', { lh: 1.12 })}margin-top:${IN(0.12)};">${esc(s.title || '')}</div>
          ${s.subtitle ? `<div style="${ts('subtitle', { size: 16 })}margin-top:${IN(0.18)};">${esc(s.subtitle)}</div>` : ''}
        </div>`
      + `<div style="${box(0.9, H - 1.0, W - 1.8, 0.4)}display:flex;justify-content:space-between;align-items:flex-end;">
          <span style="${ts('caption', { size: 11 })}font-family:${MONO};">${esc(s.meta || '')}</span>
          <span style="${ts('caption', { size: 11, color: P.muted })}">${esc(s.date || '')}</span>
        </div>`;
  },

  agenda(s, title) {
    const items = (s.items || []).map((it, i) => `
      <div style="display:flex;align-items:baseline;gap:${IN(0.3)};height:${IN(0.62)};">
        <span style="${ts('num', { size: 14, color: P.accent })}">${String(i + 1).padStart(2, '0')}</span>
        <span style="${ts('lead', { size: 16 })}">${esc(it)}</span>
      </div>`).join('');
    return header('', s.heading || 'Contents')
      + `<div style="${box(0.9, 1.95, W - 1.8, H - 2.9)}">${items}</div>` + footer(title);
  },

  section(s, title) {
    return `<div style="${box(0.85, 1.0, W - 1.8, 2.6)}${ts('bignum', { lh: 1 })}">${esc(s.num || '')}</div>`
      + rule(0.92, 3.95, 0.85)
      + `<div style="${box(0.9, 4.15, W - 1.8, 2.2)}">
          <div style="${ts('display', { size: 32, lh: 1.15 })}">${esc(s.title || '')}</div>
          ${s.subtitle ? `<div style="${ts('subtitle')}margin-top:${IN(0.14)};">${esc(s.subtitle)}</div>` : ''}
        </div>` + footer(title);
  },

  summary(s, title) {
    const n = (s.items || []).length, cols = 2, rows = Math.ceil(n / cols);
    const top = F.contentTop + 0.1; // mirrors _pptx._grid_cells (cards start at 1.75in)
    const gap = 0.25, cw = (W - 2 * M - gap) / 2, chh = (H - top - 0.85 - gap * (rows - 1)) / rows;
    const cells = (s.items || []).map((it, i) => {
      const cx = M + (i % cols) * (cw + gap), cy = top + Math.floor(i / cols) * (chh + gap);
      return `<div style="${box(cx, cy, cw, chh)}background:${P.panel};border:1px solid ${P.line};border-radius:${IN(0.12)};padding:${IN(0.22)} ${IN(0.26)};box-sizing:border-box;">
          <div style="display:flex;gap:${IN(0.14)};align-items:baseline;">
            <span style="display:inline-block;flex:none;width:${IN(0.05)};height:${IN(0.21)};background:${P.accent};border-radius:${IN(0.03)};align-self:center;"></span>
            <span style="${ts('body', { size: 15, bold: true })}">${esc(it.title)}</span></div>
          <div style="${ts('body', { size: 12, color: P.muted })}margin-top:${IN(0.1)};">${esc(it.text)}</div>
        </div>`;
    }).join('');
    return header('', s.heading || 'Executive summary') + cells + footer(title);
  },

  insight(s, title) {
    const tone = TONES[s.tone] || TONES.insight;
    const tc = P[tone.color];
    const hasChart = !!s.chart;
    const bodyW = hasChart ? 6.9 : W - 2 * M;
    return `<div style="${box(M, 0.55, W - 2 * M, 0.4)}${ts('eyebrow', { color: tc })}letter-spacing:.08em;">
        ${esc(tone.label.toUpperCase())}${s.num ? ` <span style="color:${P.faint};">· ${esc(s.num)}</span>` : ''}</div>`
      + `<div style="${box(M, 1.02, 0.055, 1.7)}background:${tc};border-radius:${IN(0.03)};"></div>`
      + `<div style="${box(M + 0.25, 1.05, bodyW - 0.25, 1.75)}${ts('statement', { lh: 1.2 })}">${esc(s.statement || '')}</div>`
      + `<div style="${box(M + 0.25, 2.95, bodyW - 0.25, H - 3.8)}">${(s.support || []).map((t) => bullet(t, tc, 13, 0.14)).join('')}</div>`
      + (hasChart ? chartSlot(s.chart, 7.9, 1.65, 4.7, 4.3) : '')
      + (s.meta ? `<div style="${box(M, H - 0.85, 7, 0.3)}${ts('eyebrow', { size: 11, color: tc })}">${esc(s.meta)}</div>` : '')
      + (s.footnote ? `<div style="${box(M, H - 0.6, W - 2 * M, 0.3)}${ts('caption', { italic: true })}">${esc(s.footnote)}</div>` : '')
      + footer(title);
  },

  quote(s, title) {
    return `<div style="${box(1.5, 1.45, 1.2, 1.2)}font-family:${SANS};font-size:${PT(80)};font-weight:700;color:${P.accentWeak};line-height:1;">“</div>`
      + `<div style="${box(1.9, 2.35, W - 3.8, 2.6)}${ts('quote', { lh: 1.35 })}">${esc(s.text || '')}</div>`
      + `<div style="${box(1.9, 5.45, W - 3.8, 0.6)}display:flex;align-items:center;gap:${IN(0.18)};">
          ${chip(s.attribution || '?')}
          <span style="${ts('attribution')}">${esc(s.attribution || '')}</span>
          <span style="${ts('caption', { size: 11, color: P.muted })}">${esc(s.role || '')}</span>
        </div>` + footer(title);
  },

  voices(s, title) {
    const SENT = { support: P.green, conditional: P.amber, opposed: P.red, neutral: P.muted };
    const items = s.items || [], cols = 2, rows = Math.ceil(items.length / cols);
    const top = F.contentTop + 0.1; // mirrors _pptx._grid_cells (cards start at 1.75in)
    const gap = 0.25, cw = (W - 2 * M - gap) / 2, chh = (H - top - 0.85 - gap * (rows - 1)) / rows;
    const cards = items.map((it, i) => {
      const cx = M + (i % cols) * (cw + gap), cy = top + Math.floor(i / cols) * (chh + gap);
      const sc = SENT[it.sentiment] || P.muted;
      return `<div style="${box(cx, cy, cw, chh)}background:${P.panel};border:1px solid ${P.line};border-radius:${IN(0.12)};padding:${IN(0.18)} ${IN(0.24)};box-sizing:border-box;">
          <div style="display:flex;align-items:center;gap:${IN(0.14)};">
            ${chip(it.name || '?', 0.3)}
            <span style="${ts('attribution')}">${esc(it.name)}</span>
            <span style="${ts('caption', { size: 10, color: P.muted })}">${esc(it.role || '')}</span>
            <span style="margin-left:auto;${ts('eyebrow', { size: 9, color: sc })}letter-spacing:.06em;">${esc((it.sentiment || '').toUpperCase())}</span></div>
          <div style="${ts('body', { size: 12, color: P.ink })}margin-top:${IN(0.12)};">${esc(it.text)}</div>
        </div>`;
    }).join('');
    return header('', s.heading || 'Voices') + cards + footer(title);
  },

  stats(s, title) {
    const items = s.items || [], n = Math.max(items.length, 1);
    const gap = 0.25, tw = (W - 2 * M - gap * (n - 1)) / n, ty = 2.5, th = 2.3;
    const tiles = items.map((it, i) => `
      <div style="${box(M + i * (tw + gap), ty, tw, th)}background:${P.panel};border:1px solid ${P.line};border-radius:${IN(0.12)};padding:${IN(0.24)};box-sizing:border-box;display:flex;flex-direction:column;justify-content:center;">
        <div style="${ts('kpiLabel')}">${esc(it.label)}</div>
        <div style="${ts('kpi', { lh: 1.15 })}margin-top:${IN(0.06)};">${esc(String(it.value))}</div>
        ${it.sub ? `<div style="${ts('caption')}margin-top:${IN(0.08)};">${esc(it.sub)}</div>` : ''}
      </div>`).join('');
    return header('', s.heading || '') + tiles + footer(title);
  },

  chart(s, title) {
    return header(s.num, s.heading)
      + chartSlot(s.chart, M, F.contentTop + 0.15, W - 2 * M, H - F.contentTop - 1.25)
      + (s.footnote ? `<div style="${box(M, H - 0.72, W - 2 * M, 0.4)}${ts('caption', { italic: true })}">${esc(s.footnote)}</div>` : '')
      + footer(title);
  },

  comparison(s, title) {
    const gap = 0.3, cw = (W - 2 * M - gap) / 2, cy = F.contentTop + 0.1, chh = H - cy - 0.85;
    const col = (c, x, accent) => `
      <div style="${box(x, cy, cw, chh)}background:${accent ? P.panel : P.surface2};border:1px solid ${accent ? P.accent : P.line};border-radius:${IN(0.12)};padding:${IN(0.26)} ${IN(0.3)};box-sizing:border-box;">
        <div style="${ts('body', { size: 14, bold: true, color: accent ? P.accent : P.muted })}margin-bottom:${IN(0.18)};">${esc(c.title || '')}</div>
        ${(c.items || []).map((t) => bullet(t, accent ? P.accent : P.faint, 12, 0.13)).join('')}
      </div>`;
    return header('', s.heading) + col(s.left || {}, M, false) + col(s.right || {}, M + cw + gap, true) + footer(title);
  },

  timeline(s, title) {
    const steps = s.steps || [], n = Math.max(steps.length, 1);
    const x0 = 1.0, x1 = W - 1.0, ly = 3.1;
    const items = steps.map((st, i) => {
      const cx = x0 + (i + 0.5) * ((x1 - x0) / n);
      return `<div style="${box(cx - 0.1, ly - 0.1, 0.2, 0.2)}background:${P.accent};border-radius:50%;"></div>
        <div style="${box(cx - 1.3, ly - 0.55, 2.6, 0.3)}${ts('eyebrow', { size: 10 })}text-align:center;letter-spacing:.06em;">${esc((st.label || '').toUpperCase())}</div>
        <div style="${box(cx - 1.3, ly + 0.25, 2.6, 0.5)}${ts('body', { size: 13, bold: true })}text-align:center;">${esc(st.title || '')}</div>
        <div style="${box(cx - 1.3, ly + 0.72, 2.6, 1.4)}${ts('body', { size: 11, color: P.muted })}text-align:center;">${esc(st.text || '')}</div>`;
    }).join('');
    return header('', s.heading || 'Next steps')
      + `<div style="${box(x0, ly - 0.008, x1 - x0, 0.016)}background:${P.line};"></div>` + items + footer(title);
  },

  closing(s, title) {
    return rule(0.92, 2.0, 1.0)
      + `<div style="${box(0.9, 2.2, W - 1.8, 3.6)}">
          <div style="${ts('display', { size: 32 })}">${esc(s.title || '')}</div>
          ${s.text ? `<div style="${ts('subtitle', { size: 14, color: P.ink })}margin-top:${IN(0.22)};max-width:${IN(8.6)};">${esc(s.text)}</div>` : ''}
          ${s.contact ? `<div style="${ts('body', { size: 13, bold: true, color: P.accent })}margin-top:${IN(0.3)};">${esc(s.contact)}</div>` : ''}
        </div>`
      + `<div style="${box(0.9, H - 1.0, W - 1.8, 0.4)}${ts('caption', { size: 10 })}font-family:${MONO};">${esc(s.meta || '')}</div>`;
  },

  content(s, title) {
    const hasVisual = !!(s.chart || s.image !== undefined);
    const bodyW = hasVisual ? 6.5 : W - 2 * M;
    const CAL = { accent: P.accent, green: P.green, amber: P.amber };
    const blocks = (s.blocks || []).map((b) => {
      if (b.type === 'li') return bullet(b.text, P.accent, 13, 0.11);
      if (b.type === 'quote') return `<div style="${ts('body', { size: 15, italic: true, color: P.muted })}margin:${IN(0.08)} 0 ${IN(0.1)};">${esc(b.text)}</div>`;
      if (b.type === 'callout') return `<div style="margin:${IN(0.1)} 0;">
          <span style="${ts('body', { size: 13, bold: true, color: CAL[b.kind] || P.accent })}">${esc(b.label || 'Insight')}&ensp;</span>
          <span style="${ts('body')}">${esc(b.text)}</span></div>`;
      if (b.type === 'h') return `<div style="${ts('body', { size: 15, bold: true })}margin:${IN(0.14)} 0 ${IN(0.05)};">${esc(b.text)}</div>`;
      return `<div style="${ts('body', { size: 14 })}margin-bottom:${IN(0.1)};">${esc(b.text)}</div>`;
    }).join('');
    return header(s.num, s.heading)
      + `<div style="${box(M, F.contentTop, bodyW, H - F.contentTop - 0.9)}">${blocks}</div>`
      + (s.chart ? chartSlot(s.chart, 7.4, F.contentTop, 5.2, 4.5) : '')
      + (s.footnote ? `<div style="${box(M, H - 0.72, W - 2 * M, 0.4)}${ts('caption', { italic: true })}">${esc(s.footnote)}</div>` : '')
      + footer(title);
  },

  image(s, title) {
    const ix = M, iy = 1.7, iw = W - 2 * M, ih = H - iy - 0.95 - (s.caption ? 0.35 : 0);
    const stage = s.image
      ? `<img src="${esc(s.image)}" style="${box(ix, iy, iw, ih)}object-fit:contain;border:1px solid ${P.line};"/>`
      : `<div style="${box(ix, iy, iw, ih)}background:${P.surface2};border:1px dashed ${P.line};border-radius:${IN(0.12)};display:flex;align-items:center;justify-content:center;${ts('caption', { size: 12 })}">image — fitted &amp; centred (placeholder panel when the file is missing)</div>`;
    return header(s.num, s.heading) + stage
      + (s.caption ? `<div style="${box(ix, iy + ih + 0.08, iw, 0.3)}${ts('caption', { size: 10, color: P.muted, align: 'center' })}">${esc(s.caption)}</div>` : '')
      + footer(title);
  },
};

// recommendation/risk are the insight painter with a tone — same aliasing as _pptx.py.
PAINTERS.recommendation = PAINTERS.insight;
PAINTERS.risk = PAINTERS.insight;

/** One slide, painted from its slide dict. `deckTitle` feeds the running footer. */
export function renderDeckSlide(sample, deckTitle = 'Report') {
  const paint = PAINTERS[sample.kind] || PAINTERS.content;
  return `<div class="deck-slide" style="background:${P.bg};">${paint(sample, deckTitle)}</div>`;
}
