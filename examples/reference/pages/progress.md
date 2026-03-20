---
layout: section
transition: iris
---

# Progress Indicators

One recommended component. One accent color.

<!-- Section divider for the progress indicators chapter. ProgressSegmentBar is the recommended progress indicator — it occupies minimal space (3px at the top) and never overlaps with slide content.

Sources:
- file:skills/slide-maker/COMPILER_RULES.md — progress indicator specification -->

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
- The only recommended progress indicator — other variants (dot rail, tally marks, arc gauge) overlap with content

</v-clicks>

<!-- ProgressSegmentBar is the recommended progress indicator for all presets. It divides the top edge into one segment per deck section, then fills the current section proportionally.

[click] Positioned with position: fixed at top: 0, left: 0, right: 0. Height is exactly 3px. z-index: 100 keeps it above slide content but below overlays.

[click] Sections are detected by the useSections composable, which looks for section or cover layouts in slide frontmatter.

[click] The active segment uses a CSS linear-gradient that transitions from --deck-accent (filled portion) to --deck-border (unfilled portion) at the calculated percentage.

[click] Completed segments get solid --deck-accent fill. Unfilled segments use --deck-border (falling back to --deck-muted) at 25% opacity.

[click] The component reads currentLayout from useNav() and hides when the layout is cover or end.

[click] ProgressDotRail, ProgressTallyMarks, and ProgressArcGauge were removed because they overlap with slide content at unpredictable positions. The segment bar is the only variant that avoids this problem.

Sources:
- file:skills/slide-maker/components/ProgressSegmentBar.vue — full component source
- file:skills/slide-maker/COMPILER_RULES.md — text overlap rules -->
