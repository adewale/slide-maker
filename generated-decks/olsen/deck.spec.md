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
- concept: "Photo libraries are fragile. Every tool that touches your originals risks corrupting them. What if the indexer couldn't write?"
- shape: man-in-hole
- type: problem-resolution
- appears-in:
  - slide 1: cover -- the project is introduced as read-only by design, single SQLite catalog
  - slide 2: default -- name the problem: indexers are dangerous, corruption is silent, discovered too late
  - slide 3: center-statement -- Olsen's answer: O_RDONLY on every file, structurally cannot write
  - slide 6: default-content -- the state machine constraint prevents zero-result dead ends
  - slide 7: default-content -- saturation-first is a constraint on color classification order
  - slide 9: default -- build toward resolution: your photos were never touched
  - slide 10: end -- resolve: "Your photos were never touched. Your catalog is a single file. Your originals are exactly as you left them."

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
- title: Photos are precious. Indexers are dangerous.
- body: Every tool that touches your photo library is a risk. EXIF editors rewrite file headers. Catalog apps create sidecar files. Sync tools rename originals. The corruption is silent -- discovered months later, after the backup window has closed. What if the indexer could not write? Not "does not write" -- structurally cannot.
- sources:
  - file:README.md -- critical guarantee section, read-only enforcement
  - file:docs/architecture.md -- O_RDONLY enforcement, what the indexer never does

### Slide 3
- kind: center-statement
- layout: center
- title: Olsen opens every file with O_RDONLY. Every one.
- body: No writes to photo directories -- not temporary files, not EXIF writeback, not renames. Processing happens entirely in memory. The only mutable artifact is a single SQLite database that lives outside your photo library.
- sources:
  - file:README.md -- read-only guarantee section
  - file:docs/architecture.md -- O_RDONLY enforcement, single SQLite output

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
- kind: default-content
- layout: default
- title: Your photos were never touched
- body: 100K photos indexed. Four thumbnail sizes generated. Five dominant colors extracted. Perceptual hashes computed. Faceted navigation across every metadata dimension. And through all of it -- every file opened read-only, every result written to a single SQLite database, every original exactly as you left it.

### Slide 10
- kind: end
- layout: end
- title: Your photos were never touched. Your catalog is a single file. Your originals are exactly as you left them.
- subtitle: github.com/adewale/olsen
