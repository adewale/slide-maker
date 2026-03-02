# compiler rules

This document defines how to compile `deck.spec.md` into a Slidev deck project.

## Goals

Optimize for:
1. readable `slides.md`
2. stable project structure
3. low abstraction count
4. consistent tokens
5. native Slidev behavior
6. visual quality — no AI-generated aesthetic

## Anti-patterns (never do these)

- No emoji in slides or Mermaid diagrams
- No generic stock phrases ("Let's dive in", "In conclusion")
- No overused font families across decks (Inter, Inter Tight, Roboto, Arial) — each deck must use fonts from STYLE_PRESETS.md for its preset. Never default to Inter.
- No purple-gradient-on-white cliches
- No ad-hoc transitions — every transition type must have a consistent semantic meaning (see Transition grammar)
- No dumping every bullet on screen at once — use `<v-clicks>` for progressive reveal
- No same layout for every content slide — alternate between built-in layouts
- No blanket `.slidev-layout { background }` overrides when using a non-default theme — let the theme control its own backgrounds
- No hardcoded colors in scoped styles — always reference `var(--deck-*)` tokens. Literal hex/rgb values in `<style scoped>` blocks bypass the token system and cause palette drift.

## Inputs

Required:
- `deck.spec.md`

Optional existing context:
- `slides.md`
- `styles/tokens.css`
- `styles/theme.css`
- `layouts/*.vue`
- `components/*.vue`

## Outputs

Required:
- `slides.md`
- `README.md`

Optional:
- `styles/tokens.css`
- `styles/theme.css`
- `layouts/*.vue`
- `components/*.vue`

## Phases

### 1. Gather and digest source material (project decks only)

When `project-url` is declared in the spec, read the project's source documents before compiling. Each source type contributes differently:

| Source | What it provides | Deck contribution |
|--------|-----------------|-------------------|
| README | Factual backbone — what, why, how | Accurate claims, correct terminology, feature inventory |
| CHANGELOG | Temporal narrative — what evolved | Story arc, "before/after" moments, version milestones |
| ARCHITECTURE | Structural understanding — how pieces connect | Diagrams, code examples, system-level slides |
| LESSONS_LEARNED | Storytelling gold — what surprised, what broke | War stories, counterintuitive findings, design insights |
| Screenshots | Visual evidence — proof it works | `visual-evidence` slides, hero images |

Rules:
- Read at least 2 sources before writing any slides.
- Extract the through-line from the source material — it should emerge naturally from the project's own story.
- Note specific numbers, code snippets, and quotes for later use — vague paraphrases are weaker than exact project data.

### 1b. Extract the through-line (project decks only)

The through-line is the conceptual thread that runs through every section of the deck. It must come from the source material, not be imposed on it.

**Through-line types:**

| Type | Shape | Example |
|------|-------|---------|
| `question` | A question posed early, answered repeatedly | "What happens when you give a function a name, a memory, and a mailbox?" |
| `metaphor` | A concrete image that maps to the abstract concept | "The garden grows itself" (for emergent systems) |
| `concept` | A technical idea that connects all sections | "Single-threaded guarantee" (connecting state, sync, coordination) |
| `provocation` | A bold claim the deck proves or disproves | "The agent is the application" |
| `design-rule` | A constraint that shaped every decision | "Read-only to sources" |

**Through-line IS:**
- Present in 5-6 slides across the deck
- Gaining new meaning with each appearance
- Resolved or answered in the closing slides

**Through-line IS NOT:**
- A tagline that appears only on the cover and closing (bookend syndrome)
- A decorative metaphor with no analytical function
- Multiple competing threads (one deck, one through-line)

### 2. Normalize the spec
Resolve meta, tokens, slide inventory, layout inventory, and component inventory.
Prefer the newest structural intent.

### 3. Decide implementation level per slide
Use the lowest level that solves the slide cleanly:
1. Markdown
2. built-in layout
3. local custom layout
4. local custom component
5. inline HTML

### 4. Write deck headmatter
Keep it small and legible.
Typical fields:
- `theme` — choose based on deck personality: `default` for bold/energetic, `seriph` for editorial/literary, `apple-basic` for clean/technical
- `title`
- `colorSchema`
- `fonts` — omit when using `seriph` or `apple-basic` to let their native fonts come through
- `layout` — the first slide's layout (e.g. `cover`) must be set here; a separate `layout` block after the headmatter creates an empty first slide
- `transition` — set a global default matching the deck's most common transition (see Transition grammar)

