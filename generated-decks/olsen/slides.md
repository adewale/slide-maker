---
theme: seriph
title: Olsen
transition: fade
layout: cover
fonts:
  serif: EB Garamond
  sans: Source Sans 3
  mono: Source Code Pro
  weights: '400,500'
  italic: true
---

# Olsen

A high-performance photo indexing system for DNG, JPEG, and BMP files

<!--
The cover introduces Olsen by its README description -- a photo indexer for raw and standard image formats. The title is the project name; the subtitle is the project's own one-line summary.
-->

---
transition: slide-up
---

# What Is Olsen?

A local-first photo cataloger written in Go. It processes photographs through an 8-stage pipeline:

<v-clicks>

- Extracts EXIF metadata from DNG, JPEG, and BMP files
- Generates thumbnails at 4 sizes, preserving aspect ratio
- Analyzes dominant colors via k-means clustering
- Computes perceptual hashes for similarity detection
- Infers time of day, season, and focal length category

</v-clicks>

<div v-click>

Every source file is opened with `O_RDONLY`. The indexer *never* modifies a photograph.

</div>

<!--
This slide establishes what Olsen does and introduces the through-line: read-only access as a deliberate architectural choice, not a limitation. The O_RDONLY guarantee is the project's most distinctive design decision -- it shapes every downstream choice about storage and output.

Sources:
- https://github.com/adewale/olsen/blob/main/README.md -- project overview, feature list, O_RDONLY guarantee
- https://github.com/adewale/olsen/blob/main/specs/olsen_specs.md -- 8-stage pipeline, thumbnail sizing, metadata extraction
-->

---
layout: fact
transition: fade
---

# 62ms

Combined processing time per photo on Apple M3 Max

34ms thumbnails, 28ms color extraction, 0.6ms hashing

<!--
This number comes directly from Olsen's performance specification. Thumbnail generation (Lanczos3 resampling at four sizes) accounts for 52% of pipeline time. Color extraction via k-means is 28ms. File hashing and perceptual hashing together take under 1ms -- the computationally cheap stages. At 8 workers, the system sustains 15-25 photos per second. For a 100K photo library, initial indexing takes 1.5-2 hours.

Sources:
- https://github.com/adewale/olsen/blob/main/specs/performance.spec -- pipeline timing breakdown, worker scaling, throughput expectations
-->

---
layout: section
transition: iris
---

# The Constraint That Became the Architecture

<!--
Section break. The through-line reframed: read-only was not a safety measure bolted on later. It was the first architectural decision, and every other design choice follows from it.
-->

---
transition: slide-up
---

# One SQLite File Is the Catalog

Because the indexer cannot write back to source files, every derived artifact lives in a single SQLite database:

<v-clicks>

- Thumbnails at four sizes, stored as blobs
- Five dominant colors per photo with HSL values
- Perceptual hashes for similarity search via BK-tree
- Burst groups (same camera, same lens, within 2 seconds)
- Duplicate clusters at three distance thresholds

</v-clicks>

<div v-click>

Move the file, move the collection. No sidecar files, no hidden directories, no server process. The spec states it plainly: "The SQLite database IS the catalog."

</div>

<!--
The read-only constraint forces a clean separation: source photographs are immutable inputs; the SQLite database is the sole mutable output. This is a surprising architectural consequence -- most photo tools write metadata back into image files (XMP sidecars, embedded IPTC). Olsen rejects that entirely. A 100K photo library produces a 20-25 GB database (thumbnails dominate), but the entire catalog is a single portable file.

Sources:
- https://github.com/adewale/olsen/blob/main/specs/olsen_specs.md -- "the SQLite database IS the catalog", schema with 7 tables, thumbnail storage
-->

---
layout: center
transition: fade
---

# Users can never reach zero results

Olsen's faceted navigation is a state machine, not a hierarchy. Every filter combination is validated against actual data -- values that would yield empty results are disabled before the user can select them.

<!--
This is the surprising element of the project. Most faceted search systems assume hierarchical relationships between facets and clear dependent filters when a parent changes. Olsen's spec explicitly rejects that assumption. The state machine approach means a user filtering by "blue, 2024, Fujifilm" will only see lens options that actually appear in blue Fujifilm photos from 2024. The self-exclusion rule is equally notable: when computing counts for a facet, the system excludes that facet from its own WHERE clause to avoid trapping users in their current selection.

Sources:
- https://github.com/adewale/olsen/blob/main/specs/facet_state_machine.spec -- state machine design, no hierarchical assumptions, data-driven enablement
- https://github.com/adewale/olsen/blob/main/specs/faceted_ux_research_synthesis.md -- self-exclusion rule, Nielsen Norman Group and Tunkelang research
-->

---
layout: end
transition: fade
---

# Read-Only Made Everything Simpler

One constraint. One file. One way to browse 100,000 photographs.

<!--
The closing echoes the through-line: the read-only decision was not a safety limitation but the architectural insight that unified every other choice. Because Olsen never writes to source files, all output flows into a single SQLite file. Because all state lives in one file, the catalog is portable. Because the catalog is portable, browsing is local-first. The constraint cascaded into simplicity.

Sources:
- https://github.com/adewale/olsen/blob/main/README.md -- project philosophy, read-only guarantee
-->
