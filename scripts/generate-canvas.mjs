#!/usr/bin/env node
/**
 * generate-canvas.mjs — author the brand CANVAS reference images (light/dark pairs).
 *
 * The canonical, on-brand backdrops live in this repo (`images/canvas/`) and are
 * imported everywhere via `sonaloop-design/images` (see `src/images.ts`). This is
 * the pipeline that authors them. Every canvas is a **themed pair**:
 *
 *   1. the LIGHT variant is generated from a prompt          (OpenAI gpt-image-1, generations)
 *   2. the DARK variant is generated FROM the light image    (OpenAI gpt-image-1, edits) — the
 *      light PNG is the input and the task is simply "make this the dark-theme twin", so the
 *      pair shares one composition and only the palette flips. This keeps light/dark in lockstep.
 *
 * Canvases are quiet impressionist washes in the brand palette (warm cream + dusty
 * indigo/violet/slate-blue), per BRANDING.md — NO figures, NO wireframe, NO text.
 * Output is converted to the final hashed-friendly `.jpg` the registry imports.
 *
 * Setup (once):  cp .env.example .env  &&  add your OPENAI_API_KEY   (.env is gitignored)
 *
 * Usage:
 *   npm run generate-canvas -- mist              # one pair (light, then dark from it)
 *   npm run generate-canvas -- --all             # every pair
 *   npm run generate-canvas -- canvas --dark     # only the dark half, from the existing light
 *   npm run generate-canvas -- mist --light      # only the light half
 *
 * After adding a NEW pair key, register it in `src/images.ts` so products can import it.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// Load .env (gitignored) if present; otherwise fall back to the shell env.
try {
  process.loadEnvFile(path.join(ROOT, '.env'));
} catch {
  /* no .env file — rely on shell env */
}

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_API_KEY || OPENAI_API_KEY === 'set-here') {
  console.error('✗ OPENAI_API_KEY not set. Copy .env.example → .env and add your key.');
  process.exit(1);
}

const OUT = path.join(ROOT, 'images', 'canvas');
const GEN_SIZE = '1536x1024'; // gpt-image-1 generation/edit size (3:2 landscape)
const [W, H] = [1800, 1200]; // final saved resolution

// Shared "quiet wash" framing every LIGHT prompt builds on.
const STYLE_BASE =
  'A soft hand-painted impressionist oil-paint backdrop, wide cinematic banner (16:9), calm and ' +
  'low-contrast, quiet and premium. Visible oil-paint / gouache brush texture. Absolutely NO ' +
  'people, NO objects, NO buildings, NO text, NO letters. It is a quiet background wash, never the subject.';

// The single instruction that turns any LIGHT image into its DARK twin (edits endpoint).
// Aim for a MID-dark twilight, not near-black: clearly a dark-theme asset, but lifted enough
// that the composition, brushwork and forms stay readable (don't crush it to a flat black field).
const DARK_INSTRUCTION =
  'Recreate this exact image as its DARK-THEME twin. Keep the SAME composition, forms, brushwork, ' +
  'framing and proportions — change ONLY the palette into a cool twilight version: muted dark ' +
  'slate-blue and dusty indigo, like the same scene at dusk. Keep it clearly DARK and quiet, but ' +
  'do NOT go near-black or pitch-dark — lift the overall brightness a touch so the forms and ' +
  'brush texture stay visible (think a soft dark slate, not charcoal/black). Strictly cool — NO ' +
  'warm orange, amber, terracotta or gold. It must read as the dark-mode counterpart of the input. ' +
  'No people, no objects, no text, no letters.';

