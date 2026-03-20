# Deck Spec

## Meta
- title: Tasche
- purpose: introduce Tasche as a self-hosted read-it-later service and explain its architecture, design philosophy, and the lessons learned building it on Cloudflare Python Workers
- audience: developers interested in self-hosted tools and Cloudflare Workers
- tone: assertive, specific, builder-oriented
- target-length: 7
- notes: yes
- style-preset: bold-modern
- project-url: https://github.com/adewale/tasche
- progress: segment-bar

## Source Materials
- readme: README.md (project overview -- what it is, features, architecture table, deploy flow, cost)
- changelog: CHANGELOG.md (version history -- v0.1.0 initial release through v0.3.0 and unreleased bookmarklet rewrite)
- lessons-learned: LESSONS_LEARNED.md (9-phase implement-audit loop, 17 edge cases hardened, FFI boundary layer pattern, FTS5 injection discovery)
- design-language: DESIGN_LANGUAGE.md (monochrome pen-and-ink aesthetic, four design ideas, stroke weight hierarchy, typography does the work of colour)
- wrangler: wrangler.jsonc (6 Cloudflare bindings -- D1, R2, KV, Queues, AI, Service Binding)

## Through-Line
- concept: "What happens when you trust no one with your reading list?"
- type: question
- appears-in:
  - slide 1: cover -- the question is implied by the project description
  - slide 2: default -- Tasche exists because your reading data should stay in your account
  - slide 4: section -- the architecture ensures every byte lives in your Cloudflare account
  - slide 5: default -- the processing pipeline runs entirely on your infrastructure
  - slide 6: default -- the war story shows how self-hosting forces you to confront real engineering
  - slide 7: end -- the resolution answers the question

## Design Tokens
- colors:
  - bg: "#0a0a0f"
  - fg: "#f0f0f5"
  - accent: "#1d1d1f"
  - accent-alt: "#f0f0f5"
  - muted: "#6e6e73"
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
  - two-cols
  - end
- custom-layouts: []
- components: []
- css-files:
  - styles/tokens.css
  - styles/theme.css

## Notes Policy
- every content slide gets delivery-oriented notes with source citations

## Slides

### Slide 1
- kind: cover
- layout: cover
- title: Tasche
- subtitle: A self-hosted read-it-later service built on Cloudflare Python Workers
- notes:
  - "Tasche" is German for "pocket." The name signals the tool's intent -- a personal, portable knowledge store. Open with the name, let the subtitle do the explaining.

### Slide 2
- kind: default-content
- layout: default
- title: Your reading list should not be someone else's business model
- body:
  - A self-hosted read-it-later service built on Cloudflare Python Workers. Save articles, read them offline, and listen to them as audio -- all running in your own Cloudflare account.
  - bullet: Save articles by URL with automatic content extraction and archival
  - bullet: Full-text search across your entire library via FTS5
  - bullet: Listen Later -- generate audio versions of articles via Workers AI TTS
  - bullet: Offline reading -- PWA with service worker caching
  - bullet: Self-hosted -- your data stays in your Cloudflare account
- sources:
  - https://github.com/adewale/tasche/blob/main/README.md -- project description and feature list

### Slide 3
- kind: fact
- layout: fact
- title: 6 Cloudflare services. 1 worker. $5/month.
- body: Python Workers + D1 + R2 + KV + Queues + Workers AI -- no external dependencies, no egress fees, no vendor lock beyond Cloudflare itself.
- sources:
  - https://github.com/adewale/tasche/blob/main/README.md -- architecture table and cost section
  - https://github.com/adewale/tasche/blob/main/wrangler.jsonc -- 6 bindings in one config file

### Slide 4
- kind: section
- layout: section
- title: Every byte lives in your account
- notes:
  - This is the through-line surfacing as an architectural claim. The audience should feel the weight of "self-hosted" -- it is not marketing, it is a topology decision.

### Slide 5
- kind: default-content
- layout: two-cols
- title: The 14-step pipeline
- left:
  - bullet: Save URL -- API creates article (pending)
  - bullet: Queue consumer fetches the page
  - bullet: Readability extracts content
  - bullet: Images converted to WebP
- right:
  - bullet: HTML + Markdown stored in R2
  - bullet: FTS5 indexed in D1
  - bullet: TTS audio generated on demand
- sources:
  - https://github.com/adewale/tasche/blob/main/README.md -- data flow description
  - https://github.com/adewale/tasche/blob/main/LESSONS_LEARNED.md -- Phase 4 content processing pipeline

### Slide 6
- kind: default-content
- layout: default
- title: FTS5 accepts operators inside your query parameter
- body:
  - Parameterized queries prevent SQL injection. But FTS5's MATCH clause accepts its own operators -- OR, NOT, NEAR, wildcards. Unsanitized user input is query injection inside the parameter value.
  - bullet: Every search word must be quoted as a literal
  - bullet: FTS5 operators stripped before query execution
  - bullet: Discovered during Phase 9 edge-case hardening -- 17 issues fixed in one pass
- sources:
  - https://github.com/adewale/tasche/blob/main/LESSONS_LEARNED.md -- Pattern 11: FTS5 Is Its Own Query Language, Phase 9 edge case hardening

### Slide 7
- kind: end
- layout: end
- title: Your pocket. Your rules.
- subtitle: What happens when you trust no one with your reading list? You build Tasche.
