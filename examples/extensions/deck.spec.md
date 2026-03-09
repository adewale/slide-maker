# Deck Spec

## Meta
- title: Extensions
- purpose: Catalog every extension built on top of Slidev in this project
- audience: Developers exploring the slide-maker project
- tone: Technical reference, concise
- target-length: 12
- notes: yes
- style-preset: bold-modern

## Design Tokens
- colors:
  - bg: "#0a0a0f"
  - fg: "#f0f0f5"
  - accent: "#a78bfa"
  - muted: "rgba(240, 240, 245, 0.5)"
- typography:
  - display: Bebas Neue
  - body: DM Sans
  - mono: JetBrains Mono
- motion:
  - preset: slide-left (primary), fade (transitions between sections)

## Layout System
- prefer-builtins: true
- builtins:
  - cover
  - default
  - statement
  - fact
  - end
- custom-layouts: []
- components: []
- css-files:
  - styles/tokens.css
  - styles/theme.css

## Slides

### Slide 1
- kind: cover
- layout: cover
- title: Extensions
- subtitle: Every way we've extended Slidev.

### Slide 2
- kind: statement
- layout: statement
- title: Slidev is a platform, not a template

### Slide 3
- kind: content
- layout: default
- title: Visual Effect Components
- content: GlassCard, ImageFX, RevealPath, ShadowStack, CornerCard
- sources:
  - file:slide-maker/COMPILER_RULES.md — animation component catalog

### Slide 4
- kind: content
- layout: default
- title: Data Visualization Components
- content: Sparkline, SmallMultiples, DataTable, MicroBar, SlopeChart, BulletBar, DotStrip, WinLoss
- sources:
  - file:slide-maker/COMPILER_RULES.md — data visualization component catalog

### Slide 5
- kind: content
- layout: default
- title: Custom Transitions
- content: 13 cinematic transitions + 6 interaction patterns
- sources:
  - file:slide-maker/COMPILER_RULES.md — transition grammar

### Slide 6
- kind: content
- layout: default
- title: Universal Scaffold
- content: KeyboardHelp, global-bottom footer, mermaid-renderer, shortcuts — present in every deck
- sources:
  - file:slide-maker/COMPILER_RULES.md — universal features specification

### Slide 7
- kind: content
- layout: default
- title: Tufte Deck Extensions
- content: TufteSlide layout, Sidenote, Sparkline, SmallMultiples, DataTable
- sources:
  - file:examples/tufte/ — Tufte deck component source

### Slide 8
- kind: content
- layout: default
- title: Design Token System
- content: --deck-* CSS variables, tokens.css → theme.css pattern
- sources:
  - file:slide-maker/COMPILER_RULES.md — token specification

### Slide 9
- kind: content
- layout: default
- title: Seven Style Presets
- content: editorial-dark, swiss-minimal, bold-modern, sumi-e, tufte-data, cloudflare, material-design
- sources:
  - file:slide-maker/STYLE_PRESETS.md — preset definitions

### Slide 10
- kind: content
- layout: default
- title: Build Tools
- content: new-deck, deck-lint, style-audit, deck-preview, deck-diff, compare-decks, build-and-verify
- sources:
  - file:tools/ — build tool source files

### Slide 11
- kind: fact
- layout: fact
- title: 5 + 8 + 13 + 7 + 7

### Slide 12
- kind: end
- layout: end
- title: The best extension is the one you don't need to write
