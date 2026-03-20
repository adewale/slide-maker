# Deck Spec

## Meta
- title: Planet CF
- purpose: present a Python-on-Cloudflare feed aggregator that bridges two runtime worlds
- audience: developers interested in Cloudflare Workers, Python, or edge computing
- tone: practical, curious, technically grounded
- target-length: 9
- notes: yes
- style-preset: cloudflare
- progress: segment-bar
- project-url: https://github.com/adewale/planet_cf

## Source Materials
- readme: README.md (project overview -- feed aggregator on Cloudflare Python Workers, features, multi-instance support)
- architecture: docs/ARCHITECTURE.md (system topology -- Python Worker orchestrating D1, Queues, Vectorize, Workers AI, Static Assets)
- lessons-learned: docs/LESSONS_LEARNED.md (21 hard-won lessons -- JsProxy conversion, JsNull trap, boundary layer pattern, template embedding, hybrid search)
- wrangler: wrangler.jsonc (Cloudflare bindings -- D1, Vectorize, Queues, AI, Static Assets)
- code: src/wrappers.py (boundary layer implementation -- SafeD1, SafeVectorize, SafeAI, SafeQueue, type conversion functions)

## Through-Line
- concept: "What happens when Python wakes up inside JavaScript's house?"
- type: question
- appears-in:
  - slide 1: cover -- the question is implicit in the subtitle
  - slide 3: center-statement -- Python running inside V8, not alongside it
  - slide 4: section -- the boundary problem is named
  - slide 6: center-statement -- the JsNull trap as the sharpest example
  - slide 8: section -- 21 lessons as the answer to the question
  - slide 9: end -- resolution: the boundary layer is the architecture

## Design Tokens
- colors:
  - bg: "#fffbf5"
  - fg: "#521000"
  - accent: "#ff4801"
  - accent-alt: "#e54100"
  - muted: "rgba(82, 16, 0, 0.45)"
  - border: "#ebd5c1"
- typography:
  - display: Inter
  - body: Inter
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
  - KeyboardHelp
  - AudienceQRCode
  - MobileScrollView
- css-files:
  - styles/tokens.css
  - styles/theme.css
  - styles/transitions.css
  - styles/index.css

## Slides

### Slide 1
- kind: cover
- layout: cover
- title: Planet CF
- subtitle: A feed aggregator built on Cloudflare's Python Workers platform
- notes:
  - Planet CF is a modern take on the classic "Planet" feed aggregator concept (Planet Python, Planet Mozilla), rebuilt to run entirely on Cloudflare's edge. The surprise: it's Python, not JavaScript, running inside V8 via Pyodide/WASM.

### Slide 2
- kind: default-content
- layout: default
- title: What Is Planet CF?
- body: RSS/Atom aggregator where Python runs inside V8 isolates via Pyodide/WASM. One worker handles scheduling, queue consumption, HTTP serving, and admin. Supports multi-instance deployment (Planet Python with 500+ feeds, Planet Mozilla with 190).
- sources:
  - file:README.md -- feature list and multi-instance examples
  - file:docs/ARCHITECTURE.md -- system topology

### Slide 3
- kind: center-statement
- layout: center
- title: Python inside JavaScript. Not alongside it.
- body: Pyodide compiles CPython to WebAssembly. No filesystem. No threading. Every external operation crosses the FFI boundary into JavaScript APIs.
- sources:
  - file:docs/LESSONS_LEARNED.md -- lesson 1 (JsProxy conversion) and lesson 4 (no filesystem)

### Slide 4
- kind: section
- layout: section
- title: The Boundary Problem
- subtitle: Five Cloudflare primitives, each returning JavaScript types to Python code

### Slide 5
- kind: default-content
- layout: default
- title: The Boundary Layer Pattern
- body: Architecture diagram showing JS APIs at top, thin boundary wrappers in middle, pure Python core at bottom. SafeD1, SafeVectorize, SafeAI, SafeQueue -- each wraps a Cloudflare binding and converts types at the edge.
- sources:
  - file:docs/LESSONS_LEARNED.md -- lesson 2 (boundary layer pattern)
  - file:src/wrappers.py -- SafeD1, SafeVectorize, SafeAI, SafeQueue implementations

### Slide 6
- kind: center-statement
- layout: center
- title: None is not None
- body: JavaScript null becomes JsNull in Python. It is falsy, but `is None` returns False. Every `if x is None` at the FFI boundary is a latent bug.
- sources:
  - file:docs/LESSONS_LEARNED.md -- lesson 17 (FFI type matrix) and lesson 21 (is None trap)

### Slide 7
- kind: default-content
- layout: two-cols
- title: Three Null-Like Values
- left: Python type behavior table showing None, JsNull, JsUndefined
- right: The fix -- boundary layer _is_js_undefined() checks type(x).__name__
- sources:
  - file:docs/LESSONS_LEARNED.md -- lesson 21 (is None is never enough)
  - file:src/wrappers.py -- _is_js_undefined function

### Slide 8
- kind: section
- layout: section
- title: 21 Lessons, One Document
- subtitle: From JsProxy to SSRF protection, every surprise documented

### Slide 9
- kind: end
- layout: end
- title: The boundary layer is the architecture
- subtitle: github.com/adewale/planet_cf
