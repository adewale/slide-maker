---
theme: seriph
title: Slide Maker Reference
selectable: true
colorSchema: dark
transition: slide-left
layout: cover
fonts:
  sans: Inter
  serif: Source Sans 3
  mono: JetBrains Mono
  weights: '300,400,500,600,700'
---

# Slide Maker Reference

Every feature. One deck.

<!-- This reference deck documents and demonstrates every Slidev feature and Slide Maker extension. Each slide names the feature it exemplifies and uses it in practice. The deck serves as both documentation and a test fixture for iterating on the Skill.

Sources:
- file:slide-maker/COMPILER_RULES.md — feature inventory and acceptance criteria
- file:slide-maker/STYLE_PRESETS.md — visual direction system -->

---
layout: statement
transition: fade
---

# This deck exists to be broken, fixed, and improved

It is the test fixture for the Slide Maker skill and the reference for what Slidev can do.

<!-- The statement layout centers text with maximum visual weight. Use it for provocative or framing statements — never for content with bullet points. This is a good layout for opening tension or closing resolution.

Sources:
- file:slide-maker/SLIDE_KINDS.md — statement/center-statement kind definition -->

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

# Default Content Layout

The workhorse. Heading, body text, and bullet points.

<v-clicks>

- **Bold text** signals emphasis — maps to `var(--deck-accent)`
- `Inline code` uses the mono font with accent-alt background
- *Italic text* for softer emphasis or terminology
- Numbered lists use accent-colored markers
- Bullet depth stays shallow — two levels maximum

</v-clicks>

<!-- The default layout is the most common. It supports headings, paragraphs, bullet lists, numbered lists, bold, italic, inline code, and links. v-clicks wraps the list for progressive reveal. The escalation ladder says: start here, only reach for a custom layout when default cannot express the structure.

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

---
layout: section
transition: iris
---

# Interactivity

Progressive reveals, annotations, and motion.

---
transition: slide-left
---

# v-clicks: Progressive Reveal

Wrap a list in `<v-clicks>` to reveal items one at a time on click.

<v-clicks>

- First item appears on first click
- Second item on second click
- Third item on third click
- The audience focuses on each point before seeing the next
- Aim for fewer than 40% of slides using v-clicks

</v-clicks>

<!-- v-clicks is the primary interactivity mechanism. It wraps any list to make each item appear sequentially. The acceptance checklist requires bullet lists to use v-clicks for progressive reveal. But restraint matters — not every list needs it.

Sources:
- file:slide-maker/COMPILER_RULES.md — v-click usage rules and 40% budget -->

---
transition: wipe-up
---

# v-mark: Five Annotation Types

Each type draws attention differently.

<v-clicks>

- <v-mark type="highlight" color="rgba(34, 211, 238, 0.2)">Highlight</v-mark> — soft background wash for key phrases
- <v-mark type="underline" color="#22d3ee">Underline</v-mark> — emphasis without obscuring text
- <v-mark type="strike" color="#f472b6">Strikethrough</v-mark> — for ideas being rejected or superseded
- <v-mark type="box" color="#22d3ee">Box</v-mark> — border around a term for definition or focus
- <v-mark at="6" type="circle" color="#f472b6">Circle</v-mark> — draws a hand-drawn circle, best on numbers

</v-clicks>

<!-- v-mark renders Rough Notation annotations over text. Five types: highlight, underline, strike, box, circle. The color prop accepts any CSS color value. The at="N" prop delays the annotation until click N. strike is for rejected options, highlight for key terms, circle for stats.

Sources:
- file:slide-maker/COMPILER_RULES.md — v-mark variants with semantic meanings -->

---
transition: slide-up
---

# v-click with Targeted Timing

Individual elements can appear at specific click numbers.

Step 1 is visible immediately.

<v-click at="1">

Step 2 appears on the first click.

</v-click>

<v-click at="2">

Step 3 appears on the second click.

</v-click>

<v-click at="3">

