# Deck Spec

## Meta
- title: Vaders
- purpose: present a multiplayer TUI Space Invaders clone built with surprising architectural choices
- audience: developers interested in real-time multiplayer, terminal games, and edge computing
- tone: technical, curious, grounded in real project decisions
- target-length: 7
- notes: yes
- style-preset: material-design
- project-url: https://github.com/adewale/vaders
- progress: segment-bar

## Source Materials
- readme: README.md (project overview — what it does, how to run it, game modes and controls)
- changelog: CHANGELOG.md (v1.0.0 feature inventory — sprites, effects, audio, multiplayer)
- architecture: docs/server-architecture.md (DO pattern — alarm loop, WebSocket broadcast, state sync)
- lessons-learned: Lessons_learned.md (TUI constraints, collision bugs, property-based testing discoveries, Amiga color cycling)
- claude-md: CLAUDE.md (tick rate, scaling table, state machine, coordinate conventions)

## Through-Line
- concept: "Accept the constraint. It becomes the feature."
- type: design-rule
- appears-in:
  - slide 2: introduced — terminal constraints (chunky movement, single-color cells) are embraced, not fought
  - slide 4: deepened — full state sync at 30Hz is "good enough" and simpler than delta updates
  - slide 5: surprise — 1980s Amiga color cycling techniques map directly to terminal rendering
  - slide 6: reinforced — property-based testing found bugs that 620+ example tests missed
  - slide 7: resolved — constraints bred the entire aesthetic and architecture

## Design Tokens
- colors:
  - bg: "#FFFBFE"
  - fg: "#1C1B1F"
  - accent: "#00BCD4"
  - accent-alt: "#6750A4"
  - muted: "rgba(28, 27, 31, 0.5)"
  - primary-container: "#B2EBF2"
  - secondary-container: "#E8DEF8"
- typography:
  - display: Outfit
  - body: Plus Jakarta Sans
  - mono: Roboto Mono
- motion:
  - preset: M3 emphasized-decelerate

## Layout System
- prefer-builtins: true
- builtins:
  - cover
  - section
  - default
  - center
  - fact
  - two-cols
  - image-right
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
- subtitle: An OpenTUI Space Invaders clone (with elements of Galaga and Galaxian) supporting solo play or 2-4 player co-op, synchronised via Cloudflare Durable Objects.
- notes:
  - This is a multiplayer terminal game. Not a web app, not a native GUI — a terminal game with real-time multiplayer. That choice drives everything.

### Slide 2
- kind: default-content
- layout: default
- title: Space Invaders in Your Terminal
- body: What Vaders actually is — a 120x36 terminal game with braille pixel art, 30Hz server tick, and 1-4 player real-time co-op. The terminal is not a limitation; it is the medium.
- sources:
  - file:README.md — game modes, terminal size, controls
  - file:CLAUDE.md — tick rate, screen dimensions, player colors

### Slide 3
- kind: default-content
- layout: image-right
- title: Gameplay
- image: /images/gameplay.png
- alt: Terminal showing a live Vaders game session with alien grid, player ships, barriers, and score display rendered in braille Unicode characters
- body: Real gameplay screenshot showing braille sprites, destructible barriers, and the classic alien march pattern.
- sources:
  - file:docs/gameplay.png — actual gameplay screenshot from the running project

### Slide 4
- kind: center-statement
- layout: center
- title: Full state sync at 30Hz. No deltas.
- body: 2KB per tick, 4 players, 120 messages/second. Simple enough to reason about, fast enough to play. The optimization was not implementing delta updates.
- sources:
  - file:Lessons_learned.md — full sync vs delta updates decision
  - file:CLAUDE.md — state sync architecture

### Slide 5
- kind: center-statement
- layout: center
- title: 1980s Amiga Color Cycling in a 2026 Terminal
- body: Brightness ramps instead of color jumps. Coprime tick rates across depth layers. Hash-based phase offsets so neighboring stars never pulse in sync. Techniques from 32-color Amigas applied to terminal cells.
- sources:
  - file:Lessons_learned.md — Amiga color cycling techniques, visual effects in terminals

### Slide 6
- kind: fact
- layout: fact
- title: 620+
- body: Tests — including property-based tests that found a color conversion bug no hand-written test caught. Gray values 239-248 produced index 256 (out of range). fast-check found it instantly.
- sources:
  - file:Lessons_learned.md — property-based testing, hexTo256Color bug
  - file:CHANGELOG.md — test suite count

### Slide 7
- kind: end
- layout: end
- title: Accept the constraint. It becomes the feature.
- body: Chunky movement is retro charm. Single-color cells are Amiga cycling. Full sync is simplicity. The terminal was never the limitation.
