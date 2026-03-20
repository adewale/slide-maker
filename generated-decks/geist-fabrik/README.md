# GeistFabrik

A 9-slide deck presenting GeistFabrik, a Python-based divergence engine for Obsidian vaults.

## Quick start

```bash
npm install
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

## Structure

| File | Purpose |
|------|---------|
| `slides.md` | Presentation source |
| `deck.spec.md` | Planning schema |
| `styles/tokens.css` | Design tokens |
| `styles/theme.css` | Layout and typography |
| `styles/transitions.css` | Slide transitions |
| `styles/index.css` | CSS entry point |
| `components/ProgressSegmentBar.vue` | Section progress indicator |
| `components/KeyboardHelp.vue` | Keyboard shortcut overlay |
| `composables/useSections.ts` | Section detection for progress bar |
| `composables/useHelp.ts` | Help overlay state |
| `setup/shortcuts.ts` | Keyboard shortcut registration |
| `setup/mermaid-renderer.ts` | Themed Mermaid diagrams |
| `global-top.vue` | Progress bar + help overlay |
| `global-bottom.vue` | Footer with slide number |

## Preset

swiss-minimal -- precise, calm, disciplined.

## Project

[github.com/adewale/geist_fabrik](https://github.com/adewale/geist_fabrik)
