---
theme: default
title: Extensions
selectable: true
routerMode: hash
colorSchema: dark
fonts:
  sans: Bebas Neue
  serif: DM Sans
  mono: JetBrains Mono
transition: slide-left
layout: cover
---

# Extensions

Every way we've extended Slidev.

github.com/adewale/slide-maker

<!-- This deck catalogs every extension built on top of Slidev in this project — components, transitions, presets, and tools. Each slide maps one extension category to what it enables.

Sources:
- file:slide-maker/COMPILER_RULES.md — defines extension categories and rules for when to create new ones -->

---
layout: statement
transition: fade
---

# Slidev is a platform, not a template

Extensions make it yours.

<!-- Slidev ships with Markdown slides, Vue components, and Vite. Everything else — transitions, design tokens, build tools, custom layouts — is extension surface. This deck catalogs what we've built on that surface. -->

---
transition: slide-left
---

# Five Components Handle All Visual Polish

Vue components available to every deck — no external libraries.

<v-clicks>

- **GlassCard** — Glassmorphism panel with blur, opacity, border props
- **ImageFX** — CSS filter wrapper (duotone, vignette, grain, grayscale, sepia)
- **RevealPath** — CSS `offset-path` entrance with configurable path and delay
- **ShadowStack** — Multi-layer box-shadow (subtle, dramatic, glow, neon, long)
- **CornerCard** — Decorative corner marks with size, thickness, color props

</v-clicks>

<!-- Five visual effect components in slide-maker/components/ adapt to any preset via currentColor and --deck-* tokens.

[click] GlassCard — glassmorphism panel with blur, opacity, border props. One of the two most reused visual components.

[click] ImageFX — wraps standard CSS filters so no external library is needed. Duotone, vignette, grain, grayscale, sepia.

[click] RevealPath — CSS offset-path entrance with configurable path and delay. Use for dramatic single-element reveals.

[click] ShadowStack — multi-layer box-shadow with named presets: subtle, dramatic, glow, neon, long.

[click] CornerCard — decorative corner marks with size, thickness, color props. The other most reused component alongside GlassCard.

Sources:
- file:slide-maker/COMPILER_RULES.md — animation component catalog with prop signatures -->

---
transition: slide-up
---

# Inline Data Viz Replaces External Charting Libraries

Eight components for word-sized charts, inspired by Tufte's principles.

<v-clicks>

- **Sparkline** — Inline SVG trend line for time-series data
- **MicroBar** — Horizontal bars for categorical comparisons
- **SlopeChart** — Before/after with connecting lines showing change
- **BulletBar** — Progress bar with target marker (actual vs expected)
- **DotStrip** — Horizontal dot plot for distributions
- **WinLoss** — Binary outcome sequence for streaks and test results
- **DataTable** — Minimal styled table, bottom borders only

</v-clicks>

<!-- Eight data visualization components provide word-sized charts that embed directly in slide content. All use currentColor by default.

[click] Sparkline — inline SVG trend line for time-series data. The most frequently used data viz component.

[click] MicroBar — horizontal bars for categorical comparisons. Simple and effective for showing relative magnitudes.

[click] SlopeChart — before/after with connecting lines showing change. Great for improvement narratives.

[click] BulletBar — progress bar with target marker. Actual vs expected at a glance.

[click] DotStrip — horizontal dot plot for distributions. Shows spread and clustering.

[click] WinLoss — binary outcome sequence for streaks and test results. Pass/fail at a glance.

[click] DataTable — minimal styled table, bottom borders only. No zebra striping, no vertical lines. SmallMultiples is a CSS grid container for arranging these components in a comparable grid.

Sources:
- file:slide-maker/COMPILER_RULES.md — data visualization component catalog with props and use cases
- file:slide-maker/components/Sparkline.vue — inline SVG sparkline
- file:slide-maker/components/WinLoss.vue — binary outcome visualization -->

---
transition: slide-left
---

# 19 Transitions and Interactions, Zero JavaScript

13 cinematic transitions + 6 interaction patterns, all in CSS.

**Geometric** — `iris` · `wipe-right` · `wipe-up`

**Scale** — `morph-fade` · `zoom-in` · `zoom-out`

**3D** — `flip-x` · `flip-y` · `cube` · `swing`

