---
theme: default
title: Build & Deploy AI-Powered Agents
colorSchema: light
fonts:
  sans: Work Sans
  serif: DM Sans
  mono: IBM Plex Mono
transition: slide-left
layout: cover
---

# Build & Deploy AI-Powered Agents

Cloudflare Workers, Durable Objects, and the Agents SDK.

<!-- This tutorial walks through building AI agents on Cloudflare's platform. -->

---
layout: statement
transition: morph-fade
---

# What if your AI could remember, act, and coordinate on its own?

---
layout: section
transition: fade
---

# Agent Foundations

From stateless functions to persistent, autonomous agents.

---
transition: slide-left
---

# What the Agents SDK gives you

<v-clicks>

- **Durable Objects** — each agent gets its own persistent state and WebSocket
- **Hibernation** — idle agents sleep at zero cost, wake on demand
- **Tool calling** — expose capabilities the LLM can invoke
- **Durable workflows** — multi-step pipelines that survive crashes
- **AI Gateway** — observability, caching, and rate limiting built in
- **MCP support** — connect agents to external tool servers

</v-clicks>

---
layout: two-cols
transition: wipe-right
---

# Agent vs AIChatAgent

<v-clicks>

- Low-level base class
- Manual WebSocket handling
- Full control over message loop
- Build any protocol

</v-clicks>

::right::

# AIChatAgent

<v-clicks>

- High-level chat abstraction
- Built-in message history
- Streaming responses out of the box
- AI SDK compatible

</v-clicks>

---
transition: fade
---

# Batteries included

<div v-motion :initial="{ y: 30, opacity: 0 }" :enter="{ y: 0, opacity: 1, transition: { delay: 200, duration: 600 } }">

```ts
export class SupportAgent extends AIChatAgent {
  async onChatMessage(onFinish) {
    return this.generateText({
      model: openai("gpt-4o-mini"), system: "You are a helpful support agent.",
      messages: this.messages, tools: this.tools, onFinish,
    });
  }
}
```

</div>

One class. WebSocket connections, chat history, tool dispatch, and state persistence handled for you.

<!-- The key insight — one class gives you everything. WebSocket, history, tools, state. -->

---
layout: section
transition: iris
---

# Core Concepts

Tools, state, and workflows.

---
transition: slide-up
---

# Tool calling

Expose capabilities the LLM can invoke autonomously.

```ts
tools = [{
  name: "searchKnowledge",
  description: "Search the support knowledge base",
  parameters: z.object({ query: z.string() }),
  execute: async ({ query }) =>
    this.env.AI.run("@cf/bge-base-en-v1.5", { text: [query] }),
}];
```

<v-clicks>

- Validate all tool inputs with <v-mark at="1" color="#ff6633" type="underline">Zod schemas</v-mark>
- Gate destructive actions behind human approval
- Return structured data the model can reason over

</v-clicks>

---
transition: glide
---

# State management

Each agent instance is a Durable Object with built-in SQLite.

<v-clicks>

- **Per-instance storage** — SQL queries, key-value, or raw bytes
- **WebSocket connections** — broadcast state changes to all clients
- **Hibernation** — schedules survive sleep and deployments
- <v-mark at="5" color="#ff6633" type="underline">**Single-threaded guarantee**</v-mark> — no race conditions on state

</v-clicks>

---
transition: slide-left
---

# Durable workflows

Multi-step pipelines that checkpoint after each step and resume on failure.

```ts
export class TicketWorkflow extends WorkflowEntrypoint {
  async run(event, step) {
    const ticket = await step.do("create-ticket", async () => createTicket(event.payload));
    await step.sleepUntil("wait-for-approval", ticket.reviewDate);
    await step.do("get-approval", async () => checkApproval(ticket.id));
  }
}
```

<v-clicks>

- Crashes resume from the last completed step
- Human-in-the-loop with `sleepUntil`

</v-clicks>

---
layout: fact
transition: zoom-in
---

# 0ms

Cold starts

Agents run on Cloudflare's global edge network. Durable Objects pin to the nearest region.

---
transition: fade
---

# Best practices

<v-clicks>

1. **Validate all tool inputs** — Zod schemas at the boundary
2. **Gate destructive actions** — require human approval for writes
3. **Hibernate idle agents** — zero cost when no connections
4. **Enable observability** — AI Gateway logs every call
5. **Use workflows for multi-step** — don't chain promises by hand

</v-clicks>

<!-- These five rules prevent the most common agent bugs. -->

---
layout: quote
transition: morph-fade
---

# "The agent is the application"

When state, tools, and reasoning live in one Durable Object, the agent stops being a wrapper and becomes the product.

---
layout: end
transition: fade
---

# Start building

`npx create-cloudflare@latest my-agent --template cloudflare/agents-starter`
