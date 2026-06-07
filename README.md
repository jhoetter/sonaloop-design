# sonaloop-icons

One icon library, two consumers — the **persona-website** (React) and the
**sonaloop** app (Python, server-rendered HTML). Every icon is authored
**once** and generated into both targets, so the two products never drift.

```
icons.data.mjs                  ← author icons here (the only source of truth)
   │  node scripts/gen.mjs
   ├─▶ src/index.ts             ← React/TSX components  (persona-website)
   └─▶ py/sonaloop_icons/__init__.py  ← Python SVG helpers (sonaloop)
```

Two flavours, mirroring `bim-icons`:

- **regular** — 24×24, stroke-based, `currentColor`, default strokeWidth 1.75.
  The everyday chrome/UI set.
- **hifi** — 48×48 display icons with fills and a stroke hierarchy
  (2 / 1.5 / 0.75) for hero tiles, feature cards, and empty states.

## All icons

![sonaloop-icons gallery](preview/gallery.png)

Regenerate this sheet after adding icons: `node scripts/gen-preview.mjs`
(writes `preview/gallery.svg`; rasterize to `preview/gallery.png` for GitHub).

**Regular · 24×24 (42)**

| group | names |
| --- | --- |
| chrome / UI | `overview` `personas` `councils` `syntheses` `projects` `memory` `panel` `settings` `sun` `moon` `monitor` `chevron` `back` `analytics` `star` `bulb` `target` `compass` `search` |
| status & actions | `check` `circle` `half` `alert` `close` `plus` `external` |
| reaction markers | `thumbsup` `warning` `dot` `diamond` `diamondFilled` `caretRight` `arrowRight` |
| research-graph notation | `square` `squareSplit` `squareRows` `squareCols` `squareGrid` `rectangle` `exchange` `wave` `pencil` |

**Hi-fi · 48×48 (42)** — a hi-fi twin for **every** regular icon, same keys, at
48×48 with fills + a 2 / 1.75 / 1.25 stroke hierarchy.

> Component names are PascalCase: regular `search` → `SearchIcon`,
> `diamondFilled` → `DiamondFilledIcon`; hi-fi appends `Hifi`, e.g.
> `search` → `SearchHifi`, `personas` → `PersonasHifi`.

## Adding or editing an icon

1. Edit **`icons.data.mjs`** — add an entry under `regular` or `hifi`:

   ```js
   export const regular = {
     // …
     rocket: {
       label: 'RocketIcon',                 // React export name
       body: '<path d="M5 19l3-3 …"/>',     // inner SVG markup, geometry only
       // cls: 'star',                       // optional extra CSS class (Python side)
     },
   };
   ```

   Keep `body` geometry-only: stroke, size, and linecaps come from the wrapper
   (React) or the host CSS rule `svg.ic` (council). Add an explicit `fill=…`
   on an element only when that element must be filled.

2. Regenerate:

   ```bash
   npm run gen      # or: node scripts/gen.mjs
   ```

3. Commit `icons.data.mjs` **and** the generated `src/index.ts` +
   `py/sonaloop_icons/__init__.py` (consumers read the generated files directly).

> The generated files carry a "Do not edit" header — always change
> `icons.data.mjs` and re-run the generator.

## Using it — React (persona-website)

`persona-website` aliases the package straight to TS source (see its
`vite.config.ts`), exactly like `bim-website → ../bim-icons`:

```ts
import { SearchIcon, PersonaHifi } from 'sonaloop-icons';

<SearchIcon size={18} strokeWidth={1.75} className="text-slate-600" />
<PersonaHifi size={48} />
```

Props: `size`, `strokeWidth`, `absoluteStrokeWidth`, plus any SVG attribute.

## Using it — Python (sonaloop)

The council installs the `py/` package as an editable path dependency
(`pyproject.toml` → `[tool.uv.sources] sonaloop-icons = { path = "../sonaloop-icons/py", editable = true }`)
and renders icons to inline SVG strings:

```python
from sonaloop_icons import icon, hifi

icon("search")        # '<svg class="ic" viewBox="0 0 24 24">…</svg>'
icon("star")          # '<svg class="ic star" …>'  (extra class baked in via data)
icon("nope")          # '' for unknown names
hifi("persona", 64)   # self-styled 64px display icon
```

Regular icons emit geometry under `class="ic"`; the council already styles
`svg.ic` (16px, currentColor, strokeWidth 1.75). Hifi icons inline their own
stroke attributes so they render with no extra CSS.

## Hover animations (hi-fi)

Every hi-fi icon has an opt-in hover/focus micro-interaction (settings cog
spins, search lens scans, councils dots type, check draws itself, …). It is
**pure CSS** — one source of truth, no JS, no new dependencies — so it works in
**both** consumers and self-disables under `prefers-reduced-motion`.

- Source: `styles/hifi-anim.css`. Sub-parts are tagged `data-part="…"` in
  `icons.data.mjs`; the codegen puts `pi-hifi pi-hifi-<name>` on each `<svg>`.
- Animations fire when the icon is hovered/focused, **or** when an ancestor with
  class `.pi-hover` is hovered (put it on a button/feature card to drive the
  icon inside). Without the stylesheet the classes are inert.

**React (persona-website)** — import the stylesheet once:

```ts
import 'sonaloop-icons/style.css';
<PersonasHifi size={48} />                          // animates on hover/focus
<button className="pi-hover">…<BulbHifi/></button>  // hovering the button animates the icon
```

**Python (sonaloop)** — inline the generated CSS into a `<style>` block:

```python
from sonaloop_icons import hifi_anim_css
head = f"<style>{hifi_anim_css()}</style>"   # add once to the page <head>
```

Preview: `node scripts/gen-anim-preview.mjs` → open `preview/animated.html` and
hover each tile. To review motion without a browser, `npm run capture -- hifi`
(or `all` / `reg` / `hifi:settings,reg:circle`) renders each icon's animation as
a frame filmstrip via headless Chromium — handy for catching off-centre
transforms. Needs the `playwright-core` + `sharp` devDependencies.

## Status glyphs (council, optional follow-up)

The council still renders a few **typographic** status marks as Unicode
(`✓ ◐ ○ !`, plus the data-driven `present(kind)["glyph"]`, and content emoji
`👍 ⚠`). These are a separate system from the chrome icons — some are drawn
inside SVG `<text>` with font-metric layout coupling — so they were left as-is
during the council cutover. This repo ships `check`, `circle`, `half`, and
`alert` icons ready to migrate that family deliberately when desired.

## Layout

```
icons.data.mjs        source of truth (regular + hifi)
scripts/gen.mjs       generator (zero deps, plain Node)
src/icon.tsx          React factories (personaIcon / personaIconHifi) — hand-written
src/index.ts          GENERATED React barrel
py/sonaloop_icons/     GENERATED Python module + its pyproject.toml
package.json          npm run gen / npm run typecheck
```
