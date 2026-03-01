# deck.spec.md specification

`deck.spec.md` is the planning schema for a Slidev deck project.
It is not the final presentation.

## Purpose

Use it to capture:
- deck intent
- visual system
- slide inventory
- layout and component boundaries
- notes policy

It must be human-readable and deterministic enough to compile.

## Required section order

1. `# Deck Spec`
2. `## Meta`
3. `## Design Tokens`
4. `## Layout System`
5. `## Slides`

Optional:
- `## Notes Policy`
- `## Asset Policy`
- `## Update History`

## Canonical template

```md
# Deck Spec

## Meta
- title: Example Deck
- purpose: executive update
- audience: leadership
- tone: sharp, concise, credible
- target-length: 10
- notes: yes
- style-preset: swiss-minimal

## Design Tokens
- colors:
  - bg: "#ffffff"
  - fg: "#111827"
  - accent: "#2563eb"
- typography:
  - display: Inter Tight
  - body: Inter
- motion:
  - preset: restrained-fade

## Layout System
- prefer-builtins: true
- builtins:
  - cover
  - section
  - default
  - center
  - fact
  - end
- custom-layouts:
  - SplitInsight
- components:
  - MetricCard
- css-files:
  - styles/tokens.css
  - styles/theme.css

## Slides

### Slide 1
- kind: cover
- layout: cover
- title: Example Deck
- subtitle: Focus, speed, leverage
- notes:
  - Open with the decision we already made.

### Slide 2
- kind: split-insight
- layout: SplitInsight
- title: Why now
- left:
  - bullet: Lower operating cost
  - bullet: Faster feedback loops
- right:
  - stat:
      label: Cycle time
      value: "-38%"
```

## Meta

Required fields:
- `title`
- `purpose`
- `audience`
- `tone`
- `target-length`
- `style-preset`

Optional:
- `subtitle`
- `author`
- `date`
- `notes`
- `aspect-ratio`
- `brand`

## Design Tokens

Recommended groups:
- `colors`
- `typography`
- `spacing`
- `radius`
- `shadow`
- `motion`

Rules:
- keep token names semantic
- keep token count low
- avoid slide-specific tokens

## Layout System

Fields:
- `prefer-builtins`
- `builtins`
- `custom-layouts`
- `components`
- `css-files`

Rules:
- every listed custom layout must be used
- every listed component must be justified
- keep the inventory small

## Slides

Each slide is a `### Slide N` block.

Required per slide:
- `kind`
- `layout`
- `title` or equivalent primary anchor

Optional:
- `subtitle`
- `body`
- `left`
- `right`
- `media`
- `notes`
- `component`
- `props`

Rules:
- no giant HTML blobs
- use short content blocks
- represent semantics, not implementation noise
- split overloaded slides in the spec before compile
