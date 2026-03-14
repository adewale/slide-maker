layout: section
transition: iris
---

# Advanced Slidev

Features beyond the basics: hide/show, code titles, math, and icons.

---
transition: slide-left
---

# v-click.hide and v-after

**v-click.hide** removes an element on click — the inverse of v-click.

<div style="margin-top: 1rem;">

This text is always visible.

<v-click>

This appears on click 1.

</v-click>

</div>

**v-after** reveals an element simultaneously with the previous click — no extra click needed.

<v-clicks>

- First item (click 1)
- Second item (click 2)

</v-clicks>

<!-- v-click.hide is for replacement patterns: old content leaves, new content arrives. Use it for before/after comparisons and state changes. v-after is for simultaneous reveal — an element that should appear at the same time as the previous v-click item without consuming an extra click.

Sources:
- file:slide-maker/COMPILER_RULES.md — v-click.hide for replacement pattern
- file:slide-maker/SLIDEV_REFERENCE.md — v-after simultaneous reveal -->

---
transition: slide-up
---

# Code Block Titles

Add `[filename]` after the language to show a title bar.

```ts [tokens.css]
:root {
  --deck-bg: #0c0e14;
  --deck-fg: #e4e8ef;
  --deck-accent: #22d3ee;
}
```

```go [main.go]
func main() {
    http.HandleFunc("/", handler)
    log.Fatal(http.ListenAndServe(":8080", nil))
}
```

Six languages appear across the existing decks: `ts`, `go`, `python`, `bash`, `css`, `yaml`.

<!-- Code block titles help the audience track which file is being discussed. The bracket syntax [filename] renders a header bar above the code. Combine with line highlighting: ```ts [api.ts] {1-3|5-7|all}. Keep code blocks to 8 lines max.

Sources:
- file:slide-maker/COMPILER_RULES.md — code block title syntax
- file:slide-maker/SLIDEV_REFERENCE.md — code block features -->

---
transition: glide
---

# LaTeX Math

Inline math: $E = mc^2$ renders within text using KaTeX.

Block math centers and scales the expression:

$$
\sum_{i=1}^{n} x_i = x_1 + x_2 + \cdots + x_n
$$

$$
f(x) = \frac{1}{\sigma\sqrt{2\pi}} e^{-\frac{(x-\mu)^2}{2\sigma^2}}
$$

Use LaTeX when the mathematical notation is the point — not as decoration.

<!-- Slidev uses KaTeX for LaTeX rendering. Single $ delimiters for inline math, double $$ for display math. Supported in all layouts. Use sparingly — most slide content should be prose and data, not equations. LaTeX is appropriate for technical/academic decks.

Sources:
- file:slide-maker/SLIDEV_REFERENCE.md — LaTeX / Math section -->

---
transition: zoom-in
---

# Iconify Icons

Slidev integrates Iconify for inline SVG icons. Three icon sets are installed:

<v-clicks>

- **Carbon** — `<carbon-code />` <carbon-code /> for technical/UI icons
- **MDI** — `<mdi-check />` <mdi-check /> for common actions and states
- **Logos** — `<logos-vue />` <logos-vue /> for brand/technology logos

</v-clicks>

<v-click>

Use `<mdi-check />` and `<mdi-close />` for comparison grids — never use emoji for checkmarks. Icons inherit the current text color and size.

</v-click>

<!-- Three Iconify packages are installed: @iconify-json/carbon, @iconify-json/mdi, @iconify-json/logos. Icons render as inline SVGs that inherit currentColor. The COMPILER_RULES.md explicitly require Iconify icons over emoji for checkmarks in comparison grid tables.

Sources:
- file:slide-maker/COMPILER_RULES.md — comparison grid tables: use Iconify, never emoji
- file:slide-maker/SLIDEV_REFERENCE.md — Icons section -->

---
layout: section
transition: iris
---

# Presentation Philosophy

15 principles. Structure, not substance.

---
transition: slide-left
---

# Six Principles That Shape Every Deck

<v-clicks>

- **One idea per slide** — 1-3 lines max. If you're scrolling, split it.
- **Sustained metaphor** — the through-line does analytical work, not decoration
- **Decks are arguments, not outlines** — thesis, complication, synthesis
- **Text-dominant** — images only when demonstrative, never decorative
- **Provocative openings** — never an agenda slide. Question, epigraph, or bold claim.
- **Resonant closings** — never "Questions?" or "Thank you". Circle back.

</v-clicks>

<!-- These 6 principles (from 15 total) most directly affect compilation. "One idea per slide" drives the density guardrails. "Sustained metaphor" drives the through-line system. "Decks are arguments" drives narrative arc. The remaining 9 principles cover ALL CAPS emphasis, cross-disciplinary references, named frameworks, and data as bold text assertions.

Sources:
- file:docs/PRESENTATION_PHILOSOPHY.md — 15 rhetorical principles
- file:slide-maker/COMPILER_RULES.md — presentation philosophy integration -->

---
layout: center
transition: fade
---

# Rules produce structure, not substance

A deck that passes every structural check can still say nothing. The checklist catches missing pieces; only the presenter's genuine insight makes the deck worth giving.

<!-- Principle 15 from PRESENTATION_PHILOSOPHY.md. This is the meta-principle: all the rules, guardrails, and checklists are scaffolding. They prevent common failures (generic output, brittle implementation, visual monotony) but they cannot generate insight, narrative, or conviction. Those come from the presenter and the source material.

Sources:
- file:docs/PRESENTATION_PHILOSOPHY.md — principle 15: rules produce structure, not substance -->

---
layout: end
transition: fade
---

# The reference is the test

<!-- The closing resolves the opening. "Every feature. One deck." — this deck doesn't just document features, it exercises them. Every layout, transition, directive, component, and Skill concept appears at least once. When the Skill changes, this deck is where you see whether it still works. -->
