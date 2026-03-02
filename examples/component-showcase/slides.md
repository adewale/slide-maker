---
theme: default
title: Slidev Showcase
colorSchema: dark
fonts:
  sans: Bricolage Grotesque
  serif: DM Sans
  mono: JetBrains Mono
transition: slide-left
layout: cover
---

# Slidev Showcase

Every layout, component, and feature this skill can produce.

<style scoped>
.slidev-layout { background: var(--deck-bg); color: var(--deck-fg); }
h1 { color: var(--deck-fg); }
p { color: var(--deck-muted); }
</style>

<!-- This is a presenter note. It appears in Presenter Mode (press p) but is invisible to the audience. Use these for delivery cues, timing reminders, and talking points. This deck demonstrates presenter notes on key slides. -->

---
layout: section
transition: fade
---

# Built-in Layouts

Slidev ships 19 layouts. These are the ones that matter.

<style scoped>
.slidev-layout { background: var(--deck-bg); color: var(--deck-fg); }
h1 { color: var(--deck-fg); }
p { color: var(--deck-muted); }
</style>

<!-- Pause here. Let the audience read the subtitle. This section covers 10 of the 19 built-in layouts — the ones most useful for project presentations. -->

---
layout: statement
transition: slide-up
---

# The statement layout demands attention

<style scoped>
.slidev-layout { background: var(--deck-bg-warm); color: var(--deck-fg-warm); }
h1 { color: var(--deck-fg-warm); }
</style>

<!-- Statement is the "one big idea" layout. Use it for thesis slides, provocative questions, or moments where you want the audience to sit with a single thought. -->

---
layout: center
transition: fade
---

# The center layout focuses a single idea

Use it for thesis slides, turning points, and transitions between major sections.

<style scoped>
.slidev-layout { background: var(--deck-bg-warm); color: var(--deck-fg-warm); }
h1 { color: var(--deck-fg-warm); }
p { color: var(--deck-muted-warm); }
</style>

---
transition: slide-left
---

# The default layout carries content

<v-clicks>

- Handles bullet lists, numbered lists, and paragraphs
- Supports Mermaid diagrams and code blocks inline
- Pairs with `v-clicks` for progressive reveal
- The workhorse of every deck

</v-clicks>

<style scoped>
.slidev-layout { background: var(--deck-bg); color: var(--deck-fg); }
h1 { color: var(--deck-fg); }
strong { color: var(--deck-accent-alt); }
ul li::marker { color: var(--deck-accent-alt); }
</style>

---
layout: fact
transition: slide-up
---

# 147

Features demonstrated

This showcase covers layouts, animations, diagrams, data components, transitions, and platform features across 46 slides.

<style scoped>
.slidev-layout { background: var(--deck-bg); color: var(--deck-fg); }
h1 { color: var(--deck-accent) !important; }
p:first-of-type { color: var(--deck-muted); }
p:last-of-type { color: var(--deck-fg); }
</style>

---
layout: quote
transition: fade
---

# "Good tools disappear into the workflow"

The best presentation tool is the one you never think about. It just builds what you need.

<style scoped>
.slidev-layout { background: var(--deck-bg); color: var(--deck-fg); }
h1 { color: var(--deck-fg); border-left-color: var(--deck-accent-alt); }
p { color: var(--deck-muted); }
</style>

---
layout: two-cols
transition: slide-left
---

# editorial-dark

<v-clicks>

- Near-black background
- Soft off-white text
- Cool accent tones
- Playfair Display headings
- Low-intensity fade

</v-clicks>

::right::

# bold-modern

<v-clicks>

- Dark saturated background
- High-contrast type
- Bright accent pairs
- Bebas Neue headings
- Medium-intensity reveals

</v-clicks>

<style scoped>
.slidev-layout { background: var(--deck-bg-slate); color: var(--deck-fg-slate); }
h1 { color: var(--deck-fg-slate); font-size: 1.75rem; }
strong { color: var(--deck-accent-slate); }
ul li::marker { color: var(--deck-accent-slate); }
</style>

---
layout: two-cols-header
transition: slide-up
---

