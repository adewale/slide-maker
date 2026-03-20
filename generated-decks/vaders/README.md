# Vaders — Slide Deck

A 7-slide presentation about [Vaders](https://github.com/adewale/vaders), a multiplayer TUI Space Invaders clone built with OpenTUI and Cloudflare Durable Objects.

## Quick start

```bash
npx slidev slides.md
```

## Build

```bash
npx slidev build
```

## Export to PDF

```bash
npx slidev export
```

## Structure

| File | Purpose |
|------|---------|
| `slides.md` | Presentation source |
| `deck.spec.md` | Planning spec |
| `styles/tokens.css` | Design tokens |
| `styles/theme.css` | Typography and layout styles |
| `styles/transitions.css` | Cinematic slide transitions |
| `components/ProgressSegmentBar.vue` | Section progress indicator |
| `components/KeyboardHelp.vue` | Keyboard shortcut overlay |
| `global-top.vue` | Progress bar + help overlay mount |
| `global-bottom.vue` | Footer chrome (title + page number) |

## Style preset

Material Design (M3 baseline) with project accent color `#00BCD4` (cyan — matching the P1 player ship color from the game).
