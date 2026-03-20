# Vaders — Slide Deck

A 7-slide presentation about the [Vaders](https://github.com/adewale/vaders) project: a multiplayer TUI Space Invaders clone built with OpenTUI and Cloudflare Durable Objects.

## Quick start

```bash
npm install
npx slidev slides.md
```

## Build

```bash
npx slidev build
```

Output goes to `dist/`.

## Export PDF

```bash
npx slidev export
```

## Structure

```
slides.md                  # Presentation source
deck.spec.md               # Planning spec
styles/
  index.css                # Entry point (imports tokens + theme + transitions)
  tokens.css               # Design tokens
  theme.css                # Typography, layout, animation styles
  transitions.css          # Cinematic slide transitions
setup/
  shortcuts.ts             # Keyboard shortcuts (?, p, ], [)
  mermaid-renderer.ts      # Beautiful Mermaid with deck tokens
composables/
  useHelp.ts               # Help overlay state
  useSections.ts           # Section boundary detection
components/
  KeyboardHelp.vue         # Keyboard shortcut overlay
  ProgressSegmentBar.vue   # Top progress bar
  AudienceQRCode.vue       # QR code sharing (press q)
  MobileScrollView.vue     # Portrait phone scroll view
global-top.vue             # Help, progress, QR, mobile scroll
global-bottom.vue          # Footer chrome (title + page number)
```

## Keyboard shortcuts

| Key | Action |
|-----|--------|
| `?` | Toggle keyboard help |
| `p` | Open presenter view |
| `q` | Share QR code |
| `]` / `[` | Skip to next/prev slide |
| `f` | Fullscreen |
| `o` | Slide overview |
