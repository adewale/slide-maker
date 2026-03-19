# GeistFabrik — A Divergence Engine for Obsidian Vaults

A 7-slide Slidev deck introducing GeistFabrik's philosophy and architecture.

## Preset

**swiss-minimal** — precise, calm, disciplined. White background, dark gray text, blue accent.

## Through-line

"Muses, not oracles — a well-asked question beats a poorly-computed answer."

This design rule surfaces on the cover (as a question), in the Contradictor war story (as evidence), in the extensibility slides (as architectural consequence), and in the closing (as resolution).

## Source materials

- [README.md](https://github.com/adewale/geist_fabrik/blob/main/README.md) — project overview, architecture, privacy model
- [LESSONS_LEARNED.md](https://github.com/adewale/geist_fabrik/blob/main/LESSONS_LEARNED.md) — Contradictor case study, code vs question insight
- [STATUS.md](https://github.com/adewale/geist_fabrik/blob/main/STATUS.md) — 611 tests, 16 modules, schema v6

## Preview

```bash
npx slidev
```

## Build

```bash
npx slidev build
```

## Export PDF

```bash
npx slidev export
```

## Project structure

```
geist-fabrik/
  slides.md              # Presentation source
  deck.spec.md           # Planning spec
  README.md              # This file
  global-top.vue         # Help overlay mount
  global-bottom.vue      # Footer chrome
  composables/
    useHelp.ts           # Reactive help state
  components/
    KeyboardHelp.vue     # Keyboard shortcut overlay
  setup/
    shortcuts.ts         # Custom keyboard shortcuts
    mermaid-renderer.ts  # Beautiful Mermaid setup
  styles/
    index.css            # Style entry point
    tokens.css           # Design tokens
    theme.css            # Typography and layout styles
    transitions.css      # Cinematic slide transitions
```
