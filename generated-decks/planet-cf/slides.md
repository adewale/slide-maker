---
theme: default
title: Planet CF
colorSchema: light
transition: slide-left
layout: cover
fonts:
  sans: Inter
  mono: JetBrains Mono
  weights: '400,500,600,700'
---

# Planet CF

What happens when Python runs inside JavaScript?

<!-- Planet CF is a feed aggregator for Cloudflare-adjacent blogs, built entirely in Python on Cloudflare Workers. Python runs in WebAssembly inside V8 isolates via Pyodide. The project aggregates RSS/Atom feeds with hourly updates, offers semantic search via Vectorize and Workers AI, and uses GitHub OAuth for admin authentication. It serves www.planetcloudflare.dev.

Sources:
- https://github.com/adewale/planet_cf/blob/main/README.md — project description and feature list -->

---
transition: fade
---

# Five services, one Worker

<v-clicks>

- **Scheduler** — cron-triggered, enqueues each feed as a queue message
- **Queue consumer** — fetches, parses, sanitizes, and embeds entries
- **HTTP handler** — generates HTML, RSS, Atom, OPML on demand
- **Vectorize** — 768-dimension semantic search index
- **Workers AI** — `bge-base-en-v1.5` embeddings with CLS pooling

</v-clicks>

<v-click>

All Python. All at the edge. One-hour edge cache, no KV needed.

</v-click>

<!-- The architecture is deceptively simple: a cron trigger runs hourly, enqueuing each active feed as a separate queue message. Queue consumers fetch feeds with 30-second HTTP timeouts and 60-second processing timeouts. Failed fetches retry up to 3 times before hitting the dead-letter queue. The HTTP handler generates all content on-demand — no pre-rendering — with Cloudflare's edge cache providing the performance layer. Vectorize stores 768-dimension embeddings for semantic search, with Workers AI generating them using the bge-base-en-v1.5 model with CLS pooling (not mean pooling — CLS is better for search).

Sources:
- https://github.com/adewale/planet_cf/blob/main/docs/ARCHITECTURE.md — system overview and component descriptions
- https://github.com/adewale/planet_cf/blob/main/src/config.py — HTTP_TIMEOUT_SECONDS=30, FEED_TIMEOUT_SECONDS=60, default search parameters -->

---
layout: section
transition: iris
---

# Every boundary is a type conversion

When Python lives inside V8, every API call crosses a world.

<!-- This is the central design insight. Pyodide (the Python-in-WebAssembly runtime) returns JsProxy objects when interacting with JavaScript APIs. These look like Python objects but aren't subscriptable or iterable. request.form_data() returns JsProxy FormData, not a Python dict. env.AI.run() results need conversion. env.SEARCH_INDEX.query() results need conversion. The TypeError: 'pyodide.ffi.JsProxy' object is not subscriptable error was one of the first production failures.

Sources:
- https://github.com/adewale/planet_cf/blob/main/docs/LESSONS_LEARNED.md — Lesson 1 (JsProxy Conversion is Critical) and Lesson 2 (Create a Boundary Layer for JS/Python Types) -->

---
layout: two-cols
transition: wipe-right
---

# The boundary layer

<v-clicks>

- JS APIs return `JsProxy`, not `dict`
- Python `None` becomes JS `undefined`
- D1 rejects `undefined` — needs `null`

</v-clicks>

::right::

<v-clicks>

- `SafeD1`, `SafeVectorize`, `SafeAI` wrappers
- Convert at the edge, once
- Business logic sees pure Python types

</v-clicks>

<!-- The wrappers.py module is 500+ lines, but the idea is simple: a thin boundary that quarantines JavaScript types. SafeD1Statement.bind() converts Python None to proper JS null via js.JSON.parse("null") — because Python None becomes JS undefined, and D1 rejects undefined for SQL NULL. SafeD1Statement.first() and .all() convert JsProxy results to Python dicts immediately. SafeVectorize.query() does the same for search results. SafeAI.run() handles embedding responses. The core business logic in main.py, admin.py, and models.py never imports pyodide.ffi and never checks for JsProxy. That complexity lives in one file.

