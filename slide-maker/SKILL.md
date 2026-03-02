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
- Prefer plain Markdown first
- Prefer built-in Slidev layouts before custom layouts
- Prefer custom layouts before custom components
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

## Escalation ladder

Use the lowest level that solves the slide cleanly:
1. Markdown
2. built-in layout
3. local custom layout
4. local custom component
5. inline HTML

Do not skip levels without a real reason.

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

A good result has:
- readable `slides.md`
- useful `deck.spec.md`
- centralized styles
- few layouts
- few components
- good pacing
- obvious hierarchy
- no crowded slides
- no legacy HTML smell
- (project decks) through-line present in 5+ slides, gaining meaning each time
- (project decks) source materials digested and cited in slides (real code, real numbers, real quotes)
- (project decks) at least 1 visual evidence slide with real screenshots
- (project decks) project colors override preset palette tokens
