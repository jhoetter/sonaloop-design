/**
 * sonaloop-design/website — shared marketing/page-level components.
 *
 * These are the real website blocks (navbar + mega-menu, footer, hero, CTA band, cards, rails,
 * product/integration/canvas showcases), lifted out of the marketing site so they're authored
 * ONCE here and reused across the whole site (and any future surface). They build on the `.sl-*`
 * primitives (sonaloop-design/components) + the shared tokens, exactly like shadcn components:
 * own-the-source TSX, variant/prop-driven, no build step.
 *
 * Two consumer requirements:
 *   1. Load the styles once:  import 'sonaloop-design/components.css'; import 'sonaloop-design/website.css';
 *      (plus your Tailwind build, which emits the utility classes from the shared preset.)
 *   2. Routing is injected, not assumed. Links default to a plain <a href>; a router-based app
 *      wraps its root once with <SonaloopLinkProvider> to get client-side navigation:
 *        <SonaloopLinkProvider value={({ to, ...p }) => <RouterLink to={to} {...p} />}> … </SonaloopLinkProvider>
 *      This keeps the design system free of any router dependency (it's also consumed by SSR).
 */
import { createContext, Fragment, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { AnchorHTMLAttributes, CSSProperties, ReactNode } from 'react';
import { Eyebrow, CopyButton, ThemeToggle, Segmented, Tag, Avatar, Logo, type TagTone } from './components';
import { Icon, type IconKey } from './website-icons';
import { canvas as defaultCanvas, type CanvasPair } from './images';

export { Icon, type IconKey } from './website-icons';

const cx = (...c: Array<string | false | null | undefined>) => c.filter(Boolean).join(' ');

/* Optional heading weight for the big marketing headlines. Static class map (not a dynamic
   `font-${w}` string) so Tailwind can see the literals and emit them. Default `normal` (400)
   matches the inherited weight, so existing call sites are unchanged. */
const TITLE_WEIGHT = { normal: 'font-normal', medium: 'font-medium', semibold: 'font-semibold' } as const;
export type TitleWeight = keyof typeof TITLE_WEIGHT;

/* ── Link adapter ──────────────────────────────────────────────────────────────────────────
   The blocks render every internal link through the injected component, so a react-router app
   gets client-side navigation while the docs site / SSR fall back to a plain anchor. */
export type LinkProps = { to: string; children?: ReactNode } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>;
export type LinkComponent = (props: LinkProps) => ReactNode;

const DefaultLink: LinkComponent = ({ to, ...rest }) => <a href={to} {...rest} />;
const LinkContext = createContext<LinkComponent>(DefaultLink);
export const SonaloopLinkProvider = LinkContext.Provider;
export const useLink = () => useContext(LinkContext);

function L(props: LinkProps) {
  const Link = useLink();
  return <Link {...props} />;
}

/* ── Small shared helpers (from ContentPrimitives / Kicker) ──────────────────────────────── */
export function ArrowGlyph({ className = 'h-3 w-3' }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" stroke="currentColor" strokeWidth={1.5}>
      <line x1="3" y1="8" x2="13" y2="8" />
      <polyline points="9,4 13,8 9,12" />
    </svg>
  );
}

export function ArrowLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <L to={to} className="sl-arrow-link">
      {children}
      <ArrowGlyph />
    </L>
  );
}

const tagTone = {
  default: 'border-line/15 text-ink/35',
  blueprint: 'border-blueprint/30 text-blueprint',
  gold: 'border-gold/30 bg-gold/15 text-ink',
  paper: 'border-paper/10 text-paper/25',
};

export function InlineTag({
  children,
  tone = 'default',
  className = '',
}: {
  children: ReactNode;
  tone?: keyof typeof tagTone;
  className?: string;
}) {
  return (
    <span className={cx('font-mono text-xs tracking-wider rounded-md border px-3 py-1.5', tagTone[tone], className)}>
      {children}
    </span>
  );
}

export function SectionIndex({ n }: { n: string }) {
  return <span className="font-mono text-xs text-ink/25 tracking-wider mr-3">{n}</span>;
}

export function Kicker({ children }: { children: ReactNode }) {
  return (
    <Eyebrow as="p" className="text-xs text-blueprint mb-4">
      {children}
    </Eyebrow>
  );
}

/* ── DrawingFrame — a clean Linear-style card (rounded, hairline, subtle elevation) ───────── */
export function DrawingFrame({
  children,
  className = '',
  code,
  title,
  dark = false,
}: {
  children: ReactNode;
  className?: string;
  code?: string;
  title?: string;
  dark?: boolean;
}) {
  const frameClass = dark
    ? 'border-white/[0.06] bg-[#16171a]'
    : 'border-line/[0.09] bg-paper shadow-[0_1px_2px_rgb(var(--ink)/0.04)]';
  const labelClass = dark ? 'text-ink/45' : 'text-ink/40';
  return (
    <div className={cx('relative z-10 rounded-xl border', frameClass, className)}>
      {(code || title) && (
        <Eyebrow className={cx('absolute right-3 top-3 text-[10px]', labelClass)}>
          {code && <span>{code}</span>}
          {code && title && <span className="mx-2 text-current/40">/</span>}
          {title && <span>{title}</span>}
        </Eyebrow>
      )}
      <div className="relative">{children}</div>
    </div>
  );
}

/* ── FeatureCard + grid ──────────────────────────────────────────────────────────────────── */
/* ── ContentCard — the base content card. Two modes: a feature card (serif title, optional eyebrow
   + action arrow-link) or, when `to` is set, a whole-card LINK (sans label, "Explore" at the
   bottom). FeatureCard and LinkCard are thin presets of it. ──────────────────────────────────── */
export type ContentCardProps = {
  icon?: ReactNode;
  eyebrow?: ReactNode;
  title: ReactNode;
  children?: ReactNode;
  highlight?: boolean;
  className?: string;
  framed?: boolean;
  /** Inline arrow-link (feature mode). */
  action?: { to: string; label: string };
  /** When set, the WHOLE card is a link (link mode); renders `linkLabel` (default "Explore"). */
  to?: string;
  linkLabel?: ReactNode;
};
export function ContentCard({ icon, eyebrow, title, children, highlight = false, className = '', framed = true, action, to, linkLabel = 'Explore' }: ContentCardProps) {
  // Whole-card link mode (the cross-link / related-rail card).
  if (to) {
    return (
      <L to={to} className={cx('group flex flex-col gap-3 rounded-lg border border-line/[0.09] p-5 transition-colors hover:border-blueprint/40 hover:bg-paper-dark/50', className)}>
        {icon && <span className="text-blueprint/65 group-hover:text-blueprint">{icon}</span>}
        <div>
          <p className="font-sans text-sm font-medium text-ink">{title}</p>
          {children && <p className="mt-1 font-sans text-sm text-ink/55 leading-snug">{children}</p>}
        </div>
        <span className="mt-auto sl-arrow-link">{linkLabel}<ArrowGlyph /></span>
      </L>
    );
  }
  // Feature / content mode (serif title, optional eyebrow + action arrow-link).
  const body = (
    <>
      {(icon || eyebrow) && (
        <div className="mb-5 flex items-start justify-between gap-4">
          {icon && <div className={highlight ? 'text-blueprint' : 'text-blueprint/65'}>{icon}</div>}
          {eyebrow && <div className="font-mono text-xs leading-tight tracking-wider text-ink/30">{eyebrow}</div>}
        </div>
      )}
      <h3 className="mb-3 font-serif text-xl text-ink">{title}</h3>
      {children && <div className="font-sans text-sm leading-relaxed text-ink/65">{children}</div>}
      {action && (
        <L to={action.to} className="mt-6 sl-arrow-link">
          {action.label}
          <ArrowGlyph />
        </L>
      )}
    </>
  );
  const classes = cx(
    'group pi-hover min-h-full p-7 transition-all duration-200',
    highlight ? 'border-blueprint/35 bg-blueprint/5' : 'hover:border-blueprint/30 hover:bg-paper-dark/50',
    className,
  );
  return framed ? <DrawingFrame className={classes}>{body}</DrawingFrame> : <div className={cx('rounded-xl border', classes)}>{body}</div>;
}

