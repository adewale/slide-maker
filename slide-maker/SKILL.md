---
name: slide-maker
description: Create or update native Slidev deck projects with strong visual direction, readable Markdown, and minimal abstraction.
argument-hint: [goal or update instructions]
---

# slidev-project-studio

Create or update a native Slidev deck project.

## Reference documents

Consult these during execution:

- [DECK_SPEC.md](DECK_SPEC.md) — deck.spec.md schema and canonical template
- [SLIDE_KINDS.md](SLIDE_KINDS.md) — canonical slide types and escalation rules
- [COMPILER_RULES.md](COMPILER_RULES.md) — compilation phases and acceptance checklist
- [STYLE_PRESETS.md](STYLE_PRESETS.md) — visual direction presets (editorial-dark, swiss-minimal, bold-modern, sumi-e, tufte-data, cloudflare, material-design)
- [PROJECT_DECK_RUBRIC.md](../docs/PROJECT_DECK_RUBRIC.md) — scoring guide for project decks (source material depth, through-line, visual evidence)
- [PRESENTATION_PHILOSOPHY.md](../docs/PRESENTATION_PHILOSOPHY.md) — rhetorical principles (one idea per slide, sustained metaphor, dialectical progression)

## Scope

Supported modes only:
1. Create a new Slidev deck project
2. Update an existing Slidev deck project

Unsupported:
- standalone HTML deck output
- PPT or PPTX conversion
- HTML-to-Slidev conversion
- non-project slide artifacts

If the user asks for an unsupported path, redirect to a Slidev deck project.

## Required outputs

Always create or update:
- `deck.spec.md`
- `slides.md`
- `README.md`

Create only when justified:
- `styles/tokens.css`
- `styles/theme.css`
- `layouts/*.vue`
- `components/*.vue`
- `public/images/*`

## Source-of-truth model

Planning source:
- `deck.spec.md`

Presentation source:
- `slides.md`

Implementation layer:
- `styles/`
- `layouts/`
- `components/`

Structural changes start in `deck.spec.md` and must stay in sync with `slides.md`.

## Priorities

In order:
1. editability
2. clarity
3. coherence
4. native Slidev usage
5. reuse over duplication
6. restraint

## Non-negotiable rules

- Always leave behind a coherent deck project
- Always use Markdown as the intermediate schema
- Follow the escalation ladder (see below) — Markdown first, inline HTML last
- Use inline HTML only as a last resort
- Split dense material across slides instead of cramming
- Remove dead abstractions when updating
- Never bypass the token system with hardcoded colors in `<style scoped>` blocks — use `var(--deck-*)` variables exclusively

## Workflow

### 1. Determine mode
New project or update.

### 2. Gather source material (project decks only)
When the deck presents a project (has a `project-url` or references a codebase):
- Read the project's README, ARCHITECTURE, CHANGELOG, and LESSONS_LEARNED documents.
- Collect screenshots or terminal output from the running project.
- Extract a candidate through-line from the source material.
- Note specific numbers, code snippets, and quotes for use in slides.

See COMPILER_RULES.md Phase 1 for the full source-material lookup table.

### 3. Intake
Normalize:
- title
- goal
- audience
- presenter voice
- target length
- tone
- source material
- brand constraints
- notes requirement
- through-line (project decks — concept, type, planned appearances)
- project-url (project decks — triggers source material gathering and project color extraction)
- current project constraints if updating

### 4. Style direction
Offer 2 or 3 directions in words only.
Each direction should specify:
- preset or mood
- typography direction
- token direction
- layout tendencies
- motion character
- expected abstraction density

### 5. Write or revise `deck.spec.md`
Do this before implementation-heavy changes.

### 6. Compile the project
Generate or update:
- `slides.md`
- styles
- layouts
- components
- README if the project usage changed

### 7. Validate
Before finishing, check:
- `deck.spec.md` matches `slides.md`
- slide density is controlled
- most edits can happen in Markdown
- custom code is justified
- unused abstractions are removed

### 8. Deliver
Help the user get the deck in front of their audience. The right delivery path depends on context.

#### Single deck (default)
For a user with one deck, keep it simple:
- **Static SPA:** `npx slidev build` → produces `dist/`. Deploy to any static host (Cloudflare Pages, GitHub Pages, Netlify, Vercel, etc.). Share the URL.
- **PDF:** `npx slidev export` → produces a PDF. Share via email, Slack, Google Drive.
- **PDF with notes:** `npx slidev export --with-clicks --with-toc` → presenter-friendly PDF.
- **PNG per slide:** `npx slidev export --format png` → individual slide images for embedding in docs or social media.

