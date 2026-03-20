# Tasche

A 7-slide deck introducing Tasche -- a self-hosted read-it-later service built
on Cloudflare Python Workers. Covers what it is, why it exists, its architecture,
the processing pipeline, and a war story about FTS5 query injection.

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
| `styles/tokens.css` | Design tokens (bold-modern preset, Tasche monochrome override) |
| `styles/theme.css` | Theme rules using token variables |
| `styles/index.css` | Slidev style entry point (imports tokens + theme) |

## Style preset

**bold-modern** -- dark background, high-contrast type, Bebas Neue display font,
DM Sans body. Tasche's monochrome pen-and-ink brand identity overrides the accent
palette: white-on-black instead of a saturated color pair.

## Project

Source: https://github.com/adewale/tasche
