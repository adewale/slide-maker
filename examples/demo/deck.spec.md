# Deck Spec

## Meta
- title: Slide Maker
- purpose: introduce the slide-maker skill
- audience: developers and Claude Code users
- tone: assertive, energetic, approachable
- target-length: 11
- notes: yes
- style-preset: bold-modern

## Design Tokens
- colors:
  - bg: "#0f0a1e"
  - fg: "#f0eef5"
  - accent: "#a78bfa"
  - accent-alt: "#fb923c"
  - muted: "rgba(240, 238, 245, 0.5)"
- typography:
  - display: Outfit
  - body: Plus Jakarta Sans
  - mono: JetBrains Mono
- motion:
  - preset: medium-reveal

## Layout System
- prefer-builtins: true
- builtins:
  - cover
  - statement
  - section
  - default
  - two-cols-header
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
- subtitle: Native Slidev decks. Strong visual direction. Minimal abstraction.

### Slide 2
- kind: center-statement
- layout: statement
- title: Most generated slides are too generic or too brittle

### Slide 3
- kind: split-insight
- layout: SplitInsight
- title: Two layers. One source of truth.
- left:
  - heading: Planning layer
  - bullet: deck.spec.md captures intent
  - bullet: Structure, tokens, boundaries
  - bullet: The blueprint you edit first
- right:
  - heading: Presentation layer
  - bullet: slides.md is the compiled output
  - bullet: Native Slidev Markdown
  - bullet: The building you present

### Slide 4
- kind: section
- layout: section
- title: The escalation ladder
- subtitle: Use the lowest level that solves the slide cleanly.

### Slide 5
- kind: default-content
- layout: default
- title: Five levels of implementation
- body:
  - numbered: Markdown — always start here
  - numbered: Built-in layout — cover, section, center, fact, end
  - numbered: Custom layout — only when a structure repeats
  - numbered: Custom component — only when a block has props and reuse
  - numbered: Inline HTML — last resort

### Slide 6
- kind: split-insight
- layout: SplitInsight
- title: What goes in. What comes out.
- left:
  - heading: Inputs
  - bullet: Title, goal, audience
  - bullet: Tone and target length
  - bullet: Source material
  - bullet: Brand constraints
- right:
  - heading: Outputs
  - bullet: slides.md
  - bullet: deck.spec.md
  - bullet: styles/tokens.css + theme.css
  - bullet: Layouts and components only when justified

### Slide 7
- kind: default-content
- layout: default
- title: Three visual directions
- body:
  - diagram: mindmap of editorial-dark, swiss-minimal, bold-modern

### Slide 8
- kind: default-content
- layout: default
- title: Five-step workflow
- body:
  - diagram: flowchart Intake to Direction to Spec to Compile to Validate

### Slide 9
- kind: fact
- layout: fact
- title: 6
- subtitle: Priorities in order
- body: Editability, Clarity, Coherence, Native Slidev, Reuse, Restraint

### Slide 10
- kind: quote-pull
- layout: quote
- title: Restraint is the feature
- body: A good deck has few layouts, few components, readable Markdown, and no legacy HTML smell.

### Slide 11
- kind: end
- layout: end
- title: Start building
- body: /slide-maker in Claude Code
