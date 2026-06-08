/// <reference path="./assets.d.ts" />
/**
 * sonaloop-design — reference images.
 *
 * The icon library ships geometry; this ships a small, curated set of **brand
 * reference images** so every product repo can pull the *same* canonical asset
 * instead of each carrying its own copy (and drifting). These are not the only
 * images a product may use — they are the blessed, on-brand variants to reach
 * for first.
 *
 * Every canvas is a **themed pair**: a `light` and a `dark` variant that share
 * one composition (the dark twin is generated from the light — see
 * `scripts/generate-canvas.mjs`). Pick the variant for the active theme:
 *
 *   import { canvas, mist } from 'sonaloop-design/images';
 *   <img src={canvas.light} alt="" className="dark:hidden" />
 *   <img src={canvas.dark}  alt="" className="hidden dark:block" />
 *
 * Each variant is `import`ed so the consuming bundler emits and content-hashes
 * it; the value is the resolved URL string, drop-in for `<img src>` / `background`.
 *
 * The website consumes this straight from source via its Vite alias
 * (`sonaloop-design/images`); published builds expose it through the package
 * `exports` map. The raw files live under `images/canvas/` and are listed in the
 * package `files` allow-list. To add a pair: generate it, `import` both files
 * below, and register it in `canvases`.
 */
import dawn from '../images/canvas/dawn.jpg';
import dusk from '../images/canvas/dusk.jpg';
import abstractLight from '../images/canvas/abstract-light.jpg';
import abstractDark from '../images/canvas/abstract-dark.jpg';
import mistLight from '../images/canvas/mist-light.jpg';
import mistDark from '../images/canvas/mist-dark.jpg';
import meadowLight from '../images/canvas/meadow-light.jpg';
import meadowDark from '../images/canvas/meadow-dark.jpg';
import skyLight from '../images/canvas/sky-light.jpg';
import skyDark from '../images/canvas/sky-dark.jpg';

/** A color scheme a variant is tuned for. */
export type ImageScheme = 'light' | 'dark';

/** A matched light/dark backdrop. `light`/`dark` are bundler-resolved URLs. */
export interface CanvasPair {
  /** Stable key (also the registry key). */
  name: string;
  /** Human-readable label. */
  label: string;
  /** One-line description / intended use. */
  description: string;
  /** URL of the light-theme variant — content-hashed in production builds. */
  light: string;
  /** URL of the dark-theme variant — content-hashed in production builds. */
  dark: string;
  /** Intrinsic pixel dimensions (both variants share them). */
  width: number;
  height: number;
}

const dim = { width: 1800, height: 1200 } as const;

/** Atmospheric oil-painted backdrop — soft hills under a wide sky. */
export const canvas: CanvasPair = {
  name: 'canvas',
  label: 'Canvas',
  description: 'Atmospheric oil-painted backdrop — soft hills under a wide sky.',
  light: dawn,
  dark: dusk,
  ...dim,
};

/** Pure colour-field wash — no horizon, no subject. The most reusable backdrop. */
export const abstract: CanvasPair = {
  name: 'abstract',
  label: 'Abstract',
  description: 'A pure colour-field wash in the brand palette — no recognizable subject.',
  light: abstractLight,
  dark: abstractDark,
  ...dim,
};

/** Soft mist over a still, reflective plane — quiet and contemplative. */
export const mist: CanvasPair = {
  name: 'mist',
  label: 'Mist',
  description: 'Layered morning mist over a still reflective plane, lots of open space.',
  light: mistLight,
  dark: mistDark,
  ...dim,
};

/** Soft, blurred wildflower meadow under a wide open sky. */
export const meadow: CanvasPair = {
  name: 'meadow',
  label: 'Meadow',
  description: 'A soft, blurred wildflower meadow under a wide open sky.',
  light: meadowLight,
  dark: meadowDark,
  ...dim,
};

/** An almost-empty atmospheric sky — maximum quiet, open headline space. */
export const sky: CanvasPair = {
  name: 'sky',
  label: 'Sky',
  description: 'An almost-empty atmospheric sky with soft cloud banding.',
  light: skyLight,
  dark: skyDark,
  ...dim,
};

/**
 * Every canvas pair, keyed by name — the single source of truth tooling reads.
 */
export const canvases = { canvas, abstract, mist, meadow, sky } satisfies Record<string, CanvasPair>;

export type CanvasName = keyof typeof canvases;

// ── back-compat: the original dawn/dusk variants, also reachable directly ──────
/** Canvas backdrop tuned for the light theme (alias of `canvas.light`). */
export const canvasDawn: string = dawn;
/** Canvas backdrop tuned for the dark theme (alias of `canvas.dark`). */
export const canvasDusk: string = dusk;
