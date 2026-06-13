"""sonaloop-design — Markdown renderer (hand-authored; the Python side of the prose surface).

The single source of truth for turning host-authored Markdown into the HTML that the shared
`.sl-prose` reading surface styles. Every Python-SSR app (sonaloop core, -cloud, -content) renders
the same authored subset identically by importing from here, so a council finding, a synthesis body
and a content-drive note all read the same. The styling source of truth is ../../styles/components.css
(`.sl-prose`, `.sl-table*`); this module emits matching, self-contained, static HTML (no JS).

Covered (the host-authored subset): #/##/### headings, **bold**/_italic_/`code`/[links]/~~del~~,
`-`/`*`/`•` and `1.` lists, `>` blockquotes, `---` rules, ``` fenced code, pipe tables, paragraphs,
and `![alt](src)` images (with an optional `resolve_src` hook to rewrite relative URLs).

    from sonaloop_icons.markdown import render_markdown, render_inline, escape
    render_markdown("## Hello\\n\\n- a\\n- b")          # block-level Markdown -> HTML
    render_inline("**bold** and `code`")               # one line/paragraph -> HTML
    render_markdown(note, resolve_src=to_raw_url)      # rewrite relative image src (e.g. -> /api/raw)

Headings are intentionally de-ranked (`#`/`##` -> <h3>, `###`/`####` -> <h4>) so embedded document
headings never compete with the page's own h1/h2. Output is byte-for-byte compatible with the core
renderer it was promoted from, so consumers can adopt it as a drop-in.
"""

from __future__ import annotations

import html
import re
from collections.abc import Callable

__all__ = ["render_markdown", "render_inline", "escape"]

# A hook that rewrites an image/link URL (e.g. resolve a relative path to /api/raw). None = identity.
ResolveSrc = Callable[[str], str] | None


def escape(value: object) -> str:
    """HTML-escape any value for safe inline embedding."""
    return html.escape(str(value))


def render_inline(s: str, *, resolve_src: ResolveSrc = None) -> str:
    """Inline Markdown -> HTML (auto-escaped): images, `code`, [text](/url), **bold**, ~~strike~~,
    _italic_, *italic*. Images, code spans and links are processed first and protected so their
    content isn't re-formatted. `resolve_src`, if given, rewrites image URLs (e.g. relative -> absolute)."""
    s = escape(s)
    holds: list[str] = []

    def _hold(markup: str) -> str:
        holds.append(markup)
        return f"\x00{len(holds) - 1}\x00"

    def _src(u: str) -> str:
        return resolve_src(u) if resolve_src else u

    # Images first (![alt](src)) — before links, since the syntax nests []().
    s = re.sub(r"!\[([^\]]*)\]\(([^)\s]+)\)",
               lambda m: _hold(f'<img alt="{m.group(1)}" src="{_src(m.group(2))}">'), s)
    s = re.sub(r"`([^`]+)`", lambda m: _hold("<code>" + m.group(1) + "</code>"), s)
    s = re.sub(r"\[([^\]]+)\]\((https?://[^)\s]+|/[^)\s]*)\)",
               lambda m: _hold(f'<a href="{m.group(2)}">{m.group(1)}</a>'), s)
    s = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", s)
    s = re.sub(r"~~(.+?)~~", r"<del>\1</del>", s)
    s = re.sub(r"(?<![\w*])\*(?!\s)([^*]+?)(?<!\s)\*(?![\w*])", r"<em>\1</em>", s)   # *italic*
    s = re.sub(r"(?<![\w_])_(?!\s)([^_]+?)(?<!\s)_(?![\w_])", r"<em>\1</em>", s)     # _italic_ (not word-internal)
    for k, markup in enumerate(holds):
        s = s.replace(f"\x00{k}\x00", markup)
    return s


