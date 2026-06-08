/**
 * Render harness for the docs-site "Website" previews.
 *
 * scripts/gen-website-previews.mjs bundles this with esbuild and calls `renderAll()`. Each block is
 * the REAL component from src/website.tsx, server-rendered with realistic demo props — so previews
 * are faithful (no mockups) and can't drift. Blocks may declare `controls` (enumerated props): every
 * combination is pre-rendered so the docs control bar can swap between them without shipping React.
 */
import { renderToStaticMarkup } from 'react-dom/server';
import type { ReactElement } from 'react';
import {
  Navbar,
  Footer,
  Hero,
  RelatedRail,
  CardGrid,
  FeatureCard,
  ProductShot,
  CanvasShowcase,
  IntegrationShowcase,
  CommandPalettePanel,
  Icon,
  PageSection,
  PageRuler,
  SectionIntro,
  NoteBand,
  CheckRow,
  StepRows,
  FieldList,
  InstallBlock,
  VerdictCard,
  SnippetVerdict,
  SnippetSentiment,
  SnippetMethodPicker,
  SnippetCard,
  PricingCard,
  LadderCard,
  FaqList,
  type MegaMenu,
  type FooterColumn,
  type RailItem,
  type CommandGroup,
} from '../src/website';

/* ── demo data ───────────────────────────────────────────────────────────────────────────── */
const menus: MegaMenu[] = [
  {
    key: 'solutions',
    label: 'Solutions',
    to: '/solutions',
    columns: [
      {
        heading: 'By the job to be done',
        items: [
          { to: '/solutions/continuous-discovery', label: 'Continuous discovery', description: 'Keep an always-on read on what users need.', icon: 'continuous-discovery' },
          { to: '/solutions/pressure-test', label: 'Pressure-test a bet', description: 'Stress a decision before you ship it.', icon: 'pressure-test' },
          { to: '/solutions/positioning', label: 'Positioning', description: 'Find the words that land with a segment.', icon: 'positioning' },
          { to: '/solutions/framing', label: 'Frame the problem', description: 'Turn a fuzzy ask into sharp HMW questions.', icon: 'design-thinking-hmw' },
        ],
      },
    ],
    promo: { eyebrow: 'See it work', title: 'A council that pushes back', body: 'Watch synthetic customers disagree — with quotes, on the record.', cta: { label: 'See a sample report', to: '/sample-report' } },
  },
  { key: 'methods', label: 'Methods', to: '/methods', columns: [{ heading: 'The craft library', items: [{ to: '/methods/jtbd', label: 'Jobs to be done', description: 'Interview the demand behind the demand.', icon: 'jtbd' }, { to: '/methods/positioning', label: 'Positioning tests', description: 'Pit messages against each other.', icon: 'positioning' }] }] },
  { key: 'products', label: 'Products', to: '/products', columns: [{ heading: 'The consumption ladder', items: [{ to: '/products/open-core', label: 'Open Core', description: 'Run councils on your own AI, free.', icon: 'open-core' }, { to: '/products/cloud', label: 'Cloud', description: 'Hosted councils, memory & syntheses.', icon: 'cloud' }] }] },
];

const footerColumns: FooterColumn[] = [
  { heading: 'Product', items: [{ to: '/products/open-core', label: 'Open Core' }, { to: '/products/cloud', label: 'Cloud' }, { to: '/products/research', label: 'Research' }, { to: '/pricing', label: 'Pricing' }] },
  { heading: 'Solutions', items: [{ to: '/solutions/continuous-discovery', label: 'Continuous discovery' }, { to: '/solutions/pressure-test', label: 'Pressure-test a bet' }, { to: '/solutions/positioning', label: 'Positioning' }] },
  { heading: 'Methods', items: [{ to: '/methods/jtbd', label: 'Jobs to be done' }, { to: '/methods', label: 'All methods' }] },
  { heading: 'Company', items: [{ to: '/blog', label: 'Blog' }, { to: '/sample-report', label: 'Sample report' }, { to: '/install', label: 'Install' }] },
];

const railItems: RailItem[] = [
  { to: '/solutions/continuous-discovery', label: 'Continuous discovery', description: 'Keep an always-on read on what users need.', icon: 'continuous-discovery' },
  { to: '/solutions/positioning', label: 'Positioning', description: 'Find the words that land with a segment.', icon: 'positioning' },
  { to: '/solutions/pressure-test', label: 'Pressure-test a bet', description: 'Stress a decision before you ship it.', icon: 'pressure-test' },
];

