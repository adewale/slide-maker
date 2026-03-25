# Deck Spec

## Meta
- title: Tasche
- purpose: present a surprising architecture — a Python read-it-later service running on Cloudflare Workers, where JavaScript is the norm
- audience: developers curious about Cloudflare Workers, Python on the edge, or unconventional architecture choices
- tone: assertive, technically grounded, narrative-driven
- target-length: 9
- notes: yes
- style-preset: bold-modern
- project-url: https://github.com/adewale/tasche
- progress: segment-bar

## Source Materials
- readme: README.md (project overview — self-hosted read-it-later on Cloudflare Python Workers)
- changelog: CHANGELOG.md (evolution from v0.1 to v0.3 — content extraction rearchitected 3 times, browser extension removed)
- architecture: CLAUDE.md (binding map, data flow, FFI boundary layer, Safe* wrappers)
- lessons-learned: LESSONS_LEARNED.md (41 lessons — FFI boundary, Pyodide cold starts, TTS truncation, 480 tests passing while core workflow broken)
- specs: specs/tasche-spec.md (product spec — deployment model, archival pipeline, content formats)
- design: DESIGN_LANGUAGE.md (monochrome pen-and-ink aesthetic, stroke weight hierarchy)

## Through-Line
- concept: "Links die. Paywalls appear. Domains expire. The article you meant to read is gone. Tasche saves it before that happens."
- type: man-in-hole
- shape: problem (link rot) → solution (archive at save time) → architecture (Python + JS on Cloudflare) → resolution (the link died, your copy survived)
- appears-in:
  - slide 1: cover — Tasche introduced as a self-hosted read-it-later service
  - slide 2: default-content — the PROBLEM stated viscerally: the link is gone
  - slide 3: section — Python inside V8: the architectural surprise behind the solution
  - slide 5: default-content — the FFI boundary layer that makes cross-runtime archival work
  - slide 6: section — when Python cannot do it, call JavaScript (content extraction)
  - slide 8: center-statement — two runtimes, one archive: architecture serves the promise
  - slide 9: end — resolution: the link died, your copy survived

## Design Tokens
- colors:
  - bg: "#0a0a0f"
  - fg: "#f0f0f5"
  - accent: "#e2e2e8"
  - muted: "rgba(240, 240, 245, 0.5)"
- typography:
  - display: Bebas Neue
  - body: DM Sans
  - mono: JetBrains Mono
- motion:
  - preset: medium-reveal

## Layout System
- prefer-builtins: true
- builtins:
  - cover
  - section
  - default
  - center
  - fact
  - two-cols
  - end
- custom-layouts: []
- components:
  - ProgressSegmentBar
- css-files:
  - styles/tokens.css
  - styles/theme.css
  - styles/transitions.css

## Slides

### Slide 1
- kind: cover
- layout: cover
- title: Tasche
- subtitle: A self-hosted read-it-later service built on Cloudflare Python Workers
- notes:
  - Tasche means "pocket" in German. The name signals what this is — a Pocket alternative you own.
  - The surprising part is not that it exists, but that it runs Python on a platform dominated by JavaScript.

### Slide 2
- kind: default-content
- layout: default
- title: The Link Is Gone
- body: The problem stated viscerally — link rot, paywalls, expired domains. Then the answer: Tasche archives at save time via a 14-step async pipeline.
- sources:
  - file:specs/tasche-spec.md — core promise and archival pipeline
  - file:README.md — feature list and architecture table
- notes:
  - The problem is link rot. Articles disappear behind paywalls, domains expire, authors delete posts. Tasche archives at save time: clean HTML, images converted to WebP, markdown for search, and optional TTS audio.
  - The pipeline runs asynchronously via Cloudflare Queues — the user sees "saving" immediately, processing happens in the background. If the original URL 404s, your copy survived.

### Slide 3
- kind: section
- layout: section
- title: Python Inside V8
- subtitle: Running Pyodide in Cloudflare's JavaScript runtime
- notes:
  - This is the core surprise. Cloudflare Workers documentation defaults to JavaScript/TypeScript. Python Workers compile to WebAssembly via Pyodide and run inside V8 isolates.
  - Through-line surfaces here: what happens when you put Python where JS goes? You get async-only handlers, no C extensions, and None becoming undefined.

### Slide 4
- kind: default-content
- layout: two-cols
- title: The Platform Stack
- left: Cloudflare bindings — D1, R2, KV, Queues, Workers AI, Service Binding
- right: Python constraints — all async, no C extensions, no eval(), no threading
- sources:
  - file:CLAUDE.md — binding map and Python Workers constraints
  - file:LESSONS_LEARNED.md — Pyodide runtime constraints (lessons 27, 29, 32)
- notes:
  - Six different Cloudflare bindings, each with its own FFI conversion requirements. The binding map from CLAUDE.md is the architectural backbone.
  - Every handler must be async def. Sync handlers cause RuntimeError: can't start new thread. This is not a best practice — it's a hard constraint.

### Slide 5
- kind: default-content
- layout: default
- title: The FFI Boundary Layer
- body: Python None becomes JS undefined. Python bytes become PyProxy. Every type crossing the border needs explicit conversion. wrappers.py is the single checkpoint.
- sources:
  - file:LESSONS_LEARNED.md — FFI type matrix (lesson 29), bidirectional boundary (lesson 30), 7 commits to centralize (pattern 1)
- notes:
  - The Pyodide FFI type compatibility matrix is the key insight. None to undefined breaks D1. bytes to PyProxy breaks R2. dict to Map breaks Queues.
  - Through-line deepens: "running Python where JS goes" means building a bidirectional translation layer. Safe* wrappers handle both directions.

### Slide 6
- kind: section
- layout: section
- title: When Python Cannot Do It, Call JavaScript
- subtitle: Service Binding RPC across runtimes
- notes:
  - Through-line refracted: python-readability uses eval(), which V8 isolates block. Every Python content extraction library needs lxml (a C extension). The solution is a JS Worker running Mozilla Readability via Service Binding.
  - The RPC is in-process (1-5ms), not a network call. Two runtimes cooperating on the same platform.

### Slide 7
- kind: default-content
- layout: default
- title: 480 Tests Pass, Core Workflow Broken
- body: Three fatal bugs hid behind CPython unit tests with mock Cloudflare bindings. The primary user journey did not work until commit 20 of 25.
- sources:
  - file:LESSONS_LEARNED.md — lesson 27 (runtime gap), lesson 34 (commit history), lesson 38 (E2E tests)
- notes:
  - Bug 1: Queue handler signature mismatch — Workers passes (batch, env, ctx), code accepted (self, batch). Bug 2: python-readability calls eval(), blocked in Workers. Bug 3: None to undefined in D1 bind.
  - All three share the same root cause: unit tests run in CPython, production runs in Pyodide inside V8. The tests verified a simulation, not the real platform.

### Slide 8
- kind: center-statement
- layout: center
- title: Two Runtimes, One Archive
- body: Python for the application logic. JavaScript for what Python cannot reach. The boundary layer makes them one system — and your articles survive because of it.
- notes:
  - Connects architecture back to the opening problem. The two-runtime design makes the archival pipeline work. Without the JS Service Binding, content extraction would fail entirely.
  - The result: when a link dies, the archive is already complete — fetched, extracted, converted, indexed, stored.

### Slide 9
- kind: end
- layout: end
- title: The Link Died. Your Copy Survived.
- subtitle: github.com/adewale/tasche
- notes:
  - Resolves the opening tension from slide 2. The problem was link rot; the answer is an archive that outlasts the original.
  - The GitHub URL gives the audience a concrete next step.
