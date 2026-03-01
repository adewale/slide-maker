# Deck Spec

## Meta
- title: Build & Deploy AI-Powered Agents
- purpose: walk through the Cloudflare Agents SDK — from Durable Objects to tool calling to durable workflows
- audience: developers building AI agents on Cloudflare Workers
- tone: practical, energetic, workshop-style
- target-length: 14
- notes: no
- style-preset: cloudflare

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
- title: Build & Deploy AI-Powered Agents
- subtitle: Cloudflare Workers, Durable Objects, and the Agents SDK.

### Slide 2
- kind: statement
- layout: statement
- title: What if your AI could remember, act, and coordinate on its own?

### Slide 3
- kind: section
- layout: section
- title: Agent Foundations

### Slide 4
- kind: default-content
- layout: default
- title: What the Agents SDK gives you

### Slide 5
- kind: default-content
- layout: two-cols
- title: Agent vs AIChatAgent

### Slide 6
- kind: default-content
- layout: default
- title: Batteries included

### Slide 7
- kind: section
- layout: section
- title: Core Concepts

### Slide 8
- kind: default-content
- layout: default
- title: Tool calling

### Slide 9
- kind: default-content
- layout: default
- title: State management — Durable Objects under the hood

### Slide 10
- kind: default-content
- layout: default
- title: Durable workflows

### Slide 11
- kind: fact
- layout: fact
- title: 0ms cold starts

### Slide 12
- kind: default-content
- layout: default
- title: Best practices

### Slide 13
- kind: quote
- layout: quote
- title: The agent is the application

### Slide 14
- kind: end
- layout: end
- title: Start building
