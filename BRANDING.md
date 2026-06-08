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
  Geist (then Inter / system-ui) are fallbacks only.
- Self-hosted from this repo: the `.woff2` files live in `fonts/`, declared as the families
  `Sona` / `Sona Mono` in `styles/fonts.css`. **No third-party (Google Fonts) dependency** —
  everything needed to render the brand ships in this repo.
- Referenced everywhere by NAME, never by the underlying face: tokens `--sl-sans` / `--sl-mono`
  (`styles/tokens.css`), Tailwind `font-sans` / `font-serif` (= Sona) and `font-mono`
  (= Sona Mono) (`tailwind-preset.js`). All authored once in `tokens.data.mjs` → `npm run gen`.
- Headlines: large, left-aligned, tight tracking, `--ink`. Body: `--ink/65`, relaxed.
- Eyebrows/labels: `font-mono`, uppercase, `tracking-[0.16em]`, `--ink/45`.
- Body letter-spacing ~ `-0.006em`.

### Sona — provenance & roadmap

**Today (v0):** Sona is *built on* **Geist** (© 2023 Vercel + basement.studio), licensed
**SIL OFL-1.1** (see `fonts/LICENSE-Geist.txt`). The vendored `.woff2` files are Geist's
variable fonts, **unmodified** — we only assign them the family name `Sona` / `Sona Mono` in
`styles/fonts.css`. This is legal under OFL (which permits redistribution and bundling), gives
us a self-contained repo, and — crucially — lets the *whole system already speak "Sona"*.

**The point of the indirection:** because nothing references "Geist" anymore (only `--sl-sans` /
`--sl-mono` → "Sona"), swapping the underlying face is a **drop-in** with zero component churn.

**Path to a truly bespoke Sona (when the brand warrants it):**
1. **Fork & rename (days, ~free).** OFL explicitly *requires* a new name for modified versions —
   so "Sona" is exactly the right move. Open the Geist sources in a font editor (FontForge / Glyphs),
   make Sonaloop-specific tweaks (e.g. a custom `g`/`a`, the loop motif worked into a glyph or the
   ampersand, tightened spacing, ligatures for `council_…` ids), set the font's internal name to
   "Sona", keep the OFL + original copyright notice, export new `.woff2`, drop them in `fonts/`.
   Update `fonts/LICENSE-Geist.txt` → note the derivation. **Nothing else changes.**
2. **Commission an original face (months, $20k–$100k+).** A type designer draws Sona from scratch.
   Only justified once typography is a deliberate differentiator. Same drop-in when it lands.

**Constraints to honour:** keep the OFL text + Vercel/basement.studio copyright as long as any
Geist-derived outlines remain; do **not** ship the binaries under the reserved name "Geist"; if we
modify outlines, bump the internal font name so it's unambiguously "Sona".

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
