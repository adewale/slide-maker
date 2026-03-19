# Deck Spec

## Meta
- title: Vaders
- subtitle: Multiplayer Space Invaders in your terminal
- purpose: present how a multiplayer TUI game was built with OpenTUI and Cloudflare Durable Objects
- audience: developers interested in real-time multiplayer, terminal UIs, and serverless architecture
- tone: practical, energetic, technical but accessible
- target-length: 7
- notes: yes
- style-preset: material-design
- progress: segment-bar
- project-url: https://github.com/adewale/vaders

## Source Materials
- readme: README.md (project overview — 1-4 player TUI Space Invaders, controls, architecture, tech stack)
- architecture: docs/server-architecture.md (Cloudflare Worker + Durable Object game server, WebSocket protocol, matchmaking)
- lessons-learned: Lessons_learned.md (TUI rendering constraints, pure reducer pattern, WebSocket hibernation, seeded RNG)
- package: package.json (Bun runtime, three workspaces — client/worker/shared, 620+ tests)
- changelog: CHANGELOG.md (v1.0.0 feature inventory — braille sprites, wave transitions, dissolve effects, confetti)

## Through-Line
- concept: "What happens when you give a terminal a game loop?"
- type: question
- appears-in:
  - slide 1: cover — the question is posed
  - slide 2: center-statement — the terminal becomes a canvas (braille pixels, color cycling)
  - slide 4: section — the terminal becomes a game server (Durable Objects, 30Hz tick)
  - slide 5: default-content — the terminal becomes multiplayer (WebSocket sync, held-state input)
  - slide 7: end — the question is answered — "It plays back"

## Design Tokens
- colors:
  - bg: "#FFFBFE"
  - fg: "#1C1B1F"
  - accent: "#00BCD4"
  - accent-alt: "#6750A4"
  - muted: "rgba(28, 27, 31, 0.5)"
- typography:
  - display: Outfit
  - body: Plus Jakarta Sans
  - mono: Roboto Mono
- motion:
  - preset: m3-systematic

## Layout System
- prefer-builtins: true
- builtins:
  - cover
  - center
  - section
  - default
  - fact
  - two-cols-header
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
- subtitle: What happens when you give a terminal a game loop?
- notes:
  - This is a multiplayer TUI Space Invaders clone for 1-4 players, built with Bun, OpenTUI, and Cloudflare Durable Objects. The question sets up the through-line — each section answers it differently.

### Slide 2
- kind: center-statement
- layout: center
- title: 120 x 36 characters. Braille pixels. Color cycling.
- body: The terminal becomes a canvas — Unicode box-drawing for sprites, Amiga-style palette rotation for animation, two-line entities on a fixed grid.
- sources:
  - https://github.com/adewale/vaders/blob/main/Lessons_learned.md — TUI rendering techniques, braille pixel art, color cycling from Amiga era
  - https://github.com/adewale/vaders/blob/main/CHANGELOG.md — braille pixel art sprites, 7-wide animated sprites
- notes:
  - The 120x36 grid is a hard constraint. Sprites are 2-line tall, 5-char wide. Color cycling rotates through a palette array every N ticks — no per-pixel rendering needed. The UFO cycles through 6 rainbow colors.

### Slide 3
- kind: fact
- layout: fact
- title: "620+"
- body: Tests across all three workspaces — including property-based collision checks with fast-check.
- sources:
  - https://github.com/adewale/vaders/blob/main/CHANGELOG.md — 620+ tests, comprehensive test suite
  - https://github.com/adewale/vaders/blob/main/package.json — test scripts, fast-check dependency
- notes:
  - The test suite spans client, worker, and shared workspaces. Property-based tests with fast-check verify collision logic under random inputs, not just hand-picked cases. This is unusually thorough for a game project.

### Slide 4
- kind: section
- layout: section
- title: A function with a name, a memory, and an alarm
- notes:
  - Transition to the server architecture section. Each Durable Object is a GameRoom — it has identity (room code), persistent state (SQLite), and a game loop driven by alarms, not setInterval.

### Slide 5
- kind: default-content
- layout: two-cols-header
- title: Client and server, 30 times per second
- left:
  - bullet: Pure reducer — all state changes through one function
  - bullet: Seeded RNG for deterministic replay
  - bullet: Full state sync at 30Hz (~2KB per tick)
- right:
  - bullet: WebSocket hibernation — the DO sleeps between messages
  - bullet: Alarms replace setInterval for the game tick
  - bullet: Held-state for movement, discrete events for shooting
- sources:
  - https://github.com/adewale/vaders/blob/main/Lessons_learned.md — pure reducer pattern, seeded RNG, full sync vs delta, WebSocket hibernation
  - https://github.com/adewale/vaders/blob/main/docs/server-architecture.md — game loop, alarm scheduling, WebSocket protocol
- notes:
  - The pure reducer returns state + events + persist flag + optional alarm. This makes the game testable and deterministic. Full sync was chosen over delta because 2KB at 30Hz for 4 players is well within WebSocket limits. Hibernation lets the DO sleep while maintaining connections.

### Slide 6
- kind: default-content
- layout: default
- title: The alien march is a state machine
- body: "Seven game statuses. Explicit transition guards. No race conditions during countdown."
- sources:
  - https://github.com/adewale/vaders/blob/main/Lessons_learned.md — state machine for game status, guard transitions
  - https://github.com/adewale/vaders/blob/main/CLAUDE.md — game statuses: waiting, countdown, wipe_hold, wipe_reveal, playing, game_over
- notes:
  - The state machine prevents bugs like players joining mid-countdown or inputs arriving during wipe transitions. The wipe phases (wipe_exit, wipe_hold, wipe_reveal) create cinematic wave transitions between levels. This is the war story slide — stale closures in keyboard handlers caused keys to "stick" during screen transitions, solved by using refs.

### Slide 7
- kind: end
- layout: end
- title: It plays back.
- subtitle: bun run vaders
- notes:
  - Circle back to the opening question. "What happens when you give a terminal a game loop?" — It plays back. The command is the invitation.
