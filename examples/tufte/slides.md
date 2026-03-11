---
theme: seriph
title: Debug at the Source
selectable: true
colorSchema: light
transition: fade
layout: cover
fonts:
  sans: Source Sans 3
  serif: EB Garamond
  mono: Source Code Pro
---

# Debug at the Source

A thumbnail bug, a wrong turn, and the 60x speedup hiding in plain sight.

github.com/adewale/olsen

<!-- This is a debugging detective story from the Olsen photo indexer. We start with a mystery — broken thumbnails — follow a false trail that wastes days, then find the real culprit hiding in plain sight. The punchline: the fix was simpler, faster, and better than the original approach. The through-line is "start at the source" — a debugging rule we violated, paid for, and learned.

Sources:
- https://github.com/adewale/olsen — the Olsen project where this bug occurred
- https://github.com/adewale/olsen/blob/main/docs/architecture.md — 4-layer architecture where the bug lived
- https://github.com/adewale/olsen/blob/main/specs/olsen_specs.md — thumbnail pipeline specification -->

---
layout: TufteSlide
transition: slide-left
---

# The mystery

A tiny thumbnail where a full-resolution preview should have been. DNG files were generating only the smallest thumbnail size instead of the full set. The web app showed broken images. The logs whispered "upscale warning."

The file contained **multiple embedded JPEG previews** at different sizes — including a full-resolution one. The code grabbed the first one it found: the smallest.

::sidenote::

<Sidenote number="1">DNG (Digital Negative) files contain multiple embedded JPEG previews at various sizes. The largest is typically full or near-full resolution, intended for fast display without RAW decoding.</Sidenote>

<Sidenote number="2">The quality pipeline detects upscaling: if the source image is too small, it refuses to generate larger thumbnails. This is correct behavior — upscaling produces blurry results.</Sidenote>

<!-- The key revelation: DNG files contain multiple embedded JPEG previews, including a full-resolution one. Our code grabbed the first one it found — a tiny thumbnail. The quality pipeline then correctly refused to upscale, so larger thumbnail sizes were never generated. The clue was in the "upscale warning" log line. The Olsen architecture processes photos through four layers: Scanner, Processor, Indexer, and Server. This bug lived in the Processor layer's thumbnail extraction.

Sources:
- https://github.com/adewale/olsen/blob/main/docs/architecture.md — 4-layer architecture (Scanner, Processor, Indexer, Server) where the thumbnail bug lived in the Processor layer
- https://github.com/adewale/olsen/blob/main/specs/olsen_specs.md — thumbnail pipeline specification defining the 4 output sizes -->

---
layout: TufteSlide
transition: slide-left
---

# The false trail

We debugged in the wrong order. We started at the display layer and worked backwards. Multiple fixes, multiple failures.

<v-clicks>

1. <v-mark v-click="4" type="strike" color="#c0392b">Fixed the web UI fallback mechanism</v-mark>
2. <v-mark v-click="4" type="strike" color="#c0392b">Fixed the database queries</v-mark>
3. <v-mark v-click="4" type="strike" color="#c0392b">Assumed "8 thumbnails generated" meant success</v-mark>

</v-clicks>

<v-click at="5">

Then the thumbnails turned completely black. We had removed `isBlackImage()` detection, trusting the pipeline. The pipeline was feeding on a 160x120 thumbnail.

</v-click>

::sidenote::

<Sidenote number="3">The instinct to fix what you can see first is strong. The UI was broken, so we fixed the UI. But the data was wrong at the source. Three days of work at the wrong layer.</Sidenote>

<!-- We debugged backwards — starting at the Server layer (UI) and working toward the Processor layer (extraction). Multiple attempted fixes, multiple failures. We fixed the web UI fallback, fixed database queries, assumed thumbnail count meant success. The Olsen architecture has four layers: Scanner discovers files, Processor extracts thumbnails, Indexer stores metadata, Server displays results. The bug was in the Processor, but we started debugging at the Server.

Sources:
- https://github.com/adewale/olsen/blob/main/docs/architecture.md — 4-layer architecture showing the Processor layer where the actual bug lived
- https://github.com/adewale/olsen/blob/main/specs/olsen_specs.md — thumbnail generation specification defining expected output sizes -->

---
transition: slide-up
---

# The evidence