def render_markdown(text: str, *, resolve_src: ResolveSrc = None) -> str:
    """Minimal-but-real GitHub-flavored Markdown -> HTML (no deps). Covers the host-authored subset:
    #/##/### headings, **bold**/_italic_/`code`/[links]/~~del~~, `-`/`*` and `1.` lists, `>` blockquotes,
    `---` rules, ``` fenced code, pipe tables, `![alt](src)` images, paragraphs. `resolve_src` rewrites
    relative image/link URLs (passed through to `render_inline`)."""
    if not text:
        return ""

    def _inline(s: str) -> str:
        return render_inline(s, resolve_src=resolve_src)

    def _cells(row: str) -> list[str]:
        return [c.strip() for c in row.strip().strip("|").split("|")]

    lines = text.split("\n")
    n = len(lines)
    out: list[str] = []
    stack: list[str] = []
    i = 0

    def _close() -> None:                          # close any open list(s)
        while stack:
            out.append(f"</{stack.pop()}>")

    while i < n:
        line = lines[i].rstrip()
        stripped = line.lstrip()
        if stripped.startswith("```"):             # fenced code block
            _close()
            j = i + 1
            buf = []
            while j < n and not lines[j].lstrip().startswith("```"):
                buf.append(escape(lines[j]))
                j += 1
            out.append("<pre><code>" + "\n".join(buf) + "</code></pre>")
            i = j + 1
            continue
        if stripped.startswith("|") and i + 1 < n:  # pipe table (header + |---| separator)
            sep = lines[i + 1].strip()
            if sep.startswith("|") and "-" in sep and not set(sep) - set("|:- "):
                _close()
                header = _cells(stripped)
                j = i + 2
                rows = []
                while j < n and lines[j].strip().startswith("|"):
                    rows.append(_cells(lines[j]))
                    j += 1
                th = "".join(f"<th>{_inline(c)}</th>" for c in header)
                trs = "".join("<tr>" + "".join(f"<td>{_inline(c)}</td>" for c in r) + "</tr>" for r in rows)
                out.append(f'<table class="sl-table sl-table--bordered sl-table--zebra">'
                           f'<thead><tr>{th}</tr></thead><tbody>{trs}</tbody></table>')
                i = j
                continue
        if not stripped:
            _close()
            i += 1
            continue
        if re.fullmatch(r"(-{3,}|\*{3,}|_{3,})", stripped):     # horizontal rule
            _close()
            out.append("<hr>")
            i += 1
            continue
        if stripped.startswith(">"):                 # blockquote (consume consecutive > lines)
            _close()
            buf = []
            while i < n and lines[i].lstrip().startswith(">"):
                buf.append(lines[i].lstrip()[1:].lstrip())
                i += 1
            out.append("<blockquote>" + _inline(" ".join(buf)) + "</blockquote>")
            continue
        m = re.match(r"\d+\.\s+(.*)", stripped)      # ordered list
        if m:
            if not (stack and stack[-1] == "ol"):
                _close()
                out.append("<ol>")
                stack.append("ol")
            out.append(f"<li>{_inline(m.group(1))}</li>")
            i += 1
            continue
        if stripped[:2] in ("- ", "* ") or stripped.startswith("• "):   # unordered list
            if not (stack and stack[-1] == "ul"):
                _close()
                out.append("<ul>")
                stack.append("ul")
            out.append(f"<li>{_inline(stripped[2:].lstrip())}</li>")
            i += 1
            continue
        _close()
        if stripped.startswith("#### "):
            out.append(f"<h4>{_inline(stripped[5:])}</h4>")
        elif stripped.startswith("### "):
            out.append(f"<h4>{_inline(stripped[4:])}</h4>")
        elif stripped.startswith("## "):
            out.append(f"<h3>{_inline(stripped[3:])}</h3>")
        elif stripped.startswith("# "):
            out.append(f"<h3>{_inline(stripped[2:])}</h3>")
        else:
            out.append(f"<p>{_inline(line)}</p>")
        i += 1
    _close()
    return "\n".join(out)
