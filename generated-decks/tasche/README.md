# Tasche Deck

A 7-slide presentation introducing [Tasche](https://github.com/adewale/tasche), a self-hosted read-it-later service built on Cloudflare Python Workers.

## Style

- **Preset:** bold-modern
- **Palette:** Monochrome (project colors override the default bold-modern purple)
- **Typography:** Bebas Neue (display), DM Sans (body), JetBrains Mono (code)
- **Color scheme:** Dark

## Preview

```bash
npx slidev slides.md
```

## Build

```bash
npx slidev build
```

## Structure

```
slides.md              # Presentation source (7 slides)
deck.spec.md           # Planning spec
styles/
  tokens.css           # Design tokens
  theme.css            # Layout and typography styles
  transitions.css      # Cinematic slide transitions
  index.css            # Import aggregator
components/
  KeyboardHelp.vue     # Keyboard shortcut overlay
composables/
  useHelp.ts           # Help panel state
setup/
  shortcuts.ts         # Keyboard shortcut registration
  mermaid-renderer.ts  # Beautiful Mermaid renderer
global-top.vue         # Help overlay mount
global-bottom.vue      # Footer chrome (slide number + title)
```
