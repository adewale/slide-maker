---
theme: default
title: Vaders
colorSchema: light
transition: slide-left
layout: cover
fonts:
  sans: Outfit
  serif: Plus Jakarta Sans
  mono: Roboto Mono
  weights: '300,400,500,600,700'
---

# Vaders

An OpenTUI Space Invaders clone supporting solo play or 2-4 player co-op, synchronised via Cloudflare Durable Objects.

<!--
This is a multiplayer terminal game. Not a web app, not a native GUI — a terminal game with real-time multiplayer over Cloudflare Durable Objects. That choice drives everything in the architecture.

Sources:
- https://github.com/adewale/vaders — project repository and README description
-->

---
transition: slide-left
---

# Space Invaders in Your Terminal

A 120x36 character grid. Braille pixel art sprites. A 30Hz game loop running inside a Durable Object. 1-4 players connected over WebSocket.

<v-clicks>

- **Bun + OpenTUI** for terminal rendering with React
- **Cloudflare Durable Objects** for authoritative game state
- **Hibernatable WebSockets** — the server sleeps between games
- **Seeded RNG** — deterministic gameplay from identical inputs

</v-clicks>

<!--
The terminal is not a constraint being worked around — it is the chosen medium. OpenTUI gives React semantics (useKeyboard, box layout, position=absolute) inside a terminal. The server is not a traditional game server; it is a Durable Object that wakes on WebSocket message and sleeps via hibernation between sessions. Every game action flows through a pure reducer function that returns new state, events to broadcast, and whether to persist. The through-line starts here: the terminal constraint is the feature.

Sources:
- https://github.com/adewale/vaders/blob/main/README.md — architecture overview, tech stack
- https://github.com/adewale/vaders/blob/main/CLAUDE.md — tick rate (33ms/30Hz), screen size (120x36), state machine
-->

---
transition: slide-up
layout: image-right
image: /images/gameplay.png
---

# Braille Sprites and Alien Marches

Unicode box-drawing characters create recognizable game entities at character scale.

<v-clicks>

- **2-line tall sprites** — squids, crabs, octopuses
- **4 destructible barriers** with per-health color
- **Rainbow UFO** via color cycling
- **Dissolve effects** — braille particle system for deaths

</v-clicks>

<!--
Moving from 80x24 to 120x36 allowed 2-line sprites that are much more readable than single-line alternatives. Characters like the box-drawing set create ships and aliens. The UFO uses a color cycling rainbow effect — six colors rotating every 5 ticks. Barriers degrade from both sides, matching the original Space Invaders design where they buy time but are never permanent cover. The dissolve effect uses a braille particle system for entity deaths.

Sources:
- https://github.com/adewale/vaders/blob/main/Lessons_learned.md — Unicode sprites, multi-line sprites, dissolve effects
- https://github.com/adewale/vaders/blob/main/CHANGELOG.md — braille pixel art sprites, barrier segments, dissolve effects
-->

---
transition: fade
layout: center
---

# Full state sync at 30Hz. No deltas.

2KB per tick. 4 players. 120 messages per second. The optimisation was not building delta updates.

<!--
The server broadcasts full game state to every connected client on every tick. At 30Hz with 4 players, that is 120 WebSocket messages per second. Each message is roughly 2KB of JSON. The team considered delta updates but decided against them — full sync is simpler to reason about and debug. The only optimisation applied: omit playerId and config from subsequent syncs (they are sent once on join), roughly halving payload size. Binary protocols were considered and rejected at this scale. This is the through-line in action: the "naive" approach was good enough, and its simplicity became an advantage.

Sources:
- https://github.com/adewale/vaders/blob/main/Lessons_learned.md — full sync vs delta updates, broadcast frequency optimisations
- https://github.com/adewale/vaders/blob/main/CLAUDE.md — state sync architecture, WebSocket protocol
-->

---
transition: morph-fade
layout: center
---

# 1980s Amiga Color Cycling in a 2026 Terminal

Brightness ramps, not color jumps. Coprime tick rates across depth layers. Hash-based phase offsets so neighboring stars never pulse in sync.

<!--
This is the surprising slide. The Amiga had a 32-color palette and artists developed techniques to create compelling animation from minimal state changes. Those same techniques map directly to terminal cells which also have a single foreground color per cell. The starfield uses multiple depth layers cycling at coprime periods (15, 20, 28 ticks) to prevent lockstep. Rare bright spikes in otherwise dim ramps create scintillation. Spatial phase offsets via hash function distribution ensure neighboring stars desynchronize. The lesson from Lessons_learned.md: "Constraints breed creativity."

Sources:
- https://github.com/adewale/vaders/blob/main/Lessons_learned.md — Amiga color cycling techniques, visual effects in terminals, color visibility on black backgrounds
-->

---
transition: slide-up
layout: fact
---

# 620+

Tests across all workspaces

Property-based testing with fast-check found a color conversion bug that no hand-written test caught. Gray values 239-248 produced index 256 — out of the valid [16, 255] range.

<!--
The hexTo256Color function had been passing all example-based tests. Property-based testing with fast-check immediately found a counterexample: gray = 243 produced Math.round((243-8)/10) + 232 = 256, which is out of range. The white detection threshold was too high (>248 instead of >238). This is a textbook case for property testing: functions that map continuous inputs to bounded outputs. The invariant "output is always in [16, 255]" is trivial to assert but hard to exhaustively verify with examples. IEEE 754 edge cases also surfaced — lerp(-0, 0, 0) returns 0 not -0, Math.floor(-5e-324) returns -1. The solution: constrain generators to realistic ranges rather than patching code.

Sources:
- https://github.com/adewale/vaders/blob/main/Lessons_learned.md — property-based testing, hexTo256Color bug, IEEE 754 edge cases
- https://github.com/adewale/vaders/blob/main/CHANGELOG.md — 620+ tests, property-based collision tests
-->

---
transition: fade
layout: end
---

# Accept the constraint. It becomes the feature.

Chunky movement is retro charm. Single-color cells are Amiga cycling. Full sync is simplicity. The terminal was never the limitation.

<!--
This resolves the through-line. Every architectural decision that looks like a compromise turned out to be an advantage. Chunky cell-by-cell movement matches the Space Invaders aesthetic. The single foreground color per cell enabled techniques borrowed from 1980s Amiga artists. Full state sync avoided complexity and the simplicity made debugging trivial. The 120x36 grid forced braille sprite art that gives the game its distinctive visual identity. The project proves that working within constraints — rather than fighting them — produces coherent, opinionated software.

Sources:
- https://github.com/adewale/vaders/blob/main/Lessons_learned.md — key principles summary, accept terminal constraints
-->
