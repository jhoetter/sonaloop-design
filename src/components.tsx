/**
 * sonaloop-design — React component primitives.
 *
 * Thin, typed wrappers that emit the shared `.sl-*` classes (styles/components.css).
 * The CSS is the single styling source — shared with the Python-SSR app — so these are
 * just an ergonomic React API over it. Consumers must load the styles once:
 *   import 'sonaloop-design/components.css';
 *
 * Page-level compositions (Footer, Hero, …) stay in each app and are built FROM these.
 */
import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import type {
  ButtonHTMLAttributes,
  FieldsetHTMLAttributes,
  HTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TableHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react';
import { ChevronIcon, MonitorIcon, MoonIcon, PanelIcon, SunIcon, SonaloopIcon } from './index';
import type { PersonaIcon } from './icon';

const cx = (...c: Array<string | false | null | undefined>) => c.filter(Boolean).join(' ');

const CopyGlyph = () => (
  <svg className="sl-copy__ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="9" y="9" width="11" height="11" rx="2" />
    <path d="M5 15V5a2 2 0 0 1 2-2h10" />
  </svg>
);
const CheckGlyph = () => (
  <svg className="sl-copy__check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 13l4 4L19 7" />
  </svg>
);

/* ── Button ──────────────────────────────────────────────────────────────────── */
export type ButtonVariant = 'default' | 'primary' | 'accent' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}
export function Button({ variant = 'default', size = 'md', className, ...rest }: ButtonProps) {
  return (
    <button
      className={cx('sl-btn', variant !== 'default' && `sl-btn--${variant}`, size !== 'md' && `sl-btn--${size}`, className)}
      {...rest}
    />
  );
}

/* ── Badge ───────────────────────────────────────────────────────────────────── */
export type BadgeTone = 'neutral' | 'accent' | 'positive' | 'warning' | 'negative';
export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  /** Prefix the label with a small dot in the tone's colour (verdict/status reads). */
  dot?: boolean;
}
export function Badge({ tone = 'neutral', dot, className, children, ...rest }: BadgeProps) {
  return (
    <span className={cx('sl-badge', tone !== 'neutral' && `sl-badge--${tone}`, className)} {...rest}>
      {dot ? <span className="sl-badge__dot" aria-hidden="true" /> : null}
      {children}
    </span>
  );
}

/* ── Tag (bordered, uppercase — distinct from the filled Badge) ──────────────── */
export type TagTone = 'accent' | 'neutral' | 'warm';
export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: TagTone;
}
export function Tag({ tone = 'accent', className, ...rest }: TagProps) {
  return <span className={cx('sl-tag', tone !== 'accent' && `sl-tag--${tone}`, className)} {...rest} />;
}

/* ── Pill / Chip / Eyebrow / Kbd ─────────────────────────────────────────────── */
export function Pill({ className, ...rest }: HTMLAttributes<HTMLSpanElement>) {
  return <span className={cx('sl-pill', className)} {...rest} />;
}
export function Chip({ className, ...rest }: HTMLAttributes<HTMLSpanElement>) {
  return <span className={cx('sl-chip', className)} {...rest} />;
}
export interface EyebrowProps extends HTMLAttributes<HTMLElement> {
  /** Element to render — `span` (inline, default), `p` or `div` (block). */
  as?: 'span' | 'p' | 'div';
}
export function Eyebrow({ as: As = 'span', className, ...rest }: EyebrowProps) {
  return <As className={cx('sl-eyebrow', className)} {...rest} />;
}
export function Kbd({ className, ...rest }: HTMLAttributes<HTMLElement>) {
  return <kbd className={cx('sl-kbd', className)} {...rest} />;
}

/* ── Card (+ subparts) ───────────────────────────────────────────────────────── */
export function Card({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx('sl-card', className)} {...rest} />;
}
export function CardTitle({ className, ...rest }: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cx('sl-card__title', className)} {...rest} />;
}
export function CardBody({ className, ...rest }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cx('sl-card__body', className)} {...rest} />;
}

/* ── Input / Divider ─────────────────────────────────────────────────────────── */
export function Input({ className, ...rest }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cx('sl-input', className)} {...rest} />;
}
export function Divider({ className, ...rest }: HTMLAttributes<HTMLHRElement>) {
  return <hr className={cx('sl-divider', className)} {...rest} />;
}

/* ── Status dot ──────────────────────────────────────────────────────────────── */
export type DotTone = 'neutral' | 'accent' | 'positive' | 'warning' | 'negative' | 'info' | 'shift';
export interface StatusDotProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: DotTone;
}
export function StatusDot({ tone = 'neutral', className, ...rest }: StatusDotProps) {
  return <span className={cx('sl-dot', tone !== 'neutral' && `sl-dot--${tone}`, className)} {...rest} />;
}

