/// <reference path="./assets.d.ts" />
/**
 * sonaloop-design — brand films.
 *
 * Cinematic product films, treated exactly like the reference images: authored
 * once, imported everywhere, themed pairs. Rendered by the cinematic pipeline
 * (`~/repos/cinematic-product-videos`, `buildPageFilm.ts` — the director's
 * plans, shot grammar and embed contract live there); the finished masters are
 * checked in HERE as the canonical assets products consume.
 *
 * Every film is a **themed pair** whose backdrop equals the `--paper` token of
 * its theme EXACTLY (embed mode), so it melts seamlessly into any page surface:
 *
 *   import { heroOpenCore } from 'sonaloop-design/films';
 *   <video src={heroOpenCore.light} autoPlay muted loop playsInline className="dark:hidden" />
 *   <video src={heroOpenCore.dark}  autoPlay muted loop playsInline className="hidden dark:block" />
 *
 * `shield` is the matching text-protection overlay (per-pixel Gaussian falloff
 * with dither — a CSS gradient would band): place it behind text that sits on
 * a film.
 *
 * To update: re-render in the pipeline, copy the masters into `films/hero/`,
 * keep the names stable.
 */
import heroOpenCoreLight from '../films/hero/open-core-light.mp4';
import heroOpenCoreDark from '../films/hero/open-core-dark.mp4';
import shieldLight from '../films/hero/shield-light.png';
import shieldDark from '../films/hero/shield-dark.png';

/** A matched light/dark film. URLs are bundler-resolved (content-hashed). */
export interface FilmPair {
  /** Stable key (also the registry key). */
  name: string;
  /** Human-readable label. */
  label: string;
  /** One-line description / intended use. */
  description: string;
  /** URL of the light-theme master. */
  light: string;
  /** URL of the dark-theme master. */
  dark: string;
  /** Intrinsic pixel dimensions (both variants share them). */
  width: number;
  height: number;
  /** Duration in seconds. */
  duration: number;
}

/**
 * The open-core hero film — "the council answers": a three-act causal story
 * (the question stands and Priya's answer arrives → Marcus's dissent types
 * out live → the council lands as a row on the project board). Backdrop is
 * token-exact for seamless full-bleed embedding behind hero text.
 */
export const heroOpenCore: FilmPair = {
  name: 'heroOpenCore',
  label: 'Open Core hero',
  description:
    '"The council answers" — question asked, a dissent typed live, the council landing on the project board. Token-exact backdrop for seamless embedding.',
  light: heroOpenCoreLight,
  dark: heroOpenCoreDark,
  width: 3840,
  height: 2160,
  duration: 16,
};

/**
 * The hero text shield — a Gaussian-falloff overlay (with dither, alpha
 * reaching literal zero inside its bounds) that keeps headline text readable
 * over a film without any detectable boundary. Sized 1600×1000; stretch it
 * generously around the text block.
 */
export const shield = {
  name: 'shield',
  label: 'Text shield',
  description:
    'Gaussian text-protection overlay for copy sitting on films — boundary-free by construction.',
  light: shieldLight,
  dark: shieldDark,
  width: 1600,
  height: 1000,
} as const;

/** Every film pair, keyed by name — the single source of truth tooling reads. */
export const films = { heroOpenCore } satisfies Record<string, FilmPair>;

export type FilmName = keyof typeof films;
