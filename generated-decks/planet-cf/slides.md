---
theme: default
title: Planet CF
colorSchema: light
transition: slide-left
layout: cover
fonts:
  sans: Work Sans
  serif: DM Sans
  mono: IBM Plex Mono
  weights: '400,500,600,700'
  italic: false
---

# Planet CF

A feed aggregator built on Cloudflare's Python Workers platform

<!-- Planet CF aggregates RSS/Atom feeds from Cloudflare-adjacent blogs, serving www.planetcloudflare.dev. The entire application runs in Python on Cloudflare Workers via Pyodide — Python compiled to WebAssembly, executing inside V8 isolates. It uses D1 for storage, Queues for feed fetching, Vectorize for semantic search, and Workers AI for embeddings. Created January 2026.

Sources:
- https://github.com/adewale/planet_cf/blob/main/README.md — project description and feature list -->

---
transition: fade
---

# Five services, one Python Worker

A feed aggregator built on Cloudflare's Python Workers platform. Five services run inside a single Worker:

<v-clicks>

- **Scheduler** -- cron hourly, enqueues each feed
- **Queue consumer** -- fetch, parse, sanitize, embed
- **HTTP handler** -- HTML/RSS/Atom/OPML on demand
- **Vectorize** -- 768-dim semantic search index
- **Workers AI** -- `bge-base-en-v1.5`, CLS pooling

</v-clicks>

<v-click>

The central design insight: every boundary between Python and JavaScript is a type conversion.

</v-click>

<!-- Planet CF runs entirely in Python on Cloudflare Workers. Python executes inside Pyodide (WebAssembly in V8 isolates). There is no filesystem — templates must be embedded as Python strings at build time. The scheduler runs hourly via cron, enqueuing each active feed as a separate queue message. Queue consumers fetch feeds with 30-second HTTP timeouts and 60-second processing timeouts. Failed fetches retry up to 3 times before hitting the dead-letter queue. The HTTP handler generates all content on-demand — no pre-rendering — with Cloudflare's edge cache providing the performance layer.

Sources:
- https://github.com/adewale/planet_cf/blob/main/README.md — project description, feature list, architecture summary
- https://github.com/adewale/planet_cf/blob/main/docs/ARCHITECTURE.md — system overview, component descriptions, entrypoint handlers -->

---
layout: fact
transition: slide-up
---

# 768

VECTORIZE DIMENSIONS

Workers AI generates embeddings with `bge-base-en-v1.5` using CLS pooling -- not mean pooling, because CLS captures the sentence-level representation that search needs.

<!-- The embedding model choice matters. bge-base-en-v1.5 produces 768-dimensional vectors. CLS pooling takes the [CLS] token's output as the sentence representation, while mean pooling averages all token outputs. For search tasks, CLS pooling produces better results because it was specifically trained to encode full-sentence semantics into a single vector. The Vectorize index must be created with matching dimensions (768) and cosine similarity metric. Configurable via SEARCH_TOP_K (default 50) and SEARCH_SCORE_THRESHOLD (default 0.3).

Sources:
- https://github.com/adewale/planet_cf/blob/main/docs/LESSONS_LEARNED.md — lesson 10: Workers AI embedding model choice, CLS vs mean pooling
- https://github.com/adewale/planet_cf/blob/main/README.md — search defaults table showing top-K, score threshold, embedding max chars -->

---
layout: section
transition: iris
---

# Every boundary is a type conversion

When Python lives inside V8, every API call crosses a world.

<!-- This is the central architectural insight of Planet CF. Pyodide (the Python-in-WebAssembly runtime) returns JsProxy objects when interacting with JavaScript APIs. These objects look like Python objects but are neither subscriptable nor iterable. The TypeError: 'pyodide.ffi.JsProxy' object is not subscriptable error was one of the first production failures. More insidiously, JavaScript null does not become Python None — it becomes JsNull, which fails the `is None` check. JavaScript undefined becomes JsUndefined, which also fails `is None`. Python None passed to D1 becomes undefined, which D1 rejects. There are three distinct null-like values at the FFI boundary, and `is None` catches only one of them.

