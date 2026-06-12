# Architecture

sonaloop-design is the **global design system** for the Sonaloop ecosystem: brand spec
([`BRANDING.md`](BRANDING.md)), design tokens, icons, figures, chart primitives, app/website
components, and the deck template. It serves **two rendering worlds at once** — a React wing
(sonaloop-website, sonaloop-tracker, sonaloop-data's `ui/`) and a Python-SSR wing (the
sonaloop core app, with cloud/research riding on it) — from single sources of truth.

**The core principle: CSS is the one styling source.** `styles/components.css` defines the
`.sl-*` classes; React components and Python SSR helpers both emit those same classes on their
own markup. No component *code* is shared across the stacks — only the class contracts and the
tokens — so the two worlds render identically and cannot drift.

## The codegen pipeline

Everything visual is authored once in hand-written `*.data.mjs` files (plus the hand-authored
CSS and TSX layers) and generated into **both** consumer stacks by `npm run gen`:

```mermaid
flowchart TD
    subgraph sources["Hand-authored data — single sources of truth"]
        TOK["tokens.data.mjs<br/>colour scales · fonts"]
        ICO["icons.data.mjs<br/>regular 24 + hifi 48"]
        FIG["figures.data.mjs<br/>isometric plates, computed geometry"]
        DECK["deck.data.mjs<br/>palette · type · layouts"]
        CCSS["styles/components.css<br/>the .sl-* styling contract"]
        ANIM["styles/hifi-anim.css<br/>hover micro-interactions"]
    end

    subgraph gen["scripts/gen*.mjs — npm run gen"]
        G1["gen.mjs<br/>icons + figures"]
        G2["gen-tokens.mjs"]
        G3["gen-deck.mjs<br/>+ sharp rasterization"]
        G4["gen-website-previews.mjs<br/>gen-website-css.mjs · gen-website-usage.mjs"]
    end

    subgraph react["Generated — React side"]
        RIDX["src/index.ts<br/>icon + figure components"]
        RTOK["styles/tokens.css<br/>R G B triplets for Tailwind"]
        RTW["tailwind-preset.js"]
    end

    subgraph py["Generated — Python side py/sonaloop_icons/"]
        PIDX["__init__.py<br/>icon / hifi / figure SVG strings"]
        PTOK["tokens.py"]
        PCSS["components_css.py<br/>components.css as a Python string"]
        PDECK["deck.py · deck_assets.py<br/>pptx template + base64 assets"]
    end

    SITE["site/website.previews.mjs<br/>site/website.css · site/website.usage.mjs<br/>for the docs site"]

    ICO --> G1
    FIG --> G1
    ANIM --> G1
    TOK --> G2
    CCSS --> G2
    DECK --> G3
    ICO --> G3
    G1 --> RIDX
    G1 --> PIDX
    G2 --> RTOK
    G2 --> RTW
    G2 --> PTOK
    G2 --> PCSS
    G3 --> PDECK
    G4 --> SITE
```

Generated files carry a "Do not edit" header — always change the `*.data.mjs` source and
re-run `npm run gen` (or `make gen`).

On top of the generated artifacts sit the **hand-authored layers**:

```mermaid
flowchart LR
    CSS["styles/components.css<br/>.sl-* classes — THE styling source"]

    subgraph hand["Hand-authored React source"]
        COMP["src/components.tsx<br/>primitives: Button · Card · Badge ·<br/>AppShell · Drawer · Popover · FilterBar ·<br/>CommandPalette · ThemeToggle · avatarColor"]
        THEME["src/theme.ts<br/>shared useTheme hook<br/>persona-theme key → html data-theme"]
        FACETS["src/facets.tsx<br/>FacetBar — always-visible facet chips"]
        CHARTS["src/charts.tsx<br/>bar · pie · gauge · burnup · strip …"]
        WEB["src/website.tsx<br/>marketing blocks: Navbar · Hero ·<br/>Footer · CtaBand · RelatedRail"]
        ICONF["src/icon.tsx · src/figure.tsx<br/>component factories"]
    end

    PCHARTS["py/sonaloop_icons/charts.py<br/>parallel Python implementation —<br/>same charts as static SSR HTML"]

    CSS --> COMP
    CSS --> FACETS
    CSS --> CHARTS
    CSS --> WEB
    CSS --> PCHARTS
    THEME --> COMP
    CHARTS -. "same .sl-chart classes,<br/>parallel code by design" .- PCHARTS
```

`src/charts.tsx` and `py/sonaloop_icons/charts.py` are deliberate **parallel
implementations** — both emit self-contained, print-safe markup styled solely by the
`.sl-chart*` classes, so a chart renders identically in the React apps, the Python-SSR app,
and headless-Chromium PDF/PPTX export.

