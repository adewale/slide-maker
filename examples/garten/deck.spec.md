# Deck Spec

## Meta
- title: Garten
- purpose: showcase the project
- audience: developers and designers
- tone: warm, precise, inviting
- target-length: 6
- notes: no
- style-preset: swiss-minimal

## Design Tokens
- colors:
  - bg: "#fafdf7"
  - fg: "#1b2e1b"
  - accent: "#2d8a4e"
  - muted: "rgba(27, 46, 27, 0.45)"
- typography:
  - display: Inter Tight
  - body: Inter
  - mono: JetBrains Mono
- motion:
  - preset: subtle-enter

## Layout System
- prefer-builtins: true
- builtins:
  - cover
  - center
  - default
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
- title: Garten
- subtitle: An animated canvas garden that grows over time. Zero dependencies.

### Slide 2
- kind: center-statement
- layout: center
- title: Add a living, breathing background to any webpage with one line of code

### Slide 3
- kind: default-content
- layout: default
- title: What it does
- body:
  - bullet: Plants grow in waves called generations over configurable duration
  - bullet: 147 plant types across 19 categories — flowers, trees, grasses, tropicals
  - bullet: Deterministic seeding for reproducible gardens
  - bullet: Respects prefers-reduced-motion

### Slide 4
- kind: default-content
- layout: default
- title: Customization
- body:
  - bullet: 12 presets — forest, meadow, tropical, zen, ambient, and more
  - bullet: 11 color themes — sakura, autumn, midnight, lavender, ocean
  - bullet: Density, timing curves, accent colors, category filtering
  - bullet: Full playback API — play, pause, seek, speed, destroy

### Slide 5
- kind: fact
- layout: fact
- title: 147
- subtitle: Plant types
- body: Across 19 categories — from simple flowers to cherry blossoms, bamboo, and conifers

### Slide 6
- kind: end
- layout: end
- title: Try it
- body: npm install garten
