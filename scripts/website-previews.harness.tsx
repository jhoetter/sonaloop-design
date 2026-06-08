/**
 * Render harness for the docs-site "Website" previews.
 *
 * scripts/gen-website-previews.mjs bundles this with esbuild and calls `renderAll()` — each block
 * is the REAL component from src/website.tsx, server-rendered with realistic demo props, so the
 * docs previews are faithful (no mockups) and can never drift from the shipped components. Links
 * fall back to plain <a> (no SonaloopLinkProvider needed here). Brand canvases resolve to served
 * URLs via the images shim in the build script.
 */
import { renderToStaticMarkup } from 'react-dom/server';
import type { ReactElement } from 'react';
import {
  Navbar,
  MegaMenuPanel,
  Footer,
  Hero,
  CtaBand,
  DEFAULT_CTA,
  RelatedRail,
  CardGrid,
  FeatureCard,
  ProductShot,
  CanvasShowcase,
  IntegrationShowcase,
  Icon,
  type MegaMenu,
  type FooterColumn,
  type RailItem,
} from '../src/website';

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
    promo: {
      eyebrow: 'See it work',
      title: 'A council that pushes back',
      body: 'Watch synthetic customers disagree — with quotes, on the record.',
      cta: { label: 'See a sample report', to: '/sample-report' },
    },
  },
  {
    key: 'methods',
    label: 'Methods',
    to: '/methods',
    columns: [
      {
        heading: 'The craft library',
        items: [
          { to: '/methods/jtbd', label: 'Jobs to be done', description: 'Interview the demand behind the demand.', icon: 'jtbd' },
          { to: '/methods/positioning', label: 'Positioning tests', description: 'Pit messages against each other.', icon: 'positioning' },
        ],
      },
    ],
  },
  {
    key: 'products',
    label: 'Products',
    to: '/products',
    columns: [
      {
        heading: 'The consumption ladder',
        items: [
          { to: '/products/open-core', label: 'Open Core', description: 'Run councils on your own AI, free.', icon: 'open-core' },
          { to: '/products/cloud', label: 'Cloud', description: 'Hosted councils, memory & syntheses.', icon: 'cloud' },
        ],
      },
    ],
  },
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
    <FeatureCard icon={<Icon name="councils" size={28} />} title="Councils" action={{ to: '/products/councils', label: 'Explore' }}>
      Synthetic personas that debate a decision and disagree on the record.
    </FeatureCard>
    <FeatureCard icon={<Icon name="personas" size={28} />} title="Personas" action={{ to: '/products/personas', label: 'Explore' }}>
      Longitudinal profiles grounded in memory — not one-shot prompt characters.
    </FeatureCard>
    <FeatureCard icon={<Icon name="memory" size={28} />} title="Memory" action={{ to: '/products/memory', label: 'Explore' }}>
      A panel that remembers what each persona said before, across sessions.
    </FeatureCard>
  </CardGrid>
);

export const demos: Record<string, ReactElement> = {
  navbar: <Navbar menus={menus} />,
  'mega-menu': (
    <div className="measure-frame pt-2 pb-8">
      <MegaMenuPanel menu={menus[0]} />
    </div>
  ),
  'app-card': <div className="measure-frame py-8">{cards}</div>,
  hero: (
    <Hero
      kicker="Synthetic research"
      title="A focus group that disagrees with you — on the record."
      cta={{ label: 'Install MCP — free', to: '/install' }}
      secondary={{ label: 'See a sample report', to: '/sample-report' }}
    >
      Spin up a deliberative synthetic panel on your own AI. It debates, grounds every objection in lived experience, and runs locally.
    </Hero>
  ),
  'cta-band': <div className="pt-8"><CtaBand {...DEFAULT_CTA} /></div>,
  footer: <Footer columns={footerColumns} cta={false} />,
  'product-showcase': (
    <div className="py-8">
      <ProductShot
        src="/images/canvas/abstract-dark.jpg"
        eyebrow="The deliverable"
        title="A report you can hand to the room."
        body="Every objection grounded in a quote, every verdict on the record — framed as the deliverable, not “our UI”. Pass your own screenshot via the `src` prop."
        caption="Exports to PDF · Markdown"
      />
    </div>
  ),
  'canvas-showcase': (
    <div className="py-8">
      <CanvasShowcase canvasLight="/images/canvas/dawn.jpg" canvasDark="/images/canvas/dusk.jpg" shotLight="/images/canvas/abstract-light.jpg" shotDark="/images/canvas/abstract-dark.jpg" />
    </div>
  ),
  'integration-showcase': (
    <div className="measure-frame py-8">
      <IntegrationShowcase />
    </div>
  ),
  'related-rail': <div className="measure-frame py-8">{<RelatedRail items={railItems} />}</div>,
};

export function renderAll(): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, el] of Object.entries(demos)) out[key] = renderToStaticMarkup(el);
  return out;
}
