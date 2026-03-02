# Deck Spec

## Meta
- title: Tasche
- purpose: showcase the project
- audience: developers and self-hosters
- tone: serious, warm, trustworthy
- target-length: 8
- notes: yes
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
- transition: fade
- title: Tasche
- subtitle: Self-hosted read-it-later on Cloudflare.
- notes: yes

### Slide 2
- kind: why-statement
- layout: statement
- transition: slide-left
- title: Read-later services own your data
- body: Pocket, Instapaper, Omnivore store articles on their servers. When they shut down, your library vanishes. You need a self-hosted alternative.

### Slide 3
- kind: code
- layout: default
- transition: slide-up
- title: Article extraction pipeline
- body: Python async pipeline — fetch, extract, archive to R2, index to D1 FTS5.
- notes: yes

### Slide 4
- kind: architecture-diagram
- layout: default
- transition: slide-left
- title: The Cloudflare stack
- body: Mermaid graph — PWA to Python Worker to D1, R2, Queues, KV, Workers AI.
- features:
  - v-motion with initial opacity 0 and y offset

### Slide 5
- kind: two-cols
- layout: two-cols
- transition: fade
- title: Storage layer / Processing layer
- body:
  - left: D1, FTS5 (v-mark underline), R2
  - right: Queues, Workers AI, KV
- features:
  - v-mark on FTS5
  - hover-lift interaction on list items

### Slide 6
- kind: design-insight
- layout: center
- transition: slide-up
- title: Cloudflare stack = $5/month for unlimited articles
- body: D1 for metadata, R2 for content, Queues for async, AI for TTS. One platform.
- features:
  - v-mark circle on $5/month
- notes: yes

### Slide 7
- kind: fact
- layout: fact
- transition: fade
- title: $5
- subtitle: per month vs $120/year Pocket Premium
- body: Your data, your rules. Self-hosted on Cloudflare Workers Paid plan.

### Slide 8
- kind: end
- layout: end
- transition: slide-left
- title: Deploy in 5 minutes
- body: git clone && uv run pywrangler deploy
