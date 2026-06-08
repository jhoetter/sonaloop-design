# sonaloop-design

Sonaloop's **global design system** — the shared brand doc ([`BRANDING.md`](BRANDING.md),
the single source of truth) plus the icon library. Consumed by every product repo
(`sonaloop-website`, `sonaloop`, `sonaloop-cloud`, `sonaloop-research`).

The icon library has two consumers — the **website** (React) and the **sonaloop** app
(Python, server-rendered HTML). Every icon is authored **once** and generated into both
targets, so the products never drift.

## Design tokens

Same pattern for colour. Author values **once** in [`tokens.data.mjs`](tokens.data.mjs);
`npm run gen` (or `npm run gen:tokens`) emits per-consumer CSS:

```
tokens.data.mjs                 ← author colour here (single source of truth)
  → styles/tokens.css            R G B triplets, website var names (Tailwind opacity mods)
  → py/sonaloop_icons/tokens.py  hex CSS string, inspector var names (sonaloop app)
```

- **Website**: `import 'sonaloop-design/tokens.css'` (its `tailwind.config.ts` reads `var(--x)`).
- **sonaloop app**: vendors `tokens.py` → `sonaloop/_tokens.py` (via `make icons`); `web_assets.py`
  prepends `TOKENS_CSS`.

Each consumer keeps its own var names; only the values live here. Change a colour once and
the website + app both pick it up. The brand spec/rationale is in [`BRANDING.md`](BRANDING.md).

## Components

`styles/components.css` is the shared component layer (`.sl-btn`, `.sl-card`, `.sl-badge`,
`.sl-pill`, `.sl-chip`, `.sl-eyebrow`, `.sl-input`, `.sl-kbd` …). It is driven by canonical
`--sl-*` tokens (emitted into both token files), so the **same classes** render identically
on each stack's own markup — no shared component code:

```tsx
// website (React):   <button className="sl-btn sl-btn--primary">Open</button>
// app (Python-SSR):  h("button", {"class_": "sl-btn sl-btn--primary"}, "Open")
```

