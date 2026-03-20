---
theme: seriph
title: Olsen
colorSchema: light
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

A local-first CLI tool for faceted browsing of photographs in DNG (and other file formats)

<!--
Olsen is a Go project built for photographers who want to understand their own collections without surrendering them to cloud services. The name evokes methodical, scholarly exploration of visual archives.

Sources:
- https://github.com/adewale/olsen — repo description
-->

---
transition: slide-left
---

# What Olsen is and why it exists

A high-performance photo indexing system for DNG (Digital Negative), JPEG, and BMP files that extracts comprehensive metadata, generates aspect-ratio-preserving thumbnails, analyzes color palettes, and computes perceptual hashes for similarity detection.

<v-clicks>

- The critical guarantee: Olsen **never modifies your photo files**
- All file access uses `O_RDONLY` — read-only mode at the OS level
- Image processing happens entirely in memory
- Only the SQLite database is written to

</v-clicks>

<!--
Start with the project's own description verbatim, then immediately establish the design constraint that shapes every architectural decision. The read-only guarantee is not a feature — it is the foundational rule. Everything else follows from it. This is the first appearance of the through-line: read-only to sources, read-write to understanding.

Sources:
- https://github.com/adewale/olsen/blob/main/README.md — first-paragraph description and read-only guarantee section
-->

---
layout: fact
transition: slide-up
---

# ~62 ms per photo
On Apple M3 Max with 8 workers

<div class="fact-breakdown">

File hash 0.4 ms. Thumbnails 34 ms. Color palette 28 ms. Perceptual hash 0.2 ms.

**15-25 photos/second.** 100K photos indexed in under 2 hours.

</div>

<!--
These benchmarks come from the project README. The total is dominated by thumbnail generation and color extraction — both pixel-level operations. The file hash and perceptual hash are near-instant because they operate on fixed-size inputs (SHA-256 on bytes, pHash on a 32x32 grid). Memory usage stays constant at ~500 MB regardless of library size.

Sources:
- https://github.com/adewale/olsen/blob/main/README.md — performance benchmarks table and scale estimates
-->

<style scoped>
.fact-breakdown {
  margin-top: 1.5rem;
  font-family: var(--deck-font-body, sans-serif);
  font-size: 0.95rem;
  color: var(--deck-muted);
  max-width: 32rem;
}
</style>

---
layout: two-cols-header
transition: slide-left
---

# The processing pipeline

::left::

<v-clicks>

- **Extract** EXIF metadata — 50+ fields per photo
- **Decode** image into memory
- **Generate** 4 thumbnail sizes (64 to 1024 px)
- **Analyze** dominant colors via k-means clustering
- **Hash** with pHash for near-duplicate detection

</v-clicks>

::right::

Everything extracted lives in a single SQLite file.

- ~190 KB stored per photo
- 100K photos fit in ~20 GB
- Portable: one file to back up, migrate, query
- Original files are never touched

<!--
The pipeline is the through-line in action: five extraction stages, zero writes back to the source. Each stage reads from memory buffers, never from the file again after initial load. The SQLite database becomes a parallel catalog — a complete representation of the collection that can be queried, filtered, and browsed without opening a single photo file. Worker pool pattern with configurable concurrency (default 4 workers, buffered channel of 100) keeps throughput high while staying memory-bounded.

Sources:
- https://github.com/adewale/olsen/blob/main/docs/architecture.md — processing pipeline diagram, storage estimates, worker pool architecture
- https://github.com/adewale/olsen/blob/main/README.md — database schema and key design decisions
-->

---
layout: center
transition: fade
---

# Faceted navigation is a state machine

Users can never transition from a state with results to a state with zero results.

<div class="sidenote">

SQL queries compute which facet values have results given current filters. Facet values with count=0 are shown but disabled. No hardcoded hierarchies — data determines valid paths.

</div>

<!--
This was the key architectural insight from the project's own lessons learned. The initial implementation assumed hierarchical relationships: Year contains Month, Camera contains Lens. That assumption broke when filters were combined — "Year 2024, Camera Leica" has different valid months than "Year 2024" alone. The state machine model treats every filter dimension as independent. ALL filters are preserved during transitions. The SQL WHERE clause builds dynamically. The result: users explore freely, and every click leads somewhere real.

Sources:
- https://github.com/adewale/olsen/blob/main/README.md — state machine model section
- https://github.com/adewale/olsen/blob/main/docs/LESSONS_LEARNED.md — "Assumed Hierarchical Relationships" mistake and state machine discovery
-->

<style scoped>
.sidenote {
  margin-top: 1.5rem;
  max-width: 36rem;
  font-family: var(--deck-font-body, sans-serif);
  font-size: 0.85rem;
  color: var(--deck-muted);
  line-height: 1.6;
}
</style>

---
transition: slide-up
---

# The Monochrom thumbnail bug

`ExtractEmbeddedJPEG()` returned the **first** JPEG in the DNG file — 160x120 pixels — not the **largest** at 9504x6320.

<v-clicks>

- First fix: patched the web UI with a thumbnail fallback (symptom, not cause)
- Regression: removing `isBlackImage()` produced completely black thumbnails
- Root cause: found only when someone ran `exiftool` on the actual DNG file
- The lesson: **always debug at the source layer, not the display layer**

</v-clicks>

<!--
This war story comes directly from the project's LESSONS_LEARNED.md. The team spent time fixing symptoms in the UI layer before inspecting what the RAW decode layer was actually producing. The PreviewImageLength field in exiftool output showed 2.1 MB — the answer was there the whole time. The fix was to modify embedded JPEG extraction to find the largest preview, not the first one. Time to initial working system was about 2 weeks. Three major bugs found, two regressions introduced. Test coverage at end: ~70% with ~2500 lines of test code.

Sources:
- https://github.com/adewale/olsen/blob/main/docs/LESSONS_LEARNED.md — Monochrom DNG thumbnail bug timeline, debugging methodology, key metrics
-->

---
layout: end
transition: fade
---

# Your photos stay untouched. Your catalog grows richer.

Read-only to your photos. Read-write to your understanding of them.

<!--
The through-line resolves here. The read-only guarantee is not a limitation — it is what makes Olsen trustworthy on large, irreplaceable photo libraries. The project is early (v0.1.0, October 2025) and warns against use on valuable data, but the architectural foundation is sound: worker pool concurrency, portable SQLite catalog, state machine navigation, and a strict separation between source files and derived data.

Sources:
- https://github.com/adewale/olsen/blob/main/README.md — project status warning, read-only guarantee, installation instructions
-->
