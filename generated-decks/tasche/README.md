# Tasche -- Slide Deck

A 9-slide deck presenting [Tasche](https://github.com/adewale/tasche), a self-hosted read-it-later service built on Cloudflare Python Workers.

## Theme

- **Preset:** bold-modern
- **Through-line:** "What happens when you run Python where JavaScript is supposed to go?"
- **Narrative arc:** The ecosystem mismatch (Python on a JS platform), the FFI boundary layer, the cross-runtime Service Binding, the testing gap, and the resolution.

## Preview

```bash
npx slidev
```

## Build

```bash
npx slidev build
```

## Structure

```
slides.md              # All 9 slides
deck.spec.md           # Planning spec
styles/
  index.css            # Entry point (imports tokens, theme, transitions)
  tokens.css           # Design tokens
  theme.css            # Layout and typography styles
  transitions.css      # Cinematic slide transitions
components/
  KeyboardHelp.vue     # Keyboard shortcut overlay
  ProgressSegmentBar.vue  # Section progress indicator (bottom bar)
composables/
  useHelp.ts           # Help overlay state
  useSections.ts       # Section detection for progress bar
setup/
  shortcuts.ts         # Keyboard shortcut bindings
  mermaid-renderer.ts  # Beautiful Mermaid with deck tokens
global-top.vue         # Progress bar + keyboard help
global-bottom.vue      # Footer chrome (title + page number)
```