The `ExtractEmbeddedJPEG()` function used a naive first-match algorithm:

````md magic-move
```go
// BEFORE: returns first JPEG found (160x120)
for i := 0; i < len(data)-1; i++ {
    if data[i] == 0xFF && data[i+1] == 0xD8 {
        return jpeg.Decode(
            bytes.NewReader(jpegData),
        ), nil
    }
}
```

```go
// AFTER: tracks and returns largest JPEG (9504x6320)
var largestJPEG []byte; var largestSize int
for i := 0; i < len(data)-1; i++ {
    if data[i] == 0xFF && data[i+1] == 0xD8 {
        if jpegSize > largestSize { largestJPEG, largestSize = jpegData, jpegSize }
    }
}
return jpeg.Decode(bytes.NewReader(largestJPEG)), nil
```
````

<v-mark v-click type="highlight" color="rgba(45, 95, 138, 0.15)">The critical line: `if jpegSize > largestSize`</v-mark>

<!-- The Magic Move transition is the climax. The code transforms from a naive first-match algorithm to a largest-match algorithm. One conditional — `if jpegSize > largestSize` — is the entire fix. The old approach found the first JPEG marker (0xFF 0xD8) and returned it immediately. The fix scans all embedded JPEGs and returns the biggest one.

Sources:
- https://github.com/adewale/olsen/blob/main/docs/architecture.md — Processor layer where ExtractEmbeddedJPEG lives
- https://github.com/adewale/olsen/blob/main/specs/olsen_specs.md — thumbnail quality requirements that drove the largest-match fix -->

---
layout: TufteSlide
transition: fade
---

# The data

<div v-motion :initial="{ opacity: 0, x: -40 }" :enter="{ opacity: 1, x: 0, transition: { delay: 200, duration: 600 } }">
<SmallMultiples :cols="3">
<div>
  <Sparkline :data="[100, 105, 98, 102, 99]" :width="90" :height="20" color="#c0392b" />
  <div><strong>Slow</strong></div>
  <div style="color: var(--deck-muted); font-size: 0.78rem;">LibRaw decode</div>
</div>
<div>
  <Sparkline :data="[50, 45, 55, 48, 52]" :width="90" :height="20" color="#2d5f8a" />
  <div><strong>Medium</strong></div>
  <div style="color: var(--deck-muted); font-size: 0.78rem;">Black detection</div>
</div>
<div>
  <Sparkline :data="[5, 4, 6, 5, 5]" :width="90" :height="20" color="#2d5f8a" />
  <div><strong>Fast</strong></div>
  <div style="color: var(--deck-muted); font-size: 0.78rem;">Embedded JPEG</div>
</div>
</SmallMultiples>
</div>

<div style="margin-top: 2rem;">

The embedded JPEG extraction is **dramatically faster** than full RAW decoding. Equal or better quality for thumbnail generation. No LibRaw dependency. No CGO. No JPEG-compressed monochrome edge cases.

</div>

::sidenote::

<Sidenote number="4">Direct embedded JPEG extraction avoids the expensive RAW decode pipeline entirely. The Olsen Processor layer handles ~62ms per photo using the embedded JPEG approach. For large photo libraries, the time savings compound significantly.</Sidenote>

<style>
.small-multiples > div {
  transition: opacity 0.3s ease, filter 0.3s ease;
  cursor: pointer;
}
.small-multiples:hover > div:not(:hover) {
  opacity: 0.3;
  filter: blur(1px);
}
</style>

<!-- The performance data tells the story. Embedded JPEG extraction bypasses the entire RAW decode pipeline. The Olsen architecture documents ~62ms per photo processing time and 15-25 photos per second throughput using the embedded JPEG approach. LibRaw full decode was an order of magnitude slower with CGO compilation complexity.

Sources:
- https://github.com/adewale/olsen/blob/main/docs/architecture.md — performance metrics: ~62ms per photo, 15-25 photos/sec with worker pool
- https://github.com/adewale/olsen/blob/main/specs/olsen_specs.md — thumbnail pipeline specification with 4 output sizes -->

---
layout: TufteSlide
transition: fade
---

# The rule

When data is wrong, always start debugging at the **source**, never at the display layer.

<div style="margin-top: 1.5rem; font-size: 0.95rem;">