The `at` prop controls which click triggers each element. This enables non-linear reveal sequences — later DOM elements can appear before earlier ones.

</v-click>

<!-- v-click wraps a single element for click-gated reveal. The at="N" prop specifies which click number triggers it. Unlike v-clicks (which auto-increments), v-click gives explicit control over reveal order.

Sources:
- file:slide-maker/COMPILER_RULES.md — v-click timing and reveal patterns -->

---
transition: blur
---

# v-motion: Animated Entrance

<div v-motion
  :initial="{ opacity: 0, y: -40 }"
  :enter="{ opacity: 1, y: 0, transition: { delay: 300, duration: 800 } }">

This entire block slides down and fades in after a 300ms delay.

</div>

<div v-motion
  :initial="{ opacity: 0, x: -60 }"
  :enter="{ opacity: 1, x: 0, transition: { delay: 600, duration: 600 } }">

This block slides in from the left after 600ms.

</div>

<div v-motion
  :initial="{ opacity: 0, scale: 0.8 }"
  :enter="{ opacity: 1, scale: 1, transition: { delay: 900, duration: 500 } }">

This block scales up from 80% after 900ms. Reserve v-motion for 3-4 dramatic entrances per deck.

</div>

<!-- v-motion uses @vueuse/motion for physics-based element animations. Properties: opacity, x, y, scale, rotate. The :initial state is where the element starts, :enter is where it ends up. Each can have independent delay and duration.

Sources:
- file:slide-maker/COMPILER_RULES.md — v-motion budget: 3-4 per deck max -->

---
layout: section
transition: flip-x
---

# Code

Syntax highlighting, line ranges, and Magic Move.

---
transition: slide-left
---

# Line Highlighting

Step through code with `{ranges}` syntax.

```ts {1-3|5-8|all}
// Token system: CSS custom properties
const tokens = {
  bg: '--deck-bg',

  fg: '--deck-fg',
  accent: '--deck-accent',
  muted: '--deck-muted',
  fontDisplay: '--deck-font-display',
}
```

Click advances through: lines 1-3, then 5-8, then all. The `|` separator defines each step.

<!-- Code blocks accept a {ranges} option after the language identifier. Ranges like {1-3|5-8|all} create click-stepped highlighting. Use this for walking through algorithms, configs, or APIs. Keep code blocks to 8 lines or fewer.

Sources:
- file:slide-maker/COMPILER_RULES.md — code overflow guard: 8 lines max -->

---
transition: swing
---

# Magic Move: Code Evolution

Four backticks and `magic-move` animate between code states.

````md magic-move
```ts
// Step 1: A simple function
function greet(name: string) {
  return `Hello, ${name}`
}
```
```ts
// Step 2: Add validation
function greet(name: string) {
  if (!name.trim()) throw new Error('Name required')
  return `Hello, ${name}`
}
```
```ts
// Step 3: Add formatting
function greet(name: string, formal = false) {
  if (!name.trim()) throw new Error('Name required')
  const title = formal ? 'Dear' : 'Hello'
  return `${title}, ${name}`
}
```
````

<!-- Magic Move animates code transformations between fenced blocks. Use four backticks with `md magic-move` to wrap multiple triple-backtick code blocks. Each block is one step — Slidev morphs matching tokens between steps. Reserved for code transformations only.

Sources:
- file:slide-maker/COMPILER_RULES.md — Magic Move: code transformations only -->

---
layout: section
transition: cube
---

# Diagrams

Mermaid graphs with explicit styling.

---
transition: zoom-out
---

# Mermaid: Left-to-Right Flow

```mermaid {theme: 'dark', scale: 0.85}
graph LR
  A["Markdown"] --> B["Built-in Layout"]
  B --> C["Custom Layout"]
  C --> D["Custom Component"]
  D --> E["Inline HTML"]
  classDef low fill:#0d3b4a,stroke:#22d3ee,color:#22d3ee
  classDef mid fill:#22d3ee,stroke:#22d3ee,color:#0c0e14
  classDef high fill:#831843,stroke:#f472b6,color:#f472b6
  class A,B low
  class C,D mid
  class E high
```

