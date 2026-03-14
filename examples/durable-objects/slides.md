---
theme: default
title: What Are Durable Objects For?
selectable: true
routerMode: hash
colorSchema: light
fonts:
  sans: Inter
  mono: JetBrains Mono
  weights: '400,500,600,700'
transition: slide-left
layout: cover
---

# What Are Durable Objects For?

What happens when you give a function a name, a memory, and a mailbox?

<!-- The central question isn't technical — it's philosophical. Serverless promised to abstract away servers. It succeeded. But it also abstracted away state, coordination, and identity. Durable Objects give those back — not by reverting to servers, but by making functions into entities.

Sources:
- https://developers.cloudflare.com/durable-objects/ — official documentation
- https://developers.cloudflare.com/agents/ — Agents SDK built on DOs -->

---
layout: statement
transition: fade
---

# A Worker is stateless. A database is shared. What lives in between?

<!-- This is the coordination gap. Workers handle requests but forget everything between them. Databases remember but can't coordinate in real-time. The gap between "fast and forgetful" and "slow and shared" is where most real-time applications break down.

Sources:
- https://developers.cloudflare.com/durable-objects/ — "Durable Objects provide low-latency coordination and consistent storage" -->

---
transition: slide-left
---

# Workers are fast and forgetful

Cloudflare Workers run your code at the edge — auto-scaling, sub-millisecond cold starts.

But a Worker forgets you the moment it responds.

<v-clicks>

- Need real-time sync? Workers can't hold WebSocket state.
- Need per-entity memory? Workers share nothing between requests.
- Need coordination? Workers race against each other.

</v-clicks>

The platform gives you speed and scale. It doesn't give you identity.

<!-- Workers are extraordinary for stateless compute. The gap becomes visible only when you try to build something that needs to remember, coordinate, or persist between requests — which is most interesting applications.

Sources:
- https://developers.cloudflare.com/workers/ — Workers platform overview
- https://developers.cloudflare.com/durable-objects/ — coordination and state management -->

---
transition: slide-left
---

# Neither Workers nor D1 solve coordination

Problems that fall between stateless compute and shared storage:

<v-clicks>

- **Real-time sync** — 4 players need the same game state within 16ms
- **Per-entity state** — each music session holds its own pattern and tempo
- **Long-lived connections** — a WebSocket that outlives a single request
- **Coordination without contention** — no row locks, no race conditions

</v-clicks>

Durable Objects fill this gap. One per entity. Single-threaded. Named.

<!-- Each bullet is a real product requirement from the case studies later in this deck. The 16ms game sync is Vaders. The per-entity music session is Keyboardia. The "no race conditions" is the killer feature — single-threaded execution means coordination is free.

Sources:
- https://github.com/adewale/vaders/blob/main/docs/server-architecture.md — 30Hz game loop with full state broadcast
- https://developers.cloudflare.com/durable-objects/ — single-threaded execution guarantee -->

---
transition: slide-left
---

# The race condition that changed everything

A collaborative document editor built on Workers + D1. Two users edit the same paragraph simultaneously.

Worker A reads the paragraph, applies edit, writes to D1.
Worker B reads the paragraph, applies edit, writes to D1.
Worker B's write lands second. Worker A's edit vanishes.

<v-clicks>

- Optimistic locking? Adds retries, complexity, and user-visible conflicts.
- Row-level locks? D1 is SQLite — no concurrent writers.
- CRDTs? Now you're building a distributed systems library.

</v-clicks>

One Durable Object per document. Single-threaded. Problem gone.

<!-- The race condition illustrates the fundamental problem that Workers + D1 cannot solve: per-entity coordination without contention. Moving to one DO per document eliminates the entire category of bug — not by solving concurrency, but by removing it.

Sources:
- https://developers.cloudflare.com/durable-objects/best-practices/ — single-threaded execution prevents data races
- https://developers.cloudflare.com/d1/ — D1 uses SQLite, which has a single-writer constraint -->

---
layout: section
transition: iris
---

# Three primitives

A name, a memory, and a mailbox.

<!-- The section header is the thesis in compressed form. Everything Durable Objects do reduces to three capabilities. The rest of the deck shows these three primitives solving three completely different problems. -->

---
transition: slide-left
---

# A name — globally unique identity

Every Durable Object is a singleton, accessed by a stable name.

```ts
// Get a stub by name — globally unique, always the same instance
const id = env.GAME_SERVER.idFromName("room-42");
const stub = env.GAME_SERVER.get(id);
```

- `idFromName()` is deterministic — same name, same instance
- No load balancers, no service discovery, no routing tables
- The name **is** the address

