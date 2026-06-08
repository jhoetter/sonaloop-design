# Sona — font sources & provenance

These are Sonaloop's **Sona** webfonts. They live in the repo so the brand renders with
zero third-party dependency (no Google Fonts). Declared in [`../styles/fonts.css`](../styles/fonts.css);
referenced everywhere by name via `--sl-sans` / `--sl-mono` / `--sl-pixel`.

## Current status (v0 — built on Geist)

Sona is currently **derived from Geist** (© 2023 Vercel, in collaboration with basement.studio),
licensed **SIL Open Font License 1.1** — see [`LICENSE-Geist.txt`](./LICENSE-Geist.txt). The OFL
permits redistribution and bundling, and *requires* a new name for modified versions — so the
"Sona" naming is exactly the right move.

What we changed: **outlines are unchanged**; we rewrote each font's internal `name` table from
Geist → Sona via [`../scripts/build_sona_fonts.py`](../scripts/build_sona_fonts.py) (fontTools),
keeping the original copyright + OFL records and appending a derivation note. So the binaries
themselves now report a Sona family — not just our CSS alias.

| file | family | source (Geist v1.7.2) |
|------|--------|------------------------|
| `Sona-Variable.woff2` | `Sona` | `geist-sans/Geist-Variable.woff2` |
| `SonaMono-Variable.woff2` | `Sona Mono` | `geist-mono/GeistMono-Variable.woff2` |
| `SonaPixel-Square.woff2` | `Sona Pixel` | `geist-pixel/GeistPixel-Square.woff2` |
| `SonaPixel-Circle.woff2` | `Sona Pixel Circle` | `geist-pixel/GeistPixel-Circle.woff2` |
| `SonaPixel-Grid.woff2` | `Sona Pixel Grid` | `geist-pixel/GeistPixel-Grid.woff2` |
| `SonaPixel-Line.woff2` | `Sona Pixel Line` | `geist-pixel/GeistPixel-Line.woff2` |
| `SonaPixel-Triangle.woff2` | `Sona Pixel Triangle` | `geist-pixel/GeistPixel-Triangle.woff2` |

## Reproduce from scratch

```sh
# 1. download Geist (the upstream we currently build on)
base="https://cdn.jsdelivr.net/npm/geist@1.7.2/dist/fonts"
curl -sSL -o fonts/Sona-Variable.woff2      "$base/geist-sans/Geist-Variable.woff2"
curl -sSL -o fonts/SonaMono-Variable.woff2  "$base/geist-mono/GeistMono-Variable.woff2"
for v in Square Circle Grid Line Triangle; do
  curl -sSL -o "fonts/SonaPixel-$v.woff2" "$base/geist-pixel/GeistPixel-$v.woff2"
done

# 2. rename the binaries Geist → Sona (OFL-compliant), in place
python3 scripts/build_sona_fonts.py          # needs: fonttools, brotli
python3 scripts/build_sona_fonts.py --check   # verify

# 3. regenerate the token layer (--sl-sans / --sl-mono / --sl-pixel, Tailwind)
npm run gen
```

See **BRANDING.md → "Sona — provenance & roadmap"** for the plan to evolve Sona into a
truly bespoke face.
