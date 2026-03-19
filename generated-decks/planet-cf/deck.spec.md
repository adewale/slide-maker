# Deck Spec

## Meta
- title: Planet CF
- subtitle: A feed aggregator built on Cloudflare's edge
- purpose: explain Planet CF's architecture, design decisions, and lessons learned building on Cloudflare Python Workers
- audience: developers interested in Cloudflare Workers, Python, or feed aggregation
- tone: practical, curious, workshop-style
- target-length: 7
- notes: yes
- style-preset: cloudflare
- progress: segment-bar
- project-url: https://github.com/adewale/planet_cf

## Source Materials
- readme: README.md (project overview — what it does, setup, public/admin endpoints, smart defaults)
- architecture: docs/ARCHITECTURE.md (system diagram — scheduler, queue consumer, HTTP handler, D1/Vectorize/Workers AI topology)
- lessons-learned: docs/LESSONS_LEARNED.md (21 hard-won lessons — JsProxy boundary, embedded templates, hybrid search, SSRF, stateless sessions, FFI type matrix)
- spec: docs/SPEC.md (historical design document — ingestion pipeline, serving layer, edge caching)
- config: src/config.py (constants and defaults — timeouts, thresholds, retention, search parameters)
- wrappers: src/wrappers.py (boundary layer — SafeD1, SafeVectorize, SafeAI wrappers quarantining JsProxy from Python)

## Through-Line
- concept: "What happens when Python runs inside JavaScript?"
- type: question
- appears-in:
  - slide 1: cover — the question is posed
  - slide 3: section — "every boundary is a type conversion"
  - slide 4: default-content — the boundary layer pattern as the answer
  - slide 5: default-content — the three null-like values as concrete evidence
  - slide 7: end — the resolution: Python and JavaScript can coexist, but only with a disciplined boundary

## Design Tokens
- colors:
  - bg: "#fffbf5"
  - fg: "#521000"
  - accent: "#ff4801"
  - accent-alt: "#e54100"
  - muted: "#7a4a3a"
- typography:
  - display: Inter
  - body: Inter
  - mono: JetBrains Mono
- motion:
  - preset: workshop-ready

## Layout System
- prefer-builtins: true
- builtins:
  - cover
  - section
  - default
  - center
  - fact
  - two-cols
  - end
- custom-layouts: []
- components: []
- css-files:
  - styles/tokens.css
  - styles/theme.css
  - styles/transitions.css

## Slides

### Slide 1
- kind: cover
- layout: cover
- title: Planet CF
- subtitle: What happens when Python runs inside JavaScript?
- notes:
  - Planet CF is a feed aggregator for Cloudflare-adjacent blogs. Built entirely in Python on Cloudflare Workers, where Python runs in WebAssembly inside V8 isolates. The project aggregates RSS/Atom feeds with hourly updates, semantic search via Vectorize, and GitHub OAuth for admin auth.
- sources:
  - file:README.md — project description

### Slide 2
- kind: default-content
- layout: default
- title: Five services, one Worker
- body: Scheduler, queue consumer, HTTP handler, Vectorize index, Workers AI — all in Python, all at the edge.
- notes:
  - The architecture uses a cron-triggered scheduler that enqueues each feed as a separate queue message. Queue consumers fetch, parse, and embed entries. The HTTP handler generates HTML/RSS/Atom on-demand with 1-hour edge caching. Vectorize handles semantic search. Workers AI generates 768-dimension text embeddings via bge-base-en-v1.5 with CLS pooling.
- sources:
  - file:docs/ARCHITECTURE.md — system overview diagram and component descriptions
  - file:src/config.py — timeouts, thresholds, and service defaults

### Slide 3
- kind: section
- layout: section
- title: Every boundary is a type conversion
- notes:
  - This is the core design insight of the project. Python running in Pyodide means every interaction with Cloudflare APIs crosses a type boundary. JsProxy objects look like Python but are not subscriptable or iterable. This section explores how Planet CF handles that fundamental tension.
- sources:
  - file:docs/LESSONS_LEARNED.md — Lesson 1 (JsProxy conversion) and Lesson 2 (boundary layer)

### Slide 4
- kind: default-content
- layout: two-cols
- title: The boundary layer
- left:
  - bullet: JavaScript APIs return JsProxy, not dict
  - bullet: Python None becomes JS undefined, not null
  - bullet: D1 rejects undefined — it needs proper null
- right:
  - bullet: SafeD1, SafeVectorize, SafeAI wrappers
  - bullet: Convert at the edge, once
  - bullet: Business logic sees pure Python types
- notes:
  - The wrappers.py module is the single conversion point. SafeD1Statement.bind() converts Python None to JS null via js.JSON.parse("null"). SafeD1Statement.first() and .all() convert JsProxy results to Python dicts. The core business logic never imports pyodide.ffi or checks for JsProxy — that complexity is quarantined in one file.
- sources:
  - file:src/wrappers.py — SafeD1, SafeVectorize, SafeAI boundary wrappers
  - file:docs/LESSONS_LEARNED.md — Lesson 2 (boundary layer architecture diagram)

### Slide 5
- kind: default-content
- layout: default
- title: Three kinds of nothing
- body: Python None, JavaScript null, JavaScript undefined — and none of them are equal.
- notes:
  - This is the most insidious gotcha. Python None becomes JS undefined (not null). JS null arrives as JsNull (not Python None). JS undefined arrives as JsUndefined (also not Python None). The is None check misses two of three. Planet CF's _is_js_undefined() checks type(x).__name__ for both JsNull and JsUndefined. Every function at the FFI boundary that checks "if x is None" is potentially broken without this guard.
- sources:
  - file:docs/LESSONS_LEARNED.md — Lesson 17 (FFI type matrix) and Lesson 21 (is None is never enough)

### Slide 6
- kind: fact
- layout: fact
- title: 21
- body: Hard-won lessons documented from building on Cloudflare Python Workers. From JsProxy conversion to SSRF protection, embedded templates to hybrid search ranking.
- notes:
  - The LESSONS_LEARNED.md file is 21 entries covering: JsProxy conversion, boundary layers, mock testing gaps, no-filesystem templates, hybrid search, D1 LIKE escaping, SSRF protection, feed date handling, stateless sessions, Workers AI model choice, content sanitization, queue error handling, observability, E2E test cleanup, search ranking, real infrastructure tests, the FFI type matrix, visual fidelity conversion, deterministic E2E tests, two-tier FFI testing, and the "is None is never enough" pattern.
- sources:
  - file:docs/LESSONS_LEARNED.md — all 21 lessons

### Slide 7
- kind: end
- layout: end
- title: Python can live inside JavaScript
- subtitle: But only if you draw the boundary and never cross it casually.
- notes:
  - The resolution of the through-line. The answer to "what happens when Python runs inside JavaScript?" is: it works, but every API call is a type conversion. The boundary layer pattern — thin wrappers that quarantine JS types from Python core — is the key architectural decision. Without it, JsProxy checks leak everywhere and mocks miss production bugs.
- sources:
  - file:docs/LESSONS_LEARNED.md — Lesson 2 (boundary layer) and Lesson 20 (two-tier FFI testing)