// One entry per canvas pair. `light`/`dark` are the filenames under images/canvas/.
// `regenLight: false` keeps an existing, hand-tuned light file as the dark's input.
const PAIRS = {
  canvas: {
    light: 'dawn.jpg',
    dark: 'dusk.jpg',
    regenLight: false, // keep the tuned dawn.jpg; only (re)derive dusk from it
    lightPrompt:
      `${STYLE_BASE} Atmospheric blurred dawn sky over very soft distant hills: warm off-white / cream ` +
      `sky softly lit, with muted dusty lavender and dusty violet clouds and faint slate-blue hills.`,
  },
  abstract: {
    light: 'abstract-light.jpg',
    dark: 'abstract-dark.jpg',
    lightPrompt:
      `${STYLE_BASE} A purely ABSTRACT colour field — no horizon, no recognizable subject — just slow ` +
      `blended washes of warm cream, dusty lavender, muted violet and faint slate-blue that drift into ` +
      `one another. Soft, premium, endlessly reusable.`,
  },
  mist: {
    light: 'mist-light.jpg',
    dark: 'mist-dark.jpg',
    lightPrompt:
      `${STYLE_BASE} Soft layered morning MIST drifting over a still, glassy reflective plane that fades ` +
      `into a pale sky. Minimal, lots of open negative space; faint slate-blue and dusty-lavender tones ` +
      `over warm cream. Calm and contemplative.`,
  },
  meadow: {
    light: 'meadow-light.jpg',
    dark: 'meadow-dark.jpg',
    lightPrompt:
      `${STYLE_BASE} A soft, blurred wildflower MEADOW across the lower quarter under a wide open pale ` +
      `sky — gentle dabs of muted lavender, dusty violet and faint gold among hushed soft greens, warm ` +
      `cream light. Impressionist and quiet, the sky left open for a headline.`,
  },
  sky: {
    light: 'sky-light.jpg',
    dark: 'sky-dark.jpg',
    lightPrompt:
      `${STYLE_BASE} An almost-empty atmospheric SKY — soft horizontal cloud banding in warm cream with ` +
      `dusty lavender and faint slate-blue, and a barely-there horizon at the very bottom. Maximum quiet, ` +
      `open space.`,
  },
};

const args = process.argv.slice(2);
const all = args.includes('--all');
const half = args.includes('--light') ? 'light' : args.includes('--dark') ? 'dark' : 'both';
const keys = args.filter((a) => !a.startsWith('--'));
const targets = all ? Object.keys(PAIRS) : keys;

if (!targets.length) {
  console.error(`Usage: node scripts/generate-canvas.mjs <${Object.keys(PAIRS).join('|')}|--all> [--light|--dark]`);
  process.exit(1);
}

/** POST to the OpenAI images API and return the result as a PNG Buffer. */
async function imagesApi(endpoint, init) {
  const res = await fetch(`https://api.openai.com/v1/images/${endpoint}`, init);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`OpenAI ${endpoint} ${res.status}: ${err?.error?.message ?? res.statusText}`);
  }
  const b64 = (await res.json()).data?.[0]?.b64_json;
  if (!b64) throw new Error('No image data in response');
  return Buffer.from(b64, 'base64');
}

const genLight = (prompt) =>
  imagesApi('generations', {
    method: 'POST',
    headers: { Authorization: `Bearer ${OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'gpt-image-1', prompt, n: 1, size: GEN_SIZE, quality: 'high' }),
  });

function genDark(lightPng) {
  const form = new FormData();
  form.append('model', 'gpt-image-1');
  form.append('image', new Blob([lightPng], { type: 'image/png' }), 'light.png');
  form.append('prompt', DARK_INSTRUCTION);
  form.append('n', '1');
  form.append('size', GEN_SIZE);
  form.append('quality', 'high');
  return imagesApi('edits', { method: 'POST', headers: { Authorization: `Bearer ${OPENAI_API_KEY}` }, body: form });
}

const toJpg = (buf) => sharp(buf).resize(W, H, { fit: 'cover' }).jpeg({ quality: 82 }).toBuffer();

async function build(key) {
  const cfg = PAIRS[key];
  if (!cfg) {
    console.error(`  ✗ unknown pair "${key}" (have: ${Object.keys(PAIRS).join(', ')})`);
    return;
  }
  mkdirSync(OUT, { recursive: true });
  const lightPath = path.join(OUT, cfg.light);
  const darkPath = path.join(OUT, cfg.dark);
  console.log(`\n◆ ${key}  ·  ${GEN_SIZE} → ${W}×${H}  ·  gpt-image-1`);

  // 1) LIGHT — generated from the prompt, unless we're told to keep a tuned file.
  let lightPng;
  if (half !== 'dark' && cfg.regenLight !== false) {
    console.log(`  ◦ light → ${cfg.light}`);
    lightPng = await genLight(cfg.lightPrompt);
    writeFileSync(lightPath, await toJpg(lightPng));
  } else {
    if (!existsSync(lightPath)) throw new Error(`light source ${cfg.light} missing — run with --light first`);
    lightPng = await sharp(readFileSync(lightPath)).png().toBuffer(); // normalize the input for edits
  }

  // 2) DARK — the dark-theme twin, generated FROM the light image.
  if (half !== 'light') {
    console.log(`  ◦ dark  → ${cfg.dark}  (from ${cfg.light})`);
    writeFileSync(darkPath, await toJpg(await genDark(lightPng)));
  }
  console.log('  ✓ done');
}

for (const k of targets) {
  try {
    await build(k);
  } catch (err) {
    console.error(`  ✗ ${err.message}`);
    if (!all) process.exitCode = 1;
  }
}
console.log('\nFinished. New pair? Register it in src/images.ts so products can import it.');