# Two columns with a spanning header

::left::

### Inputs

<v-clicks>

- Title, goal, audience
- Tone and target length
- Source material
- Brand constraints

</v-clicks>

::right::

### Outputs

<v-clicks>

- `slides.md`
- `deck.spec.md`
- `styles/tokens.css`
- Layouts when justified

</v-clicks>

<style scoped>
.slidev-layout { background: var(--deck-bg); color: var(--deck-fg); }
h1 { color: var(--deck-fg); }
h3 { color: var(--deck-accent); }
strong { color: var(--deck-accent); }
code { color: var(--deck-accent-alt); background: rgba(167, 139, 250, 0.1); }
</style>

---
layout: intro
transition: fade
---

# The intro layout

An alternative to cover, designed for speaker introductions.

Displays content with a left-aligned, editorial feel.

<style scoped>
.slidev-layout { background: var(--deck-bg); color: var(--deck-fg); }
h1 { color: var(--deck-accent); }
p { color: var(--deck-muted); }
</style>

---
layout: SplitInsight
transition: fade
---

# SplitInsight -- the recurring split

::left::

### Why custom layouts

<v-clicks>

- Recurring structure reduces duplication
- Slot-based API keeps Markdown clean
- Tokens drive all visual decisions
- One layout replaces dozens of inline HTML blocks

</v-clicks>

::right::

### When to escalate

<v-clicks>

- Two-column reasoning appears 3+ times
- Built-in `two-cols` lacks the border treatment
- The left/right split needs independent scroll
- A header must span both columns naturally

</v-clicks>

<style scoped>
.split-insight { background: var(--deck-bg-slate); color: var(--deck-fg-slate); }
h1 { color: var(--deck-fg-slate); }
h3 { color: var(--deck-accent-slate); }
.split-left { border-right-color: var(--deck-accent-slate); }
strong { color: var(--deck-accent-slate); }
</style>

---
layout: section
transition: slide-up
---

# Animations and Interactions

Clicks, markers, motion, and code transforms.

<style scoped>
.slidev-layout { background: var(--deck-bg); color: var(--deck-fg); }
h1 { color: var(--deck-fg); }
p { color: var(--deck-muted); }
</style>

---
transition: slide-left
---

# v-mark annotations <mdi-marker />

<v-mark v-click type="underline" color="#a78bfa">Underline</v-mark> draws attention to key terms.

<v-mark v-click type="circle" color="#fb923c">Circle</v-mark> highlights a single word.

<v-mark v-click type="highlight" color="rgba(167, 139, 250, 0.2)">Highlight</v-mark> works like a marker pen.

<v-mark v-click type="strike-through" color="#ef4444">Strike-through</v-mark> for deletions and corrections.

<v-mark v-click type="box" color="#22c55e">Box</v-mark> frames important content.

<v-mark v-click type="bracket" color="#38bdf8">Bracket</v-mark> groups related text.

<style scoped>
.slidev-layout { background: var(--deck-bg); color: var(--deck-fg); }
h1 { color: var(--deck-fg); }
p { margin-bottom: 1rem; font-size: 1.2rem; }
</style>

---
transition: fade
---

# v-motion: physics-based entrances

<div v-motion :initial="{ x: -80, opacity: 0 }" :enter="{ x: 0, opacity: 1, transition: { delay: 200, duration: 800 } }">

**Slide in** from the left with a spring curve.

</div>

<div v-motion :initial="{ y: 40, opacity: 0, scale: 0.8 }" :enter="{ y: 0, opacity: 1, scale: 1, transition: { delay: 600, duration: 600 } }">

**Scale up** with a bounce effect.

</div>

<div v-motion :initial="{ opacity: 0, rotate: -10 }" :enter="{ opacity: 1, rotate: 0, transition: { delay: 1000, duration: 500 } }">

**Rotate in** for dramatic reveals.

</div>

<style scoped>
.slidev-layout { background: var(--deck-bg); color: var(--deck-fg); }
h1 { color: var(--deck-fg); }
strong { color: var(--deck-accent); }
</style>

