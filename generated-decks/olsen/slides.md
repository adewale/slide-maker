---
theme: none
title: Olsen
selectable: true
routerMode: hash
download: true
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

A local-first CLI tool for faceted browsing of photographs

<span style="font-family: var(--deck-font-mono); font-size: 0.85rem; color: var(--deck-accent); margin-top: 1.5rem; display: inline-block;">github.com/adewale/olsen</span>

<!-- Olsen is a Go CLI that indexes DNG, JPEG, and BMP photo libraries into a single portable SQLite database. It processes files through an 8-stage pipeline entirely in memory, enforcing read-only access at the syscall level. The through-line -- constraint as the source of safety -- begins here with the architectural promise that the indexer structurally cannot write to your photo directories.

Sources:
- file:README.md -- project description, format support, read-only guarantee -->

---
transition: slide-up
---

# Photos are precious. Indexers are dangerous.

Every tool that touches your photo library is a risk. EXIF editors rewrite file headers. Catalog apps create sidecar files in your directories. Sync tools rename originals. And the worst part: you discover the corruption months later, when the backup window has closed.

<v-clicks>

- A bad EXIF writeback silently truncates a DNG file
- Sidecar files (.xmp, .pp3) fill clean directories
- You notice months later, opening a photo for print

</v-clicks>

<p v-click style="color: var(--deck-accent); font-size: 1.05rem; margin-top: 1.5rem; font-family: var(--deck-font-display);">What if the indexer <em>could not</em> write? Not "does not write" -- structurally cannot.</p>

<!-- This slide names the problem that Olsen solves. Photo libraries are irreplaceable -- originals from travel, family events, professional shoots. Every tool that indexes or catalogs photos requires some level of filesystem access, and most tools write: EXIF editors modify file headers in place, catalog apps create sidecar files, and sync tools rename or move originals. The damage is often silent and discovered only when the file is needed. Olsen's answer is architectural: read-only at the syscall level, not by policy.

Sources:
- file:README.md -- critical guarantee section, read-only enforcement
- file:docs/architecture.md -- O_RDONLY enforcement, what the indexer never does -->

---
layout: center
transition: morph-fade
---

# Olsen opens every file with `O_RDONLY`. Every one.

No writes to photo directories -- not temporary files, not EXIF writeback, not renames. Processing happens entirely in memory. The only mutable artifact is a single SQLite database that lives outside your photo library.

<!-- This is the answer to the problem named in the previous slide. Olsen enforces read-only access at the syscall level, not by convention or documentation. Every file open uses O_RDONLY. The indexer runs an 8-stage pipeline -- EXIF extraction, 4 thumbnail sizes, k-means color clustering, perceptual hashing, metadata inference -- entirely in memory. The result goes into a single portable SQLite file. Your originals are never modified, never renamed, never touched with a write operation.

Sources:
- file:README.md -- critical guarantee section, enforcement mechanisms
- file:docs/architecture.md -- O_RDONLY enforcement, processing pipeline, single SQLite output -->

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

- Year, Month, Color, Camera, Lens -- same logic
- No hardcoded clearing, no assumed hierarchies
- SQL `WHERE` + `GROUP BY` computes valid transitions
- Zero-count values visible but disabled: "2025 (0)"

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

- **Achromatic first**: saturation < 10% means gray, not red
- **Brown before orange**: hue 20-40, lightness < 50%
- **Then hue ranges**: only after saturation + lightness pass

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

- **Symptom**: missing images, upscale warnings in logs
- **First fix** (wrong): thumbnail fallback in the UI
- **Second fix** (wrong): adjusted database queries
- **Root cause**: returned first JPEG (160x120), not largest
- **Actual fix**: scan all SOI/EOI pairs, keep largest

</v-clicks>

<div style="margin-top: 1rem; font-family: var(--deck-font-mono); font-size: 0.82rem; color: var(--deck-muted);">
Debugging order: file format (exiftool) > RAW decode > processing pipeline > database > query layer > UI. Start at the top. Never at the bottom.
</div>

<!-- This war story is from LESSONS_LEARNED.md. The team spent time fixing symptoms at the UI and database layers before discovering that the byte-level JPEG extraction was returning a 160x120 thumbnail instead of the 9504x6320 embedded preview. The lesson -- always start debugging at the data source -- became a project rule. The Monochrom files had 44 embedded JPEG previews at different sizes.

Sources:
- file:docs/LESSONS_LEARNED.md -- Monochrom DNG bug timeline, debugging order rule, embedded JPEG extraction algorithm -->

---
transition: fade
---

# Your photos were never touched

100K photos indexed. Four thumbnail sizes generated. Five dominant colors extracted. Perceptual hashes computed. Faceted navigation across every metadata dimension. And through all of it -- every file opened read-only, every result written to a single SQLite database, every original exactly as you left it.

<!-- This penultimate slide resolves the tension from slide 2. The problem was that indexers are dangerous because they write to your photo directories. The resolution: Olsen processed the entire library without a single write to a source file. The catalog is portable (one SQLite file), the originals are untouched (O_RDONLY on every open), and the state machine ensures you can explore every facet without hitting dead ends.

Sources:
- file:README.md -- read-only guarantee, single SQLite catalog
- file:docs/architecture.md -- O_RDONLY enforcement, processing pipeline -->

---
layout: end
transition: fade
---

# O_RDONLY

github.com/adewale/olsen

<!-- The closing h1 resolves the opening tension directly. Slide 2 asked: what if the indexer could not write? This slide answers: it could not, and it did not. Three concrete guarantees -- untouched photos, single-file catalog, originals intact -- map to three architectural decisions: O_RDONLY file access, SQLite as the only mutable artifact, and in-memory processing with no temporary files in source directories.

Sources:
- file:README.md -- project repository, read-only guarantee
- file:docs/LESSONS_LEARNED.md -- what made the project trustworthy -->
