# Deck Spec

## Meta
- title: Vaders
- purpose: showcase a multiplayer TUI game built on Durable Objects with deterministic state and braille pixel art
- audience: developers building real-time applications on Cloudflare Workers
- tone: energetic, precise, playful
- target-length: 12
- notes: yes
- style-preset: bold-modern
- project-url: https://github.com/adewale/vaders

## Source Materials
- readme: README.md (quick start, controls, architecture overview, game modes, audio credits)
- changelog: CHANGELOG.md (1.0.0 feature inventory — braille sprites, 620+ tests, dissolve/explosion effects, wave transitions, 4-player scaling)
- lessons-learned: Lessons_learned.md (14 sections — pure reducer, held-state networking, audio via subprocess, collision alignment, coordinate contracts, test gaps across protocol)
- architecture: docs/server-architecture.md (GameRoom DO, Matchmaker DO, 30Hz alarm loop, reducer pipeline, full-state sync, WebSocket protocol, scaling tables)
- specs: specs/vaders-spec.md (architectural principles, launch screen, state machine, multiplayer flow, enhanced mode)

## Through-Line
- concept: "The server is the truth"
- type: design-rule
- appears-in:
  - slide 1: cover — subtitle hints at server authority ("Cloudflare Durable Objects")
  - slide 4: default — pure reducer makes the server deterministic
  - slide 5: section — through-line named explicitly
  - slide 6: default — DO alarm loop broadcasts authoritative state at 30Hz
  - slide 8: default — held-state networking: client sends keys, server decides movement
  - slide 12: end — resolution: the best game server is a pure function with a mailbox

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
  - section
  - default
  - image-right
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
- title: Vaders
- subtitle: Multiplayer TUI Space Invaders. 1-4 players. Cloudflare Durable Objects.

### Slide 2
- kind: opening-tension
- layout: statement
- transition: fade
- title: Multiplayer games don't belong in the terminal. Or do they?
- body: 120x36 character cells. No GPU. No game engine. Just a Durable Object and a WebSocket.
- sources:
  - https://github.com/adewale/vaders/blob/main/README.md — terminal size requirement and architecture
  - https://github.com/adewale/vaders/blob/main/Lessons_learned.md — section 1: what works and what doesn't in terminals

### Slide 3
- kind: visual-evidence
- layout: image-right
- transition: slide-left
- title: Braille pixel art at 120x36
- image: /gameplay.png
- alt: Vaders gameplay showing braille sprites for aliens, player ships, barriers, and bullets in a 120x36 terminal
- body: 7-wide animated braille sprites. Color cycling for UFO. Per-health barrier colors. Dissolve particle effects.
- sources:
  - https://github.com/adewale/vaders/blob/main/CHANGELOG.md — braille pixel art sprites, dissolve effects, barrier health colors
  - https://github.com/adewale/vaders/blob/main/Lessons_learned.md — section 1: Unicode box-drawing, color cycling, multi-line sprites

### Slide 4
- kind: code
- layout: default
- transition: slide-up
- title: Pure reducer, deterministic state
- body: Magic Move — gameReducer signature → tickReducer pipeline (move players, move bullets, collisions, alien shooting, end conditions)
- sources:
  - https://github.com/adewale/vaders/blob/main/Lessons_learned.md — section 2: pure reducer pattern, seeded RNG
  - https://github.com/adewale/vaders/blob/main/docs/server-architecture.md — reducer architecture, tickReducer detail

### Slide 5
- kind: section-divider
- layout: section
- transition: iris
- title: The server is the truth

### Slide 6
- kind: architecture
- layout: default
- transition: zoom-in
- title: DO alarm loop at 30Hz
- body: Mermaid diagram — alarm fires, process input queue, run reducer, broadcast state, schedule next alarm
- sources:
  - https://github.com/adewale/vaders/blob/main/docs/server-architecture.md — game loop pipeline, alarm scheduling, 33ms tick interval
  - https://github.com/adewale/vaders/blob/main/Lessons_learned.md — section 3: WebSocket hibernation, alarms over intervals

### Slide 7
- kind: comparison
- layout: two-cols-header
- transition: wipe-right
- title: What works / What doesn't
- left: Works — color cycling, braille sprites, box-drawing characters, chunky movement
- right: Doesn't — gradients, sub-pixel rendering, smooth animation, complex backgrounds
- sources:
  - https://github.com/adewale/vaders/blob/main/Lessons_learned.md — section 1: what works and what does not in terminals

### Slide 8
- kind: code
- layout: default
- transition: slide-up
- title: Held-state networking
- body: Movement sends held keys; shooting sends discrete actions. Server rate-limits via cooldown ticks.
- sources:
  - https://github.com/adewale/vaders/blob/main/Lessons_learned.md — section 3: held-state vs discrete input
  - https://github.com/adewale/vaders/blob/main/docs/server-architecture.md — WebSocket protocol, input message format

### Slide 9
- kind: code
- layout: default
- transition: slide-left
- title: Audio without FFI
- body: Fire-and-forget subprocess via system player. Debounce at 50ms. Process cleanup on exit.
- sources:
  - https://github.com/adewale/vaders/blob/main/Lessons_learned.md — section 7: system audio player, process cleanup, debouncing

### Slide 10
- kind: war-story
- layout: default
- transition: slide-up
- title: Testing across the wire
- body: Server tests verified events were sent. Client silently dropped them. Unit tests pass while the game is broken.
- sources:
  - https://github.com/adewale/vaders/blob/main/Lessons_learned.md — section 9: unit tests don't catch client-side protocol issues
  - https://github.com/adewale/vaders/blob/main/Lessons_learned.md — section 8: coordinate system mismatches, collision alignment

### Slide 11
- kind: fact
- layout: fact
- transition: fade
- title: "620+"
- subtitle: tests, 4 players, 33ms tick, full-state sync at 30Hz
- sources:
  - https://github.com/adewale/vaders/blob/main/CHANGELOG.md — 620+ tests across all workspaces
  - https://github.com/adewale/vaders/blob/main/docs/server-architecture.md — 30Hz tick rate, 4-player scaling, full-state sync

### Slide 12
- kind: end
- layout: end
- transition: fade
- title: The best game server is a pure function with a mailbox
