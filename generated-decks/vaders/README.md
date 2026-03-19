# Vaders — Slide Deck

A 7-slide presentation about [Vaders](https://github.com/adewale/vaders), a multiplayer TUI Space Invaders clone built with OpenTUI and Cloudflare Durable Objects.

## Quick start

```bash
npm install
npx slidev
```

## Build

```bash
npx slidev build
```

Produces `dist/` for static hosting.

## Export PDF

```bash
npx slidev export
```

## Structure

| File | Purpose |
|------|---------|
| `slides.md` | Presentation source |
| `deck.spec.md` | Planning spec |
| `styles/tokens.css` | Design tokens |
| `styles/theme.css` | Theme styles |
| `styles/transitions.css` | Cinematic transitions |
| `global-top.vue` | Help overlay, progress bar, QR code, mobile view |
| `global-bottom.vue` | Footer chrome |
| `setup/shortcuts.ts` | Keyboard shortcuts |
| `setup/mermaid-renderer.ts` | Beautiful Mermaid integration |

## Style

Material Design preset with project-specific cyan accent (`#00BCD4`) reflecting the game's player 1 color. Outfit for display, Plus Jakarta Sans for body, Roboto Mono for code.