Sources:
- https://github.com/adewale/planet_cf/blob/main/docs/LESSONS_LEARNED.md — lessons 1, 17, 21: JsProxy conversion, FFI type matrix, the three nulls -->

---
transition: fade
---

# The boundary layer that saved us

`JsProxy` objects look like Python but crash on subscript. `JsNull` is **not** `None`. The fix: a thin boundary at the edge.

<v-clicks>

- **SafeD1** -- JsProxy results to Python `dict`
- **SafeVectorize** -- search results + `to_js()` input
- **SafeAI** -- embedding calls, JsProxy to lists
- **`_to_d1_value()`** -- Python `None` to JS `null`

</v-clicks>

<v-click>

Business logic stays pure Python. One conversion point, not dozens scattered through the codebase.

</v-click>

<!-- The boundary layer pattern emerged from painful debugging. Initially, JsProxy type checks leaked throughout the codebase — every function that touched a Cloudflare API had its own hasattr(x, 'to_py') guard. The SafeD1, SafeVectorize, and SafeAI wrapper classes quarantine all type conversion at the edge. Python core code never sees JsProxy, JsNull, or JsUndefined. This also makes testing easier — unit tests with Python mocks actually reflect production behavior because the boundary layer guarantees clean types. The two-tier FFI testing strategy (CPython mocks + Pyodide fakes) was adopted from the tasche project to catch boundary bugs that standard mocking misses.

Sources:
- https://github.com/adewale/planet_cf/blob/main/docs/LESSONS_LEARNED.md — lessons 2, 3, 20, 21: boundary layer pattern, mock limitations, FFI testing, is-None trap
- https://github.com/adewale/planet_cf/blob/main/src/wrappers.py — SafeD1, SafeVectorize, SafeAI implementation -->

---
transition: morph-fade
---

# Hybrid search beats pure semantic

Searching "context" missed articles with "context" in the title. Semantic similarity does not guarantee keyword overlap.

<v-clicks>

- **Tier 1** -- exact title match, score 1.0
- **Tier 2** -- Vectorize cosine similarity ranking
- **Tier 3** -- D1 `LIKE` keyword matches, by date

</v-clicks>

<v-click>

Two search worlds, one boundary. The ranking function is the conversion layer.

</v-click>

<!-- The hybrid search lesson came from a real failure: a user searched "context is the work" and the article with that exact title was not the first result. Pure Vectorize semantic search found conceptually similar content but ranked it by embedding distance, not title relevance. The fix was three-tier ranking: exact title matches first (score 1.0), partial title matches next (score 0.95), semantic matches by Vectorize score, and finally keyword-only matches by date. Bidirectional title matching was critical — both "what the day-to-day looks like" (exact) and "what the day-to-day looks like now" (query contains title) should match. D1 LIKE queries also need escaping for % and _ characters to prevent SQL injection.

Sources:
- https://github.com/adewale/planet_cf/blob/main/docs/LESSONS_LEARNED.md — lessons 5, 6, 15, 16: hybrid search, LIKE escaping, exact-match ranking, real infrastructure tests -->

---
layout: end
transition: fade
---

# The boundaries that constrain you become the architecture

JsProxy, JsNull, `is None`. Every conversion is a design decision.

<!-- Planet CF demonstrates that platform constraints — no filesystem, JsProxy types, three kinds of null — are not obstacles to work around. They are the architecture itself. The boundary layer pattern, the embedded template system, the hybrid search ranking — each emerged from a specific constraint becoming a specific design decision. The project runs at github.com/adewale/planet_cf and serves www.planetcloudflare.dev.

Sources:
- https://github.com/adewale/planet_cf — project repository
- https://github.com/adewale/planet_cf/blob/main/docs/LESSONS_LEARNED.md — 21 lessons that shaped the architecture -->
