# Claude History Explorer — Slide Deck

A 7-slide presentation about [Claude History Explorer](https://github.com/adewale/claude-history-explorer), a Python CLI tool to explore, search and visualise your Claude Code conversation history.

## Style

- **Preset:** editorial-dark
- **Theme:** seriph (dark color schema)
- **Typography:** Playfair Display (display), Source Sans 3 (body), JetBrains Mono (code)
- **Accent:** `#38bdf8` (sky blue)

## Through-line

"Read-only to your history. Never silent about what it reads." — a design-rule through-line that surfaces in slides 2, 4, 5, and 7.

## Running

```bash
cd generated-decks/claude-history-explorer
npx slidev slides.md
```

## Building

```bash
npx slidev build
```

## Structure

```
├── slides.md              # Presentation source
├── deck.spec.md           # Planning spec
├── global-top.vue         # Help overlay + progress bar
├── global-bottom.vue      # Footer chrome
├── styles/
│   ├── index.css          # Entry point (auto-discovered)
│   ├── tokens.css         # Design tokens
│   ├── theme.css          # Theme styles
│   └── transitions.css    # Cinematic transitions
├── setup/
│   ├── shortcuts.ts       # Keyboard shortcuts
│   └── mermaid-renderer.ts # Beautiful Mermaid integration
├── composables/
│   ├── useHelp.ts         # Help overlay state
│   └── useSections.ts     # Section navigation
└── components/
    ├── KeyboardHelp.vue   # Keyboard shortcut overlay
    ├── ProgressSegmentBar.vue # Section progress bar
    ├── AudienceQRCode.vue # QR code sharing
    └── MobileScrollView.vue # Mobile scroll mode
```
