# Acceptance checklist

## MUST (hard fail — blocks delivery)

These items must all pass before a deck can be delivered:

**Viewport overflow:**
- `styles/index.css` includes `.slidev-layout { overflow: hidden; }` — CSS safety net against scrolling slides
- no slide overflows the viewport (7 bullet max, 8 code line max, 60 char bullet max)

**Content density:**
- no emoji anywhere in slide content or diagrams

**Token and style integrity:**
- `tokens.css` defines all four required tokens: `--deck-bg`, `--deck-fg`, `--deck-accent`, `--deck-muted`
- no `<style scoped>` block uses literal hex/rgb for `background` or `color` properties — must use `var(--deck-*)` token variables

**Contrast (CRAP):**
- text is legible on all slides (proper contrast between foreground and background — WCAG AA)
- Mermaid nodes: every flowchart node has an explicit `style` with `fill`, `stroke`, and `color`
- Mermaid links: every flowchart has `linkStyle default` with a stroke color that contrasts with `--deck-bg`
- Mermaid classDef: every defined classDef is assigned to at least one node
- Mermaid diagram node labels use plain text, no emoji
- section dividers visually invert the default slide (dark-on-light or light-on-dark)
- dark-background decks do not use sequenceDiagram or stateDiagram-v2 (convert to flowcharts — see COMPILER_RULES.md § Diagram type reliability matrix)
- end slide is not a black void on light-themed decks
- inverted layout variants (`section`, `end`) pass WCAG AA contrast

**Alignment (CRAP):**
- cover layout in theme.css explicitly sets `align-items` and `text-align` (no relying on theme defaults)
- centered layouts (`center`, `statement`, `fact`, `end`) center both headings and body text consistently
- no `max-width` on `end`/`fact`/`section` layout children without `margin: 0 auto`
- no mixed alignment (centered heading + left body, or vice versa) on any slide
- two-column slides have balanced content weight (neither column less than 30% of the other)

**Structural integrity:**
- `deck.spec.md` matches `slides.md` (spec-to-slides sync)
- `slides.md` reads like a human-maintained deck
- layouts are few and purposeful
- components are few and purposeful
- styles are centralized
- the project can be extended without rewrite

**Narrative:**
- narrative arc present: tension, exploration, insight, resolution (see COMPILER_RULES.md § Storytelling)
- closing slide echoes or resolves the opening question/metaphor — not an install command
- no slide contradicts another slide in the same deck
- every content slide with a factual claim, war story, or code example has a `Sources:` block in its presenter notes
- war story slides cite specific evidence (file path, commit, screenshot, or incident) — not just the project repo URL

**Project decks:**
- through-line appears in at least 3 slides (ideally 5-6), gaining new meaning each time
- source materials section lists at least 2 digested documents
- at least 1 visual evidence slide with real screenshot or terminal output (no placeholders)
- project colors override preset palette when project-url is declared

**Concept decks:**
- source citations use `file:` prefix referencing real skill repo files

## SHOULD (quality flag — does not block delivery)

These items improve quality but do not block delivery:

**Repetition (CRAP):**
- `--deck-accent` used for the same semantic purpose on every slide (emphasis, markers, interactive elements)
- each transition type used in the deck has a consistent semantic meaning (see Transition grammar)
- each v-mark type has one meaning per deck (see Transition grammar § Element animations)
- transition vocabulary matches the style preset's recommended set (see STYLE_PRESETS.md)
- list markers use accent token colors consistently across all slides

**Proximity (CRAP):**
- structural rhythm pattern followed: section divider → 2-3 content slides → pause slide → repeat
- diagrams and their annotation text are adjacent with no unrelated content between them
- v-clicks items within a single block are conceptually related

**Animation and interaction:**
- at least one `v-motion` element in the deck
- at least one slide uses hover-interactive elements (data cards, code blocks, or comparison grids)
- v-click animation matches the deck's style preset (see Animation guidelines)

**Layout variety:**
- at least 3 different layout types used across the deck
- bullet lists use `<v-clicks>` for progressive reveal

**Diagrams:**
- diagram scale set explicitly, node counts within limits (see COMPILER_RULES.md § Diagram guidelines)

## Enforcement and verification

The CRAP principles and other acceptance criteria are enforced at three levels:

### Level 1: Automated (deck-lint.mjs)

These checks run automatically and produce errors or warnings:

| Check | Principle | Severity |
|-------|-----------|----------|
| Required tokens present (`--deck-bg`, `--deck-fg`, `--deck-accent`, `--deck-muted`) | Contrast | Error |
| Every flowchart node has explicit `style` with `color` | Contrast | Error |
| Every flowchart has `linkStyle default` | Contrast | Error |
| Every `classDef` is assigned to at least one node | Contrast | Error |
| Bullet length <= 60 characters | Density | Error |
| Bullet count <= 7 per slide | Density | Error |
| Code lines <= 8 per block | Density | Error |
| No hardcoded hex/rgb in scoped styles | Repetition | Error |
| No emoji in slide content or Mermaid labels | — | Error |
| Source citations present on factual slides | Narrative | Warning |
| v-click density < 50% of slides | — | Warning |
| Mermaid annotation text present (10+ chars) | Proximity | Warning |
| Unstyled nodes in flowcharts | Contrast | Warning |

### Level 2: Semi-automated (style-audit.mjs + visual spot-check)

These require human judgment but are aided by tooling:

| Check | Principle | How to verify |
|-------|-----------|---------------|
| Accent color used consistently across slides | Repetition | `style-audit.mjs` flags palette drift; human reviews semantic consistency |
| Section dividers invert the default palette | Contrast | Visual: section slides should look structurally different from content slides |
| Cover alignment explicitly set | Alignment | Grep theme.css for `.cover` selector; confirm `align-items` and `text-align` present |
| Typographic hierarchy visible (h1 > h2 > body) | Contrast | Visual: headings must be obviously larger and heavier than body text |
| Dark decks don't use sequenceDiagram/stateDiagram-v2 | Contrast | Grep slides.md for `sequenceDiagram\|stateDiagram` when colorSchema is dark |

### Level 3: Manual review (presenter walkthrough)

These require viewing the rendered deck:

| Check | Principle | What to look for |
|-------|-----------|------------------|
| Headings at consistent vertical position across slides | Alignment | Click through slides rapidly — headings should not jump |
| Related content grouped, unrelated content separated | Proximity | Each slide should have one clear focal group, not scattered elements |
| Structural rhythm feels natural | Proximity | Section → content → pause pattern should create breathing room |
| No orphaned elements | Proximity | Nothing should float without visual connection to other content |
| Mermaid arrows and labels visible | Contrast | Every arrow line and edge label must be readable against the slide background |
