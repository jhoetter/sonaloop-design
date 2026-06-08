#!/usr/bin/env python3
"""build_sona_pixel.py — Phase 2: Sonaloop's own pixel typeface family, drawn in code.

A clean-room 5x7 bitmap display family. Every glyph is authored here as a pixel grid (below)
and rendered to real outlines with fontTools — there is **no Geist (or any other) outline data
in it**, so it is wholly Sonaloop's, under whatever license we choose. Display ONLY (loaders,
council ids, "SONALOOP") — caps-height; lowercase maps to the caps.

Four "fills" share one bitmap source; only how each on-pixel is rendered differs:
  • Loop    soft round dots (the loop mark) — the brand-native default
  • Square  solid blocks — crisp, neutral
  • Grid    small blocks with gaps — schematic, blueprint-y
  • Line    hollow outlined cells — lightest

    python3 scripts/build_sona_pixel.py [Loop Square Grid Line]   # default: all four

Outputs fonts/SonaPixel{Fill}-Regular.woff2. Requires fonttools + brotli.
"""
from __future__ import annotations
import sys, pathlib
from fontTools.fontBuilder import FontBuilder
from fontTools.pens.ttGlyphPen import TTGlyphPen

ROOT = pathlib.Path(__file__).resolve().parent.parent
FONTS = ROOT / "fonts"

# fill → (shape primitive, family name, output file)
FILLS = {
    "Loop":   ("dot",    "Sona Pixel Loop",   "SonaPixelLoop-Regular.woff2"),
    "Square": ("square", "Sona Pixel Square", "SonaPixelSquare-Regular.woff2"),
    "Grid":   ("grid",   "Sona Pixel Grid",   "SonaPixelGrid-Regular.woff2"),
    "Line":   ("line",   "Sona Pixel Line",   "SonaPixelLine-Regular.woff2"),
}

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


def _rect(pen, x0, y0, x1, y1, ccw=False):
    pts = [(x0, y0), (x0, y1), (x1, y1), (x1, y0)]   # clockwise
    if ccw:
        pts.reverse()                                # counter-clockwise → cuts a hole (nonzero)
    pen.moveTo(pts[0])
    for p in pts[1:]:
        pen.lineTo(p)
    pen.closePath()


def _dot(pen, cx, cy, r):
    k = 0.9142 * r                       # 4-segment quadratic ≈ circle
    pen.moveTo((cx + r, cy))
    pen.qCurveTo((cx + k, cy + k), (cx, cy + r))
    pen.qCurveTo((cx - k, cy + k), (cx - r, cy))
    pen.qCurveTo((cx - k, cy - k), (cx, cy - r))
    pen.qCurveTo((cx + k, cy - k), (cx + r, cy))
    pen.closePath()


def cell(pen, shape, cx, cy):
    if shape == "dot":                                   # Loop — soft round dots (slight overlap)
        _dot(pen, cx, cy, 52)
    elif shape == "square":                              # Square — solid block, subtle gap
        _rect(pen, cx - 46, cy - 46, cx + 46, cy + 46)
    elif shape == "grid":                                # Grid — small block, big gap
        _rect(pen, cx - 32, cy - 32, cx + 32, cy + 32)
    elif shape == "line":                                # Line — hollow outlined cell
        _rect(pen, cx - 46, cy - 46, cx + 46, cy + 46)
        _rect(pen, cx - 28, cy - 28, cx + 28, cy + 28, ccw=True)


def glyph(rows, shape):
    pen = TTGlyphPen(None)
    for i, row in enumerate(rows):
        for j, ch in enumerate(row):
            if ch == "#":
                cell(pen, shape, j * CELL + CELL // 2, (6 - i) * CELL + CELL // 2)
    return pen.glyph()


def build(fill, shape, family, out):
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
    ps = family.replace(" ", "") + "-Regular"
    fb.setupNameTable({
        "familyName": family,
        "styleName": "Regular",
        "uniqueFontIdentifier": f"Sonaloop;{ps};2026",
        "fullName": family,
        "version": "Version 1.000",
        "psName": ps,
        "copyright": (f"Copyright 2026 Sonaloop. {family} is an original Sonaloop typeface "
                      "(no third-party outlines). Licensed under SIL OFL 1.1."),
    })
    fb.setupOS2(sTypoAscender=ASCENT, sTypoDescender=DESCENT, sTypoLineGap=0,
                usWinAscent=ASCENT, usWinDescent=-DESCENT)
    fb.setupPost()
    fb.font.flavor = "woff2"
    fb.font.save(FONTS / out)
    print(f"  ✓ {out:30} {family:20} ({fill})")


def main() -> int:
    wanted = [a for a in sys.argv[1:] if a in FILLS] or list(FILLS)
    print(f"Building Sona Pixel ({len(list(B))} glyphs each, 100% Sonaloop-owned):")
    for fill in wanted:
        shape, family, out = FILLS[fill]
        build(fill, shape, family, out)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