/* ── Avatar (+ overlapping group) ────────────────────────────────────────────── */
export type AvatarTone = 'accent' | 'blue' | 'violet' | 'green' | 'amber';
export type AvatarSize = 'sm' | 'md' | 'lg';
export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  /** full name — initials are derived when no `src` is given */
  name?: string;
  src?: string;
  tone?: AvatarTone;
  size?: AvatarSize;
}
export function Avatar({ name, src, tone = 'accent', size = 'md', className, ...rest }: AvatarProps) {
  const initials = name
    ? name.trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase()
    : '';
  return (
    <span
      className={cx('sl-avatar', tone !== 'accent' && `sl-avatar--${tone}`, size !== 'md' && `sl-avatar--${size}`, className)}
      title={name}
      {...rest}
    >
      {src ? <img src={src} alt={name ?? ''} /> : initials}
    </span>
  );
}
export function AvatarGroup({ className, ...rest }: HTMLAttributes<HTMLSpanElement>) {
  return <span className={cx('sl-avatar-group', className)} {...rest} />;
}

/* ── Segmented control / Tabs (controlled) ───────────────────────────────────── */
export interface SegmentedOption {
  value: string;
  label?: ReactNode;
  icon?: ReactNode;
  /** accessible name for icon-only options (pass label="" to hide the text label) */
  ariaLabel?: string;
}
export interface SegmentedProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  options: SegmentedOption[];
  value: string;
  onChange?: (value: string) => void;
  /** stretch items to fill the track */
  fill?: boolean;
  /** stack icon over label (the inspector's view/theme switchers) */
  stacked?: boolean;
}
export function Segmented({ options, value, onChange, fill, stacked, className, ...rest }: SegmentedProps) {
  return (
    <div role="group" className={cx('sl-segmented', fill && 'sl-segmented--fill', stacked && 'sl-segmented--stacked', className)} {...rest}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          className={cx('sl-segmented__item', o.value === value && 'is-active')}
          aria-pressed={o.value === value}
          aria-label={o.ariaLabel}
          title={o.ariaLabel}
          onClick={() => onChange?.(o.value)}
        >
          {o.icon}
          {o.label ?? o.value}
        </button>
      ))}
    </div>
  );
}

/* ── Theme toggle (controlled) ───────────────────────────────────────────────── */
// The ONE canonical color-scheme switch, shared by every product so the glyphs never
// diverge: ☀ light · ▢ system (follow the OS) · ☾ dark. It's presentational only —
// each app owns its own theme state (React context, vanilla JS, Python-SSR) and passes
// the current `value` + an `onChange`. Built on Segmented, so it inherits its styling.
export type ThemePreference = 'light' | 'system' | 'dark';

const THEME_TOGGLE_OPTIONS: { value: ThemePreference; Icon: PersonaIcon; label: string }[] = [
  { value: 'light', Icon: SunIcon, label: 'Light' },
  { value: 'system', Icon: MonitorIcon, label: 'System' },
  { value: 'dark', Icon: MoonIcon, label: 'Dark' },
];

export interface ThemeToggleProps extends Omit<SegmentedProps, 'options' | 'value' | 'onChange'> {
  value: ThemePreference;
  onChange?: (value: ThemePreference) => void;
  /** icon size in px (default 16) */
  iconSize?: number;
  /** show the text label beside each icon (default false — icon-only) */
  labels?: boolean;
}
export function ThemeToggle({ value, onChange, iconSize = 16, labels = false, ...rest }: ThemeToggleProps) {
  return (
    <Segmented
      aria-label="Color scheme"
      value={value}
      onChange={(v) => onChange?.(v as ThemePreference)}
      options={THEME_TOGGLE_OPTIONS.map(({ value, Icon, label }) => ({
        value,
        icon: <Icon size={iconSize} />,
        label: labels ? label : '',
        ariaLabel: `${label} theme`,
      }))}
      {...rest}
    />
  );
}

/* ── Copy button / Snippet / Code block ──────────────────────────────────────── */
export interface CopyButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  text: string;
  /** label next to the icon; pass '' for an icon-only button */
  label?: string;
}
export function CopyButton({ text, label = 'Copy', className, ...rest }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const onClick = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch { /* clipboard unavailable */ }
  };
  return (
    <button
      type="button"
      className={cx('sl-copy', copied && 'is-copied', className)}
      onClick={onClick}
      aria-label={copied ? 'Copied' : label || 'Copy'}
      {...rest}
    >
      <CopyGlyph />
      <CheckGlyph />
      {label ? <span className="sl-copy__label">{copied ? 'Copied' : label}</span> : null}
    </button>
  );
}
export interface SnippetProps extends HTMLAttributes<HTMLDivElement> {
  code: string;
  /** prefix the code with a `$ ` shell prompt */
  command?: boolean;
}
export function Snippet({ code, command = true, className, ...rest }: SnippetProps) {
  return (
    <div className={cx('sl-snippet', command && 'sl-snippet--cmd', className)} {...rest}>
      <code className="sl-snippet__code">{code}</code>
      <CopyButton text={code} label="" />
    </div>
  );
}
export interface CodeBlockProps extends HTMLAttributes<HTMLDivElement> {
  code: string;
  lang?: string;
}
export function CodeBlock({ code, lang, className, ...rest }: CodeBlockProps) {
  return (
    <div className={cx('sl-code', className)} {...rest}>
      <div className="sl-code__head">
        <span className="sl-code__lang">{lang}</span>
        <CopyButton text={code} label="" />
      </div>
      <pre><code>{code}</code></pre>
    </div>
  );
}

