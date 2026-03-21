---
theme: none
title: Olsen
selectable: true
routerMode: hash
colorSchema: light
transition: fade
layout: cover
fonts:
  sans: Source Sans 3
  serif: EB Garamond
  mono: Source Code Pro
  weights: '400,500'
  italic: true
---

# Olsen

A local-first CLI tool for faceted browsing of photographs in DNG, JPEG, and BMP formats. Read-only by design. Single SQLite file as the entire catalog.

<span style="font-family: var(--deck-font-mono); font-size: 0.85rem; color: var(--deck-accent); margin-top: 1.5rem; display: inline-block;">github.com/adewale/olsen</span>

<!-- Olsen is a Go CLI that indexes photo libraries into a portable SQLite database. The cover establishes the two core constraints: read-only operation, and a single-file catalog. These are not limitations but architectural choices that eliminate entire categories of bugs. The through-line -- constraint as architecture -- begins here.

Sources:
- file:README.md -- project description, format support, read-only guarantee -->

---
transition: slide-up
---

# What Olsen does in 62 milliseconds

Per photo on an M3 Max, the indexer runs an 8-stage pipeline -- entirely in memory, entirely read-only.

<v-clicks>

- **EXIF extraction** from DNG/JPEG/BMP via `go-exif` -- camera, lens, exposure, GPS, flash
- **4 thumbnails** at 64, 256, 512, and 1024px longest edge -- aspect ratio preserved, Lanczos3 resampling
- **5 dominant colors** via k-means clustering on the 256px thumbnail -- stored as both RGB and HSL
- **Perceptual hash** (pHash) for near-duplicate detection -- 64-bit, Hamming distance threshold of 10
- **Metadata inference** -- time of day, season, focal length category, shooting conditions

</v-clicks>

<div style="margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--deck-border);">
  <span style="font-family: var(--deck-font-mono); font-size: 0.8rem; color: var(--deck-muted);">15--25 photos/second with 8 workers. 100K photos in under 2 hours. ~250KB per photo in the database.</span>
</div>

<!-- The performance numbers are real benchmarks from Apple M3 Max hardware. The key insight is that color extraction runs on the 256px thumbnail, not the 40MP original -- 100x faster with no perceptible accuracy loss. Working from the smallest sufficient image is a recurring pattern.

Sources:
- file:README.md -- performance benchmarks
- file:docs/architecture.md -- processing pipeline stages, time complexity table -->

---
layout: center
transition: morph-fade
---

# Read-only is not a limitation. It is the architecture.

Every file open uses `O_RDONLY`. No writes to photo directories -- not temporary files, not EXIF writeback, not renames. Processing happens entirely in memory. The only mutable artifact is the SQLite database.

<!-- This is the through-line crystallized: the read-only constraint is not a missing feature. It is the foundation. By eliminating all write paths to source files, Olsen makes it structurally impossible to corrupt a photo library. The guarantee is enforced at the syscall level, not by convention. Code reviews verify no new write operations are introduced.

Sources:
- file:README.md -- critical guarantee section, enforcement mechanisms
- file:docs/architecture.md -- O_RDONLY enforcement, what the indexer never does -->

---
layout: section
transition: iris
---

# The state machine insight

Faceted navigation is not a taxonomy. It is a graph of valid transitions through actual data.

<!-- This section divider marks the shift from indexing (how data enters the system) to exploration (how users navigate it). The state machine model was discovered during development, not designed upfront -- it emerged from a bug in the hierarchical clearing logic.

Sources:
- file:specs/facet_state_machine.spec -- core insight statement
- file:docs/HIERARCHICAL_FACETS.md -- discovery narrative -->

---
layout: two-cols-header
transition: wipe-right
---

# Hierarchical vs. state machine

::left::

<v-clicks>

- Changing Year **clears** Month and Day
- System **assumes** containment relationships
- Filters **disappear** unexpectedly
- Users **lose context** during exploration
- Adding a new facet type requires **new special cases**

</v-clicks>

::right::

<v-clicks>

- Changing Year **preserves** all other filters
- SQL **computes** which combinations have results
- Zero-count values shown but **disabled**
- Users see exactly why an option is unavailable
- One rule governs **every** facet: preserve, compute, disable

</v-clicks>

<!-- The left column describes Olsen's first implementation, which was wrong. Changing Year to 2025 would clear Month=11, even if November 2025 had photos. The right column describes the fix: a state machine where SQL GROUP BY queries naturally determine valid transitions. The migration required changes across four layers -- URL builder, facet computation, WHERE clauses, and template rendering. The WHERE clause layer was the easiest to miss.

Sources:
- file:specs/facet_state_machine.spec -- hierarchical vs state machine comparison, implementation strategy
- file:docs/HIERARCHICAL_FACETS.md -- what changed in each layer, migration checklist
- file:docs/LESSONS_LEARNED.md -- architectural lesson, the bug that revealed the truth -->

