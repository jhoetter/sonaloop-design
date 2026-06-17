#!/usr/bin/env node
/**
 * generate-methodologies.mjs — author the per-METHODOLOGY brand cover images (light/dark pairs).
 *
 * Same pipeline as `generate-canvas.mjs` (gpt-image-1; the dark twin is generated FROM the
 * light so the pair shares one composition), but the prompts are tuned per methodology: each
 * cover's COMPOSITION quietly evokes that method's character (diverge/converge, depth, a fast
 * dawn, a single point of signal) while staying a fully on-brand impressionist wash —
 * NO figures, NO diagrams, NO wireframe, NO text (BRANDING.md).
 *
 * Output: images/methodologies/<key>-light.jpg + <key>-dark.jpg.
 * The sonaloop app vendors these into sonaloop/web/assets/methodologies/.
 *
 * Setup (once):  cp .env.example .env  &&  add OPENAI_API_KEY   (.env is gitignored)
 * Usage:
 *   npm run generate-methodologies -- --all                  # every pair
 *   node scripts/generate-methodologies.mjs double-diamond   # one pair
 *   node scripts/generate-methodologies.mjs lean-jtbd --dark # only the dark half
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

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

const OUT = path.join(ROOT, 'images', 'methodologies');
const GEN_SIZE = '1536x1024';
const [W, H] = [1800, 1200];

// The quiet-wash framing every LIGHT prompt builds on (shared with generate-canvas.mjs).
const STYLE_BASE =
  'A soft hand-painted impressionist oil-paint backdrop, wide cinematic banner (16:9), calm and ' +
  'low-contrast, quiet and premium. Visible oil-paint / gouache brush texture. Warm off-white / ' +
  'cream base with dusty indigo, muted lavender-violet and faint slate-blue. Absolutely NO people, ' +
  'NO objects, NO buildings, NO text, NO letters, NO diagrams, NO geometric shapes or wireframe. ' +
  'It is a quiet background wash whose MOOD does the work, never a literal illustration.';

const DARK_INSTRUCTION =
  'Recreate this exact image as its DARK-THEME twin. Keep the SAME composition, forms, brushwork, ' +
  'framing and proportions — change ONLY the palette into a cool twilight version: muted dark ' +
  'slate-blue and dusty indigo, like the same scene at dusk. Keep it clearly DARK and quiet, but ' +
  'do NOT go near-black or pitch-dark — lift the overall brightness a touch so the forms and ' +
  'brush texture stay visible (think a soft dark slate, not charcoal/black). Strictly cool — NO ' +
  'warm orange, amber, terracotta or gold. It must read as the dark-mode counterpart of the input. ' +
  'No people, no objects, no text, no letters.';

// One entry per methodology. The key matches the app asset basename.
const PAIRS = {
  'double-diamond': {
    lightPrompt:
      `${STYLE_BASE} Composition: two soft, symmetrical basins of luminous mist read left-to-right, ` +
      `each one gently widening open and then tapering closed again — a calm widen→narrow→widen→narrow ` +
      `rhythm, like two shallow valleys of light breathing in and out across the frame. Balanced and ` +
      `serene.`,
  },
  'double-diamond-deep': {
    lightPrompt:
      `${STYLE_BASE} Composition: deep horizontal strata receding downward into soft depth — many ` +
      `layered, translucent bands of dusty indigo, muted violet and faint slate-blue stacked over warm ` +
      `cream, fading gently into the distance like a quiet longitudinal core of light. Layered, ` +
      `contemplative, a touch richer and deeper than a plain sky.`,
  },
  'dschool-micro': {
    lightPrompt:
      `${STYLE_BASE} Composition: a bright, airy early-morning dawn glow lifting softly from the lower ` +
      `frame — an optimistic, fresh light, lighter and a little warmer than the others but still ` +
      `cool-leaning: pale cream lifting into faint lavender with the gentlest hint of soft gold. Open, ` +
      `energetic and human.`,
  },
  'lean-jtbd': {
    lightPrompt:
      `${STYLE_BASE} Composition: a single soft, luminous convergence of light gathering toward ONE calm ` +
      `focal point low on a wide open field — a quiet radial focus where muted indigo and lavender washes ` +
      `over warm cream all settle gently toward that one point of signal. Minimal, focused, lots of open ` +
      `space around the single glow.`,
  },
  'continuous-discovery': {
    lightPrompt:
      `${STYLE_BASE} Composition: soft concentric ripples spreading outward in a calm, repeating cadence over ` +
      `a still reflective plane — gentle layered rings of dusty indigo and muted lavender over warm cream, an ` +
      `ongoing rhythm with no clear beginning or end. Quiet, cyclical, contemplative.`,
  },
  'design-sprint': {
    lightPrompt:
      `${STYLE_BASE} Composition: five soft luminous vertical columns of light stepping left-to-right across the ` +
      `frame in a brisk, even cadence — dusty indigo and lavender bands over warm cream, calm but carrying a ` +
      `gentle forward momentum. Rhythmic and purposeful.`,
  },
  'customer-discovery': {
    lightPrompt:
      `${STYLE_BASE} Composition: a warm, intimate pool of soft light gathered close in the center, attentive and ` +
      `quiet — the feeling of leaning in to listen closely. A softly glowing warm-cream centre held by gentle ` +
      `dusty-lavender and faint slate-blue around the edges. Calm, close, human.`,
  },
  'jtbd-switch': {
    lightPrompt:
      `${STYLE_BASE} Composition: two gentle opposing currents of mist — one drifting in from the left, one drawn ` +
      `from the right — meeting near the center and resolving into a single soft forward drift. Dusty indigo and ` +
      `muted lavender over warm cream; calm, balanced directional motion.`,
  },
  'reaction-test': {
    lightPrompt:
      `${STYLE_BASE} Composition: a single bright, soft bloom of light near the center with ONE quick luminous ring ` +
      `spreading outward — immediate and light, a momentary reaction. Mostly open warm cream with a gentle ` +
      `lavender-indigo ripple. Airy, fast, minimal.`,
  },
};

const args = process.argv.slice(2);
const all = args.includes('--all');
const half = args.includes('--light') ? 'light' : args.includes('--dark') ? 'dark' : 'both';
const keys = args.filter((a) => !a.startsWith('--'));
const targets = all ? Object.keys(PAIRS) : keys;

if (!targets.length) {
  console.error(`Usage: node scripts/generate-methodologies.mjs <${Object.keys(PAIRS).join('|')}|--all> [--light|--dark]`);
  process.exit(1);
}

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
    console.error(`  ✗ unknown methodology "${key}" (have: ${Object.keys(PAIRS).join(', ')})`);
    return;
  }
  mkdirSync(OUT, { recursive: true });
  const lightPath = path.join(OUT, `${key}-light.jpg`);
  const darkPath = path.join(OUT, `${key}-dark.jpg`);
  console.log(`\n◆ ${key}  ·  ${GEN_SIZE} → ${W}×${H}  ·  gpt-image-1`);

  let lightPng;
  if (half !== 'dark') {
    console.log(`  ◦ light → ${key}-light.jpg`);
    lightPng = await genLight(cfg.lightPrompt);
    writeFileSync(lightPath, await toJpg(lightPng));
  } else {
    if (!existsSync(lightPath)) throw new Error(`light source ${key}-light.jpg missing — run with --light first`);
    lightPng = await sharp(readFileSync(lightPath)).png().toBuffer();
  }

  if (half !== 'light') {
    console.log(`  ◦ dark  → ${key}-dark.jpg  (from ${key}-light.jpg)`);
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
console.log('\nFinished. Vendor the JPGs into sonaloop/web/assets/methodologies/.');
