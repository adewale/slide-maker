---
name: slide-maker
description: Generate presentation decks grounded in real GitHub projects, or walk through a structured brief-to-slides process. Use when the user asks to create a presentation, slide deck, talk, pitch, keynote, or Slidev project — especially when they want slides based on an existing codebase, architecture, or project documentation.
argument-hint: [goal or update instructions]
---

# slidev-project-studio

Create or update a native Slidev deck project.

## Reference documents — progressive loading

Load these files **only when entering the relevant phase**. Do not load all files upfront.

| Phase | Load these files | Purpose |
|-------|-----------------|---------|
| 1. Determine mode | (none) | — |
| 2. Gather sources | [SOURCES.md](SOURCES.md) (project decks only) | Source-material lookup, extraction heuristics, through-line, project identity |
| 3. Intake | [PRESENTATION_PHILOSOPHY.md](../docs/PRESENTATION_PHILOSOPHY.md), [STORYTELLING.md](../docs/STORYTELLING.md) | Rhetorical principles, narrative structure, through-line design |
| 4. Style direction | [STYLE_PRESETS.md](STYLE_PRESETS.md) | Visual presets and token palettes |
| 5. Write spec | [DECK_SPEC.md](DECK_SPEC.md), [SLIDE_KINDS.md](SLIDE_KINDS.md) | Spec schema and slide type catalog |
| 6. Compile | [COMPILER_RULES.md](COMPILER_RULES.md), [SLIDEV_REFERENCE.md](SLIDEV_REFERENCE.md) | Compilation phases, Slidev features |
| 7. Validate | [ACCEPTANCE_CHECKLIST.md](ACCEPTANCE_CHECKLIST.md), [LLM_TELLS.md](../docs/LLM_TELLS.md) | Quality gates |
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
→ Load SOURCES.md now.

When the deck presents a project (has `project-url` or references a codebase):
- Read the project's README, ARCHITECTURE, CHANGELOG, and LESSONS_LEARNED.
- Collect screenshots or terminal output from the running project.
- Extract a candidate through-line and note specific numbers, code snippets, quotes.

See SOURCES.md for the full source-material lookup table, extraction heuristics, and project identity rules.

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
→ Load ACCEPTANCE_CHECKLIST.md and LLM_TELLS.md now.

Check: spec-to-slides sync, slide density, Markdown editability, justified custom code, no unused abstractions.
For the full 30+ item checklist, see ACCEPTANCE_CHECKLIST.md.
Project decks: through-line in 3+ slides (ideally 5-6), source materials cited, 1+ visual evidence slide, project colors override preset tokens.

### 8. Deliver

After validation, tell the user their deck is ready and present these next steps:

**Preview locally:**
```
npx slidev
```

**Share as PDF:**
```
npx slidev export
```
The built deck also has a PDF download button (from `download: true` in headmatter).

**Deploy to Cloudflare Workers:**
```
python tools/deploy-cf.py
```
One command: builds the deck, creates a Workers Static Assets project, deploys. Requires `npx wrangler login` first. Pass `--name my-talk` for a custom worker name.

**Deploy manually:** `npx slidev build` produces `dist/` — a static SPA deployable to any host (Cloudflare Pages, Vercel, Netlify, GitHub Pages). The host must serve `index.html` for all sub-routes.

**Post-generation follow-up:** After presenting the next steps, ask: *"Want me to help you deploy this?"* If the user says yes, walk them through `wrangler login` (if needed) and run `deploy-cf.py`.

**Multiple decks (collection):**
For maintainers hosting multiple decks as a gallery:
- `python tools/deploy-cf.py --collection` — builds all decks and deploys as a gallery
- `python tools/build.py` — builds all decks to `examples/_build/` without deploying
- Gallery includes `index.html` menu, `llms.txt` manifest, per-slide Markdown API

**Updating a collection:**
- `build.py` rebuilds all decks. Generated decks are auto-discovered from `generated-decks/`.
- Regenerate gallery `index.html` when decks are added/removed.
- `deploy-cf.py --collection` redeploys everything.

### Feedback loops
- If the user rejects style direction → return to Phase 4.
- If validation fails → fix issues, re-validate (max 2 cycles before asking user).
- If spec changes after compile → update slides to match, re-validate.

### Done condition
The deck is complete when all MUST items in the acceptance checklist pass, the user has approved style direction, and `deck.spec.md` is in sync with `slides.md`.
