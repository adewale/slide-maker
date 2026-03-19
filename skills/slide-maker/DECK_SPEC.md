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
3. `## Source Materials` (project decks only)
4. `## Through-Line` (project decks only)
5. `## Design Tokens`
6. `## Layout System`
7. `## Slides`

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
- progress: segment-bar

## Design Tokens
- colors:
  - bg: "#ffffff"
  - fg: "#111827"
  - accent: "#2563eb"
- typography:
  - display: Plus Jakarta Sans
  - body: DM Sans
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

### Project deck template (with Source Materials and Through-Line)

```md
# Deck Spec

## Meta
- title: What Are Durable Objects For?
- purpose: explain Durable Object patterns through real project examples
- audience: developers building on Cloudflare Workers
- tone: practical, curious, workshop-style
- target-length: 25
- notes: no
- style-preset: cloudflare
- project-url: https://github.com/user/project

## Source Materials
- readme: README.md (project overview — what it does, how to run it)
- architecture: ARCHITECTURE.md (DO pattern — alarm loop, WebSocket broadcast, state sync)
- lessons-learned: LESSONS_LEARNED.md (production surprises — hibernation gotchas, alarm timing)
- screenshots: public/images/ (terminal gameplay, session UI)

## Through-Line
- concept: "What happens when you give a function a name, a memory, and a mailbox?"
- type: question
- appears-in:
  - slide 1: cover — the question is posed
  - slide 9: section — "a function with a name becomes a game server"
  - slide 13: section — "a function with a mailbox becomes a jam session"
  - slide 17: section — "a function with a memory becomes an agent"
  - slide 21: center — all three primitives, three products
  - slide 25: center — the resolution

## Design Tokens
- colors:
  - bg: "#f5f1eb"
  - fg: "#521000"
  - accent: "#ff6633"
- typography:
  - display: Work Sans
  - body: DM Sans
  - mono: IBM Plex Mono
- motion:
  - preset: medium-reveal

## Layout System
- prefer-builtins: true
- builtins:
  - cover
  - section
  - default
  - center
  - statement
  - fact
  - quote
  - two-cols
  - end
- custom-layouts: []
- components: []
- css-files:
  - styles/tokens.css
  - styles/theme.css

## Slides

### Slide 1
- kind: cover
- layout: cover
- title: What Are Durable Objects For?
- subtitle: What happens when you give a function a name, a memory, and a mailbox?

### Slide 5
- kind: war-story
- layout: default
- title: The Alarm That Fired Twice
- body: Hibernation woke the object, but the alarm had already re-triggered — two instances racing on the same state.
- sources:
  - file:LESSONS_LEARNED.md — hibernation double-alarm incident
  - https://github.com/user/project/blob/main/src/alarm.ts — alarm handler with idempotency guard
- notes:
  - This broke production for 4 hours before we added the idempotency check.
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
- `project-url` — URL to the project's repository (triggers source material gathering and project color extraction)

## Source Materials

Project decks only. Lists the documents digested to produce the deck.

Fields (each with a path and parenthetical summary):
- `readme` — project README (factual backbone — what, why, how)
- `changelog` — release history (temporal narrative — what evolved)
- `architecture` — technical architecture doc (structural understanding — how pieces connect)
- `lessons-learned` — post-project reflections (storytelling gold — what surprised, what broke)
- `screenshots` — visual evidence from the running project (proof it works)
- `specs` — feature/API/design specifications (scope boundaries — inclusions and exclusions)
- `research` — research and decision documents (decision archaeology — why X not Y)
- `wrangler` — `wrangler.jsonc` or similar infrastructure config (topology — bindings, services, routes)
- `package` — `package.json` (dependency map, script surface area)
- `config` — CI, build, deploy configuration files (operational posture — how the project ships)

Rules:
- Every field is optional, but the section should contain at least 2 sources.
- Summaries are parenthetical — short enough to scan but specific enough to recall what each source contributed.
- Every source in the Source Materials section should be cited by at least one slide's `sources` field.
- Per-slide `sources` entries must trace back to a document listed in this section (or be a direct URL to the same project).

## Through-Line

Project decks only. The conceptual thread that runs through the deck.

Fields:
- `concept` — the through-line statement (a sentence or phrase)
- `type` — one of: `metaphor` | `question` | `concept` | `provocation` | `design-rule`
- `appears-in` — list of slide numbers with brief descriptions of how the through-line surfaces

Rules:
- The through-line must appear in at least 3 slides, ideally 5-6.
- The first appearance should be on or near the cover. The last should be the resolution.
- Between first and last, each appearance should add new meaning or context.

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
- `image` — path to a screenshot or visual evidence (project decks)
- `alt` — alt text for the image (required when `image` is set)
- `notes`
- `sources` — list of URLs or `file:` repo-relative paths that evidence the slide's claims
- `component`
- `props`

Rules:
- no giant HTML blobs
- use short content blocks
- represent semantics, not implementation noise
- split overloaded slides in the spec before compile