<!-- In traditional architectures, routing a request to the right instance requires service discovery, load balancers, sticky sessions, or consistent hashing. With DOs, the name IS the routing. "room-42" always means the same instance, globally.

Sources:
- https://developers.cloudflare.com/durable-objects/api/namespace/ — idFromName() API
- https://github.com/adewale/vaders/blob/main/docs/server-architecture.md — room-based naming for game sessions -->

---
transition: glide
---

# A memory — state that survives

In-memory JavaScript state + SQLite persistence. Single-threaded guarantee means no race conditions.

```ts
export class GameServer extends DurableObject {
  players = new Map<string, Player>();
  frame = 0;
  async onStart() {
    const saved = await this.ctx.storage.get("state");
    if (saved) this.players = new Map(saved.players);
  }
}
```

- In-memory state is fast — no database round-trips during gameplay
- SQLite persists across restarts — state survives eviction
- **Single-threaded** — one request at a time, zero data races

<!-- The memory primitive has two layers: fast in-memory state for hot paths (game frames, pattern updates) and durable SQLite for cold persistence (reconnection, crash recovery). The single-threaded guarantee means no locks, mutexes, or CAS operations.

Sources:
- https://developers.cloudflare.com/durable-objects/api/storage-api/ — SQLite-backed persistent storage
- https://github.com/adewale/vaders/blob/main/docs/server-architecture.md — in-memory game state with SQLite backup -->

---
transition: glide
---

# A mailbox — real-time connections

WebSocket connections that the DO owns, broadcasts to, and can hibernate.

```ts
async webSocketMessage(ws: WebSocket, msg: string) {
  this.handleInput(ws, JSON.parse(msg));
}
broadcast(data: string) {
  for (const ws of this.ctx.getWebSockets()) {
    ws.send(data);
  }
}
```

- `acceptWebSocket()` promotes an HTTP request to a persistent connection
- `getWebSockets()` returns all live connections to this instance
- **Hibernation** — idle connections sleep at zero cost, wake on message

<!-- The mailbox primitive turns a function into a real-time server. The DO owns its WebSocket connections — it can enumerate them, broadcast to them, and hibernate them. This is fundamentally different from a stateless WebSocket relay.

Sources:
- https://developers.cloudflare.com/durable-objects/api/websockets/ — WebSocket Hibernation API
- https://github.com/adewale/vaders/blob/main/docs/server-architecture.md — WebSocket broadcast pattern for game state -->

---
layout: fact
transition: fade
---

# 0ms

cold starts

Each instance is a named, stateful, connected entity.

<!-- Zero millisecond cold starts because DOs run on the same V8 isolate infrastructure as Workers. But unlike Workers, they persist state between requests.

Sources:
- https://developers.cloudflare.com/durable-objects/ — "Durable Objects have zero cold starts" -->

---
layout: section
transition: iris
---

# A function with a name becomes a game server

Vaders — multiplayer TUI Space Invaders on Durable Objects.

---
transition: slide-left
---

# The problem

4-player real-time multiplayer in a 120x36 terminal.

- State must sync at **30Hz** with zero desync
- Players connect from different edges worldwide
- Terminal rendering is character-by-character — every frame is a full snapshot
- One source of truth, or the game breaks

<!-- The terminal constraint makes this harder than a browser game. There's no partial DOM update — every frame is a complete character grid sent as a single string. The DO must compute, serialize, and broadcast a full frame at each tick. The Vaders server architecture uses a pure reducer pattern: inputs go in, deterministic state comes out.

Sources:
- https://github.com/adewale/vaders/blob/main/docs/server-architecture.md — 30Hz game loop, full state broadcast, pure reducer pattern
- https://github.com/adewale/vaders/blob/main/Lessons_learned.md — TUI rendering constraints and frame synchronization -->

---
transition: slide-up
---

# The DO pattern — alarm-driven broadcast

The alarm fires 30 times per second. Each tick: advance state, serialize, broadcast.

```ts
async alarm() {
  this.frame++;
  this.updatePositions();
  this.checkCollisions();
  this.broadcast(this.serialize());
  this.ctx.storage.setAlarm(Date.now() + 33); // ~30Hz
}
```

- **Server-authoritative** — clients send inputs, DO computes state
- **Alarm loop** — `setAlarm()` is the game clock, not `setInterval`
- **No desync** — one thread, one state, one broadcast per frame

<!-- Alarms instead of setInterval because alarms are durable — they survive hibernation and process restarts. setInterval dies when the isolate evicts. The alarm fires, the frame advances, the state broadcasts. The Vaders architecture documents this as the "alarm-driven broadcast" pattern.

