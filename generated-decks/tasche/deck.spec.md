# Deck Spec

## Meta
- title: Tasche
- purpose: introduce Tasche as a self-hosted read-it-later service that preserves your reading permanently on Cloudflare
- audience: developers who read widely and distrust SaaS permanence
- tone: assertive, specific, opinionated
- target-length: 7
- notes: yes
- style-preset: bold-modern
- progress: segment-bar
- project-url: https://github.com/adewale/tasche

## Source Materials
- readme: README.md (product overview -- what it does, one-click deploy, feature list)
- changelog: CHANGELOG.md (v0.1.0 to v0.3.0 evolution -- from 14-step pipeline to one-click deploy)
- architecture: docs/architecture.md (Cloudflare platform bindings -- D1, R2, KV, Queues, Workers AI)
- lessons-learned: LESSONS_LEARNED.md (10-phase implement-then-audit loop, FFI boundary surprises, TTS truncation bug)
- specs: specs/tasche-spec.md (product spec -- archival promise, three-URL deduplication, asset inventory)
- config: wrangler.jsonc (binding topology -- DB, CONTENT, SESSIONS, ARTICLE_QUEUE, Workers AI)
- design: DESIGN_LANGUAGE.md (monochrome pen-and-ink aesthetic -- stroke weight hierarchy, Georgia+small-caps typography)

## Through-Line
- concept: "Your articles survive"
- type: provocation
- appears-in:
  - slide 1: cover -- the provocation is stated
  - slide 2: statement -- what "survive" means (the original can 404)
  - slide 4: default-content -- the six Cloudflare services that make survival work
  - slide 6: fact -- the cost of permanence ($5/month)
  - slide 7: end -- the resolution: your pocket, your rules

## Design Tokens
- colors:
  - bg: "#0a0a0f"
  - fg: "#f0f0f5"
  - accent: "#e8e8ed"
  - muted: "rgba(240, 240, 245, 0.5)"
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
  - statement
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

## Slides

### Slide 1
- kind: cover
- layout: cover
- title: Tasche
- subtitle: A self-hosted read-it-later service. Your articles survive.
- sources:
  - file:README.md -- "Save articles, read them offline, and listen to them as audio"

### Slide 2
- kind: center-statement
- layout: statement
- title: The original gets paywalled. The domain expires. The CDN drops the images. Your copy is still there.
- sources:
  - file:specs/tasche-spec.md -- "If you click the original URL and it 404s: Good thing you saved it."

### Slide 3
- kind: default-content
- layout: default
- title: What gets archived when you save a URL
- body:
  - bullet: Clean HTML via Readability extraction
  - bullet: Every image downloaded and converted to WebP
  - bullet: Full markdown for offline reading
  - bullet: TTS audio on demand via Workers AI
  - bullet: Three-URL deduplication across original, final, and canonical
- sources:
  - file:specs/tasche-spec.md -- asset table (content.html, images/*.webp, audio.mp3)

### Slide 4
- kind: section
- layout: section
- title: Six Cloudflare services, one worker
- subtitle: No containers. No VMs. No ops.

### Slide 5
- kind: default-content
- layout: two-cols
- title: The platform does the work
- left:
  - bullet: Python Workers -- FastAPI API + queue consumer
  - bullet: D1 -- articles, users, tags, FTS5 search
  - bullet: R2 -- archived HTML, markdown, images, audio
- right:
  - bullet: KV -- auth sessions with 7-day TTL
  - bullet: Queues -- async article processing and TTS
  - bullet: Workers AI -- text-to-speech (MeloTTS)
- sources:
  - file:README.md -- architecture table
  - file:docs/architecture.md -- binding topology

### Slide 6
- kind: fact
- layout: fact
- title: $5/month
- body: The Cloudflare Workers Paid plan. Your data, your account, your infrastructure. Nothing to maintain.
- sources:
  - file:README.md -- "Requires the Cloudflare Workers Paid plan ($5/month as of early 2026)"

### Slide 7
- kind: end
- layout: end
- title: Your pocket. Your rules.
- body: Your articles survive.
