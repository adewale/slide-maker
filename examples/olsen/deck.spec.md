# Deck Spec

## Meta
- title: Olsen
- purpose: showcase the project
- audience: developers and photographers
- tone: precise, calm, confident
- target-length: 7
- notes: no
- style-preset: swiss-minimal

## Design Tokens
- colors:
  - bg: "#ffffff"
  - fg: "#18181b"
  - accent: "#ca8a04"
  - muted: "rgba(24, 24, 27, 0.45)"
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
  - center
  - default
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
- subtitle: Local-first photo indexing and faceted browsing.

### Slide 2
- kind: center-statement
- layout: center
- title: Your photos. Your database. Guaranteed read-only.

### Slide 3
- kind: default-content
- layout: default
- title: What it extracts
- body:
  - bullet: EXIF metadata — camera, lens, exposure, GPS, lighting
  - bullet: Aspect-ratio-preserving thumbnails at 4 sizes
  - bullet: Dominant color palette via k-means clustering
  - bullet: Perceptual hashes for near-duplicate detection

### Slide 4
- kind: default-content
- layout: default
- title: Faceted search as state machine
- body:
  - bullet: Users never transition from results to zero results
  - bullet: SQL computes valid facet values given current filters
  - bullet: 11 Berlin-Kay universal color categories
  - bullet: Temporal, visual, equipment, and technical facets

### Slide 5
- kind: default-content
- layout: default
- title: Built for scale
- body:
  - bullet: 100K+ photos — initial index in 1.5-2 hours
  - bullet: 500MB constant memory, ~25GB database with thumbnails
  - bullet: Hash-based resume — re-running skips processed files
  - bullet: Per-file timeout and graceful degradation

### Slide 6
- kind: fact
- layout: fact
- title: 62ms
- subtitle: Per photo
- body: Metadata, thumbnails, color palette, and perceptual hash — all in one pass

### Slide 7
- kind: end
- layout: end
- title: Index your photos
- body: ./bin/olsen index ~/Pictures --db photos.db
