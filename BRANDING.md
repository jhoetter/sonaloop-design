# Sonaloop Branding

Last updated: 2026-06-08

The single source of truth for Sonaloop's visual brand. It lives here in **`sonaloop-design`**,
our global design system (shared tokens, icons, and this brand doc), and is consumed by every
product repo (`sonaloop-website`, `sonaloop`, `sonaloop-cloud`, `sonaloop-research`). Edit it
here; the other repos reference back to this file.

## Essence

Sonaloop is **synthetic research that disagrees with you** — a deliberative, longitudinal
panel, not a Pollyanna chatbot. The brand should feel **calm, intelligent, premium and
honest**: confident neutrals, a quiet sophistication, and a little soul from painterly art.

Direction (decided 2026-06-07): **Cursor-leaning**, away from the earlier Linear look.
Warm-neutral surfaces + painterly art canvases + real product screenshots, staged like a
finished deliverable. Minimal chrome; the colour lives in the art, not the UI.

## Palette

Near-white base with only a **faint** warm tint — the surfaces should read as white-ish,
not cream (the earlier `#F6F3EC` cream was too heavy; keep the warmth barely perceptible).
The colour belongs in the painterly art, not the UI chrome. Tokens live in `src/index.css`
as `R G B` triplets (Tailwind opacity modifiers work: `text-ink/60`).

**Light (default)**
| token | value | use |
|-------|-------|-----|
| `--paper` | `#FAF8F3` near-white, faintly warm | page background |
| `--paper-2` | `#F1EFE8` soft warm panel | cards, subtle fills |
| `--ink` | `#1A1815` warm near-black | text, **solid buttons** |
| `--ink-2` | `#635E56` warm muted | secondary text |
| `--blueprint` (accent) | `#5E6AD2` indigo | **the** accent — used sparingly |
| `--scan-blue` | `#3D7FC4` blue | Cloud accent |
| `--gold` | `#7A5ED1` violet | Research accent |

**Dark** (app screenshots, the rare dark band): `--paper #101113`, `--ink #E6E7EA`,
accent `#7C84E8`. Product screenshots are captured in the app's dark theme.

### Accent policy (important)
- Indigo is **the** accent — but **used sparingly** (Cursor-style). Default emphasis is
  `--ink` (near-black); indigo is for the occasional highlight, active nav, key links.
- Indigo is kept because it harmonises with the painterly canvases (lavender/violet/blue)
  and signals "intelligent / AI". *Decision record:* Cursor uses a warm terracotta accent;
  we deliberately keep indigo for the AI signal + canvas harmony. A slight nudge toward
  periwinkle is allowed if it sits better on cream.
- Product accents (for the three products) stay: Open Core = indigo, Cloud = blue,
  Research = violet.
- Never introduce a saturated warm accent that fights the cool canvases.

## Typography

**Sona** is Sonaloop's own typeface — the brand-stable name the whole system speaks in.

- **Sona** (grotesk) — headlines + UI. **Sona Mono** — small labels / eyebrows / code.
  **Sona Pixel** — a bitmap *display-only* face for technical flourishes (loaders, council ids,
  "research instrument" moments); never body text. Geist (then Inter / system-ui / mono) are
  fallbacks only.
- Self-hosted from this repo: the `.woff2` files live in `fonts/`, declared as families in
  `styles/fonts.css`. **No third-party (Google Fonts) dependency** — everything needed to
  render the brand ships in this repo. Provenance + reproduce steps: `fonts/SOURCES.md`.
- Referenced everywhere by NAME, never the underlying face: tokens `--sl-sans` / `--sl-mono` /
  `--sl-pixel` (`styles/tokens.css`), Tailwind `font-sans` / `font-serif` (= Sona), `font-mono`
  (= Sona Mono), `font-pixel` (= Sona Pixel). Authored once in `tokens.data.mjs` → `npm run gen`.
- Headlines: large, left-aligned, tight tracking, `--ink`. Body: `--ink/65`, relaxed.
- Eyebrows/labels: `font-mono`, uppercase, `tracking-[0.16em]`, `--ink/45`.
- Body letter-spacing ~ `-0.006em`.

### Sona — provenance & roadmap