/* ── Note / Callout ──────────────────────────────────────────────────────────── */
export type NoteTone = 'accent' | 'positive' | 'warning' | 'negative';
export interface NoteProps extends HTMLAttributes<HTMLDivElement> {
  tone?: NoteTone;
  icon?: ReactNode;
}
export function Note({ tone = 'accent', icon, className, children, ...rest }: NoteProps) {
  return (
    <div className={cx('sl-note', tone !== 'accent' && `sl-note--${tone}`, className)} {...rest}>
      {icon && <span className="sl-note__icon">{icon}</span>}
      <div className="sl-note__body">{children}</div>
    </div>
  );
}

/* ── Empty state ─────────────────────────────────────────────────────────────── */
export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  icon?: ReactNode;
  title: ReactNode;
}
export function EmptyState({ icon, title, className, children, ...rest }: EmptyStateProps) {
  return (
    <div className={cx('sl-empty', className)} {...rest}>
      {icon && <div className="sl-empty__icon">{icon}</div>}
      <h2 className="sl-empty__title">{title}</h2>
      {children && <p className="sl-empty__body">{children}</p>}
    </div>
  );
}

/* ── Breadcrumb ──────────────────────────────────────────────────────────────── */
export interface Crumb {
  label: ReactNode;
  href?: string;
}
export interface BreadcrumbProps extends HTMLAttributes<HTMLElement> {
  items: Crumb[];
}
export function Breadcrumb({ items, className, ...rest }: BreadcrumbProps) {
  return (
    <nav className={cx('sl-breadcrumb', className)} aria-label="Breadcrumb" {...rest}>
      {items.map((c, i) => (
        <Fragment key={i}>
          {i > 0 && <span className="sl-breadcrumb__sep" aria-hidden="true" />}
          {c.href ? (
            <a className="sl-breadcrumb__link" href={c.href}>{c.label}</a>
          ) : (
            <span className="sl-breadcrumb__current" aria-current="page">{c.label}</span>
          )}
        </Fragment>
      ))}
    </nav>
  );
}

/* ── Table ───────────────────────────────────────────────────────────────────── */
export interface TableProps extends TableHTMLAttributes<HTMLTableElement> {
  bordered?: boolean;
}
export function Table({ bordered, className, ...rest }: TableProps) {
  return <table className={cx('sl-table', bordered && 'sl-table--bordered', className)} {...rest} />;
}

/* ── Progress ────────────────────────────────────────────────────────────────── */
export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  /** 0–100 */
  value?: number;
}
export function Progress({ value = 0, className, ...rest }: ProgressProps) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className={cx('sl-progress', className)} role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} {...rest}>
      <div className="sl-progress__bar" style={{ width: `${pct}%` }} />
    </div>
  );
}

/* ── Stat (metric chip + strip) ──────────────────────────────────────────────── */
export interface StatProps extends HTMLAttributes<HTMLDivElement> {
  value: ReactNode;
  label: ReactNode;
}
export function Stat({ value, label, className, ...rest }: StatProps) {
  return (
    <div className={cx('sl-stat', className)} {...rest}>
      <span className="sl-stat__value">{value}</span>
      <span className="sl-stat__label">{label}</span>
    </div>
  );
}
export function Stats({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx('sl-stats', className)} {...rest} />;
}

/* ── Textarea / Select ───────────────────────────────────────────────────────── */
export function Textarea({ className, ...rest }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cx('sl-textarea', className)} {...rest} />;
}
export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  /** class on the wrapper that draws the caret (the <select> takes `className`) */
  wrapperClassName?: string;
}
export function Select({ className, wrapperClassName, children, ...rest }: SelectProps) {
  return (
    <span className={cx('sl-select', wrapperClassName)}>
      <select className={className} {...rest}>{children}</select>
    </span>
  );
}

