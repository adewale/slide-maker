# Deck Spec

## Meta
- title: Planet CF
- purpose: showcase the project
- audience: developers and Cloudflare users
- tone: precise, calm, confident
- target-length: 6
- notes: no
- style-preset: swiss-minimal

## Design Tokens
- colors:
  - bg: "#ffffff"
  - fg: "#1a1a2e"
  - accent: "#f6821f"
  - muted: "rgba(26, 26, 46, 0.45)"
- typography:
  - display: Inter Tight
  - body: Inter
  - mono: JetBrains Mono
- motion:
  - preset: subtle-enter

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
- title: Planet CF
- subtitle: A feed aggregator built on Cloudflare Python Workers.

### Slide 2
- kind: center-statement
- layout: center
- title: Aggregate blogs. Search semantically. Deploy in minutes.

### Slide 3
- kind: default-content
- layout: default
- title: Features
- body:
  - bullet: RSS, Atom, and OPML feed aggregation with hourly cron
  - bullet: Semantic search powered by Vectorize and Workers AI
  - bullet: Queue-based fetching with retries and dead-letter queue
  - bullet: Multi-instance deployment from a single codebase

### Slide 4
- kind: default-content
- layout: default
- title: Smart defaults
- body:
  - bullet: All config optional — sensible values built in
  - bullet: Database auto-initializes on first request
  - bullet: Theme fallback prevents deployment failures
  - bullet: Empty feed range shows 50 most recent entries

### Slide 5
- kind: fact
- layout: fact
- title: 500+
- subtitle: Feeds in Planet Python
- body: Ready-to-deploy examples for Planet Python, Planet Mozilla, and Planet Cloudflare

### Slide 6
- kind: end
- layout: end
- title: Deploy your own
- body: git clone && npx wrangler deploy