### 5. Write slides
Rules:
- minimal frontmatter
- clean Markdown
- no wrapper soup
- notes as end-of-slide comments
- one idea per slide — if you need to scroll, split it
- use `<v-clicks>` on bullet lists for progressive reveal
- vary layouts across the deck — alternate between content, section dividers, facts, quotes
- add Mermaid diagrams for architecture and data flow where appropriate
- never use emoji in Mermaid node labels or anywhere in slide content
- assign transitions by semantic meaning from the Transition grammar — each transition type must mean the same thing every time it appears

#### Built-in layouts to use
Use these before creating custom layouts:
- `cover` — opening slide only
- `center` — key statements
- `statement` — bold assertions
- `section` — chapter dividers (creates visual rhythm)
- `fact` — single statistic or number
- `quote` — attributed quotations
- `two-cols` — comparing two things, dual lists
- `two-cols-header` — header spanning both columns + two columns below
- `image` / `image-left` / `image-right` — pairing content with visuals
- `end` — closing slide

#### Structural rhythm
Alternate slide types to avoid visual monotony:
1. Section divider (dark, big text, `layout: section`)
2. Content slides (2-3 slides of substance)
3. Pause slide (quote, diagram, or fact)
4. Repeat

#### Transition grammar

Transitions are semantic — each one carries a fixed meaning within a deck. Choose transitions for their meaning, never for visual novelty.

**Slide transitions** (between slides — the page turn):

| Transition | Semantic meaning | Use when |
|-----------|-----------------|----------|
| `fade` | **Reflection / pause** — the audience absorbs what was said | Statements, quotes, facts, closing slides, any moment of emphasis |
| `slide-left` | **Progression** — moving forward through a sequence | Default for content progression, feature lists, step-by-step |
| `slide-up` | **Reveal / elevation** — surfacing something hidden | Code reveals, data slides, evidence, "here's what we found" |
| `iris` | **New chapter** — dramatic entrance to a new section | Section dividers only. Max 2-3 per deck. |
| `morph-fade` | **Conceptual shift** — the frame of reference changes | Moving between different mental models, before/after, paradigm shifts |
| `wipe-right` | **Comparison / juxtaposition** — placing things side by side | Two-cols layouts, A vs B slides, comparison slides |
| `zoom-in` | **Focus** — drilling into detail | Zooming from overview to specifics, from architecture to code |
| `glide` | **Continuation** — smooth continuation within a section | Secondary content slides within a section, gentle forward motion |

**Rules:**
- Pick 3-5 transitions per deck from this table. Not all decks need all transitions.
- Each transition must mean the same thing every time it appears in a deck. If `iris` means "new chapter" on slide 5, it must mean "new chapter" on slide 12.
- The global default (headmatter `transition:`) should be the deck's most common transition — usually `slide-left` (progression-heavy) or `fade` (reflective).
- Never use a transition for its visual novelty. Choose it for its semantic meaning.
- Sumi-e exception: `fade` only is intentional — contemplative decks use a single "breath" transition.

**Element animations** (within a slide — how content appears):

| Animation | Semantic meaning | Use when |
|-----------|-----------------|----------|
| `v-clicks` | **Progressive disclosure** — reveal items one at a time | Bullet lists, step-by-step arguments, any enumerated content |
| `v-click.hide` | **Replacement** — old content leaves, new arrives | Before/after comparisons, state changes |
| `v-mark` (underline) | **Emphasis** — "this term matters" | Key terms, definitions, the first use of an important concept |
| `v-mark` (highlight) | **Spotlight** — "look at this specific thing" | Code lines, data points, the "aha" moment |
| `v-mark` (strike) | **Rejection** — "this was wrong" | False trails, deprecated approaches, myths |
| `v-mark` (circle) | **Isolation** — "this one thing" | Single words, single numbers, surprising details |
| `v-mark` (box) | **Containment** — "this group belongs together" | Related concepts, framework boundaries |
| `v-motion` | **Entrance with purpose** — element arrives from somewhere | Architecture diagrams, hero elements, data that builds up |
| Magic Move | **Transformation** — code evolves before your eyes | Before/after code, refactoring, the fix |

**Rules:**
- Each v-mark type has ONE meaning in a deck. If `underline` means "key term" on slide 3, it means "key term" on slide 8.
- `v-motion` is for elements that deserve a dramatic entrance. Max 3-4 per deck.
- Magic Move is for code transformations only. Never use it for prose.

