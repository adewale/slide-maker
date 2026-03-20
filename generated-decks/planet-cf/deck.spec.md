# Deck Spec

## Meta
- title: Planet CF
- purpose: present a feed aggregator that runs Python inside JavaScript on Cloudflare's edge
- audience: developers interested in Cloudflare Workers, Python, and feed aggregation
- tone: warm, practical, curious
- target-length: 7
- notes: yes
- style-preset: cloudflare
- project-url: https://github.com/adewale/planet_cf
- progress: segment-bar

## Source Materials
- readme: README.md (project overview -- features, quick start, multi-instance deployment, architecture summary)
- architecture: docs/ARCHITECTURE.md (system topology -- D1, Queues, Vectorize, edge cache, request flows)
- lessons-learned: docs/LESSONS_LEARNED.md (21 hard-won insights -- JsProxy traps, FFI boundary layers, template embedding, hybrid search)
- config: wrangler.jsonc (infrastructure bindings -- D1, Vectorize, Queues, Workers AI, cron triggers)
- code: src/config.py (smart defaults -- 20+ configuration values with sensible fallbacks)

## Through-Line
- concept: "Python inside JavaScript -- and the boundaries that make it work"
- type: concept
- appears-in:
  - slide 2: default -- introduces the concept: Python running in V8 via Pyodide/WASM
  - slide 4: section -- "boundaries that make it work" -- the FFI boundary layer pattern
  - slide 5: default -- the surprise: `None` is not enough at the FFI boundary
  - slide 7: end -- resolution: boundaries create reliability

## Design Tokens
- colors:
  - bg: "#f5f1eb"
  - fg: "#521000"
  - accent: "#ff6633"
  - accent-alt: "#b45309"
  - muted: "rgba(82, 16, 0, 0.6)"
  - surface: "#fffbf5"
  - border: "#ebd5c1"
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
  - fact
  - end
- custom-layouts: []
- components:
  - ProgressSegmentBar
- css-files:
  - styles/tokens.css
  - styles/theme.css

## Slides

### Slide 1
- kind: cover
- layout: cover
- title: Planet CF
- subtitle: A feed aggregator built on Cloudflare's Python Workers platform

### Slide 2
- kind: default-content
- layout: default
- title: What Is Planet CF?
- body: RSS/Atom aggregator that runs Python inside V8 isolates via Pyodide/WASM on Cloudflare's edge network. Single worker handles cron scheduling, queue consumption, HTTP serving, and admin UI.
- sources:
  - https://github.com/adewale/planet_cf/blob/main/README.md -- project overview
  - file:docs/ARCHITECTURE.md -- system topology

### Slide 3
- kind: default-content
- layout: default
- title: The Full Cloudflare Stack
- body: Architecture diagram showing D1, Queues, Vectorize, Workers AI, and static assets all orchestrated from a single Python worker.
- sources:
  - file:docs/ARCHITECTURE.md -- binding topology and data flow

### Slide 4
- kind: section
- layout: section
- title: Boundaries That Make It Work

### Slide 5
- kind: default-content
- layout: default
- title: None Is Not None
- body: JavaScript null arrives as JsNull, not Python None. Three null-like values cross the FFI boundary -- and `is None` catches only one. The fix is a boundary function that checks type(x).__name__.
- sources:
  - file:docs/LESSONS_LEARNED.md -- lesson 21, JsNull trap
  - file:docs/LESSONS_LEARNED.md -- lesson 17, FFI type-compatibility matrix

### Slide 6
- kind: fact
- layout: fact
- title: 21
- body: Hard-won lessons documented. Each traced to a specific production incident.
- sources:
  - file:docs/LESSONS_LEARNED.md -- full lessons catalog
  - file:src/config.py -- smart defaults

### Slide 7
- kind: end
- layout: end
- title: Boundaries Create Reliability
- subtitle: Planet CF -- Python inside JavaScript, made safe by a thin conversion layer
