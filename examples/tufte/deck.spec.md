# Deck Spec

## Meta
- title: Debug at the Source
- purpose: detective story about the Monochrom DNG thumbnail bug from Olsen project
- audience: developers who debug production systems
- tone: scholarly, dense, evidence-driven
- target-length: 10
- notes: no
- style-preset: tufte-data

## Design Tokens
- colors:
  - bg: "#fffff8"
  - fg: "#111111"
  - accent: "#2d5f8a"
  - accent-alt: "#c0392b"
  - muted: "rgba(17, 17, 17, 0.5)"
- typography:
  - display: EB Garamond
  - body: EB Garamond
  - labels: Source Sans 3
  - mono: Source Code Pro
- motion:
  - preset: evidence-reveal

## Layout System
- prefer-builtins: true
- builtins:
  - cover
  - center
  - default
  - section
  - end
- custom-layouts:
  - TufteSlide
- components:
  - Sparkline
  - Sidenote
  - SmallMultiples
  - DataTable
- css-files:
  - styles/tokens.css
  - styles/theme.css

## Slides

### Slide 1
- kind: cover
- layout: cover
- title: Debug at the Source
- subtitle: A thumbnail bug, a wrong turn, and the 60x speedup hiding in plain sight.

### Slide 2
- kind: mystery
- layout: TufteSlide
- title: The mystery
- body: "160x120px. A thumbnail that should have been 9504x6320." Dense paragraph with sidenote explaining DNG format context.

### Slide 3
- kind: false-trail
- layout: TufteSlide
- title: The false trail
- body: "We fixed the UI. Then the thumbnails turned black." Numbered list of wrong debugging steps with v-mark strikethroughs.

### Slide 4
- kind: code-transform
- layout: default
- title: The evidence
- body: Code comparison using Shiki Magic Move — old ExtractEmbeddedJPEG (first-match) vs new (largest-match). v-mark.highlight on the critical line.

### Slide 5
- kind: data
- layout: TufteSlide
- title: The data
- body: Performance comparison with Sparkline — LibRaw decode (1200ms) vs embedded JPEG (20ms). 60x speedup. Small multiples showing thumbnail sizes.

### Slide 6
- kind: rule
- layout: TufteSlide
- title: The rule
- body: "When data is wrong, start at the SOURCE, never the DISPLAY layer." Large serif with debugging order hierarchy as marginal annotation.

### Slide 7
- kind: dense-prose
- layout: TufteSlide
- title: Five lessons
- body: Dense prose with sidenotes. State machines over hierarchies. Simple over complex. Test at the right layer. Visual inspection over metrics. Diagnostic logging proactively.

### Slide 8
- kind: section
- layout: section
- title: Start at the source

### Slide 9
- kind: insight
- layout: center
- title: Sometimes the simple solution is 100x better than the complex solution
- body: Quote from Olsen Lessons Learned

### Slide 10
- kind: end
- layout: end
- title: Debug at the Source
- body: Olsen — local-first photo indexing
