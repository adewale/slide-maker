# Deck Spec

## Meta
- title: Vaders
- subtitle: An OpenTUI Space Invaders clone supporting solo play or 2-4 player co-op, synchronised via Cloudflare Durable Objects
- purpose: present the architecture, surprising design choices, and lessons learned building a multiplayer terminal game
- audience: developers interested in real-time multiplayer, terminal UIs, and Cloudflare Workers
- tone: technical, concrete, appreciative of constraints
- target-length: 9
- notes: yes
- style-preset: material-design
- project-url: https://github.com/adewale/vaders
- progress: segment-bar

## Source Materials
- readme: README.md (project overview -- what it does, game modes, controls, architecture summary)
- architecture: docs/server-architecture.md (Durable Object game server, Matchmaker, game loop detail, reducer architecture, full state sync rationale)
- lessons-learned: Lessons_learned.md (TUI color cycling, OpenTUI patterns, pure reducer, full sync vs delta, Amiga techniques, property-based testing)
- changelog: CHANGELOG.md (v1.0.0 feature inventory -- 620+ tests, braille sprites, wave transitions, audio)
- types: shared/types.ts (game state schema, entity discriminated unions, layout constants, collision functions)
- protocol: shared/protocol.ts (WebSocket message types, client-server contract, sync optimization)
- game-room: worker/src/GameRoom.ts (Durable Object with hibernation, SQLite persistence, alarm-based tick, rate limiting)
- sprites: client/src/sprites.ts (braille pixel art system, 14x8 grids, color palettes)
- effects: client/src/effects.ts (color cycling implementation)

## Through-Line
- concept: "Can you build a real-time multiplayer arcade game in a terminal? Vaders did -- and the terminal's constraints made it better."
- type: tragedy
- shape: challenge (no GPU, no pixels, no smooth animation) → answers (braille art, color cycling, 30 Hz sync) → acceptance (constraints are permanent but produced simpler solutions)
- appears-in:
  - slide 1: cover -- Vaders introduced as a multiplayer terminal game
  - slide 2: default -- the CHALLENGE stated as a question: can you build a game here? Then the answer: braille, color cycling, 30 Hz
  - slide 4: center -- full state sync: simplicity wins at this scale
  - slide 6: center -- chunky movement is the genre, not a bug
  - slide 8: fact -- 620+ tests, property-based testing adapted to terminal constraints
  - slide 9: end -- tragedy's acceptance: the terminal has no pixels, the game has no lag, every constraint produced a simpler answer

## Design Tokens
- colors:
  - bg: "#1C1B1F"
  - fg: "#E6E1E5"
  - accent: "#00FFFF"
  - accent-alt: "#FF5555"
  - muted: "#938F99"
  - primary-container: "#003333"
  - secondary: "#625B71"
- typography:
  - display: Outfit
  - body: Plus Jakarta Sans
  - mono: Roboto Mono
- motion:
  - preset: medium-reveal

## Layout System
- prefer-builtins: true
- builtins:
  - cover
  - section
  - default
  - center
  - fact
  - two-cols
  - end
- custom-layouts: []
- components:
  - ProgressSegmentBar
  - KeyboardHelp
- css-files:
  - styles/tokens.css
  - styles/theme.css
  - styles/transitions.css

## Slides

### Slide 1
- kind: cover
- layout: cover
- title: Vaders
- subtitle: An OpenTUI Space Invaders clone supporting solo play or 2-4 player co-op, synchronised via Cloudflare Durable Objects
- notes:
  - Project URL: https://github.com/adewale/vaders. Built with Bun, TypeScript, OpenTUI React for the terminal client, Cloudflare Workers + Durable Objects for the multiplayer server. The game requires a 120x36 terminal.
- sources:
  - https://github.com/adewale/vaders — project repository

### Slide 2
- kind: default-content
- layout: default
- title: No GPU. No Pixels. No Smooth Animation.
- body: The challenge stated as a question -- can you build a real-time multiplayer game in a terminal? Then the immediate answer: braille pixel art, Amiga color cycling, 30 Hz full state sync.
- bullets:
  - Braille pixel art: 14x8 grids encoded as Unicode braille -- sub-character resolution, no GPU
  - Color cycling: 6-color palette rotates every 5 ticks, the 1980s Amiga technique
  - Wave gradients: borders shift from ocean blues to danger reds as difficulty escalates
  - 30 Hz sync: full game state, every 33ms, to every connected client
