# Deck Spec

## Meta
- title: What Are Durable Objects For?
- purpose: explain Durable Object patterns through real project examples (Vaders, Keyboardia, Cloudflare Agents)
- audience: developers building on Cloudflare Workers who need coordination, state, or real-time sync
- tone: practical, curious, workshop-style
- target-length: 26
- notes: no
- style-preset: cloudflare
- project-url: https://developers.cloudflare.com/durable-objects/

## Source Materials
- readme: Vaders README (multiplayer TUI Space Invaders — DO alarm loop broadcasts state at 60fps to WebSocket clients)
- architecture: Keyboardia ARCHITECTURE (collaborative music relay — DO session hub, pattern state broadcast, KV backup on disconnect, audio never touches server)
- lessons-learned: Cloudflare Agents deck (AIChatAgent extends Agent, tool calling, hibernation, durable workflows, 0ms cold starts)
- screenshots: Vaders terminal gameplay, Keyboardia step sequencer UI

## Through-Line
- concept: "What happens when you give a function a name, a memory, and a mailbox?"
- type: question
- appears-in:
  - slide 1: cover — the question is posed
  - slide 9: section — "a function with a name becomes a game server"
  - slide 13: section — "a function with a mailbox becomes a jam session"
  - slide 17: section — "a function with a memory becomes an agent"
  - slide 21: center — all three primitives, three products
  - slide 25: center — the resolution

## Design Tokens
- colors:
  - bg: "#f5f1eb"
  - fg: "#521000"
  - accent: "#ff6633"
  - accent-alt: "#b45309"
  - muted: "rgba(82, 16, 0, 0.6)"
  - surface: "#fffbf5"
  - border: "#ebd5c1"
- typography:
  - display: Work Sans
  - body: DM Sans
  - mono: IBM Plex Mono
- motion:
  - preset: medium-reveal

## Layout System
- prefer-builtins: true
- builtins:
  - cover
  - statement
  - center
  - section
  - default
  - fact
  - quote
  - two-cols
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
- title: What Are Durable Objects For?
- subtitle: What happens when you give a function a name, a memory, and a mailbox?

### Slide 2
- kind: statement
- layout: statement
- title: A Worker is stateless. A database is shared. What lives in between?

### Slide 3
- kind: default-content
- layout: default
- title: The coordination gap

### Slide 4
- kind: section
- layout: section
- title: Three primitives

### Slide 5
- kind: default-content
- layout: default
- title: A name — globally unique identity

### Slide 6
- kind: default-content
- layout: default
- title: A memory — state that survives

### Slide 7
- kind: default-content
- layout: default
- title: A mailbox — real-time connections

### Slide 8
- kind: fact
- layout: fact
- title: 0ms cold starts

### Slide 9
- kind: through-line-echo
- layout: section
- title: A function with a name becomes a game server

### Slide 10
- kind: default-content
- layout: default
- title: The problem — 4-player real-time in a terminal

### Slide 11
- kind: default-content
- layout: default
- title: The DO pattern — alarm-driven broadcast

### Slide 12
- kind: default-content
- layout: default
- title: Server-authoritative architecture

### Slide 13
- kind: through-line-echo
- layout: section
- title: A function with a mailbox becomes a jam session

### Slide 14
- kind: default-content
- layout: default
- title: The problem — 10 musicians, polyrhythm, <50ms latency

### Slide 15
- kind: default-content
- layout: default
- title: The DO pattern — session relay with KV backup

### Slide 16
- kind: comparison
- layout: two-cols
- title: What the DO handles vs what the client handles

### Slide 17
- kind: through-line-echo
- layout: section
- title: A function with a memory becomes an agent

### Slide 18
- kind: default-content
- layout: default
- title: The problem — AI agents need persistent memory

### Slide 19
- kind: default-content
- layout: default
- title: The pattern — AIChatAgent extends Agent

### Slide 20
- kind: default-content
- layout: default
- title: Durable workflows — pipelines that survive crashes

### Slide 21
- kind: center-statement
- layout: center
- title: A name, a memory, a mailbox — the same three primitives, three different products

### Slide 22
- kind: default-content
- layout: default
- title: When to use what — DO vs D1 vs KV vs R2

### Slide 23
- kind: default-content
- layout: default
- title: Best practices

### Slide 24
- kind: quote-pull
- layout: quote
- title: The agent is the application

### Slide 25
- kind: center-statement
- layout: center
- title: Through-line resolution

### Slide 26
- kind: end
- layout: end
- title: Start building
