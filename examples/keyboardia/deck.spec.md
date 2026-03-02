# Deck Spec

## Meta
- title: Keyboardia
- purpose: showcase the project
- audience: developers and musicians
- tone: assertive, energetic, creative
- target-length: 8
- notes: yes
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
  - statement
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
- transition: slide-up
- title: Keyboardia
- subtitle: Multiplayer step sequencer with polyrhythmic patterns.
- notes: yes

### Slide 2
- kind: why-statement
- layout: statement
- transition: fade
- title: Collaborative music tools require expensive DAWs
- body: Ableton, Logic, FL Studio cost $200-800. Browser-native collaborative music should be free and instant. No install. Share a link. Start jamming.

### Slide 3
- kind: code
- layout: default
- transition: slide-left
- title: Web Audio synth creation
- body: TypeScript createVoice function — oscillator, gain, parameter locks, polyphony normalization.
- notes: yes

### Slide 4
- kind: two-cols-header
- layout: two-cols-header
- transition: slide-up
- title: Sequencer + Sound engine
- body:
  - left: 3-128 steps, parameter locks, chromatic grid, per-track swing
  - right: 32 Web Audio, 11 Tone.js, 21 sampled, effects chain
- features:
  - hover-scale interaction on column sections

### Slide 5
- kind: architecture-diagram
- layout: default
- transition: fade
- title: Multiplayer sync
- body: Mermaid graph — Players to Durable Object via WebSocket, DO Storage, KV Backup, broadcast.
- features:
  - v-motion with initial opacity 0 and y offset
  - v-mark underline on polyrhythm design insight

### Slide 6
- kind: workflow
- layout: default
- transition: slide-left
- title: How sessions work
- body:
  - step: Create — host starts a session
  - step: Join — players scan QR or paste URL
  - step: Sync — pattern changes broadcast in real-time
  - step: Persist — state in DO, backs up to KV
  - step: Remix — fork any session

### Slide 7
- kind: fact
- layout: fact
- transition: slide-up
- title: 64
- subtitle: generators, 10 concurrent players, <50ms latency
- body: 32 Web Audio + 11 Tone.js + 21 sampled. All audio client-side. Server is a state relay.
- notes: yes

### Slide 8
- kind: end
- layout: end
- transition: fade
- title: Start jamming
- body: cd app && npm install && npm run dev