/** FeatureCard — content-card preset (serif title · optional eyebrow · action arrow-link). */
export function FeatureCard(props: Omit<ContentCardProps, 'to' | 'linkLabel'> & { children: ReactNode }) {
  return <ContentCard {...props} />;
}

/** A simple responsive grid for cards (1 → 2 → 3 columns). */
export function CardGrid({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={cx('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4', className)}>{children}</div>;
}

/* ── Layout primitives (page scaffolding) ────────────────────────────────────────────────── */
/** A hairline section divider (a clean rule; `muted`/`dark` tune the opacity & colour). */
export function RulerDivider({ className = '', muted = false, dark = false }: { className?: string; muted?: boolean; dark?: boolean; labels?: string[] }) {
  const color = dark ? (muted ? 'bg-paper/[0.06]' : 'bg-paper/10') : (muted ? 'bg-line/[0.05]' : 'bg-line/[0.08]');
  return (
    <div className={className} aria-hidden="true">
      <div className={cx('h-px w-full', color)} />
    </div>
  );
}

const SECTION_SPACING = { compact: 'page-section-compact', normal: '', loose: 'page-section-loose' } as const;
/** A vertically-padded page section on the shared measure. */
export function PageSection({ children, id, className = '', spacing = 'normal' }: { children: ReactNode; id?: string; className?: string; spacing?: keyof typeof SECTION_SPACING }) {
  return <section id={id} className={cx('page-section', SECTION_SPACING[spacing], className)}>{children}</section>;
}

/** A full-bleed section divider on the measure (wraps RulerDivider). */
export function PageRuler({ className = '', muted = false, dark = false, labels }: { className?: string; muted?: boolean; dark?: boolean; labels?: string[] }) {
  return <RulerDivider className={cx('measure-frame', className)} muted={muted} dark={dark} labels={labels} />;
}

/** A section header: a kicker (optional index), a balanced serif title, and optional lead copy. */
export function SectionIntro({
  kicker,
  title,
  children,
  index,
  className = '',
  titleClassName = 'font-serif text-3xl sm:text-4xl text-ink tracking-tight text-balance',
  rule = false,
}: {
  kicker: ReactNode;
  title: ReactNode;
  children?: ReactNode;
  index?: string;
  className?: string;
  titleClassName?: string;
  rule?: boolean;
}) {
  return (
    <div className={cx('mb-10 max-w-2xl lg:mb-12', className)}>
      {rule && <div className="mb-4 h-0.5 w-8 bg-gold opacity-70" />}
      <Kicker>
        {index && <SectionIndex n={index} />}
        {kicker}
      </Kicker>
      <h2 className={titleClassName}>{title}</h2>
      {children && <div className="mt-4 font-sans text-sm leading-relaxed text-ink/60 sm:text-base">{children}</div>}
    </div>
  );
}

/** A dashed-border mono note band — quiet asides / fine print. */
export function NoteBand({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={cx('rounded-lg border border-dashed border-line/20 px-8 py-5', className)}>
      <div className="font-mono text-xs leading-relaxed tracking-wider text-ink/40">{children}</div>
    </div>
  );
}

/* ── Content atoms (lists, steps, fields) ────────────────────────────────────────────────── */
/** A checklist row (`muted` swaps the check for a quiet chevron + dimmed text). Use inside a <ul>. */
export function CheckRow({ children, muted = false }: { children: ReactNode; muted?: boolean }) {
  return (
    <li className="flex items-start gap-2.5">
      <svg viewBox="0 0 16 16" className={cx('mt-0.5 h-3.5 w-3.5 flex-shrink-0', muted ? 'text-ink/30' : 'text-blueprint/60')} fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
        {muted ? <polyline points="6,2 10,8 6,14" /> : <polyline points="2,8 6,12 14,4" />}
      </svg>
      <span className={cx('font-sans text-sm leading-snug', muted ? 'text-ink/55' : 'text-ink/65')}>{children}</span>
    </li>
  );
}

/** Numbered process step rows (a bordered stack) — funnel / how-it-works sections. */
export function StepRows({ steps }: { steps: { n: string; label: string; desc: string }[] }) {
  return (
    <div className="space-y-0">
      {steps.map(({ n, label, desc }, i, arr) => (
        <div key={n} className={cx('flex items-start gap-5 p-5 border-x border-t border-line/10', i === arr.length - 1 && 'border-b', 'hover:bg-paper-dark/30 transition-colors duration-150')}>
          <span className="font-mono text-xs text-ink/25 w-5 flex-shrink-0 pt-0.5">{n}</span>
          <div>
            <p className="font-sans text-sm font-medium text-ink mb-0.5">{label}</p>
            <p className="font-sans text-sm text-ink/55">{desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

/** A 2-up label/value grid — spec sheets, “what you get” lists (`accent` tints the label). */
export function FieldList({ items, className = '' }: { items: { label: string; value: ReactNode; accent?: boolean }[]; className?: string }) {
  return (
    <div className={cx('grid gap-5 sm:grid-cols-2', className)}>
      {items.map(({ label, value, accent }) => (
        <div key={label}>
          <Eyebrow as="p" className={cx('mb-2 text-[10px]', accent ? 'text-blueprint' : 'text-ink/35')}>{label}</Eyebrow>
          <div className="font-sans text-sm leading-relaxed text-ink/65">{value}</div>
        </div>
      ))}
    </div>
  );
}

/* ── InstallBlock — the MCP config (Claude · Cursor · Codex tabs + copy) ──────────────────── */
const INSTALL_ENDPOINT = 'https://api.sonaloop.com/mcp';
const INSTALL_CLIENTS: { id: string; label: string; lang: string; code: string }[] = [
  { id: 'claude', label: 'Claude Code', lang: 'shell', code: `claude mcp add sonaloop --scope user --transport http ${INSTALL_ENDPOINT}` },
  { id: 'cursor', label: 'Cursor', lang: '~/.cursor/mcp.json', code: `{\n  "mcpServers": {\n    "sonaloop": { "url": "${INSTALL_ENDPOINT}" }\n  }\n}` },
  { id: 'codex', label: 'Codex', lang: '~/.codex/config.toml', code: `[mcp_servers.sonaloop]\nurl = "${INSTALL_ENDPOINT}"` },
];

export function InstallBlock({ dark = false, className = '' }: { dark?: boolean; className?: string }) {
  const [active, setActive] = useState(INSTALL_CLIENTS[0].id);
  const client = INSTALL_CLIENTS.find((c) => c.id === active)!;
  const isShell = client.lang === 'shell';
  return (
    <div data-theme={dark ? 'dark' : undefined} className={cx('rounded-lg border border-line/12 bg-paper-dark/40 overflow-hidden', className)}>
      <div className="flex flex-wrap items-center gap-3 border-b border-line/10 px-3 py-2.5">
        <Segmented aria-label="MCP client" value={active} onChange={setActive} options={INSTALL_CLIENTS.map((c) => ({ value: c.id, label: c.label }))} />
        <Eyebrow className="ml-auto hidden sm:inline text-[10px] text-ink/40">Set up in under a minute · no API key</Eyebrow>
      </div>
      <div className="flex items-start gap-3 px-4 py-4 sm:px-5 sm:py-5">
        {isShell && <span className="mt-0.5 select-none font-mono text-sm text-blueprint">$</span>}
        <pre className="flex-1 overflow-x-auto whitespace-pre font-mono text-[13px] leading-relaxed text-ink/80"><code>{client.code}</code></pre>
        <CopyButton text={client.code} className="flex-shrink-0" />
      </div>
    </div>
  );
}

/* ── VerdictCard — a persona pull-quote (the "council pushes back" proof) ──────────────────── */
export type Verdict = { tag: string; quote: string; persona: string; role: string };
const VERDICT_WARM = new Set(['objection', 'churn-risk', 'opposed', 'risk']);
const VERDICT_SHIFT = new Set(['stance-shift', 'switching', 'conditional']);
const verdictTone = (tag: string): TagTone => (VERDICT_WARM.has(tag) ? 'warm' : VERDICT_SHIFT.has(tag) ? 'accent' : 'neutral');

export function VerdictCard({ verdict }: { verdict: Verdict }) {
  return (
    <figure className="flex flex-col gap-5 rounded-lg border border-line/[0.09] bg-paper-dark/40 p-6">
      <Tag tone={verdictTone(verdict.tag)} className="self-start">{verdict.tag}</Tag>
      <blockquote className="font-serif text-lg leading-snug text-ink text-balance">“{verdict.quote}”</blockquote>
      <figcaption className="mt-auto font-sans text-sm">
        <span className="font-medium text-ink">{verdict.persona}</span>
        <span className="text-ink/50"> · {verdict.role}</span>
      </figcaption>
    </figure>
  );
}

/* ── Snippets — believable "product peek" UI cards (token-driven, light/dark) ──────────────── */
function SnippetCheck() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 text-blueprint" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3,8 6.5,11.5 13,4.5" />
    </svg>
  );
}

const SNIPPET_METHODS: { label: string; icon: IconKey; active?: boolean }[] = [
  { label: 'Jobs to be done', icon: 'jtbd', active: true },
  { label: 'Positioning tests', icon: 'positioning' },
  { label: 'Continuous discovery', icon: 'continuous-discovery' },
  { label: 'Pressure-test', icon: 'pressure-test' },
];

/** A "pick a method" dropdown — like a model picker, using the real method icons. */
export function SnippetMethodPicker({ items = SNIPPET_METHODS }: { items?: { label: string; icon: IconKey; active?: boolean }[] }) {
  return (
    <div className="rounded-xl border border-line/10 bg-paper p-2 shadow-[0_1px_2px_rgb(var(--ink)/0.05)]">
      <Eyebrow as="p" className="px-2.5 pb-1 pt-1.5 text-[10px] text-ink/40">Method</Eyebrow>
      <ul>
        {items.map((m) => (
          <li key={m.label} className={cx('flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm', m.active ? 'bg-blueprint/10 text-ink' : 'text-ink/70')}>
            <span className="text-blueprint/70"><Icon name={m.icon} size={18} /></span>
            <span className="flex-1 truncate">{m.label}</span>
            {m.active && <SnippetCheck />}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** A verdict card — a persona, a stance, the quote (the small "peek" variant). */
export function SnippetVerdict({
  name = 'Marcus Hale',
  role = 'CFO · scale-up',
  tag = 'objection',
  quote = 'Per-seat pricing punishes exactly the teams you want expanding. I’d cap it.',
}: { name?: string; role?: string; tag?: string; quote?: string } = {}) {
  return (
    <div className="rounded-xl border border-line/10 bg-paper p-4 shadow-[0_1px_2px_rgb(var(--ink)/0.05)]">
      <div className="flex items-center gap-2.5">
        <Avatar name={name} tone="accent" style={{ width: 34, height: 34, fontSize: 34 * 0.34 }} />
        <div className="min-w-0">
          <p className="font-sans text-sm font-medium text-ink leading-tight">{name}</p>
          <p className="font-sans text-xs text-ink/50">{role}</p>
        </div>
        <Tag tone="warm" className="ml-auto">{tag}</Tag>
      </div>
      <p className="mt-3 font-serif text-[15px] leading-snug text-ink/90">“{quote}”</p>
    </div>
  );
}

/** A sentiment bar across the council. */
export function SnippetSentiment({
  segments = [
    { label: 'For', pct: 25, cls: 'bg-blueprint' },
    { label: 'Conditional', pct: 42, cls: 'bg-gold' },
    { label: 'Against', pct: 33, cls: 'bg-ink/30' },
  ],
}: { segments?: { label: string; pct: number; cls: string }[] } = {}) {
  return (
    <div className="rounded-xl border border-line/10 bg-paper p-4 shadow-[0_1px_2px_rgb(var(--ink)/0.05)]">
      <div className="mb-3 flex items-center gap-2">
        <span className="text-blueprint/70"><Icon name="analytics" size={16} /></span>
        <Eyebrow as="p" className="text-[10px] text-ink/45">Sentiment across the council</Eyebrow>
      </div>
      <div className="flex h-2.5 w-full overflow-hidden rounded-full border border-line/5">
        {segments.map((s) => <div key={s.label} className={s.cls} style={{ width: `${s.pct}%` }} />)}
      </div>
      <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1">
        {segments.map((s) => <span key={s.label} className="font-mono text-[11px] text-ink/50">{s.label} {s.pct}%</span>)}
      </div>
    </div>
  );
}

/* ── SnippetCard — a feature card whose recessed footer "stage" holds a product peek (one of the
   Snippet* widgets above). The "why it's different" cells on the homepage are these. ─────────── */
export function SnippetCard({ icon, title, body, peek, to, linkLabel }: { icon?: ReactNode; title: ReactNode; body?: ReactNode; peek: ReactNode; to?: string; linkLabel?: ReactNode }) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-line/10 bg-paper">
      <div className="p-6">
        {icon && <span className="mb-4 inline-flex text-blueprint/70">{icon}</span>}
        <h3 className="font-serif text-xl text-ink mb-1.5">{title}</h3>
        {body && <p className="font-sans text-sm text-ink/60 leading-relaxed">{body}</p>}
        {to && <div className="mt-4"><ArrowLink to={to}>{linkLabel}</ArrowLink></div>}
      </div>
      <div className="flex flex-1 flex-col justify-center border-t border-line/10 bg-paper-dark p-5 sm:p-6">
        {peek}
      </div>
    </div>
  );
}

/* ── FAQ list — a divide-y Q/A stack ─────────────────────────────────────────────────────── */
export type FaqItem = { q: string; a: ReactNode };
export function FaqList({ items, className = '' }: { items: FaqItem[]; className?: string }) {
  return (
    <div className={cx('divide-y divide-line/10 border-y border-line/10', className)}>
      {items.map((f) => (
        <div key={f.q} className="py-5">
          <p className="font-sans text-sm font-medium text-ink mb-1.5">{f.q}</p>
          <p className="font-sans text-sm text-ink/60 leading-relaxed">{f.a}</p>
        </div>
      ))}
    </div>
  );
}

/* ── Accent system — per-product tonal identity (rules, tints, CTAs). Full static class
   strings so Tailwind keeps them. Used by the pricing / ladder cards. ─────────────────────── */
export type Accent = 'blueprint' | 'scan' | 'gold';
export type AccentClasses = { rule: string; icon: string; softBg: string; softBorder: string; ctaSolid: string; text: string };
const ACCENTS: Record<Accent, AccentClasses> = {
  blueprint: { rule: 'bg-blueprint', icon: 'text-blueprint', softBg: 'bg-blueprint/5', softBorder: 'border-blueprint/30', ctaSolid: 'bg-blueprint text-paper hover:bg-blueprint-deep', text: 'text-blueprint' },
  scan: { rule: 'bg-scan', icon: 'text-blueprint', softBg: 'bg-scan/10', softBorder: 'border-scan/40', ctaSolid: 'bg-blueprint text-paper hover:bg-blueprint-deep', text: 'text-blueprint' },
  gold: { rule: 'bg-gold', icon: 'text-gold', softBg: 'bg-gold/[0.06]', softBorder: 'border-gold/30', ctaSolid: 'bg-gold/90 text-ink hover:bg-gold', text: 'text-ink' },
};
export const accentClasses = (accent: Accent): AccentClasses => ACCENTS[accent];

const CARD_CTA = 'inline-flex w-full items-center justify-center gap-2 rounded-md px-5 py-3 font-sans text-sm font-medium transition-colors';
const CARD_CTA_OUTLINE = 'border border-line/20 text-ink hover:border-blueprint hover:text-blueprint';
export type CardCta = { to?: string; href?: string; label: string };

/* ── OfferCard — the one parameterized "offer" card (accent bar · icon · header · price · body ·
   CheckRow bullets · CTA). PricingCard & LadderCard are thin presets over it. The right-hand
   header slot is a pricing `tag` or a ladder `index` eyebrow; the body is a `summary` paragraph
   and/or an `inherits` line. `highlight` tints the card + solidifies the CTA; `solidCta`
   solidifies the CTA alone (e.g. the gold ladder tier). ──────────────────────────────────── */
export type OfferCardProps = {
  name: string;
  to?: string;
  priceLine?: ReactNode;
  icon?: IconKey;
  accent?: Accent;
  index?: number;
  tag?: string;
  inherits?: string;
  summary?: ReactNode;
  bullets: string[];
  highlight?: boolean;
  solidCta?: boolean;
  cta: CardCta;
  learnMoreTo?: string;
  size?: 'md' | 'lg';
};
export function OfferCard({ name, to, priceLine, icon, accent = 'blueprint', index, tag, inherits, summary, bullets, highlight = false, solidCta, cta, learnMoreTo, size = 'md' }: OfferCardProps) {
  const acc = accentClasses(accent);
  const lg = size === 'lg';
  const ctaClass = (solidCta ?? highlight) ? acc.ctaSolid : CARD_CTA_OUTLINE;
  const nameCls = cx('font-serif text-ink', lg ? 'text-2xl' : 'text-xl');
  return (
    <DrawingFrame className={cx('group flex flex-col transition-all duration-200', lg ? 'p-8' : 'p-7', highlight ? 'border-blueprint/35 bg-blueprint/5' : cx('hover:border-blueprint/30', lg ? 'hover:bg-paper-dark/40' : 'hover:bg-paper-dark/50'))}>
      <div className={cx(lg ? '-mt-8 -mx-8 mb-7' : '-mt-7 -mx-7 mb-6', 'h-1', acc.rule)} aria-hidden="true" />
      <div className={cx('flex items-start justify-between', lg ? 'mb-6 gap-4' : 'mb-5 gap-3')}>
        <div className={highlight ? acc.icon : cx(acc.icon, 'opacity-80')}>{icon && <Icon name={icon} size={lg ? 44 : 34} animate />}</div>
        {index !== undefined && <Eyebrow className="text-[10px] text-ink/30">{`0${index + 1}`}</Eyebrow>}
        {tag && <Tag>{tag}</Tag>}
      </div>
      {to
        ? <L to={to} className={cx(nameCls, 'hover:text-blueprint transition-colors')}>{name}</L>
        : <h3 className={nameCls}>{name}</h3>}
      {priceLine && <p className="mt-1.5 font-mono text-sm tracking-wide text-ink/45">{priceLine}</p>}
      {summary && <p className="mt-4 font-sans text-sm text-ink/65 leading-relaxed">{summary}</p>}
      <div className={cx('h-px w-full bg-ink/10', lg ? 'my-6' : 'my-5')} />
      {inherits && <p className="mb-3 font-sans text-xs text-ink/45">Everything in <span className="text-ink/70">{inherits}</span>, plus:</p>}
      <ul className={cx('flex-1', lg ? 'space-y-3' : 'space-y-2.5')}>{bullets.map((b) => <CheckRow key={b}>{b}</CheckRow>)}</ul>
      <div className={cx('flex flex-col gap-3', lg ? 'mt-6' : 'mt-7')}>
        {cta.href
          ? <a href={cta.href} className={cx(CARD_CTA, ctaClass)}>{cta.label}<ArrowGlyph /></a>
          : <L to={cta.to ?? '#'} className={cx(CARD_CTA, ctaClass)}>{cta.label}<ArrowGlyph /></L>}
        {learnMoreTo && <L to={learnMoreTo} className="sl-arrow-link justify-center">Learn more<ArrowGlyph /></L>}
      </div>
    </DrawingFrame>
  );
}

/* PricingCard — pricing-tier preset of OfferCard (tag · "inherits" · highlight). */
export type PricingCardProps = { name: string; to?: string; priceLine: ReactNode; icon?: IconKey; accent?: Accent; inherits?: string; features: string[]; highlight?: boolean; tag?: string; cta: CardCta };
export function PricingCard({ features, ...p }: PricingCardProps) {
  return <OfferCard size="md" bullets={features} {...p} />;
}

/* LadderCard — product "consumption ladder" preset of OfferCard (index · summary · learn-more). */
export type LadderCardProps = { name: string; index: number; icon?: IconKey; accent?: Accent; priceLine: ReactNode; summary: ReactNode; bullets: string[]; primaryCta: CardCta; learnMoreTo?: string };
export function LadderCard({ primaryCta, accent = 'blueprint', ...p }: LadderCardProps) {
  return <OfferCard size="lg" accent={accent} cta={primaryCta} solidCta={accent === 'gold'} {...p} />;
}

/* ── LinkCard — the cross-link card variant (whole card is a link: icon · label · desc · arrow) ── */
export type RailItem = { to: string; label: string; description?: string; icon?: IconKey };

/** LinkCard — content-card preset where the whole card is a link (icon · label · desc · "Explore"). */
export function LinkCard({ to, label, description, icon }: RailItem) {
  return (
    <ContentCard to={to} icon={icon && <Icon name={icon} size={28} animate />} title={label}>
      {description}
    </ContentCard>
  );
}

/** RelatedRail — a CardGrid of LinkCards (the IA cross-link rail). */
export function RelatedRail({ items }: { items: RailItem[] }) {
  return <CardGrid>{items.map((it) => <LinkCard key={it.to + it.label} {...it} />)}</CardGrid>;
}

/* ── Navbar + mega-menu ──────────────────────────────────────────────────────────────────── */
export type MenuItem = { to: string; label: string; description?: string; icon?: IconKey };
export type MenuColumn = { heading?: string; items: MenuItem[] };
export type MenuPromo = {
  eyebrow: string;
  title: string;
  body: string;
  cta: { label: string; to?: string; href?: string };
};
export type MegaMenu = {
  key: string;
  label: string;
  to: string;
  columns: MenuColumn[];
  promo?: MenuPromo;
};

type NavLinkSpec = { to: string; label: string };

export interface NavbarProps {
  menus: MegaMenu[];
  /** Current route path, for active-state highlighting (the app passes useLocation().pathname). */
  currentPath?: string;
  transparent?: boolean;
  forceDark?: boolean;
  brand?: NavLinkSpec;
  pricing?: NavLinkSpec;
  secondaryLink?: NavLinkSpec;
  primaryCta?: NavLinkSpec;
  /** Initial open mega-menu key — mainly for SSR/previews/tests that want the panel shown. */
  initialOpenKey?: string | null;
}

export function Navbar({
  menus,
  currentPath = '',
  transparent = false,
  forceDark = false,
  brand = { to: '/', label: 'Sonaloop' },
  pricing = { to: '/pricing', label: 'Pricing' },
  secondaryLink = { to: '/sample-report', label: 'Sample report' },
  primaryCta = { to: '/install', label: 'Install MCP' },
  initialOpenKey = null,
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [openKey, setOpenKey] = useState<string | null>(initialOpenKey);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close everything on navigation.
  useEffect(() => {
    setMobileOpen(false);
    setOpenKey(null);
  }, [currentPath]);

  useEffect(() => {
    if (!transparent) return;
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [transparent]);

  // Hover-intent: a short close delay lets the cursor travel into the panel.
  const open = (key: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenKey(key);
  };
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenKey(null), 120);
  };

  const solid = !transparent || scrolled || openKey !== null;
  const navBase = forceDark
    ? 'bg-[#101113] border-b border-[#23252a]'
    : solid
      ? 'bg-paper/95 backdrop-blur-sm border-b border-line/10'
      : 'border-b border-ink/0';
  const positionCls = transparent ? 'fixed inset-x-0 top-0' : 'sticky top-0';
  const triggerCls = (active: boolean) =>
    `font-sans text-[13px] transition-colors hover:text-blueprint ${active ? 'text-blueprint' : 'text-ink/65'}`;

  return (
    <nav
      className={cx(positionCls, 'z-50', navBase)}
      data-theme={forceDark ? 'dark' : undefined}
      onMouseLeave={scheduleClose}
    >
      <div className="measure-frame">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <L to={brand.to} className="pi-hover group w-fit">
            <Logo label={brand.label} />
          </L>

          {/* Desktop: mega-menu triggers */}
          <div className="hidden lg:flex items-center gap-1">
            {menus.map((menu) => {
              const active = openKey === menu.key || (currentPath !== '' && currentPath.startsWith(menu.to));
              return (
                <div key={menu.key} className="relative" onMouseEnter={() => open(menu.key)}>
                  <L to={menu.to} className={cx('flex items-center gap-1 px-3 py-2', triggerCls(active))} aria-expanded={openKey === menu.key}>
                    {menu.label}
                    <Caret open={openKey === menu.key} />
                  </L>
                </div>
              );
            })}
            <L to={pricing.to} className={cx('px-3 py-2', triggerCls(currentPath === pricing.to))}>
              {pricing.label}
            </L>

            <div className="w-px h-4 self-center bg-ink/15 mx-2" aria-hidden="true" />

            <L to={secondaryLink.to} className="font-sans text-[13px] text-ink/65 px-3 py-2 transition-colors hover:text-blueprint">
              {secondaryLink.label}
            </L>
            <L to={primaryCta.to} className="ml-1 sl-btn sl-btn--primary text-[13px]">
              {primaryCta.label}
              <ArrowGlyph className="h-3 w-3" />
            </L>
          </div>

          {/* Mobile: hamburger */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="lg:hidden p-2 text-ink"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
              {mobileOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="4" y1="6" x2="20" y2="6" />
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <line x1="4" y1="18" x2="20" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Desktop mega panel */}
      {openKey && (
        <div className="hidden lg:block absolute inset-x-0 top-16 z-50" onMouseEnter={() => open(openKey)} onMouseLeave={scheduleClose}>
          <div className="measure-frame">
            <MegaMenuPanel menu={menus.find((m) => m.key === openKey)!} />
          </div>
        </div>
      )}

      {/* Mobile menu */}
      {mobileOpen && <MobileMenu menus={menus} pricing={pricing} secondaryLink={secondaryLink} primaryCta={primaryCta} currentPath={currentPath} />}
    </nav>
  );
}

function Caret({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 16 16" className={cx('h-3 w-3 transition-transform duration-200', open && 'rotate-180')} fill="none" stroke="currentColor" strokeWidth={1.5}>
      <polyline points="4,6 8,10 12,6" />
    </svg>
  );
}

export function MegaMenuPanel({ menu }: { menu: MegaMenu }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] rounded-b-xl border-x border-b border-line/12 bg-paper shadow-[0_24px_60px_rgb(var(--ink)/0.12)] overflow-hidden">
      {/* Items */}
      <div className="p-5 sm:p-6">
        {menu.columns.map((col) => (
          <div key={col.heading ?? 'col'}>
            {col.heading && (
              <Eyebrow as="p" className="text-[10px] text-ink/35 mb-3 px-2">
                {col.heading}
              </Eyebrow>
            )}
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1">
              {col.items.map((item) => (
                <li key={item.to}>
                  <L to={item.to} className="group flex items-start gap-3 rounded-sm px-2 py-2.5 transition-colors hover:bg-paper-dark/50">
                    {item.icon && (
                      <span className="mt-0.5 text-blueprint/65 group-hover:text-blueprint">
                        <Icon name={item.icon} size={22} />
                      </span>
                    )}
                    <span className="min-w-0">
                      <span className="block font-sans text-sm font-medium text-ink">{item.label}</span>
                      {item.description && <span className="block font-sans text-xs leading-snug text-ink/55">{item.description}</span>}
                    </span>
                  </L>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Promo card */}
      {menu.promo && (
        <div className="relative border-t lg:border-t-0 lg:border-l border-line/10 bg-paper-dark/40 p-6 flex flex-col justify-between">
          <div>
            <Eyebrow as="p" className="text-[10px] text-blueprint mb-3">
              {menu.promo.eyebrow}
            </Eyebrow>
            <p className="font-serif text-xl text-ink leading-tight mb-2">{menu.promo.title}</p>
            <p className="font-sans text-sm text-ink/60 leading-relaxed">{menu.promo.body}</p>
          </div>
          <PromoCta cta={menu.promo.cta} />
        </div>
      )}
    </div>
  );
}

function PromoCta({ cta }: { cta: { label: string; to?: string; href?: string } }) {
  const cls = 'mt-5 inline-flex items-center gap-2 font-sans text-sm font-medium text-blueprint transition-all hover:gap-3';
  return cta.to ? (
    <L to={cta.to} className={cls}>
      {cta.label}
      <ArrowGlyph />
    </L>
  ) : (
    <a href={cta.href} className={cls}>
      {cta.label}
      <ArrowGlyph />
    </a>
  );
}

function MobileMenu({
  menus,
  pricing,
  secondaryLink,
  primaryCta,
  currentPath,
}: {
  menus: MegaMenu[];
  pricing: NavLinkSpec;
  secondaryLink: NavLinkSpec;
  primaryCta: NavLinkSpec;
  currentPath: string;
}) {
  return (
    <div className="lg:hidden bg-paper border-t border-line/10 max-h-[80vh] overflow-y-auto">
      <div className="measure-frame py-4 flex flex-col gap-5">
        {menus.map((menu) => (
          <div key={menu.key}>
            <L to={menu.to} className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink/40">
              {menu.label}
            </L>
            <ul className="mt-2 flex flex-col">
              {menu.columns.flatMap((c) => c.items).map((item) => {
                const active = currentPath === item.to;
                return (
                  <li key={item.to}>
                    <L
                      to={item.to}
                      className={cx('flex items-center gap-2.5 py-2.5 font-sans text-sm border-b border-line/[0.06]', active ? 'text-blueprint font-medium' : 'text-ink/70')}
                    >
                      {item.icon && <Icon name={item.icon} size={18} className="text-blueprint/60" />}
                      {item.label}
                    </L>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
        <L to={pricing.to} className={cx('font-sans text-sm py-2', currentPath === pricing.to ? 'text-blueprint font-medium' : 'text-ink/70')}>
          {pricing.label}
        </L>
        <div className="flex flex-col gap-2 pt-1">
          <L to={secondaryLink.to} className="sl-btn text-sm w-full justify-center">
            {secondaryLink.label}
          </L>
          <L to={primaryCta.to} className="sl-btn sl-btn--primary text-sm w-full justify-center">
            {primaryCta.label}
          </L>
        </div>
      </div>
    </div>
  );
}

/* ── Hero ────────────────────────────────────────────────────────────────────────────────── */
type HeroCta = { to?: string; href?: string; label: string };

const canvasFade = {
  WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.85), transparent 72%)',
  maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.85), transparent 72%)',
} as const;

function HeroButton({ cta, variant }: { cta: HeroCta; variant: 'primary' | 'secondary' }) {
  const base = cx('sl-btn sl-btn--lg text-sm', variant === 'primary' && 'sl-btn--primary');
  if (cta.to) return <L to={cta.to} className={base}>{cta.label}</L>;
  return (
    <a href={cta.href} className={base}>
      {cta.label}
    </a>
  );
}

export interface HeroProps {
  kicker: string;
  title: ReactNode;
  children: ReactNode;
  cta?: HeroCta;
  secondary?: HeroCta;
  home?: boolean;
  titleClassName?: string;
  titleWeight?: TitleWeight;
  canvas?: CanvasPair;
}

export function Hero({ kicker, title, children, cta, secondary, home = false, titleClassName = 'font-serif', titleWeight = 'normal', canvas }: HeroProps) {
  const titleSize = home
    ? 'text-5xl sm:text-6xl lg:text-7xl leading-[1.04]'
    : 'text-4xl sm:text-5xl lg:text-6xl leading-[1.07]';
  return (
    <div className="page-section page-section-loose w-full relative isolate overflow-hidden">
      {canvas && (
        <div className="absolute inset-0 -z-10 select-none pointer-events-none" aria-hidden="true">
          <img src={canvas.light} alt="" className="absolute inset-0 h-full w-full object-cover opacity-[0.45] dark:hidden" style={canvasFade} />
          <img src={canvas.dark} alt="" className="absolute inset-0 hidden h-full w-full object-cover opacity-50 dark:block" style={canvasFade} />
        </div>
      )}
      <Eyebrow as="p" className="mb-5 text-xs text-ink/45">
        {kicker}
      </Eyebrow>
      <h1 className={cx(titleClassName, TITLE_WEIGHT[titleWeight], titleSize, 'max-w-4xl tracking-tight text-ink text-balance')}>{title}</h1>
      <div className="mt-6 max-w-xl font-sans text-lg leading-relaxed text-ink/65">{children}</div>
      {(cta || secondary) && (
        <div className="mt-9 flex flex-wrap items-center gap-3">
          {cta && <HeroButton cta={cta} variant="primary" />}
          {secondary && <HeroButton cta={secondary} variant="secondary" />}
        </div>
      )}
    </div>
  );
}

/* ── CTA band ────────────────────────────────────────────────────────────────────────────── */
export type CtaLink = { label: string; to?: string; href?: string };
export type CtaBandProps = {
  eyebrow?: string;
  title: ReactNode;
  body?: ReactNode;
  primary: CtaLink;
  secondary?: CtaLink;
  titleWeight?: TitleWeight;
};

/** The default site CTA (dual: install ⇄ sample report). */
export const DEFAULT_CTA: CtaBandProps = {
  eyebrow: 'Bring your own AI',
  title: 'Run a council that pushes back.',
  body:
    'One config block, no API key. Spin up a synthetic focus group on your own Claude Code, Cursor or Codex — and watch it disagree with you, on the record.',
  primary: { label: 'Install MCP — free', to: '/install' },
  secondary: { label: 'See a sample report', to: '/sample-report' },
};

function CtaButton({ cta, variant }: { cta: CtaLink; variant: 'primary' | 'secondary' }) {
  const base = cx('sl-btn sl-btn--lg text-sm', variant === 'primary' && 'sl-btn--primary');
  if (cta.to) return <L to={cta.to} className={base}>{cta.label}</L>;
  return (
    <a href={cta.href} className={base}>
      {cta.label}
    </a>
  );
}

export function CtaBand({ eyebrow, title, body, primary, secondary, titleWeight = 'normal' }: CtaBandProps) {
  return (
    <div className="relative z-20 measure-frame">
      <div className="bg-paper-dark/40 border-x border-t border-line/[0.08] rounded-t-xl px-6 sm:px-8 lg:px-12">
        <div className="py-16 text-center">
          {eyebrow && (
            <Eyebrow as="p" className="text-xs text-ink/45 mb-5">
              {eyebrow}
            </Eyebrow>
          )}
          <h2 className={cx('font-serif', TITLE_WEIGHT[titleWeight], 'text-4xl sm:text-5xl lg:text-6xl text-ink tracking-tight mb-6 text-balance')}>{title}</h2>
          {body && <p className="font-sans text-base sm:text-lg text-ink/60 leading-relaxed mb-10 max-w-xl mx-auto">{body}</p>}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <CtaButton cta={primary} variant="primary" />
            {secondary && <CtaButton cta={secondary} variant="secondary" />}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Footer ──────────────────────────────────────────────────────────────────────────────── */
export type FooterColumn = { heading: string; items: { to: string; label: string }[] };

export interface FooterProps {
  columns: FooterColumn[];
  /** CTA band copy/links above the nav; pass `false` to omit (e.g. a standalone CtaBand sits above). */
  cta?: CtaBandProps | false;
  forceDark?: boolean;
  /** Optional theme control — renders a ThemeToggle in the bottom bar when provided. */
  themeControl?: { value: 'light' | 'dark' | 'system'; onChange: (v: 'light' | 'dark' | 'system') => void };
  canvas?: CanvasPair;
  tagline?: string;
  description?: string;
  tags?: string[];
  copyright?: ReactNode;
  note?: ReactNode;
  brand?: NavLinkSpec;
  /** When set, renders a ⌘K search trigger (CommandTrigger) in the brand column that calls this
      to open the command palette. Omit to hide it. */
  onSearch?: () => void;
  searchLabel?: string;
}

const FOOTER_TAGS = ['non-directional', 'local-first', 'no PII', 'auditable'];

function FCol({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <div>
      <Eyebrow as="p" className="text-xs text-ink/40 mb-6">
        {heading}
      </Eyebrow>
      <nav className="flex flex-col gap-3.5">{children}</nav>
    </div>
  );
}

export function Footer({
  columns,
  cta,
  forceDark = false,
  themeControl,
  canvas = defaultCanvas,
  tagline = 'Synthetic research that disagrees with you.',
  description = 'A deliberative, longitudinal synthetic panel — AI personas that debate, ground every objection in lived experience, and run locally.',
  tags = FOOTER_TAGS,
  copyright,
  note = 'Local-first · your data stays yours',
  brand = { to: '/', label: 'Sonaloop' },
  onSearch,
  searchLabel = 'Search Sonaloop',
}: FooterProps) {
  const ctaBand = cta === undefined ? DEFAULT_CTA : cta;
  const fade = {
    maskImage: 'linear-gradient(to bottom, transparent, black 42%)',
    WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 42%)',
  } as CSSProperties;

  return (
    <footer className="relative z-10 bg-paper text-ink" data-theme={forceDark ? 'dark' : undefined}>
      {ctaBand && <CtaBand {...ctaBand} />}

      <div className="relative z-0 pb-8">
        <div className="absolute inset-0 select-none pointer-events-none bg-paper" aria-hidden="true">
          <img src={canvas.light} alt="" className="absolute inset-0 h-full w-full object-cover opacity-60 dark:hidden" style={fade} />
          <img src={canvas.dark} alt="" className="absolute inset-0 hidden h-full w-full object-cover opacity-70 dark:block" style={fade} />
        </div>

        <div className="relative z-20 measure-frame">
          <div className="bg-paper-dark/40 border-x border-b border-line/[0.08] rounded-b-xl px-6 sm:px-8 lg:px-12 backdrop-blur-[1px]">
            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.7fr_1fr_1fr_1fr_1fr] gap-x-10 gap-y-14 pt-16 mb-16">
              {/* Brand */}
              <div className="sm:col-span-2 lg:col-span-1 flex flex-col justify-between gap-12">
                <L to={brand.to} className="pi-hover group w-fit">
                  <Logo label={brand.label} />
                </L>

                <div>
                  <p className="font-sans text-sm text-ink/70 leading-relaxed mb-1">{tagline}</p>
                  <p className="font-sans text-sm text-ink/45 leading-relaxed">{description}</p>
                  <div className="flex flex-wrap gap-1.5 mt-5">
                    {tags.map((tag) => (
                      <span key={tag} className="font-mono text-[10px] tracking-wider text-ink/30 border border-line/15 rounded px-2 py-0.5">
                        {tag}
                      </span>
                    ))}
                  </div>
                  {onSearch && <CommandTrigger onClick={onSearch} label={searchLabel} className="mt-6" />}
                </div>
              </div>

              {columns.map((col) => (
                <FCol key={col.heading} heading={col.heading}>
                  {col.items.map(({ to, label }) => (
                    <L key={to + label} to={to} className="font-sans text-sm text-ink/60 hover:text-ink/90 transition-colors leading-snug">
                      {label}
                    </L>
                  ))}
                </FCol>
              ))}
            </div>

            {/* Bottom bar */}
            <div className="relative z-10 py-7 flex flex-col sm:flex-row sm:items-center justify-between gap-5 border-t border-line/[0.08]">
              <p className="font-mono text-xs text-ink/30">{copyright ?? `© ${new Date().getFullYear()} Sonaloop`}</p>
              {themeControl && <ThemeToggle value={themeControl.value} onChange={themeControl.onChange} />}
              <p className="font-mono text-xs text-ink/35">{note}</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ── Product showcase (split copy + framed screenshot, painterly matte) ──────────────────── */
export type Shot = { src: string; title?: string; eyebrow?: string; body?: string; caption?: string; alt?: string; canvas?: CanvasPair };

export function ProductShot({ src, title, eyebrow, body, caption, alt, canvas = defaultCanvas }: Shot) {
  const lightSrc = src.replace(/\.png$/, '-light.png');
  return (
    <section className="measure-frame">
      <div className="rounded-2xl border border-line/10 bg-paper-dark/40 px-6 py-12 sm:px-10 sm:py-16 lg:px-14">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[0.82fr_1.3fr] lg:gap-14">
          <div>
            {eyebrow && (
              <Eyebrow as="p" className="mb-3 text-[10px] text-blueprint">
                {eyebrow}
              </Eyebrow>
            )}
            {title && <h2 className="font-serif text-2xl sm:text-3xl text-ink tracking-tight text-balance leading-tight">{title}</h2>}
            {body && <p className="mt-4 font-sans text-sm sm:text-base text-ink/60 leading-relaxed">{body}</p>}
            {caption && (
              <Eyebrow as="p" className="mt-6 text-[11px] text-ink/45">
                {caption}
              </Eyebrow>
            )}
          </div>

          <div className="relative overflow-hidden rounded-xl border border-line/10 shadow-[0_20px_50px_-24px_rgb(var(--ink)/0.35)]">
            <img src={canvas.light} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full scale-125 object-cover blur-xl dark:hidden" />
            <img src={canvas.dark} alt="" aria-hidden="true" className="absolute inset-0 hidden h-full w-full scale-125 object-cover blur-xl dark:block" />
            <div className="absolute inset-0 bg-paper/35 dark:bg-black/35" aria-hidden="true" />
            <div className="relative p-7 sm:p-12 lg:p-16">
              <div className="overflow-hidden rounded-lg border border-black/10 bg-paper shadow-[0_40px_80px_-24px_rgba(0,0,0,0.6)] dark:border-white/10">
                <img src={lightSrc} alt={alt ?? title ?? 'Sonaloop app'} className="block w-full dark:hidden" loading="lazy" />
                <img src={src} alt={alt ?? title ?? 'Sonaloop app'} className="hidden w-full dark:block" loading="lazy" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Canvas showcase (screenshot in a browser frame, rising from a painterly canvas) ─────── */
export function CanvasShowcase({
  canvasLight,
  canvasDark,
  shotLight,
  shotDark,
  alt,
}: {
  canvasLight: string;
  canvasDark: string;
  shotLight: string;
  shotDark: string;
  alt?: string;
}) {
  return (
    <div className="measure-frame">
      <div className="relative overflow-hidden rounded-2xl border border-line/[0.06] shadow-[0_2px_4px_rgb(var(--ink)/0.04)]">
        <img src={canvasLight} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover dark:hidden" />
        <img src={canvasDark} alt="" aria-hidden="true" className="absolute inset-0 hidden h-full w-full object-cover dark:block" />
        <div className="relative px-4 pt-12 sm:px-10 sm:pt-16 lg:pt-20">
          <div className="mx-auto max-w-3xl overflow-hidden rounded-t-xl border border-black/10 bg-white shadow-[0_40px_100px_rgba(0,0,0,0.28)] dark:border-white/10 dark:bg-[#101113] dark:shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
            <img src={shotLight} alt={alt ?? 'Sonaloop app'} className="block w-full dark:hidden" loading="lazy" />
            <img src={shotDark} alt={alt ?? 'Sonaloop app'} className="hidden w-full dark:block" loading="lazy" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Integration showcase (agent terminal floating on a painterly canvas) ────────────────── */
const INTEGRATION_COMMAND = 'claude mcp add sonaloop --scope user --transport http https://api.sonaloop.com/mcp';
const INTEGRATION_PERSONAS: { name: string; role: string; stance: string; tone: keyof typeof toneDot }[] = [
  { name: 'Marcus Hale', role: 'CFO · scale-up', stance: 'objection', tone: 'object' },
  { name: 'Dana Ortiz', role: 'Head of PM', stance: 'conditional', tone: 'cond' },
  { name: 'Priya Nair', role: 'Solo founder', stance: 'for', tone: 'for' },
];
const toneDot = { object: 'bg-gold', cond: 'bg-blueprint', for: 'bg-scan' } as const;

export function IntegrationShowcase({ canvas = defaultCanvas, command = INTEGRATION_COMMAND }: { canvas?: CanvasPair; command?: string } = {}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-line/10 shadow-[0_2px_4px_rgb(var(--ink)/0.04)]">
      <img src={canvas.light} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover dark:hidden" />
      <img src={canvas.dark} alt="" aria-hidden="true" className="absolute inset-0 hidden h-full w-full object-cover dark:block" />

      <div className="relative px-4 py-12 sm:px-10 sm:py-14 lg:px-14">
        <div className="mx-auto max-w-2xl overflow-hidden rounded-xl border border-line/12 bg-paper shadow-[0_40px_100px_rgba(0,0,0,0.30)]">
          <div className="flex items-center gap-2 border-b border-line/10 px-4 py-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-ink/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-ink/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-ink/15" />
            <span className="ml-2 font-mono text-[11px] tracking-wide text-ink/40">claude-code</span>
            <Eyebrow className="ml-auto text-[10px] text-ink/30">no API key</Eyebrow>
          </div>

          <div className="space-y-3 px-5 py-5 font-mono text-[12.5px] leading-relaxed">
            <div className="flex items-start gap-2">
              <span className="select-none text-blueprint">$</span>
              <code className="flex-1 break-all text-ink/85">
                claude mcp add sonaloop --scope user
                <span className="text-ink/45"> --transport http …</span>
              </code>
              <CopyButton text={command} className="flex-shrink-0" />
            </div>

            <div className="space-y-1.5 text-ink/70">
              <IntegrationRow dot="bg-scan" label="Connected" value="sonaloop MCP · local" />
              <IntegrationRow dot="bg-blueprint" label="Council ready" value="6 personas · debating" />
            </div>

            <div className="space-y-1.5 rounded-lg border border-line/10 bg-paper-2/50 px-3 py-2.5">
              {INTEGRATION_PERSONAS.map((p) => (
                <div key={p.name} className="flex items-center gap-2.5">
                  <span className={cx('h-1.5 w-1.5 rounded-full', toneDot[p.tone])} />
                  <span className="text-ink/80">{p.name}</span>
                  <span className="text-ink/40">{p.role}</span>
                  <span className="ml-auto text-[11px] uppercase tracking-wider text-ink/45">{p.stance}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 rounded-lg border border-line/12 px-3 py-2 text-ink/45">
              <span className="text-blueprint">→</span>
              <span>Ask the council anything</span>
            </div>

            <p className="text-[11px] text-ink/35">Opus 4.8 · runs locally · your data stays in the room</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function IntegrationRow({ dot, label, value }: { dot: string; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className={cx('h-2 w-2 rounded-full', dot)} />
      <span className="text-ink/80">{label}</span>
      <span className="text-ink/45">· {value}</span>
    </div>
  );
}

/* ── Command palette (⌘K) ────────────────────────────────────────────────────────────────────
   A shared, router-aware command palette modelled on the Python-SSR app's: results grouped under
   muted section headers, a leading icon per item, an optional right-aligned subtitle, full keyboard
   nav (↑↓ · ↵ · esc) with mouse-hover sync, and a footer hint bar. Renders the `.sl-cmdk-*`
   classes from sonaloop-design/components.css, so it's identical to the docs site's palette.

   Data is prop-driven: pass static `groups` (nav commands), and optionally an async `onSearch`
   for server-backed results (e.g. an /api/search). The host owns open state so it can wire its own
   trigger; `hotkey` (default true) binds ⌘K / Ctrl-K to toggle it. */
export type CommandItem = {
  title: string;
  subtitle?: string;
  /** Internal route — navigated through the injected Link adapter (client-side in a router app). */
  to?: string;
  /** External link — opens in a new tab. */
  href?: string;
  /** A pure action (no navigation). Takes priority over `to`/`href`. */
  onSelect?: () => void;
  icon?: IconKey;
  /** Extra text matched by the built-in client-side filter, beyond the title. */
  keywords?: string;
};
export type CommandGroup = {
  key: string;
  label: string;
  /** Optional CSS colour for this group's item icons (the Linear/Raycast type tint). */
  accent?: string;
  items: CommandItem[];
};

export interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groups: CommandGroup[];
  /** Server-backed results for the current query. Merged after the client-filtered static groups. */
  onSearch?: (query: string) => CommandGroup[] | Promise<CommandGroup[]>;
  placeholder?: string;
  emptyMessage?: string;
  /** Bind ⌘K / Ctrl-K globally to toggle the palette. Default true. */
  hotkey?: boolean;
  /** Show the footer hint bar. Default true. */
  footer?: boolean;
}

function SearchGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

/** A reusable button that opens the palette: search glyph · label · ⌘K hint. Drop it in a navbar. */
export function CommandTrigger({ onClick, label = 'Search', className }: { onClick: () => void; label?: string; className?: string }) {
  return (
    <button type="button" className={cx('sl-cmdk-trigger', className)} onClick={onClick} aria-label={label}>
      <SearchGlyph className="sl-cmdk-trigger-ico" />
      <span>{label}</span>
      <kbd className="sl-kbd">⌘K</kbd>
    </button>
  );
}

function CommandFooter() {
  return (
    <div className="sl-cmdk-foot">
      <span><kbd className="sl-kbd">↑↓</kbd>Navigate</span>
      <span><kbd className="sl-kbd">↵</kbd>Open</span>
      <span><kbd className="sl-kbd">esc</kbd>Close</span>
    </div>
  );
}

function filterCommandGroups(groups: CommandGroup[], query: string): CommandGroup[] {
  const q = query.toLowerCase();
  return groups
    .map((g) => ({ ...g, items: g.items.filter((it) => it.title.toLowerCase().includes(q) || (it.keywords?.toLowerCase().includes(q) ?? false)) }))
    .filter((g) => g.items.length > 0);
}

type PanelRow =
  | { kind: 'sec'; key: string; label: string }
  | { kind: 'item'; key: string; item: CommandItem; accent?: string; i: number };

function toRows(groups: CommandGroup[]): PanelRow[] {
  const rows: PanelRow[] = [];
  let i = 0;
  for (const g of groups) {
    if (!g.items.length) continue;
    rows.push({ kind: 'sec', key: `sec-${g.key}`, label: g.label });
    for (const item of g.items) {
      rows.push({ kind: 'item', key: `${g.key}-${i}`, item, accent: g.accent, i });
      i += 1;
    }
  }
  return rows;
}

interface PanelProps {
  groups: CommandGroup[];
  query?: string;
  onQueryChange?: (q: string) => void;
  selectedIndex?: number;
  onHover?: (i: number) => void;
  onSelect?: () => void;
  placeholder?: string;
  emptyMessage?: string;
  footer?: boolean;
  inline?: boolean;
  inputRef?: React.Ref<HTMLInputElement>;
  listRef?: React.Ref<HTMLDivElement>;
}

/** The palette's presentational surface (input · grouped list · footer). Exported so it can be
    embedded inline (docs preview, an inline search box) without the full-screen overlay. */
export function CommandPalettePanel({
  groups,
  query = '',
  onQueryChange,
  selectedIndex = 0,
  onHover,
  onSelect,
  placeholder = 'Search…',
  emptyMessage = 'No results.',
  footer = true,
  inline = false,
  inputRef,
  listRef,
}: PanelProps) {
  const rows = useMemo(() => toRows(groups), [groups]);
  const empty = rows.length === 0;

  const renderItem = (row: Extract<PanelRow, { kind: 'item' }>) => {
    const { item, accent, i } = row;
    const className = cx('sl-cmdk-item', i === selectedIndex && 'is-active');
    const ico = (
      <span className="sl-cmdk-ico" style={accent ? { color: accent } : undefined}>
        {item.icon ? <Icon name={item.icon} size={18} /> : null}
      </span>
    );
    const body = (
      <>
        {ico}
        <span className="sl-cmdk-title">{item.title}</span>
        {item.subtitle ? <span className="sl-cmdk-sub">{item.subtitle}</span> : null}
      </>
    );
    const onClick = () => {
      item.onSelect?.();
      onSelect?.();
    };
    const onMouseMove = () => onHover?.(i);
    if (item.onSelect) return <button key={row.key} type="button" className={className} onClick={onClick} onMouseMove={onMouseMove}>{body}</button>;
    if (item.to) return <L key={row.key} to={item.to} className={className} onClick={onClick} onMouseMove={onMouseMove}>{body}</L>;
    if (item.href) return <a key={row.key} href={item.href} target="_blank" rel="noreferrer" className={className} onClick={onClick} onMouseMove={onMouseMove}>{body}</a>;
    return <button key={row.key} type="button" className={className} onClick={onClick} onMouseMove={onMouseMove}>{body}</button>;
  };

  return (
    <div className={cx('sl-cmdk-panel', inline && 'sl-cmdk-panel--inline')} role="dialog" aria-modal="true" aria-label="Command palette">
      <div className="sl-cmdk-head">
        <SearchGlyph className="sl-cmdk-head-ico" />
        <input
          ref={inputRef}
          className="sl-cmdk-input"
          type="text"
          value={query}
          onChange={(e) => onQueryChange?.(e.target.value)}
          placeholder={placeholder}
          autoComplete="off"
          spellCheck={false}
          aria-label={placeholder}
        />
      </div>
      <div className="sl-cmdk-list" ref={listRef}>
        {empty ? (
          <div className="sl-cmdk-empty">{emptyMessage}</div>
        ) : (
          rows.map((row) => (row.kind === 'sec'
            ? <div key={row.key} className="sl-cmdk-sec">{row.label}</div>
            : <Fragment key={row.key}>{renderItem(row)}</Fragment>))
        )}
      </div>
      {footer ? <CommandFooter /> : null}
    </div>
  );
}

export function CommandPalette({
  open,
  onOpenChange,
  groups,
  onSearch,
  placeholder = 'Search…',
  emptyMessage = 'No results.',
  hotkey = true,
  footer = true,
}: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [sel, setSel] = useState(0);
  const [asyncGroups, setAsyncGroups] = useState<CommandGroup[] | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // ⌘K / Ctrl-K toggles the palette.
  useEffect(() => {
    if (!hotkey) return;
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [hotkey, open, onOpenChange]);

  // Reset + focus each time it opens.
  useEffect(() => {
    if (!open) return;
    setQuery('');
    setAsyncGroups(null);
    setSel(0);
    inputRef.current?.focus();
  }, [open]);

  const q = query.trim();
  const staticVisible = useMemo(() => (q ? filterCommandGroups(groups, q) : groups), [groups, q]);

  // Debounced server search, merged after the client-filtered static groups.
  useEffect(() => {
    if (!onSearch) return;
    if (!q) {
      setAsyncGroups(null);
      return;
    }
    let live = true;
    const timer = setTimeout(async () => {
      try {
        const r = await onSearch(q);
        if (live) setAsyncGroups(r);
      } catch {
        if (live) setAsyncGroups(null);
      }
    }, 120);
    return () => {
      live = false;
      clearTimeout(timer);
    };
  }, [q, onSearch]);

  const visible = useMemo(() => (asyncGroups ? [...staticVisible, ...asyncGroups] : staticVisible), [staticVisible, asyncGroups]);
  const flatCount = useMemo(() => visible.reduce((n, g) => n + g.items.length, 0), [visible]);

  // Snap selection back to the top whenever the result set changes.
  useEffect(() => { setSel(0); }, [visible]);

  // Keep the active row in view.
  useEffect(() => {
    listRef.current?.querySelectorAll('.sl-cmdk-item')[sel]?.scrollIntoView({ block: 'nearest' });
  }, [sel]);

  if (!open) return null;

  const close = () => onOpenChange(false);
  const move = (d: number) => {
    if (!flatCount) return;
    setSel((s) => (s + d + flatCount) % flatCount);
  };
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); move(1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); move(-1); }
    else if (e.key === 'Enter') { e.preventDefault(); (listRef.current?.querySelectorAll('.sl-cmdk-item')[sel] as HTMLElement | undefined)?.click(); }
    else if (e.key === 'Escape') { e.preventDefault(); close(); }
  };

  return (
    <div className="sl-cmdk" onKeyDown={onKeyDown}>
      <div className="sl-cmdk-backdrop" onClick={close} />
      <CommandPalettePanel
        groups={visible}
        query={query}
        onQueryChange={setQuery}
        selectedIndex={sel}
        onHover={setSel}
        onSelect={close}
        placeholder={placeholder}
        emptyMessage={emptyMessage}
        footer={footer}
        inputRef={inputRef}
        listRef={listRef}
      />
    </div>
  );
}
