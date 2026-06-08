GALLERY_PORT ?= 6006
FORWARDED_GALLERY_PORT ?= 16006

.PHONY: install gen check dev dev-forwarded

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

# Component gallery — tokens + icons + components rendered live, split into App (dense,
# Python-SSR) and Website (airy, React/Tailwind) columns. `/` IS the gallery (no directory
# listing). Regenerates first so it always reflects the current sources.
dev: gen
	@python3 scripts/serve.py $(GALLERY_PORT) 127.0.0.1

# Same, bound to all interfaces for a forwarded port (remote / container dev).
dev-forwarded: gen
	@python3 scripts/serve.py $(FORWARDED_GALLERY_PORT) 0.0.0.0
