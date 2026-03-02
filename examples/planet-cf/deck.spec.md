# Deck Spec

## Meta
- title: Planet CF
- purpose: showcase the project
- audience: developers and Cloudflare users
- tone: precise, calm, confident
- target-length: 8
- notes: yes
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
  - statement
  - default
  - two-cols
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
- notes: yes

### Slide 2
- kind: why-statement
- layout: statement
- transition: fade
- title: Developer blogs are scattered across thousands of personal sites
- body: No unified discovery. RSS readers are single-user and local. You need an aggregator that collects, indexes, and serves content for everyone.

### Slide 3
- kind: code
- layout: default
- transition: slide-up
- title: The feed fetcher
- body: Python async function showing feedparser, Workers AI embedding, and D1 insert
- notes: yes

### Slide 4
- kind: architecture
- layout: default
- transition: slide-left
- title: Architecture
- body: Mermaid graph LR — Cron Trigger -> Queue -> Feed Fetcher -> D1 / Vectorize; Web UI -> D1 / Vectorize
- motion: v-motion fade-up on diagram

### Slide 5
- kind: two-cols
- layout: two-cols
- transition: fade
- title: Features / Smart defaults
- body:
  - left:
    - bullet: RSS, Atom, and OPML aggregation
    - bullet: Hourly cron triggers
    - bullet: Semantic search via Vectorize + Workers AI
    - bullet: Queue-based fetching with retries
  - right:
    - bullet: All config optional
    - bullet: Database auto-initializes (v-mark underline)
    - bullet: Theme fallback prevents failures
    - bullet: Empty range shows 50 most recent
- interactive: hover-accent on smart defaults list items

### Slide 6
- kind: design-insight
- layout: center
- transition: slide-up
- title: Smart defaults eliminate configuration
- body: All config optional. Database auto-initializes on first request. Theme fallback prevents deployment failures.

### Slide 7
- kind: fact
- layout: fact
- transition: fade
- title: "500 feeds"
- subtitle: "12,000 posts indexed, semantic search in <50ms"
- body: Three ready-to-deploy instances. One codebase.

### Slide 8
- kind: end
- layout: end
- transition: slide-left
- title: Deploy your own
- body: git clone && npx wrangler deploy
- notes: yes
