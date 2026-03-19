# Deck Spec

## Meta
- title: Olsen
- subtitle: A read-only photo indexer that treats your library as sacred ground
- purpose: introduce Olsen's architecture, design philosophy, and key technical insights to developers who work with photo libraries
- audience: developers and engineers interested in photo management, metadata systems, and local-first tools
- tone: scholarly, specific, evidence-driven
- target-length: 7
- notes: yes
- style-preset: tufte-data
- project-url: https://github.com/adewale/olsen
- progress: tally-marks

## Source Materials
- readme: README.md (project overview -- what it does, supported formats, performance benchmarks, architecture diagram)
- changelog: CHANGELOG.md (v0.1.0 release -- full feature inventory, dependency list, performance data)
- architecture: docs/architecture.md (four-layer system, worker pool pattern, read-only guarantee enforcement)
- lessons-learned: docs/LESSONS_LEARNED.md (Monochrom DNG thumbnail bug, faceted navigation state machine discovery, debugging-at-source rule)
- specs: specs/facet_state_machine.spec (state machine model for faceted search, zero-result prevention)
- flow: docs/flow.md (complete indexing pipeline from CLI invocation to summary report)

## Through-Line
- concept: "Read-only to sources, read-write to understanding"
- type: design-rule
- appears-in:
  - slide 1: cover -- the constraint is introduced as the project's founding rule
  - slide 2: section -- the read-only guarantee as architectural enforcement, not policy
  - slide 4: center-statement -- the constraint flips: what you extract is richer than what you touch
  - slide 5: default-content -- the state machine prevents invalid transitions, another form of read-only discipline
  - slide 7: end -- the constraint resolves as a broader design philosophy

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
- components: []
- css-files:
  - styles/tokens.css
  - styles/theme.css
  - styles/transitions.css

## Slides

### Slide 1
- kind: cover
- layout: cover
- title: Olsen
- subtitle: A read-only photo indexer that treats your library as sacred ground
- notes:
  - Olsen is a Go CLI tool for indexing DNG, JPEG, and BMP photos. The read-only constraint is not a feature flag -- it is enforced at the syscall level with O_RDONLY. This deck traces why that one decision shaped everything else.

### Slide 2
- kind: section
- layout: section
- transition: fade
- title: The read-only guarantee
- subtitle: O_RDONLY is not a policy. It is a syscall.
- notes:
  - The indexer uses os.Open() which opens with O_RDONLY. No os.Create, os.OpenFile, os.WriteFile, os.Remove, or os.Rename anywhere in the codebase. Image processing happens entirely in memory. Only the SQLite database is modified.

### Slide 3
- kind: default-content
- layout: two-cols
- transition: slide-left
- title: 62ms per photo
- left:
  - File hash: 0.4ms
  - Thumbnail generation (4 sizes): 34ms
  - Color palette (k-means): 28ms
  - Perceptual hash: 0.2ms
- right:
  - 15-25 photos/second with 8 workers
  - 100K library: 1.5-2 hours initial index
  - Database: ~20-25 GB (with thumbnails)
  - Memory: ~500 MB constant
- sources:
  - README.md -- performance benchmarks on Apple M3 Max
  - CHANGELOG.md -- v0.1.0 performance details

### Slide 4
- kind: center-statement
- layout: center
- transition: fade
- title: Five processing stages. Zero writes to source files.
- body: EXIF extraction, thumbnail generation, color palette analysis, perceptual hashing, metadata inference -- all in memory, all flowing into a single SQLite file.
- sources:
  - docs/architecture.md -- indexer engine components and read-only enforcement
  - docs/flow.md -- complete indexing pipeline

### Slide 5
- kind: default-content
- layout: default
- transition: slide-up
- title: The state machine insight
- body: Faceted navigation is not a hierarchy. Year does not "contain" Month. Every filter combination is a state, and the only valid transitions are ones that produce results.
- sources:
  - specs/facet_state_machine.spec -- core insight, state transition rules
  - docs/LESSONS_LEARNED.md -- "Assumed Hierarchical Relationships" mistake

### Slide 6
- kind: default-content
- layout: default
- transition: slide-left
- title: 160x120px
- body: The Monochrom DNG bug. ExtractEmbeddedJPEG() returned the first JPEG preview -- 160x120 pixels -- not the largest at 9504x6320. The UI showed black thumbnails. The team fixed display fallbacks, database queries, and upscale logic before discovering the decode layer was returning the wrong image.
- sources:
  - docs/LESSONS_LEARNED.md -- Monochrom DNG thumbnail bug timeline
  - docs/LESSONS_LEARNED.md -- "Always Debug at the Source" rule

### Slide 7
- kind: end
- layout: end
- transition: fade
- title: Read-only to sources. Read-write to understanding.
- subtitle: github.com/adewale/olsen
- notes:
  - The read-only constraint was not a limitation. It was the decision that made everything else possible -- portable databases, safe re-indexing, concurrent workers without file locks. The constraint freed the architecture.