The escalation ladder: start at Markdown, escalate only when the lower level cannot express the structure.

<!-- Mermaid diagrams require explicit color values on every node using classDef. Never rely on Mermaid's default theme colors. Use the deck's token colors as the source for classDef values. Light fills get dark text, dark fills get light text.

Sources:
- file:slide-maker/COMPILER_RULES.md — Mermaid guidelines: explicit colors, no defaults -->

---
transition: flip-y
---

# Mermaid: Top-Down Tree

```mermaid {theme: 'dark', scale: 0.7}
graph TD
  ROOT((Style Presets)) --> ED["editorial-dark"]
  ROOT --> SM["swiss-minimal"]
  ROOT --> BM["bold-modern"]
  ROOT --> SE["sumi-e"]
  ROOT --> TD2["tufte-data"]
  ROOT --> CF["cloudflare"]
  ROOT --> MD["material-design"]
  classDef hub fill:#22d3ee,stroke:#22d3ee,color:#0c0e14
  classDef leaf fill:#0d3b4a,stroke:#22d3ee,color:#e4e8ef
  class ROOT hub
  class ED,SM,BM,SE,TD2,CF,MD leaf
```

Seven presets, each controlling typography, color, motion, and layout tendencies.

<!-- Graph TD (top-down) works well for hierarchies and taxonomies. The double-parenthesis syntax creates a circle node. Square brackets create rectangles. Every node must have an explicit classDef.

Sources:
- file:slide-maker/STYLE_PRESETS.md — seven preset definitions -->

---
layout: section
transition: iris
---

# Data Visualization

Word-sized charts. Inline with prose. No charting library.

---
transition: slide-left
---

# Sparklines and Small Multiples

<div v-motion :initial="{ opacity: 0, x: -30 }" :enter="{ opacity: 1, x: 0, transition: { delay: 200, duration: 600 } }">

<SmallMultiples :cols="4">
<div>
  <Sparkline :data="[10, 15, 12, 18, 22, 19, 25]" :width="90" :height="20" color="#22d3ee" />
  <div><strong>Rising</strong></div>
</div>
<div>
  <Sparkline :data="[25, 22, 18, 15, 12, 10, 8]" :width="90" :height="20" color="#f472b6" />
  <div><strong>Falling</strong></div>
</div>
<div>
  <Sparkline :data="[15, 18, 14, 19, 13, 17, 16]" :width="90" :height="20" color="#22d3ee" />
  <div><strong>Volatile</strong></div>
</div>
<div>
  <Sparkline :data="[15, 15, 16, 15, 15, 16, 15]" :width="90" :height="20" color="#22d3ee" />
  <div><strong>Stable</strong></div>
</div>
</SmallMultiples>

</div>

Sparkline renders an inline SVG polyline. SmallMultiples arranges children in a CSS grid.

<!-- Sparkline accepts data (array of numbers), width, height, and color props. SmallMultiples accepts a cols prop for grid column count. Both use currentColor by default, overridable with explicit color values.

Sources:
- file:slide-maker/COMPILER_RULES.md — data visualization component catalog -->

---
transition: slide-up
---

# MicroBar, BulletBar, and SlopeChart

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-top: 1rem;">

<div>

**MicroBar** — categorical comparison

<MicroBar :data="[{label: 'Build', value: 42}, {label: 'Test', value: 78}, {label: 'Deploy', value: 15}]" color="#22d3ee" />

</div>

<div>

**BulletBar** — actual vs target

<BulletBar :value="73" :target="90" :max="100" label="Coverage" />

</div>

</div>

<div style="margin-top: 2rem;">

**SlopeChart** — before and after

<SlopeChart :items="[{label: 'Build', start: 120, end: 45}, {label: 'Test', start: 90, end: 30}, {label: 'Deploy', start: 60, end: 15}]" startLabel="Before" endLabel="After" />

