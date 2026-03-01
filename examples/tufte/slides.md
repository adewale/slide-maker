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

---
layout: TufteSlide
transition: slide-left
---

# The mystery

160x120 pixels. A thumbnail that should have been 9504x6320. The Leica M11 Monochrom DNG files were generating only 64px thumbnails instead of the full set of four sizes: 64, 256, 512, and 1024. The web app showed broken images. The logs whispered "upscale warning."

The file contained **44 embedded JPEG previews** at different sizes. A 2.1MB full-resolution preview was sitting right there, untouched.

::sidenote::

<Sidenote number="1">DNG (Digital Negative) files contain multiple embedded JPEG previews at various sizes. The largest is typically full or near-full resolution, intended for fast display without RAW decoding.</Sidenote>

<Sidenote number="2">The quality pipeline detects upscaling: if the source image is only 160x120, it refuses to generate 256, 512, and 1024px thumbnails.</Sidenote>

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

<Sidenote number="3">The instinct to fix what you can see first is strong. The UI was broken, so we fixed the UI. But the data was wrong at the source.</Sidenote>

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

---
layout: TufteSlide
transition: fade
---

# The data

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

<div style="margin-top: 2rem;">

The embedded JPEG extraction is **60x faster** than full RAW decoding. Equal or better quality for thumbnail generation. No LibRaw dependency. No CGO. No JPEG-compressed monochrome edge cases.

</div>

::sidenote::

<Sidenote number="4">The full pipeline with fallback costs 1600ms per file. Direct embedded JPEG extraction costs 20ms. For 100K photos, that is 44 hours vs 33 minutes.</Sidenote>

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

Start at number one. Work your way down. Never start at six and work backwards.

::sidenote::

<Sidenote number="5">A single exiftool command would have revealed the answer immediately: `exiftool -a -G1 -s file.DNG | grep -i preview` shows PreviewImageLength: 2,170,368 bytes.</Sidenote>

<Sidenote number="6">"8 thumbnails generated" does not mean "8 good quality thumbnails." Verify outputs. Do not trust counts.</Sidenote>

---
layout: TufteSlide
transition: fade
---

# Five lessons

**State machines over hierarchies.** Faceted navigation is about valid state transitions, not hierarchical relationships. When we assumed "Year contains Month," we built a system that broke on the first edge case. The data determines valid transitions.

**Simple over complex.** We spent significant time implementing full LibRaw RAW decode integration when embedded preview extraction would have been 60x faster, equal quality, and zero dependencies.

**Test at the right layer.** We added tests at the web UI layer when the bug lived in the RAW decode layer. Test the extraction mechanism directly; do not test the database query that displays its output.

::sidenote::

<Sidenote number="7">Visual inspection over metrics. "Generated 8 thumbnails" told us nothing. Opening the file and looking at it would have caught the bug immediately.</Sidenote>

<Sidenote number="8">Diagnostic logging proactively. After adding [EMBED] and [RAW] log prefixes, every future bug became immediately visible in the output stream.</Sidenote>

---
layout: section
transition: slide-left
---

# Start at the source

---
layout: center
transition: fade
---

# Sometimes the simple solution is 100x better than the complex solution

It is 60x faster. Equal or better quality. Avoids compatibility issues. Reduces complexity. We spent significant time implementing LibRaw integration when embedded preview extraction would have been faster, simpler, and often higher quality.

---
layout: end
transition: fade
---

# Debug at the Source

Olsen -- local-first photo indexing