**Filter** — `blur` · `glide`

<v-click>

**Interactions** — `hover-lift` · `spotlight-group` · `hover-scale` · `hover-accent` · `hover-glow` · `hover-dim`

</v-click>

<!-- All transitions live in styles/transitions.css, present in every deck via the universal scaffold. Pure CSS — no JavaScript animation libraries. Each uses Slidev's .slidev-nav-go-forward and .slidev-nav-go-backward classes for directional awareness. The transition grammar assigns semantic meaning: fade for reflection, iris for new chapters, wipe-right for comparison, zoom-in for focus.

Sources:
- file:slide-maker/COMPILER_RULES.md — transition grammar with semantic meanings
- file:slide-maker/STYLE_PRESETS.md — per-preset transition vocabulary -->

---
transition: slide-left
---

# Every Deck Ships With Seven Scaffold Files

Generated by `new-deck.sh`, present in every deck.

- **KeyboardHelp.vue** — Full-screen shortcut overlay, toggled with `?`
- **global-top.vue** — Mounts help overlay when active
- **global-bottom.vue** — Footer with slide number and title, hidden on cover/end
- **setup/shortcuts.ts** — Registers `?` and `p` keyboard shortcuts
- **composables/useHelp.ts** — Reactive help state shared across components
- **setup/mermaid-renderer.ts** — Polished Mermaid diagram rendering
- **styles/transitions.css** — 13 cinematic slide transitions

<!-- The universal scaffold ensures every deck ships with keyboard navigation, presenter support, Mermaid rendering, and cinematic transitions. These files are generated once by new-deck.sh and should never be removed. global-bottom.vue uses $nav.currentLayout to hide itself on cover and end slides. Demo's global-top.vue is a superset that includes a laser pointer.

Sources:
- file:slide-maker/COMPILER_RULES.md — universal features specification and scaffold file list
- file:tools/new-deck.sh — scaffold generation script -->

---
transition: slide-left
---

# The Tufte Deck Puts Data in the Margin

Data-dense design inspired by Edward Tufte's information principles.

- **TufteSlide** — Custom layout with wide body and sidenote margin (~70/30)
- **Sidenote** — Numbered margin notes in the Tufte tradition
- **Sparkline** — Inline SVG trend charts embedded in prose
- **SmallMultiples** — CSS grid for comparable visualizations
- **DataTable** — Minimal data tables with bottom borders only

<!-- The Tufte deck is the data-communication exemplar. TufteSlide matches Tufte's page layout with a main body and sidenote margin. These components are used in the "Debug at the Source" deck for the Olsen DNG thumbnail investigation — Sparkline shows performance comparison, SmallMultiples arranges three thumbnail pipeline stages, and Sidenote provides numbered marginal annotations.

Sources:
- file:examples/tufte/layouts/TufteSlide.vue — custom layout with sidenote margin
- file:examples/tufte/components/Sidenote.vue — margin note component -->

---
transition: fade
---

# `--deck-*` Tokens Make Presets Possible

Every deck uses CSS custom properties for consistent theming.

```css
:root {
  --deck-bg: #0a0a0f;
  --deck-fg: #f0f0f5;
  --deck-accent: #a78bfa;
  --deck-muted: rgba(240, 240, 245, 0.5);
  --deck-font-display: 'Bebas Neue', sans-serif;
  --deck-font-mono: 'JetBrains Mono', monospace;
}
```

`tokens.css` defines values. `theme.css` applies them. Components read them.

<!-- The token system makes presets possible. tokens.css is pure variable declarations — no selectors except :root. theme.css maps those variables to Slidev layout classes. Components reference the variables directly. Required tokens: --deck-bg, --deck-fg, --deck-accent, --deck-muted. Optional: --deck-accent-alt, --deck-font-display, --deck-font-body, --deck-font-mono.

Sources:
- file:slide-maker/COMPILER_RULES.md — token specification and required variables
- file:slide-maker/STYLE_PRESETS.md — how presets generate token values -->

---
transition: slide-left
---

# One Preset Controls Typography, Color, and Motion

Each of seven presets generates `tokens.css` + `theme.css`.

<v-clicks>

