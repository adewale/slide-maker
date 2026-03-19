# Slide Maker

Decks that survive the podium. Built from specs, not templates.

[Live demo](https://slides-oshineye-dev.adewale-883.workers.dev/slide-maker/) — try it on your phone too.

## What this is

A Claude Code skill that generates presentation decks grounded in real GitHub
projects. Point it at a repo and it builds a deck from what's actually there —
source code, architecture, decisions — not from generic bullet points.

The same skill walks you through creating any compelling deck using a structured
process: brief, direction, spec, compile, validate, present. Every deck gets a
visual identity before a single slide is written.

Built decks are native [Slidev](https://sli.dev) Markdown — editable, deployable
as static sites, and agent-ready.

## How it works

```
Brief → Direction → Spec → Compile → Validate → Present
```

**Direction first. Then slides.** Most AI slide tools apply a theme after writing
content. Slide Maker forces the visual direction — typography, palette, layout
tendencies, motion character — before compilation starts. This is why no two
decks look the same.

### Two layers, one source of truth

| Layer | File | Purpose |
|---|---|---|
| **Planning** | `deck.spec.md` | Locks intent: tokens, layout choices, slide outlines |
| **Presentation** | `slides.md` | Native Slidev Markdown — edit content without breaking anything |

Edit the spec to change direction. Edit the slides to change content. They stay
in sync but serve different roles.

### Validation is not optional

The compiler checks its own output:
- **WCAG AA** contrast ratios (4.5:1 body, 3:1 large text)
- **LLM-tell audit** against 60+ anti-patterns (no purple gradients, no "Let's dive in")
- **CRAP principles** (Contrast, Repetition, Alignment, Proximity)
- **Screenshot audit** via Playwright — does the rendered deck match the spec?

### Six presets, zero sameness

| Preset | Character | Use case |
|---|---|---|
| **editorial-dark** | Playfair Display on near-black | Board decks, investor updates |
| **swiss-minimal** | DM Sans on white | Technical briefings, research |
| **bold-modern** | Bebas Neue, saturated backgrounds | Launches, keynotes |
| **tufte-data** | EB Garamond, 60/30 column split | Evidence-heavy analysis |
| **cloudflare** | Warm cream, orange accents | Developer workshops |
| **material-design** | M3 elevation, systematic | Product walkthroughs |

## Install

Copy `slide-maker/` into your project's `.claude/skills/` folder:

```bash
cp -r slide-maker/ your-project/.claude/skills/slide-maker/
```

Claude Code discovers the skill automatically.

## Usage

### From a GitHub project

```
/slide-maker Create a deck about this project's architecture using the editorial-dark preset
```

The skill reads your repo — code, docs, READMEs, commit history — and builds a
deck grounded in what's actually there.

### From a brief

```
/slide-maker Create a 10-slide deck about our Q1 product launch using bold-modern
```

The skill walks you through direction, writes a spec, compiles slides, and
validates the output.

## Serving on the web

Decks build to static files and deploy anywhere:

```bash
npm run build                    # build all decks
npm run serve                    # preview at localhost:3030
```

Built-in deployment support for:
- **GitHub Pages** — automated via `.github/workflows/deploy.yml`
- **Cloudflare Workers** — static asset hosting with SPA routing
- **Any static host** — Netlify, Vercel, S3, or `npx serve`

The build system handles multi-deck sites, SPA routing, and per-slide Markdown
splitting automatically.

## Agent-ready

Every built deck exposes its content for programmatic access:

| URL | Content |
|---|---|
| `/deck-name/slides.md` | Full presentation Markdown |
| `/deck-name/slides/1.md` | Individual slide Markdown |
| `/deck-name/slides/count` | Total slide count |
| `/llms.txt` | [llmstxt.org](https://llmstxt.org/) manifest of all decks |

Each deck's HTML includes `<link rel="alternate" type="text/markdown">` pointing
to its source Markdown. Agents can discover, read, and reason about any deck
without rendering it.

## Mobile support

On portrait phones (< 640px), decks automatically switch to a vertical scroll
view — all slides in a snap-scrolling stack with v-click content fully revealed.
No black bars, no nav chrome, no transitions. Just the content.

## Extensions

25 custom Vue components, 13 cinematic transitions, 8 data visualization
components, and presenter mode enhancements built on top of Slidev.
See [EXTENSIONS.md](EXTENSIONS.md) for the full reference.

Highlights: press **?** for keyboard shortcuts, **Q** to share a QR code of the
current slide.

## Project structure

```
slide-maker/          # The skill (copy to .claude/skills/)
  components/         # Canonical Vue components (symlinked by decks)
  composables/        # Shared composables (useSections, useThumbnails)
  styles/             # Shared transitions and interactions CSS
examples/             # Core decks (demo + reference)
  build.sh            # Multi-deck build with per-slide splitting
tools/                # deck-lint, screenshot-audit, style-audit, deck-diff
docs/                 # Philosophy, rubrics, specs, lessons learned
```

## Priority stack

What the skill optimizes for, in order:

1. **Editability** — native Markdown over custom HTML
2. **Clarity** — every slide argues something
3. **Coherence** — no orphan slides, no filler
4. **Native Slidev** — stay on the platform
5. **Reuse** — shared presets, shared transitions
6. **Restraint** — just enough of everything

## License

MIT — see [LICENSE](LICENSE).
