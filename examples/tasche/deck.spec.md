# Deck Spec

## Meta
- title: Tasche
- purpose: showcase the project
- audience: developers and self-hosters
- tone: serious, warm, trustworthy
- target-length: 6
- notes: no
- style-preset: editorial-dark

## Design Tokens
- colors:
  - bg: "#12100e"
  - fg: "#f5f0eb"
  - accent: "#fb923c"
  - muted: "rgba(245, 240, 235, 0.5)"
- typography:
  - display: Inter Tight
  - body: Inter
  - mono: JetBrains Mono
- motion:
  - preset: restrained-fade

## Layout System
- prefer-builtins: true
- builtins:
  - cover
  - center
  - default
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
- subtitle: Self-hosted read-it-later on Cloudflare.

### Slide 2
- kind: center-statement
- layout: center
- title: Save articles. Read offline. Listen later. Your data stays yours.

### Slide 3
- kind: default-content
- layout: default
- title: Features
- body:
  - bullet: Save by URL with automatic content extraction and archival
  - bullet: Full-text search across your entire library via FTS5
  - bullet: Listen Later — audio versions via Workers AI TTS
  - bullet: PWA with offline reading and service worker caching

### Slide 4
- kind: default-content
- layout: default
- title: All Cloudflare
- body:
  - bullet: Python Workers — FastAPI API + queue consumer
  - bullet: D1 — articles, users, tags, FTS5 search index
  - bullet: R2 — archived HTML, markdown, images, audio
  - bullet: KV, Queues, Workers AI — sessions, async processing, TTS

### Slide 5
- kind: fact
- layout: fact
- title: $5
- subtitle: Per month
- body: On the Cloudflare Workers Paid plan. Free tier covers light personal use.

### Slide 6
- kind: end
- layout: end
- title: Deploy in 5 minutes
- body: git clone && uv run pywrangler deploy
