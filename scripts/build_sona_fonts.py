#!/usr/bin/env python3
"""build_sona_fonts.py — Phase 1 of "Sona, our own face", done in code (no font editor).

Forks the vendored Geist webfonts into genuinely *Sona-named* binaries with fontTools:
rewrites the OpenType `name` table (family / full / PostScript / unique / VF prefix) from
Geist → Sona, KEEPS the original copyright + SIL OFL license records (OFL requires this on
any derivative) and appends a one-line derivation note. This is the legitimate OFL move: a
modified version MUST NOT carry the reserved name "Geist", so renaming to "Sona" is exactly
right — and now the binaries themselves say Sona, not just our CSS @font-face alias.

Re-runnable and fully reversible: re-download Geist (see fonts/SOURCES.md) and re-run.
Idempotent: the copyright note is only appended once.

    python3 scripts/build_sona_fonts.py [--check]

  --check   verify every /fonts binary already reports a Sona family (CI / pre-commit);
            exits non-zero if any still says "Geist". Makes no changes.

Requires: fonttools, brotli (woff2). Operates in-place on /fonts.
"""
from __future__ import annotations
import sys, pathlib
from fontTools.ttLib import TTFont

ROOT = pathlib.Path(__file__).resolve().parent.parent
FONTS = ROOT / "fonts"

# file → Sona family name (the four alt pixel fills get their own family, matching styles/fonts.css)
FAMILIES = {
    "Sona-Variable.woff2":       "Sona",
    "SonaMono-Variable.woff2":   "Sona Mono",
    "SonaPixel-Square.woff2":    "Sona Pixel",
    "SonaPixel-Circle.woff2":    "Sona Pixel Circle",
    "SonaPixel-Grid.woff2":      "Sona Pixel Grid",
    "SonaPixel-Line.woff2":      "Sona Pixel Line",
    "SonaPixel-Triangle.woff2":  "Sona Pixel Triangle",
}

NOTE = ("Sona is a Sonaloop typeface derived from Geist (c) 2023 Vercel, in collaboration "
        "with basement.studio, used under the SIL Open Font License 1.1. Outlines unchanged; "
        "renamed for Sonaloop. See fonts/LICENSE-Geist.txt.")

# (platformID, platEncID, langID): Windows-Unicode-en-US and Mac-Roman-en — the two that matter.
PLATFORMS = [(3, 1, 0x409), (1, 0, 0)]


def ps(s: str) -> str:
    """PostScript-safe: no spaces or the 10 reserved chars."""
    return "".join(c for c in s if c.isalnum())


def rename(path: pathlib.Path, family: str) -> None:
    font = TTFont(path)
    name = font["name"]
    sub = name.getDebugName(2) or "Regular"          # keep the subfamily (Regular / weight)
    full = family if sub == "Regular" else f"{family} {sub}"
    psname = f"{ps(family)}-{ps(sub)}"

    # nameID → new string for the records that carry the typeface's identity.
    new = {1: family, 16: family, 4: full, 6: psname, 3: f"Sonaloop:{full}", 25: ps(family)}
    for nid, val in new.items():
        for p in PLATFORMS:
            name.setName(val, nid, *p)

    # Keep copyright (0) + OFL license (13/14); append our derivation note once.
    cur = name.getDebugName(0) or ""
    if "Sonaloop" not in cur:
        for p in PLATFORMS:
            name.setName((cur + "  " + NOTE).strip(), 0, *p)

    font.save(path)  # flavor (woff2) is preserved from load
    print(f"  ✓ {path.name:28} → {family}")


def check() -> int:
    bad = 0
    for fn, fam in FAMILIES.items():
        got = TTFont(FONTS / fn)["name"].getDebugName(1) or ""
        ok = got == fam
        print(f"  {'✓' if ok else '✗'} {fn:28} family = {got!r}")
        bad += not ok
    return bad


def main() -> int:
    if "--check" in sys.argv:
        n = check()
        print("all Sona-named." if not n else f"{n} font(s) NOT renamed — run without --check.")
        return 1 if n else 0
    print("Renaming vendored Geist → Sona (in-place, OFL-compliant):")
    for fn, fam in FAMILIES.items():
        rename(FONTS / fn, fam)
    print("done. Verify: python3 scripts/build_sona_fonts.py --check")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
