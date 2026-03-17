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
| `COMPILER_RULES.md` | Build phases, CRAP principles, Mermaid reliability matrix, acceptance checklist |
| `DECK_SPEC.md` | Schema for `deck.spec.md` planning documents |
| `SLIDE_KINDS.md` | Canonical slide types and escalation rules |
| `STYLE_PRESETS.md` | 6 visual presets (editorial-dark, swiss-minimal, bold-modern, tufte-data, cloudflare, material-design) |
| `SLIDEV_REFERENCE.md` | Slidev API reference for the skill |
| `styles/` | Shared transition CSS |
| `components/` | Reusable Vue components (GlassCard, ImageFX, Sparkline, SlopeChart, etc.) |

## Example decks

The `examples/` directory contains 2 core decks built with this skill:

- **demo/** (`slide-maker`) — the skill's own presentation deck
- **reference/** — every Slidev feature and Slide Maker extension in one deck (64 slides)

```bash
cd examples && bash build.sh    # build decks
npx serve examples/_build       # serve at http://localhost:3000
```

## Tools

| Tool | Purpose |
|---|---|
| **deck-lint.mjs** | Structural validator — WCAG contrast, Mermaid completeness, token coverage, content density |
| **screenshot-audit.mjs** | Visual regression — Playwright-based contrast, overlap, and rendering checks across all slides and viewports |
| **style-audit.mjs** | Verifies CSS tokens survive the build pipeline |
| **new-deck.sh** | Scaffold a new deck with a style preset |
| **deck-preview.mjs** | Text preview of slide content without launching dev server |
| **deck-diff.mjs** | Visual regression comparison between screenshot sets |
| **compare-decks.mjs** | Side-by-side comparison against a reference URL |

## Project structure

```
slide-maker/          # The skill (copy this to .claude/skills/)
examples/             # Core example decks (demo + reference)
  build.sh            # Builds all decks to _build/
tools/                # Development and quality tools
docs/                 # Lessons learned, rubrics, philosophy
```

## License

MIT — see [LICENSE](LICENSE).
