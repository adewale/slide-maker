# Deck Spec

## Meta
- title: Slide Maker
- purpose: introduce the slide-maker skill — its architecture, workflow, and design philosophy
- audience: developers and Claude Code users building presentation decks
- tone: direct, specific, opinionated
- target-length: 12
- notes: yes
- style-preset: editorial-dark
- progress: segment-bar

## Design Tokens
- colors:
  - bg: "#f4f0e8"
  - fg: "#2b2622"
  - accent: "#b44215"
  - accent-alt: "#2a6e4e"
  - muted: "#8a7f72"
  - rule: "#c9c1b3"
  - code-bg: "#ebe5d9"
- typography:
  - display: Young Serif
  - body: Source Sans 3
  - mono: Source Code Pro
- motion:
  - preset: editorial-restrained

## Layout System
- prefer-builtins: true
- builtins:
  - cover
  - statement
  - section
  - default
  - center
  - fact
  - quote
  - end
- custom-layouts:
  - SplitInsight
- components: []
- css-files:
  - styles/tokens.css
  - styles/theme.css

## Slides

### Slide 1
- kind: cover
- layout: cover
- title: Slide Maker
- subtitle: Decks that survive the podium. Built from specs, not templates.

### Slide 2
- kind: center-statement
- layout: statement
- title: Every generated deck looks the same because styling happens last

### Slide 3
- kind: default-content
- layout: default
- title: The fix: decide direction before writing a single slide
- body:
  - diagram: flowchart Brief → Direction → Spec → Compile → Validate → Present (inline styled nodes, no edge labels)
  - text: Direction is step two — before the spec, before any slides exist.

### Slide 4
- kind: split-insight
- layout: SplitInsight
- title: Two layers, one source of truth
- left:
  - heading: Planning layer
  - bullet: deck.spec.md locks intent before compilation
  - bullet: Tokens, layout choices, slide outlines
  - bullet: Edit the blueprint to change direction
- right:
  - heading: Presentation layer
  - bullet: slides.md is native Slidev Markdown
  - bullet: tokens.css + theme.css carry the visual identity
  - bullet: Edit slides to change content — nothing breaks

### Slide 5
- kind: default-content
- layout: default
- title: Six presets, zero sameness
- body:
  - bullet: editorial-dark — Playfair Display on near-black
  - bullet: swiss-minimal — DM Sans on white
  - bullet: bold-modern — Bebas Neue, saturated backgrounds
  - bullet: tufte-data — EB Garamond, 60/30 column split
  - bullet: cloudflare — Warm cream, orange accents
  - bullet: material-design — M3 elevation, systematic

### Slide 6
- kind: section
- layout: section
- title: What the compiler actually does
- subtitle: Not a template engine. A seven-phase build.

### Slide 7
- kind: default-content
- layout: default
- title: The build: normalize, decide, write, validate
- body:
  - numbered: Normalize the brief into structured inputs
  - numbered: Decide implementation level per slide
  - numbered: Write headmatter with tokens, fonts, transitions
  - numbered: Write slides using the spec's outline
  - numbered: Write tokens and theme CSS
  - numbered: Validate — WCAG contrast, LLM-tell audit, CRAP principles
  - numbered: Screenshot audit

### Slide 8
- kind: default-content
- layout: default
- title: The toolkit
- body:
  - grid: 2-column breadth overview
  - left: 12 transitions, v-motion, v-mark (5 styles), Shiki Magic Move
  - right: 8 Mermaid diagram types, WCAG checking, LLM-tell detection, CRAP audit

### Slide 9
- kind: center
- layout: center
- title: The priority stack
- body: Editability, Clarity, Coherence, Native Slidev, Reuse, Restraint (opacity gradient, progressive reveal)

### Slide 10
- kind: quote-pull
- layout: quote
- title: The test: close the tab. What do you remember?
- body: A generic deck leaves nothing. No image, no number, no story.

### Slide 11
- kind: end
- layout: end
- title: Direction first. Then slides.
- body: That is the entire idea.
