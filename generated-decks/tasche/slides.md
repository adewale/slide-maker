---
theme: default
title: Tasche
colorSchema: dark
fonts:
  sans: Bebas Neue
  serif: DM Sans
  mono: JetBrains Mono
  weights: '400,500,700'
  italic: false
transition: slide-left
layout: cover
---

# Tasche

A self-hosted read-it-later service built on Cloudflare Python Workers

<p style="color: var(--deck-muted); font-family: var(--deck-font-mono); font-size: 0.85rem; margin-top: 2rem;">github.com/adewale/tasche</p>

<!--
Tasche is German for "pocket." The name signals exactly what this is -- a Pocket alternative you own and deploy to your own Cloudflare account. One click, your own D1 database, your own R2 bucket, your own Queues.

The surprising part is not that it exists. It is that it runs Python on a platform where nearly every tutorial, example, and template is JavaScript.

Sources:
- https://github.com/adewale/tasche/blob/main/README.md -- project overview and description
- https://github.com/adewale/tasche/blob/main/specs/tasche-spec.md -- deployment model and naming
-->

---
transition: slide-up
---

# Your Articles Survive

Save a URL and Tasche creates a **complete, self-contained archive**.

The original can get paywalled, deleted, or the domain can expire. Tasche already has your copy.

<v-clicks>

- **14-step async pipeline** from URL to archived article
- **D1** for articles and FTS5 search, **R2** for content
- **Queues** for background processing, **KV** for sessions
- **Workers AI** for text-to-speech via MeloTTS
- **Service Binding** to a JS Worker for Readability

</v-clicks>

<!--
The core promise is article permanence. When you save a URL, Tasche fetches the page, resolves redirects, extracts the article via Readability, downloads and converts all images to WebP, stores clean HTML and Markdown in R2, and indexes the content in D1 FTS5.

The pipeline runs asynchronously via Cloudflare Queues. The user sees "saving" immediately. Processing happens in the background. If you click the original URL and it 404s -- good thing you saved it.

Sources:
- https://github.com/adewale/tasche/blob/main/specs/tasche-spec.md -- core promise, archival pipeline, 14-step processing
- https://github.com/adewale/tasche/blob/main/CLAUDE.md -- binding map and data flow
-->

---
layout: section
transition: iris
---

# Python Inside V8

Running Pyodide in Cloudflare's JavaScript runtime

<!--
This is the ecosystem mismatch that makes Tasche architecturally interesting. Cloudflare Workers documentation defaults to JavaScript and TypeScript. The getting started guides, the templates, the examples -- all JS. Python Workers compile to WebAssembly via Pyodide and run inside V8 isolates.

The through-line surfaces here: what happens when you put Python where JavaScript is supposed to go? You get a set of hard constraints that shape every architectural decision.

Sources:
- https://github.com/adewale/tasche/blob/main/LESSONS_LEARNED.md -- lesson 27 (runtime gap between CPython and Pyodide)
- https://github.com/adewale/tasche/blob/main/CLAUDE.md -- "Runtime: Python on Pyodide (WebAssembly) inside V8 isolates"
-->

---
layout: two-cols
transition: slide-left
---

# The Platform Stack

### Cloudflare Bindings

<v-clicks>

- **D1** -- articles, tags, FTS5 search
- **R2** -- HTML, markdown, images, audio
- **KV** -- auth sessions (7-day TTL)
- **Queues** -- async processing and TTS
- **Workers AI** -- TTS via MeloTTS
- **Service Binding** -- Readability (JS Worker)

</v-clicks>

::right::

### Python Constraints

<v-clicks>

- All handlers must be `async def`
- No C extensions (no lxml)
- No `eval()` or `Function()` in V8
- No threading or multiprocessing
- `None` becomes `undefined`, not `null`
- `bytes` becomes `PyProxy`, not `Uint8Array`

</v-clicks>

<!--
Six different Cloudflare bindings, each with its own FFI conversion requirements. The left column is what the platform gives you. The right column is what it takes away.

Every handler must be async def -- sync handlers cause "RuntimeError: can't start new thread." This is not a best practice, it is a hard constraint of running Python inside V8. The None-to-undefined and bytes-to-PyProxy conversions are the root cause of three separate production bugs.

Sources:
- https://github.com/adewale/tasche/blob/main/CLAUDE.md -- binding map, constraints list
- https://github.com/adewale/tasche/blob/main/LESSONS_LEARNED.md -- lessons 27, 29, 32 (runtime constraints)
-->

---
transition: zoom-in
---

# The FFI Boundary Layer

Every Python type crossing into JavaScript needs explicit conversion. `wrappers.py` is the single checkpoint.

<v-clicks>

- `None` to `undefined` breaks D1 -- use `d1_null()`
- `bytes` to `PyProxy` breaks R2 -- use `to_js_bytes()`
- `dict` to `Map` breaks Queues -- use `_to_js_value()`
- `JsNull` is not `None` -- reads need conversion too

</v-clicks>

