# Sona — font sources & provenance

These are Sonaloop's **Sona** webfonts. They live in the repo so the brand renders with
zero third-party dependency (no Google Fonts). Declared in [`../styles/fonts.css`](../styles/fonts.css);
referenced everywhere by name via `--sl-sans` / `--sl-mono` / `--sl-pixel`.

## Text faces (v0 — built on Geist)

The **text** faces (`Sona`, `Sona Mono`) are currently **derived from Geist** (© 2023 Vercel, in
collaboration with basement.studio), licensed **SIL Open Font License 1.1** — see
[`LICENSE-Geist.txt`](./LICENSE-Geist.txt). The OFL permits redistribution and bundling, and
*requires* a new name for modified versions — so the "Sona" naming is exactly the right move.

What we changed: **outlines are unchanged**; we rewrote each font's internal `name` table from
Geist → Sona via [`../scripts/build_sona_fonts.py`](../scripts/build_sona_fonts.py) (fontTools),
keeping the original copyright + OFL records and appending a derivation note. So the binaries
themselves now report a Sona family — not just our CSS alias.

| file | family | source (Geist v1.7.2) |
|------|--------|------------------------|
| `Sona-Variable.woff2` | `Sona` | `geist-sans/Geist-Variable.woff2` |
| `SonaMono-Variable.woff2` | `Sona Mono` | `geist-mono/GeistMono-Variable.woff2` |

## Sona Pixel — 100% Sonaloop original (clean-room)

The entire **Sona Pixel** family contains **no Geist (or any third-party) outline data**. Every
glyph is a 5×7 bitmap authored in [`../scripts/build_sona_pixel.py`](../scripts/build_sona_pixel.py)
and rasterised to outlines with fontTools — wholly Sonaloop's, under any license we choose
(currently OFL 1.1, © 2026 Sonaloop). One bitmap source, four "fills":

| file | family | fill |
|------|--------|------|
| `SonaPixelLoop-Regular.woff2` | `Sona Pixel Loop` | round dots (brand-native) |
| `SonaPixelSquare-Regular.woff2` | `Sona Pixel` / `Sona Pixel Square` | solid blocks (default) |
| `SonaPixelGrid-Regular.woff2` | `Sona Pixel Grid` | small blocks, gaps |
| `SonaPixelLine-Regular.woff2` | `Sona Pixel Line` | hollow outlined cells |

Regenerate / restyle: `python3 scripts/build_sona_pixel.py [Loop Square Grid Line]`.

> The earlier Geist-derived `SonaPixel-{Square,Circle,Grid,Line,Triangle}.woff2` have been
> **retired** — the pixel slot is now fully license-clean.

## Reproduce from scratch

```sh
# text faces — download Geist (the upstream we currently build on) then rename Geist → Sona
base="https://cdn.jsdelivr.net/npm/geist@1.7.2/dist/fonts"
curl -sSL -o fonts/Sona-Variable.woff2      "$base/geist-sans/Geist-Variable.woff2"
curl -sSL -o fonts/SonaMono-Variable.woff2  "$base/geist-mono/GeistMono-Variable.woff2"
python3 scripts/build_sona_fonts.py          # rename, OFL-compliant (needs fonttools, brotli)
python3 scripts/build_sona_fonts.py --check   # verify

# Sona Pixel — generate our own from code (no download)
python3 scripts/build_sona_pixel.py

# regenerate the token layer (--sl-sans / --sl-mono / --sl-pixel, Tailwind)
npm run gen
```

See **BRANDING.md → "Sona — provenance & roadmap"** for the plan to evolve Sona into a
truly bespoke face.