/* ── Checkbox / Radio / Switch (label-wrapped native controls) ───────────────── */
export interface ChoiceProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** text/label shown beside the control */
  label?: ReactNode;
  /** class on the outer <label> wrapper (the <input> takes `className`) */
  wrapperClassName?: string;
}
export function Checkbox({ label, className, wrapperClassName, ...rest }: ChoiceProps) {
  return (
    <label className={cx('sl-check', wrapperClassName)}>
      <input type="checkbox" className={className} {...rest} />
      {label != null && <span>{label}</span>}
    </label>
  );
}
export function Radio({ label, className, wrapperClassName, ...rest }: ChoiceProps) {
  return (
    <label className={cx('sl-check', wrapperClassName)}>
      <input type="radio" className={className} {...rest} />
      {label != null && <span>{label}</span>}
    </label>
  );
}
export function Switch({ label, className, wrapperClassName, ...rest }: ChoiceProps) {
  return (
    <label className={cx('sl-switch', wrapperClassName)}>
      <input type="checkbox" className={cx('sl-switch__input', className)} {...rest} />
      <span className="sl-switch__track" />
      {label != null && <span>{label}</span>}
    </label>
  );
}

/* ── Field (label + hint/error) · Fieldset (grouped) ─────────────────────────── */
export interface FieldProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  /** id of the control the label points at */
  htmlFor?: string;
}
export function Field({ label, hint, error, required, htmlFor, className, children, ...rest }: FieldProps) {
  return (
    <div className={cx('sl-field', error != null && 'sl-field--invalid', className)} {...rest}>
      {label != null && (
        <label className="sl-field__label" htmlFor={htmlFor}>
          {label}
          {required && <span className="sl-field__req" aria-hidden="true">*</span>}
        </label>
      )}
      {children}
      {error != null ? (
        <span className="sl-field__error">{error}</span>
      ) : hint != null ? (
        <span className="sl-field__hint">{hint}</span>
      ) : null}
    </div>
  );
}
export interface FieldsetProps extends FieldsetHTMLAttributes<HTMLFieldSetElement> {
  legend?: ReactNode;
}
export function Fieldset({ legend, className, children, ...rest }: FieldsetProps) {
  return (
    <fieldset className={cx('sl-fieldset', className)} {...rest}>
      {legend != null && <legend className="sl-fieldset__legend">{legend}</legend>}
      {children}
    </fieldset>
  );
}

/* ── Entity (a list row: visual · title/desc · trailing) ─────────────────────── */
export interface EntityProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  visual?: ReactNode;
  title: ReactNode;
  desc?: ReactNode;
  trailing?: ReactNode;
  /** render as an interactive row (hover affordance) */
  button?: boolean;
}
export function Entity({ visual, title, desc, trailing, button, className, ...rest }: EntityProps) {
  return (
    <div className={cx('sl-entity', button && 'sl-entity--button', className)} {...rest}>
      {visual != null && <span className="sl-entity__visual">{visual}</span>}
      <span className="sl-entity__content">
        <span className="sl-entity__title">{title}</span>
        {desc != null && <span className="sl-entity__desc">{desc}</span>}
      </span>
      {trailing != null && <span className="sl-entity__trailing">{trailing}</span>}
    </div>
  );
}
export function EntityList({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx('sl-entity-list', className)} {...rest} />;
}

/* ── Logo ────────────────────────────────────────────────────────────────────── */
export type LogoSize = 'sm' | 'md' | 'lg';
export interface LogoProps extends HTMLAttributes<HTMLSpanElement> {
  /** Wordmark text beside the mark. Defaults to "Sonaloop". */
  label?: string;
  /** Set false to render the loop mark on its own (no wordmark). */
  wordmark?: boolean;
  /** Product sub-label after the wordmark, muted + lowercase (e.g. "data", "tracker"). */
  sub?: string;
  size?: LogoSize;
}
/**
 * The Sonaloop brand lockup: the loop mark + the "sonaloop" wordmark — "sona" in Sona Mono and
 * the trailing "loop" in Sona Pixel (whose cells echo the mark). Single source of truth for the
 * logo, shared with the Python-SSR app via the `.sl-logo` class layer. Render it inside the
 * app's own link to make it navigable — the layout lives in CSS, so the wrapper stays minimal:
 *   <L to="/"><Logo /></L>
 */
export function Logo({ label = 'Sonaloop', wordmark = true, sub, size = 'md', className, ...rest }: LogoProps) {
  // The wordmark sets its trailing "loop" in the pixel face; the rest stays in the mono run.
  const word = /loop$/i.test(label)
    ? <>{label.slice(0, -4)}<span className="sl-logo__loop">{label.slice(-4)}</span></>
    : label;
  return (
    <span className={cx('sl-logo', size !== 'md' && `sl-logo--${size}`, className)} {...rest}>
      <span className="sl-logo__mark"><SonaloopIcon /></span>
      {wordmark && <span className="sl-logo__word">{word}</span>}
      {sub && <span className="sl-logo__sub">{sub}</span>}
    </span>
  );
}

/* ── Command palette (⌘K) ──────────────────────────────────────────────────────────
   One implementation, shared with the marketing site — it lives in ./command (image-free)
   and is re-exported here so app-shell consumers get ⌘K without pulling website assets. */
export {
  CommandPalette,
  CommandPalettePanel,
  CommandTrigger,
  type CommandItem,
  type CommandGroup,
  type CommandPaletteProps,
} from './command';


