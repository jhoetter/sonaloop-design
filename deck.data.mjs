/**
 * Deck master template — the single source of truth for Sonaloop's customer PPTX.
 * Author layouts, palette roles, the type scale and the placeholder content here ONCE;
 * `node scripts/gen-deck.mjs` emits:
 *   py/sonaloop_icons/deck.py    PALETTE / TYPE / FRAME / LAYOUTS / SAMPLE_SLIDES for the
 *                                python-pptx renderer (vendored into the app as sonaloop/_deck.py)
 * and the docs site paints every layout live from this file (site/deck.preview.mjs → #/deck),
 * so the previewed deck and the exported deck can never drift.
 *
 * Each layout's `sample` IS the slide dict `sonaloop/_pptx.render()` accepts — it does triple
 * duty as docs preview content, the renderer's API example, and the demo deck the core renders
 * via `sonaloop template-deck`. Decks are light-theme only (projected/printed surface).
 */
import { inspector } from './tokens.data.mjs';

const L = inspector.light;

// ── Palette roles (hex) — every colour a slide may use, derived from the tokens ──
export const palette = {
  bg: L.bg, panel: L.panel, surface2: L['panel-2'], line: L.line,
  ink: L.ink, muted: L.muted, faint: L.faint,
  accent: L.accent, accentInk: L['accent-ink'], accentWeak: L['accent-weak'],
  green: L.green, amber: L.amber, red: L.red, violet: L.violet, blue: L.blue, skep: L.skep,
  // chart/series order — keep in line with sonaloop/_pptx.py + the DS chart catalogue
  series: [L.accent, L.violet, L.blue, L.green, L.amber, L.red, L.skep],
};

// ── Slide geometry (inches) + the shared frame every layout hangs off ──
export const frame = {
  width: 13.333, height: 7.5,            // 16:9
  margin: 0.7,                           // left/right content margin
  headerTop: 0.5, headerH: 0.9,          // heading band
  ruleY: 1.34, ruleW: 0.85,              // accent rule under the heading
  contentTop: 1.65,                      // body starts here on framed slides
  footerH: 0.42,                         // running footer (deck title, right-aligned)
};

// ── Type scale (pt) — role-based; the deck face is Sona (Geist fallback in PPTX) ──
export const type = {
  eyebrow:    { size: 12, bold: true,  mono: true,  color: 'accent' },
  display:    { size: 40, bold: true,  mono: false, color: 'ink' },     // cover title
  title:      { size: 24, bold: true,  mono: false, color: 'ink' },     // slide heading
  subtitle:   { size: 14, bold: false, mono: false, color: 'muted' },
  lead:       { size: 17, bold: false, mono: false, color: 'ink' },
  statement:  { size: 26, bold: true,  mono: false, color: 'ink' },     // insight headline
  body:       { size: 13, bold: false, mono: false, color: 'ink' },
  quote:      { size: 22, bold: false, mono: false, color: 'ink' },
  attribution:{ size: 12, bold: true,  mono: false, color: 'ink' },
  caption:    { size: 10, bold: false, mono: false, color: 'faint' },
  num:        { size: 16, bold: true,  mono: true,  color: 'faint' },   // section numeral chip
  bignum:     { size: 110, bold: true, mono: true,  color: 'accentWeak' }, // divider numeral
  kpi:        { size: 30, bold: true,  mono: false, color: 'ink' },
  kpiLabel:   { size: 10, bold: false, mono: false, color: 'muted' },
};

// Tones an insight-family slide can carry (mirrors the report's callout cards).
export const tones = {
  insight:        { color: 'accent', label: 'Insight' },
  recommendation: { color: 'green',  label: 'Recommendation' },
  risk:           { color: 'amber',  label: 'Risk' },
};

// ── The placeholder study every sample slide draws from ──
// Fictitious but coherent: one read of the whole master deck tells one story —
// the German eating panel asked "how do busy people eat healthier without effort?".
const STUDY = 'Healthy eating without effort';