---
transition: fade
---

# v-switch: multi-state content

<v-clicks>

### The problem

Users needed a way to create presentations without leaving their code editor.

### The approach

Markdown-first. Vue-powered. Vite-compiled. Zero config.

### The result

14 decks, 6 style presets, unlimited extensibility.

</v-clicks>

Click to reveal each state. Progressive disclosure of a three-part narrative.

<style scoped>
.slidev-layout { background: var(--deck-bg-warm); color: var(--deck-fg-warm); }
h1 { color: var(--deck-fg-warm); }
h3 { color: var(--deck-accent-warm); }
p { color: var(--deck-muted-warm); }
</style>

---
transition: slide-up
---

# Shiki Magic Move

````md magic-move
```ts
// Before: manual slide creation
const slides = document.createElement('div')
slides.innerHTML = '<h1>Title</h1>'
slides.style.background = '#000'
document.body.appendChild(slides)
```

```ts
// After: declarative Markdown
const spec = {
  title: 'My Deck', theme: 'seriph',
  slides: [
    { layout: 'cover', title: 'Hello' },
    { layout: 'default', content: '...' },
  ],
}
```

```ts
// Even better: just write Markdown
// ---
// theme: seriph
// layout: cover
// ---
// # Hello
// Your content here.
```
````

<style scoped>
.slidev-layout { background: var(--deck-bg-slate); color: var(--deck-fg-slate); }
h1 { color: var(--deck-fg-slate); }
</style>

---
transition: slide-left
---

# Syntax highlighting with click steps

```ts {1|2-3|5-7|all}
interface Slide {
  layout: string
  title: string
  // optional fields
  body?: string[]
  mermaid?: string
  transition?: 'fade' | 'slide-left' | 'slide-up'
}
```

Line ranges separated by `|` reveal progressively on click. Line numbers highlight the active range.

<style scoped>
.slidev-layout { background: var(--deck-bg-warm); color: var(--deck-fg-warm); }
h1 { color: var(--deck-fg-warm); }
p { color: var(--deck-muted-warm); }
</style>

---
transition: fade
---

# Iconify: 150,000+ icons inline

<div class="grid grid-cols-4 gap-8 mt-8 text-center">

<div>
  <mdi-language-typescript class="text-5xl text-blue-400" />
  <div class="mt-2 text-sm opacity-60">TypeScript</div>
</div>

<div>
  <mdi-vuejs class="text-5xl text-green-400" />
  <div class="mt-2 text-sm opacity-60">Vue.js</div>
</div>

<div>
  <mdi-language-markdown class="text-5xl text-purple-400" />
  <div class="mt-2 text-sm opacity-60">Markdown</div>
</div>

<div>
  <mdi-palette-outline class="text-5xl text-orange-400" />
  <div class="mt-2 text-sm opacity-60">Theming</div>
</div>

<div>
  <carbon-chart-line class="text-5xl text-cyan-400" />
  <div class="mt-2 text-sm opacity-60">Charts</div>
</div>

<div>
  <mdi-animation-play class="text-5xl text-pink-400" />
  <div class="mt-2 text-sm opacity-60">Animation</div>
</div>

<div>
  <mdi-code-braces class="text-5xl text-yellow-400" />
  <div class="mt-2 text-sm opacity-60">Code</div>
</div>

<div>
  <mdi-presentation class="text-5xl text-red-400" />
  <div class="mt-2 text-sm opacity-60">Present</div>
</div>

</div>

<style scoped>
.slidev-layout { background: var(--deck-bg); color: var(--deck-fg); }
h1 { color: var(--deck-fg); }
</style>

---
transition: fade
---

# Arrow and Transform components

<Arrow x1="100" y1="150" x2="350" y2="150" color="#a78bfa" width="2" />
<Arrow x1="400" y1="150" x2="650" y2="150" color="#fb923c" width="2" />
<Arrow x1="100" y1="250" x2="350" y2="350" color="#22c55e" width="2" />

<div class="absolute top-32 left-24 text-sm opacity-60">Start</div>
<div class="absolute top-32 left-88 text-sm opacity-60">Middle</div>
<div class="absolute top-32 right-40 text-sm opacity-60">End</div>

