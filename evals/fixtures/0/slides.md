---
theme: default
title: Slide Maker Architecture
colorSchema: light
fonts:
  sans: Inter
  mono: JetBrains Mono
  weights: '400,500,600,700'
transition: slide-left
layout: cover
---

# Slide Maker Architecture

How decks compile, build, and deploy.

---
layout: section
transition: iris
---

# The build pipeline

`build.sh` orchestrates the compile: it normalizes each deck spec, runs the Slidev build, and writes static output to `examples/_build`.

---
transition: slide-left
---

# From source to static

<v-clicks>

- `tools/build.py` resolves tokens and theme per deck
- the build system renders Markdown to a static single-page app
- `deck-lint.mjs` validates structure before anything publishes

</v-clicks>

---
layout: section
transition: iris
---

# Deploy

The build output is a static SPA; `tools/deploy.py` publishes it to Cloudflare Workers with an SPA fallback so every sub-route serves `index.html`.

---
layout: end
transition: fade
---

# Direction first. Then slides.

slides.oshineye.dev
