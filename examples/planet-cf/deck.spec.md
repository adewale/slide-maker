# Deck Spec

## Meta
- title: Planet CF
- purpose: showcase a feed aggregator built on Cloudflare Python Workers, focusing on the JS/Python boundary layer pattern
- audience: developers building on Cloudflare Workers
- tone: precise, calm, confident
- target-length: 12
- notes: yes
- style-preset: cloudflare
- project-url: https://github.com/adewale/planet_cf

## Source Materials
- readme: README.md (features, smart defaults, multi-instance deployment, configuration table)
- architecture: docs/ARCHITECTURE.md (system overview — Workers Python via Pyodide/WASM, D1, Vectorize, Queues, Workers AI, edge cache, performance metrics)
- lessons-learned: docs/LESSONS_LEARNED.md (19 lessons — JsProxy conversion, boundary layers, mock limitations, hybrid search, no filesystem, SSRF, FFI type matrix, E2E testing)

## Through-Line
- concept: "Quarantine the boundary"
- type: design-rule
- appears-in:
  - slide 1: cover — subtitle hints at platform boundary (Python on Workers)
  - slide 4: default — the boundary problem introduced (JsProxy → SafeD1)
  - slide 5: section — through-line named explicitly
  - slide 6: two-cols-header — boundary consequences (mocks miss JsProxy)
  - slide 9: default — another boundary (no filesystem → build-time embedding)
  - slide 11: center — resolution: every lesson traces back to the boundary

## Design Tokens
- colors:
  - bg: "#ffffff"
  - fg: "#1a1a2e"
  - accent: "#f6821f"
  - muted: "rgba(26, 26, 46, 0.45)"
- typography:
  - display: DM Sans
  - body: DM Sans
  - mono: JetBrains Mono
- motion:
  - preset: medium-reveal

## Layout System
- prefer-builtins: true
- builtins:
  - cover
  - statement
  - section
  - default
  - center
  - two-cols-header
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
- subtitle: A feed aggregator built on Cloudflare Python Workers.

### Slide 2
- kind: opening-tension
- layout: statement
- transition: fade
- title: Developer blogs are scattered across thousands of personal sites
- body: The writing exists. Nobody can find it.
- sources:
  - https://github.com/adewale/planet_cf/blob/main/README.md — project purpose

### Slide 3
- kind: architecture
- layout: default
- title: The Cloudflare stack
- body: Mermaid graph — Cron → Queue → Feed Fetcher → D1+FTS5, Vectorize, Workers AI; Web UI → D1 + Vectorize
- motion: v-motion fade-up on diagram
- sources:
  - https://github.com/adewale/planet_cf/blob/main/docs/ARCHITECTURE.md — system overview and data flow
  - https://github.com/adewale/planet_cf/blob/main/README.md — Cloudflare resource setup

### Slide 4
- kind: war-story
- layout: default
- transition: slide-up
- title: The boundary problem
- body: Magic Move — JsProxy TypeError crash → SafeD1 quarantine fix
- sources:
  - https://github.com/adewale/planet_cf/blob/main/docs/LESSONS_LEARNED.md — sections 1-2: JsProxy conversion and boundary layer
  - https://github.com/adewale/planet_cf/blob/main/docs/LESSONS_LEARNED.md — section 17: FFI type-compatibility matrix

### Slide 5
- kind: section-divider
- layout: section
- transition: iris
- title: Quarantine the boundary

### Slide 6
- kind: war-story
- layout: two-cols-header
- transition: wipe-right
- title: What mocks miss
- left: Mock tests — Python dicts, all green
- right: Production — JsProxy objects, 500 errors
- sources:
  - https://github.com/adewale/planet_cf/blob/main/docs/LESSONS_LEARNED.md — section 3: mocks don't catch JsProxy
  - https://github.com/adewale/planet_cf/blob/main/docs/LESSONS_LEARNED.md — section 16: real infrastructure tests

### Slide 7
- kind: code
- layout: default
- title: Hybrid search
- body: Three-tier ranking — exact title (1.0), semantic (cosine), keyword (date)
- sources:
  - https://github.com/adewale/planet_cf/blob/main/docs/LESSONS_LEARNED.md — section 5: hybrid search beats pure semantic
  - https://github.com/adewale/planet_cf/blob/main/docs/LESSONS_LEARNED.md — section 15: exact matches first

### Slide 8
- kind: fact
- layout: fact
- transition: fade
- title: "768"
- subtitle: dimensions per embedding, semantic search under 50ms
- sources:
  - https://github.com/adewale/planet_cf/blob/main/docs/LESSONS_LEARNED.md — section 10: Workers AI model choice
  - https://github.com/adewale/planet_cf/blob/main/docs/ARCHITECTURE.md — Vectorize 768 dimensions, cosine metric

### Slide 9
- kind: code
- layout: default
- transition: zoom-in
- title: Templates without a filesystem
- body: Build-time embedding — no open(), no pathlib, no FileSystemLoader at runtime
- sources:
  - https://github.com/adewale/planet_cf/blob/main/docs/LESSONS_LEARNED.md — section 4: no filesystem in Workers Python
  - https://github.com/adewale/planet_cf/blob/main/README.md — build_templates.py script

### Slide 10
- kind: design-insight
- layout: default
- title: Smart defaults
- body: Settings table with defaults and overrides — auto-init DB, theme fallback, content fallback
- interactive: spotlight-group on table rows
- sources:
  - https://github.com/adewale/planet_cf/blob/main/README.md — Smart Defaults section
  - https://github.com/adewale/planet_cf/blob/main/docs/LESSONS_LEARNED.md — section 8: missing feed dates

### Slide 11
- kind: through-line-resolution
- layout: center
- transition: morph-fade
- title: Every lesson traces back to one principle
- body: Quarantine the boundary. Convert foreign types at the edge. Let the core be pure.
- sources:
  - https://github.com/adewale/planet_cf/blob/main/docs/LESSONS_LEARNED.md — all 19 lessons trace to boundaries
  - https://github.com/adewale/planet_cf/blob/main/docs/ARCHITECTURE.md — boundary layer architecture

### Slide 12
- kind: end
- layout: end
- transition: fade
- title: The best writing is invisible. The best boundaries are too.
