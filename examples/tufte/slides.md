---
theme: seriph
title: Debug at the Source
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

<!-- This is a debugging detective story. We start with a mystery — broken thumbnails — follow a false trail that wastes days, then find the real culprit hiding in plain sight. The punchline: the fix was simpler, faster, and better than the original approach. The through-line is "start at the source" — a debugging rule we violated, paid for, and learned. Set the tone as investigative, not instructional. -->

---
layout: TufteSlide
transition: slide-left
---

# The mystery

160x120 pixels. A thumbnail that should have been 9504x6320. The Leica M11 Monochrom DNG files were generating only 64px thumbnails instead of the full set of four sizes: 64, 256, 512, and 1024. The web app showed broken images. The logs whispered "upscale warning."

The file contained **44 embedded JPEG previews** at different sizes. A 2.1MB full-resolution preview was sitting right there, untouched.

::sidenote::

<Sidenote number="1">DNG (Digital Negative) files contain multiple embedded JPEG previews at various sizes. The largest is typically full or near-full resolution, intended for fast display without RAW decoding.</Sidenote>

<Sidenote number="2">The quality pipeline detects upscaling: if the source image is only 160x120, it refuses to generate 256, 512, and 1024px thumbnails. This is the correct behavior — upscaling produces blurry results.</Sidenote>

<!-- The key revelation: the DNG file contained 44 embedded JPEG previews, including a 2.1MB full-resolution one at 9504x6320. But our code grabbed the first one it found — a tiny 160x120 thumbnail. The quality pipeline then correctly refused to upscale from 160x120, so larger thumbnail sizes were never generated. The clue was in the "upscale warning" log line — we ignored it for three days. -->

---
layout: TufteSlide
transition: slide-left
---

# The false trail

We debugged in the wrong order. We started at the display layer and worked backwards. Three fixes, three failures.

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

<!-- We debugged backwards — starting at the display layer and working toward the source. Three attempted fixes, three failures. We fixed the web UI fallback, fixed database queries, assumed "8 thumbnails generated" meant success. Then the thumbnails turned completely black because we removed black-image detection trusting the pipeline. The pattern: debugging in the wrong order doesn't just waste time — it can make things worse. If we'd started at the source (exiftool on the DNG file), we'd have found the answer in 30 seconds. -->

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

<!-- The Magic Move transition is the climax. The code transforms from a naive first-match algorithm (returns the first JPEG marker, which is the tiny 160x120 thumbnail) to a largest-match algorithm (scans all embedded JPEGs and returns the biggest one, 9504x6320). One conditional — `if jpegSize > largestSize` — is the entire fix. Let the code transition speak for itself. The audience should feel the simplicity of the fix after the complexity of the false trail. -->

---
layout: TufteSlide
transition: fade
---

# The data

<div v-motion :initial="{ opacity: 0, x: -40 }" :enter="{ opacity: 1, x: 0, transition: { delay: 200, duration: 600 } }">
<SmallMultiples :cols="3">
<div>
  <Sparkline :data="[1200, 1250, 1180, 1220, 1190]" :width="90" :height="20" color="#c0392b" />
  <div><strong>1200ms</strong></div>
  <div style="color: var(--deck-muted); font-size: 0.78rem;">LibRaw decode</div>
</div>
<div>
  <Sparkline :data="[50, 45, 55, 48, 52]" :width="90" :height="20" color="#2d5f8a" />
  <div><strong>50ms</strong></div>
  <div style="color: var(--deck-muted); font-size: 0.78rem;">Black detection</div>
</div>
<div>
  <Sparkline :data="[20, 18, 22, 19, 21]" :width="90" :height="20" color="#2d5f8a" />
  <div><strong>20ms</strong></div>
  <div style="color: var(--deck-muted); font-size: 0.78rem;">Embedded JPEG</div>
</div>
</SmallMultiples>
</div>

<div style="margin-top: 2rem;">

The embedded JPEG extraction is **60x faster** than full RAW decoding. Equal or better quality for thumbnail generation. No LibRaw dependency. No CGO. No JPEG-compressed monochrome edge cases.

</div>

::sidenote::