---
transition: slide-left
---

# One rule for every facet

The fundamental guarantee: **users cannot transition from a state with results to a state with zero results.**

<v-clicks>

- Year, Month, Day, Color, Camera, Lens, Season, Time of Day -- all governed by the same logic
- No hardcoded clearing rules. No assumed hierarchies between facet types
- Facet counts are computed by SQL `WHERE` clauses with `GROUP BY` -- the database already knows which transitions are valid
- Zero-count facet values are visible but not clickable -- the user sees "2025 (0)" and understands *why*

</v-clicks>

<div style="margin-top: 1.5rem; font-style: italic; color: var(--deck-muted); font-family: var(--deck-font-display); font-size: 1.05rem;">
The constraint -- "never reach zero results" -- is what makes the system feel predictable rather than surprising.
</div>

<!-- This slide carries the through-line forward: the state machine's power comes from what it forbids. By constraining transitions to states with results > 0, the system eliminates an entire class of confusing UX failures. The implementation is simpler than the hierarchical model it replaced -- fewer special cases, fewer lines of code.

Sources:
- file:specs/facet_state_machine.spec -- fundamental rule, implementation with SQL
- file:docs/LESSONS_LEARNED.md -- "one rule for ALL facets" insight -->

---
transition: slide-up
---

# 11 colors, saturation first

Olsen classifies dominant colors into the 11 Berlin-Kay universal basic categories. The ordering of the classification logic matters more than the categories themselves.

<v-clicks>

- **Achromatic first**: if saturation < 10%, the pixel is black, white, gray, or B&W -- regardless of hue
- **Brown before orange**: hue 20--40 with lightness < 50% is brown, not orange
- **Then hue ranges**: red, orange, yellow, green, blue, purple, pink -- only after saturation and lightness checks pass

</v-clicks>

<v-click>

<div style="margin-top: 1rem; padding: 1rem; border-left: 3px solid var(--deck-accent-alt); background: rgba(192, 57, 43, 0.04);">
<strong style="color: var(--deck-accent-alt);">The bug that proved it:</strong> v1.0 classified B&W Leica Monochrom photos as "red" because hue 0 maps to red. Every grayscale pixel has an arbitrary hue. Checking saturation <em>first</em> was the fix -- a constraint on evaluation order that eliminated the entire misclassification.
</div>

</v-click>

<!-- Berlin-Kay basic color terms are a cross-linguistic finding: every human language with color words eventually develops the same 11 categories. Olsen uses this as the facet vocabulary. The saturation-first rule is another instance of the through-line -- a constraint on the order of operations that prevents a class of errors.

Sources:
- file:specs/dominant_colours.spec -- Berlin-Kay categories, saturation-first logic, v1 vs v2 comparison
- file:docs/LESSONS_LEARNED.md -- color classification evolution, the Monochrom misclassification -->

---
transition: slide-left
---

# Debug at the source, not the display

The Leica Monochrom DNG bug took days to fix because debugging started at the wrong layer.

<v-clicks>

- **Symptom**: missing images in the web explorer, upscale warnings in logs
- **First fix** (wrong): added thumbnail fallback in the web UI -- masked the problem
- **Second fix** (wrong): adjusted database queries -- different wrong layer
- **Root cause**: `ExtractEmbeddedJPEG()` returned the *first* JPEG marker (160x120 thumbnail), not the *largest* (9504x6320 full preview)
- **Actual fix**: scan all SOI/EOI marker pairs in the DNG, keep the largest valid JPEG

</v-clicks>

<div style="margin-top: 1rem; font-family: var(--deck-font-mono); font-size: 0.82rem; color: var(--deck-muted);">
Debugging order: file format (exiftool) > RAW decode > processing pipeline > database > query layer > UI. Start at the top. Never at the bottom.
</div>

<!-- This war story is from LESSONS_LEARNED.md. The team spent time fixing symptoms at the UI and database layers before discovering that the byte-level JPEG extraction was returning a 160x120 thumbnail instead of the 9504x6320 embedded preview. The lesson -- always start debugging at the data source -- became a project rule. The Monochrom files had 44 embedded JPEG previews at different sizes.

Sources:
- file:docs/LESSONS_LEARNED.md -- Monochrom DNG bug timeline, debugging order rule, embedded JPEG extraction algorithm -->

---
layout: end
transition: fade
---

# Constraints compound into trust

github.com/adewale/olsen

<!-- The closing resolves the through-line. Read-only file access means the indexer cannot corrupt photos. The state machine constraint means users cannot reach dead-end filter states. Saturation-first evaluation means B&W photos cannot be misclassified. Each constraint is small. Together, they produce a system that earns trust by eliminating failure modes.

Sources:
- file:README.md -- project repository URL
- file:docs/LESSONS_LEARNED.md -- what made the project successful -->
