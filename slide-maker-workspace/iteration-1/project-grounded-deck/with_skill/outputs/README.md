# How Slide Maker Ships

A 5-slide deck explaining the build system architecture and deployment pipeline
of the slide-maker project. Uses the cloudflare preset.

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
| `styles/tokens.css` | Design tokens (cloudflare palette) |
| `styles/theme.css` | Theme rules using token variables |
| `styles/index.css` | Slidev style entry point (imports tokens + theme) |

## Style preset

**cloudflare** -- warm cream background, Cloudflare orange accents, Inter type,
workshop-ready motion. See `styles/tokens.css` for the full token set.
