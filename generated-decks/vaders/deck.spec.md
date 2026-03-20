# Deck Spec

## Meta
- title: Vaders
- purpose: present the architecture and design decisions behind a multiplayer TUI game
- audience: developers interested in real-time multiplayer, terminal rendering, or Cloudflare Workers
- tone: technical, specific, retro-warm
- target-length: 7
- notes: yes
- style-preset: material-design
- project-url: https://github.com/adewale/vaders
- progress: segment-bar

## Source Materials
- readme: README.md (project overview — what it does, game modes, controls, architecture)
- changelog: CHANGELOG.md (v1.0.0 feature inventory — sprites, effects, multiplayer, audio)
- lessons-learned: Lessons_learned.md (TUI constraints, multiplayer sync, collision bugs, property testing)
- claude-md: CLAUDE.md (architecture details — tick rate, scaling table, WebSocket protocol, state machine)
- screenshots: docs/ (launch-screen.png, gameplay.png, spritesheet.png)

## Through-Line
- concept: "Accept the constraint"
- type: design-rule
- appears-in:
  - slide 2: default — introduced as the core design philosophy
  - slide 4: section — terminal constraints become retro aesthetic
  - slide 5: default — full sync chosen over delta updates because simplicity wins at this scale
  - slide 7: end — resolution: constraints breed the right design

## Design Tokens
- colors:
  - bg: "#FFFBFE"
  - fg: "#1C1B1F"
  - accent: "#00BCD4"
  - accent-alt: "#FF8800"
  - muted: "#625B71"
  - primary-container: "#B2EBF2"
  - secondary-container: "#FFE0B2"
- typography:
  - display: Outfit
  - body: Plus Jakarta Sans
  - mono: Roboto Mono
- motion:
  - preset: material-m3

## Layout System
- prefer-builtins: true
- builtins:
  - cover
  - default
  - section
  - center
  - fact
  - two-cols
  - end
- custom-layouts: []
- components: []
- css-files:
  - styles/tokens.css
  - styles/theme.css
  - styles/transitions.css

## Slides

### Slide 1
- kind: cover
- layout: cover
- title: Vaders
- subtitle: Multiplayer TUI Space Invaders clone (1-4 players) built with OpenTUI and Cloudflare Durable Objects.
- notes:
  - This is a terminal-native game running in a 120x36 character grid. The subtitle is the project's own description from the README.

### Slide 2
- kind: default-content
- layout: default
- title: What Vaders is and why it exists
- body: Multiplayer TUI Space Invaders clone (1-4 players) built with OpenTUI and Cloudflare Durable Objects. Solo play with 3 lives, or 2-4 player co-op with 5 shared lives, scaled alien grids, and faster enemies. Real-time sync at 30Hz via WebSocket. The core philosophy: accept the constraint.
- sources:
  - https://github.com/adewale/vaders/blob/main/README.md — project overview and game modes
  - https://github.com/adewale/vaders/blob/main/CLAUDE.md — architecture overview
- notes:
  - Introduce the through-line here: the project succeeds by embracing terminal limitations rather than fighting them.

### Slide 3
- kind: default-content
- layout: two-cols
- title: Architecture
- left: Client (Bun + OpenTUI React), Worker (Cloudflare DO + game loop), Shared (TypeScript types + protocol)
- right: Mermaid flowchart showing Client to Worker to Shared data flow
- sources:
  - https://github.com/adewale/vaders/blob/main/CLAUDE.md — three-workspace architecture
  - https://github.com/adewale/vaders/blob/main/README.md — architecture section
- notes:
  - The architecture is a classic client-server split. The Durable Object is the authoritative game server running a 30Hz tick loop.

### Slide 4
- kind: section
- layout: section
- title: Terminal constraints become retro aesthetic
- notes:
  - Through-line echo: the limitations of terminal rendering (chunky movement, solid colors, character cells) produced a game that feels authentically retro.

### Slide 5
- kind: default-content
- layout: default
- title: Full sync at 30Hz — simplicity wins
- body: The server broadcasts complete game state every tick. At ~2KB per message with 4 players, that is 120 messages/second — well within WebSocket limits. Delta updates were considered and rejected.
- sources:
  - https://github.com/adewale/vaders/blob/main/Lessons_learned.md — full sync vs delta updates section
  - https://github.com/adewale/vaders/blob/main/CLAUDE.md — WebSocket protocol details
- notes:
  - Accept the constraint: full sync is "wasteful" but correct and simple. The optimization was omitting config and playerId after initial join, halving payload size.

### Slide 6
- kind: fact
- layout: fact
- title: 620+ tests
- body: Including property-based tests that caught a color conversion bug no hand-written test found
- sources:
  - https://github.com/adewale/vaders/blob/main/CHANGELOG.md — test count from v1.0.0
  - https://github.com/adewale/vaders/blob/main/Lessons_learned.md — property-based testing section
- notes:
  - The hexTo256Color function had been passing all example-based tests. fast-check found that gray values 239-248 produced index 256, which is out of range. The fix was a one-line threshold change.

### Slide 7
- kind: end
- layout: end
- title: Accept the constraint
- subtitle: Chunky movement, solid colors, full state sync. The terminal shaped a better game.
- notes:
  - Resolution of the through-line. Every "limitation" produced a design strength: chunky movement matches the retro genre, solid colors work within terminal rendering, full sync keeps the codebase simple.
