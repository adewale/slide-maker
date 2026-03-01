# Deck Spec

## Meta
- title: The Garden
- purpose: philosophical narrative about constraints breeding creativity, using Garten project
- audience: developers and designers who value simplicity
- tone: contemplative, austere, spacious
- target-length: 10
- notes: no
- style-preset: sumi-e

## Design Tokens
- colors:
  - bg: "#f5f0e8"
  - fg: "#1a1a1a"
  - accent: "#c23b22"
  - muted: "rgba(26, 26, 26, 0.4)"
- typography:
  - display: Zen Old Mincho
  - body: Crimson Pro
  - mono: JetBrains Mono
- motion:
  - preset: ink-flow

## Layout System
- prefer-builtins: true
- builtins:
  - cover
  - center
  - default
  - fact
  - section
  - end
- custom-layouts:
  - ZenSlide
- components:
  - BrushDivider
  - EnsoCircle
  - InkWash
- css-files:
  - styles/tokens.css
  - styles/theme.css
- global-layers:
  - global-bottom.vue

## Slides

### Slide 1
- kind: cover
- layout: cover
- title: The Garden
- subtitle: (empty — vast negative space, title only)

### Slide 2
- kind: fact-contradiction
- layout: ZenSlide
- title: 147 plant species. Zero dependencies.
- body: Pure Canvas API. No framework. No build step.

### Slide 3
- kind: center-statement
- layout: center
- title: Constraints breed creativity
- body: Single sentence. No bullets.

### Slide 4
- kind: default-content
- layout: ZenSlide
- title: What grows
- body:
  - Flowers, trees, grasses, tropicals, cacti, bamboo
  - Plants grow in waves called generations
  - Deterministic seeding for reproducible gardens
  - Respects prefers-reduced-motion

### Slide 5
- kind: diagram
- layout: default
- title: The flow
- body: Mermaid diagram of Garten lifecycle — grayscale, thin borders, minimal nodes

### Slide 6
- kind: center-statement
- layout: center
- title: How a canvas garden teaches emergence
- body: v-motion elements growing into position

### Slide 7
- kind: insight
- layout: ZenSlide
- title: The simple solution
- body: "We spent significant time implementing LibRaw integration when embedded preview extraction would have been faster, simpler, and often higher quality." — from Olsen lessons learned

### Slide 8
- kind: seal
- layout: center
- title: Simplicity (with v-mark vermillion underline on the word)

### Slide 9
- kind: fact
- layout: fact
- title: 147
- subtitle: Plant types
- body: From simple flowers to cherry blossoms, bamboo, and conifers

### Slide 10
- kind: end
- layout: end
- title: (empty — faint enso circle SVG background only)
