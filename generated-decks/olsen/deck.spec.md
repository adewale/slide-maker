# Deck Spec

## Meta
- title: Olsen
- purpose: present a high-performance photo indexer that treats read-only access as an architectural virtue
- audience: developers building media pipelines, photo management tools, or local-first applications
- tone: scholarly, evidence-driven, precise
- target-length: 7
- notes: yes
- style-preset: tufte-data
- project-url: https://github.com/adewale/olsen
- progress: segment-bar

## Source Materials
- readme: README.md (project overview -- DNG/JPEG/BMP indexing, thumbnail generation, color analysis, perceptual hashing, SQLite storage)
- specs: specs/olsen_specs.md (system specification -- 50+ metadata fields, four thumbnail sizes, 8-stage pipeline, faceted query engine)
- specs: specs/facet_state_machine.spec (state machine navigation -- zero-result prevention, data-driven enablement, filter preservation)
- specs: specs/performance.spec (performance instrumentation -- 8-stage pipeline timing, bottleneck analysis, worker scaling)
- research: specs/faceted_ux_research_synthesis.md (UX research -- Nielsen Norman Group, Morville, Tunkelang findings on faceted navigation)

## Through-Line
- concept: "Read-only to sources -- the constraint that became the architecture"
- type: design-rule
- appears-in:
  - slide 2: default -- introduces O_RDONLY as the first design decision, not a limitation
  - slide 4: section -- "the constraint that became the architecture" reframed
  - slide 5: default -- read-only forces all output into a single portable SQLite file
  - slide 7: end -- resolution: the read-only constraint made every other decision simpler

## Design Tokens
- colors:
  - bg: "#fffff8"
  - fg: "#111111"
  - accent: "#2d5f8a"
  - accent-alt: "#c0392b"
  - muted: "rgba(17, 17, 17, 0.5)"
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
  - end
- custom-layouts: []
- components:
  - ProgressSegmentBar
- css-files:
  - styles/tokens.css
  - styles/theme.css

## Slides

### Slide 1
- kind: cover
- layout: cover
- title: Olsen
- subtitle: A high-performance photo indexing system for DNG, JPEG, and BMP files

### Slide 2
- kind: default-content
- layout: default
- title: What Is Olsen?
- body: A local-first photo cataloger that extracts EXIF metadata, generates aspect-ratio-preserving thumbnails at four sizes, analyzes dominant color palettes via k-means clustering, and computes perceptual hashes for similarity detection. Every file is opened O_RDONLY. The indexer never modifies a source photograph.
- sources:
  - https://github.com/adewale/olsen/blob/main/README.md -- project overview and feature list
  - https://github.com/adewale/olsen/blob/main/specs/olsen_specs.md -- system specification

### Slide 3
- kind: fact
- layout: fact
- title: 62ms
- body: Combined processing time per photo on Apple M3 Max -- 34ms thumbnail generation, 28ms color extraction, 0.6ms hashing. At 8 workers, the indexer sustains 15-25 photos per second.
- sources:
  - https://github.com/adewale/olsen/blob/main/specs/performance.spec -- pipeline timing breakdown

### Slide 4
- kind: section
- layout: section
- title: The Constraint That Became the Architecture

### Slide 5
- kind: default-content
- layout: default
- title: One SQLite File Is the Catalog
- body: Because the indexer cannot write back to source files, every derived artifact -- thumbnails, color palettes, perceptual hashes, burst groups, duplicate clusters -- lives in a single SQLite database. The database IS the catalog. Move the file, move the collection. No sidecar files, no hidden directories, no server process.
- sources:
  - https://github.com/adewale/olsen/blob/main/specs/olsen_specs.md -- "the SQLite database IS the catalog"

### Slide 6
- kind: center-statement
- layout: center
- title: Users can never reach zero results
- body: Olsen's faceted navigation is a state machine, not a hierarchy. Every filter transition is validated against actual data -- values that would produce empty results are disabled before the user can select them. No dead ends.
- sources:
  - https://github.com/adewale/olsen/blob/main/specs/facet_state_machine.spec -- state machine navigation design
  - https://github.com/adewale/olsen/blob/main/specs/faceted_ux_research_synthesis.md -- UX research synthesis

### Slide 7
- kind: end
- layout: end
- title: Read-Only Made Everything Simpler
- subtitle: One constraint. One file. One way to browse 100,000 photographs.