<p v-click style="color: var(--deck-accent); margin-top: 1.5rem; font-weight: 500;">The boundary is bidirectional: convert on writes (Python to JS) AND on reads (JS to Python).</p>

<!--
The Pyodide FFI type matrix is the central architectural insight. It took 7 commits across 3 days to centralize this boundary layer -- each commit discovered a new category of FFI leaks the previous one missed.

Safe* wrappers (SafeD1, SafeR2, SafeKV, SafeQueue, SafeAI, SafeReadability) encapsulate both read and write conversions. Application code never touches JsProxy directly.

Through-line deepens: "running Python where JavaScript goes" means building a bidirectional translation layer at every boundary.

Sources:
- https://github.com/adewale/tasche/blob/main/LESSONS_LEARNED.md -- lesson 29 (FFI type matrix), lesson 30 (bidirectional boundary), pattern 1 (7 commits to centralize)
-->

---
layout: section
transition: iris
---

# When Python Cannot Do It, Call JavaScript

Service Binding RPC across runtimes

<!--
Through-line refracted through a new lens. python-readability uses eval(), which V8 isolates block with EvalError. Every serious Python content extraction library (Trafilatura, Newspaper4k, Goose3, ReadabiliPy) requires lxml -- a C extension incompatible with Pyodide/WebAssembly.

The solution: a separate JavaScript Worker running Mozilla Readability via linkedom, called from the Python Worker via Service Binding RPC. The call is in-process (1-5ms), not a network round-trip. Two runtimes cooperating on the same platform.

Content extraction was rearchitected 3 times: python-readability (crashed), BeautifulSoup heuristics (lower quality), then the JS Service Binding with BS4 as fallback.

Sources:
- https://github.com/adewale/tasche/blob/main/LESSONS_LEARNED.md -- lessons 32-33 (eval blocked, lxml unavailable)
- https://github.com/adewale/tasche/blob/main/readability-worker/src/index.js -- the JS Worker source
-->

---
transition: morph-fade
---

# 480 Tests Pass, Core Workflow Broken

Three fatal bugs hid behind CPython unit tests with mock Cloudflare bindings. The primary user journey did not work until **commit 20 of 25**.

<v-clicks>

- **Queue signature** -- wrong arg count, silent crash
- **eval() blocked** -- Readability calls `js.eval()`, V8 rejects
- **None to undefined** -- D1 rejects `undefined` in `.bind()`

</v-clicks>

<p v-click style="color: var(--deck-muted); font-size: 0.95rem; margin-top: 1rem;">All three share one root cause: unit tests ran in CPython, production ran in Pyodide inside V8. The tests verified a simulation, not the real platform.</p>

<!--
The most damning statistic from the commit history: 53 total commits, 17 corrective, fix-to-feature ratio 1:2.1. The core user journey -- "save a URL, read it later" -- was broken for 7 of 8 development days while test counts climbed.

A single live smoke test on day 1 would have caught all three bugs. The lesson: for novel runtimes, deploy to the real platform first. Tests measure correctness of logic in the wrong runtime; smoke tests measure reachability of function in the right one.

Sources:
- https://github.com/adewale/tasche/blob/main/LESSONS_LEARNED.md -- lesson 27 (runtime gap), lesson 34 (commit history analysis), lesson 38 (E2E tests)
-->

---
layout: center
transition: fade
---

<div v-motion :initial="{ y: 40, opacity: 0 }" :enter="{ y: 0, opacity: 1, transition: { duration: 800 } }">

# Two Runtimes, One Platform

</div>

<p style="font-size: 1.25rem; max-width: 36rem; text-align: center; color: var(--deck-muted); line-height: 1.6;">Python for the application logic. JavaScript for what Python cannot reach. The boundary layer makes them one system.</p>

<!--
Through-line resolution. The answer to "what happens when you run Python where JavaScript goes" is: you build a boundary layer, you accept the constraints, and when you hit a wall you bridge to JS via Service Bindings.

This is not a workaround. Cloudflare natively supports both runtimes. The Python Worker handles FastAPI routing, D1 queries, R2 storage, queue processing. The JS Worker handles Readability extraction. Service Binding RPC connects them in-process.

The architecture that emerged is genuinely novel: a Python application calling a JavaScript service via in-process RPC, both running on the same edge platform, sharing no state except the function call boundary.

Sources:
- https://github.com/adewale/tasche/blob/main/CLAUDE.md -- architecture overview, binding map
- https://github.com/adewale/tasche/blob/main/LESSONS_LEARNED.md -- lesson 32 (Service Binding solution)
-->

---
layout: end
transition: fade
---

# You Build a Boundary Layer

github.com/adewale/tasche

<!--
Echoes the opening provocation. What happens when you run Python where JavaScript is supposed to go? You build wrappers.py. You build Safe* classes. You build a Readability Service Binding. You accept what each runtime does well and connect them at the border.

The GitHub URL gives the audience a concrete next step -- the entire project is open source, MIT licensed, deployable with one click.

Sources:
- https://github.com/adewale/tasche -- project repository
-->
