---
theme: seriph
title: Claude History Explorer
colorSchema: dark
transition: fade
layout: cover
---

# Claude History Explorer

Search and visualize your Claude Code conversation history.

---
layout: statement
---

# Turn raw JSONL files into searchable conversations and insights

---
transition: slide-left
---

# How data flows

```mermaid {theme: 'dark', scale: 0.85}
graph LR
  A["JSONL Files"] --> B["Parser"]
  B --> C["Conversations"]
  C --> D["Search"] & E["Stats"] & F["Stories"] & G["Wrapped"]
  classDef src fill:#1e3a5f,stroke:#38bdf8,color:#38bdf8
  classDef hub fill:#38bdf8,stroke:#38bdf8,color:#0a0a0f
  class A,B src
  class C hub
```

---
layout: two-cols
---

# What it does

<v-clicks>

- **Story generation** — narratives about your work patterns
- **Concurrent detection** — find parallel instance usage
- **Regex search** across all conversations
- **Multiple exports** — JSON, Markdown, plain text

</v-clicks>

::right::

<div class="pt-4">

# Design principles

<v-clicks>

- **Read-only by design**
- Never modifies history files
- Local-first, no network
- Fast — streams JSONL lazily

</v-clicks>

</div>

---

# Nine commands

<v-clicks>

1. **projects** — list all Claude Code projects
2. **sessions** — browse conversations by project
3. **show** — display a full conversation
4. **search** — regex search with context lines
5. **stats** — token counts, model usage, tool frequencies
6. **summary** — AI-generated project summaries
7. **story** — narratives about collaboration style
8. **wrapped** — shareable year-in-review URL
9. **export** — dump to JSON, Markdown, or text

</v-clicks>

---
layout: quote
transition: slide-up
---

# "Read-only by design. Never modifies your Claude history files."

---
layout: fact
---

# 9

CLI commands

All read-only. Your data never leaves your machine.

---
layout: end
transition: fade
---

# Explore your history

`uv tool install .`