#### Mermaid diagrams
Use fenced code blocks with `mermaid` language. Style nodes to match the deck's accent color.
```
graph LR
  A["Node A"] --> B["Node B"]
  style A fill:#accent,stroke:#accent,color:#0a0a0f
```
Available diagram types: flowchart, sequenceDiagram, classDiagram, stateDiagram-v2, erDiagram, gantt, pie, journey, gitgraph, mindmap, timeline, quadrantChart.

#### Click animations
Wrap bullet lists in `<v-clicks>` for progressive reveal:
```
<v-clicks>

- First point
- Second point

</v-clicks>
```
Use `v-click` on individual elements. Use `v-click.hide` to hide elements. Use `v-after` for simultaneous reveal with previous click.

#### Code diff display

Three Slidev-native mechanisms for showing code changes, in escalation order:

**1. Line highlighting with click steps** — simplest, best for walkthrough:
```
```ts {1-3|5-7|all}
// highlighted lines change on each click
```
```
Use `[filename.ts]` bracket syntax to add a title bar header to the code block.

**2. Magic Move** — animated code transformation between states:
````
````md magic-move
```ts
// Before
const x = 1
```
```ts
// After
const x = computed(() => 1)
```
````
````
Best for refactoring demos, before/after, progressive code evolution.

**3. Side-by-side diff** — two-cols layout with paired code blocks:
```
---
layout: two-cols
---
```ts [before.ts]
// old code
```
::right::
```ts [after.ts]
// new code
```
```
Best for explicit comparison where both versions need to be visible simultaneously.

**Escalation order:** line highlighting → Magic Move → two-cols side-by-side. Use the simplest mechanism that communicates the change clearly.

#### Comparison grid tables

CSS Grid-based comparison tables for feature matrices and multi-column comparisons:
- Use CSS Grid (`grid-template-columns`) not HTML `<table>` for 3+ column comparisons
- Use `var(--deck-*)` tokens for all colors
- Maximum 4 columns, maximum 6 rows
- Use Iconify icons for checkmarks (`<mdi-check />`, `<mdi-close />`) — never emoji
- Header row should use `var(--deck-accent)` for emphasis

### 5b. Place visual evidence (project decks only)

When source material includes screenshots, place them using the `visual-evidence` slide kind:
- Use `image-right` or `image-left` layouts — never full-bleed (the image supports the narrative, not replaces it).
- Every image must have alt text that describes what the screenshot proves, not what it shows.
- Never use placeholder images. If no real screenshot exists, use a code block or Mermaid diagram instead.
- Limit to 2-4 visual evidence slides per deck — enough to prove the project works, not a gallery.

### 6. Write tokens
Emit `styles/tokens.css` only for deck-level semantic variables that are actually used.
Required variables: `--deck-bg`, `--deck-fg`, `--deck-accent`, `--deck-muted`.
Optional: `--deck-accent-alt`, `--deck-font-display`, `--deck-font-body`, `--deck-font-mono`.

### 6a. Extract project colors (project decks only)

When `project-url` is declared, extract the project's brand colors from its README, website, or documentation. Project colors override the preset palette for `accent`, `accent-alt`, `bg`, and `fg`. The preset still controls typography, motion, layout tendencies, and interaction patterns.

Rules:
- If the project has a clear brand color (e.g., Cloudflare orange `#ff6633`), use it as `--deck-accent`.
- If the project has a dark/light identity, match `bg`/`fg` to it.
- Do not override preset typography or motion — only palette tokens.

### 6b. Write styles entry point
Emit `styles/index.css` — this is the **only** file Slidev auto-discovers. It must `@import` the other style files:
```css
@import './tokens.css';
@import './theme.css';
```
Without `styles/index.css`, neither tokens nor theme styles will be loaded into the build, even if `styles/tokens.css` and `styles/theme.css` exist on disk.

### 7. Write theme styles
Emit `styles/theme.css` for deck-wide typography, color application, layout shell styling, and small helper classes.
Do not create a mini CSS framework.

When using a non-default theme (`seriph`, `apple-basic`):
- Do NOT override `.slidev-layout { background }` — let the theme handle backgrounds
- Do NOT override heading font families — let the theme's typography come through
- Only set `color: var(--deck-fg)` and accent-color overrides

