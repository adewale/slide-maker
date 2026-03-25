# Adding a preset

Checklist for adding a new style preset to slide-maker.

## Files to edit

1. **`skills/slide-maker/STYLE_PRESETS.md`** -- the authoritative preset definition. Add a new `## preset-name` section at the end and a row in the font weight configuration table near the top.
2. **`README.md`** -- add a row to the Presets table so users can see available options at a glance.

## What a preset defines

Each preset section in STYLE_PRESETS.md must specify:

- **Mood** -- a short phrase capturing the visual character.
- **Palette** -- background, foreground, accent, secondary, and muted colors. Use hex values for opaque colors, `rgba()` for translucent ones.
- **Typography** -- display font, body font, mono font, and an "avoid" note. Each font should include a brief rationale in parentheses.
- **Layout tendencies** -- the kinds of slide structures the preset favors (e.g., section dividers, two-column comparisons, dense prose).
- **Motion** -- intensity level, easing curve, typical entrance animation.
- **Interaction** -- hover behavior, cursor policy, spotlight recommendation, transition timing.
- **Transition vocabulary** -- which Slidev transitions to use and which to set as the global default.
- **Best for** -- the kinds of decks where this preset works well.

## Token CSS structure (`styles/tokens.css`)

Tokens are CSS custom properties on `:root`. A preset's palette maps to these variables:

```css
:root {
  --deck-bg: #fffbf5;
  --deck-fg: #2c1810;
  --deck-accent: #a06c08;
  --deck-accent-alt: #8b5e34;
  --deck-muted: rgba(44, 24, 16, 0.45);
  --deck-border: /* border color */;
  --deck-surface: /* card/panel surface */;
  --deck-code-bg: /* code block background */;
  --deck-code-chrome: /* code block header */;
}
```

All scoped styles in slides must reference `var(--deck-*)` tokens, never literal color values. This is enforced by COMPILER_RULES.md.

## Theme CSS structure (`styles/theme.css`)

Theme CSS uses the tokens to style concrete elements. Typical selectors:

- `.slidev-layout` -- base slide styling (background, padding, font)
- `.slidev-layout h1, h2, h3` -- heading sizes, weights, letter-spacing
- `.slidev-layout code, pre` -- code block appearance using `--deck-code-bg` and `--deck-code-chrome`
- Section divider layouts (inverted background/foreground)
- Card styles (border, shadow, hover states)
- Utility classes specific to the preset (e.g., `.cf-dots` for cloudflare)

Theme CSS imports tokens via `@import './tokens.css';` at the top, and `styles/index.css` imports theme.css for Slidev auto-discovery.

## WCAG contrast requirements

Every preset must meet WCAG AA contrast ratios:

- **4.5:1** minimum for body text (`--deck-fg` on `--deck-bg`)
- **3:1** minimum for large text and UI elements (`--deck-accent` on `--deck-bg`)

The compiler validates these ratios during deck generation. `deck-lint` checks them again post-build.

## Font weight configuration

Add a row to the weight table near the top of STYLE_PRESETS.md:

```
| `preset-name` | `'400,500,600,700'` | no |
```

Only include weights that the preset actually uses. Extra weights slow page load; missing weights cause broken rendering. The `Italic` column indicates whether italic variants should be loaded.

These values are used in Slidev frontmatter:

```yaml
fonts:
  sans: Source Sans 3
  serif: Young Serif
  mono: JetBrains Mono
  weights: '400,500,600,700'
  italic: false
```

## Testing

- **`deck-lint`** -- static analysis. Checks CSS token usage, layout alignment, background consistency, content density. Run after generating a deck with the new preset.
- **`screenshot-audit`** -- Playwright-based visual checks. Validates contrast ratios, text overlap, overflow, column balance, and centering against actual rendered slides.

Generate at least one deck with the new preset and run both tools before considering it ready.

## Reference

See existing presets in `skills/slide-maker/STYLE_PRESETS.md` for complete examples. The `cloudflare` preset is the most detailed (background treatments, utility classes, dark island pattern). The `swiss-minimal` preset is a good model for a simpler, restrained style.