Slidev uses HTML5 history routing by default. The build output is a static SPA — no server-side code — but the host must serve `index.html` for all sub-routes (e.g., `/5`, `/presenter/1`). Slidev auto-generates a `404.html` (copy of `index.html`) and a `_redirects` file per build. Most static hosts handle this automatically.

#### Multiple decks
When the user has multiple decks and doesn't want to deploy separate SPAs, offer these approaches in escalation order:

| # | Approach | How it works | Best for |
|---|----------|-------------|----------|
| 1 | **Gallery build** (recommended) | `build.sh` builds all decks to `_build/{name}/` with a generated `index.html` menu and root `_redirects` for SPA routing. One folder, one deploy. | Most users. Low friction. |
| 2 | **Cloudflare Pages** | `build.sh` + `wrangler pages deploy _build`. The root `_redirects` handles SPA routing per deck. | Cloudflare users, fast global CDN. |
| 3 | **Cloudflare Workers Static Assets** | `build.sh` + deploy via Worker with `[assets]` binding. Requires a root `_redirects` file (auto-generated by `build.sh`) — the `not_found_handling = "single-page-application"` mode only serves the root `index.html`, which breaks multi-deck routing. | Workers-based deployments, custom middleware. |
| 4 | **GitHub Pages + Actions** | Push to main → CI builds all decks → deploys to `gh-pages` branch automatically. | Open-source projects, teams with GitHub workflow. |
| 5 | **PDF portfolio** | `slidev export` each deck. Bundle PDFs in a shared folder or drive. | Corporate environments, offline sharing, email. |
| 6 | **Containerized server** | Package `_build/` + nginx into a Docker image. `docker run` serves everything. | On-prem, air-gapped, self-hosted. |
| 7 | **Static site wrapper** | Astro or Vite as an outer shell. Each deck becomes a route. Shared nav, search, branding. | Presentation hubs, conference sites. |
| 8 | **Single-file HTML export** | Post-build: inline all assets into one `.html` per deck. Zero dependencies to open. | Maximum portability, email attachments. |
| 9 | **CDN + shareable links** | Upload `_build/` to R2/S3. Generate pre-signed or public URLs per deck. | Private sharing, expiring links. |
| 10 | **Hybrid: gallery + PDF fallback** | Deploy the gallery SPA for web, export PDFs for offline. Cover both bases. | Mixed audiences (web + email + corporate). |

Default recommendation: **Option 1** (gallery build) for users with 2+ decks. It already works via `build.sh` and requires no extra tooling. For a single deck, skip the gallery — just `slidev build` and deploy `dist/`.

#### Updating a collection
When the user updates one or more decks in an existing collection:
- **Incremental rebuild:** `build.sh` rebuilds all decks. For large collections, the user can pass specific deck names to rebuild only those (e.g., `build.sh vaders planet-cf`).
- **Gallery regeneration:** The `index.html` menu and root `_redirects` must be regenerated whenever decks are added, removed, or renamed.
- **Deploy delta:** For static hosts with atomic deploys (Cloudflare Pages, Netlify), redeploy the entire `_build/` folder. The host handles cache invalidation. For S3/R2, use `--sync` to upload only changed files.
- **Deck inventory:** `build.sh` maintains the canonical list of decks in its `DECKS` array. When adding or removing a deck, update this array first — the gallery, `_redirects`, and `serve.json` are all derived from it.

## Escalation ladder

Use the lowest level that solves the slide cleanly (Markdown → built-in layout → custom layout → custom component → inline HTML). Do not skip levels without a real reason.

See COMPILER_RULES.md Phase 3 for the full escalation rules.

## Layout rule

Create a local layout only when a structure repeats or Markdown plus a built-in layout would be awkward.

Good reasons:
- recurring split layout
- recurring comparison shell
- recurring section treatment
- recurring metrics shell

Bad reasons:
- one-off decoration
- hiding ordinary text in Vue
- preserving accidental structure from an older draft

## Component rule

Create a local component only when a block:
- repeats
- has meaningful internal structure
- benefits from props
- improves maintainability

Do not create components for plain text with styling.

## Notes rule

When notes are requested, keep them slide-local and delivery-oriented.
Use Slidev note comments at the end of the slide.

## Quality bar

A good result has readable `slides.md`, useful `deck.spec.md`, centralized styles, few layouts, few components, good pacing, and no crowded slides.

For the full acceptance checklist (30+ items), see COMPILER_RULES.md § Acceptance checklist.

Additional requirements for project decks:
- through-line present in at least 3 slides (ideally 5-6), gaining meaning each time
- source materials digested and cited (real code, real numbers, real quotes)
- at least 1 visual evidence slide with real screenshots
- project colors override preset palette tokens
