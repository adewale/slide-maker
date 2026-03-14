# Changelog

All notable changes to the slide-maker skill and its supporting tools.

## [Unreleased]

### Added
- **Repo restructure**: skill-first layout with `slide-maker/`, `examples/`, and `tools/` directories
- **New README.md**: skill-first landing page with install, usage, and project overview
- **docs/ directory**: centralized documentation (`LESSONS_LEARNED.md`, `CHANGELOG.md`)

### Changed
- Moved 11 example decks into `examples/` (root deck → `examples/demo/`)
- Moved 7 dev scripts and `templates/` into `tools/`
- Updated all script paths for the new directory structure
- Updated `.gitignore` for `examples/_build/` and tool output directories

### Removed
- Deleted 6 duplicate docs from root (now only in `slide-maker/`)
- Deleted orphaned `data-components/` directory

---

## [0.1.0] — 2025-02-27

Initial release of the slide-maker skill and monorepo.

### Skill (`slide-maker/`)
- `SKILL.md` — entry point defining create/update modes
- `COMPILER_RULES.md` — 10-phase compilation pipeline with acceptance checklist
- `DECK_SPEC.md` — schema for `deck.spec.md` planning documents
- `SLIDE_KINDS.md` — canonical slide types (cover, section, fact, quote, end, etc.)
- `STYLE_PRESETS.md` — 7 visual presets (editorial-dark, swiss-minimal, bold-modern, sumi-e, tufte-data, cloudflare, material-design)
- `SLIDEV_REFERENCE.md` — comprehensive Slidev API reference
- `styles/transitions.css` — shared transition library
- `components/` — reusable Vue components (GlassCard, ImageFX, ShadowStack, RevealPath)

### Example Decks (11)
- demo (slide-maker intro), vaders, planet-cf, claude-history-explorer, geist-fabrik, olsen, tasche, tufte, durable-objects, extensions, reference

### Tools
- `build.sh` — build all 11 decks to static output
- `build-and-verify.sh` — post-build smoke test (tokens, selectors, fonts, slide counts)
- `deck-lint.mjs` — structural validator for deck directories
- `style-audit.mjs` — CSS-in-build verifier
- `deck-preview.mjs` — headless screenshot tool with contact sheet generation
- `deck-diff.mjs` — visual regression comparison between screenshot sets
- `compare-decks.mjs` — side-by-side comparison against a reference URL
- `new-deck.sh` — scaffold a new deck from a style preset template
- `index.html` — menu page linking all built decks
