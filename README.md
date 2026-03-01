# slide-maker

A Claude Code skill for creating native Slidev presentation decks with strong visual direction, readable Markdown, and minimal abstraction.

## Install

Copy the `slide-maker/` directory into your project's `.claude/skills/` folder:

```bash
cp -r slide-maker/ your-project/.claude/skills/slide-maker/
```

Claude Code will automatically discover the skill from `slide-maker/SKILL.md`.

## Usage

Once installed, prompt Claude Code with a goal:

```
/slide-maker Create a 10-slide deck about our Q1 product launch using the bold-modern preset
```

The skill generates a complete Slidev project: `slides.md`, `deck.spec.md`, design tokens, theme CSS, and any custom components — ready to preview with `npx slidev`.

## What's in the skill

The `slide-maker/` directory is self-contained:

| File | Purpose |
|---|---|
| `SKILL.md` | Entry point — defines modes, scope, and references |
| `COMPILER_RULES.md` | Build phases and acceptance checklist |
| `DECK_SPEC.md` | Schema for `deck.spec.md` planning documents |
| `SLIDE_KINDS.md` | Canonical slide types and escalation rules |
| `STYLE_PRESETS.md` | Visual presets (editorial-dark, swiss-minimal, bold-modern, etc.) |
| `SLIDEV_REFERENCE.md` | Slidev API reference for the skill |
| `styles/` | Shared transition CSS |
| `components/` | Reusable Vue components (GlassCard, ImageFX, etc.) |

## Example decks

The `examples/` directory contains 14 complete decks built with this skill:

```bash
cd examples && bash build.sh    # build all decks
npx serve examples/_build       # serve at http://localhost:3000
```

See individual decks: `demo/`, `vaders/`, `cloudflare/`, `sumi-e/`, `tufte/`, `material/`, and more.

## Tools

The `tools/` directory contains development utilities:

- **deck-lint.mjs** — structural validator for deck directories
- **style-audit.mjs** — verifies CSS tokens survive the build pipeline
- **deck-preview.mjs** — headless screenshot tool for slide captures
- **deck-diff.mjs** — visual regression comparison between screenshot sets
- **compare-decks.mjs** — side-by-side comparison against a reference URL
- **build-and-verify.sh** — post-build smoke test (tokens, selectors, fonts, slide count)
- **new-deck.sh** — scaffold a new deck with a style preset

## Lessons learned

See [docs/LESSONS_LEARNED.md](docs/LESSONS_LEARNED.md) for hard-won insights from building 14 decks with this skill.