Sources:
- https://github.com/adewale/vaders/blob/main/docs/server-architecture.md — alarm-driven broadcast loop at 30Hz
- https://github.com/adewale/vaders/blob/main/Lessons_learned.md — why alarms over setInterval for game timing -->

---
transition: slide-left
---

# Server-authoritative architecture

```mermaid {theme: 'base', scale: 0.85}
graph LR
  P1["Player 1"] -->|WS| DO["Game DO"]
  P2["Player 2"] -->|WS| DO
  P3["Player 3"] -->|WS| DO
  DO -->|broadcast| P1 & P2 & P3
  style DO fill:#ff4801,stroke:#521000,color:#fff
```

Notice: all arrows from players carry only inputs (keystrokes). All arrows from the DO carry full state. Players never compute game logic — they render what the DO tells them. This prevents cheat clients.

<!-- The asymmetry is the insight. Input messages are tiny (~20 bytes for a keystroke). Broadcast messages are large (full frame buffer). The DO is the only source of truth — a modified client can't inject false game state because the DO ignores anything that isn't a raw input event. The Vaders server architecture enforces this as a "pure reducer" — game state is computed entirely server-side.

Sources:
- https://github.com/adewale/vaders/blob/main/docs/server-architecture.md — server-authoritative architecture with input/state asymmetry
- https://github.com/adewale/vaders/blob/main/Lessons_learned.md — pure reducer pattern preventing cheat clients -->

---
layout: section
transition: iris
---

# A function with a mailbox becomes a jam session

Keyboardia — collaborative polyrhythmic step sequencer.

---
transition: slide-left
---

# The problem

10 musicians collaborating in real-time. Each has their own time signature.

- **Polyrhythm** — Player A is in 4/4, Player B is in 7/8, Player C is in 5/4
- Latency must be **<50ms** or the groove falls apart
- Audio is latency-sensitive — it cannot round-trip through a server
- Session state must survive disconnects

<!-- Audio latency is the hard constraint. At 120 BPM, a sixteenth note is 125ms. If round-trip latency exceeds ~50ms, musicians perceive the delay. Audio CANNOT go through the server. The DO must coordinate patterns without touching audio.

Sources:
- https://developers.cloudflare.com/durable-objects/api/websockets/ — WebSocket Hibernation enabling persistent musician connections -->

---
transition: slide-up
---

# The DO pattern — session relay with KV backup

The DO relays pattern state. Audio never touches the server.

- **Session hub** — one DO per jam session, holds all player patterns
- **Relay, not render** — pattern changes broadcast, audio rendered locally
- **KV backup** — on disconnect, player state writes to KV. Rejoin restores.
- **Zero server-side audio** — the DO manages coordination, not computation

<!-- The key architectural decision is what the DO does NOT do: it doesn't touch audio. The insight is that you only need to sync the pattern — which notes are active at which steps. Audio synthesis happens locally via Web Audio API. The DO is a coordination hub, not an audio engine.

Sources:
- https://developers.cloudflare.com/durable-objects/ — coordination primitive for session management
- https://developers.cloudflare.com/kv/ — KV for backup state on disconnect -->

---
layout: two-cols
transition: wipe-right
---

# What the DO handles

- Session membership (join/leave)
- Pattern state (which steps are active)
- Tempo and time signature sync
- Broadcast on pattern change
- KV backup on disconnect

::right::

# What the client handles

- Audio synthesis (Web Audio API)
- Local playback and scheduling
- Instrument rendering
- Step sequencer UI
- Latency compensation

<!-- This split is the entire architecture. The line between server and client is drawn at the boundary between coordination (DO) and computation (client). Everything shared goes through the DO. Everything fast stays local.

Sources:
- https://developers.cloudflare.com/durable-objects/ — DO as coordination primitive, not compute engine -->

---
layout: section
transition: iris
---

# A function with a memory becomes an agent

Cloudflare Agents SDK — persistent AI agents on Durable Objects.

<!-- The third case study reveals that the same three primitives power AI agents. The Agents SDK is a framework built on DOs that gives agents identity (name), persistent memory (state), and real-time communication (mailbox).

Sources:
- https://developers.cloudflare.com/agents/ — Agents SDK built on Durable Objects
- https://github.com/cloudflare/agents — open source SDK -->

---
transition: slide-left
---

# The problem

AI agents need persistent memory, tool access, and the ability to wake on demand.

- A stateless Worker forgets the conversation after every request
- Tool results need to persist across turns
- Agents must **sleep** when idle and **wake** when needed
- Multi-step workflows crash mid-pipeline — no checkpoint, no resume

