/**
 * Ambient declarations for raw image imports.
 *
 * A bundler (Vite/webpack/…) resolves `import url from './x.jpg'` to the
 * emitted, content-hashed URL string. This makes that import typecheck — both
 * here and in any consumer whose `tsc` program pulls in `src/images.ts` (it is
 * referenced from there via a triple-slash directive so it always travels with
 * it). Keep in sync with the families registered in `src/images.ts`.
 */
declare module '*.jpg' {
  const src: string;
  export default src;
}
declare module '*.jpeg' {
  const src: string;
  export default src;
}
declare module '*.png' {
  const src: string;
  export default src;
}
declare module '*.webp' {
  const src: string;
  export default src;
}
declare module '*.avif' {
  const src: string;
  export default src;
}
declare module '*.mp4' {
  const src: string;
  export default src;
}
declare module '*.webm' {
  const src: string;
  export default src;
}
