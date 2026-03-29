# Slide Maker

A Claude Code skill that creates [Slidev](https://sli.dev) presentation decks. Point it at a GitHub repo or describe what you want — it reads source code, architecture docs, and lessons learned to produce slides grounded in what's actually there.

Output is native Slidev Markdown: editable by hand, buildable to static HTML, deployable anywhere.

**[See example decks live](https://slides-oshineye-dev.adewale-883.workers.dev/slide-maker/)**

## Install

```bash
npx skills add adewale/slide-maker
```

## Create a deck

```
/slide-maker Create a deck about this project's architecture using the editorial-dark preset
```

```
/slide-maker Create a 7-slide pitch deck about our API monitoring tool using bold-modern
```

The skill walks through intake, style direction, spec writing, compilation, and validation. You approve the visual direction before any slides are written.

## Update a deck

```
/slide-maker Update slides.md — split slide 8 into two slides
```

```
/slide-maker Add a comparison slide after slide 4, showing before/after latency numbers
```

## Preview and share

```bash
npx slidev                # preview locally at localhost:3030
npx slidev export         # export as PDF
python tools/deploy-cf.py # deploy to Cloudflare Workers (one command)
```

Every built deck includes a PDF download button. To deploy manually, `npx slidev build` produces a static `dist/` folder — deploy it to any host (Cloudflare Pages, Vercel, Netlify, GitHub Pages).

## What it produces

| File | Purpose |
|---|---|
| `deck.spec.md` | Planning document — locks visual direction before slides are written |
| `slides.md` | The presentation, in standard Slidev Markdown |
| `styles/tokens.css` | Color, typography, and spacing tokens (`--deck-*` CSS variables) |
| `styles/theme.css` | Layout-specific styling that references the tokens |
| `README.md` | Quick start, build, and share instructions |

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

## Quality checks

The compiler validates its own output against:

- **WCAG AA** contrast ratios (4.5:1 body text, 3:1 large text)
- **60+ LLM-tell anti-patterns** (generic phrases, overused fonts, purple gradients)
- **CRAP design principles** (Contrast, Repetition, Alignment, Proximity)
- **Viewport overflow** — every slide must fit the screen, no scrolling

Two CLI tools run post-build:

```bash
node tools/deck-lint.mjs          # static analysis: tokens, density, Mermaid, alignment
node tools/screenshot-audit.mjs   # visual: contrast, overlap, overflow, column balance
```

## Keyboard shortcuts

| Key | Action |
|---|---|
| `?` | Toggle shortcut help |
| `q` | Share current slide as QR code |
| `p` | Presenter mode |
| `f` | Fullscreen |
| `d` | Dark / light mode |
| `o` | Slide overview |

## Mobile

On portrait phones (< 640px), decks switch to a vertical scroll view with snap-scrolling and all click animations resolved.

## Programmatic access

Built decks expose Markdown for LLMs and tooling:

| Path | Content |
|---|---|
| `/slides.md` | Full presentation source |
| `/slides/1.md` | Individual slide |
| `/slides/count` | Total slide count |
| `/llms.txt` | Manifest of all decks ([llmstxt.org](https://llmstxt.org/)) |

## License

MIT — see [LICENSE](LICENSE).