<Sidenote number="4">The full pipeline with fallback costs 1600ms per file. Direct embedded JPEG extraction costs 20ms. For 100K photos, that is 44 hours vs 33 minutes. The performance gain was an accident — we were fixing a correctness bug, not optimizing.</Sidenote>

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

Start at number one. Work your way down. Never start at six and work backwards — that cost us three days.

::sidenote::

<Sidenote number="5">A single exiftool command would have revealed the answer immediately: `exiftool -a -G1 -s file.DNG | grep -i preview` shows PreviewImageLength: 2,170,368 bytes. Thirty seconds vs three days.</Sidenote>

<Sidenote number="6">"8 thumbnails generated" does not mean "8 good quality thumbnails." Verify outputs by looking at them. Do not trust counts.</Sidenote>

<!-- The rule is the through-line crystallized. "Start at the source" is a debugging principle we violated (started at the display layer), paid for (three days of wasted work), and learned. The numbered list is an ordered protocol — not "choose the most convenient layer" but "always start at 1, always work down." The sidenotes add the specific evidence: exiftool in 30 seconds vs three days of wrong-layer debugging. -->

---
layout: TufteSlide
transition: fade
---

# Five lessons

**State machines over hierarchies.** Faceted navigation is about valid state transitions, not hierarchical relationships. When we assumed "Year contains Month," we built a system that broke on the first edge case. The data determines valid transitions.

**Simple over complex.** We spent significant time implementing full LibRaw RAW decode integration when embedded preview extraction would have been 60x faster, equal quality, and zero dependencies.

**Test at the right layer.** We added tests at the web UI layer when the bug lived in the RAW decode layer. Test the extraction mechanism directly; do not test the database query that displays its output.

::sidenote::

<Sidenote number="7">Visual inspection over metrics. "Generated 8 thumbnails" told us nothing. Opening the file and looking at it would have caught the bug immediately. Always verify outputs with your eyes, not your test suite.</Sidenote>

<Sidenote number="8">Diagnostic logging proactively. After adding [EMBED] and [RAW] log prefixes, every future bug became immediately visible in the output stream. The 30-second investment in log formatting saved hours of future debugging.</Sidenote>

<!-- Five transferable principles, each earned through failure: (1) State machines over hierarchies — data determines valid transitions, not your assumptions. (2) Simple over complex — embedded JPEG extraction was 60x faster than full RAW decode with zero dependencies. (3) Test at the right layer — we added web UI tests when the bug lived in the decode layer. (4) Visual inspection over metrics — "8 thumbnails generated" told us nothing; opening the file would have caught it instantly. (5) Diagnostic logging proactively — log prefixes like [EMBED] and [RAW] make future bugs self-diagnosing. These apply far beyond image processing. -->

---
layout: section
transition: slide-left
---

# Start at the source

<!-- The section header repeats the through-line one final time before the closing sequence. At this point in the deck, the audience has seen the cost of not starting at the source (three days wasted, black thumbnails), the evidence of the fix (one conditional), and the general principle (six-layer debugging protocol). "Start at the source" has gained meaning with each appearance. -->

---
layout: center
transition: fade
---

# Sometimes the simple solution is 100x better than the complex solution

It is 60x faster. Equal or better quality. Avoids compatibility issues. Reduces complexity. The bug was never in the code — it was in the assumption that first-match was good enough.

<!-- The penultimate slide reframes the entire story. The "60x speedup hiding in plain sight" from the cover is revealed as an accident — we were fixing a correctness bug, not optimizing. The simple solution (scan for the largest JPEG) was not just faster but better in every dimension. The lesson: sometimes the right fix at the right layer is also the fastest, simplest, and most correct. -->

---
layout: end
transition: fade
---

# The bug was never in the code. It was in the assumption.

<!-- The closing resolves the opening subtitle: "A thumbnail bug, a wrong turn, and the 60x speedup hiding in plain sight." The assumption was that first-match extraction would find the right JPEG. It didn't. The code was correct — it faithfully returned the first match. The assumption was wrong — the first match wasn't the best match. "Debug at the source" isn't just about which layer to start in. It's about questioning the assumptions that shape the code in the first place. -->
