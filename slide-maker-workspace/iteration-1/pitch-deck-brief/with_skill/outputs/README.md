# The Breaking Point

A 7-slide pitch deck for an API monitoring startup. Targets VPs of engineering. Uses the `editorial-dark` style preset.

## Quick start

```bash
npm install
npx slidev slides.md
```

## Build

```bash
npx slidev build
```

The `dist/` directory is a static SPA. Deploy to any static host. The host must serve `index.html` for all sub-routes.

## Export to PDF

```bash
npx slidev export
```

## Structure

| File | Purpose |
|------|---------|
| `slides.md` | Presentation source |
| `deck.spec.md` | Planning spec (source of truth for structure) |
| `styles/tokens.css` | Design tokens |
| `styles/theme.css` | Typography, layout, color application |
| `styles/transitions.css` | Cinematic slide transitions |
| `styles/index.css` | Style entry point (imports all CSS) |
| `global-top.vue` | Progress bar + keyboard help overlay |
| `global-bottom.vue` | Footer chrome (title + slide number) |
| `components/KeyboardHelp.vue` | Keyboard shortcut overlay |
| `components/ProgressSegmentBar.vue` | Section-aware progress bar |
| `composables/useHelp.ts` | Help overlay state |
| `composables/useSections.ts` | Section detection for progress bar |
| `setup/shortcuts.ts` | Keyboard shortcut registration |
| `setup/mermaid-renderer.ts` | Beautiful Mermaid integration |

## Keyboard shortcuts

Press `?` during the presentation to see the full overlay.