- **editorial-dark** — Playfair Display + Source Sans 3. Deep blue. Narrative.
- **swiss-minimal** — Plus Jakarta Sans + Figtree. White. Structured.
- **bold-modern** — Bebas Neue + DM Sans. Near-black. High contrast.
- **sumi-e** — Zen Old Mincho + Crimson Pro. Warm paper. Ink-wash.
- **tufte-data** — EB Garamond. Cream. Data-dense, scholarly.
- **cloudflare** — Work Sans + DM Sans. Warm white. Cloudflare brand.
- **material-design** — Outfit + Plus Jakarta Sans. M3 tokens. Systematic.

</v-clicks>

<!-- Presets are directions, not skins. Each controls typography, color, motion curves, v-click animation style, and layout tendencies.

[click] editorial-dark — Playfair Display + Source Sans 3. Deep blue. Narrative tone. Fades in.

[click] swiss-minimal — Plus Jakarta Sans + Figtree. White. Structured. Shifts laterally.

[click] bold-modern — Bebas Neue + DM Sans. Near-black. High contrast. Scales and slides.

[click] sumi-e — Zen Old Mincho + Crimson Pro. Warm paper. Ink-wash aesthetic.

[click] tufte-data — EB Garamond. Cream. Data-dense, scholarly. The data communication preset.

[click] cloudflare — Work Sans + DM Sans. Warm white. Cloudflare brand colors and workshop tone.

[click] material-design — Outfit + Plus Jakarta Sans. M3 tokens. Systematic and component-driven.

Sources:
- file:slide-maker/STYLE_PRESETS.md — complete preset definitions with palette, typography, motion, and interaction patterns -->

---
transition: slide-left
---

# Seven Scripts Catch Problems Before the Audience Does

Scaffolding, validation, and comparison.

<v-clicks>

- **new-deck.sh** — Scaffold a complete deck from any preset
- **deck-lint.mjs** — Validate structure, overflow, sources, and quality
- **style-audit.mjs** — Audit CSS token usage across decks
- **deck-preview.mjs** — Quick text preview of slide content
- **deck-diff.mjs** — Diff two versions of a deck
- **compare-decks.mjs** — Side-by-side comparison of multiple decks
- **build-and-verify.sh** — Full build pipeline with post-build checks

</v-clicks>

<!-- Scaffolding, validation, and comparison — seven scripts that catch problems before the audience does.

[click] new-deck.sh — scaffolds a complete deck from any preset. Generates all 7 scaffold files plus styles.

[click] deck-lint.mjs — validates structure, overflow, sources, and quality. Checks overflow guards (7 bullets, 8 code lines, 60 char bullets), source citations, and Mermaid annotations.

[click] style-audit.mjs — audits CSS token usage across decks. Verifies no hardcoded hex values where --deck-* tokens should appear.

[click] deck-preview.mjs — quick text preview of slide content. Useful for reviewing without launching the dev server.

[click] deck-diff.mjs — diffs two versions of a deck. Shows what changed between iterations.

[click] compare-decks.mjs — side-by-side comparison of multiple decks. Spots inconsistencies across the collection.

[click] build-and-verify.sh — full build pipeline with post-build checks. The final gate before deployment.

Sources:
- file:tools/deck-lint.mjs — structural validator with source citation checks
- file:tools/new-deck.sh — deck scaffolding script -->

---
layout: fact
transition: fade
---

# 5 + 8 + 13 + 7 + 7

5 visual effects. 8 data viz. 13 transitions. 7 presets. 7 tools.

<!-- The component catalog: 5 visual effect components (GlassCard, ImageFX, RevealPath, ShadowStack, CornerCard) for visual polish, plus 8 data visualization components (Sparkline, SmallMultiples, DataTable, MicroBar, SlopeChart, BulletBar, DotStrip, WinLoss) for inline data presentation. 13 cinematic CSS transitions with semantic meanings. 7 style presets generating complete visual systems. 7 build tools for scaffolding and validation.

Sources:
- file:slide-maker/COMPILER_RULES.md — complete component and tool inventory -->

---
layout: end
transition: fade
---

# The best extension is the one you don't need to write

<!-- Extensions make Slidev yours — but the goal isn't maximum extensions, it's maximum leverage. Shared components, reusable presets, and consistent tokens mean most new decks start with everything they need. The best extension is the one that's already there. -->
