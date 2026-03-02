# style presets

These presets are starting points for Slidev deck projects.
They define tokens, typography, layout tendencies, and motion character.

They are not fixed rendered themes.
They should be expressed through:
- `deck.spec.md`
- `styles/tokens.css`
- `styles/theme.css`
- local layouts and components only when needed

## Selection rule

Offer at most 2 or 3 directions.
For each option, state:
- preset name
- why it fits
- likely slide kinds
- expected abstraction density

Do not generate rendered HTML previews.

## Project color override

When a deck declares `project-url` and the project has identifiable brand colors, those colors override the preset's palette tokens:

- `--deck-accent` — project's primary brand color
- `--deck-accent-alt` — project's secondary color (if available)
- `--deck-bg` / `--deck-fg` — project's light/dark identity (if strongly established)

The preset still controls:
- Typography (font families, sizes, weights)
- Motion character (transition speed, easing, intensity)
- Layout tendencies (card styles, spacing, grid alignment)
- Interaction patterns (hover behavior, cursor style, spotlight)
- Transition vocabulary (which semantic transitions to use)

This means a cloudflare-preset deck for a project with green branding would still feel "warm, practical, workshop-ready" but with green accents instead of orange.

## editorial-dark

Mood: serious, modern, restrained, high-trust.

Palette:
- near-black background
- soft off-white foreground
- one cool accent
- muted secondary neutrals

Typography:
- display: **Playfair Display** (dramatic transitional serif, high contrast) or **Young Serif** (modern serif, dignified)
- body: **Source Sans 3** (friendly, readable Adobe sans) or **Lato** (warm, classically proportioned)
- mono: **JetBrains Mono**
- avoid: Inter, Roboto, Arial — too generic for this preset

Layout tendencies:
- large title blocks
- negative space
- split-insight slides
- sparse metrics slides
- hard section breaks

Motion:
- low-intensity fade and stagger
- timing over spectacle

Interaction:
- hover: subtle lift + shadow deepening — `translateY(-2px)` and deeper `box-shadow`
- cursor: `pointer` on cards only
- spotlight: dim siblings to 40% opacity, no blur (too dramatic for editorial)
- keep hover transitions at 0.25s ease — match the restrained motion character

Transition vocabulary: `fade`, `slide-left`, `morph-fade`
- Restrained. No iris or zoom. Prefer `fade` as the global default.

Best for:
- board decks
- strategy reviews
- investor updates
- product narratives

## swiss-minimal

Mood: precise, calm, disciplined, intelligent.

Palette:
- white or near-white background
- dark gray text
- one restrained accent
- subtle line system

Typography:
- display: **Plus Jakarta Sans** (clean geometric, wide weight range) or **DM Sans** (low-contrast geometric)
- body: **Figtree** (friendly, precise geometric) or **Source Sans 3** (readable, open apertures)
- mono: **JetBrains Mono**
- avoid: Inter, Roboto, Arial — too generic for this preset

Layout tendencies:
- grid alignment
- short slides
- crisp section breaks
- comparison and timeline slides

Motion:
- almost none
- subtle enters only

Interaction:
- hover: border accent shift only — `border-color: var(--deck-accent)` on hover, no transform
- cursor: default everywhere, `pointer` only on explicitly clickable elements
- spotlight: not recommended — too dramatic for this preset's calm character
- keep hover transitions at 0.2s ease-out — crisp, not floaty

Transition vocabulary: `fade`, `slide-left`
- Minimal. 2 transitions max. Prefer `fade` as the global default.

Best for:
- technical briefings
- workshop decks
- research synthesis
- product walkthroughs

## bold-modern

Mood: assertive, energetic, launch-oriented.

Palette:
- dark or saturated background
- high-contrast type
- bright accent pair

Typography:
- display: **Bebas Neue** (tall condensed all-caps, maximum impact) or **Outfit** (modern geometric, warm)
- body: **DM Sans** (clean geometric complement) or **Plus Jakarta Sans** (modern, versatile)
- mono: **JetBrains Mono**
- avoid: Inter, Roboto, Arial — too generic for this preset