const cards = (
  <CardGrid>
    <FeatureCard icon={<Icon name="councils" size={28} />} title="Councils" action={{ to: '/products/councils', label: 'Explore' }}>Synthetic personas that debate a decision and disagree on the record.</FeatureCard>
    <FeatureCard icon={<Icon name="personas" size={28} />} title="Personas" action={{ to: '/products/personas', label: 'Explore' }}>Longitudinal profiles grounded in memory — not one-shot prompt characters.</FeatureCard>
    <FeatureCard icon={<Icon name="memory" size={28} />} title="Memory" action={{ to: '/products/memory', label: 'Explore' }}>A panel that remembers what each persona said before, across sessions.</FeatureCard>
  </CardGrid>
);

const pricingCards = (
  <div className="grid gap-5 lg:grid-cols-3 items-start">
    <PricingCard name="Open Core" to="/products/open-core" priceLine="Free · local" icon="open-core" accent="blueprint" features={['Unlimited councils on your own AI', 'Local-first, no PII', 'Auditable transcripts']} cta={{ label: 'Install MCP', to: '/install' }} />
    <PricingCard name="Cloud" to="/products/cloud" priceLine="from €39/mo" icon="cloud" accent="scan" highlight tag="Popular" inherits="Open Core" features={['Hosted councils & memory', 'Team collaboration', 'Semantic recall']} cta={{ label: 'Start free trial', to: '/install' }} />
    <PricingCard name="Research" to="/products/research" priceLine="from €4,500" icon="research" accent="gold" tag="Done-for-you" inherits="Cloud" features={['Managed studies', 'Frontier tracking', 'Meta-reports']} cta={{ label: 'Talk to us', href: '#' }} />
  </div>
);

const ladderCards = (
  <div className="grid gap-5 lg:grid-cols-3 items-start">
    <LadderCard name="Open Core" index={0} icon="open-core" accent="blueprint" priceLine="Free · local" summary="Run councils on your own AI, free." bullets={['Unlimited councils', 'Local-first', 'No API key']} primaryCta={{ label: 'Install MCP', to: '/install' }} learnMoreTo="/products/open-core" />
    <LadderCard name="Cloud" index={1} icon="cloud" accent="scan" priceLine="from €39/mo" summary="Hosted councils, memory & syntheses." bullets={['Team collaboration', 'Semantic recall', 'Governance']} primaryCta={{ label: 'Start trial', to: '/install' }} learnMoreTo="/products/cloud" />
    <LadderCard name="Research" index={2} icon="research" accent="gold" priceLine="from €4,500" summary="The deep design-research surface." bullets={['Managed studies', 'Frontier tracking', 'Meta-reports']} primaryCta={{ label: 'Talk to us', href: '#' }} learnMoreTo="/products/research" />
  </div>
);

// VerdictCard is always rendered in a 3-up grid of card peeks on the site.
const verdictCards = (
  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 items-start">
    <VerdictCard verdict={{ tag: 'objection', quote: 'Per-seat pricing punishes exactly the teams you want expanding. I’d cap it.', persona: 'Marcus Hale', role: 'CFO · scale-up' }} />
    <VerdictCard verdict={{ tag: 'conditional', quote: 'I’d trial it — but only if the export is auditable end to end.', persona: 'Dana Ortiz', role: 'Head of PM' }} />
    <VerdictCard verdict={{ tag: 'stance-shift', quote: 'I came in skeptical; the grounded quotes changed my mind.', persona: 'Priya Nair', role: 'Solo founder' }} />
  </div>
);

// SnippetCard = a feature card with a recessed peek stage (the homepage "why it's different" cells).
const snippetCards = (
  <div className="grid gap-5 md:grid-cols-3">
    <SnippetCard icon={<Icon name="jtbd" size={26} animate />} title="One population, many methods." body="Swap JTBD, pricing, positioning — without rebuilding the panel." to="/methods" linkLabel="All methods" peek={<SnippetMethodPicker />} />
    <SnippetCard icon={<Icon name="check" size={26} animate />} title="Grounded in evidence." body="Every verdict carries the quote behind it — a stance from lived experience, not a vibe." to="/sample-report" linkLabel="See a report" peek={<SnippetVerdict />} />
    <SnippetCard icon={<Icon name="memory" size={26} animate />} title="It remembers — and shifts." body="Bi-temporal memory: who supported, who balked, and what changed their mind." to="/products/open-core" linkLabel="How it works" peek={<SnippetSentiment />} />
  </div>
);

