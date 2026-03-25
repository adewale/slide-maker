---
theme: default
title: Vaders
selectable: true
routerMode: hash
colorSchema: dark
transition: slide-left
layout: cover
fonts:
  sans: Outfit
  serif: Plus Jakarta Sans
  mono: Roboto Mono
  weights: '300,400,500,600,700'
---

# Vaders

An OpenTUI Space Invaders clone supporting solo play or 2-4 player co-op, synchronised via Cloudflare Durable Objects

<span style="font-family: var(--deck-font-mono); font-size: 0.85rem; color: var(--deck-muted); margin-top: 1.5rem; display: block;">github.com/adewale/vaders</span>

<!--
Vaders is a multiplayer terminal game built with Bun, TypeScript, and OpenTUI React. The server runs on Cloudflare Workers with Durable Objects providing the real-time game state. The game targets a 120x36 terminal and supports macOS/Linux audio via system players. This deck synthesizes architecture docs, lessons learned, and the source code itself -- not just the README.

Sources:
- https://github.com/adewale/vaders — project repository
- file:README.md — project description used as subtitle
-->

---
layout: default
transition: slide-left
---

# No GPU. No Pixels. No Smooth Animation.

Terminals have no GPU. No sub-pixel rendering. No smooth animation. Can you build a real-time multiplayer game in one?

<v-clicks>

- **Braille pixel art**: 14x8 grids encoded as Unicode braille -- sub-character resolution
- **Color cycling**: 6-color palette rotates every 5 ticks, the 1980s Amiga technique
- **Wave gradients**: borders shift from ocean blues to danger reds as difficulty escalates
- **30 Hz sync**: full game state, every 33ms, to every connected client

</v-clicks>

<!--
The answer is yes -- and the constraints made the game better. Each alien, player ship, and UFO is defined as a 14x8 boolean grid (pixels on/off), then converted at module load into braille Unicode characters using the 2x4 dot pattern of the braille block (U+2800). This gives sub-character resolution -- 14 pixels across 7 character cells. No GPU required. The color cycling for the UFO uses the classic Amiga technique: rotate through a palette array indexed by tick count, producing a rainbow shimmer effect from a single line of code. The wave border gradients use interpolateGradient() with presets that escalate from cool ocean tones (waves 1-2) through the signature cyan-magenta vaders palette (waves 3-4) to danger reds (wave 9+). Full state sync at 30 Hz keeps every player in lockstep.

Sources:
- file:Lessons_learned.md — Amiga color cycling techniques, "constraints breed creativity"
- file:client/src/sprites.ts — pixelsToBraille() conversion, PIXEL_ART definitions
- file:client/src/effects.ts — getUFOColor() cycling through 6 colors every 5 ticks
- file:client/src/gradient.ts — getWaveGradient() escalation from ocean to danger
-->

---
layout: section
transition: iris
---

# The Server Is the Game

<!--
Section break. The key architectural insight: in Vaders, the server is not a relay -- it IS the game. All game logic runs server-side in a pure reducer function. The client is a dumb terminal that renders whatever state the server sends. This is a deliberate rejection of client-side prediction, which would have been the "proper" networking approach for a real-time game.
-->

---
layout: center
transition: fade
---

# Full state sync at 30 Hz. No delta compression. No client prediction.

2 KB per tick with 4 players is 120 messages/second -- well within WebSocket limits. The simplicity of full sync outweighs bandwidth savings at this scale.

<!--
This is the most counterintuitive networking decision in the project. Conventional wisdom says real-time multiplayer games need delta compression and client-side prediction. Vaders rejects both. Every 33ms, the server sends the entire GameState object -- all players, all entities, all aliens, all bullets -- to every connected client. The optimization applied was surgical: omit playerId and config from subsequent syncs (sent once on join), roughly halving payload size from ~4KB to ~2KB. Delta updates were considered but not implemented. The reasoning: at 30Hz with 4 players and ~2KB payloads, the total bandwidth is roughly 60KB/s per player. Modern WebSockets handle this trivially. The complexity cost of delta compression (diffing, patching, reconciliation, edge cases) far exceeds the bandwidth cost of full sync at this scale.

