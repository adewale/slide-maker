# Deck Spec

## Meta
- title: Vaders
- purpose: showcase the project
- audience: developers and gamers
- tone: assertive, playful, retro-futuristic
- target-length: 6
- notes: no
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
- title: Vaders
- subtitle: Multiplayer TUI Space Invaders. 1-4 players. Cloudflare Durable Objects.

### Slide 2
- kind: center-statement
- layout: center
- title: Classic arcade reimagined for the terminal

### Slide 3
- kind: default-content
- layout: default
- title: What you get
- body:
  - bullet: Solo mode with 3 lives or co-op with up to 4 players
  - bullet: Full TUI rendering via OpenTUI React at 120x36
  - bullet: Sound effects and background music
  - bullet: Real-time sync via Cloudflare Durable Objects

### Slide 4
- kind: default-content
- layout: default
- title: How it works
- body:
  - bullet: Client — Bun + OpenTUI React terminal app
  - bullet: Server — Cloudflare Worker + Durable Object game state
  - bullet: Shared — TypeScript types and WebSocket protocol
  - bullet: Audio — native system playback (afplay / aplay)

### Slide 5
- kind: fact
- layout: fact
- title: 4
- subtitle: Players in real-time co-op
- body: Synchronized via Durable Objects with shared lives and a larger alien grid

### Slide 6
- kind: end
- layout: end
- title: Play now
- body: bun install && bun run vaders