<Transform :scale="0.75" class="absolute bottom-20 right-10">

This text is scaled to 75% using the Transform component. Useful for fitting dense content or creating visual hierarchy.

</Transform>

<style scoped>
.slidev-layout { background: var(--deck-bg-slate); color: var(--deck-fg-slate); }
h1 { color: var(--deck-fg-slate); }
</style>

---
layout: section
transition: slide-left
---

# Mermaid Diagrams

Flowcharts, timelines, state machines, and more.

<style scoped>
.slidev-layout { background: var(--deck-bg-warm); color: var(--deck-fg-warm); }
h1 { color: var(--deck-fg-warm); }
p { color: var(--deck-muted-warm); }
</style>

---
transition: fade
---

# Flowchart

```mermaid {theme: 'dark', scale: 0.85}
graph TD
  A["User input"] --> B["Parse"] --> C["Tokens"] --> D["Compile"] --> E["Write"] --> F["Validate"]
  classDef warm fill:#f59e0b,stroke:#f59e0b,color:#151008
  classDef mid fill:#b45309,stroke:#b45309,color:#fff
  classDef dark fill:#78350f,stroke:#78350f,color:#fff
  class A,B warm
  class C,D mid
  class E,F dark
```

<style scoped>
.slidev-layout { background: var(--deck-bg-warm); color: var(--deck-fg-warm); }
h1 { color: var(--deck-fg-warm); }
</style>

---
transition: slide-up
---

# Timeline

```mermaid {theme: 'dark', scale: 0.85}
timeline
  title Skill evolution
  Q1 : Core compiler : 3 style presets : 8 example decks
  Q2 : Component library : Data-driven cards : Chart integration
  Q3 : Theme marketplace : Multi-author : Export pipeline
  Q4 : Live collaboration : Version diffing : AI-assisted editing
```

<style scoped>
.slidev-layout { background: var(--deck-bg); color: var(--deck-fg); }
h1 { color: var(--deck-fg); }
</style>

---
layout: section
transition: fade
---

# Data Components <mdi-chart-box-outline />

Six reusable Vue components for metrics, progress, and rankings.

<style scoped>
.slidev-layout { background: var(--deck-bg); color: var(--deck-fg); }
h1 { color: var(--deck-fg); }
p { color: var(--deck-muted); }
</style>

---
transition: slide-left
---

# MetricCard with deltas

<div class="grid grid-cols-4 gap-6 mt-8">
  <MetricCard label="Decks" value="14" delta="+3" direction="up" />
  <MetricCard label="Presets" value="6" delta="+3" direction="up" />
  <MetricCard label="Layouts" value="19" />
  <MetricCard label="Components" value="15" delta="+9" direction="up" />
</div>

<style scoped>
.slidev-layout { background: var(--deck-bg-slate); color: var(--deck-fg-slate); }
h1 { color: var(--deck-fg-slate); }
.metric-card { border-color: var(--deck-accent-slate); }
.metric-card .metric-value { color: var(--deck-accent-slate); }
</style>

---
transition: fade
---

# KPICard in a StatGrid

<StatGrid :cols="3">
  <KPICard label="Geists active" value="57" delta="+8" direction="up" period="this week" />
  <KPICard label="Embeddings" value="12.4k" delta="+2.1k" direction="up" period="this month" />
  <KPICard label="Vault size" value="4.2 GB" delta="+180 MB" direction="up" period="this quarter" />
</StatGrid>

<style scoped>
.slidev-layout { background: var(--deck-bg-warm); color: var(--deck-fg-warm); }
h1 { color: var(--deck-fg-warm); }
.kpi-card { border-color: rgba(245, 158, 11, 0.2); background: rgba(245, 158, 11, 0.04); }
.kpi-value { color: var(--deck-accent-warm) !important; }
</style>

---
transition: slide-left
---

# ProgressBar

