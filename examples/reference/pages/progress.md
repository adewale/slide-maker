---
layout: section
transition: iris
---

# Progress Indicators

Four components. Four positions. One accent color.

<!-- Section divider for the progress indicators chapter. These four components provide visual orientation — they show the audience (or presenter) how far through the deck they are. Each occupies a different screen edge and uses --deck-accent as its primary color. All four hide on cover and end layouts.

Sources:
- file:slide-maker/COMPILER_RULES.md — progress indicator specification with preset defaults -->

---
transition: slide-left
---

# ProgressSegmentBar — Section-Aware Top Bar

A thin 3px bar at the top of the slide with one segment per section.

<v-clicks>

- Fixed at the top edge, full width, 3px tall
- One segment per section — sections detected from `layout: section` or `layout: cover` frontmatter
- Current section fills progressively with `--deck-accent` via a linear gradient
- Completed sections are solid `--deck-accent`, unfilled sections use `--deck-border` at 25% opacity
- Hidden on `cover` and `end` layouts
- Default progress indicator for editorial-dark, swiss-minimal, bold-modern, cloudflare, and material-design presets

</v-clicks>

<!-- ProgressSegmentBar is the most common progress indicator. It divides the top edge into one segment per deck section, then fills the current section proportionally.

[click] Positioned with position: fixed at top: 0, left: 0, right: 0. Height is exactly 3px. z-index: 100 keeps it above slide content but below overlays.

[click] Sections are detected by the useSections composable, which looks for section or cover layouts in slide frontmatter.

[click] The active segment uses a CSS linear-gradient that transitions from --deck-accent (filled portion) to --deck-border (unfilled portion) at the calculated percentage.

[click] Completed segments get solid --deck-accent fill. Unfilled segments use --deck-border (falling back to --deck-muted) at 25% opacity.

[click] The component reads currentLayout from useNav() and hides when the layout is cover or end.

[click] This is the default for 5 of 6 presets. Only tufte-data defaults to tally-marks instead.

Sources:
- file:slide-maker/components/ProgressSegmentBar.vue — full component source
- file:slide-maker/COMPILER_RULES.md — progress indicator preset defaults -->

---
transition: slide-left
---

# ProgressDotRail — Vertical Dots on the Right Edge

A column of small dots on the right side of the screen, one per slide.

<v-clicks>

- Fixed on the right edge, vertically centered with `transform: translateY(-50%)`
- One dot per slide — current dot filled with `--deck-accent`
- Visited dots filled with `--deck-muted`, future dots outlined with `--deck-border`
- Gap between dots scales dynamically: `max(2px, min(8px, calc(...)))` based on total slide count
- Best for focused talks of 5-15 slides — becomes crowded beyond 20

</v-clicks>

<!-- ProgressDotRail renders a vertical column of 6px circles on the right edge. It provides a spatial sense of position within the deck.

[click] Positioned at right: 12px, top: 50%, vertically centered. The column grows or shrinks with the slide count.

[click] Each dot represents one slide. The current slide's dot is filled with --deck-accent and has a matching border.

[click] Visited (past) dots use --deck-muted for both fill and border. Future dots are transparent with a --deck-border outline.

[click] The gap between dots uses a CSS calc expression that adapts to viewport height and slide count. This prevents overflow on longer decks while keeping spacing comfortable on short ones.

[click] Works best for 5-15 slides. Beyond 20 slides the dots become too dense to be useful — consider segment-bar or arc-gauge instead.

Sources:
- file:slide-maker/components/ProgressDotRail.vue — full component source -->

---
transition: slide-left
---

# ProgressTallyMarks — Analog Marks at the Bottom

Stroke marks at the bottom of the slide, grouped in fives with a diagonal cross stroke.

<v-clicks>

- Fixed at the bottom edge (`bottom: 8px, left: 16px`)
- Vertical strokes for each slide, every 5th stroke crosses diagonally
- Current mark uses `--deck-accent`, completed marks use `--deck-muted`
- Future marks use `--deck-border` at 25% opacity
- SVG-rendered with `stroke-linecap: round` for a hand-drawn feel
- Default for the `tufte-data` preset — best for decks under 20 slides

</v-clicks>

<!-- ProgressTallyMarks renders an analog-style tally counter at the bottom of each slide. The visual metaphor is a hand-drawn tally on paper.

[click] Positioned at the bottom-left with flex-wrap so groups flow naturally across the width.

[click] Each group is an SVG. Strokes 1-4 are vertical lines (2px wide). The 5th stroke is a diagonal line crossing all four, matching the traditional tally convention.

[click] The current slide's stroke uses --deck-accent. Completed strokes use --deck-muted.

[click] Future strokes use --deck-border at 25% opacity, making them barely visible.

[click] All strokes use stroke-linecap: round for softer endpoints that evoke hand drawing.

[click] tufte-data is the only preset that defaults to tally-marks. The analog aesthetic matches the scholarly, data-driven mood of the tufte preset.

Sources:
- file:slide-maker/components/ProgressTallyMarks.vue — full component source
- file:slide-maker/COMPILER_RULES.md — preset defaults for progress indicators -->

---
transition: fade
---

# ProgressArcGauge — Quarter-Circle in the Corner

A compact SVG arc in the bottom-right corner that fills clockwise as the deck progresses.

<v-clicks>

- Fixed at `bottom: 12px, right: 12px` — 36px square
- Quarter-circle arc (90 degrees) that fills from the top sweeping clockwise
- Fill color is `--deck-accent`, background arc uses `--deck-border` at 15% opacity
- Progress calculated as `currentPage / total` — works at any deck length
- Hidden on `cover` and `end` layouts, rendered at 85% opacity

</v-clicks>

<!-- ProgressArcGauge renders a pie-slice SVG that fills a quarter circle proportionally to deck progress.

[click] Positioned in the bottom-right corner. The 36px size is small enough to stay unobtrusive on any slide layout.

[click] The arc starts at the top (12 o'clock relative to the center) and sweeps clockwise. A full quarter-circle represents 100% progress.

[click] The filled arc uses --deck-accent. The background quarter-circle uses --deck-border (or --deck-muted) at 15% opacity as a ghost reference.

[click] Progress is a simple ratio: current page divided by total pages. No section awareness needed — the arc works equally well for 5-slide or 50-slide decks.

[click] Like all progress indicators, it hides on cover and end layouts. The 85% opacity keeps it visible but not distracting.

Sources:
- file:slide-maker/components/ProgressArcGauge.vue — full component source -->

---
layout: fact
transition: zoom-in
---

# <v-mark at="1" color="#22d3ee" type="circle">4</v-mark>

progress indicators

Segment bar, dot rail, tally marks, arc gauge — pick one in `deck.spec.md` and the compiler mounts it.

<!-- Four progress indicators, each occupying a different screen edge: segment-bar (top), dot-rail (right), tally-marks (bottom-left), arc-gauge (bottom-right). Set the progress field in deck.spec.md Meta to enable one. All four use --deck-accent for the active state and hide on cover/end layouts.

Sources:
- file:slide-maker/COMPILER_RULES.md — progress indicator specification -->
