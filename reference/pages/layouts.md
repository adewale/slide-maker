---
layout: section
transition: iris
---

# Layouts

Seven built-in. Two custom. Each with a distinct purpose.

<!-- Section dividers use the iris transition (circular clip-path reveal) to signal a new chapter. The section layout provides a heading and optional subtitle — no body content, no bullets. -->

---
transition: slide-left
---

# Default Layout Does 80% of the Work

Heading, body text, and bullet points.

<v-clicks>

- **Bold text** signals emphasis — maps to `var(--deck-accent)`
- `Inline code` uses the mono font with accent-alt background
- *Italic text* for softer emphasis or terminology
- Numbered lists use accent-colored markers
- Bullet depth stays shallow — two levels maximum

</v-clicks>

<!-- The default layout is the most common. Start here; only reach for a custom layout when default cannot express the structure.

[click] Bold text signals emphasis — maps to var(--deck-accent) for visual consistency with the preset.

[click] Inline code uses the mono font — accent-alt background makes it stand out in prose.

[click] Italic text for softer emphasis — terminology, foreign words, or gentle stress.

[click] Numbered lists use accent-colored markers — for ordered sequences where position matters.

[click] Bullet depth stays shallow — two levels maximum. If you need deeper nesting, the slide needs splitting.

Sources:
- file:slide-maker/COMPILER_RULES.md — escalation ladder: Markdown first
- file:slide-maker/SLIDE_KINDS.md — default-content kind -->

---
layout: SplitInsight
transition: wipe-right
---

# SplitInsight Layout

::left::

### Left Column

<v-clicks>

- Custom layout with named slots
- `::left::` and `::right::` markers
- Border divider between columns
- Header spans full width above

</v-clicks>

::right::

### Right Column

<v-clicks>

- Use for comparisons
- Before/after contrasts
- Input/output pairs
- Parallel concepts

</v-clicks>

<!-- SplitInsight is a custom layout defined in layouts/SplitInsight.vue. It uses Vue named slots: the default slot renders the header, ::left:: and ::right:: populate the two columns. A vertical border divides the columns. Use it when two ideas need side-by-side presentation.

Sources:
- file:slide-maker/COMPILER_RULES.md — custom layout justification rules -->

---
layout: TufteSlide
transition: slide-up
---

# TufteSlide Layout

The Tufte layout splits content into a 60% body column and a 30% sidenote margin. This mirrors Edward Tufte's page design: primary narrative flows in the wide column while supporting details live in the margin.

The layout is ideal for data-heavy slides where context matters as much as the headline.

::sidenote::

<Sidenote number="1">Sidenotes use the Sidenote component with a number prop. They render in the margin area defined by the TufteSlide layout.</Sidenote>

<Sidenote number="2">The margin column uses a smaller font size and muted color. It never competes with the body — it supports it.</Sidenote>

<!-- TufteSlide is a custom layout in layouts/TufteSlide.vue. It uses a CSS grid with 60%/30% columns and 6% gap. The ::sidenote:: slot maps to the margin area. The Sidenote component adds a numbered superscript. Use this for information-dense slides where annotation adds value.

Sources:
- file:slide-maker/STYLE_PRESETS.md — tufte-data preset layout tendencies
- file:slide-maker/COMPILER_RULES.md — data visualization component catalog -->

---
layout: center
transition: morph-fade
---

# The center layout is for a single idea, stated boldly

No bullets. No lists. Just the point.

<!-- The center layout constrains h1 to max-width 70% and centers it. Optional body text below. Use it for thesis statements, turning points, or aphorisms. morph-fade (scale + opacity + blur) signals a conceptual shift.

Sources:
- file:slide-maker/SLIDE_KINDS.md — center-statement kind definition -->

---
layout: fact
transition: zoom-in
---

# <v-mark at="1" color="#22d3ee" type="circle">13</v-mark>

custom transitions

Built with pure CSS. No animation libraries. Each with a semantic meaning.

<!-- The fact layout makes h1 enormous (7rem) for a single stat or number. The v-mark with type="circle" draws an animated circle around the number on click. zoom-in transition focuses attention. The subtitle text goes below in muted color.

Sources:
- file:slide-maker/COMPILER_RULES.md — fact layout styling
- file:slide-maker/COMPILER_RULES.md — transition grammar -->

---
layout: quote
transition: fade
---

# "Restraint is the feature"

A good deck has few layouts, few components, readable Markdown, and no legacy HTML smell.

<!-- The quote layout styles h1 as a pull-quote. Use it for direct quotes, design principles, or memorable phrasing. fade transitions pair naturally with reflective content.

Sources:
- file:slide-maker/COMPILER_RULES.md — restraint as priority -->

---
layout: two-cols
transition: glide
---

# Built-in Two Columns

::left::

The `two-cols` layout is a Slidev built-in. It splits the slide into two columns using `::left::` and `::right::` slot syntax.

Unlike SplitInsight, it has no header span and no border divider.

::right::

Use the built-in when:

<v-clicks>

- No visual separator is needed
- Content is loosely related
- A spanning header is unnecessary

</v-clicks>

<!-- two-cols is a Slidev built-in layout, not a custom one. The escalation ladder says: prefer built-in layouts before reaching for custom ones. SplitInsight exists because two-cols lacks a shared header and visual divider.

Sources:
- file:slide-maker/COMPILER_RULES.md — escalation ladder: built-in before custom -->
