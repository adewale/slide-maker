---
theme: apple-basic
title: Planet CF
colorSchema: light
transition: slide-left
layout: cover
---

# Planet CF

A feed aggregator built on Cloudflare Python Workers.

---
layout: statement
---

# Aggregate blogs. Search semantically. Deploy in minutes.

---
transition: slide-up
---

# The pipeline

```mermaid {theme: 'neutral', scale: 0.85}
graph LR
  C["Cron Trigger"] --> Q["Queue"] --> F["Feed Fetcher"]
  F --> D1["D1 Database"] & V["Vectorize"]
  UI["Web UI"] --> D1 & V
  classDef trigger fill:#f6821f,stroke:#f6821f,color:#fff
  classDef svc fill:#fff3e0,stroke:#f6821f,color:#7c2d12
  class C trigger
  class Q,F,D1,V svc
```

---
layout: two-cols
---

# Features

<v-clicks>

- **RSS, Atom, and OPML** aggregation
- **Hourly cron** triggers
- **Semantic search** via Vectorize + Workers AI
- **Queue-based fetching** with retries

</v-clicks>

::right::

# Smart defaults

<v-clicks>

- All config optional
- Database auto-initializes
- Theme fallback prevents failures
- Empty range shows 50 most recent

</v-clicks>

---
transition: fade
---

# Multi-instance deployment

```mermaid {theme: 'neutral', scale: 0.85}
graph TD
  CB["Single Codebase"] --> PP["Planet Python"]
  CB --> PM["Planet Mozilla"]
  CB --> PC["Planet Cloudflare"]
  style CB fill:#f6821f,stroke:#f6821f,color:#fff
  style PP fill:#fff3e0,stroke:#f6821f,color:#7c2d12
  style PM fill:#fff3e0,stroke:#f6821f,color:#7c2d12
  style PC fill:#fff3e0,stroke:#f6821f,color:#7c2d12
```

One codebase, multiple deployment targets. Each instance gets its own D1 database and feed list.

---
layout: fact
---

# 500+

Feeds in Planet Python

Ready-to-deploy examples for Planet Python, Planet Mozilla, and Planet Cloudflare

---
layout: end
transition: fade
---

# Deploy your own

`git clone && npx wrangler deploy`
