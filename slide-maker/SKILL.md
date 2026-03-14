---
name: slide-maker
description: Create or update native Slidev deck projects. Use when the user asks to create a presentation, slide deck, talk, or Slidev project.
argument-hint: [goal or update instructions]
---

# slidev-project-studio

Create or update a native Slidev deck project.

## Reference documents — progressive loading

Load these files **only when entering the relevant phase**. Do not load all files upfront.

| Phase | Load these files | Purpose |
|-------|-----------------|---------|
| 1. Determine mode | (none) | — |
| 2. Gather sources | (none — read the project's own docs) | — |
| 3. Intake | [PRESENTATION_PHILOSOPHY.md](../docs/PRESENTATION_PHILOSOPHY.md) | Rhetorical principles for framing |
| 4. Style direction | [STYLE_PRESETS.md](STYLE_PRESETS.md) | Visual presets and token palettes |
| 5. Write spec | [DECK_SPEC.md](DECK_SPEC.md), [SLIDE_KINDS.md](SLIDE_KINDS.md) | Spec schema and slide type catalog |
| 6. Compile | [COMPILER_RULES.md](COMPILER_RULES.md), [SLIDEV_REFERENCE.md](SLIDEV_REFERENCE.md) | Compilation phases, Slidev features |
| 7. Validate | [COMPILER_RULES.md](COMPILER_RULES.md) § Acceptance checklist, [LLM_TELLS.md](../docs/LLM_TELLS.md) | Quality gates |
| 8. Deliver | (none — instructions below) | — |

[PROJECT_DECK_RUBRIC.md](../docs/PROJECT_DECK_RUBRIC.md) — load only when scoring a project deck.

## Scope

Supported modes: **create** or **update** a Slidev deck project.
Unsupported: standalone HTML, PPTX, HTML-to-Slidev, non-project artifacts. Redirect to a Slidev deck project.

## Required outputs

Always: `deck.spec.md`, `slides.md`, `README.md`.
When justified: `styles/tokens.css`, `styles/theme.css`, `layouts/*.vue`, `components/*.vue`, `public/images/*`.

## Source-of-truth model

`deck.spec.md` is the planning source. `slides.md` is the presentation source. `styles/`, `layouts/`, `components/` are the implementation layer. Structural changes start in `deck.spec.md` and must stay in sync with `slides.md`.

## Priorities (in order)

1. editability 2. clarity 3. coherence 4. native Slidev usage 5. reuse over duplication 6. restraint

## Non-negotiable rules

- Every slide must fit the viewport — no scrolling. If content overflows, split the slide.
- Always leave behind a coherent deck project
- Always use Markdown as the intermediate schema
- Follow the escalation ladder: Markdown > built-in layout > custom layout > custom component > inline HTML. Do not skip levels without a real reason.
- Split dense material across slides instead of cramming
- Remove dead abstractions when updating
- Never bypass the token system with hardcoded colors in `<style scoped>` blocks — use `var(--deck-*)` variables exclusively
- When notes are requested, keep them slide-local and delivery-oriented using Slidev note comments (see COMPILER_RULES.md § Notes for quality criteria and click marker sync)

## Workflow

### 1. Determine mode
New project or update.

### 2. Gather source material (project decks only)
When the deck presents a project (has `project-url` or references a codebase):
- Read the project's README, ARCHITECTURE, CHANGELOG, and LESSONS_LEARNED.
- Collect screenshots or terminal output from the running project.
- Extract a candidate through-line and note specific numbers, code snippets, quotes.

See COMPILER_RULES.md Phase 1 for the full source-material lookup table.

### 3. Intake
→ Load PRESENTATION_PHILOSOPHY.md now.

Normalize: title, goal, audience, presenter voice, target length, tone, source material, brand constraints, notes requirement, through-line (project decks), project-url (project decks), current constraints if updating.

### 4. Style direction
→ Load STYLE_PRESETS.md now.

Offer 2-3 directions in words only — preset/mood, typography, token direction, layout tendencies, motion character, expected abstraction density.

### 5. Write or revise `deck.spec.md`
→ Load DECK_SPEC.md and SLIDE_KINDS.md now.

Do this before implementation-heavy changes.

### 6. Compile the project
→ Load COMPILER_RULES.md and SLIDEV_REFERENCE.md now.

Generate or update: `slides.md`, styles, layouts, components, README if usage changed.

### 7. Validate
→ Load COMPILER_RULES.md § Acceptance checklist and LLM_TELLS.md now.

Check: spec-to-slides sync, slide density, Markdown editability, justified custom code, no unused abstractions.
For the full 30+ item checklist, load COMPILER_RULES.md § Acceptance checklist.
Project decks: through-line in 3+ slides (ideally 5-6), source materials cited, 1+ visual evidence slide, project colors override preset tokens.

### 8. Deliver

**Single deck:** `npx slidev build` produces `dist/` for any static host. `npx slidev export` produces PDF. Add `--format png` for slide images. The build is a static SPA — the host must serve `index.html` for all sub-routes; Slidev auto-generates `404.html` and `_redirects`.

**Multiple decks (escalation order):**
1. **Gallery build** (recommended) — `build.sh` builds all decks to `_build/{name}/` with generated `index.html` menu and root `_redirects`. One folder, one deploy.
2. **Cloudflare Pages** — `build.sh` + `wrangler pages deploy _build`.
3. **Cloudflare Workers Static Assets** — `build.sh` + Worker with `[assets]` binding. Needs root `_redirects` (auto-generated).
4. **GitHub Pages + Actions** — push to main, CI builds, deploys to `gh-pages`.
5. **PDF portfolio** — `slidev export` each deck, bundle in shared folder.
6. **Containerized** — `_build/` + nginx in Docker.
7. **Static site wrapper** — Astro/Vite outer shell, each deck becomes a route.
8. **Single-file HTML** — inline all assets into one `.html` per deck.
9. **CDN + shareable links** — upload `_build/` to R2/S3, generate URLs.
10. **Hybrid: gallery + PDF** — web gallery + PDF exports for offline.

Default: Option 1 for 2+ decks. For a single deck, just `slidev build` + deploy `dist/`.

**Updating a collection:**
- `build.sh` rebuilds all decks (pass specific names for incremental rebuild).
- Regenerate gallery `index.html` and `_redirects` when decks are added/removed/renamed.
- Atomic-deploy hosts: redeploy entire `_build/`. S3/R2: use `--sync`.
- `build.sh` maintains the canonical deck list in its `DECKS` array — update it first when adding/removing decks.

### Feedback loops
- If the user rejects style direction → return to Phase 4.
- If validation fails → fix issues, re-validate (max 2 cycles before asking user).
- If spec changes after compile → update slides to match, re-validate.

### Done condition
The deck is complete when all MUST items in the acceptance checklist pass, the user has approved style direction, and `deck.spec.md` is in sync with `slides.md`.