</div>

<!-- MicroBar takes data as [{label, value}]. BulletBar shows actual vs target with a marker line. SlopeChart shows before/after changes with connecting lines. All use currentColor by default.

Sources:
- file:slide-maker/components/MicroBar.vue — horizontal bar component
- file:slide-maker/components/BulletBar.vue — bullet graph component
- file:slide-maker/components/SlopeChart.vue — slope chart component -->

---
transition: glide
---

# WinLoss, DotStrip, and DataTable

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-top: 1rem;">

<div>

**WinLoss** — binary outcomes

<WinLoss :data="[1, 1, -1, 1, 0, -1, 1, 1, 1, -1, 1, 1]" />

Pass/fail sequences at a glance.

</div>

<div>

**DotStrip** — distribution

<DotStrip :data="[12, 15, 18, 22, 25, 28, 35, 42, 48]" />

Shows spread and clustering.

</div>

</div>

<div style="margin-top: 1.5rem;">

**DataTable** — minimal table

<DataTable :headers="['Feature', 'Type', 'Status']" :rows="[['v-clicks', 'Directive', 'Built-in'], ['v-mark', 'Directive', 'Built-in'], ['Sparkline', 'Component', 'Custom'], ['TufteSlide', 'Layout', 'Custom']]" />

</div>

<!-- WinLoss renders positive values up, negative down, zero as a thin line. DotStrip plots values as dots on a horizontal axis. DataTable renders a minimal table with bottom borders only — no vertical lines, no zebra striping.

Sources:
- file:slide-maker/components/WinLoss.vue — binary outcome visualization
- file:slide-maker/components/DotStrip.vue — dot plot component
- file:slide-maker/components/DataTable.vue — minimal table component -->

---
layout: section
transition: iris
---

# Transitions and Effects

13 cinematic transitions. 6 hover patterns. Scoped CSS.

---
transition: morph-fade
---

# Transition Catalog

Each transition carries a semantic meaning in the grammar.

<v-clicks>

- **fade** — reflection, pause, denouement
- **slide-left** — progression, forward momentum
- **slide-up** — reveal, elevation
- **iris** — new chapter, section entry
- **morph-fade** — conceptual shift
- **wipe-right** / **wipe-up** — comparison, before/after
- **zoom-in** / **zoom-out** — focus or defocus

</v-clicks>

<v-click>

Plus **flip-x**, **flip-y**, **cube**, **swing**, **blur**, and **glide** for 3D, filter, and motion effects.

</v-click>

<!-- The transition grammar assigns semantic meaning to each transition. This is not cosmetic — it is a language. fade for reflection, iris for new chapters, wipe-right for comparison. The default transition in frontmatter should be the most common one in the deck.

Sources:
- file:slide-maker/COMPILER_RULES.md — transition grammar with semantic meanings -->

---
transition: slide-left
---

# Hover Interactions

Six reusable CSS patterns from `interactions.css`.

<div class="spotlight-group" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; margin-top: 1.5rem;">

<div class="hover-lift" style="padding: 1.5rem; border: 1px solid var(--deck-accent); border-radius: 8px; text-align: center;">

**hover-lift**

translateY(-4px) + shadow

</div>

<div class="hover-scale" style="padding: 1.5rem; border: 1px solid var(--deck-accent); border-radius: 8px; text-align: center;">

**hover-scale**

scale(1.03)

</div>

<div class="hover-glow" style="padding: 1.5rem; border: 1px solid var(--deck-accent); border-radius: 8px; text-align: center;">

**hover-glow**

accent shadow

</div>

</div>

The parent `spotlight-group` dims all siblings when hovering any one card.

<!-- Six interaction patterns in interactions.css: hover-lift, spotlight-group, hover-scale, hover-accent, hover-glow, hover-dim. The spotlight-group class on the parent container dims all children except the one being hovered. CSS-only, no JavaScript.

