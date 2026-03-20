# Deck Spec

## Meta
- title: Olsen
- purpose: introduce Olsen's architecture and design philosophy to developers interested in local-first photo tooling
- audience: developers who work with photograph collections and care about data sovereignty
- tone: scholarly, evidence-driven, precise
- target-length: 7
- notes: yes
- style-preset: tufte-data
- project-url: https://github.com/adewale/olsen
- progress: tally-marks

## Source Materials
- readme: README.md (factual backbone — what Olsen does, supported formats, performance benchmarks, safety guarantees)
- architecture: docs/architecture.md (system layers, worker pool pattern, processing pipeline, storage design)
- changelog: CHANGELOG.md (v0.1.0 feature inventory — indexer, database, web explorer, CLI)
- lessons-learned: docs/LESSONS_LEARNED.md (Monochrom DNG thumbnail bug, state machine discovery, debugging methodology)

## Through-Line
- concept: "Read-only to your photos. Read-write to your understanding of them."
- type: design-rule
- appears-in:
  - slide 2: default-content — the read-only guarantee introduced as the foundational design constraint
  - slide 4: default-content — the processing pipeline extracts without modifying, building a parallel catalog
  - slide 5: center-statement — the state machine insight: data determines valid paths, not hardcoded hierarchies
  - slide 7: end — the resolution: your photos stay untouched, your catalog grows richer

## Design Tokens
- colors:
  - bg: "#fffff8"
  - fg: "#111111"
  - accent: "#2d5f8a"
  - accent-alt: "#c0392b"
  - muted: "#666666"
- typography:
  - display: EB Garamond
  - body: Source Sans 3
  - mono: Source Code Pro
- motion:
  - preset: tufte-evidence-reveal

## Layout System
- prefer-builtins: true
- builtins:
  - cover
  - default
  - center
  - fact
  - two-cols-header
  - end
- custom-layouts: []
- components:
  - KeyboardHelp
  - ProgressTallyMarks
- css-files:
  - styles/index.css

## Slides

### Slide 1
- kind: cover
- layout: cover
- title: Olsen
- subtitle: A local-first CLI tool for faceted browsing of photographs in DNG (and other file formats)
- notes:
  - Olsen is named after the idea of exploring your own photo library with the rigor of a research tool. The subtitle is the project's actual description from the repo.

### Slide 2
- kind: default-content
- layout: default
- title: What Olsen is and why it exists
- body: A high-performance photo indexing system for DNG (Digital Negative), JPEG, and BMP files that extracts comprehensive metadata, generates aspect-ratio-preserving thumbnails, analyzes color palettes, and computes perceptual hashes for similarity detection. The critical guarantee — Olsen NEVER modifies your photo files. All file access uses read-only mode. Only the SQLite database is modified.
- sources:
  - https://github.com/adewale/olsen/blob/main/README.md — project description and read-only guarantee

### Slide 3
- kind: fact
- layout: fact
- title: ~62 ms per photo
- body: File hash 0.4 ms. Thumbnails 34 ms. Color palette 28 ms. Perceptual hash 0.2 ms. 15-25 photos/second on Apple M3 Max.
- sources:
  - https://github.com/adewale/olsen/blob/main/README.md — performance benchmarks

### Slide 4
- kind: default-content
- layout: two-cols-header
- title: The processing pipeline
- left: Extract (EXIF metadata, 50+ fields), Decode (image into memory), Generate (4 thumbnail sizes), Analyze (k-means color palette), Hash (pHash for similarity)
- right: Everything extracted lives in a single SQLite file. ~190 KB per photo. 100K photos fit in ~20 GB. The original files are never touched.
- sources:
  - https://github.com/adewale/olsen/blob/main/docs/architecture.md — processing pipeline and storage architecture

### Slide 5
- kind: center-statement
- layout: center
- title: Faceted navigation is a state machine
- body: Users can never transition from a state with results to a state with zero results. SQL queries compute which facet values have results given current filters. No hardcoded hierarchies — data determines valid paths.
- sources:
  - https://github.com/adewale/olsen/blob/main/README.md — state machine model description
  - https://github.com/adewale/olsen/blob/main/docs/LESSONS_LEARNED.md — state machine discovery

### Slide 6
- kind: default-content
- layout: default
- title: The Monochrom thumbnail bug
- body: ExtractEmbeddedJPEG() returned the FIRST JPEG in the DNG file (160x120 pixels), not the LARGEST (9504x6320). Initial fix patched the UI. The regression — removing isBlackImage() — produced completely black thumbnails. Root cause found only when someone ran exiftool on the actual file.
- sources:
  - https://github.com/adewale/olsen/blob/main/docs/LESSONS_LEARNED.md — Monochrom DNG thumbnail bug timeline

### Slide 7
- kind: end
- layout: end
- title: Your photos stay untouched. Your catalog grows richer.
- subtitle: Read-only to your photos. Read-write to your understanding of them.
- notes:
  - Circle back to the through-line. The design constraint that shaped every decision — never modify source files — is also the value proposition.