<div class="mt-6">
  <ProgressBar label="Wave completion" :value="87" />
  <ProgressBar label="Player 1 shields" :value="62" />
  <ProgressBar label="Player 2 shields" :value="45" />
  <ProgressBar label="Boss health" :value="23" />
</div>

<style scoped>
.slidev-layout { background: var(--deck-bg); color: var(--deck-fg); }
h1 { color: var(--deck-fg); }
.progress-fill { background: var(--deck-accent); }
.progress-value { color: var(--deck-accent); }
.progress-track { background: rgba(167, 139, 250, 0.08); }
</style>

---
transition: slide-up
---

# ComparisonBar

<div class="mt-8">
  <ComparisonBar label="Active players" :left="{ name: 'Piano', value: 340 }" :right="{ name: 'Drums', value: 210 }" />
  <ComparisonBar label="Patterns created" :left="{ name: 'Melodic', value: 1200 }" :right="{ name: 'Rhythmic', value: 890 }" />
  <ComparisonBar label="Session length" :left="{ name: 'Solo', value: 18 }" :right="{ name: 'Collab', value: 42 }" />
</div>

<style scoped>
.slidev-layout { background: var(--deck-bg); color: var(--deck-fg); }
h1 { color: var(--deck-fg); }
.comparison-left { background: var(--deck-accent); }
.comparison-right { background: var(--deck-accent-alt); }
.comparison-label { color: var(--deck-muted); }
</style>

---
transition: fade
---

# RankList

<div class="mt-6">
  <RankList :items="[{ label: 'Hacker News', value: 234 }, { label: 'ArXiv', value: 189 }, { label: 'Lobsters', value: 142 }, { label: 'RSS feeds', value: 98 }, { label: 'Direct saves', value: 67 }]" />
</div>

<style scoped>
.slidev-layout { background: var(--deck-bg-warm); color: var(--deck-fg-warm); }
h1 { color: var(--deck-fg-warm); }
.rank-value { color: var(--deck-accent-alt); }
.rank-fill { background: var(--deck-accent-alt); }
.rank-track { background: rgba(251, 146, 60, 0.08); }
</style>

---
layout: section
transition: slide-left
---

# Code Features <mdi-code-tags />

Syntax highlighting, LaTeX, and code groups.

<style scoped>
.slidev-layout { background: var(--deck-bg-slate); color: var(--deck-fg-slate); }
h1 { color: var(--deck-fg-slate); }
p { color: var(--deck-muted-slate); }
</style>

---
transition: slide-left
---

# LaTeX and math expressions

Inline math: $E = mc^2$

Block equations render with KaTeX:

$$
\sum_{i=1}^{n} \frac{1}{i} = \ln(n) + \gamma + O\left(\frac{1}{n}\right)
$$

$$
\nabla \times \mathbf{E} = -\frac{\partial \mathbf{B}}{\partial t}
$$

<style scoped>
.slidev-layout { background: var(--deck-bg-warm); color: var(--deck-fg-warm); }
h1 { color: var(--deck-fg-warm); }
p { color: var(--deck-muted-warm); }
</style>

---
transition: slide-left
---

# v-click.hide and v-after

<div class="demo-area">
  <div v-click.hide class="state-card before">
    <h3>Before</h3>
    <p>This card is visible initially and <v-mark v-click type="highlight" color="rgba(167, 139, 250, 0.2)">disappears on click</v-mark>.</p>
  </div>

  <div v-after class="state-card after">
    <h3>After</h3>
    <p>This card appears at the <v-mark v-click type="underline" color="#fb923c">same moment</v-mark> using <code>v-after</code>.</p>
  </div>
</div>

<v-click at="2">

`v-click.hide` removes on click. `v-after` reveals with the previous click — no separate step.

</v-click>