We are moving toward a **truly own face** in small, code-driven steps. Each phase is a
drop-in: because nothing references "Geist" (only `--sl-sans` / `--sl-mono` / `--sl-pixel` →
Sona), swapping the underlying outlines never touches a component. **Phases 0–1 are done.**

- **Phase 0 — semantic alias (DONE).** Whole system speaks Sona; fonts self-hosted in `fonts/`.
- **Phase 1 — fork & rename, in code (DONE).** `scripts/build_sona_fonts.py` (fontTools)
  rewrites each binary's internal `name` table Geist → Sona, keeps the OFL + original copyright,
  appends a derivation note, and re-exports woff2. Re-runnable / reversible; `--check` gates CI.
  The binaries now genuinely report a Sona family — not just a CSS alias. *Outlines unchanged.*
- **Phase 2 — bespoke glyphs, in code (IN PROGRESS).** Edit signature glyphs + metrics with
  fontTools so Sona stops *being* Geist and starts *being Sona* — no manual font editor.
  - **`Sona Pixel`** — a high-res bitmap display face, **default fill = Line**. Built on Geist
    Pixel (renamed Geist → Sona, OFL-derived like the text faces) — chosen for fidelity to the
    Geist Pixel look. Five fills: Line (default), Square, Circle, Grid, Triangle.
  - **Proven, kept in reserve:** a fully **clean-room** own pixel face exists, drawn entirely in
    code (`scripts/build_sona_pixel.py`, zero third-party outlines). It reads coarser than Geist
    Pixel, so it's a *license-clean* future option rather than the active face — but it proves
    "own face, in code" works end to end.
  - **Next: the text faces** (`Sona`, `Sona Mono`) — still Geist-derived. Apply the same code
    approach: a Sonaloop `g`/`a`, the loop motif in the `o` / ampersand / a logo ligature, a
    tightened spacing pass, `council_…` id ligatures. Text outlines are far harder than a pixel
    grid (this is where a type designer pairs with the code path), so land it glyph by glyph;
    every export stays a drop-in.
- **Phase 3 — commission an original face (LATER, $20k–$100k+, months).** A type designer draws
  Sona from scratch once typography is a deliberate differentiator. Same drop-in when it lands.

**Can Claude Code do Phase 2?** Yes for the mechanical/parametric parts — renaming (done),
remixing/instancing axes, spacing/kerning passes, ligatures, simple geometric glyph edits, and
*generating* a bespoke pixel face (pixel glyphs are just grids — fully codeable). What it can't
do is *type design judgement*; for true original letterforms, pair the code path with a designer.

**OFL constraints to honour:** keep the OFL text + Vercel/basement.studio copyright as long as
any Geist-derived outlines remain; never ship binaries under the reserved name "Geist"; once we
modify outlines, the internal name must read unambiguously "Sona" (Phase 1 already ensures this).

### What should Sona feel like (brand fit)

Brand essence: *calm, intelligent, premium, honest — synthetic research that disagrees with you.*
Geist is a strong base (neutral, engineered, developer-native) but reads slightly cold/corporate.
To resemble Sonaloop, nudge it **warmer and a touch more humanist** without losing the precision:

- **Humanist grotesk, not geometric.** Keep even, confident proportions; add a little warmth in
  terminals and curves so it feels considered and human (we *disagree thoughtfully*, not robotic).
- **The loop motif is the signature.** The mark is a continuous loop with three nodes — express it
  in the `o`/`a` counters, a custom ampersand, or a logo ligature. One quiet signature beats many.
- **Editorial intelligence.** Favour a double-story `a` and `g` (reads literate/considered) over
  single-story geometric forms; tight but breathing tracking; restrained, legible at dense sizes
  (the inspector is information-dense) yet elegant large (the airy marketing site).
- **Sona Mono = the data voice.** Slightly humanist mono; great figures and id legibility
  (`council_24105090`); the existing eyebrow/tag usage is its home.
- **Sona Pixel = the "research instrument" accent.** A high-res bitmap family in five fills;
  the **Line** fill is the default (delicate, instrument-like), **Circle** the soft round-dot
  option that echoes the loop mark. Keep Pixel rare and deliberate (loaders, ids), never reading.