- sources:
  - file:Lessons_learned.md -- Amiga color cycling techniques applied to TUI
  - file:client/src/sprites.ts -- braille pixel art system and pixel-to-braille conversion
  - file:client/src/effects.ts -- getUFOColor color cycling implementation
- notes:
  - The challenge is stated viscerally: terminals have no GPU, no sub-pixel rendering, no smooth animation. The answer follows immediately -- braille characters give sub-character resolution, Amiga color cycling produces shimmer effects, and full state sync keeps multiplayer in lockstep at 30 Hz.

### Slide 3
- kind: section
- layout: section
- title: The Server Is the Game

### Slide 4
- kind: center-statement
- layout: center
- title: Full state sync at 30 Hz. No delta compression. No client prediction.
- body: 2 KB per tick with 4 players is 120 messages/second -- well within WebSocket limits. The simplicity of full sync outweighs bandwidth savings at this scale.
- sources:
  - file:docs/server-architecture.md -- State Synchronization section, "Why Full Sync?" rationale
  - file:Lessons_learned.md -- Full Sync vs Delta Updates section

### Slide 5
- kind: default-content
- layout: two-cols
- title: Durable Objects as Game Servers
- left:
  - bullet: Each room is a Durable Object -- single-threaded actor, no race conditions
  - bullet: Hibernatable WebSockets keep connections alive while the DO sleeps
  - bullet: Alarms replace setInterval -- hibernation-compatible 30Hz game tick
  - bullet: SQLite stores game state across hibernation cycles
- right:
  - bullet: Matchmaker DO maintains room registry as a singleton
  - bullet: Pure reducer pattern -- all game logic is (state, action) to state
  - bullet: Seeded RNG (mulberry32) ensures deterministic alien behavior
- sources:
  - file:worker/src/GameRoom.ts -- hibernation pattern, alarm-based tick, SQLite persistence
  - file:docs/server-architecture.md -- GameRoom and Matchmaker architecture
  - file:Lessons_learned.md -- WebSocket Hibernation with Cloudflare Durable Objects

### Slide 6
- kind: center-statement
- layout: center
- title: Chunky movement is not a bug. It is the genre.
- body: Aliens move 2 cells every 18 ticks. Players move 1 cell per tick while holding a key. Entities snap to whole character cells. Fighting the terminal's grid makes it worse -- embracing it makes it Space Invaders.
- sources:
  - file:Lessons_learned.md -- "Accept terminal constraints. Chunky movement and solid colors are features, not bugs."
  - file:shared/types.ts -- ALIEN_MOVE_STEP = 2, playerMoveSpeed = 1

### Slide 7
- kind: default-content
- layout: default
- title: What Broke and What We Cut
- bullets:
  - Barrier collision used 1x offset but rendering used 2x -- bullets passed through visually solid barriers
  - Bug-documenting tests gave false confidence -- tests asserting buggy behavior all passed green
  - Y-axis collision tolerance is intentional -- bullets move before collision, strict bounds cause tunneling
  - Cut: client-side prediction, sequence numbers, ECS with component pools, spectator mode
- sources:
  - file:Lessons_learned.md -- Visual Rendering Code is the Source of Truth, Tests That Document Bugs
  - file:Lessons_learned.md -- Over-Engineering Avoided section

### Slide 8
- kind: fact
- layout: fact
- title: "620+"
- subtitle: tests across all workspaces, including property-based collision tests that caught a color conversion bug no hand-written test found
- sources:
  - file:CHANGELOG.md -- "620+ tests" in v1.0.0
  - file:Lessons_learned.md -- Property-Based Testing section, hexTo256Color counterexample
- notes:
  - Even testing adapted to the constraint. Property-based tests worked because the terminal's bounded output space (256 colors, character-cell coordinates) made invariants easy to state.

### Slide 9
- kind: end
- layout: end
- title: The Terminal Has No Pixels. The Game Has No Lag.
- subtitle: Every constraint produced a simpler answer.
- notes:
  - Resolves the opening challenge from slide 2. The question was: can you build a real-time multiplayer game in a terminal? The answer: yes, and the constraints are permanent -- no pixels, no GPU, no smooth animation -- but each one produced a simpler solution than the "proper" alternative. The tragedy is accepted, not overcome.
