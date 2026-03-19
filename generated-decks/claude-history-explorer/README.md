# Claude History Explorer

A 7-slide deck presenting the Claude History Explorer project -- a Python CLI
that turns raw Claude Code conversation history into searchable conversations,
statistics, and narrative insights. Uses the editorial-dark preset.

## Quick start

```bash
npx slidev slides.md
```

## Build

```bash
npx slidev build --out dist
```

## Files

| File | Purpose |
|------|---------|
| `slides.md` | Presentation source (Slidev Markdown) |
| `deck.spec.md` | Planning spec -- tokens, layout choices, slide outlines |
| `styles/tokens.css` | Design tokens (editorial-dark palette) |
| `styles/theme.css` | Theme rules using token variables |
| `styles/transitions.css` | Cinematic slide transitions |
| `styles/index.css` | Slidev style entry point (imports all style files) |
| `components/KeyboardHelp.vue` | Keyboard shortcut overlay (press ?) |
| `components/ProgressSegmentBar.vue` | Segmented progress bar at top of slides |
| `composables/useHelp.ts` | Reactive help overlay state |
| `composables/useSections.ts` | Section detection for progress bar |
| `setup/shortcuts.ts` | Custom keyboard shortcuts |
| `setup/mermaid-renderer.ts` | Beautiful Mermaid rendering with deck tokens |
| `global-top.vue` | Global top layer (progress bar + help overlay) |
| `global-bottom.vue` | Global bottom layer (footer with title + page number) |

## Style preset

**editorial-dark** -- near-black background, soft off-white foreground, cool
blue accent (#38bdf8), Playfair Display headings, Source Sans 3 body text,
restrained fade motion. See `styles/tokens.css` for the full token set.

## Project

- Source: https://github.com/adewale/claude-history-explorer
- Through-line: "Read-only to your history. Read everything about your habits."
