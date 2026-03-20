# Claude History Explorer -- Slide Deck

A 7-slide presentation about [claude-history-explorer](https://github.com/adewale/claude-history-explorer), a Python CLI tool that turns Claude Code conversation history into searchable narratives and personality insights.

## Running

```bash
npm install
npx slidev
```

## Building

```bash
npx slidev build
```

## Exporting to PDF

```bash
npx slidev export
```

## Style

- Preset: editorial-dark
- Fonts: Playfair Display (display), Source Sans 3 (body), JetBrains Mono (mono)
- Accent: #38bdf8 (sky blue)

## Structure

| Slide | Layout | Content |
|-------|--------|---------|
| 1 | cover | Title and project description |
| 2 | default | What it is: read-only CLI, nine commands, three dependencies |
| 3 | section | "Reading the Receipts" -- section break |
| 4 | default | JSONL-to-narrative pipeline with Mermaid diagram and terminal output |
| 5 | center | Surprise: personality analysis without AI -- just timestamp arithmetic |
| 6 | section | "The Trust Contract" -- section break |
| 7 | end | Closing thesis: your history is already telling a story |
