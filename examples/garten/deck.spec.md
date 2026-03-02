# Deck Spec

## Meta
- title: Garten
- purpose: showcase the project
- audience: developers and designers
- tone: warm, precise, inviting
- target-length: 8
- notes: yes
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
  - statement
  - center
  - default
  - two-cols-header
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
- transition: fade
- title: Garten
- subtitle: An animated canvas garden that grows over time. Zero dependencies.
- notes: yes

### Slide 2
- kind: why
- layout: statement
- transition: slide-left
- title: Static hero backgrounds are boring
- body: Every website has the same gradient or stock photo. What if your background was alive? What if it grew over time?

### Slide 3
- kind: code
- layout: default
- transition: slide-up
- title: One line to start a garden
- body: JavaScript constructor with preset, density, and deterministic seed
- notes: yes

### Slide 4
- kind: two-cols
- layout: two-cols-header
- transition: fade
- title: Customize everything
- body:
  - left: Presets — 12 presets, 11 color themes
  - right: Controls — density, timing, accent colors, deterministic seeding
- interactive: hover-accent on preset/control items

### Slide 5
- kind: visual
- layout: center
- transition: slide-up
- title: Growth metaphor
- body: v-motion animated growth element with v-mark design insight on zero dependencies
- features:
  - v-motion spring entrance
  - v-mark underline

### Slide 6
- kind: diagram
- layout: default
- transition: slide-left
- title: Playback API
- body: Mermaid graph — init to play with pause, seek, speed, destroy branches

### Slide 7
- kind: fact
- layout: fact
- transition: fade
- title: 147
- subtitle: plants, 19 categories, 0 dependencies
- body: <4KB gzipped. Pure Canvas API. No framework. No build step.
- notes: yes

### Slide 8
- kind: end
- layout: end
- transition: slide-left
- title: Try it
- body: npm install garten
