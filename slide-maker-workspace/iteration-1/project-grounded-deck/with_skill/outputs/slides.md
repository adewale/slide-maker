---
theme: default
title: How Slide Maker Ships
routerMode: hash
selectable: true
colorSchema: light
fonts:
  sans: Inter
  mono: JetBrains Mono
  weights: '400,500,600,700'
transition: slide-left
layout: cover
---

# How Slide Maker Ships

One shell script builds everything. The host just serves static files.

<!-- Sources: README.md "Decks build to static files and deploy anywhere"; package.json npm scripts all route through build.sh -->

---
transition: fade
---

# build.sh is the entire build system

<v-clicks>

- Syncs skill components into each deck before build
- Runs `npx slidev build` per deck with `--base`
- Splits slides into per-slide Markdown via Python
- Generates `_redirects` and `llms.txt` for routing

</v-clicks>

<!-- Sources: examples/build.sh sync_skill_files function, split_slides function, _redirects and llms.txt generation blocks -->

---
transition: fade
---

# What the build produces

<v-clicks>

- `_build/` holds every deck as a static SPA
- Each `index.html` links to its Markdown source
- Per-slide files at `slides/N.md` plus a count
- Root `llms.txt` lets agents discover all decks

</v-clicks>

<!-- Sources: examples/build.sh HTML link injection and llms.txt generation; README.md agent-ready URL table -->

---
transition: fade
---

# Two deploy targets, same artifact

<v-clicks>

- **GitHub Pages** -- CI runs `build.sh`, deploys `_build`
- **Cloudflare Workers** -- copies `_build`, runs `wrangler`
- Both need SPA fallback via `_redirects` or `404.html`
- Any static host works -- no runtime dependency

</v-clicks>

<!-- Sources: .github/workflows/deploy.yml GitHub Actions pipeline; slides.oshineye.dev/wrangler.jsonc Workers config with SPA not_found_handling; slides.oshineye.dev/pull-slides.sh deployment bridge -->

---
layout: end
transition: fade
---

# One script. Static files. Deploy anywhere.

The build system has no opinions about hosting because the output needs no runtime.