Sources:
- file:slide-maker/styles/interactions.css — hover pattern definitions -->

---
transition: wipe-right
---

# Scoped Styles and Tokens

The `<style>` block adds per-slide CSS. All values reference `--deck-*` tokens.

```css
:root {
  --deck-bg: #0c0e14;
  --deck-fg: #e4e8ef;
  --deck-accent: #22d3ee;
  --deck-accent-alt: #f472b6;
  --deck-muted: rgba(228, 232, 239, 0.5);
}
```

<v-click>

`tokens.css` declares. `theme.css` applies. Components read. Never hardcode hex values in scoped styles.

</v-click>

<!-- The token system is the bridge between presets and slides. tokens.css contains only :root declarations. theme.css maps tokens to .slidev-layout classes. Scoped styles must use var(--deck-*) references, never raw hex or rgb values. deck-lint.mjs flags hardcoded colors.

Sources:
- file:slide-maker/COMPILER_RULES.md — token specification and scoped style rules -->

---
layout: section
transition: iris
---

# The Skill

Seven steps from intent to deck. Ten phases of compilation.

---
transition: slide-left
---

# Seven-Step Workflow

```mermaid {theme: 'dark', scale: 0.8}
graph LR
  A["Mode"] --> B["Sources"]
  B --> C["Intake"]
  C --> D["Direction"]
  D --> E["Spec"]
  E --> F["Compile"]
  F --> G["Validate"]
  classDef early fill:#0d3b4a,stroke:#22d3ee,color:#22d3ee
  classDef mid fill:#22d3ee,stroke:#22d3ee,color:#0c0e14
  classDef late fill:#164e63,stroke:#22d3ee,color:#e4e8ef
  class A,B early
  class C,D mid
  class E,F,G late
```

<v-clicks>

- **Mode** — new deck or update to existing
- **Sources** — gather README, ARCHITECTURE, CHANGELOG, LESSONS_LEARNED
- **Intake** — normalize title, goal, audience, tone, target length
- **Direction** — offer 2-3 visual directions in words only
- **Spec** — write `deck.spec.md` before any slides
- **Compile** — generate slides, styles, layouts, components
- **Validate** — spec matches slides, density controlled, abstractions justified

</v-clicks>

<!-- The Skill's workflow enforces direction-before-content. Visual identity is a planning concern decided at step 4, before a single slide is written at step 6. This prevents the generic failure mode where styling is applied after compilation.

Sources:
- file:slide-maker/SKILL.md — workflow steps 1-7
- file:slide-maker/COMPILER_RULES.md — compilation phases -->

---
layout: SplitInsight
transition: wipe-right
---

# Source-of-Truth Model

::left::

### Planning Layer

<v-clicks>

- `deck.spec.md` is the blueprint
- Structure, tokens, boundaries
- Structural changes start here
- Must stay in sync with slides

</v-clicks>

::right::

### Presentation Layer

<v-clicks>

- `slides.md` is the compiled output
- Native Slidev Markdown
- `styles/`, `layouts/`, `components/`
- Implementation serves the spec

</v-clicks>

<!-- The dual-layer architecture prevents both failure modes. The spec layer prevents generic output by forcing visual direction choices before compilation. The presentation layer prevents brittle output by compiling to native Slidev Markdown. Edit the spec to change direction. Edit slides.md to change content.

Sources:
- file:slide-maker/SKILL.md — source-of-truth model
- file:slide-maker/DECK_SPEC.md — planning schema specification -->

---
transition: slide-up
---

# Ten Compilation Phases

<v-clicks>

1. **Gather sources** — read project docs, extract facts and stories
2. **Normalize spec** — resolve meta, tokens, slide and layout inventory
3. **Decide level** — escalation ladder per slide: Markdown first
4. **Write headmatter** — theme, fonts, colorSchema, transition
5. **Write slides** — clean Markdown, one idea per slide, v-clicks on lists
6. **Write tokens** — `--deck-bg`, `--deck-fg`, `--deck-accent`, `--deck-muted`
7. **Write theme** — typography, color application, v-click animations

