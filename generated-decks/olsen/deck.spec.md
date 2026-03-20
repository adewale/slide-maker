# Deck Spec

## Meta
- title: Olsen
- subtitle: A local-first CLI tool for faceted browsing of photographs
- purpose: present a Go-based photo indexing system that treats faceted navigation as a state machine
- audience: developers interested in local-first tools, data modeling, and search UX
- tone: scholarly, evidence-driven, precise
- target-length: 9
- notes: no
- style-preset: tufte-data
- progress: segment-bar
- project-url: https://github.com/adewale/olsen

## Source Materials
- readme: README.md (project overview -- what it does, formats supported, performance benchmarks, read-only guarantee)
- architecture: docs/architecture.md (4-layer system -- CLI, Indexer Engine, Query Engine, SQLite; worker pool concurrency model)
- lessons-learned: docs/LESSONS_LEARNED.md (state machines over hierarchies, debug at the source not the display, saturation-first color logic)
- specs: specs/facet_state_machine.spec (core insight -- faceted navigation as valid state transitions, not taxonomy)
- specs: specs/dominant_colours.spec (11 Berlin-Kay colors, k-means on thumbnails, saturation-first achromatic detection)
- changelog: CHANGELOG.md (v0.1.0 initial release -- complete feature inventory)
- research: docs/HIERARCHICAL_FACETS.md (migration from hierarchical to state machine model, the bug that revealed the truth)

## Through-Line
- concept: "Constraint as architecture -- every design decision in Olsen is a deliberate restriction that eliminates a class of problems."
- type: design-rule
- appears-in:
  - slide 1: cover -- the project is introduced as a read-only indexer
  - slide 3: center-statement -- read-only is not a limitation, it is the architecture
  - slide 5: default-content -- the state machine constraint prevents zero-result dead ends
  - slide 7: default-content -- saturation-first is a constraint on color classification order
  - slide 9: end -- the resolution: constraints compound into trust

## Design Tokens
- colors:
  - bg: "#fffff8"
  - fg: "#111111"
  - accent: "#2d5f8a"
  - accent-alt: "#c0392b"
  - muted: "rgba(17, 17, 17, 0.45)"
  - border: "rgba(17, 17, 17, 0.12)"
- typography:
  - display: EB Garamond
  - body: Source Sans 3
  - mono: Source Code Pro
- motion:
  - preset: restrained-fade

## Layout System
- prefer-builtins: true
- builtins:
  - cover
  - section
  - default
  - center
  - fact
  - two-cols
  - end
- custom-layouts: []
- components:
  - ProgressSegmentBar
  - KeyboardHelp
- css-files:
  - styles/tokens.css
  - styles/theme.css
  - styles/transitions.css

## Slides

### Slide 1
- kind: cover
- layout: cover
- title: Olsen
- subtitle: A local-first CLI tool for faceted browsing of photographs
- sources:
  - file:README.md -- project description and purpose

### Slide 2
- kind: default-content
- layout: default
- title: What Olsen does in 62 milliseconds
- body: Per-photo pipeline -- EXIF extraction, 4 thumbnail sizes, k-means color palette, perceptual hash, metadata inference. All read-only. All into a single SQLite file.
- sources:
  - file:README.md -- performance benchmarks on M3 Max
  - file:docs/architecture.md -- processing pipeline stages

### Slide 3
- kind: center-statement
- layout: center
- title: Read-only is not a limitation. It is the architecture.
- body: O_RDONLY on every file open. No writes to photo directories. Processing happens entirely in memory. The database is the only mutable artifact.
- sources:
  - file:README.md -- read-only guarantee section
  - file:docs/architecture.md -- enforcement mechanisms

### Slide 4
- kind: section
- layout: section
- title: The state machine insight

### Slide 5
- kind: default-content
- layout: two-cols
- title: Hierarchical vs. state machine navigation
- left: Hierarchical (wrong) -- changing Year clears Month. System assumes relationships. Filters disappear unexpectedly. Users lose context.
- right: State machine (correct) -- all filters preserved. SQL computes valid transitions. Zero-count facets shown but disabled. Behavior emerges from data.
- sources:
  - file:specs/facet_state_machine.spec -- core insight and implementation strategy
  - file:docs/HIERARCHICAL_FACETS.md -- migration from hierarchical to state machine model
  - file:docs/LESSONS_LEARNED.md -- state machines over hierarchies

### Slide 6
- kind: default-content
- layout: default
- title: One rule for every facet
- body: The fundamental guarantee -- users cannot transition from a state with results to a state with zero results. No special cases per facet type. No hardcoded clearing logic. SQL WHERE clauses with GROUP BY naturally compute which transitions are valid.
- sources:
  - file:specs/facet_state_machine.spec -- fundamental rule and implementation
  - file:docs/LESSONS_LEARNED.md -- architectural lesson on state machines

### Slide 7
- kind: default-content
- layout: default
- title: 11 colors, saturation first
- body: Berlin-Kay universal color categories classified from k-means clusters. The critical insight -- check saturation before hue. A grayscale pixel at hue 0 is not red; it is achromatic. Without this ordering constraint, every B&W photograph gets misclassified.
- sources:
  - file:specs/dominant_colours.spec -- saturation-first detection, Berlin-Kay categories
  - file:docs/LESSONS_LEARNED.md -- color classification evolution from v1 to v2

### Slide 8
- kind: default-content
- layout: default
- title: Debug at the source, not the display
- body: The Monochrom DNG bug -- embedded JPEG extraction returned the first preview (160x120) instead of the largest (9504x6320). The fix was not in the UI, not in the database, not in the query layer. It was in the byte scanner that finds SOI/EOI markers in the DNG file.
- sources:
  - file:docs/LESSONS_LEARNED.md -- Monochrom DNG thumbnail bug timeline and debugging order

### Slide 9
- kind: end
- layout: end
- title: Constraints compound into trust
- subtitle: github.com/adewale/olsen
