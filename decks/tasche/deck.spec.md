# Deck Spec

## Meta
- title: Tasche
- purpose: showcase a read-later service that archives articles permanently on Cloudflare Workers Python
- audience: developers building on Cloudflare Workers
- tone: precise, calm, determined
- target-length: 12
- notes: yes
- style-preset: editorial-dark
- project-url: https://github.com/adewale/tasche

## Source Materials
- readme: README.md (features, deploy model, architecture table, cost, data flow summary)
- changelog: CHANGELOG.md (bookmarklet pivot from cross-origin fetch to popup, browser extension removal, Readability Service Binding, Preact rewrite, security fixes)
- lessons-learned: LESSONS_LEARNED.md (90 lessons — FFI boundary layer, bookmarklet SameSite pivot, runtime gap, lxml unavailability, Pyodide cold start, implement-audit loop stats, TTS WAV/MP3 discovery, service worker caching patterns)
- specs: specs/tasche-spec.md (core promise "your articles survive", what gets archived table, content storage philosophy, processing pipeline, TTS idempotency)

## Through-Line
- concept: "Your articles survive"
- type: design-rule
- appears-in:
  - slide 1: cover — subtitle hints at the survival promise
  - slide 3: default — the archive promise: what gets saved per article
  - slide 5: section — through-line named explicitly
  - slide 6: default — anatomy of a saved article shows the survival mechanism
  - slide 11: center — resolution: your articles survive because every format is portable

## Design Tokens
- colors:
  - bg: "#12100e"
  - fg: "#f5f0eb"
  - accent: "#fb923c"
  - muted: "rgba(245, 240, 235, 0.5)"
- typography:
  - display: Playfair Display
  - body: Source Sans 3
  - mono: JetBrains Mono
- motion:
  - preset: restrained-fade

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
- title: Tasche
- subtitle: A read-later service where your articles survive.

### Slide 2
- kind: opening-tension
- layout: statement
- transition: fade
- title: Read-later services own your data. What happens when they shut down?
- sources:
  - https://github.com/adewale/tasche/blob/main/specs/tasche-spec.md — section 1.1: "Your Articles Survive" core promise

### Slide 3
- kind: archive-promise
- layout: default
- transition: slide-left
- title: The archive promise
- body: What gets saved per article — original HTML, markdown, images as WebP, thumbnail from og:image, three deduplicated URLs, optional TTS audio
- sources:
  - https://github.com/adewale/tasche/blob/main/specs/tasche-spec.md — section 1.2: "What Gets Archived" table
  - https://github.com/adewale/tasche/blob/main/README.md — data flow description

### Slide 4
- kind: war-story
- layout: default
- transition: slide-up
- title: The FFI boundary
- body: Magic Move — three FFI failures (bytes→PyProxy for R2, None→undefined for D1, dict→Map for Queues) and centralized Safe* wrapper fix
- sources:
  - https://github.com/adewale/tasche/blob/main/LESSONS_LEARNED.md — lesson 29: Python bytes cannot cross FFI boundary to R2
  - https://github.com/adewale/tasche/blob/main/LESSONS_LEARNED.md — lesson 30: FFI boundary is bidirectional

### Slide 5
- kind: section-divider
- layout: section
- transition: iris
- title: Your articles survive

### Slide 6
- kind: anatomy
- layout: default
- transition: slide-left
- title: Anatomy of a saved article
- body: 14-step pipeline — fetch, redirect resolution, Readability extraction via JS Worker, image download and WebP conversion, dual-format storage, FTS5 indexing
- sources:
  - https://github.com/adewale/tasche/blob/main/specs/tasche-spec.md — section 1.2: archived assets table
  - https://github.com/adewale/tasche/blob/main/README.md — data flow description
  - https://github.com/adewale/tasche/blob/main/LESSONS_LEARNED.md — lesson 32: Readability Service Binding solution

### Slide 7
- kind: process
- layout: two-cols-header
- transition: wipe-right
- title: Implement then Audit
- left: Implementation phases — foundation, auth, CRUD, pipeline, search, TTS, frontend, observability, hardening
- right: Audit results — 17 iterations, 909 tests, phases 8-9 passed first attempt
- sources:
  - https://github.com/adewale/tasche/blob/main/LESSONS_LEARNED.md — Implement-Audit Loop Summary and Final Stats

### Slide 8
- kind: war-story
- layout: default
- transition: slide-up
- title: The bookmarklet pivot
- body: Cross-origin fetch with SameSite=Lax cookies fails silently. Fix: window.open() popup with same-origin request.
- sources:
  - https://github.com/adewale/tasche/blob/main/LESSONS_LEARNED.md — lessons 17-18: SameSite cookies and fix-the-pattern-not-the-policy
  - https://github.com/adewale/tasche/blob/main/CHANGELOG.md — bookmarklet rewritten entry

### Slide 9
- kind: architecture
- layout: default
- transition: slide-left
- title: The Cloudflare stack
- body: Mermaid diagram — PWA to Python Worker to D1, R2, KV, Queues, JS Worker (Readability), Workers AI
- sources:
  - https://github.com/adewale/tasche/blob/main/README.md — architecture table
  - https://github.com/adewale/tasche/blob/main/LESSONS_LEARNED.md — lesson 32: Service Binding to JS Worker

### Slide 10
- kind: fact
- layout: fact
- transition: fade
- title: "$5/month"
- subtitle: Workers Paid plan. Your own D1, R2, KV, Queues, AI. Zero vendor lock-in.
- sources:
  - https://github.com/adewale/tasche/blob/main/README.md — Cost section

### Slide 11
- kind: through-line-resolution
- layout: center
- transition: morph-fade
- title: Your articles survive because every format is portable
- body: D1 exports as SQLite. R2 speaks S3. The archive outlasts the platform.
- sources:
  - https://github.com/adewale/tasche/blob/main/specs/tasche-spec.md — section 1.1: core promise
  - https://github.com/adewale/tasche/blob/main/README.md — architecture and data portability

### Slide 12
- kind: end
- layout: end
- transition: fade
- title: The original got paywalled. The domain expired. Doesn't matter -- you saved it.
