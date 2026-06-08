#!/usr/bin/env python3
"""build_sona_pixel.py — Phase 2: Sonaloop's FIRST 100%-own typeface, drawn in code.

"Sona Pixel Loop" is a clean-room 5x7 bitmap display face. Every glyph is authored here as a
pixel grid (below) and rendered to real outlines with fontTools — there is **no Geist (or any
other) outline data in it**, so it is wholly Sonaloop's, under whatever license we choose.

On-brand by construction: each "pixel" is drawn as a soft round dot (the loop mark is a
continuous loop of nodes), giving the Circle-fill warmth without depending on Geist Pixel.
Display ONLY (loaders, council ids, "SONALOOP") — caps-height; lowercase maps to the caps.

    python3 scripts/build_sona_pixel.py [--shape dot|square]

Outputs fonts/SonaPixelLoop-Regular.woff2 (family "Sona Pixel Loop"). Requires fonttools+brotli.
"""
from __future__ import annotations
import sys, math, pathlib
from fontTools.fontBuilder import FontBuilder
from fontTools.pens.ttGlyphPen import TTGlyphPen

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "fonts" / "SonaPixelLoop-Regular.woff2"

CELL = 100            # units per pixel cell (UPM 1000)
COLS, ROWS = 5, 7     # 5 wide x 7 tall
ADV = (COLS + 1) * CELL   # one empty column of side-bearing → 600
ASCENT, DESCENT = 800, -200

# ── glyph bitmaps: 7 rows top→bottom, 5 cols, '#' = on ──────────────────────────────
B = {}
def g(ch, art): B[ch] = [r for r in art.strip("\n").split("\n")]

g("A", ".###.\n#...#\n#...#\n#####\n#...#\n#...#\n#...#")
g("B", "####.\n#...#\n#...#\n####.\n#...#\n#...#\n####.")
g("C", ".####\n#....\n#....\n#....\n#....\n#....\n.####")
g("D", "###..\n#..#.\n#...#\n#...#\n#...#\n#..#.\n###..")
g("E", "#####\n#....\n#....\n####.\n#....\n#....\n#####")
g("F", "#####\n#....\n#....\n####.\n#....\n#....\n#....")
g("G", ".####\n#....\n#....\n#.###\n#...#\n#...#\n.####")
g("H", "#...#\n#...#\n#...#\n#####\n#...#\n#...#\n#...#")
g("I", "#####\n..#..\n..#..\n..#..\n..#..\n..#..\n#####")
g("J", "..###\n...#.\n...#.\n...#.\n#..#.\n#..#.\n.##..")
g("K", "#...#\n#..#.\n#.#..\n##...\n#.#..\n#..#.\n#...#")
g("L", "#....\n#....\n#....\n#....\n#....\n#....\n#####")
g("M", "#...#\n##.##\n#.#.#\n#...#\n#...#\n#...#\n#...#")
g("N", "#...#\n##..#\n#.#.#\n#.#.#\n#..##\n#...#\n#...#")
g("O", ".###.\n#...#\n#...#\n#...#\n#...#\n#...#\n.###.")
g("P", "####.\n#...#\n#...#\n####.\n#....\n#....\n#....")
g("Q", ".###.\n#...#\n#...#\n#...#\n#.#.#\n#..#.\n.##.#")
g("R", "####.\n#...#\n#...#\n####.\n#.#..\n#..#.\n#...#")
g("S", ".####\n#....\n#....\n.###.\n....#\n....#\n####.")
g("T", "#####\n..#..\n..#..\n..#..\n..#..\n..#..\n..#..")
g("U", "#...#\n#...#\n#...#\n#...#\n#...#\n#...#\n.###.")
g("V", "#...#\n#...#\n#...#\n#...#\n#...#\n.#.#.\n..#..")
g("W", "#...#\n#...#\n#...#\n#...#\n#.#.#\n##.##\n#...#")
g("X", "#...#\n#...#\n.#.#.\n..#..\n.#.#.\n#...#\n#...#")
g("Y", "#...#\n#...#\n.#.#.\n..#..\n..#..\n..#..\n..#..")
g("Z", "#####\n....#\n...#.\n..#..\n.#...\n#....\n#####")

