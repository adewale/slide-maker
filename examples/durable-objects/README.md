# What Are Durable Objects For?

A 26-slide deck explaining Durable Object patterns through three real projects: Vaders (game state sync), Keyboardia (collaborative music relay), and Cloudflare Agents (persistent AI agents).

## Quick start

```bash
npm install
npx slidev
```

## Style preset

**cloudflare** — warm beige background, Cloudflare orange accent, Work Sans + DM Sans + IBM Plex Mono.

## Transition vocabulary

- `slide-left` — progression (default)
- `fade` — reflection / pause
- `iris` — new chapter (section dividers)
- `morph-fade` — conceptual shift
- `wipe-right` — comparison
- `slide-up` — reveal / evidence

## Through-line

> "What happens when you give a function a name, a memory, and a mailbox?"

Appears in slides 1, 9, 13, 17, 21, 25 — each time refracting the question through a different use case.

## Structure

```
slides.md          # 26 slides
deck.spec.md       # full spec with Source Materials + Through-Line
styles/
  tokens.css       # cloudflare design tokens
  theme.css        # cloudflare theme styles
  index.css        # entry point (@import tokens + theme)
```