## Consumption

```mermaid
flowchart TD
    DS["sonaloop-design<br/>src + styles + py, consumed from source"]

    subgraph reactwing["React wing — Vite source aliases to ../sonaloop-design"]
        WEBSITE["sonaloop-website"]
        TRACKER["sonaloop-tracker"]
        DATAUI["sonaloop-data ui/"]
    end

    subgraph pywing["Python-SSR wing"]
        CORE["sonaloop core<br/>vendors py/ via make icons"]
        CLOUD["sonaloop-cloud · sonaloop-research<br/>ride on the core's web — inherit it all"]
    end

    GUARD["pre-commit hook + npm run check<br/>regenerate, fail on stale artifacts"]
    DOCS["site/ docs site<br/>make dev → :6006<br/>Foundations · Brands · Components ·<br/>Composites · Website"]

    DS -->|"sonaloop-design/components<br/>tokens.css · components.css · tailwind-preset"| WEBSITE
    DS --> TRACKER
    DS --> DATAUI
    DS -->|"tokens.py · components_css.py ·<br/>icons · deck modules"| CORE
    CORE --> CLOUD
    GUARD --> DS
    DS --> DOCS
```

- **React consumers** never install the package — each `vite.config.ts` aliases
  `sonaloop-design` and its subpaths (`/components`, `/components.css`, `/tokens.css`, …)
  straight to this sibling checkout's TypeScript/CSS source.
- **Python consumers**: the core app vendors `py/sonaloop_icons/` (`make icons` in the core
  repo) — tokens, the components CSS string, icons, charts, deck. Cloud and research extend
  the core's web app, so they inherit the design system without touching this repo.
- **Freshness guard**: `npm install` activates `.githooks/pre-commit`
  (via the `prepare` script), which reruns the icon/token generators and re-stages their
  outputs; `npm run check` (`make check`, CI `check.yml`) regenerates everything and fails on
  any diff, so committed artifacts can never go stale.
- **Docs site**: `make dev` regenerates and serves `site/` on `127.0.0.1:6006` — every
  swatch, icon, and component is rendered live from the data sources; the Website section's
  previews are pre-rendered React (`gen-website-previews.mjs`) so the site needs no runtime
  React or Tailwind.

## Modules

| Path | Role |
| --- | --- |
| `tokens.data.mjs` / `icons.data.mjs` / `figures.data.mjs` / `deck.data.mjs` | Hand-authored sources of truth |
| `scripts/gen.mjs` · `gen-tokens.mjs` · `gen-deck.mjs` | Core codegen → React + Python artifacts |
| `scripts/gen-website-*.mjs` | Docs-site prerender of the website blocks |
| `scripts/generate-canvas.mjs` | Light/dark image pairs via gpt-image-1 → `images/canvas/` |
| `src/components.tsx` | React primitives over the `.sl-*` contract; exports `avatarColor` |
| `src/theme.ts` | Shared `useTheme` hook — one theme across all React apps |
| `src/facets.tsx` | `FacetBar` faceted-filtering chips |
| `src/charts.tsx` ⇄ `py/sonaloop_icons/charts.py` | Chart primitives, parallel per stack |
| `src/website.tsx` | Marketing-site blocks (shadcn-style, prop-driven) |
| `src/icon.tsx` · `src/figure.tsx` · `src/images.ts` · `src/films.ts` | Icon/figure factories, curated media registries |
| `styles/components.css` | **The** styling contract (`.sl-*`), shared by both wings |
| `styles/tokens.css` · `tailwind-preset.js` | Generated token CSS + Tailwind preset |
| `styles/hifi-anim.css` · `styles/website.css` · `styles/fonts.css` | Hover animations, website layer, font faces |
| `py/sonaloop_icons/` | The Python package the core app vendors (mostly generated) |
| `site/` · `preview/` | Docs-site chrome (hand-authored) + icon galleries |
| `.githooks/pre-commit` · `.github/workflows/check.yml` | Generated-artifact freshness guards |

## Key seams

- **The `.sl-*` class contract** — the only thing both rendering worlds share. Adding a
  component means: style it in `components.css`, wrap it in `components.tsx`, emit the same
  classes from Python markup.
- **`*.data.mjs` → `npm run gen`** — never edit a generated file; the pre-commit hook and
  `npm run check` enforce this mechanically.
- **Vite alias (React) / `make icons` vendoring (Python)** — how changes propagate: React
  consumers pick them up instantly from source; the core app re-vendors deliberately.
- **`useTheme` + `persona-theme`** — one localStorage key and one `data-theme` attribute
  across every Sonaloop surface, so the theme follows the user between apps.
- **Page-level compositions stay in each app** — the system ships primitives and website
  blocks, not whole pages.
