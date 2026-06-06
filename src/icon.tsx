import type { ComponentType, SVGAttributes } from 'react';

export type PersonaIconProps = SVGAttributes<SVGSVGElement> & {
  size?: number | string;
  strokeWidth?: number | string;
  absoluteStrokeWidth?: boolean;
  /** Opt in to the hover/focus micro-animation (needs `persona-icons/style.css`). */
  animate?: boolean;
};

export type PersonaIconHifiProps = SVGAttributes<SVGSVGElement> & {
  size?: number | string;
  /** Opt in to the hover/focus micro-animation (needs `persona-icons/style.css`). */
  animate?: boolean;
};

export type PersonaIcon = ComponentType<PersonaIconProps>;

/**
 * Builds a regular 24×24 persona icon from raw SVG inner-markup.
 *
 * Icons share the app's standard props API — `size`, `strokeWidth`,
 * `absoluteStrokeWidth`, plus any SVG attribute. Stroke is `currentColor`;
 * default strokeWidth is 1.75 to match the council chrome set.
 *
 *   import { SearchIcon } from 'persona-icons'
 *   <SearchIcon size={18} className="text-slate-600" />
 *   <SearchIcon animate />            // hover/focus micro-animation (opt-in)
 *
 * The markup originates from `icons.data.mjs` and is injected as a static
 * string, so it is trusted (build-time constant, never user input).
 *
 * The root carries `pi pi-<key>`; `animate` adds `pi-animate`, the gate the
 * stylesheet (`persona-icons/style.css`) requires. Default is static.
 */
export function personaIcon(displayName: string, body: string, key: string): PersonaIcon {
  const base = `pi pi-${key}`;
  function Icon({
    size = 24,
    strokeWidth = 1.75,
    absoluteStrokeWidth,
    animate,
    className,
    ...rest
  }: PersonaIconProps) {
    const sw = absoluteStrokeWidth
      ? (Number(strokeWidth) * 24) / Number(size)
      : strokeWidth;
    const cls = [base, animate ? 'pi-animate' : '', className].filter(Boolean).join(' ');
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={sw}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        focusable="false"
        className={cls}
        dangerouslySetInnerHTML={{ __html: body }}
        {...rest}
      />
    );
  }
  Icon.displayName = displayName;
  return Icon;
}

/**
 * Builds a high-fidelity 48×48 display icon from raw SVG inner-markup.
 *
 * Children carry their own fills and stroke hierarchy (2 / 1.5 / 0.75); the
 * root only provides `stroke="currentColor"` and `fill="none"` as defaults.
 *
 * The root carries `pi-hifi pi-hifi-<key>` classes so the optional animation
 * stylesheet (`persona-icons/style.css`) can target a specific icon and its
 * `data-part` elements on hover/focus. Without that stylesheet the classes are
 * inert. A consumer `className` is appended, not overwritten.
 */
export function personaIconHifi(
  displayName: string,
  body: string,
  key: string,
): ComponentType<PersonaIconHifiProps> {
  const base = `pi-hifi pi-hifi-${key}`;
  function Icon({ size = 48, animate, className, ...rest }: PersonaIconHifiProps) {
    const cls = [base, animate ? 'pi-animate' : '', className].filter(Boolean).join(' ');
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        focusable="false"
        className={cls}
        dangerouslySetInnerHTML={{ __html: body }}
        {...rest}
      />
    );
  }
  Icon.displayName = displayName;
  return Icon;
}
