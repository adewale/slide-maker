# Deck Spec

## Meta
- title: Planet CF
- purpose: introduce Planet CF as a feed aggregator built entirely in Python on Cloudflare Workers, highlighting the architectural decisions and hard-won lessons from running Python inside V8
- audience: developers interested in Cloudflare Workers, Python, or feed aggregation
- tone: practical, curious, workshop-style
- target-length: 7
- notes: yes
- style-preset: cloudflare
- project-url: https://github.com/adewale/planet_cf
- progress: segment-bar

## Source Materials
- readme: README.md (project overview — what it does, features, quick start, architecture summary)
- architecture: docs/ARCHITECTURE.md (system topology — Worker entrypoints, D1, Queues, Vectorize, cron scheduler, edge caching)
- lessons-learned: docs/LESSONS_LEARNED.md (21 hard-won lessons — JsProxy conversion, boundary layers, embedded templates, hybrid search, FFI type matrix)
- config: wrangler.jsonc (Cloudflare bindings — D1, Vectorize, Queues, Workers AI, cron triggers)

## Through-Line
- concept: "Every boundary is a type conversion"
- type: concept
- appears-in:
  - slide 2: default — introduced as the central insight after explaining what Planet CF is
  - slide 4: section — "When Python lives inside V8, every API call crosses a world"
  - slide 5: default — the boundary layer pattern that quarantines JS types from Python core
  - slide 6: default — hybrid search as a boundary between semantic and keyword worlds
  - slide 7: end — resolution: the boundaries that constrain you become the architecture

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
- components: []
- css-files:
  - styles/tokens.css
  - styles/theme.css

## Slides

### Slide 1
- kind: cover
- layout: cover
- title: Planet CF
- subtitle: A feed aggregator built on Cloudflare's Python Workers platform
- notes:
  - Planet CF aggregates RSS/Atom feeds from Cloudflare-adjacent blogs, serving www.planetcloudflare.dev. It runs entirely in Python on Cloudflare Workers via Pyodide (Python in WebAssembly inside V8 isolates). The project uses D1, Queues, Vectorize, and Workers AI.

### Slide 2
- kind: default-content
- layout: default
- title: Five services, one Python Worker
- body: Planet CF is a feed aggregator built on Cloudflare's Python Workers platform. It aggregates RSS/Atom feeds with hourly updates, offers semantic search via Vectorize and Workers AI, uses GitHub OAuth for admin authentication, and generates HTML/RSS/Atom/OPML on demand with edge caching. The central design insight: every boundary between Python and JavaScript is a type conversion.
- sources:
  - https://github.com/adewale/planet_cf/blob/main/README.md — project description, feature list, architecture summary

### Slide 3
- kind: fact
- layout: fact
- title: 768
- body: Dimensions in the Vectorize semantic search index. Workers AI generates embeddings with bge-base-en-v1.5 using CLS pooling — not mean pooling, because CLS is better for search.
- sources:
  - https://github.com/adewale/planet_cf/blob/main/docs/LESSONS_LEARNED.md — lesson 10: embedding model choice
  - https://github.com/adewale/planet_cf/blob/main/README.md — search defaults table

### Slide 4
- kind: section
- layout: section
- title: Every boundary is a type conversion
- subtitle: When Python lives inside V8, every API call crosses a world.
- notes:
  - This is the central architectural insight. Pyodide returns JsProxy objects when interacting with JavaScript APIs. These look like Python objects but are not subscriptable or iterable. JsNull is not Python None. JsUndefined is not Python None. The TypeError for JsProxy was one of the first production failures.

### Slide 5
- kind: default-content
- layout: default
- title: The boundary layer that saved us
- body: JsProxy objects look like Python but are not subscriptable. JsNull is not None. The solution is a thin boundary layer — SafeD1, SafeVectorize, SafeAI — that converts all JS types to Python immediately. Business logic stays pure Python. One conversion point, not dozens.
- sources:
  - https://github.com/adewale/planet_cf/blob/main/docs/LESSONS_LEARNED.md — lessons 1, 2, 17: JsProxy, boundary layer, FFI type matrix

### Slide 6
- kind: default-content
- layout: default
- title: Hybrid search beats pure semantic
- body: Searching "context" missed articles containing the word "context" because semantic similarity does not guarantee keyword overlap. The fix was three-tier ranking — exact title matches first, semantic results by score second, keyword-only matches by date third. Two search worlds, one boundary.
- sources:
  - https://github.com/adewale/planet_cf/blob/main/docs/LESSONS_LEARNED.md — lessons 5, 15: hybrid search and exact-match ranking

### Slide 7
- kind: end
- layout: end
- title: The boundaries that constrain you become the architecture
- subtitle: github.com/adewale/planet_cf
