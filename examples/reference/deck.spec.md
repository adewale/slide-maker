# Deck Spec

## Meta
- title: Slide Maker Reference
- purpose: document and demonstrate every Slidev feature and Slide Maker extension in a single deck
- audience: deck authors using the Slide Maker skill
- tone: precise, instructive, self-demonstrating
- target-length: 64
- notes: yes
- style-preset: nord-light (custom — based on Beautiful Mermaid defaults)
- progress: segment-bar

## Source Materials
- compiler-rules: slide-maker/COMPILER_RULES.md (compilation phases, acceptance checklist, CRAP principles, diagram guidelines)
- style-presets: slide-maker/STYLE_PRESETS.md (6 preset definitions with palette, typography, motion, interaction)
- slidev-reference: slide-maker/SLIDEV_REFERENCE.md (19 built-in layouts, 18+ components, animation directives)
- deck-spec: slide-maker/DECK_SPEC.md (planning schema for deck.spec.md files)

## Through-Line
- concept: "Every feature earns its slide"
- type: design-rule
- appears-in:
  - slide 1: cover — "Every feature. One deck."
  - slide 2: statement — "This deck exists to be broken, fixed, and improved"
  - each section: the feature demonstrated IS the content

## Design Tokens
- colors:
  - bg: "#eceff4"
  - fg: "#2e3440"
  - accent: "#3b5f87"
  - accent-alt: "#994050"
  - muted: "rgba(46, 52, 64, 0.45)"
- typography:
  - display: Inter
  - body: Source Sans 3
  - mono: JetBrains Mono
- motion:
  - preset: varied (demonstrates all transitions)

## Layout System
- prefer-builtins: true
- builtins:
  - cover
  - statement
  - section
  - default
  - center
  - fact
  - two-cols
  - two-cols-header
  - end
- custom-layouts:
  - SplitInsight
  - TufteSlide
- components:
  - Sidenote
  - Sparkline
  - SmallMultiples
  - DataTable
  - MicroBar
  - SlopeChart
  - BulletBar
  - DotStrip
  - WinLoss
  - GlassCard
  - ImageFX
  - ShadowStack
  - CornerCard
- css-files:
  - styles/tokens.css
  - styles/theme.css

## Sections

### Layouts (pages/layouts.md)
- 8 slides demonstrating built-in and custom layouts
- default, SplitInsight, TufteSlide, center, fact, quote, two-cols

### Interactivity (pages/interactivity.md)
- 4 slides: v-clicks, v-mark, v-click timing, v-motion

### Code (pages/code.md)
- 6 slides: line highlighting, Magic Move, Mermaid LR flow, Mermaid TD tree, sequenceDiagram, stateDiagram-v2

### Data Visualization (pages/dataviz.md)
- slides demonstrating Sparkline, SmallMultiples, DataTable, MicroBar, SlopeChart, BulletBar, DotStrip, WinLoss

### Components (pages/components.md)
- slides demonstrating GlassCard, ImageFX, ShadowStack, CornerCard

### Transitions (pages/transitions.md)
- slides demonstrating all 12 cinematic transitions plus built-in transitions

### Ecosystem (pages/ecosystem.md)
- 4 slides: presets, scaffold files, build tools, deck.spec.md schema

### The Skill (pages/skill.md)
- slides covering the 7-step workflow, compilation phases, through-line mechanics

### Advanced (pages/advanced.md)
- slides covering global layers, MCP integration, PDF export, presenter mode
