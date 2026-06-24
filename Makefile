GALLERY_PORT ?= 6006
FORWARDED_GALLERY_PORT ?= 16006
FUGU_GALLERY_PORT ?= 56006

.PHONY: install gen check dev dev-forwarded dev-forwarded-fugu

# Install npm deps. Also activates the git pre-commit hook (via the `prepare` script →
# core.hooksPath=.githooks), so generated artifacts never go stale.
install:
	npm install

# Regenerate every design-system artifact: icons (React + Python), colour tokens
# (tokens.css + tokens.py), and the Tailwind preset.
gen:
	npm run gen

# Drift guard: regenerate, then fail if any committed artifact is stale.
check:
	npm run check

# Design-system docs site — Foundations · Brands · Components, organised like the Geist
# (Vercel) site: colours, typography, materials, layout, icons, brand assets and a live
# per-component reference (each with an App-dense / Web-airy preview toggle), plus a ⌘K
# search palette and a light/dark toggle. Everything renders LIVE from the single sources of
# truth, so it can never drift. `/` IS the docs site (no directory listing). Regenerates
# first so it always reflects the current tokens/icons/components.
dev: gen
	@python3 scripts/serve.py $(GALLERY_PORT) 127.0.0.1

# Same, bound to all interfaces for a forwarded port (remote / container dev).
dev-forwarded: gen
	@python3 scripts/serve.py $(FORWARDED_GALLERY_PORT) 0.0.0.0

# Same, but on the Fugu (non-EU) dev host's port range so it can be tunnelled
# alongside the EU host without local port clashes (FUGU = FORWARDED + 40000).
dev-forwarded-fugu: gen
	@python3 scripts/serve.py $(FUGU_GALLERY_PORT) 0.0.0.0