g("0", ".###.\n#...#\n#..##\n#.#.#\n##..#\n#...#\n.###.")
g("1", "..#..\n.##..\n..#..\n..#..\n..#..\n..#..\n.###.")
g("2", ".###.\n#...#\n....#\n...#.\n..#..\n.#...\n#####")
g("3", "#####\n...#.\n..#..\n...#.\n....#\n#...#\n.###.")
g("4", "...#.\n..##.\n.#.#.\n#..#.\n#####\n...#.\n...#.")
g("5", "#####\n#....\n####.\n....#\n....#\n#...#\n.###.")
g("6", ".###.\n#....\n#....\n####.\n#...#\n#...#\n.###.")
g("7", "#####\n....#\n...#.\n..#..\n.#...\n.#...\n.#...")
g("8", ".###.\n#...#\n#...#\n.###.\n#...#\n#...#\n.###.")
g("9", ".###.\n#...#\n#...#\n.####\n....#\n....#\n.###.")

g(" ", ".....\n.....\n.....\n.....\n.....\n.....\n.....")
g("!", "..#..\n..#..\n..#..\n..#..\n..#..\n.....\n..#..")
g('"', ".#.#.\n.#.#.\n.#.#.\n.....\n.....\n.....\n.....")
g("#", ".#.#.\n.#.#.\n#####\n.#.#.\n#####\n.#.#.\n.#.#.")
g("%", "##..#\n##.#.\n...#.\n..#..\n.#...\n#.##.\n#..##")
g("&", ".##..\n#..#.\n#.#..\n.#...\n#.#.#\n#..#.\n.##.#")
g("'", "..#..\n..#..\n.#...\n.....\n.....\n.....\n.....")
g("(", "..##.\n.#...\n.#...\n.#...\n.#...\n.#...\n..##.")
g(")", ".##..\n...#.\n...#.\n...#.\n...#.\n...#.\n.##..")
g("*", ".....\n..#..\n#.#.#\n.###.\n#.#.#\n..#..\n.....")
g("+", ".....\n..#..\n..#..\n#####\n..#..\n..#..\n.....")
g(",", ".....\n.....\n.....\n.....\n.##..\n.##..\n.#...")
g("-", ".....\n.....\n.....\n.###.\n.....\n.....\n.....")
g(".", ".....\n.....\n.....\n.....\n.....\n.##..\n.##..")
g("/", "....#\n....#\n...#.\n..#..\n.#...\n#....\n#....")
g(":", ".....\n.##..\n.##..\n.....\n.##..\n.##..\n.....")
g(";", ".....\n.##..\n.##..\n.....\n.##..\n.##..\n.#...")
g("<", "...#.\n..#..\n.#...\n#....\n.#...\n..#..\n...#.")
g("=", ".....\n.....\n#####\n.....\n#####\n.....\n.....")
g(">", ".#...\n..#..\n...#.\n....#\n...#.\n..#..\n.#...")
g("?", ".###.\n#...#\n....#\n..##.\n..#..\n.....\n..#..")
g("@", ".###.\n#...#\n#.###\n#.#.#\n#.###\n#....\n.###.")
g("[", ".###.\n.#...\n.#...\n.#...\n.#...\n.#...\n.###.")
g("\\", "#....\n#....\n.#...\n..#..\n...#.\n....#\n....#")
g("]", ".###.\n...#.\n...#.\n...#.\n...#.\n...#.\n.###.")
g("_", ".....\n.....\n.....\n.....\n.....\n.....\n#####")
g("·", ".....\n.....\n.....\n.##..\n.##..\n.....\n.....")