The website imports `sonaloop-design/components.css`; the app vendors it (via `make icons`)
and prepends it. cloud / research inherit it automatically (they extend the core app's web).

**React primitives** (`sonaloop-design/components`) are thin typed wrappers that emit those
same `.sl-*` classes, so React apps get an ergonomic API over one styling source:

```tsx
import { Button, Card, CardTitle, Badge, Eyebrow } from 'sonaloop-design/components';
import 'sonaloop-design/components.css';   // load the styles once

<Button variant="primary" size="sm">Open</Button>
```

Available: `Button` (variant `default|primary|accent|ghost`, size `sm|md|lg`), `Badge`
(`tone`), `Pill`, `Chip`, `Eyebrow`, `Card` + `CardTitle`/`CardBody`, `Input`, `Textarea`,
`Select`, `Checkbox`, `Radio`, `Switch`, `Field`/`Fieldset`, `Entity`/`EntityList`, `Kbd`,
`Divider`. **Page-level compositions** (Footer, Hero, …) stay in each app and are built
FROM these primitives + tokens — the design system shares primitives, not whole pages.

## Reference images

A small, curated set of on-brand **reference images** lives here too, so every product
pulls the *same* canonical asset instead of each carrying its own copy (and drifting).
These are **not** the only images a product may use — they're the blessed variants to reach
for first. Authored once, imported everywhere, just like the icons.

Every canvas is a **themed pair** — a `light` and a `dark` variant sharing one composition
(the dark twin is generated *from* the light, so they stay in lockstep). Pick the variant for
the active theme; each value is the **bundler-resolved URL** (content-hashed in production),
drop-in for `<img src>` or a CSS `background`:

```tsx
import { canvas, mist } from 'sonaloop-design/images';

<img src={canvas.light} alt="" className="dark:hidden" />
<img src={canvas.dark}  alt="" className="hidden dark:block" />
```

Pairs available (all under `images/canvas/`, registered in [`src/images.ts`](src/images.ts)):

| pair | light / dark | what it is |
| --- | --- | --- |
| `canvas`   | `dawn.jpg` / `dusk.jpg`                   | soft hills under a wide sky |
| `abstract` | `abstract-light.jpg` / `abstract-dark.jpg` | pure colour-field wash, no subject |
| `mist`     | `mist-light.jpg` / `mist-dark.jpg`       | fog over a still reflective plane |
| `meadow`   | `meadow-light.jpg` / `meadow-dark.jpg`   | soft wildflower field under open sky |
| `sky`      | `sky-light.jpg` / `sky-dark.jpg`         | almost-empty atmospheric sky |

`canvasDawn` / `canvasDusk` remain as direct aliases of `canvas.light` / `canvas.dark`. The
website consumes this straight from source via its Vite alias (`sonaloop-design/images`);
published builds expose it through the package `exports` map.

### Generating canvases

The canvases are authored right here with OpenAI `gpt-image-1`, as **light/dark pairs**: the
light variant is generated from a prompt, then the dark twin is generated *from the light image*
(same composition, cool night palette) — so the two never drift apart.

```
cp .env.example .env          # then add your OPENAI_API_KEY (the .env is gitignored)
npm run generate-canvas -- mist          # one pair (light, then dark from it)
npm run generate-canvas -- --all         # every pair
npm run generate-canvas -- canvas --dark # only the dark half, from the existing light
```

[`scripts/generate-canvas.mjs`](scripts/generate-canvas.mjs) holds one light prompt per pair in
its `PAIRS` map plus the shared `DARK_INSTRUCTION`, calls the API, and converts each result to
the final `images/canvas/<name>.jpg` (via `sharp`, 1800×1200) — the exact files `src/images.ts`
imports. **To add a pair:** add a key to `PAIRS`, run it, then register the two files in
[`src/images.ts`](src/images.ts).

## Develop — the design-system docs site

```
make install        # npm deps (also installs the pre-commit hook that keeps generated files fresh)
make dev            # regenerate + serve the docs site → http://127.0.0.1:6006/
make dev-forwarded  # same, bound to 0.0.0.0 for a forwarded port
make gen            # regenerate icons + tokens + tailwind preset + components module
make check          # drift guard: fail if any generated artifact is stale
```

`make dev` serves a full design-system documentation site (`site/`), organised the way the
[Geist](https://vercel.com/geist/introduction) (Vercel) site is:

- **Foundations** — Introduction, Colors, Typography, Materials, Layout, Icons.
- **Brands** — the Sonaloop mark/wordmark, plus Sonaloop Cloud & Research.
- **Components** — a live reference for every `.sl-*` primitive (Button, Badge, Tag, Pill,
  Chip, Card, Eyebrow, Input, Kbd, Divider, Arrow Link), each with an **App-dense / Web-airy**
  preview toggle and copy-ready React / class-contract / Python-SSR snippets.

It has a ⌘K search palette and a light/dark toggle, and **every** swatch, icon and component
is rendered live from the single sources of truth (`tokens.data.mjs`, `icons.data.mjs`,
`styles/components.css`), so the docs can never drift from what ships. The chrome lives in
`site/` (`index.html` + `app.css` + `app.js`); it is the only hand-authored part and is not
itself part of the published package.

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

![sonaloop-design icon gallery](preview/gallery.png)

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
import { SearchIcon, PersonaHifi } from 'sonaloop-design';

<SearchIcon size={18} strokeWidth={1.75} className="text-slate-600" />
<PersonaHifi size={48} />
```

Props: `size`, `strokeWidth`, `absoluteStrokeWidth`, plus any SVG attribute.

## Using it — Python (sonaloop)

The council installs the `py/` package as an editable path dependency
(`pyproject.toml` → `[tool.uv.sources] sonaloop-design = { path = "../sonaloop-design/py", editable = true }`)
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
import 'sonaloop-design/style.css';
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
