# Deck Spec

## Meta
- title: Slidev Showcase
- purpose: demonstrate every layout, animation, data component, and Slidev feature in one unified deck
- audience: deck authors learning the skill and the Slidev platform
- tone: practical, energetic, demonstrative
- target-length: 46
- notes: no
- style-preset: bold-modern

## Design Tokens
- colors:
  - bg: "#0f0a1e"
  - fg: "#f0eef5"
  - accent: "#a78bfa"
  - accent-alt: "#fb923c"
  - muted: "rgba(240, 238, 245, 0.5)"
- typography:
  - display: Bricolage Grotesque
  - body: DM Sans
  - mono: JetBrains Mono
- motion:
  - preset: medium-reveal

## Layout System
- prefer-builtins: true
- builtins:
  - cover
  - statement
  - center
  - section
  - default
  - fact
  - quote
  - two-cols
  - two-cols-header
  - intro
  - full
  - end
- custom-layouts:
  - SplitInsight
- components:
  - MetricCard
  - KPICard
  - ProgressBar
  - ComparisonBar
  - StatGrid
  - RankList
  - GlassCard
  - ImageFX
  - ShadowStack
  - RevealPath
  - KeyboardHelp
- css-files:
  - styles/tokens.css
  - styles/theme.css

## Feature Coverage
- v-clicks (progressive reveal)
- v-mark (underline, circle, highlight, strike-through, box, bracket)
- v-motion (physics-based entrances)
- v-switch (multi-state content)
- v-drag (draggable elements and arrows)
- Shiki Magic Move (animated code transitions)
- Shiki line highlighting with click steps
- Iconify icons (mdi, carbon sets)
- Arrow and Transform components
- LightOrDark (theme-aware rendering)
- Toc (table of contents)
- Mermaid diagrams (flowchart, timeline)
- LaTeX / KaTeX math
- Monaco editor (live code editing)
- Code groups
- Cinematic transitions (iris, morph-fade, zoom-in, flip-x, wipe-right, blur, glide)
- GlassCard (backdrop-filter glass effect)
- ShadowStack (multi-layer shadow presets)
- KeyboardHelp (? shortcut overlay)
- custom-nav-controls (wall clock)
- global-top (laser pointer, help panel host)

## Slides

### Slide 1
- kind: cover
- layout: cover
- title: Slidev Showcase
- subtitle: Every layout, component, and feature this skill can produce.
- palette: vaders (#39ff14 on #0a0f0a)

### Slide 2
- kind: section
- layout: section
- title: Built-in Layouts
- palette: keyboardia (#e040fb on #0d0118)

### Slide 3
- kind: center-statement
- layout: statement
- title: The statement layout demands attention

### Slide 4
- kind: center-statement
- layout: center
- title: The center layout focuses a single idea

### Slide 5
- kind: default-content
- layout: default
- title: The default layout carries content

### Slide 6
- kind: fact
- layout: fact
- title: 147 (Plant species)

### Slide 7
- kind: quote-pull
- layout: quote
- title: Good tools disappear into the workflow

### Slide 8
- kind: default-content
- layout: two-cols
- title: editorial-dark vs bold-modern

### Slide 9
- kind: default-content
- layout: two-cols-header
- title: Two columns with a spanning header

### Slide 10
- kind: default-content
- layout: intro
- title: The intro layout

### Slide 11
- kind: split-insight
- layout: SplitInsight
- title: SplitInsight — the recurring split

### Slide 12
- kind: section
- layout: section
- title: Animations and Interactions

### Slide 13
- kind: default-content
- layout: default
- title: v-mark annotations (6 types)

### Slide 14
- kind: default-content
- layout: default
- title: v-motion physics-based entrances

### Slide 15
- kind: default-content
- layout: default
- title: v-switch multi-state content

### Slide 16
- kind: default-content
- layout: default
- title: Shiki Magic Move (3-step code evolution)

### Slide 17
- kind: default-content
- layout: default
- title: Syntax highlighting with click steps

### Slide 18
- kind: default-content
- layout: default
- title: Iconify icons (150k+ inline)

### Slide 19
- kind: default-content
- layout: default
- title: Arrow and Transform components

### Slide 20
- kind: section
- layout: section
- title: Mermaid Diagrams

### Slide 21
- kind: default-content
- layout: default
- title: Flowchart

### Slide 22
- kind: default-content
- layout: default
- title: Timeline

### Slide 23
- kind: section
- layout: section
- title: Data Components (6 Vue components)

### Slide 24
- kind: metrics-grid
- layout: default
- title: MetricCard with deltas

### Slide 25
- kind: default-content
- layout: default
- title: KPICard in a StatGrid

### Slide 26
- kind: default-content
- layout: default
- title: ProgressBar

### Slide 27
- kind: default-content
- layout: default
- title: ComparisonBar

### Slide 28
- kind: default-content
- layout: default
- title: RankList

### Slide 29
- kind: section
- layout: section
- title: Code Features

### Slide 30
- kind: default-content
- layout: default
- title: LaTeX and math expressions

### Slide 31
- kind: default-content
- layout: default
- title: Code groups and Monaco editor

### Slide 32
- kind: default-content
- layout: default
- title: v-drag draggable elements

### Slide 33
- kind: default-content
- layout: full
- title: The full layout edge to edge

### Slide 34
- kind: default-content
- layout: default
- title: LightOrDark theme-aware rendering

### Slide 35
- kind: section
- layout: section
- title: Platform Features

### Slide 36
- kind: default-content
- layout: default
- title: Table of Contents

### Slide 37
- kind: default-content
- layout: default
- title: Component API reference

### Slide 38
- kind: section
- layout: section
- title: Cinematic Transitions
- palette: default (#a78bfa on #0f0a1e)

### Slide 39
- kind: default-content
- layout: default
- title: morph-fade
- transition: morph-fade

### Slide 40
- kind: default-content
- layout: default
- title: zoom-in
- transition: zoom-in

### Slide 41
- kind: default-content
- layout: default
- title: flip-x
- transition: flip-x

### Slide 42
- kind: section
- layout: section
- title: Animation Components

### Slide 43
- kind: default-content
- layout: default
- title: GlassCard

### Slide 44
- kind: default-content
- layout: default
- title: ShadowStack presets

### Slide 45
- kind: default-content
- layout: default
- title: Keyboard shortcuts

### Slide 46
- kind: end
- layout: end
- title: Every feature. One deck.
