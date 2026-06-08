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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Block = { id: string; controls: Control[]; render: (props: any) => ReactElement };

const onOff = (off = 'off', on = 'on'): Opt[] => [{ key: 'off', label: off, value: false }, { key: 'on', label: on, value: true }];
const weight: Control = { prop: 'titleWeight', label: 'weight', options: [{ key: 'normal', label: '400', value: 'normal' }, { key: 'medium', label: '500', value: 'medium' }, { key: 'semibold', label: '600', value: 'semibold' }] };

const BLOCKS: Block[] = [
  // Navbar shown with its mega-menu open, so the mega-menu is visible in the preview (it never
  // appears standalone on the site, so it has no page of its own).
  { id: 'navbar', controls: [], render: () => <div className="pb-64"><Navbar menus={menus} initialOpenKey="solutions" /></div> },
  { id: 'app-card', controls: [], render: () => <div className="measure-frame py-8">{cards}</div> },
  { id: 'related-rail', controls: [], render: () => <div className="measure-frame py-8"><RelatedRail items={railItems} /></div> },
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
  { id: 'footer', controls: [], render: () => <Footer columns={footerColumns} /> },
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

export function renderAll() {
  const out: Record<string, { controls: { prop: string; label: string; options: { key: string; label: string }[] }[]; variants: Record<string, string>; defaultKey: string }> = {};
  for (const b of BLOCKS) {
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