Layout tendencies:
- statement slides
- image-caption slides
- metrics grids
- sharper asymmetry

Motion:
- medium-intensity reveals
- occasional directional movement
- still restrained

Interaction:
- hover: `scale(1.03)` + shadow spread — confident, slightly aggressive
- cursor: `pointer` on cards and interactive elements
- spotlight: full spotlight group with blur(1px) — bold contrast fits this preset
- keep hover transitions at 0.2s cubic-bezier(0.4, 0, 0.2, 1) — snappy M2 easing

Transition vocabulary: `slide-left`, `slide-up`, `iris`, `zoom-in`
- Energetic. Uses dramatic transitions. Prefer `slide-left` as the global default.

Best for:
- launches
- internal keynotes
- sales narratives
- marketing strategy decks

## sumi-e

Mood: contemplative, spacious, austere, philosophical.

Palette:
- `#f5f0e8` washi paper background
- `#1a1a1a` sumi ink foreground
- `#c23b22` vermillion hanko-red (used sparingly — one accent moment per deck)
- muted: `rgba(26, 26, 26, 0.4)`

Typography:
- display: **Zen Old Mincho** (traditional Japanese serif, literary weight)
- body: **Crimson Pro** (elegant old-style serif, high readability)
- mono: **JetBrains Mono**
- avoid: sans-serif fonts — this preset demands serifs throughout

Layout tendencies:
- radical negative space (60-75% empty per slide)
- asymmetric content offset (content in lower-left or upper-right third)
- one idea per slide, often a single sentence
- ink-wash dividers and brush-texture SVG elements
- Mermaid diagrams in grayscale with thin strokes

Motion:
- v-motion for elements that "grow" or "flow" like ink spreading
- slow, deliberate transitions (fade only)
- v-mark with type="underline" for the single red accent

Interaction:
- hover: opacity shift (0.7 to 1.0) + ink-wash border reveal — `border-bottom: 1px solid rgba(26,26,26,0.3)` appears on hover
- cursor: default everywhere — the contemplative mood rejects "clickable" signals
- spotlight: gentle opacity dim to 50%, no blur — like ink fading on paper
- keep hover transitions at 0.4s ease — slow and deliberate, matching the motion character

Transition vocabulary: `fade`
- Single transition. Contemplative. `fade` is the only transition — every page turn is a breath.

Best for:
- philosophical narratives
- constraint-focused projects
- minimalist tool showcases
- talks about simplicity and elegance

## tufte-data

Mood: scholarly, dense, evidence-driven, authoritative.

Palette:
- `#fffff8` warm white background
- `#111111` near-black text
- `#2d5f8a` data-blue (charts, links, annotations)
- `#c0392b` data-red (anomalies, errors, critical findings)

Typography:
- display + body: **EB Garamond** (historical Garamond revival, optimized for long text)
- labels/captions: **Source Sans 3** (clear sans-serif complement)
- mono: **Source Code Pro**
- avoid: geometric sans-serif for body text — serif is essential

Layout tendencies:
- 60% body column + 30% right margin for sidenotes
- dense prose paragraphs, not bullet points
- inline sparklines and small multiples
- minimal decoration, maximum information
- data tables with no gridlines (bottom borders only)

Motion:
- Shiki Magic Move for code transformations
- v-mark.highlight and v-mark.strike for inline annotations
- v-clicks for progressive evidence reveal
- no decorative motion

Interaction:
- hover: sidenote highlight + dim siblings (spotlight) — hovering a data point highlights its sidenote
- cursor: default; `pointer` only on sidenote references
- spotlight: full spotlight group — dim non-hovered items to 30%, no blur (clarity over drama)
- keep hover transitions at 0.2s ease — fast, functional, scholarly

