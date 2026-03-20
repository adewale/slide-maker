# Planet CF deck

A 7-slide presentation about [Planet CF](https://github.com/adewale/planet_cf), a feed aggregator built on Cloudflare's Python Workers platform.

## Style preset

`cloudflare` -- warm cream background, Cloudflare orange accent, Work Sans display font.

## Through-line

"Every boundary is a type conversion" -- the concept that Python running inside V8 isolates creates type boundaries at every API call, and those boundaries shaped the architecture.

## Preview

```bash
npx slidev
```

## Build

```bash
npx slidev build
```

## Project structure

```
slides.md              # Presentation source
deck.spec.md           # Planning spec
styles/
  index.css            # Style entry point
  tokens.css           # Design tokens
  theme.css            # Theme styles
  transitions.css      # Cinematic transitions
components/
  KeyboardHelp.vue     # Keyboard shortcut overlay
composables/
  useHelp.ts           # Help state
setup/
  shortcuts.ts         # Keyboard shortcuts
  mermaid-renderer.ts  # Beautiful Mermaid setup
global-top.vue         # Help overlay mount
global-bottom.vue      # Footer chrome
```