Always include v-click animation styles matching the deck's style preset (see Animation guidelines for the per-preset table):
```css
/* Example: bold-modern preset */
.slidev-vclick-target {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.slidev-vclick-hidden {
  opacity: 0;
  transform: scale(0.95) translateY(8px);
}
```

### 8. Write local layouts
Create only for recurring structures that materially reduce duplication.
Layouts must consume tokens and stay restrained.

### 9. Write local components
Create only for recurring structured blocks with a shallow prop API.
No unnecessary state.

### 10. Prune dead code
When updating:
- remove unused layouts
- remove unused components
- remove dead token variables
- keep the project small

## Available Slidev features

See `SLIDEV_REFERENCE.md` for the complete feature reference including all 19 built-in layouts, 18+ built-in components, animation directives, code highlighting, Magic Move, Mermaid/PlantUML, LaTeX, icons, MDC syntax, global layers, and more.

## Synchronization rules

Whenever structure changes:
1. update `deck.spec.md`
2. update `slides.md`
3. update implementation files

Do not let the spec and deck drift apart.

## Color methodology

### Contrast ratios (WCAG AA)
- Normal text (< 24px / < 18.66px bold): minimum **4.5:1** against its background
- Large text (>= 24px / >= 18.66px bold): minimum **3:1** against its background
- Accent-on-background combinations must pass 4.5:1 independently

### Mermaid diagram nodes
- Light fill (e.g. `#dcfce7`, `#fef3c7`, `#fff3e0`) must use **dark text** (`color:#14532d`, `color:#713f12`, `color:#7c2d12`) — never accent-on-light-accent (e.g. `#ca8a04` on `#fef3c7` is 1.8:1, fails)
- Dark fill (e.g. `#2d8a4e`, `#ca8a04`, `#f6821f`) must use **light text** (`color:#fff`)
- Never rely on Mermaid's default text colors — always set `color` explicitly in every `style` directive

### Muted text
- On dark backgrounds: minimum opacity 60% (`rgba(255,255,255,0.6)`)
- On light backgrounds: minimum opacity 70% (`rgba(0,0,0,0.7)`)

### Pre-commit check
Before finalizing any deck, verify every text/background pair:
1. Mermaid nodes: every `style` line must have an explicit `color` value
2. Light fills get dark text; dark fills get light text
3. No accent color used as text on a tinted version of itself

## Storytelling

### Narrative arc
Every deck needs a story structure, not a feature list:
- **Tension** — open with a problem, contradiction, or surprising fact
- **Exploration** — walk through the journey, showing real decisions and trade-offs
- **Insight** — present a counterintuitive finding or unexpected result
- **Resolution** — close with a memorable takeaway

### Opening slides
- Never open with a feature list or table of contents
- Use a contradiction ("147 plant species. Zero dependencies."), a problem ("160x120px. A thumbnail that should have been 9504x6320."), or a bold claim
- The first content slide after the cover should create tension or curiosity

### Content slides
- At least one slide must present a counterintuitive finding or unexpected data point
- Use real data, real quotes, real code from the project — not placeholder content
- Prefer prose and specific numbers over generic bullet points
- Draw from project Lessons Learned documents when available

### Through-line (project decks)

The through-line is how the deck holds together — not a tagline, but a conceptual thread that gains new meaning each time it surfaces.

**Per slide type:**
- `cover` — introduce the through-line (pose the question, state the metaphor)
- `section` — refract the through-line through a new lens ("a function with a name becomes a game server")
- `center` / `statement` — reflect on the through-line at a turning point
- `end` — resolve the through-line (answer the question, complete the metaphor)

**Anti-patterns:**
- **Bookend syndrome** — through-line appears only on cover and closing. The middle slides forget it exists.
- **Decorative metaphor** — the metaphor sounds nice but does no analytical work. "Like a river" tells you nothing.
- **Competing through-lines** — two conceptual threads fight for attention. Pick one. The other is a sub-theme at best.

### Closing slides
- End with a memorable takeaway or thesis statement
- Never close with "Thanks", "Questions?", or a bare URL
- The final impression should reinforce the deck's core insight

### Presentation philosophy
These compilation-affecting rules come from the full [PRESENTATION_PHILOSOPHY.md](../docs/PRESENTATION_PHILOSOPHY.md):
- **One idea per slide** — 1-3 lines max. If you're scrolling, split it.
- **Sustained metaphor** — the through-line's metaphor does analytical work, not decoration. It must bear weight across the whole deck.
- **Dialectical progression** — decks are arguments (thesis → complication → synthesis), not outlines or feature lists.
- **Text-dominant** — images only when demonstrative. Most slides are pure Markdown.
- **Provocative openings** — never an agenda slide. Open with a question, epigraph, or bold declaration.
- **Resonant closings** — never "Questions?" or "Thank you". Circle back, linger, or declare.

