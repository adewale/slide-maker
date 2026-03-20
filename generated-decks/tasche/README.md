# Tasche deck

A 7-slide presentation about [Tasche](https://github.com/adewale/tasche), a self-hosted read-it-later service built on Cloudflare Python Workers.

## Quick start

```bash
npm install
npx slidev
```

## Build

```bash
npx slidev build
```

Output goes to `dist/`. Deploy to any static host -- Slidev generates `index.html`, `404.html`, and `_redirects`.

## Export PDF

```bash
npx slidev export
```

## Structure

| File | Purpose |
|------|---------|
| `slides.md` | Presentation content |
| `deck.spec.md` | Planning spec |
| `styles/tokens.css` | Design tokens |
| `styles/theme.css` | Typography, layout, animation |
| `styles/transitions.css` | Cinematic slide transitions |
| `styles/index.css` | Style entry point |
| `global-top.vue` | Keyboard help overlay |
| `global-bottom.vue` | Footer chrome + progress bar |
| `components/` | ProgressSegmentBar, KeyboardHelp |
| `composables/` | useHelp, useSections |
| `setup/` | Keyboard shortcuts, Mermaid renderer |

## Style preset

bold-modern with Tasche's monochrome identity. Dark background (`#0a0a0f`), light accent (`#e8e8ed`), Bebas Neue display / DM Sans body.
