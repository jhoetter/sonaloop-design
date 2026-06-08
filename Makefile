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

# Component gallery — the shared tokens + components.css rendered live, split into
# App (dense, Python-SSR) and Website (airy, React/Tailwind) columns. Regenerates first
# so the gallery always reflects the current sources. Open the printed URL.
dev: gen
	@echo "→ component gallery: http://127.0.0.1:$(GALLERY_PORT)/gallery/"
	@python3 -m http.server $(GALLERY_PORT) --bind 127.0.0.1

# Same, bound to all interfaces for a forwarded port (remote / container dev).
dev-forwarded: gen
	@echo "→ forwarded component gallery on :$(FORWARDED_GALLERY_PORT)/gallery/"
	@python3 -m http.server $(FORWARDED_GALLERY_PORT) --bind 0.0.0.0