## Diagram guidelines

### Scale
- Always set `scale` explicitly in Mermaid options: ` ```mermaid {theme: 'base', scale: 0.85} `
- Complex diagrams (6+ nodes): scale 0.7–0.8
- Simple diagrams (3–5 nodes): scale 0.85–0.9
- Default: 0.85

### Node limits
- Flowcharts: maximum 8 nodes
- Mindmaps: maximum 12 nodes
- Timelines: maximum 6 entries
- If a diagram exceeds these limits, split into multiple diagrams or use a legend slide

### Node labels
- Maximum 3 words per label
- Use abbreviations and provide a legend slide if domain terms need explanation
- No emoji in labels (existing rule, reinforced)

### Theme control
- Always specify theme explicitly: `{theme: 'base'}` or `{theme: 'neutral'}`
- Never rely on Mermaid defaults — they shift between versions
- For dark-background decks, use `{theme: 'dark'}` and verify text remains readable

### Layout collision prevention
- For slides with both text and diagrams, use absolute positioning (`class: absolute`) or dedicated diagram-only slides
- Prefer diagram-only slides over cramming text and diagrams together

### Custom SVG diagram escalation
When Mermaid can't achieve the needed visual (rounded cards, gradient borders, branded styling):
1. **Mermaid first** — use it for all standard diagram types (flowchart, sequence, state, timeline, etc.)
2. **Custom HTML/SVG** — escalate only when brand consistency requires it
   - Use `var(--deck-*)` tokens for all colors — no hardcoded hex
   - Keep SVG inline in the slide (no external .svg files)
   - Prefer CSS Grid + styled `<div>` elements over raw `<svg>` when the diagram is a layout of cards/boxes
   - Add a comment on the slide explaining the escalation reason: `<!-- Custom SVG: Mermaid can't render rounded branded cards -->`

## Animation guidelines

### Transitions
Every deck must use at least 2 different slide transition types. Available named transitions:
- **Built-in:** `fade`, `slide-left`, `slide-up`, `view-transition`
- **Cinematic (from `styles/transitions.css`):** `iris`, `wipe-right`, `wipe-up`, `morph-fade`, `zoom-in`, `zoom-out`, `flip-x`, `flip-y`, `cube`, `swing`, `blur`, `glide`

Set a global default in headmatter, then override per-slide for variety.

### v-click presets
Use the preset-specific animation in each deck's `theme.css`, not the generic `translateY(8px)`:

| Preset | `.slidev-vclick-hidden` | Transition |
|--------|------------------------|------------|
| `editorial-dark` | `opacity: 0` | `0.5s ease` |
| `swiss-minimal` | `opacity: 0; translateX(-6px)` | `0.35s ease-out` |
| `bold-modern` | `opacity: 0; scale(0.95) translateY(8px)` | `0.4s cubic-bezier(0.4,0,0.2,1)` |
| `sumi-e` | `opacity: 0; translateX(12px)` | `0.6s cubic-bezier(0.4,0,0.2,1)` |
| `tufte-data` | `opacity: 0` | `0.3s ease` |
| `material-design` | `opacity: 0; scale(0.92)` | `0.4s cubic-bezier(0.05,0.7,0.1,1.0)` |

### v-motion
At least one element per deck should use `v-motion` for entrance animation. Example:
```html
<div v-motion :initial="{ x: -80, opacity: 0 }" :enter="{ x: 0, opacity: 1, transition: { delay: 200, duration: 800 } }">
```

### Overflow guard
- Maximum 7 bullets per slide — split if exceeded
- Maximum 8 code lines per code block — truncate or split
- Maximum 60 characters per bullet — rewrite if exceeded

### Available animation components
Copy into deck `components/` when needed:
- **GlassCard** — `backdrop-filter: blur(N)` card with `blur`, `opacity`, `border` props
- **ImageFX** — CSS filter wrapper with `effect` prop (`duotone` | `vignette` | `grain` | `grayscale` | `sepia` | `none`)
- **ShadowStack** — Multi-layer box-shadow with `preset` prop (`subtle` | `dramatic` | `glow` | `neon` | `long`)
- **RevealPath** — CSS `offset-path` entrance with `path`, `duration`, `delay` props
- **CornerCard** — Decorative corner marks with `size`, `thickness`, `color`, `padding` props. Defaults to deck accent color.

