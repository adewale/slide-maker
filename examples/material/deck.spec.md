# Deck Spec

## Meta
- title: Keyboardia
- purpose: product launch narrative for multiplayer step sequencer
- audience: engineers and product teams building collaborative tools
- tone: systematic, polished, product-oriented
- target-length: 10
- notes: no
- style-preset: material-design

## Design Tokens
- colors:
  - bg: "#FFFBFE"
  - fg: "#1C1B1F"
  - accent: "#6750A4"
  - accent-alt: "#625B71"
  - primary-container: "#EADDFF"
  - secondary-container: "#E8DEF8"
  - muted: "rgba(28, 27, 31, 0.5)"
- typography:
  - display: Outfit
  - body: Plus Jakarta Sans
  - mono: Roboto Mono
- motion:
  - preset: m3-container-transform

## Layout System
- prefer-builtins: true
- builtins:
  - cover
  - center
  - default
  - section
  - fact
  - two-cols
  - end
- custom-layouts:
  - MaterialSlide
- components:
  - MDCard
  - MDChip
  - MDSurface
- css-files:
  - styles/tokens.css
  - styles/theme.css

## Slides

### Slide 1
- kind: cover
- layout: cover
- title: Keyboardia
- subtitle: 10 players. 64 instruments. One room.

### Slide 2
- kind: problem
- layout: MaterialSlide
- title: Web audio is a minefield
- body: Three M3 cards with war stories from Lessons Learned (gain staging, memory leaks, voice limiting)

### Slide 3
- kind: diagram
- layout: default
- title: The architecture
- body: Mermaid diagram with M3 color tokens. Nodes use primaryContainer fills.

### Slide 4
- kind: three-surfaces
- layout: MaterialSlide
- title: Three surfaces must align
- body: API, UI, and Session State — three M3 cards at different elevations, revealed progressively

### Slide 5
- kind: constraint
- layout: default
- title: The real-time challenge
- body: "DO hibernation breaks setTimeout." Code block. v-mark.box on critical constraint.

### Slide 6
- kind: chips
- layout: MaterialSlide
- title: Multiplayer war stories
- body: M3 chips for each lesson (XSS, reconnection jitter, offline queues, state hash)

### Slide 7
- kind: data
- layout: MaterialSlide
- title: The numbers
- body: Metric cards with project data

### Slide 8
- kind: mockup
- layout: default
- title: What we shipped
- body: SVG mockup of Keyboardia UI grid with instrument pads

### Slide 9
- kind: lessons
- layout: MaterialSlide
- title: Three lessons
- body: Three M3 outlined cards with top architectural lessons

### Slide 10
- kind: end
- layout: end
- title: Play together
