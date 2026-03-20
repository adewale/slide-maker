# Claude History Explorer — Slide Deck

A 9-slide editorial-dark deck presenting [Claude History Explorer](https://github.com/adewale/claude-history-explorer), a Python CLI tool that analyzes Claude Code conversation history using deterministic arithmetic rather than AI.

## Running

```bash
cd generated-decks/claude-history-explorer
npx slidev
```

## Building

```bash
npx slidev build
```

## Structure

- `slides.md` — presentation source
- `deck.spec.md` — planning spec
- `styles/` — tokens, theme, transitions
- `components/` — ProgressSegmentBar, KeyboardHelp
- `composables/` — useHelp, useSections
- `setup/` — keyboard shortcuts, mermaid renderer
- `global-top.vue` — progress bar + help overlay
- `global-bottom.vue` — footer chrome
