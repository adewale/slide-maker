# Olsen

A 7-slide presentation about [Olsen](https://github.com/adewale/olsen), a local-first CLI tool for faceted browsing of photographs.

## Quick start

```bash
npm install
npx slidev
```

## Build

```bash
npx slidev build
```

Output goes to `dist/`.

## Export to PDF

```bash
npx slidev export
```

## Style

- Preset: tufte-data
- Typography: EB Garamond (display), Source Sans 3 (body), Source Code Pro (mono)
- Palette: warm white `#fffff8`, near-black `#111111`, data-blue `#2d5f8a`

## Structure

| File | Purpose |
|------|---------|
| `slides.md` | Presentation source |
| `deck.spec.md` | Planning spec |
| `styles/` | Tokens, theme, transitions |
| `setup/` | Keyboard shortcuts, Mermaid renderer |
| `composables/` | Shared reactive state |
| `components/` | KeyboardHelp, ProgressTallyMarks |
| `global-top.vue` | Help overlay + tally marks progress |
| `global-bottom.vue` | Footer chrome |