/* ── App shell ───────────────────────────────────────────────────────────────────
   The product chrome shared with the Python-SSR app (same .sl-* classes): a collapsible
   + drag-resizable sidebar (brand · nav sections · bottom user menu), a resize handle, and
   a topbar (sidebar toggle · slot for breadcrumb + actions). Collapse + width persist to
   localStorage. Pair with <CommandPalette> for ⌘K. */
export interface AppShellNavItem {
  label: ReactNode;
  /** Optional leading icon — pass `animate` on it for the hover micro-interaction. */
  icon?: ReactNode;
  /** Render as a link (SSR-style nav) when set; otherwise a button driven by onSelect. */
  href?: string;
  active?: boolean;
  /** Right-aligned trailing content (e.g. an open-count). */
  meta?: ReactNode;
  title?: string;
  onSelect?: () => void;
}
export interface AppShellNavSection {
  label?: ReactNode;
  items: AppShellNavItem[];
  /** Render the section as a collapsible group (label becomes a caret toggle). Needs a `label`. */
  collapsible?: boolean;
  /** Start collapsed (only meaningful with `collapsible`). */
  defaultCollapsed?: boolean;
}
export interface AppShellUserMenu {
  label: ReactNode;
  icon?: ReactNode;
  /** Popover content (e.g. a theme switch). */
  children: ReactNode;
}
export interface AppShellProps {
  brand: ReactNode;
  /** Pinned below the brand (under the border), above the nav — typically a <CommandTrigger> for ⌘K. */
  search?: ReactNode;
  nav: AppShellNavSection[];
  userMenu?: AppShellUserMenu;
  /** Topbar content to the right of the sidebar-toggle (breadcrumb + actions). */
  topbar?: ReactNode;
  children: ReactNode;
  /** localStorage key prefix for collapse/width persistence. */
  storageKey?: string;
  defaultWidth?: number;
  className?: string;
}

const SHELL_MIN = 180;
const SHELL_MAX = 480;
const SHELL_HIDE = 32;