Sources:
- file:docs/server-architecture.md — "Why Full Sync?" table: simplicity, correctness, debuggability
- file:Lessons_learned.md — "Start with full state sync. Only optimize if bandwidth becomes a problem"
- file:shared/protocol.ts — sync optimization: playerId and config sent once, omitted thereafter
-->

---
layout: two-cols-header
transition: slide-left
---

# Durable Objects as Game Servers

::left::

<v-clicks>

- Each room is a single-threaded DO
- Hibernatable WebSockets survive sleep
- Alarms replace `setInterval` for 30 Hz
- SQLite persists state across hibernation

</v-clicks>

::right::

<v-clicks>

- Matchmaker DO: singleton room registry
- Pure reducer: `(state, action) -> state`
- Seeded RNG (mulberry32) for determinism

</v-clicks>

<!--
The Durable Object pattern here is worth examining closely. Each GameRoom is a single-threaded actor that owns its WebSocket connections and game state. The hibernation model means Cloudflare can sleep the DO while maintaining those WebSocket connections -- the DO only wakes when a message arrives or an alarm fires. This dramatically reduces billing for idle rooms. The game tick uses ctx.storage.setAlarm(Date.now() + 33) instead of setInterval -- alarms survive hibernation, intervals do not. State is persisted to SQLite (CREATE TABLE game_state with JSON blob + next_entity_id), so the game can resume after hibernation. The Matchmaker is a separate singleton DO maintaining an in-memory room registry with stale-room cleanup after 5 minutes. The pure reducer pattern means gameReducer(state, action) returns { state, events[], persist } -- every state transition is a pure function, making the game logic trivially testable without network mocks.

Sources:
- file:worker/src/GameRoom.ts — hibernation pattern, alarm-based tick, SQLite schema
- file:docs/server-architecture.md — GameRoom lifecycle, Matchmaker architecture
- file:Lessons_learned.md — "Use hibernation-friendly patterns. Alarms, not intervals."
- file:worker/src/game/reducer.ts — pure reducer, canTransition state machine guard
-->

---
layout: center
transition: morph-fade
---

# Chunky movement is not a bug. It is the genre.

Aliens move 2 cells every 18 ticks. Players move 1 cell per tick while holding a key. Entities snap to whole character cells. Fighting the grid makes it worse -- embracing it makes it Space Invaders.

<!--
This slide captures the project's central design insight. Terminals render character cells -- there is no sub-pixel positioning. Early experiments tried smooth interpolation between server ticks, but the result felt wrong for Space Invaders. The classic game has discrete, grid-snapped movement. Aliens march in formation, stepping sideways in lockstep. The "chunky" feel is not a limitation of terminal rendering -- it IS the game feel that made the original a classic. The specific numbers matter: ALIEN_MOVE_STEP = 2 (cells per move), baseAlienMoveIntervalTicks = 18 (ticks between moves), playerMoveSpeed = 1 (cells per tick while key held). These were tuned through play, not calculated. The lesson learned entry puts it directly: "Accept this limitation rather than fighting it. Aliens moving 2 cells every 18 ticks looks correct for the genre."

Sources:
- file:Lessons_learned.md — "Smooth sub-cell animations do not work in terminals"
- file:shared/types.ts — ALIEN_MOVE_STEP = 2, baseAlienMoveIntervalTicks = 18, playerMoveSpeed = 1
- file:Lessons_learned.md — "Accept terminal constraints. Chunky movement and solid colors are features, not bugs."
-->

---
layout: default
transition: slide-up
---

# What Broke and What We Cut

<v-clicks>

