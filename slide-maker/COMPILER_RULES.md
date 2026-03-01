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
- No uniform transitions — vary per slide context
- No dumping every bullet on screen at once — use `<v-clicks>` for progressive reveal
- No same layout for every content slide — alternate between built-in layouts
- No blanket `.slidev-layout { background }` overrides when using a non-default theme — let the theme control its own backgrounds

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

### 1. Normalize the spec
Resolve meta, tokens, slide inventory, layout inventory, and component inventory.
Prefer the newest structural intent.

### 2. Decide implementation level per slide
Use the lowest level that solves the slide cleanly:
1. Markdown
2. built-in layout
3. local custom layout
4. local custom component
5. inline HTML

### 3. Write deck headmatter
Keep it small and legible.
Typical fields:
- `theme` — choose based on deck personality: `default` for bold/energetic, `seriph` for editorial/literary, `apple-basic` for clean/technical
- `title`
- `colorSchema`
- `fonts` — omit when using `seriph` or `apple-basic` to let their native fonts come through
- `layout` — the first slide's layout (e.g. `cover`) must be set here; a separate `layout` block after the headmatter creates an empty first slide
- `transition` — set a global default, then override per-slide for variety

### 4. Write slides
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
- vary transitions: `fade` for reflective moments, `slide-left` for progression, `slide-up` for reveals

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

### 5. Write tokens
Emit `styles/tokens.css` only for deck-level semantic variables that are actually used.
Required variables: `--deck-bg`, `--deck-fg`, `--deck-accent`, `--deck-muted`.
Optional: `--deck-accent-alt`, `--deck-font-display`, `--deck-font-body`, `--deck-font-mono`.

### 5b. Write styles entry point
Emit `styles/index.css` — this is the **only** file Slidev auto-discovers. It must `@import` the other style files:
```css
@import './tokens.css';
@import './theme.css';
```
Without `styles/index.css`, neither tokens nor theme styles will be loaded into the build, even if `styles/tokens.css` and `styles/theme.css` exist on disk.

### 6. Write theme styles
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

### 7. Write local layouts
Create only for recurring structures that materially reduce duplication.
Layouts must consume tokens and stay restrained.

### 8. Write local components
Create only for recurring structured blocks with a shallow prop API.
No unnecessary state.

### 9. Prune dead code
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

### Closing slides
- End with a memorable takeaway or thesis statement
- Never close with "Thanks", "Questions?", or a bare URL
- The final impression should reinforce the deck's core insight

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
- transitions vary — not the same on every slide
- Mermaid diagram node labels use plain text, no emoji
- text is legible on all slides (proper contrast between foreground and background)
- Mermaid nodes: light fills have dark text, dark fills have light text (see Color methodology)
- narrative arc present: tension, exploration, insight, resolution (see Storytelling)
- diagram scale set explicitly, node counts within limits (see Diagram guidelines)
- v-click animation matches the deck's style preset (see Animation guidelines)
- at least one `v-motion` element in the deck
- no slide overflows the viewport (7 bullet max, 8 code line max, 60 char bullet max)