export function AppShell({
  brand,
  search,
  nav,
  userMenu,
  topbar,
  children,
  storageKey = 'sl-shell',
  defaultWidth = 248,
  className,
}: AppShellProps) {
  // Lazy initialisers read persisted state before first paint (no collapse flash).
  const [collapsed, setCollapsed] = useState(() => {
    try { return localStorage.getItem(`${storageKey}:open`) === 'false'; } catch { return false; }
  });
  const [width, setWidth] = useState(() => {
    try { return parseInt(localStorage.getItem(`${storageKey}:width`) || '', 10) || defaultWidth; } catch { return defaultWidth; }
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const [collapsedSecs, setCollapsedSecs] = useState<Set<number>>(
    () => new Set(nav.flatMap((s, i) => (s.collapsible && s.defaultCollapsed ? [i] : []))),
  );
  const toggleSec = (i: number) =>
    setCollapsedSecs((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  const menuRef = useRef<HTMLDivElement>(null);

  const persistOpen = useCallback((open: boolean) => {
    try { localStorage.setItem(`${storageKey}:open`, String(open)); } catch { /* ignore */ }
  }, [storageKey]);
  const toggle = useCallback(() => {
    setCollapsed((c) => { persistOpen(c); return !c; });
  }, [persistOpen]);

  // `[` toggles the sidebar (Linear-style), unless the user is typing.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
      if (e.key === '[') { e.preventDefault(); toggle(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [toggle]);

  // User-menu popover closes on outside click / Escape.
  useEffect(() => {
    if (!menuOpen) return;
    const onDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onEsc);
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onEsc); };
  }, [menuOpen]);

  // Drag-resize the sidebar; dragging past the hide threshold collapses it.
  const onResizeDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    const startX = e.clientX;
    const startW = width || defaultWidth;
    let last = startW;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    const move = (ev: PointerEvent) => {
      const next = startW + (ev.clientX - startX);
      if (next <= SHELL_HIDE) { setCollapsed(true); persistOpen(false); }
      else {
        last = Math.max(SHELL_MIN, Math.min(SHELL_MAX, next));
        setWidth(last); setCollapsed(false); persistOpen(true);
      }
    };
    const up = () => {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      try { localStorage.setItem(`${storageKey}:width`, String(last)); } catch { /* ignore */ }
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  const renderItem = (it: AppShellNavItem, key: number) => {
    const cls = cx('pi-hover', it.active && 'is-active');
    const inner = (
      <>
        {it.icon}
        <span>{it.label}</span>
        {it.meta != null && <span className="sl-nav-meta">{it.meta}</span>}
      </>
    );
    return it.href ? (
      <a key={key} href={it.href} className={cls} title={it.title} onClick={it.onSelect}>{inner}</a>
    ) : (
      <button key={key} type="button" className={cls} title={it.title} onClick={it.onSelect}>{inner}</button>
    );
  };

  return (
    <div
      className={cx('sl-app-shell', collapsed && 'is-collapsed', className)}
      style={{ ['--sl-sidebar-w' as string]: `${width}px` } as React.CSSProperties}
    >
      <aside className="sl-sidebar">
        <div className="sl-brand">{brand}</div>
        {search && <div className="sl-sb-search">{search}</div>}
        <div className="sl-sb-scroll">
          {nav.map((sec, i) => {
            if (sec.collapsible && sec.label != null) {
              const collapsed = collapsedSecs.has(i);
              return (
                <div key={i} className={cx('sl-nav-group', collapsed && 'is-collapsed')}>
                  <button type="button" className="sl-navhead" aria-expanded={!collapsed} onClick={() => toggleSec(i)}>
                    <span>{sec.label}</span>
                    <span className="sl-navhead__caret"><ChevronIcon size={13} /></span>
                  </button>
                  <nav className="sl-nav">{sec.items.map(renderItem)}</nav>
                </div>
              );
            }
            return (
              <Fragment key={i}>
                {sec.label != null && <div className="sl-navhead">{sec.label}</div>}
                <nav className="sl-nav">{sec.items.map(renderItem)}</nav>
              </Fragment>
            );
          })}
        </div>
        {userMenu && (
          <div ref={menuRef} className={cx('sl-usermenu', menuOpen && 'is-open')}>
            <div className="sl-um-pop" hidden={!menuOpen}>{userMenu.children}</div>
            <button
              type="button"
              className="sl-um-trigger"
              aria-haspopup="true"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((o) => !o)}
            >
              <span className="sl-um-ava">{userMenu.icon}</span>
              <span className="sl-um-name">{userMenu.label}</span>
              <span className="sl-um-caret"><ChevronIcon size={16} /></span>
            </button>
          </div>
        )}
      </aside>
      <div
        className="sl-resize"
        role="separator"
        aria-orientation="vertical"
        aria-label="Resize sidebar"
        onPointerDown={onResizeDown}
      />
      <div className="sl-main">
        <header className="sl-topbar">
          <button type="button" className="sl-iconbtn" aria-label="Toggle sidebar" title="Toggle sidebar ([)" onClick={toggle}>
            <PanelIcon size={16} />
          </button>
          {topbar}
        </header>
        <div className="sl-shell-body">{children}</div>
      </div>
    </div>
  );
}

/* ── Overlays: Drawer · Modal · Popover ──────────────────────────────────────────
   The React wrappers mount on `open` (no exit animation, like CommandPalette). The
   styling is the shared `.sl-*` overlay layer; the Python-SSR app ships its own opener
   over the same classes. Drawer + Modal share ESC-close, body scroll-lock and focus
   restore via useOverlayDismiss; Popover is anchored (outside-click + ESC, no lock). */
const CloseGlyph = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" aria-hidden="true">
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

/** ESC-to-close + body scroll-lock + restore focus to the trigger, while `open`. */
function useOverlayDismiss(open: boolean, onClose: () => void) {
  const restore = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (!open) return;
    restore.current = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { e.preventDefault(); onClose(); } };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
      restore.current?.focus?.();
    };
  }, [open, onClose]);
}

/** Keep a node mounted across its close transition so it can animate out: `render` says whether to
    mount the markup at all; `active` applies the visible/open class one frame later so the enter
    transition runs from the closed state (and drops on close so the exit transition runs). */
function useEnterExit(open: boolean, durationMs: number) {
  const [render, setRender] = useState(open);
  const [active, setActive] = useState(false);
  useEffect(() => {
    if (open) {
      setRender(true);
      const r = requestAnimationFrame(() => setActive(true));
      return () => cancelAnimationFrame(r);
    }
    setActive(false);
    const t = setTimeout(() => setRender(false), durationMs);
    return () => clearTimeout(t);
  }, [open, durationMs]);
  return { render, active };
}

export type DrawerSide = 'right' | 'left';
export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  /** Edge the panel slides from. Default `right`. */
  side?: DrawerSide;
  /** Panel width (any CSS length). Default `min(620px, 94vw)`. */
  width?: string;
  /** A sticky footer bar — typically the primary/secondary actions. */
  footer?: ReactNode;
  /** Render no built-in header/body/footer — `children` own the entire panel (a custom peek
   *  with its own header + scroll region). The Drawer still supplies the scrim, slide animation,
   *  ESC/scroll-lock/focus. */
  bare?: boolean;
  className?: string;
  children?: ReactNode;
}
/** A right/left slide-over peek panel — the detail-without-leaving-the-page pattern. Animates in
 *  and out (kept mounted across the close transition). */