# PostScript-safe glyph names
NAMES = {
    " ": "space", "!": "exclam", '"': "quotedbl", "#": "numbersign", "%": "percent",
    "&": "ampersand", "'": "quotesingle", "(": "parenleft", ")": "parenright",
    "*": "asterisk", "+": "plus", ",": "comma", "-": "hyphen", ".": "period",
    "/": "slash", ":": "colon", ";": "semicolon", "<": "less", "=": "equal",
    ">": "greater", "?": "question", "@": "at", "[": "bracketleft", "\\": "backslash",
    "]": "bracketright", "_": "underscore", "·": "periodcentered",
    **{c: c for c in "ABCDEFGHIJKLMNOPQRSTUVWXYZ"},
    **{d: n for d, n in zip("0123456789",
        "zero one two three four five six seven eight nine".split())},
}


def dot(pen, cx, cy, r):
    k = 0.9142 * r                       # 4-segment quadratic ≈ circle
    pen.moveTo((cx + r, cy))
    pen.qCurveTo((cx + k, cy + k), (cx, cy + r))
    pen.qCurveTo((cx - k, cy + k), (cx - r, cy))
    pen.qCurveTo((cx - k, cy - k), (cx, cy - r))
    pen.qCurveTo((cx + k, cy - k), (cx + r, cy))
    pen.closePath()


def square(pen, x0, y0, x1, y1):
    pen.moveTo((x0, y0)); pen.lineTo((x0, y1)); pen.lineTo((x1, y1)); pen.lineTo((x1, y0))
    pen.closePath()


def glyph(rows, shape):
    pen = TTGlyphPen(None)
    for i, row in enumerate(rows):
        for j, ch in enumerate(row):
            if ch != "#":
                continue
            cx, cy = j * CELL + CELL // 2, (6 - i) * CELL + CELL // 2
            if shape == "square":
                square(pen, cx - 46, cy - 46, cx + 46, cy + 46)   # tiny gap → grid feel
            else:
                dot(pen, cx, cy, 52)                              # slight overlap → soft loop
    return pen.glyph()


def main() -> int:
    shape = "square" if "--shape" in sys.argv and "square" in sys.argv else "dot"
    fb = FontBuilder(1000, isTTF=True)
    chars = list(B.keys())
    order = [".notdef"] + [NAMES[c] for c in chars]
    fb.setupGlyphOrder(order)

    cmap = {ord(c): NAMES[c] for c in chars}
    for c in "ABCDEFGHIJKLMNOPQRSTUVWXYZ":     # lowercase → caps (display face)
        cmap[ord(c.lower())] = NAMES[c]
    fb.setupCharacterMap(cmap)

    glyphs = {".notdef": TTGlyphPen(None).glyph()}
    glyphs.update({NAMES[c]: glyph(B[c], shape) for c in chars})
    fb.setupGlyf(glyphs)
    fb.setupHorizontalMetrics({n: (ADV, 0) for n in order})
    fb.setupHorizontalHeader(ascent=ASCENT, descent=DESCENT)
    fb.setupNameTable({
        "familyName": "Sona Pixel Loop",
        "styleName": "Regular",
        "uniqueFontIdentifier": "Sonaloop;SonaPixelLoop-Regular;2026",
        "fullName": "Sona Pixel Loop",
        "version": "Version 1.000",
        "psName": "SonaPixelLoop-Regular",
        "copyright": ("Copyright 2026 Sonaloop. Sona Pixel Loop is an original Sonaloop "
                      "typeface (no third-party outlines). Licensed under SIL OFL 1.1."),
    })
    fb.setupOS2(sTypoAscender=ASCENT, sTypoDescender=DESCENT, sTypoLineGap=0,
                usWinAscent=ASCENT, usWinDescent=-DESCENT)
    fb.setupPost()
    fb.font.flavor = "woff2"
    fb.font.save(OUT)
    print(f"  ✓ {OUT.name}  ({shape})  {len(chars)} glyphs, 100% Sonaloop-owned")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
