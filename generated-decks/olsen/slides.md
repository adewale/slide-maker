---
theme: seriph
title: Olsen
colorSchema: light
fonts:
  sans: Source Sans 3
  serif: EB Garamond
  mono: Source Code Pro
  weights: '400,500'
  italic: true
transition: fade
layout: cover
---

# Olsen

A read-only photo indexer that treats your library as sacred ground

<!--
Olsen is a Go CLI tool for indexing DNG, JPEG, and BMP photos into a portable SQLite database. The read-only constraint is not a feature flag -- it is enforced at the syscall level with O_RDONLY. Every file access uses os.Open(), which cannot write. This deck traces why that one decision shaped everything else in the architecture.

Sources:
- https://github.com/adewale/olsen/blob/main/README.md -- project overview and read-only guarantee
-->

---
layout: section
transition: fade
---

# The read-only guarantee

`O_RDONLY` is not a policy. It is a syscall.

<!--
The indexer uses os.Open() exclusively, which opens files with the O_RDONLY flag. There are no calls to os.Create, os.OpenFile, os.WriteFile, os.Remove, or os.Rename anywhere in the indexer codebase. All image processing -- EXIF parsing, thumbnail generation, color extraction, perceptual hashing -- happens entirely in memory. The only thing Olsen writes to is the SQLite database.

Sources:
- https://github.com/adewale/olsen/blob/main/docs/architecture.md -- read-only enforcement mechanisms
- https://github.com/adewale/olsen/blob/main/README.md -- critical guarantee section
-->

---
layout: two-cols-header
transition: slide-left
---

# 62ms per photo

::left::

<v-clicks>

- File hash calculation: **0.4ms**
- Thumbnail generation (4 sizes): **34ms**
- Color palette via k-means: **28ms**
- Perceptual hash (pHash): **0.2ms**

</v-clicks>

::right::

<v-clicks>

- 15--25 photos/second with 8 workers
- 100K photos indexed in 1.5--2 hours
- Database size: 20--25 GB with thumbnails
- Memory usage: 500 MB constant

</v-clicks>

<!--
Benchmarked on Apple M3 Max. Thumbnail generation dominates at 34ms because it produces four sizes (64, 256, 512, 1024px longest edge) with Lanczos3 resampling. Color extraction uses k-means clustering on the 256px thumbnail for efficiency -- not the full-resolution image. The perceptual hash at 0.2ms enables near-duplicate detection across the entire library. All four sizes preserve aspect ratio by constraining the longest edge, never forcing square crops.

Sources:
- https://github.com/adewale/olsen/blob/main/README.md -- performance benchmarks table
- https://github.com/adewale/olsen/blob/main/CHANGELOG.md -- v0.1.0 performance details
-->

---
layout: center
transition: fade
---

# Five processing stages. Zero writes to source files.

EXIF extraction, thumbnail generation, color palette analysis, perceptual hashing, metadata inference -- all in memory, all flowing into a single portable SQLite file.

<!--
The five stages run concurrently across a worker pool. Each worker receives a file path from a buffered channel, processes it through all five stages in memory, then writes the results to SQLite in a single transaction. The worker pool pattern means adding more workers scales linearly until disk I/O becomes the bottleneck. The SQLite database uses WAL mode for concurrent read access, so the web explorer can query while indexing continues.

Sources:
- https://github.com/adewale/olsen/blob/main/docs/architecture.md -- indexer engine components
- https://github.com/adewale/olsen/blob/main/docs/flow.md -- complete processing pipeline
-->

---
transition: slide-up
---

# The state machine insight

Faceted navigation is not a hierarchy. Year does not "contain" Month. Every filter combination is a state, and the only valid transitions are ones that produce results.

<v-clicks>

- First assumption: Year contains Month contains Day
- Changing year cleared the month filter silently
- The fix: every filter combo is an independent state
- Zero-result values are shown disabled, never hidden

</v-clicks>

<!--
This was a significant architectural discovery. The initial implementation built faceted navigation on assumed hierarchical relationships between facets -- "Year contains Month, so changing Year should clear Month." This broke the user's mental model. If a user was viewing November 2024 photos and clicked Year 2023, the system cleared the month filter instead of showing November 2023 photos. The state machine model preserves all filters during transitions and lets SQL determine which combinations are valid. The fundamental rule: users should never transition from a state with results to a state with zero results.

Sources:
- https://github.com/adewale/olsen/blob/main/specs/facet_state_machine.spec -- core insight and state transition rules
- https://github.com/adewale/olsen/blob/main/docs/LESSONS_LEARNED.md -- hierarchical assumption mistake
-->

---
transition: slide-left
---

# 160 x 120 px

A thumbnail that should have been 9504 x 6320.

<v-click>

`ExtractEmbeddedJPEG()` returned the **first** JPEG preview it found inside Leica Monochrom DNG files -- a 160x120 navigation thumbnail -- not the largest at 9504x6320. The web UI showed black rectangles. The team fixed display fallbacks, database queries, and upscale warnings before anyone thought to inspect the RAW decode layer.

</v-click>

<v-click>

The rule that emerged: **when data is wrong, debug at the source, not the display.**

</v-click>

<!--
This war story comes directly from the Lessons Learned document. The timeline: (1) missing images in web app, upscale warnings in logs. (2) First fix: thumbnail fallback in web UI -- wrong layer. (3) Regression: removed isBlackImage() check, got completely black thumbnails. (4) Root cause: embedded JPEG extraction found the first JPEG marker, not the largest preview. The DNG file contained 44 preview images ranging from 160x120 to 9504x6320. Running exiftool -a -G1 -s on the file would have shown the answer immediately. The debugging order should have been: file format inspection, RAW decode layer, processing pipeline, database, then UI.

Sources:
- https://github.com/adewale/olsen/blob/main/docs/LESSONS_LEARNED.md -- Monochrom DNG thumbnail bug timeline
- https://github.com/adewale/olsen/blob/main/docs/LESSONS_LEARNED.md -- "Always Debug at the Source" rule
-->

---
layout: end
transition: fade
---

# Read-only to sources. Read-write to understanding.

github.com/adewale/olsen

<!--
The read-only constraint was not a limitation. It was the decision that made everything else possible: portable single-file databases, safe re-indexing with hash-based resume, concurrent workers without file locks, and the confidence to point the tool at irreplaceable photo libraries. The constraint freed the architecture. Olsen never modifies your photos. It builds a rich, queryable understanding of them -- metadata, thumbnails, dominant colors, perceptual hashes, burst groups -- all in a single SQLite file you can copy, back up, or query directly.

Sources:
- https://github.com/adewale/olsen/blob/main/README.md -- read-only guarantee and feature overview
-->