export function Drawer({ open, onClose, title, side = 'right', width, footer, bare, className, children }: DrawerProps) {
  useOverlayDismiss(open, onClose);
  const { render, active } = useEnterExit(open, 240);
  const panelRef = useRef<HTMLDivElement>(null);
  useEffect(() => { if (open) panelRef.current?.focus(); }, [open]);
  if (!render) return null;
  return (
    <div className={cx('sl-drawer', active && 'is-open', side === 'left' && 'sl-drawer--left', className)} aria-hidden={!active}>
      <div className="sl-drawer__scrim" onClick={onClose} />
      <aside className="sl-drawer__panel" role="dialog" aria-modal="true" ref={panelRef} tabIndex={-1} style={width ? { width } : undefined}>
        {bare ? children : (
          <>
            <header className="sl-drawer__head">
              <span className="sl-drawer__title">{title}</span>
              <button type="button" className="sl-overlay-close" onClick={onClose} aria-label="Close"><CloseGlyph /></button>
            </header>
            <div className="sl-drawer__body">{children}</div>
            {footer ? <footer className="sl-drawer__foot">{footer}</footer> : null}
          </>
        )}
      </aside>
    </div>
  );
}

export type ModalSize = 'sm' | 'md' | 'lg';
export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  size?: ModalSize;
  footer?: ReactNode;
  /** Hide the header close button (a forced-choice / confirm dialog). */
  hideClose?: boolean;
  className?: string;
  children?: ReactNode;
}
/** A centered modal dialog. Shares the overlay engine with Drawer. */
export function Modal({ open, onClose, title, size = 'md', footer, hideClose, className, children }: ModalProps) {
  useOverlayDismiss(open, onClose);
  const panelRef = useRef<HTMLDivElement>(null);
  useEffect(() => { if (open) panelRef.current?.focus(); }, [open]);
  if (!open) return null;
  return (
    <div className={cx('sl-modal', size !== 'md' && `sl-modal--${size}`, className)}>
      <div className="sl-modal__scrim" onClick={onClose} />
      <div className="sl-modal__panel" role="dialog" aria-modal="true" ref={panelRef} tabIndex={-1}>
        {(title || !hideClose) ? (
          <header className="sl-modal__head">
            <h2 className="sl-modal__title">{title}</h2>
            {!hideClose ? <button type="button" className="sl-overlay-close" onClick={onClose} aria-label="Close"><CloseGlyph /></button> : null}
          </header>
        ) : null}
        <div className="sl-modal__body">{children}</div>
        {footer ? <footer className="sl-modal__foot">{footer}</footer> : null}
      </div>
    </div>
  );
}

export type PopoverPlacement = 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
export interface PopoverProps {
  /** Controlled open state. Omit for an uncontrolled popover that tracks its own state —
   *  drive it via the render-prop `trigger`/`children`. */
  open?: boolean;
  /** Close handler (controlled mode). */
  onClose?: () => void;
  /** The anchor. Either a node (you wire its onClick — controlled), or a render-prop receiving
   *  `{ open, toggle }` to build an uncontrolled trigger. */
  trigger: ReactNode | ((state: { open: boolean; toggle: () => void }) => ReactNode);
  placement?: PopoverPlacement;
  className?: string;
  /** The panel content — a node, or a render-prop receiving a `close` callback (so a menu row can
   *  close the popover when it's chosen). */
  children?: ReactNode | ((close: () => void) => ReactNode);
}
/** A small anchored panel (menus, filters) positioned against its trigger. Controlled (pass
 *  `open`/`onClose`) or uncontrolled (omit them and drive it via the render-prop trigger/children). */
export function Popover({ open: openProp, onClose, trigger, placement = 'bottom-start', className, children }: PopoverProps) {
  const controlled = openProp !== undefined;
  const [openState, setOpenState] = useState(false);
  const open = controlled ? !!openProp : openState;
  const close = useCallback(() => { if (controlled) onClose?.(); else setOpenState(false); }, [controlled, onClose]);
  const toggle = useCallback(() => { if (controlled) { if (open) onClose?.(); } else setOpenState((o) => !o); }, [controlled, open, onClose]);
  const wrapRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => { if (!wrapRef.current?.contains(e.target as Node)) close(); };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey); };
  }, [open, close]);
  return (
    <div className="sl-popover-wrap" ref={wrapRef}>
      {typeof trigger === 'function' ? trigger({ open, toggle }) : trigger}
      {open ? (
        <div className={cx('sl-popover', `sl-popover--${placement}`, className)} role="menu">
          {typeof children === 'function' ? (children as (close: () => void) => ReactNode)(close) : children}
        </div>
      ) : null}
    </div>
  );
}

export interface MenuItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: ReactNode;
}
/** A row inside a Popover menu — icon · label, full-width hover. */
export function MenuItem({ icon, className, children, ...rest }: MenuItemProps) {
  return <button type="button" className={cx('sl-menu-item', className)} role="menuitem" {...rest}>{icon}{children}</button>;
}

/* ── Tabs (underline · pill) ──────────────────────────────────────────────────────
   In-page section switching. Buttons by default (controlled value/onChange); pass a
   per-item `href` for navigation tabs (renders anchors). For a settings theme/density
   toggle, prefer Segmented. */
