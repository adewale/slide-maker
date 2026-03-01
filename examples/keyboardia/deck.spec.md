# Deck Spec

## Meta
- title: Keyboardia
- purpose: showcase the project
- audience: developers and musicians
- tone: assertive, energetic, creative
- target-length: 7
- notes: no
- style-preset: bold-modern

## Design Tokens
- colors:
  - bg: "#0d0118"
  - fg: "#f0e6ff"
  - accent: "#e040fb"
  - accent-alt: "#00e5ff"
  - muted: "rgba(240, 230, 255, 0.5)"
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
- title: Keyboardia
- subtitle: Multiplayer step sequencer with polyrhythmic patterns.

### Slide 2
- kind: center-statement
- layout: center
- title: Up to 10 players. 64 sound generators. Real-time collaboration.

### Slide 3
- kind: default-content
- layout: default
- title: Sequencer features
- body:
  - bullet: 3-128 step counts per track with triplet-friendly values
  - bullet: Parameter locks — per-step pitch, volume, and tied notes
  - bullet: Chromatic grid with scale lock and scale sidebar
  - bullet: Per-track swing and global groove control

### Slide 4
- kind: default-content
- layout: default
- title: Sound engine
- body:
  - bullet: 32 Web Audio synths with 40+ presets
  - bullet: 11 Tone.js FM, AM, and Membrane synths
  - bullet: 21 sampled instruments — piano, 808 kit, vibraphone, strings
  - bullet: Effects chain — reverb, delay, chorus, distortion with limiter

### Slide 5
- kind: default-content
- layout: default
- title: Multiplayer architecture
- body:
  - bullet: Cloudflare Durable Objects for session state
  - bullet: WebSocket Hibernation API for cost efficiency
  - bullet: Hybrid persistence — DO storage for immediacy, KV on disconnect
  - bullet: Session sharing, remixing, and QR code links

### Slide 6
- kind: fact
- layout: fact
- title: 64
- subtitle: Sound generators
- body: 32 Web Audio + 11 Tone.js + 21 sampled instruments across 4 synthesis engines

### Slide 7
- kind: end
- layout: end
- title: Start jamming
- body: cd app && npm install && npm run dev
