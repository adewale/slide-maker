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
  ROOT --> TD2["tufte-data"]
  ROOT --> CF["cloudflare"]
  ROOT --> MD["material-design"]
  classDef hub fill:#22d3ee,stroke:#22d3ee,color:#0c0e14
  classDef leaf fill:#0d3b4a,stroke:#22d3ee,color:#e4e8ef
  class ROOT hub
  class ED,SM,BM,TD2,CF,MD leaf
```

Six presets, each controlling typography, color, motion, and layout tendencies.

<!-- Graph TD (top-down) works well for hierarchies and taxonomies. The double-parenthesis syntax creates a circle node. Square brackets create rectangles. Every node must have an explicit classDef.

Sources:
- file:slide-maker/STYLE_PRESETS.md — seven preset definitions -->

---
transition: slide-left
---

# Sequence Diagrams Reveal Hidden Round-Trips

```mermaid {scale: 0.8}
graph LR
  U["User"] -->|"brief"| S["Skill Agent"]
  S -->|"spec"| P["Spec Builder"]
  P -->|"ground"| P
  P -->|"grounded"| S
  S -->|"compile"| C["Compiler"]
  C -->|"resolve"| C
  C -->|"render"| D["Slide Deck"]
  D -.->|"preview"| U
  style U fill:#0f1a2e,stroke:#22d3ee,color:#22d3ee
  style S fill:#22d3ee,stroke:#22d3ee,color:#0c0e14
  style P fill:#0f1a2e,stroke:#22d3ee,color:#22d3ee
  style C fill:#0f1a2e,stroke:#22d3ee,color:#22d3ee
  style D fill:#22d3ee,stroke:#22d3ee,color:#0c0e14
  linkStyle default stroke:#22d3ee,stroke-width:2px
```

Five actors, but the surprise is the self-loops: the Spec Builder re-enters itself for source-grounding, and the Compiler loops for layout resolution, before handing off.

<!-- sequenceDiagram is ideal for showing request/response flows, API call chains, and multi-actor protocols. Participants are declared with `participant` aliases. Solid arrows (->>)  are calls; dashed arrows (-->>)  are returns. Keep to 6-8 interactions to avoid vertical overflow. Beautiful Mermaid themes the diagram automatically from deck tokens.

Also supported but less frequently used in presentations: classDiagram (class hierarchies), erDiagram (entity-relationship models), and xychart-beta (bar/line charts). Use those when the content demands them.

Sources:
- file:slide-maker/COMPILER_RULES.md — Mermaid guidelines: supported diagram types
- file:slide-maker/COMPILER_RULES.md — diagram insight annotations required -->

---
transition: flip-y
---

# Slides Have a Lifecycle Most Presenters Ignore

```mermaid {scale: 0.85}
graph LR
  S(("Start")) --> Draft
  Draft -->|"compile"| Compiled
  Compiled -->|"lint + contrast"| Validated
  Validated -->|"approve"| Delivered
  Validated -->|"lint fail"| Draft
  Delivered -->|"revise"| Draft
  Delivered --> E(("End"))
  style S fill:#22d3ee,stroke:#22d3ee,color:#0c0e14
  style E fill:#22d3ee,stroke:#22d3ee,color:#0c0e14
  style Draft fill:#0f1a2e,stroke:#22d3ee,color:#22d3ee
  style Compiled fill:#0f1a2e,stroke:#22d3ee,color:#22d3ee
  style Validated fill:#0f1a2e,stroke:#22d3ee,color:#22d3ee
  style Delivered fill:#22d3ee,stroke:#22d3ee,color:#0c0e14
  linkStyle default stroke:#22d3ee,stroke-width:2px
```

The backward edges matter most: validation failures return to Draft, not to Compiled, because structural fixes require a full recompile.

<!-- stateDiagram-v2 is the right choice for lifecycle, workflow, and finite-state-machine diagrams. The [*] symbol marks start and end states. Backward transitions (Validated --> Draft) highlight recovery paths that audiences often overlook. Keep to 4-6 states to stay readable at presentation scale.

Also supported but less common in slide contexts: classDiagram, erDiagram, and xychart-beta — reach for them when your content is specifically about class hierarchies, data models, or charted metrics.

Sources:
- file:slide-maker/COMPILER_RULES.md — Mermaid guidelines: supported diagram types
- file:slide-maker/COMPILER_RULES.md — diagram insight annotations required -->