<style scoped>
.slidev-layout { background: var(--deck-bg-slate); color: var(--deck-fg-slate); }
h1 { color: var(--deck-fg-slate); }
p { color: var(--deck-muted-slate); }
code { color: var(--deck-accent); background: rgba(167, 139, 250, 0.1); padding: 0.1em 0.3em; border-radius: 3px; font-size: 0.85em; }
.demo-area { display: flex; gap: 2rem; margin-top: 2rem; }
.state-card { flex: 1; padding: 1.5rem; border-radius: 12px; }
.state-card.before { background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); }
.state-card.after { background: rgba(34, 197, 94, 0.1); border: 1px solid rgba(34, 197, 94, 0.3); }
.state-card h3 { font-size: 1.1rem; margin-bottom: 0.5rem; }
.state-card.before h3 { color: var(--deck-accent-alt); }
.state-card.after h3 { color: var(--deck-accent); }
</style>

---
transition: fade
---

# v-drag: draggable elements

<img v-drag="'logo'" src="https://sli.dev/logo.png" class="w-20" alt="Slidev logo">

<div v-drag="'card'" class="bg-violet-500/20 border border-violet-400 rounded-lg p-4 w-60">

**Drag me anywhere**

This card can be repositioned during the presentation using v-drag.

</div>

<v-drag-arrow pos="200,350,400,350" color="#a78bfa" width="2" />

Drag elements and arrows reposition freely during your talk.

<style scoped>
.slidev-layout { background: var(--deck-bg); color: var(--deck-fg); }
h1 { color: var(--deck-fg); }
p { color: var(--deck-muted); }
</style>

---
layout: full
transition: slide-up
---

# The full layout: edge to edge

<div class="h-full flex items-center justify-center">
<div class="text-center">

No padding. No margins. The content fills the entire viewport.

Use `layout: full` for immersive visuals, large diagrams, or full-bleed backgrounds.

<div class="mt-8 grid grid-cols-3 gap-4 text-sm">
  <div class="bg-violet-500/10 border border-violet-400/30 rounded p-4">Panel A</div>
  <div class="bg-orange-500/10 border border-orange-400/30 rounded p-4">Panel B</div>
  <div class="bg-green-500/10 border border-green-400/30 rounded p-4">Panel C</div>
</div>

</div>
</div>

<style scoped>
.slidev-layout { background: var(--deck-bg); color: var(--deck-fg); }
h1 { color: var(--deck-fg); position: absolute; top: 1rem; left: 2rem; }
p { color: var(--deck-muted); }
</style>

---
transition: fade
---

# LightOrDark: theme-aware rendering

<LightOrDark>
  <template #dark>
    <div class="p-6 rounded-lg bg-zinc-800 border border-zinc-700">
      You are viewing the <strong class="text-violet-400">dark</strong> variant. Toggle the color schema to see the other.
    </div>
  </template>
  <template #light>
    <div class="p-6 rounded-lg bg-zinc-100 border border-zinc-300 text-zinc-900">
      You are viewing the <strong class="text-violet-600">light</strong> variant. Toggle the color schema to see the other.
    </div>
  </template>
</LightOrDark>

Adapt content, images, and diagrams to the viewer's preferred color scheme.

<style scoped>
.slidev-layout { background: var(--deck-bg-warm); color: var(--deck-fg-warm); }
h1 { color: var(--deck-fg-warm); }
p { color: var(--deck-muted-warm); margin-top: 1.5rem; }
</style>

---
layout: section
transition: slide-left
---

# Platform Features <mdi-cog-outline />

Table of contents, slide imports, and global layers.

<style scoped>
.slidev-layout { background: var(--deck-bg); color: var(--deck-fg); }
h1 { color: var(--deck-fg); }
p { color: var(--deck-muted); }
</style>

---
transition: fade
---

# Table of Contents

<Toc columns="3" maxDepth="1" mode="onlyCurrentTree" />

The `<Toc>` component auto-generates navigation from slide titles. Props: `columns`, `maxDepth`, `mode`.

<style scoped>
.slidev-layout { background: var(--deck-bg-slate); color: var(--deck-fg-slate); }
h1 { color: var(--deck-fg-slate); }
p { color: var(--deck-muted-slate); margin-top: 1rem; font-size: 0.8rem; }
:deep(.slidev-toc) { font-size: 0.65rem; line-height: 1.4; }
:deep(.slidev-toc a) { color: var(--deck-fg-slate); }
</style>

---
transition: fade
---

# Component API reference

