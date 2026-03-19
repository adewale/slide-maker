# Slide Maker

A Claude Code skill that generates [Slidev](https://sli.dev) presentation decks. It reads a GitHub project's source code and docs to produce slides grounded in what's actually in the repo, or walks through a structured process to create a deck from a brief.

Output is native Slidev Markdown — editable by hand, buildable to static HTML, deployable anywhere.

[Live demo](https://slides-oshineye-dev.adewale-883.workers.dev/slide-maker/)

## Install

```bash
npx skills add adewale/slide-maker
```

Or copy `skills/slide-maker/` into your project's `.claude/skills/` folder manually.

## Usage

```
/slide-maker Create a deck about this project's architecture using the editorial-dark preset
```

```
/slide-maker Create a 7-slide pitch deck about our API monitoring tool using bold-modern
```

```
/slide-maker Update slides.md — split slide 8 into two slides
```

The skill works in two modes: **create** (new deck from a project or brief) and **update** (modify an existing deck).

## What it produces

Every deck includes:

- `deck.spec.md` — planning document that locks visual direction before slides are written
- `slides.md` — the presentation, in standard Slidev Markdown
- `styles/tokens.css` — color, typography, and spacing tokens (`--deck-*` CSS variables)
- `styles/theme.css` — layout-specific styling that references the tokens
- `styles/index.css` — Slidev's auto-discovery entry point

The spec and slides stay in sync. Edit the spec to change direction; edit the slides to change content.

## How it works

The skill follows an 8-phase process:

1. **Determine mode** — create or update
2. **Gather sources** — read the project's README, code, architecture docs
3. **Intake** — normalize the brief into structured inputs
4. **Style direction** — choose from 6 visual presets
5. **Write spec** — `deck.spec.md` with tokens, outlines, layout choices
6. **Compile** — generate `slides.md` and styles from the spec
7. **Validate** — WCAG contrast, LLM-tell audit, CRAP design principles
8. **Deliver** — build instructions for the target platform

### Presets

| Preset | Typography | Background |
|---|---|---|
| editorial-dark | Playfair Display | Near-black |
| swiss-minimal | DM Sans | White |
| bold-modern | Bebas Neue | Saturated color |
| tufte-data | EB Garamond | Light, 60/30 split |
| cloudflare | Source Sans 3 / Young Serif | Warm cream |
| material-design | Roboto | M3 surfaces |

### Validation

The compiler checks its output against:
- WCAG AA contrast ratios (4.5:1 body text, 3:1 large text)
- 60+ LLM-tell anti-patterns (generic phrases, overused fonts, purple gradients)
- CRAP design principles (Contrast, Repetition, Alignment, Proximity)

## Building and deploying

```bash
npm run build     # builds all decks to examples/_build/
npm run serve     # preview at localhost:3030
```

Built decks are static SPAs. The build system generates SPA routing configs for GitHub Pages, Cloudflare Workers, and `npx serve`.

Each built deck exposes its Markdown for programmatic access:

| Path | Content |
|---|---|
| `/deck-name/slides.md` | Full presentation source |
| `/deck-name/slides/1.md` | Individual slide |
| `/deck-name/slides/count` | Total slide count |
| `/llms.txt` | Manifest of all decks ([llmstxt.org](https://llmstxt.org/)) |

## Mobile

On portrait phones (< 640px), decks switch to a vertical scroll view. All slides render in a snap-scrolling stack with click animations resolved. No nav chrome.

## Project structure

```
skills/slide-maker/   # The skill
  components/         # 29 Vue components (progress bars, QR code, keyboard help, etc.)
  composables/        # Shared state (useSections, useHelp, useThumbnails)
  setup/              # Keyboard shortcuts, Mermaid renderer
  styles/             # 13 transitions, 6 hover interactions
examples/             # Two core decks (demo + reference)
  build.sh            # Multi-deck build with per-slide splitting
tools/                # CLI tools (deck-lint, screenshot-audit, verify-deck, etc.)
docs/                 # Design philosophy, rubrics, specs
evals/                # Skill evaluation test cases
```

See [EXTENSIONS.md](EXTENSIONS.md) for the full component and extension reference.

## Limitations

- Requires Node.js 18+ and npm (Slidev dependency)
- Decks are 16:9 landscape — portrait/custom aspect ratios are not supported
- Mobile scroll view works but does not reflow content for small screens
- The 6 presets cover common styles but are not customizable beyond token overrides
- No PPTX export (Slidev supports PDF export via `slidev export`)
- The skill loads ~100KB of reference material during compilation, which uses context window

## License

MIT — see [LICENSE](LICENSE).
