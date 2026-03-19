# Deck Spec

## Meta
- title: How Slide Maker Ships
- purpose: explain the build system architecture and deployment pipeline of the slide-maker project
- audience: developers evaluating or contributing to the project
- tone: practical, direct, workshop-style
- target-length: 5
- notes: no
- style-preset: cloudflare
- project-url: https://github.com/nicholasgasior/slide-maker
- progress: segment-bar

## Source Materials
- readme: README.md (project overview -- what it is, how it works, project structure)
- package: package.json (npm scripts surface area -- build, dev, serve all route through build.sh)
- config: examples/build.sh (the canonical build script -- multi-deck compilation, per-slide splitting, SPA routing, llms.txt generation)
- config: .github/workflows/deploy.yml (GitHub Actions CI -- checkout, npm ci, build.sh with BASE_PREFIX, upload-pages-artifact, deploy-pages)
- wrangler: slides.oshineye.dev/wrangler.jsonc (Cloudflare Workers Static Assets -- SPA not_found_handling, html_handling)
- config: slides.oshineye.dev/pull-slides.sh (deployment bridge -- copies _build to public/, optional wrangler deploy)
- lessons-learned: docs/LESSONS_LEARNED.md (SPA routing pitfalls, styles/index.css discovery, layered verification)

## Through-Line
- concept: "One shell script builds everything. The host just serves static files."
- type: design-rule
- appears-in:
  - slide 1: cover -- the claim is stated
  - slide 2: default -- build.sh is the single entry point for all compilation
  - slide 3: default -- the build output is a self-contained static directory
  - slide 4: default -- two deployment hosts, same _build directory
  - slide 5: end -- resolution echoes the design rule

## Design Tokens
- colors:
  - bg: "#fffbf5"
  - fg: "#521000"
  - accent: "#ff4801"
  - accent-alt: "#e54100"
  - muted: "#7a4a3a"
  - rule: "#ebd5c1"
  - code-bg: "#231710"
- typography:
  - display: Inter
  - body: Inter
  - mono: JetBrains Mono
- motion:
  - preset: workshop-ready

## Layout System
- prefer-builtins: true
- builtins:
  - cover
  - default
  - end
- custom-layouts: []
- components: []
- css-files:
  - styles/tokens.css
  - styles/theme.css

## Slides

### Slide 1
- kind: cover
- layout: cover
- title: How Slide Maker Ships
- subtitle: One shell script builds everything. The host just serves static files.
- sources:
  - file:README.md -- "Decks build to static files and deploy anywhere"
  - file:package.json -- npm scripts all route through build.sh

### Slide 2
- kind: default-content
- layout: default
- title: build.sh is the entire build system
- body:
  - bullet: Syncs skill components into each deck before build
  - bullet: Runs npx slidev build per deck with --base
  - bullet: Splits slides into per-slide Markdown via Python
  - bullet: Generates _redirects and llms.txt for routing
- sources:
  - file:examples/build.sh -- sync_skill_files, split_slides, _redirects generation

### Slide 3
- kind: default-content
- layout: default
- title: What the build produces
- body:
  - bullet: _build/ holds every deck as a static SPA
  - bullet: Each index.html links to its Markdown source
  - bullet: Per-slide files at slides/N.md plus a count
  - bullet: Root llms.txt lets agents discover all decks
- sources:
  - file:examples/build.sh -- HTML link injection, llms.txt generation
  - file:README.md -- agent-ready URL table

### Slide 4
- kind: default-content
- layout: default
- title: Two deploy targets, same artifact
- body:
  - bullet: GitHub Pages -- CI runs build.sh, deploys _build
  - bullet: Cloudflare Workers -- copies _build, runs wrangler
  - bullet: Both need SPA fallback via _redirects or 404.html
  - bullet: Any static host works -- no runtime dependency
- sources:
  - file:.github/workflows/deploy.yml -- GitHub Actions pipeline
  - file:slides.oshineye.dev/wrangler.jsonc -- Workers static asset config with SPA not_found_handling
  - file:slides.oshineye.dev/pull-slides.sh -- deployment bridge script

### Slide 5
- kind: end
- layout: end
- title: One script. Static files. Deploy anywhere.
- subtitle: The build system has no opinions about hosting because the output needs no runtime.
