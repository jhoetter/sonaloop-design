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
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import type { AnchorHTMLAttributes, CSSProperties, ReactNode } from 'react';
import { Eyebrow, CopyButton, ThemeToggle } from './components';
import { SonaloopIcon } from './index';
import { Icon, type IconKey } from './website-icons';
import { canvas as defaultCanvas, type CanvasPair } from './images';

export { Icon, type IconKey } from './website-icons';

const cx = (...c: Array<string | false | null | undefined>) => c.filter(Boolean).join(' ');

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
export function FeatureCard({
  icon,
  eyebrow,
  title,
  children,
  highlight = false,
  className = '',
  framed = true,
  action,
}: {
  icon?: ReactNode;
  eyebrow?: ReactNode;
  title: ReactNode;
  children: ReactNode;
  highlight?: boolean;
  className?: string;
  framed?: boolean;
  action?: { to: string; label: string };
}) {
  const body = (
    <>
      {(icon || eyebrow) && (
        <div className="mb-5 flex items-start justify-between gap-4">
          {icon && <div className={highlight ? 'text-blueprint' : 'text-blueprint/65'}>{icon}</div>}
          {eyebrow && <div className="font-mono text-xs leading-tight tracking-wider text-ink/30">{eyebrow}</div>}
        </div>
      )}
      <h3 className="mb-3 font-serif text-xl text-ink">{title}</h3>
      <div className="font-sans text-sm leading-relaxed text-ink/65">{children}</div>
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

/** A simple responsive grid for cards (1 → 2 → 3 columns). */
export function CardGrid({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={cx('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4', className)}>{children}</div>;
}

/* ── RelatedRail — 3-up cross-link cards ─────────────────────────────────────────────────── */
export type RailItem = { to: string; label: string; description?: string; icon?: IconKey };

export function RelatedRail({ items }: { items: RailItem[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((it) => (
        <L
          key={it.to + it.label}
          to={it.to}
          className="group flex flex-col gap-3 rounded-lg border border-line/[0.09] p-5 transition-colors hover:border-blueprint/40 hover:bg-paper-dark/50"
        >
          {it.icon && (
            <span className="text-blueprint/65 group-hover:text-blueprint">
              <Icon name={it.icon} size={28} animate />
            </span>
          )}
          <div>
            <p className="font-sans text-sm font-medium text-ink">{it.label}</p>
            {it.description && <p className="mt-1 font-sans text-sm text-ink/55 leading-snug">{it.description}</p>}
          </div>
          <span className="mt-auto sl-arrow-link">
            Explore
            <ArrowGlyph />
          </span>
        </L>
      ))}
    </div>
  );
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
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [openKey, setOpenKey] = useState<string | null>(null);
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
          <L to={brand.to} className="pi-hover flex items-center gap-2.5 group text-ink">
            <SonaloopIcon size={24} animate className="text-blueprint-deep transition-transform duration-200 group-hover:scale-110" />
            <span className="font-mono text-sm font-medium tracking-[0.14em] uppercase">{brand.label}</span>
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
  canvas?: CanvasPair;
}

export function Hero({ kicker, title, children, cta, secondary, home = false, titleClassName = 'font-serif', canvas }: HeroProps) {
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
      <h1 className={cx(titleClassName, titleSize, 'max-w-4xl tracking-tight text-ink text-balance')}>{title}</h1>
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

export function CtaBand({ eyebrow, title, body, primary, secondary }: CtaBandProps) {
  return (
    <div className="relative z-20 measure-frame">
      <div className="bg-paper-dark/40 border-x border-t border-line/[0.08] rounded-t-xl px-6 sm:px-8 lg:px-12">
        <div className="py-16 text-center">
          {eyebrow && (
            <Eyebrow as="p" className="text-xs text-ink/45 mb-5">
              {eyebrow}
            </Eyebrow>
          )}
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-ink tracking-tight mb-6 text-balance">{title}</h2>
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
                <L to={brand.to} className="pi-hover inline-flex items-center gap-2.5 group w-fit">
                  <SonaloopIcon size={24} animate className="text-blueprint-deep transition-transform duration-200 group-hover:scale-110" />
                  <span className="font-mono text-sm font-medium tracking-[0.14em] uppercase text-ink">{brand.label}</span>
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