Sources:
- https://github.com/adewale/planet_cf/blob/main/src/wrappers.py — boundary layer implementation with SafeD1, SafeVectorize, SafeAI
- https://github.com/adewale/planet_cf/blob/main/docs/LESSONS_LEARNED.md — Lesson 2 architecture diagram showing JS APIs / Boundary Layer / Python Core -->

---
transition: slide-up
---

# Three kinds of nothing

| Value | `is None` | `bool()` | `type().__name__` |
|-------|:---------:|:--------:|:------------------:|
| Python `None` | `True` | `False` | `NoneType` |
| JS `null` | **`False`** | `False` | `JsNull` |
| JS `undefined` | **`False`** | `False` | `JsUndefined` |

<v-click>

`if x is None` catches one out of three.

Every boundary function needs `_is_js_undefined()` as a guard.

</v-click>

<!-- This is the most insidious gotcha in Pyodide. JavaScript null does NOT become Python None — it becomes a JsNull object where isinstance(value, type(None)) is False but bool(value) is also False. The standard Python pattern "if x is None: return default" silently passes JsNull and JsUndefined through, leading to TypeErrors downstream. Planet CF's _is_js_undefined() checks type(x).__name__ against a set containing both "JsNull" and "JsUndefined". This pattern was discovered after mock tests passed but production crashed — mocks return Python None, not JsNull.

Sources:
- https://github.com/adewale/planet_cf/blob/main/docs/LESSONS_LEARNED.md — Lesson 17 (Pyodide FFI Type-Compatibility Matrix) and Lesson 21 (is None is Never Enough at the FFI Boundary) -->

---
layout: fact
transition: fade
---

# 21

hard-won lessons

From JsProxy to SSRF protection, embedded templates to hybrid search — documented while building on Cloudflare Python Workers.

<!-- The LESSONS_LEARNED.md file is a 21-entry knowledge base covering: (1) JsProxy conversion, (2) boundary layers, (3) mocks don't catch JsProxy issues, (4) templates must be embedded (no filesystem in Workers), (5) hybrid search beats pure semantic, (6) D1 LIKE queries need escaping, (7) SSRF protection must block private IPs and cloud metadata endpoints, (8) feed dates can be missing or malformed, (9) stateless sessions via HMAC-signed cookies, (10) Workers AI embedding model choice, (11) content sanitization with bleach, (12) queue error handling, (13) observability from day one, (14) E2E test cleanup, (15) search ranking with exact matches first, (16) real infrastructure tests, (17) the full FFI type-compatibility matrix, (18) visual fidelity for Planet/Venus conversion, (19) deterministic E2E tests via synchronous endpoints, (20) two-tier FFI testing with Pyodide fakes, (21) is None is never enough. Each lesson includes the problem, symptom, solution, and code examples.

Sources:
- https://github.com/adewale/planet_cf/blob/main/docs/LESSONS_LEARNED.md — all 21 lessons -->

---
layout: end
transition: fade
---

# Python can live inside JavaScript

But only if you draw the boundary and never cross it casually.

<!-- The resolution of the opening question. "What happens when Python runs inside JavaScript?" — it works, but every API call is a type conversion. The boundary layer pattern is the key architectural decision: thin wrappers that quarantine JS types from Python core logic. Without it, JsProxy checks leak into business logic, mocks miss production bugs, and three different kinds of "nothing" crash your code in three different ways. The lesson generalizes: when two type systems meet, draw a line, convert at the line, and never let the foreign types past it.

Sources:
- https://github.com/adewale/planet_cf/blob/main/docs/LESSONS_LEARNED.md — Lesson 2 (boundary layer pattern) and Lesson 20 (two-tier FFI testing)
- https://github.com/adewale/planet_cf/blob/main/src/wrappers.py — the boundary layer itself -->