| Component | Props | Description |
|---|---|---|
| `MetricCard` | `label` `value` `delta?` `direction?` | Single metric display |
| `KPICard` | `label` `value` `delta` `direction` `period?` | Full KPI with trend |
| `ProgressBar` | `label` `value` `max?` `suffix?` | Horizontal fill bar |
| `ComparisonBar` | `label` `left` `right` | Segmented comparison |
| `StatGrid` | `cols?` | Auto-grid wrapper (slot) |
| `RankList` | `items` `suffix?` | Ordered bar chart |

<style scoped>
.slidev-layout { background: var(--deck-bg); color: var(--deck-fg); }
h1 { color: var(--deck-fg); }
th { color: var(--deck-accent-alt); border-bottom-color: var(--deck-accent-alt); }
td { color: var(--deck-fg); border-bottom-color: rgba(240, 238, 245, 0.1); }
code { color: var(--deck-accent-alt); background: rgba(251, 146, 60, 0.08); }
p { color: var(--deck-muted); }
</style>

---
layout: section
transition: iris
---

# Cinematic Transitions

Named CSS transitions for slide-level drama.

<style scoped>
.slidev-layout { background: var(--deck-bg); color: var(--deck-fg); }
h1 { color: var(--deck-fg); }
p { color: var(--deck-muted); }
</style>

---
transition: morph-fade
---

# morph-fade

Scale, blur, and opacity combine for a smooth morphing entrance. Set `transition: morph-fade` in slide frontmatter.

<v-clicks>

- Scale from 0.95 with 4px blur
- 0.5s cubic-bezier easing
- Works well between related content slides

</v-clicks>

<style scoped>
.slidev-layout { background: var(--deck-bg); color: var(--deck-fg); }
h1 { color: var(--deck-fg); }
strong { color: var(--deck-accent); }
ul li::marker { color: var(--deck-accent); }
</style>

---
transition: zoom-in
---

# zoom-in

Content scales from 60% to full size with a fade. Ideal for reveals and dramatic moments.

<v-clicks>

- Scale from 0.6 to 1.0
- Combined with opacity fade
- Pairs well with fact or statement layouts

</v-clicks>

<style scoped>
.slidev-layout { background: var(--deck-bg-warm); color: var(--deck-fg-warm); }
h1 { color: var(--deck-fg-warm); }
strong { color: var(--deck-accent-warm); }
ul li::marker { color: var(--deck-accent-warm); }
</style>

---
transition: flip-x
---

# flip-x

A 3D card flip around the Y axis. Adds depth and surprise between contrasting viewpoints.

<v-clicks>

- 90-degree rotateY with perspective
- Backface hidden for clean flip
- Best for before/after comparisons

</v-clicks>

<style scoped>
.slidev-layout { background: var(--deck-bg-slate); color: var(--deck-fg-slate); }
h1 { color: var(--deck-fg-slate); }
strong { color: var(--deck-accent-slate); }
ul li::marker { color: var(--deck-accent-slate); }
</style>

---
layout: section
transition: wipe-right
---

# Animation Components

GlassCard, ShadowStack, ImageFX, and more.

<style scoped>
.slidev-layout { background: var(--deck-bg); color: var(--deck-fg); }
h1 { color: var(--deck-fg); }
p { color: var(--deck-muted); }
</style>

---
transition: glide
---

# GlassCard

<div class="flex gap-6 mt-8">
  <GlassCard :blur="12" :opacity="0.1">
    <h3>Default blur</h3>
    <p>12px blur, 10% white background, border enabled.</p>
  </GlassCard>
  <GlassCard :blur="20" :opacity="0.2" :border="false">
    <h3>Heavy blur</h3>
    <p>20px blur, 20% opacity, no border.</p>
  </GlassCard>
</div>

<style scoped>
.slidev-layout { background: linear-gradient(135deg, var(--deck-bg) 0%, color-mix(in srgb, var(--deck-bg) 70%, var(--deck-accent) 30%) 50%, var(--deck-bg) 100%); color: var(--deck-fg); }
h1 { color: var(--deck-fg); }
h3 { color: var(--deck-accent); font-size: 1rem; margin-bottom: 0.5rem; }
p { color: var(--deck-muted); font-size: 0.85rem; }
</style>

