# Olsen

A 7-slide deck about the [Olsen photo indexer](https://github.com/adewale/olsen) -- a read-only, local-first CLI tool for indexing DNG, JPEG, and BMP photos into a portable SQLite database.

## Preset

`tufte-data` -- scholarly, evidence-driven, serif typography with EB Garamond.

## Through-line

"Read-only to sources, read-write to understanding" -- traces how a single architectural constraint (O_RDONLY) shaped the entire system.

## Slides

1. **Cover** -- introduces Olsen and the read-only premise
2. **The read-only guarantee** -- O_RDONLY as syscall-level enforcement
3. **62ms per photo** -- performance benchmarks in two columns
4. **Five processing stages** -- the pipeline described through the constraint lens
5. **The state machine insight** -- faceted navigation as state transitions, not hierarchy
6. **160 x 120 px** -- the Monochrom DNG thumbnail war story
7. **Closing** -- resolves the through-line

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
olsen/
  slides.md           # Presentation source
  deck.spec.md        # Planning schema
  styles/
    index.css         # Style entry point
    tokens.css        # Design tokens
    theme.css         # Typography and layout styles
    transitions.css   # Cinematic slide transitions
  components/
    KeyboardHelp.vue  # Keyboard shortcut overlay
  composables/
    useHelp.ts        # Help overlay state
  setup/
    shortcuts.ts      # Keyboard shortcut registration
    mermaid-renderer.ts # Beautiful Mermaid setup
  global-top.vue      # Help overlay mount
  global-bottom.vue   # Footer chrome
```