Transition vocabulary: `fade`, `slide-left`, `slide-up`
- Evidence-driven. `slide-up` for data reveals. Prefer `fade` as the global default.

Best for:
- debugging case studies
- data-heavy analysis decks
- technical deep dives
- research presentations

## cloudflare

Mood: warm, practical, developer-friendly, workshop-ready.

Palette:
- `#f5f1eb` warm beige background
- `#521000` deep brown foreground
- `#ff6633` Cloudflare orange (primary accent)
- `#b45309` amber (secondary accent, code highlights)
- `#fffbf5` content surface (cards, elevated areas)
- `#ebd5c1` warm border
- muted: `rgba(82, 16, 0, 0.6)`

Typography:
- display: **Work Sans** (clean geometric sans, warm character)
- body: **DM Sans** (low-contrast geometric, excellent readability)
- mono: **IBM Plex Mono** (technical, structured)
- avoid: serif fonts — this preset demands clean sans-serif

Layout tendencies:
- white cards with warm borders on beige background
- orange accent badges and highlights
- code-heavy slides with bordered code blocks
- two-column comparisons (Agent vs AIChatAgent pattern)
- inverted section dividers (dark bg, light text)
- step-by-step workflow slides

Motion:
- medium reveals with slight translateY
- morph-fade for transitions between conceptual shifts
- wipe-right for progression slides
- iris for dramatic section reveals

Interaction:
- hover: card lift `translateY(-3px)` + lava glow border — `box-shadow: 0 4px 16px rgba(246,130,31,0.2)` and `border-color: var(--deck-accent)`
- cursor: `pointer` on cards and code blocks
- spotlight: dim siblings to 35% — orange accent on focused item stands out strongly
- keep hover transitions at 0.2s ease — responsive, workshop-friendly

Transition vocabulary: `slide-left`, `fade`, `iris`, `morph-fade`, `wipe-right`
- Workshop-ready. Full vocabulary. Prefer `slide-left` as the global default.

Best for:
- developer workshops
- SDK and API walkthroughs
- platform documentation decks
- technical tutorials

## material-design

Mood: systematic, polished, product-oriented, energetic.

Palette (M3 baseline purple):
- `#FFFBFE` surface
- `#1C1B1F` on-surface
- `#6750A4` primary
- `#EADDFF` primary-container
- `#625B71` secondary
- `#E8DEF8` secondary-container
- Dark variant: `#1C1B1F` surface, `#E6E1E5` on-surface

Typography:
- display: **Outfit** (modern geometric, warm and approachable)
- body: **Plus Jakarta Sans** (clean geometric, wide weight range)
- mono: **Roboto Mono**
- avoid: serif fonts — M3 demands geometric sans-serif

Layout tendencies:
- M3 cards at multiple elevation levels (elevated, filled, outlined)
- 16px grid alignment with 24px margins
- chip groups for categorized content
- surface-container tonal variations for visual hierarchy
- FAB-style call-to-action elements

Motion:
- v-motion for M3 container-transform entrances (cards growing from small to full)
- M3 easing curves (emphasized-decelerate: cubic-bezier(0.05, 0.7, 0.1, 1.0))
- v-mark.box for highlighting constraints
- medium-intensity, systematic

Interaction:
- hover: M3 state layer — 8% surface tint overlay on hover (`background: color-mix(in srgb, var(--deck-primary) 8%, transparent)`)
- cursor: `pointer` on cards and FAB elements
- spotlight: dim siblings with surface-container tonal shift — non-hovered cards drop to surface-dim level
- keep hover transitions at 0.2s cubic-bezier(0.05, 0.7, 0.1, 1.0) — M3 emphasized-decelerate

Transition vocabulary: `slide-left`, `slide-up`, `morph-fade`, `zoom-in`
- Systematic. M3-aligned motion. Prefer `slide-left` as the global default.

Best for:
- product launches
- multiplayer/collaborative tool showcases
- architecture walkthroughs
- engineering team presentations