---
transition: blur
---

# ShadowStack presets

<div class="grid grid-cols-3 gap-6 mt-8">
  <ShadowStack preset="subtle">
    <div class="demo-card">subtle</div>
  </ShadowStack>
  <ShadowStack preset="dramatic">
    <div class="demo-card">dramatic</div>
  </ShadowStack>
  <ShadowStack preset="glow">
    <div class="demo-card">glow</div>
  </ShadowStack>
</div>

<style scoped>
.slidev-layout { background: var(--deck-bg); color: var(--deck-fg); }
h1 { color: var(--deck-fg); }
.demo-card {
  background: rgba(167, 139, 250, 0.08);
  border: 1px solid rgba(167, 139, 250, 0.2);
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  font-family: var(--deck-font-mono);
  font-size: 0.9rem;
  color: var(--deck-accent);
}
</style>

---
transition: fade
---

# Keyboard shortcuts: press ?

<div class="help-grid">
  <div class="help-col" v-click>
    <h3>Navigation</h3>
    <div class="shortcut"><kbd>&rarr;</kbd> / <kbd>Space</kbd> <span>Next slide</span></div>
    <div class="shortcut"><kbd>&larr;</kbd> <span>Previous slide</span></div>
    <div class="shortcut"><kbd>&uarr;</kbd> <span>Previous click</span></div>
    <div class="shortcut"><kbd>&darr;</kbd> <span>Next click</span></div>
    <div class="shortcut"><kbd>Home</kbd> <span>First slide</span></div>
  </div>
  <div class="help-col" v-click>
    <h3>View</h3>
    <div class="shortcut"><kbd>o</kbd> <span>Slide overview</span></div>
    <div class="shortcut"><kbd>d</kbd> <span>Toggle dark mode</span></div>
    <div class="shortcut"><kbd>f</kbd> <span>Fullscreen</span></div>
    <div class="shortcut"><kbd>g</kbd> <span>Go to slide</span></div>
    <div class="shortcut"><kbd>Esc</kbd> <span>Close overlays</span></div>
  </div>
  <div class="help-col" v-click>
    <h3>Tools</h3>
    <div class="shortcut"><kbd>p</kbd> <span>Presenter mode</span></div>
    <div class="shortcut"><kbd>?</kbd> <span>This panel</span></div>
    <div class="shortcut"><kbd>e</kbd> <span>Pen / drawing</span></div>
    <div class="shortcut"><kbd>u</kbd> <span>Pen color</span></div>
    <div class="shortcut"><kbd>Del</kbd> <span>Clear drawings</span></div>
  </div>
</div>

<!-- The KeyboardHelp component renders this as a full-screen overlay triggered by pressing ?. Here we show its content inline so the feature is visible without interaction. -->

<style scoped>
.slidev-layout { background: var(--deck-bg-warm); color: var(--deck-fg-warm); }
h1 { color: var(--deck-fg-warm); }
.help-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; margin-top: 1.5rem; }
.help-col h3 {
  font-size: 0.8rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em;
  color: var(--deck-accent-alt); margin-bottom: 0.6rem;
}
.shortcut {
  display: flex; align-items: center; gap: 0.4rem;
  font-size: 0.75rem; color: var(--deck-muted-warm); margin-bottom: 0.35rem;
}
.shortcut span { margin-left: auto; white-space: nowrap; }
kbd {
  display: inline-flex; align-items: center; justify-content: center; min-width: 1.5em;
  padding: 0.1em 0.4em; font-family: var(--deck-font-mono); font-size: 0.75rem;
  background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); border-radius: 4px;
}
</style>

---
layout: end
transition: fade
---

# Every feature. One deck.

13 decks. 6 presets. 46 slides. Every feature.

<style scoped>
.slidev-layout { background: var(--deck-bg); color: var(--deck-fg); }
h1 { color: var(--deck-fg); }
p { color: var(--deck-accent-alt); }
</style>
