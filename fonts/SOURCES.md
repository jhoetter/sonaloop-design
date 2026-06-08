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
| `SonaPixel-Line.woff2` | `Sona Pixel` (default) / `Sona Pixel Line` | `geist-pixel/GeistPixel-Line.woff2` |
| `SonaPixel-Square.woff2` | `Sona Pixel Square` | `geist-pixel/GeistPixel-Square.woff2` |
| `SonaPixel-Circle.woff2` | `Sona Pixel Circle` | `geist-pixel/GeistPixel-Circle.woff2` |
| `SonaPixel-Grid.woff2` | `Sona Pixel Grid` | `geist-pixel/GeistPixel-Grid.woff2` |
| `SonaPixel-Triangle.woff2` | `Sona Pixel Triangle` | `geist-pixel/GeistPixel-Triangle.woff2` |

**Sona Pixel** is a high-res bitmap display face; the **default `--sl-pixel` family is the Line
fill**. It is Geist-derived (renamed), exactly like the text faces above — chosen for fidelity to
the Geist Pixel look. A fully **clean-room** own pixel face (a 5×7 bitmap drawn entirely in code,
no third-party outlines) is also available but **not active by default** — see below.

## Optional: a 100% clean-room own pixel face

[`../scripts/build_sona_pixel.py`](../scripts/build_sona_pixel.py) generates `Sona Pixel` from
scratch — every glyph authored as a 5×7 bitmap, no Geist outlines, wholly Sonaloop's. It reads
coarser/blockier than Geist Pixel, so it is kept as a future *license-clean* option rather than
the active face. To adopt it, generate the woff2 and repoint `styles/fonts.css` at them.

## Reproduce from scratch

```sh
# all faces (text + pixel) — download Geist, then rename Geist → Sona
base="https://cdn.jsdelivr.net/npm/geist@1.7.2/dist/fonts"
curl -sSL -o fonts/Sona-Variable.woff2      "$base/geist-sans/Geist-Variable.woff2"
curl -sSL -o fonts/SonaMono-Variable.woff2  "$base/geist-mono/GeistMono-Variable.woff2"
for v in Square Circle Grid Line Triangle; do
  curl -sSL -o "fonts/SonaPixel-$v.woff2" "$base/geist-pixel/GeistPixel-$v.woff2"
done
python3 scripts/build_sona_fonts.py          # rename, OFL-compliant (needs fonttools, brotli)
python3 scripts/build_sona_fonts.py --check   # verify

# optional: the clean-room own pixel face instead
# python3 scripts/build_sona_pixel.py

npm run gen   # regenerate the token layer
```

See **BRANDING.md → "Sona — provenance & roadmap"** for the plan to evolve Sona into a
truly bespoke face.