<!-- The agent problem is the coordination gap in its purest form. An LLM call is stateless. But an agent needs to remember, plan, and execute across multiple turns. Without persistence, every turn starts from scratch.

Sources:
- https://developers.cloudflare.com/agents/ — agent persistence and lifecycle management -->

---
transition: slide-up
---

# Agent vs AIChatAgent

The SDK provides two base classes. `Agent` is the low-level primitive. `AIChatAgent` adds chat-specific conveniences.

```ts
// AIChatAgent: auto-persisted chat history, streaming, tool calling
export class MyAgent extends AIChatAgent {
  async onChatMessage(onFinish) {
    await generateText({
      model: openai("gpt-4o"),
      messages: this.messages, // auto-persisted in DO storage
      tools: this.server.tools,
      onFinish,
    });
  }
}
```

- `Agent` — lifecycle hooks, state, communication, scheduling
- `AIChatAgent extends Agent` — adds `this.messages`, streaming, tools
- Both persist everything in the DO — history survives restarts

<!-- Agent is for any long-lived stateful process (not just chat). AIChatAgent adds auto-persisted chat history with streaming. Most AI agent use cases want AIChatAgent, but the base Agent class is right for non-conversational workflows.

Sources:
- https://developers.cloudflare.com/agents/api-reference/agents-api/ — Agent and AIChatAgent API -->

---
transition: glide
---

# The Agent API surface

```ts
export class MyAgent extends Agent {
  // Lifecycle
  async onStart() { }        // DO created or woken
  async onConnect(conn) { }   // WebSocket connected
  async onMessage(conn, msg) { } // message received
  async onClose(conn) { }     // WebSocket closed

  // State — SQLite-backed, real-time sync to clients
  setState(newState)           // persists + broadcasts

  // Communication
  broadcast(data)              // send to all connected clients

  // Orchestration
  async schedule(callback, delay)  // delayed execution
}
```

Lifecycle hooks, persistent state, broadcast, and scheduling — all in one class.

<!-- The API surface reveals how thin the abstraction is. onStart maps to the DO's constructor/alarm wake. onConnect/onMessage/onClose map to WebSocket handlers. setState wraps ctx.storage with automatic client broadcast. The Agent class doesn't add new capabilities — it makes existing DO capabilities accessible.

Sources:
- https://developers.cloudflare.com/agents/api-reference/agents-api/ — complete Agent API reference -->

---
transition: glide
---

# State that syncs

`setState()` persists to SQLite and broadcasts to all connected clients in one call.

```ts
// Server: update state — persists AND broadcasts
this.setState({ ...this.state, status: "processing", progress: 0.5 });

// Client: state updates arrive automatically
agent.on("state", (newState) => {
  renderProgress(newState.progress);
});
```

- **SQLite persistence** — state survives DO eviction and restarts
- **Real-time sync** — connected clients see changes instantly
- **No manual serialization** — the SDK handles JSON ↔ SQLite

<!-- setState is the "memory" primitive made ergonomic. In a raw DO, you'd write to ctx.storage and manually broadcast. The Agent SDK collapses both into one call. This pattern is identical to how the game server broadcasts frames, but at a higher abstraction level.

Sources:
- https://developers.cloudflare.com/agents/api-reference/agents-api/#setstate — setState API with persistence + broadcast -->

---
transition: glide
---

# Tool calling anatomy

Tools are functions with a description, a schema, and an execute handler.

```ts
const tools = {
  lookupUser: {
    description: "Find user by email",
    parameters: z.object({ email: z.string().email() }),
    execute: async ({ email }) => {
      return await db.query(
        "SELECT * FROM users WHERE email = ?", [email]
      );
    },
  },
};
```

- **Description** — the LLM reads this to decide when to call the tool
- **Zod schema** — validates parameters before execution
- **Execute** — runs in the DO's single-threaded context (no races)

<!-- Tool execution inside a DO is uniquely safe. Because the DO is single-threaded, a tool that reads and writes state can't race with another tool call. This is the "coordination without contention" primitive applied to AI agents.

Sources:
- https://developers.cloudflare.com/agents/api-reference/agents-api/#tools — tool definition and execution -->

---
transition: slide-up
---

# Durable workflows

`AgentWorkflow` chains steps with automatic checkpointing. Each `step.do()` runs at-most-once — if the workflow crashes, it resumes from the last completed step.

```ts
const workflow = new AgentWorkflow();
workflow.addStep("fetch-data", async (step) => {
  return await step.do("fetch", { retries: 3 }, async () => {
    return await fetchExternalAPI();
  });
});
workflow.addStep("process", async (step) => {
  const approval = await step.waitForEvent("approval");
  return await processData(step.previousResult);
});
```