// ── The master template: one entry per slide layout, in deck order ────────────────
// key      stable identifier — the renderer's `kind`
// title    docs page title
// desc     what the slide is for (docs lead)
// usage    when to reach for it
// sample   the EXACT slide dict sonaloop/_pptx.render() accepts, with placeholder content
export const layouts = [
  {
    key: 'cover',
    title: 'Cover',
    desc: 'The brand moment — study title, scope line and date. Every customer deck opens here.',
    usage: 'Always the first slide. The eyebrow names the artifact kind (Research Report, Meta-Report); meta carries panel · personas · formats.',
    sample: {
      kind: 'cover',
      eyebrow: 'Research Report',
      title: STUDY,
      subtitle: 'What keeps busy people from eating well — and what would actually change it',
      meta: 'German eating panel · 4 personas · 6 councils · 124 simulated days',
      date: 'June 2026',
    },
  },
  {
    key: 'agenda',
    title: 'Agenda',
    desc: 'Numbered contents derived from the report sections — the reader’s map of the deck.',
    usage: 'Second slide on decks with three or more chapters; skip it for short convergence decks.',
    sample: {
      kind: 'agenda',
      heading: 'Contents',
      items: [
        'Executive summary',
        'Decision fatigue, not knowledge',
        'What the panel already tried',
        'Three product directions',
        'Risks & open questions',
        'Next steps',
      ],
    },
  },
  {
    key: 'section',
    title: 'Section divider',
    desc: 'A breathing-room slide between chapters: oversized numeral, chapter title, one-line framing.',
    usage: 'Open every chapter of a longer deck with one; the numeral matches the agenda position.',
    sample: {
      kind: 'section',
      num: '02',
      title: 'Decision fatigue, not knowledge',
      subtitle: 'Why the 6 pm question defeats every meal plan the panel has tried',
    },
  },
  {
    key: 'summary',
    title: 'Executive summary',
    desc: 'The three or four takeaways a sponsor reads if they read nothing else — each a claim plus one supporting line.',
    usage: 'Directly after the agenda. Keep it to four items; every item should survive being forwarded out of context.',
    sample: {
      kind: 'summary',
      heading: 'Executive summary',
      items: [
        { title: 'The blocker is the 6 pm decision',
          text: 'Every persona knows what healthy means. Plans fail at the moment of deciding tonight’s dinner, when energy is lowest.' },
        { title: 'Plans collapse against real evenings',
          text: 'Meal prep survives Monday and Tuesday, then erodes. By Thursday the panel is improvising — and improvising defaults to takeaway.' },
        { title: 'Low-friction defaults win',
          text: 'A pre-decided weekly menu with a one-tap shopping basket out-performed every willpower-based approach the panel discussed.' },
        { title: 'Budget is the adoption ceiling',
          text: 'Mehmet and Sabine cap any solution near €60/week — defaults that creep past it get abandoned within two weeks.' },
      ],
    },
  },
  {
    key: 'insight',
    title: 'Insight',
    desc: 'One finding stated as a headline, evidence bullets beneath it, an optional supporting chart on the right.',
    usage: 'The workhorse of the findings chapter — one insight per slide, never a list of insights.',
    sample: {
      kind: 'insight',
      tone: 'insight',
      num: '01',
      statement: 'The real bottleneck is deciding at 6 pm — not cooking skill, not nutrition knowledge.',
      support: [
        'All four personas could name a healthy dinner they like; none could say what they’d eat tonight.',
        'In 124 simulated days, the panel skipped cooking on 71% of evenings that started without a plan.',
        'When a plan existed before 4 pm, home cooking held up even on stressful days.',
      ],
      chart: {
        type: 'bar',
        categories: ['Decision fatigue', 'Time to cook', 'Budget pressure', 'Knowledge gap'],
        values: [9, 6, 4, 2],
      },
      footnote: 'Mentions across 6 councils, weighted by vote support.',
    },
  },
  {
    key: 'recommendation',
    title: 'Recommendation',
    desc: 'The green-toned action slide: what to do, why it works, and the effort·impact meta line.',
    usage: 'One per recommended move, ordered by leverage. The meta line mirrors the effort·impact chart.',
    sample: {
      kind: 'recommendation',
      tone: 'recommendation',
      num: '02',
      statement: 'Ship a Sunday default menu: five pre-decided dinners with a one-tap shopping basket.',
      support: [
        'Removes the 6 pm decision entirely — the highest-leverage friction point the study found.',
        'Lena and Tom would pay for it today; Mehmet adopts if the basket stays under €60/week.',
        'Swappable single dinners keep autonomy without reopening the whole decision.',
      ],
      meta: 'Effort 2/5 · Value 5/5 · Quick win',
    },
  },
  {
    key: 'risk',
    title: 'Risk',
    desc: 'The amber-toned counterpart: what could break the recommendation, and the early signal to watch.',
    usage: 'Pair major recommendations with their sharpest risk; name the watch-signal explicitly.',
    sample: {
      kind: 'risk',
      tone: 'risk',
      num: '03',
      statement: 'Budget-constrained personas churn quietly if the default basket creeps past €60 a week.',
      support: [
        'Mehmet treats €60/week as a hard ceiling — one overage and the service is “not for people like me”.',
        'Price creep is invisible in usage metrics until the second skipped week.',
        'Watch-signal: basket edits that only remove items two weeks in a row.',
      ],
      meta: 'Likelihood medium · Impact high',
    },
  },
  {
    key: 'quote',
    title: 'Quote',
    desc: 'One persona voice, large and attributed — the emotional anchor of a chapter.',
    usage: 'Use sparingly: one quote slide per chapter, the line that best compresses the finding.',
    sample: {
      kind: 'quote',
      text: 'I don’t fail at cooking, I fail at deciding. By the time I know what I want to eat, the kebab is faster.',
      attribution: 'Mehmet',
      role: 'Student · budget-constrained · eats out 5×/week',
    },
  },
  {
    key: 'voices',
    title: 'Voices',
    desc: 'The report’s Stimmen panel as a slide: where each persona stands, with sentiment and their key argument.',
    usage: 'After the recommendation it judges — sentiment chips read support / conditional / opposed at a glance.',
    sample: {
      kind: 'voices',
      heading: 'Where the panel stands on the default menu',
      items: [
        { name: 'Lena', role: 'Marketing manager, 34', sentiment: 'support',
          text: 'Would pay from day one — “deciding is the only part of cooking I hate”.' },
        { name: 'Mehmet', role: 'Student, 23', sentiment: 'conditional',
          text: 'In, if the weekly basket stays under €60 and lunch leftovers count.' },
        { name: 'Sabine', role: 'Working mom, 41', sentiment: 'support',
          text: 'Needs kid-safe swaps per dinner; otherwise the default fails on Wednesdays.' },
        { name: 'Tom', role: 'Developer, 29', sentiment: 'opposed',
          text: 'Rejects subscriptions on principle — would only use a free, exportable menu.' },
      ],
    },
  },
  {
    key: 'stats',
    title: 'Stats',
    desc: 'A KPI row — the study (or a finding) in four big numbers with quiet sublines.',
    usage: 'Methodology-in-numbers near the start, or to quantify one chapter’s finding.',
    sample: {
      kind: 'stats',
      heading: 'The study in numbers',
      items: [
        { label: 'Personas', value: 4, sub: 'German eating panel' },
        { label: 'Councils', value: 6, sub: 'incl. 2 red-team rounds' },
        { label: 'Simulated days', value: 124, sub: 'Jan–May 2026' },
        { label: 'Evenings unplanned', value: '71%', sub: 'ended in takeaway or skipping' },
      ],
    },
  },
  {
    key: 'chart',
    title: 'Chart',
    desc: 'A full-width native chart led by its takeaway as the headline — the chart is evidence, the headline is the point.',
    usage: 'When one chart carries the argument. Any design-system chart kind plugs into the slot; charts stay editable in PowerPoint.',
    sample: {
      kind: 'chart',
      num: '02',
      heading: 'Weeknight cooking collapses after Tuesday',
      chart: {
        type: 'line',
        series: [
          { label: 'Home-cooked dinners', points: [86, 74, 61, 48, 42, 55, 63] },
          { label: 'With Sunday default (pilot)', points: [88, 84, 79, 76, 71, 74, 77] },
        ],
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      },
      footnote: 'Share of panel evenings cooked at home, % — 124 simulated days vs. 14-day pilot.',
    },
  },
  {
    key: 'comparison',
    title: 'Comparison',
    desc: 'Two columns, status quo against the proposal — the cleanest way to show what actually changes.',
    usage: 'Before/after, build/buy, segment A/segment B. Two columns only; a third belongs in a content slide table.',
    sample: {
      kind: 'comparison',
      heading: 'Tonight, unaided vs. with a Sunday default',
      left: {
        title: 'Status quo',
        items: [
          '6 pm: open fridge, no plan, low energy',
          '20 minutes of app-scrolling for recipes',
          'Missing one ingredient kills the dish',
          'Default outcome: delivery or skipping',
        ],
      },
      right: {
        title: 'With the default menu',
        items: [
          'Dinner was decided on Sunday',
          'Basket arrived Tuesday — everything’s there',
          'One-tap swap if the day went sideways',
          'Default outcome: the planned meal',
        ],
      },
    },
  },
  {
    key: 'timeline',
    title: 'Timeline',
    desc: 'Next steps as a horizontal sequence — horizon label, step title, one line of substance each.',
    usage: 'The closing chapter of every customer deck: what happens with these findings, and when.',
    sample: {
      kind: 'timeline',
      heading: 'Next steps',
      steps: [
        { label: 'Week 1', title: 'Prototype the default menu',
          text: 'Clickable Sunday-planning flow; five dinners, one-tap basket.' },
        { label: 'Weeks 2–3', title: 'Panel walkthrough',
          text: 'All four personas drive the prototype; measure drop-off per step.' },
        { label: 'Week 4', title: 'Price the basket',
          text: 'Test the €60 ceiling with Mehmet and Sabine head-to-head.' },
        { label: 'Q3', title: 'Live pilot',
          text: '20 households, two weeks, against the cooked-dinner baseline.' },
      ],
    },
  },
  {
    key: 'closing',
    title: 'Closing',
    desc: 'Methodology footnote, where the full evidence lives, and the contact line — the deck’s quiet sign-off.',
    usage: 'Always the last slide. Point to the workspace: the deck summarises, the sessions underneath it are the deliverable.',
    sample: {
      kind: 'closing',
      title: 'Thank you',
      text: 'Built with the Sonaloop research engine: grounded personas, simulated days, structured councils — every statement in this deck traces back to an inspectable session.',
      meta: 'Full report, persona sessions and evidence: Sonaloop workspace · ' + STUDY,
      contact: 'research@sonaloop.dev',
    },
  },
  {
    key: 'content',
    title: 'Content (fallback)',
    desc: 'The general-purpose slide: heading, typed blocks (paragraphs, bullets, quotes, inline callouts), optional chart or image on the right.',
    usage: 'Anything that doesn’t fit a dedicated layout — report sections map here by default.',
    sample: {
      kind: 'content',
      num: '03',
      heading: 'What the panel already tried',
      blocks: [
        { type: 'p', text: 'Every persona has a failed system in the drawer — the pattern is identical: high setup energy, no resilience to one bad day.' },
        { type: 'li', text: 'Lena: Sunday meal prep — abandoned after three weeks (“Sunday became a chore”).' },
        { type: 'li', text: 'Sabine: family meal plan on the fridge — collapses whenever a kid vetoes a dinner.' },
        { type: 'li', text: 'Tom: macro-tracking app — precise, joyless, deleted after a month.' },
        { type: 'callout', kind: 'accent', label: 'Insight', text: 'Systems that demand daily willpower decay; systems that remove decisions persist.' },
      ],
      chart: { type: 'gauge', items: [{ label: 'Systems still in use after 8 weeks', value: 1, max: 7 }] },
      footnote: 'Sources: councils 01–04, day simulations Jan–Mar.',
    },
  },
  {
    key: 'image',
    title: 'Image (fallback)',
    desc: 'A fitted, centred image with caption — prototype screenshots, attached assets, persona avatars.',
    usage: 'One image per slide, fitted and framed; the renderer paints a placeholder panel when the file is missing.',
    sample: {
      kind: 'image',
      num: '04',
      heading: 'Prototype — Sunday planning flow',
      image: null,
      caption: 'Default menu screen: five dinners, one-tap basket, swap affordance per row.',
    },
  },
];

export const deckTitle = STUDY;
