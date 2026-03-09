# Deck Spec

## Meta
- title: Olsen
- purpose: showcase a photo indexer that catalogs without modifying, using read-only processing and faceted search
- audience: developers building media processing and search tools
- tone: precise, calm, methodical
- target-length: 12
- notes: yes
- style-preset: swiss-minimal
- project-url: https://github.com/adewale/olsen

## Source Materials
- readme: README.md (features, read-only guarantee, performance benchmarks, supported formats, web explorer with faceted search)
- architecture: docs/architecture.md (4-layer system overview — CLI, Indexer Engine, Query Engine, SQLite; worker pool concurrency; processing pipeline; storage architecture)
- specs: specs/olsen_specs.md (complete technical specification — data model, PhotoMetadata struct, ThumbnailSize constants, database schema)
- specs-colour: specs/dominant_colours.spec (k-means clustering on 256px thumbnails, RGB-to-HSL conversion, Berlin-Kay 11-color classification, B&W saturation detection)
- specs-facets: specs/facet_state_machine.spec (state machine model for faceted navigation — "never zero results" guarantee, filter preservation, data-driven transitions)

## Through-Line
- concept: "Read-only is the feature"
- type: design-rule
- appears-in:
  - slide 1: cover — subtitle states the read-only guarantee
  - slide 2: statement — tension: photo tools that modify, move, lock in your files
  - slide 5: section — through-line named explicitly as the design rule
  - slide 6: default — faceted navigation extends read-only to the query layer (never zero results)
  - slide 8: default — EXIF extraction: files opened O_RDONLY, processed in memory
  - slide 11: center — resolution: the index is disposable, the photos are permanent

## Design Tokens
- colors:
  - bg: "#ffffff"
  - fg: "#18181b"
  - accent: "#ca8a04"
  - muted: "rgba(24, 24, 27, 0.45)"
- typography:
  - display: Plus Jakarta Sans
  - body: Figtree
  - mono: JetBrains Mono
- motion:
  - preset: subtle-enter

## Layout System
- prefer-builtins: true
- builtins:
  - cover
  - statement
  - section
  - default
  - center
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
- title: Olsen
- subtitle: A read-only photo indexer. Your files stay exactly where they are.

### Slide 2
- kind: opening-tension
- layout: statement
- transition: fade
- title: Every photo tool wants write access to your library
- body: They move files into packages, inject sidecar metadata, build proprietary indexes you cannot query. Delete the app and the index is gone.
- sources:
  - https://github.com/adewale/olsen/blob/main/README.md — read-only guarantee and motivation

### Slide 3
- kind: architecture
- layout: default
- transition: zoom-in
- title: Four layers, one guarantee
- body: Mermaid graph — CLI, Indexer Engine, Query Engine, SQLite Database. All file access uses O_RDONLY.
- sources:
  - https://github.com/adewale/olsen/blob/main/docs/architecture.md — 4-layer system overview
  - https://github.com/adewale/olsen/blob/main/README.md — architecture diagram

### Slide 4
- kind: code
- layout: default
- transition: slide-left
- title: Worker pool
- body: Concurrent processing — file scanner feeds a buffered channel, N workers process files in parallel. 8-step pipeline per file.
- sources:
  - https://github.com/adewale/olsen/blob/main/docs/architecture.md — worker pool pattern and concurrency model
  - https://github.com/adewale/olsen/blob/main/README.md — concurrent processing feature

### Slide 5
- kind: section-divider
- layout: section
- transition: iris
- title: Read-only is the feature

### Slide 6
- kind: faceted-navigation
- layout: default
- transition: slide-left
- title: Never zero results
- body: State machine faceted navigation — every filter combination pre-validated, disabled options visible but not clickable. Data determines valid paths.
- sources:
  - https://github.com/adewale/olsen/blob/main/specs/facet_state_machine.spec — state machine model and "never zero results" guarantee
  - https://github.com/adewale/olsen/blob/main/README.md — web explorer faceted search description

### Slide 7
- kind: color-classification
- layout: default
- transition: slide-left
- title: Eleven colors
- body: Berlin-Kay universal color categories from HSL classification. Saturation-first detection catches B&W before hue-based classification.
- sources:
  - https://github.com/adewale/olsen/blob/main/specs/dominant_colours.spec — k-means clustering, HSL conversion, Berlin-Kay 11-color classification, B&W saturation threshold

### Slide 8
- kind: code
- layout: default
- transition: zoom-in
- title: What EXIF extraction looks like
- body: Go code showing O_RDONLY file access, in-memory processing. 50+ metadata fields per photo.
- sources:
  - https://github.com/adewale/olsen/blob/main/docs/architecture.md — read-only enforcement mechanisms, processing pipeline
  - https://github.com/adewale/olsen/blob/main/README.md — EXIF metadata extraction feature

### Slide 9
- kind: thumbnails
- layout: default
- transition: slide-left
- title: Four sizes, one pass
- body: Thumbnail pipeline — 64px grid, 256px list, 512px preview, 1024px detail. Longest-edge constraint preserves aspect ratio.
- sources:
  - https://github.com/adewale/olsen/blob/main/specs/olsen_specs.md — ThumbnailSize constants and aspect-ratio preservation
  - https://github.com/adewale/olsen/blob/main/README.md — thumbnail generation feature

### Slide 10
- kind: fact
- layout: fact
- transition: fade
- title: "~62ms"
- subtitle: per photo. 15-25 photos/sec with 8 workers. 100K library in under 2 hours.
- sources:
  - https://github.com/adewale/olsen/blob/main/README.md — performance benchmarks on Apple M3 Max
  - https://github.com/adewale/olsen/blob/main/docs/architecture.md — time complexity and performance characteristics

### Slide 11
- kind: through-line-resolution
- layout: center
- transition: morph-fade
- title: The index is disposable. The photos are permanent.
- body: Delete the database and rebuild it. Your files are exactly as they were. Read-only is the feature.
- sources:
  - https://github.com/adewale/olsen/blob/main/README.md — read-only guarantee and database portability
  - https://github.com/adewale/olsen/blob/main/docs/architecture.md — storage architecture and database portability

### Slide 12
- kind: end
- layout: end
- transition: fade
- title: Your files have not moved. Now you can find them.
