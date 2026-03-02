# Deck Spec

## Meta
- title: Vaders
- purpose: showcase the project
- audience: developers and gamers
- tone: assertive, playful, retro-futuristic
- target-length: 8
- notes: yes
- style-preset: bold-modern

## Design Tokens
- colors:
  - bg: "#0a0f0a"
  - fg: "#e8f5e8"
  - accent: "#39ff14"
  - accent-alt: "#ff6b35"
  - muted: "rgba(232, 245, 232, 0.5)"
- typography:
  - display: Space Grotesk
  - body: Space Grotesk
  - mono: JetBrains Mono
- motion:
  - preset: medium-reveal

## Layout System
- prefer-builtins: true
- builtins:
  - cover
  - statement
  - center
  - default
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
- transition: slide-left
- title: Vaders
- subtitle: Multiplayer TUI Space Invaders. 1-4 players. Cloudflare Durable Objects.
- notes: yes

### Slide 2
- kind: why
- layout: statement
- transition: fade
- title: Multiplayer games don't belong in the terminal. Or do they?
- body: The challenge — real-time multiplayer in a TUI is supposed to be impossible. 120x36 character cells, no GPU, no game engine. Just text.

### Slide 3
- kind: code
- layout: default
- transition: slide-up
- title: Durable Object state sync
- body: TypeScript DO alarm broadcasting game state 60 times per second
- notes: yes

### Slide 4
- kind: two-cols
- layout: two-cols-header
- transition: slide-left
- title: Four moving parts
- body:
  - left: Client — Bun, OpenTUI React, Native audio
  - right: Server — CF Worker, DO game state, WebSocket sync
- interactive: hover-scale on client/server sections

### Slide 5
- kind: visual
- layout: center
- transition: fade
- title: ASCII game board
- body: v-motion animated game board with v-mark design insight on the 120x36 constraint
- features:
  - v-motion entrance
  - v-mark highlight

### Slide 6
- kind: diagram
- layout: default
- transition: slide-up
- title: Architecture
- body: Mermaid graph — Players to CF Worker to Durable Object broadcast loop

### Slide 7
- kind: fact
- layout: fact
- transition: fade
- title: 4
- subtitle: players, <16ms frame time, 0 dropped inputs
- body: Real-time co-op with shared lives, synchronized via Durable Objects at 60fps.

### Slide 8
- kind: end
- layout: end
- transition: fade
- title: Play now
- body: bun install && bun run vaders
- notes: yes