## Hover and cursor patterns

### When to use hover
- **Data cards** — metric cards, comparison cards, architecture summaries. Hover-lift signals "there's depth here."
- **Comparison elements** — in two-column layouts, hover one side to dim the other (spotlight pattern).
- **Code blocks** — hover to highlight the relevant section, especially in multi-block slides.
- **Interactive grids** — step sequencer grids, feature matrices, metric dashboards.

### When NOT to use hover
- Decorative elements — backgrounds, dividers, brush strokes.
- Slide-level containers — `.slidev-layout` or slide wrappers.
- Text paragraphs — body text should never move on hover.
- Single-element slides — if there's nothing to compare or explore, hover adds noise.

### Preset-specific hover behavior

| Preset | Hover Style |
|--------|-------------|
| `editorial-dark` | Subtle lift + shadow deepening. Minimal. |
| `swiss-minimal` | Border accent shift only. No transform. |
| `bold-modern` | `scale(1.03)` + shadow spread. Confident. |
| `sumi-e` | Opacity shift + ink-wash border reveal. Contemplative. |
| `tufte-data` | Sidenote highlight + dim siblings (spotlight). Scholarly. |
| `cloudflare` | Card lift + lava glow border. Branded. |
| `material-design` | M3 state layer (8% surface tint on hover). Systematic. |

### Implementation
Import from `styles/interactions.css` for the standard patterns (`hover-lift`, `spotlight-group`, `hover-scale`, `hover-accent`), or write inline scoped styles for preset-specific behavior. See `STYLE_PRESETS.md` for per-preset interaction details.

## Spotlight and focus patterns

### Spotlight group pattern
Dim siblings on hover to focus attention on one element:

```html
<div class="spotlight-group">
  <div class="spotlight-item">Metric A</div>
  <div class="spotlight-item">Metric B</div>
  <div class="spotlight-item">Metric C</div>
</div>
```

When the presenter hovers over "Metric B", the other two dim to 30% opacity with a 1px blur. This forces the audience to focus on what the presenter is pointing at.

### Click-to-expand for dense content
Use `v-click` with height transitions to let the presenter choose depth:

```html
<div class="card-compact">Summary line</div>
<div v-click class="card-expanded">Full detail paragraph...</div>
```

### When to use spotlight and focus
- **Metrics grids** — 3-4 metric cards where each deserves individual attention.
- **Comparison slides** — side-by-side elements where the presenter walks through each.
- **Dense data** — tables, small multiples, or multi-section slides.
- **Architecture diagrams** — when multiple components need sequential explanation.

## Acceptance checklist

A compiled deck passes when:
- `slides.md` reads like a human-maintained deck
- `deck.spec.md` matches it
- layouts are few and purposeful
- components are few and purposeful
- styles are centralized
- the project can be extended without rewrite
- no emoji anywhere in slide content or diagrams
- at least 3 different layout types used across the deck
- bullet lists use `<v-clicks>` for progressive reveal
- each transition type used in the deck has a consistent semantic meaning (see Transition grammar)
- transition vocabulary matches the style preset's recommended set (see STYLE_PRESETS.md)
- Mermaid diagram node labels use plain text, no emoji
- text is legible on all slides (proper contrast between foreground and background)
- Mermaid nodes: light fills have dark text, dark fills have light text (see Color methodology)
- narrative arc present: tension, exploration, insight, resolution (see Storytelling)
- diagram scale set explicitly, node counts within limits (see Diagram guidelines)
- v-click animation matches the deck's style preset (see Animation guidelines)
- at least one `v-motion` element in the deck
- no slide overflows the viewport (7 bullet max, 8 code line max, 60 char bullet max)
- at least one slide uses hover-interactive elements (data cards, code blocks, or comparison grids)
- no `<style scoped>` block uses literal hex/rgb for `background` or `color` properties — must use `var(--deck-*)` token variables
- (project decks) through-line appears in at least 3 slides, gaining new meaning each time
- (project decks) source materials section lists at least 2 digested documents
- (project decks) at least 1 visual evidence slide with real screenshot or terminal output (no placeholders)
- (project decks) project colors override preset palette when project-url is declared