</v-clicks>

<v-click>

8-10: **Custom layouts**, **custom components**, **prune dead code** — only when justified.

</v-click>

<!-- Phases 1-7 run on every deck. Phases 8-10 are conditional — custom layouts only for recurring structures, custom components only for blocks with props and reuse, dead code pruning only when updating. The escalation ladder in phase 3 is the anti-brittle mechanism.

Sources:
- file:slide-maker/COMPILER_RULES.md — phases 1-10 specification -->

---
transition: fade
---

# Anti-Patterns

Things the Skill must never produce.

<v-clicks>

- No generic stock phrases ("Let's dive in", "In conclusion")
- No ad-hoc transitions — each type has a fixed semantic meaning
- No same layout for every content slide — vary the rhythm
- No hardcoded hex in `<style scoped>` — use `var(--deck-*)` only
- No "install command" closings — resolve the opening instead
- No blanket `.slidev-layout { background }` overrides on themed decks

</v-clicks>

<!-- Anti-patterns are the negative space of the Skill. They define what a generated deck should never look like. The most common failure: every slide uses the default layout with the same transition, producing visual monotony. The hardcoded hex rule prevents palette drift when presets change.

Sources:
- file:slide-maker/COMPILER_RULES.md — anti-patterns list -->

---
layout: section
transition: iris
---

# Narrative Architecture

Slide kinds, through-lines, and story structure.

---
transition: slide-left
---

# 14 Canonical Slide Kinds

<v-clicks>

- **cover** / **end** — opening and closing frames
- **section** — chapter breaks that create visual rhythm
- **default-content** — the workhorse explanatory slide
- **center-statement** / **fact** / **quote-pull** — single-idea emphasis
- **split-insight** / **comparison** — side-by-side reasoning
- **metrics-grid** — comparable metrics in a grid
- **image-caption** / **visual-evidence** — image with context

</v-clicks>

<v-click>

