import type { ComponentType, SVGAttributes } from 'react';

export type SonaloopFigureProps = SVGAttributes<SVGSVGElement> & {
  /** Rendered width in px (height follows the fixed 480×400 aspect). */
  width?: number | string;
  /** Opt in to the hover/focus ambient gesture (needs `sonaloop-design/style.css`). */
  animate?: boolean;
};

export type SonaloopFigure = ComponentType<SonaloopFigureProps>;

/**
 * Builds a figure — a high-fidelity 480×400 illustrative plate — from raw SVG
 * inner-markup. Figures are the system's large fine-line isometric drawings
 * (the "FIG 0.x" plates); they draw entirely on `currentColor` with their own
 * stroke-opacity hierarchy, so one asset works on light and dark alike.
 *
 *   import { LoopFigure } from 'sonaloop-design'
 *   <LoopFigure width={480} className="text-ink" />
 *   <LoopFigure animate />        // ambient hover gesture (opt-in)
 *
 * The markup originates from `figures.data.mjs` and is injected as a static
 * string, so it is trusted (build-time constant, never user input).
 *
 * The root carries `pi-fig pi-fig-<key>`; `animate` adds `pi-animate`, the
 * gate the stylesheet (`sonaloop-design/style.css`) requires. Default static.
 */
export function sonaloopFigure(displayName: string, body: string, key: string): SonaloopFigure {
  const base = `pi-fig pi-fig-${key}`;
  function Figure({ width = 480, animate, className, ...rest }: SonaloopFigureProps) {
    const height = typeof width === 'number' ? (width * 400) / 480 : undefined;
    const cls = [base, animate ? 'pi-animate' : '', className].filter(Boolean).join(' ');
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox="0 0 480 400"
        fill="none"
        stroke="currentColor"
        strokeWidth={1}
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
  Figure.displayName = displayName;
  return Figure;
}
