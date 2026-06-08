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
import { Fragment, useState } from 'react';
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
import { MonitorIcon, MoonIcon, SunIcon } from './index';
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
}
export function Badge({ tone = 'neutral', className, ...rest }: BadgeProps) {
  return <span className={cx('sl-badge', tone !== 'neutral' && `sl-badge--${tone}`, className)} {...rest} />;
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

export type { ReactNode };