// One "Cards" concept → concrete variants, each a stacked preview + the code below it.
const inStage = (el: ReactElement) => <div className="measure-frame py-8">{el}</div>;
const cardExamples: Example[] = [
  {
    key: 'content', label: 'Content card', render: () => inStage(
      <div className="space-y-8">
        {cards}
        <RelatedRail items={railItems} />
      </div>
    ),
    code: `// ONE ContentCard, two link affordances:\n\n// FeatureCard preset — an inline "action" link (the card itself isn't clickable):\n<CardGrid>\n  <FeatureCard icon={<Icon name="councils" size={28} />} title="Councils"\n    action={{ to: '/products/councils', label: 'Explore' }}>\n    Synthetic personas that debate a decision and disagree on the record.\n  </FeatureCard>\n</CardGrid>\n\n// LinkCard preset — the WHOLE card is the link. RelatedRail is a CardGrid of them:\n<RelatedRail items={[\n  { to: '/solutions/discovery', label: 'Continuous discovery', description: '…', icon: 'continuous-discovery' },\n]} />`,
  },
  {
    key: 'pricing', label: 'Offer card → Pricing preset', render: () => inStage(pricingCards),
    code: `<PricingCard name="Cloud" to="/products/cloud" priceLine="from €39/mo"\n  icon="cloud" accent="scan" highlight tag="Popular" inherits="Open Core"\n  features={['Hosted councils & memory', 'Team collaboration', 'Semantic recall']}\n  cta={{ label: 'Start free trial', to: '/install' }} />`,
  },
  {
    key: 'ladder', label: 'Offer card → Ladder preset', render: () => inStage(ladderCards),
    code: `<LadderCard name="Cloud" index={1} icon="cloud" accent="scan"\n  priceLine="from €39/mo" summary="Hosted councils, memory & syntheses."\n  bullets={['Team collaboration', 'Semantic recall', 'Governance']}\n  primaryCta={{ label: 'Start trial', to: '/install' }} learnMoreTo="/products/cloud" />`,
  },
  {
    key: 'verdict', label: 'Verdict card', render: () => inStage(verdictCards),
    code: `// always rendered in a 3-up CardGrid (the council "proof").\n<VerdictCard verdict={{\n  tag: 'objection',\n  quote: 'Per-seat pricing punishes the teams you want expanding.',\n  persona: 'Marcus Hale', role: 'CFO · scale-up',\n}} />`,
  },
  {
    key: 'snippet', label: 'Snippet card', render: () => inStage(snippetCards),
    code: `// a feature card with a recessed "peek" stage (the homepage "why it's different" cells).\n// The peek is one of the Snippet* widgets (method picker · verdict · sentiment).\n<SnippetCard icon={<Icon name="jtbd" size={26} />} title="One population, many methods."\n  body="Swap JTBD, pricing, positioning — without rebuilding the panel."\n  to="/methods" linkLabel="All methods" peek={<SnippetMethodPicker />} />`,
  },
];

