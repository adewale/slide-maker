# Vaders

A 9-slide Slidev deck presenting the architecture, surprising design choices, and lessons learned from building [Vaders](https://github.com/adewale/vaders) -- a multiplayer TUI Space Invaders clone built with OpenTUI and Cloudflare Durable Objects.

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

```
slides.md              Main presentation
deck.spec.md           Planning spec
styles/
  tokens.css           Design tokens
  theme.css            Typography, layout, color application
  transitions.css      Cinematic slide transitions
  index.css            Style entry point
components/
  ProgressSegmentBar   Bottom progress indicator
  KeyboardHelp         Shortcut overlay (press ?)
composables/
  useHelp              Help overlay state
  useSections          Section detection for progress bar
setup/
  shortcuts            Keyboard shortcut registration
  mermaid-renderer     Beautiful Mermaid with deck tokens
global-top.vue         Progress bar + help overlay
global-bottom.vue      Footer chrome (title + page number)
```

## Preset

Material Design (dark variant) with project color overrides: cyan accent (#00FFFF) from the game's player 1 color, red accent-alt (#FF5555) from alien threat colors.

## Keyboard shortcuts

| Key | Action |
|-----|--------|
| ? | Toggle shortcut help |
| p | Open presenter view |
| ] / [ | Skip to next/prev slide |
| f | Fullscreen |
| o | Slide overview |
