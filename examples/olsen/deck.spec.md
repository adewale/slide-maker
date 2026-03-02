# Deck Spec

## Meta
- title: Olsen
- purpose: showcase the project
- audience: developers and photographers
- tone: precise, calm, confident
- target-length: 9
- notes: yes
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
  - statement
  - default
  - two-cols
  - section
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
- transition: slide-left
- title: Olsen
- subtitle: Local-first photo indexing and faceted browsing.
- notes: yes

### Slide 2
- kind: statement
- layout: statement
- transition: fade
- title: Your photos. Your database. Guaranteed read-only.
- body: Olsen indexes without touching a single source file. No sidecar files. No hidden databases. One SQLite file you control.

### Slide 3
- kind: default-content
- layout: default
- transition: slide-up
- title: Why build another photo tool?
- body:
  - bullet: Photo libraries grow to 100K+ images. Existing tools lock you in.
  - bullet: Apple Photos and Google Photos own the index. You can't query or export it.
  - bullet: Olsen indexes into a single SQLite database — never modifies a source file.
- features:
  - v-clicks

### Slide 4
- kind: code
- layout: default
- transition: slide-left
- title: Extracting from raw photos
- body: Go code showing embedded JPEG extraction from DNG files. Avoids decoding raw Bayer data for thumbnail generation.
- notes: yes

### Slide 5
- kind: two-cols
- layout: two-cols
- transition: fade
- title: What it extracts / Faceted search
- body:
  - left:
    - bullet: EXIF metadata — camera, lens, exposure, GPS
    - bullet: Thumbnails at 4 sizes, aspect-preserving
    - bullet: Dominant colors via k-means clustering
    - bullet: Perceptual hashes for duplicate detection
  - right:
    - bullet: Users never hit zero results
    - bullet: SQL computes valid facet values
    - bullet: 11 Berlin-Kay color categories
    - bullet: Temporal, visual, equipment facets
- features:
  - v-clicks
  - v-mark on "Users never hit zero results"
  - hover-accent interactive styling

### Slide 6
- kind: diagram
- layout: default
- transition: slide-up
- title: The state machine guarantee
- body: Mermaid TD diagram — filter state machine from All Photos through camera, color, and year filters.
- features:
  - v-motion
  - v-mark on the pre-validation guarantee

### Slide 7
- kind: fact
- layout: fact
- transition: slide-left
- title: 62ms
- subtitle: per photo x 100K photos = 103 minutes
- body: 500MB constant memory. Hash-based resume. Metadata, thumbnails, color palette, and perceptual hash — all in one pass.
- notes: yes

### Slide 8
- kind: section
- layout: section
- transition: fade
- title: Start at the source
- body: Debug from the file, not from the abstraction. Every record links back to the original path.

### Slide 9
- kind: end
- layout: end
- transition: fade
- title: Index your photos
- body: ./bin/olsen index ~/Pictures --db photos.db