// One "Atoms" concept → concrete instances, each a stacked preview + code.
const atomExamples: Example[] = [
  {
    key: 'checklist', label: 'CheckRow', render: () => inStage(
      <ul className="space-y-2.5 max-w-md">
        <CheckRow>React to a concept in hours, not weeks</CheckRow>
        <CheckRow>Hear objections and disagreement, not a satisfaction score</CheckRow>
        <CheckRow muted>Optional: bring your own avatars</CheckRow>
      </ul>
    ),
    code: `<ul className="space-y-2.5">\n  <CheckRow>React to a concept in hours, not weeks</CheckRow>\n  <CheckRow muted>Optional: bring your own avatars</CheckRow>\n</ul>`,
  },
  {
    key: 'steps', label: 'StepRows', render: () => inStage(
      <StepRows steps={[
        { n: '01', label: 'Persona', desc: 'A longitudinal profile grounded in memory.' },
        { n: '02', label: 'Simulation', desc: 'Personas live out workdays and accumulate experience.' },
        { n: '03', label: 'Council', desc: 'A moderated debate — tension, then convergence.' },
      ]} />
    ),
    code: `<StepRows steps={[\n  { n: '01', label: 'Persona', desc: 'A longitudinal profile grounded in memory.' },\n  { n: '02', label: 'Simulation', desc: 'Personas accumulate experience over time.' },\n]} />`,
  },
  {
    key: 'fields', label: 'FieldList', render: () => inStage(<FieldList className="max-w-xl" items={[{ label: 'Input', value: 'A decision, a concept, or a message', accent: true }, { label: 'Output', value: 'A grounded report with quotes' }]} />),
    code: `<FieldList items={[\n  { label: 'Input', value: 'A decision, a concept, or a message', accent: true },\n  { label: 'Output', value: 'A grounded report with quotes' },\n]} />`,
  },
];

const paletteGroups: CommandGroup[] = [
  { key: 'go', label: 'Jump to', items: [
    { title: 'Solutions', subtitle: '/solutions', to: '/solutions', icon: 'compass' },
    { title: 'Methods', subtitle: '/methods', to: '/methods', icon: 'jtbd' },
    { title: 'Pricing', subtitle: '/pricing', to: '/pricing', icon: 'pricing-research' },
  ] },
  { key: 'products', label: 'Products', accent: 'var(--sl-violet)', items: [
    { title: 'Open Core', subtitle: 'Run councils on your own AI', to: '/products/open-core', icon: 'open-core' },
    { title: 'Cloud', subtitle: 'Hosted councils & memory', to: '/products/cloud', icon: 'cloud' },
    { title: 'Research', subtitle: 'The lab', to: '/products/research', icon: 'research' },
  ] },
  { key: 'methods', label: 'Methods', accent: 'var(--sl-blue)', items: [
    { title: 'Jobs to be done', subtitle: 'Interview the demand', to: '/methods/jtbd', icon: 'jtbd' },
    { title: 'Positioning tests', subtitle: 'Pit messages against each other', to: '/methods/positioning', icon: 'positioning' },
  ] },
];

/* ── blocks (+ optional enumerated controls) ─────────────────────────────────────────────── */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Opt = { key: string; label: string; value: any };
type Control = { prop: string; label: string; options: Opt[] };
// A concept can be shown two ways:
//  • controlled  — one preview + a control bar that swaps prop-combos (e.g. Hero's weight).
//  • examples     — several labelled variants stacked, each with its own preview + code (Tailwind-
//                   Plus style), for distinct concrete instances (e.g. the Card variants).
type Example = { key: string; label: string; render: () => ReactElement; code: string };
type Block =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | { id: string; controls: Control[]; render: (props: any) => ReactElement }
  | { id: string; examples: Example[] };

const onOff = (off = 'off', on = 'on'): Opt[] => [{ key: 'off', label: off, value: false }, { key: 'on', label: on, value: true }];
const weight: Control = { prop: 'titleWeight', label: 'weight', options: [{ key: 'normal', label: '400', value: 'normal' }, { key: 'medium', label: '500', value: 'medium' }, { key: 'semibold', label: '600', value: 'semibold' }] };