Plus **timeline**, **through-line-echo** (resurfaces the deck's thread mid-deck, max 2-3).

</v-click>

<!-- Each kind has a default implementation level: cover maps to built-in cover, section to built-in section. Escalate only when the kind repeats enough to justify a custom layout. The decision rule: prefer plain Markdown, then built-in layout, then one local custom layout, then one local custom component.

Sources:
- file:slide-maker/SLIDE_KINDS.md — canonical kinds and escalation rules
- file:slide-maker/SLIDE_KINDS.md — density guardrails -->

---
layout: TufteSlide
transition: slide-up
---

# Through-Line Types

The through-line is the conceptual thread that holds the deck together. It must come from the source material, not be imposed on it.

Five types, each with a different rhetorical shape:

- **Question** — posed early, answered repeatedly
- **Metaphor** — concrete image mapping to abstract concept
- **Concept** — technical idea connecting all sections
- **Provocation** — bold claim the deck proves
- **Design-rule** — constraint that shaped every decision

::sidenote::

<Sidenote number="1">The through-line appears in 5-6 slides, gaining new meaning each time. Cover introduces it. Sections refract it. End resolves it.</Sidenote>

<Sidenote number="2">Bookend syndrome: the through-line appears only on cover and closing. The middle forgets it exists. This is the most common failure.</Sidenote>

<!-- The through-line IS: present in 5-6 slides, gaining meaning, resolved at close. The through-line IS NOT: a tagline on cover and close only (bookend syndrome), a decorative metaphor with no analytical function, or multiple competing threads.

Sources:
- file:slide-maker/COMPILER_RULES.md — through-line types and anti-patterns
- file:slide-maker/COMPILER_RULES.md — per-slide-type through-line placement -->

---
transition: morph-fade
---

# Narrative Arc and Structural Rhythm

Every deck follows a four-part story structure:

<v-clicks>

- **Tension** — open with a problem, contradiction, or surprising fact
- **Exploration** — walk through the journey, showing real decisions
- **Insight** — present a counterintuitive finding or unexpected result
- **Resolution** — close with a memorable takeaway

</v-clicks>

<v-click>

Slides alternate in a rhythm: **section divider**, 2-3 **content slides**, then a **pause** (quote, diagram, or fact). Repeat. This prevents visual monotony.

</v-click>

<!-- The narrative arc comes from PRESENTATION_PHILOSOPHY.md: "Decks are arguments, not outlines." Structure follows dialectical progression: thesis, complication, synthesis. Every slide either advances the argument or provides evidence. Provocative openings, resonant closings — never an agenda slide, never "Questions?"

Sources:
- file:slide-maker/COMPILER_RULES.md — narrative arc: tension, exploration, insight, resolution
- file:docs/PRESENTATION_PHILOSOPHY.md — dialectical progression, provocative openings, resonant closings -->

---
transition: slide-left
---

# War Stories and Source Citations

Every deck of 10+ slides needs at least one **war story** — a specific moment where something broke or a false trail was followed.

<v-clicks>

- War stories are concrete, not abstract: "The cache was 2.3 GB" beats "We encountered challenges"
- Every war story cites specific evidence: file path, commit, screenshot
- Every content slide with facts needs a `Sources:` block in presenter notes

</v-clicks>

<v-click>

```html
<!-- Presenter notes here...

Sources:
- https://github.com/user/project/blob/main/README.md — overview
- file:LESSONS_LEARNED.md — the production incident
-->
```

</v-click>

<!-- Source citations ensure no slide makes an unsourced claim. The format: each entry starts with `- ` followed by a URL or `file:` path, then ` — ` and a brief annotation. Exempt: cover (unless it makes a factual claim), section dividers, end slides, and self-quoting quote layouts.

Sources:
- file:slide-maker/COMPILER_RULES.md — source citation format and rules
- file:slide-maker/COMPILER_RULES.md — war story requirements -->

---
layout: section
transition: iris
---

# Quality Gates

Density guardrails, the acceptance checklist, and the priority stack.

---
transition: slide-left
---

# Density Guardrails

<v-clicks>

- **7 bullets maximum** per slide — split if exceeded
- **8 code lines maximum** per code block — truncate or split
- **60 characters maximum** per bullet — rewrite if exceeded
- **One idea per slide** — if you need to scroll, split it
- **3-5 bullets is normal** — one strong stat beats six weak ones

</v-clicks>

<v-click>

If the slide needs tiny text, the slide needs redesigning.

</v-click>

<!-- Density guardrails prevent the most common slide failure: cramming too much onto one screen. These are hard limits, not suggestions. The overflow guard runs during phase 5 (write slides) and again during validation. Mermaid diagrams have their own limits: 8 nodes for flowcharts, 12 for mindmaps, 6 for timelines.

Sources:
- file:slide-maker/SLIDE_KINDS.md — density guardrails
- file:slide-maker/COMPILER_RULES.md — overflow guard limits -->

---
transition: fade
---

# Acceptance Checklist

A compiled deck passes when:

<v-clicks>

- No generic stock phrases, no ad-hoc transitions
- At least 3 different layout types used
- Bullet lists use `<v-clicks>` for progressive reveal
- At least 1 `v-motion` element, 1 hover-interactive element
- Mermaid nodes: light fills get dark text, dark fills get light text
- No slide overflows (7 bullets, 8 code lines, 60 char bullets)
- Closing echoes or resolves the opening

</v-clicks>

<!-- The full checklist has 30+ items covering structure, animation, color methodology, storytelling, and project-specific requirements. Project decks add: through-line in 3+ slides, 2+ source materials digested, 1+ visual evidence slide, project colors override preset palette. Every factual slide needs a Sources: block.

Sources:
- file:slide-maker/COMPILER_RULES.md — acceptance checklist (full list) -->

---
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

# Rhetorical Principles

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
