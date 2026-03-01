---
theme: default
title: Vaders
colorSchema: dark
fonts:
  sans: Space Grotesk
  mono: JetBrains Mono
transition: slide-left
layout: cover
---

# Vaders

Multiplayer TUI Space Invaders. 1-4 players. Cloudflare Durable Objects.

---
layout: statement
transition: fade
---

# Classic arcade reimagined for the terminal

---
layout: two-cols
transition: slide-up
---

# What you get

<v-clicks>

- **Solo mode** with 3 lives
- **Co-op** with up to 4 players
- Full TUI at 120x36 resolution
- Sound effects and music

</v-clicks>

::right::

<div class="pt-12 font-mono text-sm opacity-70">

```
  +--------------------+
  |  * * * * * * * * *  |
  |   * * * * * * * *   |
  |    * * * * * * *    |
  |        .            |
  |        |            |
  |       /^\           |
  +--------------------+
```

</div>

---

# Architecture

```mermaid {theme: 'dark', scale: 0.85}
graph LR
  P["Players 1-4"] -->|WebSocket| W["CF Worker"]
  W --> DO["Durable Object"]
  DO -->|broadcast| W
  classDef worker fill:#39ff14,stroke:#39ff14,color:#0a0a0f
  classDef state fill:#1a3a1a,stroke:#39ff14,color:#39ff14
  class W worker
  class DO state
```

---
layout: two-cols-header
---

# Four moving parts

::left::

### Client

<v-clicks>

- **Bun** runtime
- **OpenTUI React** terminal renderer
- Native audio (afplay / aplay)

</v-clicks>

::right::

### Server

<v-clicks>

- **Cloudflare Worker** routing
- **Durable Object** game state
- **WebSocket protocol** real-time sync

</v-clicks>

---
layout: section
transition: slide-up
---

# Co-op mode

Shared lives. Larger alien grid. Synchronized in real-time.

---
layout: fact
transition: fade
---

# 4

Players in real-time co-op

Synchronized via Durable Objects with shared lives and a larger alien grid

---
layout: end
transition: fade
---

# Play now

`bun install && bun run vaders`
