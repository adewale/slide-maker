---
theme: default
title: Vaders
colorSchema: light
transition: slide-left
fonts:
  sans: Outfit
  serif: Plus Jakarta Sans
  mono: Roboto Mono
  weights: '300,400,500,600,700'
layout: cover
---

# Vaders

What happens when you give a terminal a game loop?

<!--
This is a multiplayer TUI Space Invaders clone for 1-4 players, built with Bun, OpenTUI, and Cloudflare Durable Objects. The question sets up the through-line — each section answers it differently.

Sources:
- https://github.com/adewale/vaders/blob/main/README.md — project overview and feature list
-->

---
transition: morph-fade
layout: center
---

# 120 x 36 characters. Braille pixels. Color cycling.

The terminal becomes a canvas — Unicode box-drawing for sprites, Amiga-style palette rotation for animation, two-line entities on a fixed grid.

<!--
The 120x36 grid is a hard constraint. Sprites are 2-line tall, 5-char wide. Color cycling rotates through a palette array every N ticks — no per-pixel rendering needed. The UFO cycles through 6 rainbow colors. This technique dates back to Amiga demos — you shift palette indices instead of redrawing pixels.

Sources:
- https://github.com/adewale/vaders/blob/main/Lessons_learned.md — TUI rendering techniques, braille pixel art, color cycling from Amiga era
- https://github.com/adewale/vaders/blob/main/CHANGELOG.md — braille pixel art sprites, 7-wide animated sprites with gradient coloring
-->

---
transition: slide-up
layout: fact
---

# 620+

tests across three workspaces

Property-based collision checks with fast-check — not hand-picked cases, random inputs.

<!--
The test suite spans client, worker, and shared workspaces. Property-based tests with fast-check verify collision logic under random inputs, not just carefully chosen scenarios. This is unusually thorough for a game project — most TUI games ship with zero tests.

Sources:
- https://github.com/adewale/vaders/blob/main/CHANGELOG.md — 620+ tests, comprehensive test suite across all workspaces including property-based collision tests
- https://github.com/adewale/vaders/blob/main/package.json — test scripts, fast-check devDependency
-->

---
transition: iris
layout: section
---

# A function with a name, a memory, and an alarm

Each GameRoom Durable Object has identity, persistent SQLite state, and a 30Hz alarm loop.

<!--
Transition to the server architecture section. Each Durable Object is a GameRoom — it has identity (room code), persistent state (SQLite), and a game loop driven by alarms, not setInterval. Alarms are hibernation-compatible; setInterval is not.

Sources:
- https://github.com/adewale/vaders/blob/main/docs/server-architecture.md — GameRoom Durable Object, alarm-driven game loop, SQLite persistence
-->

---
transition: slide-left
layout: two-cols-header
---

# Client and server, 30 times per second

::left::

<v-clicks>

- **Pure reducer** — all state through one function
- **Seeded RNG** for deterministic replay
- **Full sync** at 30Hz — ~2KB per tick

</v-clicks>

::right::

<v-clicks>

- **WebSocket hibernation** — DO sleeps between messages
- **Alarms** replace setInterval for the tick
- **Held-state** for movement, discrete for shooting

</v-clicks>

<!--
The pure reducer returns state + events + persist flag + optional alarm schedule. This makes the game deterministic and testable. Full sync was chosen over delta because 2KB at 30Hz for 4 players is well within WebSocket limits — the optimization applied was omitting playerId and config from subsequent syncs, roughly halving payload size.

Sources:
- https://github.com/adewale/vaders/blob/main/Lessons_learned.md — pure reducer pattern, seeded RNG, full sync vs delta updates, WebSocket hibernation with Durable Objects
- https://github.com/adewale/vaders/blob/main/docs/server-architecture.md — game loop architecture, alarm scheduling, WebSocket protocol
-->

---
transition: fade
layout: default
---

# The alien march is a state machine

Seven game statuses. Explicit transition guards. No race conditions during countdown.

```
waiting -> countdown -> wipe_hold -> wipe_reveal -> playing -> game_over
                                          ^                       |
                           wipe_exit <----+---- (wave cleared) ---+
```

<v-click>

**The war story:** stale closures in keyboard handlers caused keys to "stick" during screen transitions. Fix: `useLayoutEffect` for ref updates that callbacks depend on.

</v-click>

<!--
The state machine prevents bugs like players joining mid-countdown or inputs arriving during wipe transitions. The wipe phases (wipe_exit, wipe_hold, wipe_reveal) create cinematic wave transitions between levels. The stale closure bug was discovered when keys would stay "held" after transitioning from lobby to gameplay — useRef plus useLayoutEffect solved it.

Sources:
- https://github.com/adewale/vaders/blob/main/Lessons_learned.md — state machine for game status, explicit transition guards, stale closure bug in keyboard handlers
- https://github.com/adewale/vaders/blob/main/CLAUDE.md — game statuses: waiting, countdown, wipe_exit, wipe_hold, wipe_reveal, playing, game_over
-->

---
transition: fade
layout: end
---

# It plays back.

`bun run vaders`

<!--
Circle back to the opening question. "What happens when you give a terminal a game loop?" — It plays back. The command is the invitation. The project is open source at github.com/adewale/vaders.

Sources:
- https://github.com/adewale/vaders/blob/main/README.md — quick start command
-->