- Barrier hitbox used 1x offset; rendering used 2x -- miss
- Tests that assert buggy behavior passed green -- false OK
- Y-axis tolerance compensates for move-before-check
- Cut: client prediction, seq numbers, ECS, spectator

</v-clicks>

<!--
The barrier collision bug is instructive. Rendering code placed barrier segments at barrier.x + seg.offsetX * BARRIER_SEGMENT_WIDTH (2x multiplier via the width constant), but collision code used barrier.x + seg.offsetX (1x multiplier, no width). Result: bullets passed through the visual barrier because the hitbox was in the wrong place. The fix was to copy the exact formula from rendering code into collision code -- visual rendering is always the source of truth for hitboxes. Separately, some tests had been written to document known bugs: "it('MISMATCH: bullet at visual right edge misses alien')". These tests passed, creating false confidence that collision was "working." The lesson: tests asserting buggy behavior are worse than failing tests asserting correct behavior. The Y-axis tolerance discovery was subtler: bullets move BEFORE collision detection each tick, so a bullet at y=10 moves to y=9, then collision checks against an alien at y=10. Strict bounds (y >= 10) miss this -- the 2-cell tolerance (Math.abs(bY - aY) < 2) is intentional compensation for the move-before-check pattern.

Sources:
- file:Lessons_learned.md — "Visual Rendering Code is the Source of Truth" section
- file:Lessons_learned.md — "Tests That Document Bugs Can Mask Problems" section
- file:Lessons_learned.md — "Y-Axis Tolerance is Intentional" section
- file:Lessons_learned.md — "Over-Engineering Avoided" section (cut features list)
-->

---
layout: fact
transition: fade
---

# 620+

tests across all workspaces, including property-based collision tests that caught a color conversion bug no hand-written test found

<!--
The test suite is comprehensive: unit tests for the game reducer, integration tests for the GameRoom Durable Object, property-based tests using fast-check for collision functions and color conversion. The property-based testing story is particularly sharp: hexTo256Color had been working fine in production and passing all example-based tests. fast-check immediately found gray values 239-248 that produced index 256 -- out of the valid [16, 255] range. The root cause: the white detection threshold was > 248 instead of > 238, and Math.round((243 - 8) / 10) + 232 = 256. No hand-written test had exercised these specific gray values. The fix was a single threshold change.

Even testing had to adapt to the constraint. Property-based tests worked because the terminal's bounded output space (256 colors, character-cell coordinates) made invariants easy to state.

Sources:
- file:CHANGELOG.md — "620+ tests" in v1.0.0 feature list
- file:Lessons_learned.md — "Property Tests Find Bugs Example Tests Miss" with hexTo256Color counterexample
- file:Lessons_learned.md — "Best Candidates for Property-Based Testing" table
-->

---
layout: end
transition: fade
---

# The Terminal Has No Pixels. The Game Has No Lag.

Every constraint produced a simpler answer.

<span style="font-family: var(--deck-font-mono); font-size: 0.85rem; color: var(--deck-muted); margin-top: 1.5rem; display: block;">github.com/adewale/vaders</span>

<!--
Resolves the opening challenge with the tragedy's acceptance. Slide 2 asked: can you build a real-time multiplayer game in a terminal with no GPU, no pixels, no smooth animation? The answer: yes, and the constraints never go away -- but they produced better answers than the "proper" alternatives. Full state sync instead of delta compression: simpler, correct, debuggable. Braille pixel art instead of a graphics library: portable, creative, genre-appropriate. Alarms instead of intervals: hibernation-compatible, cost-efficient. A pure reducer instead of an ECS: trivially testable, no framework overhead. The terminal will never have pixels. The game will never have lag. Every constraint is permanent, and every constraint produced a simpler answer.

Sources:
- file:Lessons_learned.md — Summary principles: "Accept terminal constraints", "Prefer full sync until it hurts", "Cut features, do not defer them"
- https://github.com/adewale/vaders — project repository
-->