- **Checkpointed** — `step.do()` is at-most-once, crash-safe
- **Configurable retries** — per-step retry policies
- **Human-in-the-loop** — `waitForEvent()` durably pauses

Sources:
- https://developers.cloudflare.com/agents/api-reference/agent-workflow/ — AgentWorkflow API -->

---
transition: slide-left
---

# Scheduling modes

Agents can wake themselves — delayed, recurring, or at specific times.

- **Delayed** — `schedule(() => check(), { delay: "5m" })`
- **Cron** — `schedule(() => report(), { cron: "0 9 * * 1" })`
- **Interval** — `schedule(() => poll(), { interval: "30s" })`
- **Specific date** — `schedule(() => remind(), { at: new Date("2025-03-15") })`

All scheduling survives hibernation. The agent sleeps at zero cost and wakes precisely when needed.

<!-- Scheduling wraps DO alarms with human-readable syntax. The key property: scheduled callbacks survive hibernation. An agent that schedules a Monday morning report will wake up Monday at 9am even if it's been hibernated all weekend.

Sources:
- https://developers.cloudflare.com/agents/api-reference/agents-api/#schedule — schedule API with delay, cron, interval modes -->

---
transition: slide-up
---

# MCP server pattern

An agent can expose its capabilities via Model Context Protocol — making it callable by other AI tools, IDEs, and agents.

```ts
export class MyAgent extends Agent {
  get mcpServer() {
    return new McpServer({
      tools: this.tools,
      resources: this.getResources(),
    });
  }
}
```

- **Tools as MCP tools** — agent capabilities become callable
- **Resources as MCP resources** — agent state becomes readable
- **Composable** — agents can call other agents' MCP servers

<!-- The MCP server pattern inverts the agent's role. Instead of the agent calling tools, external systems call the agent AS a tool. This enables agent composition — a planning agent calls a research agent's MCP server.

Sources:
- https://developers.cloudflare.com/agents/model-context-protocol/ — MCP integration
- https://modelcontextprotocol.io/ — MCP specification -->

---
layout: quote
transition: fade
---

# "The agent is the application"

When state, tools, and reasoning live in one Durable Object, the agent stops being a wrapper and becomes the product. The DO is the agent. The agent is the application.

<!-- This applies beyond agents. When state, coordination, and identity live in one DO, the function stops being a handler and becomes an entity. The game server IS the game. The session hub IS the jam session. The agent IS the product.

Sources:
- https://github.com/cloudflare/agents — reference implementations
- https://developers.cloudflare.com/agents/ — "agent as application" pattern -->

---
layout: center
transition: morph-fade
---

# A name, a memory, a mailbox

The same three primitives. Three different products.

A game server. A jam session. An autonomous agent.

<!-- Three wildly different products — a game, a music tool, an AI agent — all built on the same three primitives. The function didn't change. The primitives did the work. -->

---
transition: slide-left
---

# When to use what

- **Durable Objects** — per-entity coordination, real-time sync, WebSocket state
- **D1** — relational queries across entities, SQL joins, analytics
- **KV** — global read-heavy config, feature flags, cached lookups
- **R2** — large binary blobs, images, audio files, backups

The question is not "which storage?" but "what's the coordination pattern?"

<!-- DOs are not a database replacement — they're a coordination primitive. Use D1 when you need to query across entities. Use KV for globally distributed reads. Use R2 for blobs. Use DOs when you need a named, stateful, connected entity.

Sources:
- https://developers.cloudflare.com/durable-objects/best-practices/ — when to use DOs vs other primitives -->

---
layout: center
transition: fade
---

# Give a function a name, a memory, and a mailbox

It becomes a game server, a jam session, or an autonomous agent.

The function doesn't change. The primitives do the work.

<!-- The penultimate slide restates the thesis with all three case studies as evidence. The pattern should feel inevitable — of course these are the right primitives, because they keep working.

Sources:
- https://github.com/adewale/vaders — game server case study
- https://developers.cloudflare.com/agents/ — autonomous agent case study -->

---
layout: end
transition: fade
---

# Every distributed system eventually reinvents the mailbox

<!-- The closing resolves the opening question. "What happens when you give a function a name, a memory, and a mailbox?" — it becomes whatever you need. Every distributed system that coordinates in real-time ends up building these three primitives anyway. Durable Objects just give them to you from the start.

Sources:
- https://developers.cloudflare.com/durable-objects/ — the three primitives
- https://developers.cloudflare.com/agents/ — agents as proof of the pattern
- https://github.com/adewale/vaders — game server as proof of the pattern -->