- **Avoid:** anything cold/techy-generic, ultra-geometric, or a warm-display personality that
  fights the cool painterly canvases. Sona should feel like a *quiet, premium instrument*.

## Surfaces, radius, elevation

- Rounded: cards `rounded-xl`/`rounded-2xl`, buttons `rounded-lg`, chips `rounded-md`.
- Borders: hairline warm `border-ink/[0.08–0.12]`. Shadows: soft and low
  (`0 1px 2px rgb(var(--ink)/0.04)`; showcase windows get a deep ambient shadow).
- Generous whitespace, airy sections.

## Buttons

- **Primary**: solid `bg-ink text-paper`, `rounded-lg`, hover `bg-ink/85`. (Cursor-black.)
- **Secondary**: `border border-ink/15 text-ink`, hover `border-ink/40`.
- Accent-solid only where a product accent is warranted (e.g. Research = violet).

## Imagery system — four layers

The brand's look comes from how these combine. **Prefer the app's own output over stock.**

1. **Painterly canvases** (`public/assets/canvas/*.jpg`). Soft, muted, low-contrast
   impressionist art in the warm + dusty-indigo/violet palette. **Generated with
   `gpt-image-2`** (size 1536×1024, then downscaled to ~1800w JPG q80). Used as the canvas
   behind product windows (hero) and as a faint footer wash. *Prompt guidance:* "soft
   painterly impressionist background, calm, low contrast, warm off-white/cream base with
   subtle dusty indigo, muted lavender-violet, faint slate-blue; oil-paint texture; no
   people, no objects, no text." Keep them quiet — they're a backdrop, never the subject.
2. **Product screenshots** (`public/assets/app/*.png`). Real **dark-mode** captures of the
   app (council, synthesis, project graph), framed as a browser window
   (`CanvasShowcase` / `ProductShot`) and staged on a canvas. Frame it as **the
   deliverable / the output**, never "look, our UI". Re-capture when the app changes.
3. **Concept visualizations.** When showing the literal app isn't right, build a **realistic,
   polished UI snippet / mini-mockup** in the product's own design language — a focused slice of
   interface (a verdict card, a sentiment bar, a method/model picker, a staged little window),
   styled with our tokens + hi-fi icons so it reads as a real product moment. Think Cursor's
   feature cells: believable UI fragments, NOT abstract node diagrams / infographics (those look
   cheap — avoid). May sit on a painterly canvas.
4. **Icons** — the hi-fi set in this repo (single source of truth: `./icons.data.mjs`).
   The icon vocabulary for nav, cards, concept viz. Add new icons here (`npm run gen`),
   never inline one-offs.

### Do / Don't
- **Do** lead heroes with the *theme*; stage screenshots as deliverables on a canvas.
- **Do** keep canvases muted and quiet; let one accent do the work.
- **Don't** use generic stock photos, literal "people in a room", or AI-generated hero art
  with figures. **Don't** show raw app UI without staging. **Don't** over-use the accent.

## Components (the brand kit)

- `CanvasShowcase` — painterly canvas + floating browser-framed screenshot (hero).
- `ProductShot` — split feature showcase: value copy left, framed screenshot right, on a band.
- `concepts/*` — SVG concept diagrams (council, forces, timeline, sentiment).
- `Hero` (dark variant kept for Open Core's technical page), `CtaBand`, `Footer` (canvas wash),
  `Avatar` (persona initials on accent gradient), `DrawingFrame` (clean card), `Nav` (mega-menus).

## Motion

Subtle, premium, one-shot. Icon hover micro-interactions (from this repo's icon set), gentle
fades, hover lifts. No bounce/spin/parallax theatrics.

## Extending to other repos

- The **product/app surfaces** (`sonaloop` inspector, `sonaloop-cloud`, `sonaloop-research`)
  should adopt the **shared tokens** (accent indigo, Sona where practical, the warm-neutral
  option) while staying functional and dense — a tool can stay cooler/whiter than the
  marketing site. Keep the icon library shared (already the case).
- This file is the master. When a repo adopts the brand, link back here and record any
  surface-specific deviation (and why).