1. File format inspection (`exiftool`, `hexdump`)
2. Decode layer (libraries, output quality)
3. Processing pipeline (thumbnails, color)
4. Database storage (queries, schema)
5. Repository layer (query building)
6. Web UI (display, templates)

</div>

Start at number one. Work your way down. Never start at six and work backwards — that's what cost us.

::sidenote::

<Sidenote number="5">A single exiftool command would have revealed the answer immediately: `exiftool -a -G1 -s file.DNG | grep -i preview` shows all embedded preview sizes. Seconds of investigation vs days of wrong-layer debugging.</Sidenote>

<Sidenote number="6">"8 thumbnails generated" does not mean "8 good quality thumbnails." Verify outputs by looking at them. Do not trust counts.</Sidenote>

<!-- The rule maps directly to the Olsen 4-layer architecture: Scanner (file inspection) → Processor (decode/extraction) → Indexer (storage) → Server (display). We debugged from Server backwards when we should have started at the Scanner/Processor boundary. The numbered list is an ordered protocol — always start at 1.

Sources:
- https://github.com/adewale/olsen/blob/main/docs/architecture.md — 4-layer architecture (Scanner, Processor, Indexer, Server) that maps to the debugging protocol
- https://github.com/adewale/olsen/blob/main/specs/olsen_specs.md — quality validation requirements -->

---
layout: TufteSlide
transition: fade
---

# Five lessons

**State machines over hierarchies.** Faceted navigation is about valid state transitions, not hierarchical relationships. When we assumed "Year contains Month," we built a system that broke on the first edge case. The data determines valid transitions.

**Simple over complex.** We spent significant time implementing full LibRaw RAW decode integration when embedded preview extraction would have been dramatically faster, equal quality, and zero dependencies.

**Test at the right layer.** We added tests at the web UI layer when the bug lived in the RAW decode layer. Test the extraction mechanism directly; do not test the database query that displays its output.

::sidenote::

<Sidenote number="7">Visual inspection over metrics. "Generated 8 thumbnails" told us nothing. Opening the file and looking at it would have caught the bug immediately. Always verify outputs with your eyes, not your test suite.</Sidenote>

<Sidenote number="8">Diagnostic logging proactively. After adding [EMBED] and [RAW] log prefixes, every future bug became immediately visible in the output stream. The 30-second investment in log formatting saved hours of future debugging.</Sidenote>

<!-- Five transferable principles from the Olsen project: (1) State machines over hierarchies — the facet_state_machine.spec defines navigation as valid transitions, not tree relationships. (2) Simple over complex — embedded JPEG beats LibRaw. (3) Test at the right layer — Processor tests, not Server tests. (4) Visual inspection over metrics. (5) Diagnostic logging proactively.

Sources:
- https://github.com/adewale/olsen/blob/main/specs/facet_state_machine.spec — faceted navigation as state machine, not hierarchy
- https://github.com/adewale/olsen/blob/main/docs/architecture.md — layer-specific testing principle derived from the 4-layer architecture -->

---
layout: section
transition: slide-left
---

# Start at the source

<!-- The section header repeats the through-line one final time. The audience has seen the cost of not starting at the source (days wasted, black thumbnails), the evidence of the fix (one conditional), and the general principle (six-layer debugging protocol). -->

---
layout: center
transition: fade
---

# Sometimes the simple solution is 100x better than the complex solution

It is dramatically faster. Equal or better quality. Avoids compatibility issues. Reduces complexity. The bug was never in the code — it was in the assumption that first-match was good enough.

<!-- The penultimate slide reframes the story. The "60x speedup hiding in plain sight" from the cover was an accident — we were fixing a correctness bug, not optimizing. The simple solution (scan for the largest JPEG) was not just faster but better in every dimension.

Sources:
- https://github.com/adewale/olsen/blob/main/docs/architecture.md — performance comparison showing embedded JPEG extraction dramatically outperforming RAW decode -->

---
layout: end
transition: fade
---

# The bug was never in the code. It was in the assumption.

<!-- The closing resolves the opening subtitle: "A thumbnail bug, a wrong turn, and the 60x speedup hiding in plain sight." The assumption was that first-match extraction would find the right JPEG. It didn't. The code was correct — it faithfully returned the first match. The assumption was wrong.

Sources:
- https://github.com/adewale/olsen/blob/main/docs/architecture.md — Processor layer architecture where the assumption lived -->
