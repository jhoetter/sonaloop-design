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
import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
} from 'react';

const cx = (...c: Array<string | false | null | undefined>) => c.filter(Boolean).join(' ');

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

/* ── Pill / Chip / Eyebrow / Kbd ─────────────────────────────────────────────── */
export function Pill({ className, ...rest }: HTMLAttributes<HTMLSpanElement>) {
  return <span className={cx('sl-pill', className)} {...rest} />;
}
export function Chip({ className, ...rest }: HTMLAttributes<HTMLSpanElement>) {
  return <span className={cx('sl-chip', className)} {...rest} />;
}
export function Eyebrow({ className, ...rest }: HTMLAttributes<HTMLSpanElement>) {
  return <span className={cx('sl-eyebrow', className)} {...rest} />;
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

export type { ReactNode };