const BLOCKS: Block[] = [
  // Navbar shown with its mega-menu open, so the mega-menu is visible in the preview (it never
  // appears standalone on the site, so it has no page of its own).
  { id: 'navbar', controls: [], render: () => <div className="pb-64"><Navbar menus={menus} initialOpenKey="solutions" /></div> },
  // One "Cards" concept, several concrete variants — each stacked as preview + code.
  { id: 'cards', examples: cardExamples },
  {
    id: 'hero',
    controls: [{ prop: 'home', label: 'home', options: onOff() }, weight],
    render: (p) => (
      <Hero kicker="Synthetic research" title="A focus group that disagrees with you — on the record." cta={{ label: 'Install MCP — free', to: '/install' }} secondary={{ label: 'See a sample report', to: '/sample-report' }} {...p}>
        Spin up a deliberative synthetic panel on your own AI. It debates, grounds every objection in lived experience, and runs locally.
      </Hero>
    ),
  },
  // The full site footer = the CTA band + the column nav together (they always ship as a pair;
  // Footer embeds CtaBand via its default `cta`). The standalone CtaBand block documents mid-page use.
  { id: 'footer', controls: [], render: () => <Footer columns={footerColumns} onSearch={() => {}} /> },
  {
    id: 'product-showcase',
    controls: [],
    render: () => (
      <div className="py-8">
        <ProductShot src="/images/canvas/abstract-dark.jpg" eyebrow="The deliverable" title="A report you can hand to the room." body="Every objection grounded in a quote, every verdict on the record — framed as the deliverable, not “our UI”. Pass your own screenshot via the `src` prop." caption="Exports to PDF · Markdown" />
      </div>
    ),
  },
  { id: 'canvas-showcase', controls: [], render: () => <div className="py-8"><CanvasShowcase canvasLight="/images/canvas/dawn.jpg" canvasDark="/images/canvas/dusk.jpg" shotLight="/images/canvas/abstract-light.jpg" shotDark="/images/canvas/abstract-dark.jpg" /></div> },
  { id: 'integration-showcase', controls: [], render: () => <div className="measure-frame py-8"><IntegrationShowcase /></div> },
  { id: 'command-palette', controls: [], render: () => <div className="py-8 px-4"><CommandPalettePanel groups={paletteGroups} inline selectedIndex={0} placeholder="Search Sonaloop…" /></div> },

  // ── Tranche 2 — layout + content + marketing blocks lifted from the site ──
  {
    id: 'layout',
    controls: [],
    render: () => (
      <PageSection spacing="compact">
        <SectionIntro index="01" kicker="How it works" title="One engine. Three ways to consume it." rule>
          A calm section header — a kicker (optional index), a balanced title, and a lead paragraph.
        </SectionIntro>
        <NoteBand>Prices shown are placeholders pending validation — final pricing may change.</NoteBand>
        <PageRuler className="mt-10" labels={['Persona', 'Simulation', 'Synthesis']} />
      </PageSection>
    ),
  },
  // One "Atoms" concept, concrete instances — each stacked as preview + code.
  { id: 'content-atoms', examples: atomExamples },
  { id: 'install-block', controls: [], render: () => <div className="measure-frame py-8"><div className="max-w-2xl"><InstallBlock /></div></div> },
  {
    id: 'faq',
    controls: [],
    render: () => (
      <div className="measure-frame py-8">
        <div className="max-w-2xl">
          <FaqList items={[
            { q: 'Why is local free?', a: 'Your own AI agent writes the text. We sell methodology, collaboration and governance — not tokens.' },
            { q: 'Do I need an API key?', a: 'No, not for the core. Optional only for avatars and semantic recall.' },
            { q: 'Does my data leave my machine?', a: 'Never on the Local plans.' },
          ]} />
        </div>
      </div>
    ),
  },
];

// Cartesian product of the controls' options → [{ key, props }] (key '' when no controls).
function combinations(controls: Control[]) {
  let acc = [{ key: '', props: {} as Record<string, unknown> }];
  for (const c of controls) {
    const next: typeof acc = [];
    for (const a of acc) for (const o of c.options) {
      next.push({ key: a.key ? `${a.key}|${c.prop}:${o.key}` : `${c.prop}:${o.key}`, props: { ...a.props, [c.prop]: o.value } });
    }
    acc = next;
  }
  return acc;
}

type Controlled = { controls: { prop: string; label: string; options: { key: string; label: string }[] }[]; variants: Record<string, string>; defaultKey: string };
type Examples = { examples: { key: string; label: string; html: string; code: string }[] };

export function renderAll() {
  const out: Record<string, Controlled | Examples> = {};
  for (const b of BLOCKS) {
    if ('examples' in b) {
      out[b.id] = { examples: b.examples.map((e) => ({ key: e.key, label: e.label, html: renderToStaticMarkup(e.render()), code: e.code })) };
      continue;
    }
    const combos = combinations(b.controls);
    const variants: Record<string, string> = {};
    for (const { key, props } of combos) variants[key] = renderToStaticMarkup(b.render(props));
    out[b.id] = {
      controls: b.controls.map((c) => ({ prop: c.prop, label: c.label, options: c.options.map((o) => ({ key: o.key, label: o.label })) })),
      variants,
      defaultKey: combos[0].key,
    };
  }
  return out;
}
