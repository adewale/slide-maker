# GeistFabrik

A 7-slide deck introducing [GeistFabrik](https://github.com/adewale/geist_fabrik) -- a Python-based divergence engine for Obsidian vaults that generates creative suggestions through code and Tracery grammars.

## Running

```bash
cd generated-decks/geist-fabrik
npx slidev slides.md
```

## Building

```bash
npx slidev build slides.md
```

The built deck will be in `dist/`.

## Style

Uses the **swiss-minimal** preset with a muted green accent (`#4a6741`) drawn from the project's organic/growth metaphor. Typography: Plus Jakarta Sans (display), Figtree (body), JetBrains Mono (code).

## Structure

| Slide | Kind | Layout | Content |
|-------|------|--------|---------|
| 1 | cover | cover | Project identity and one-line description |
| 2 | default-content | default | What it is and why it exists (README verbatim) |
| 3 | center-statement | center | Through-line: the design rule |
| 4 | fact | fact | 57 geists, 611 tests, zero API calls |
| 5 | comparison | two-cols | Code vs Tracery war story |
| 6 | default-content | default | Data flow Mermaid diagram |
| 7 | end | end | Closing: muses, not oracles |

## Through-line

"A well-asked question is better than a poorly-computed answer." -- surfaces in slides 1, 3, 5, and 7.

## Source materials

- `README.md` -- project description, features, architecture, design principles
- `LESSONS_LEARNED.md` -- the Contradictor experiment and "muses not oracles" principle
