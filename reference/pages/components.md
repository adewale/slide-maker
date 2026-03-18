---
layout: section
transition: iris
---

# Visual Effect Components

Five components. Zero external libraries. Token-driven by default.

<!-- Section dividers use the iris transition to signal a new chapter. This section covers the five visual effect components available in slide-maker/components/. Each adapts to any preset via currentColor and --deck-* tokens.

Sources:
- file:slide-maker/COMPILER_RULES.md — animation component catalog with prop signatures -->

---
transition: slide-left
---

# Five Components Handle All Visual Polish

Vue components available to every deck — no external libraries needed.

<v-clicks>

- **GlassCard** — Glassmorphism panel with `blur`, `opacity`, `border` props
- **ImageFX** — CSS filter wrapper: `duotone` | `vignette` | `grain` | `grayscale` | `sepia`
- **RevealPath** — CSS `offset-path` entrance with `path`, `duration`, `delay` props
- **ShadowStack** — Multi-layer box-shadow presets: `subtle` | `dramatic` | `glow` | `neon` | `long`
- **CornerCard** — Decorative corner marks with `size`, `thickness`, `color`, `padding` props

</v-clicks>

All five read `currentColor` and `--deck-*` tokens — switch preset, switch look.

<!-- Five visual effect components in slide-maker/components/ adapt to any preset via currentColor and --deck-* tokens. Copy into a deck's components/ directory when needed.

[click] GlassCard — backdrop-filter: blur(N) card with blur, opacity, border props. One of the two most reused visual components.

[click] ImageFX — CSS filter wrapper so no external library is needed. The effect prop selects duotone, vignette, grain, grayscale, sepia, or none.

[click] RevealPath — CSS offset-path entrance with configurable path and delay. Use for dramatic single-element reveals.

[click] ShadowStack — multi-layer box-shadow with named presets: subtle, dramatic, glow, neon, long. The preset prop selects the shadow stack.

[click] CornerCard — decorative corner marks with size, thickness, color, padding props. Defaults to deck accent color. The other most reused component alongside GlassCard.

Sources:
- file:slide-maker/COMPILER_RULES.md — animation component catalog with prop signatures
- file:slide-maker/components/GlassCard.vue — glassmorphism panel component
- file:slide-maker/components/CornerCard.vue — decorative corner marks component -->

---
transition: fade
---

# `--deck-*` Tokens Make Components Portable

Every component reads CSS custom properties — not hardcoded values.

```css [tokens.css]
:root {
  --deck-bg: #0a0a0f;
  --deck-fg: #f0f0f5;
  --deck-accent: #a78bfa;
  --deck-muted: rgba(240, 240, 245, 0.5);
  --deck-font-display: 'Bebas Neue', sans-serif;
  --deck-font-mono: 'JetBrains Mono', monospace;
}
```

<v-click>

`tokens.css` defines values. `theme.css` applies them. Components read them. Switch preset, switch palette — components follow automatically.

</v-click>

<!-- The token system is why components are portable across presets. Required tokens: --deck-bg, --deck-fg, --deck-accent, --deck-muted. Optional: --deck-accent-alt, --deck-font-display, --deck-font-body, --deck-font-mono. GlassCard uses --deck-bg for its backdrop. CornerCard defaults to --deck-accent for corner color. ShadowStack uses --deck-accent for glow and neon presets.

[click] The three-file pattern: tokens.css declares, theme.css applies, components read. This separation means a preset change only touches tokens.css — theme.css and components stay the same.

Sources:
- file:slide-maker/COMPILER_RULES.md — token specification and required variables
- file:slide-maker/STYLE_PRESETS.md — how presets generate token values -->

---
layout: two-cols
transition: wipe-right
---

# Comparison: GlassCard vs CornerCard

::left::

### GlassCard

<v-clicks>

- Glassmorphism blur effect
- `blur`, `opacity`, `border` props
- Best for content panels and overlays
- Reads `--deck-bg` for backdrop
- Pairs with dark backgrounds

</v-clicks>

::right::

### CornerCard

<v-clicks>

- Decorative corner marks
- `size`, `thickness`, `color`, `padding` props
- Best for feature cards and callouts
- Defaults to `--deck-accent` color
- Works on any background

</v-clicks>

<!-- The comparison slide kind uses two-cols for before/after or option-vs-option layouts. GlassCard and CornerCard are the two most reused visual components. GlassCard creates depth through backdrop-filter blur — best on dark backgrounds where the frosted-glass effect is visible. CornerCard adds structural emphasis through decorative corner marks — works on any background because it uses border-based drawing.

[click] GlassCard blur effect — the defining visual treatment.
[click] Props: blur (px), opacity (0-1), border (CSS border value).
[click] Best for panels where content sits above a blurred background.
[click] Reads --deck-bg to tint the backdrop color.
[click] Dark backgrounds make the frosted-glass effect most visible.

[click] CornerCard corner marks — purely decorative structural emphasis.
[click] Props: size (px), thickness (px), color (CSS color), padding (CSS padding).
[click] Best for feature cards and metric callouts.
[click] Defaults to --deck-accent so it matches the preset automatically.
[click] Works on any background because corners are drawn with borders, not filters.

Sources:
- file:slide-maker/SLIDE_KINDS.md — comparison kind: before/after or option-vs-option
- file:slide-maker/COMPILER_RULES.md — animation component catalog -->

---
layout: fact
transition: zoom-in
---

# <v-mark at="1" color="#22d3ee" type="circle">5</v-mark>

visual effect components

Zero external dependencies. Token-driven. Preset-portable. Copy into any deck.

<!-- The metrics-grid slide kind uses the fact layout for a single dominant number. Five visual effect components (GlassCard, ImageFX, RevealPath, ShadowStack, CornerCard) ship in slide-maker/components/ and can be copied into any deck's components/ directory. They use no external libraries — only CSS features: backdrop-filter, CSS filters, offset-path, box-shadow, and border drawing. All five adapt automatically when the preset changes because they read --deck-* tokens rather than hardcoded values.

Sources:
- file:slide-maker/COMPILER_RULES.md — animation component catalog with prop signatures
- file:slide-maker/COMPILER_RULES.md — escalation ladder: copy components when needed -->
