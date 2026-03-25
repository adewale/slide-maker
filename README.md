# Slide Maker

A Claude Code skill that turns GitHub repositories into [Slidev](https://sli.dev) presentation decks. Point it at a repo and it reads the source code, architecture docs, and lessons learned to produce slides grounded in what's actually there — not a summary of the README.

Output is native Slidev Markdown: editable by hand, buildable to static HTML, deployable anywhere.

**[See example decks live](https://slides-oshineye-dev.adewale-883.workers.dev/slide-maker/)**

## Install

```bash
npx skills add adewale/slide-maker
```

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

Edit the spec to change direction; edit the slides to change content.

## Presets

| Preset | Typography | Background |
|---|---|---|
| editorial-dark | Playfair Display | Near-black |
| swiss-minimal | DM Sans | White |
| bold-modern | Bebas Neue | Saturated color |
| tufte-data | EB Garamond | Light, 60/30 split |
| cloudflare | Source Sans 3 / Young Serif | Warm cream |
| material-design | Roboto | M3 surfaces |
| croissant-warm | Young Serif | Warm cream |

## Validation

The compiler checks its own output against:

- **WCAG AA** contrast ratios (4.5:1 body text, 3:1 large text)
- **60+ LLM-tell anti-patterns** (generic phrases, overused fonts, purple gradients)
- **CRAP design principles** (Contrast, Repetition, Alignment, Proximity)

Two CLI tools run post-build:

- `deck-lint` — static analysis of CSS tokens, layout alignment, background consistency, content density
- `screenshot-audit` — Playwright-based visual checks (contrast, overlap, overflow, column balance, centering)

## Building and deploying

```bash
npm run build     # builds all decks to examples/_build/
npm run serve     # preview at localhost:3030
```

Built decks are static SPAs. Each exposes its Markdown for programmatic access:

| Path | Content |
|---|---|
| `/deck-name/slides.md` | Full presentation source |
| `/deck-name/slides/1.md` | Individual slide |
| `/deck-name/slides/count` | Total slide count |
| `/llms.txt` | Manifest of all decks ([llmstxt.org](https://llmstxt.org/)) |

## Mobile

On portrait phones (< 640px), decks switch to a vertical scroll view with snap-scrolling and all click animations resolved.

## Limitations

- Requires Node.js 18+ and npm (Slidev dependency)
- Decks are 16:9 landscape — no portrait or custom aspect ratios
- Mobile scroll view works but does not reflow content for small screens
- The 7 presets cover common styles but are not customizable beyond token overrides
- No PPTX export (Slidev supports PDF export via `slidev export`)
- The skill loads ~100KB of reference material during compilation, which uses context window

## License

MIT — see [LICENSE](LICENSE).