export type TabsVariant = 'underline' | 'pill';
export interface TabItem {
  key: string;
  label: ReactNode;
  icon?: ReactNode;
  /** Render this tab as a link (navigation tabs) instead of a button. */
  href?: string;
}
export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  items: TabItem[];
  value: string;
  onChange?: (key: string) => void;
  variant?: TabsVariant;
}
export function Tabs({ items, value, onChange, variant = 'underline', className, ...rest }: TabsProps) {
  return (
    <div className={cx('sl-tabs', variant === 'pill' && 'sl-tabs--pill', className)} role="tablist" {...rest}>
      {items.map((it) => {
        const active = it.key === value;
        const cls = cx('sl-tab', active && 'is-active');
        const body = <>{it.icon}{it.label}</>;
        return it.href
          ? <a key={it.key} href={it.href} className={cls} role="tab" aria-selected={active}>{body}</a>
          : <button key={it.key} type="button" className={cls} role="tab" aria-selected={active} onClick={() => onChange?.(it.key)}>{body}</button>;
      })}
    </div>
  );
}

/* ── Property list (Linear-style key/value detail rows) ──────────────────────────── */
export interface PropertyListProps extends HTMLAttributes<HTMLDivElement> {
  /** Wrap the rows in a bordered card surface. */
  card?: boolean;
}
export function PropertyList({ card, className, ...rest }: PropertyListProps) {
  return <div className={cx('sl-props', card && 'sl-props--card', className)} {...rest} />;
}
export interface PropertyProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  icon?: ReactNode;
  label: ReactNode;
}
export function Property({ icon, label, className, children, ...rest }: PropertyProps) {
  return (
    <div className={cx('sl-prop', className)} {...rest}>
      <span className="sl-prop__k">{icon}{label}</span>
      <span className="sl-prop__v">{children}</span>
    </div>
  );
}

/* ── Page header (the detail-page hero) ───────────────────────────────────────────
   top slot (eyebrow/pill/breadcrumb) · icon + title · sub · trailing actions. */
export interface PageHeaderProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  title: ReactNode;
  icon?: ReactNode;
  sub?: ReactNode;
  /** A slot above the title — an Eyebrow, a Pill row, a Breadcrumb. */
  top?: ReactNode;
  /** Trailing actions kept on the right (buttons, a menu trigger). */
  actions?: ReactNode;
}
export function PageHeader({ title, icon, sub, top, actions, className, ...rest }: PageHeaderProps) {
  return (
    <header className={cx('sl-page-header', className)} {...rest}>
      <div className="sl-page-header__main">
        {top ? <div className="sl-page-header__top">{top}</div> : null}
        <h1 className="sl-page-header__title">{icon}{title}</h1>
        {sub ? <p className="sl-page-header__sub">{sub}</p> : null}
      </div>
      {actions ? <div className="sl-page-header__actions">{actions}</div> : null}
    </header>
  );
}

/* ── Detail layout (content column + sticky aside) & the scrollspy page rail ─────── */
export interface DetailLayoutProps extends HTMLAttributes<HTMLDivElement> {
  /** The sticky right column — a PageRail, a PropertyList, relations, … */
  aside?: ReactNode;
}
export function DetailLayout({ aside, className, children, ...rest }: DetailLayoutProps) {
  return (
    <div className={cx('sl-detail', className)} {...rest}>
      <div className="sl-detail__main">{children}</div>
      {aside ? <aside className="sl-detail__aside">{aside}</aside> : null}
    </div>
  );
}

export interface RailItem {
  /** The id of the section heading this tick links to / tracks. */
  id: string;
  label: ReactNode;
}
export interface PageRailProps extends HTMLAttributes<HTMLElement> {
  items: RailItem[];
  /** Optional heading above the ticks (e.g. "On this page"). */
  heading?: ReactNode;
}
/** A right-edge minimap that scrollspies the page's section headings (by id). */
export function PageRail({ items, heading, className, ...rest }: PageRailProps) {
  const [active, setActive] = useState<string>(items[0]?.id ?? '');
  // Re-observe only when the set of tracked ids changes.
  const ids = items.map((it) => it.id).join('|');
  useEffect(() => {
    const els = ids.split('|').map((id) => document.getElementById(id)).filter((e): e is HTMLElement => !!e);
    if (!els.length || typeof IntersectionObserver === 'undefined') return;
    const obs = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (vis[0]) setActive(vis[0].target.id);
      },
      { rootMargin: '0px 0px -70% 0px', threshold: 0 },
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [ids]);
  return (
    <nav className={cx('sl-rail', className)} aria-label="On this page" {...rest}>
      {heading ? <div className="sl-rail__head">{heading}</div> : null}
      {items.map((it) => (
        <a key={it.id} href={`#${it.id}`} className={cx('sl-rail__item', it.id === active && 'is-active')} onClick={() => setActive(it.id)}>
          {it.label}
        </a>
      ))}
    </nav>
  );
}

export type { ReactNode };
