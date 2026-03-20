# Deck Spec

## Meta
- title: Tasche
- purpose: present a self-hosted read-it-later service built entirely on Cloudflare's platform
- audience: developers interested in Cloudflare Workers, self-hosted tools, and personal infrastructure
- tone: assertive, specific, technically grounded
- target-length: 7
- notes: yes
- style-preset: bold-modern
- project-url: https://github.com/adewale/tasche
- progress: segment-bar

## Source Materials
- readme: README.md (project overview -- what it does, deploy flow, architecture table, cost)
- changelog: CHANGELOG.md (release history -- v0.1 through unreleased, feature evolution)
- architecture: docs/architecture.md (runtime constraints, Pyodide/V8 isolate details, FFI boundary)
- lessons-learned: LESSONS_LEARNED.md (implement-audit loop, 909 tests, FFI patterns, bookmarklet CORS story)
- specs: specs/tasche-spec.md (product specification -- deployment model, core promise, archival pipeline)
- design-language: DESIGN_LANGUAGE.md (monochrome pen-and-ink aesthetic, stroke weight hierarchy)

## Through-Line
- concept: "Your reading list should not be someone else's business model"
- type: provocation
- appears-in:
  - slide 1: cover -- the provocation is implicit in the subtitle (self-hosted)
  - slide 2: default -- "what is this" explains the ownership model
  - slide 4: section -- "every byte lives in your account" makes it architectural
  - slide 5: center -- the surprising constraint (Python inside JavaScript) exists because of ownership
  - slide 7: end -- resolution: the articles survive because you own the infrastructure

## Design Tokens
- colors:
  - bg: "#0a0a0f"
  - fg: "#f0f0f5"
  - accent: "#1d1d1f"
  - accent-alt: "#e8e8ed"
  - muted: "rgba(240, 240, 245, 0.45)"
- typography:
  - display: Bebas Neue
  - body: DM Sans
  - mono: JetBrains Mono
- motion:
  - preset: medium-reveal

## Layout System
- prefer-builtins: true
- builtins:
  - cover
  - default
  - section
  - center
  - fact
  - end
- custom-layouts: []
- components:
  - ProgressSegmentBar
  - KeyboardHelp
- css-files:
  - styles/index.css
  - styles/tokens.css
  - styles/theme.css
  - styles/transitions.css

## Slides

### Slide 1
- kind: cover
- layout: cover
- title: Tasche
- subtitle: A self-hosted read-it-later service built on Cloudflare Python Workers
- notes:
  - "Tasche" is German for "pocket." Let the subtitle land. The audience should understand what this is before you explain why it exists.

### Slide 2
- kind: default-content
- layout: default
- title: Your reading list should not be someone else's business model
- body: Near-verbatim README description plus core feature bullets
- notes:
  - This slide explains what Tasche IS and WHY it exists. The title is the through-line provocation. Pause after "self-hosted" -- that is the differentiator.
- sources:
  - https://github.com/adewale/tasche/blob/main/README.md -- feature list and project description

### Slide 3
- kind: fact
- layout: fact
- title: 6 Cloudflare services. 1 worker. $5/month.
- body: Python Workers + D1 + R2 + KV + Queues + Workers AI. No external dependencies.
- notes:
  - The $5/month is the Workers Paid plan as of early 2026. Free tier covers light use at 100K requests/day. The point is zero hidden costs.
- sources:
  - https://github.com/adewale/tasche/blob/main/README.md -- cost section and architecture table

### Slide 4
- kind: section
- layout: section
- title: Every byte lives in your account
- notes:
  - Through-line surfacing as an architectural claim. D1 stores articles. R2 stores archived HTML, images, and audio. KV stores sessions. Nothing leaves your Cloudflare account.

### Slide 5
- kind: center-statement
- layout: center
- title: Python running inside JavaScript, not alongside it
- body: Pyodide compiles CPython to WebAssembly inside V8 isolates. No threads. No C extensions. No eval(). Every constraint exists because the runtime is serverless.
- notes:
  - This is the surprising element. Most people assume Python Workers means a Python container. It is actually Python compiled to Wasm running inside a JS runtime. This is why python-readability broke (uses js.eval()), why all handlers must be async, and why the FFI boundary layer exists.
- sources:
  - https://github.com/adewale/tasche/blob/main/docs/architecture.md -- Pyodide runtime constraints
  - https://github.com/adewale/tasche/blob/main/LESSONS_LEARNED.md -- FFI boundary layer pattern

### Slide 6
- kind: default-content
- layout: default
- title: Save URL to reading it back -- in 14 steps
- body: Mermaid diagram showing the processing pipeline from URL submission through queue processing to archived content
- notes:
  - The 14-step pipeline: fetch, redirect resolution, readability extraction, image download + WebP conversion, HTML/Markdown storage to R2, FTS5 indexing. All async via Cloudflare Queues.
- sources:
  - https://github.com/adewale/tasche/blob/main/specs/tasche-spec.md -- archival pipeline specification
  - https://github.com/adewale/tasche/blob/main/LESSONS_LEARNED.md -- processing pipeline audit

### Slide 7
- kind: end
- layout: end
- title: The articles survive because you own the infrastructure
- subtitle: Your pocket. Your rules.
- notes:
  - Echo the through-line. The original might get paywalled, deleted, or the domain might expire. Does not matter -- you have your copy. That is the entire point.
