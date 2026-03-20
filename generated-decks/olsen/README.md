# Olsen

A 9-slide deck presenting [Olsen](https://github.com/adewale/olsen), a local-first CLI tool for faceted browsing of photographs.

## Running

```bash
cd generated-decks/olsen
npx slidev slides.md
```

## Building

```bash
npx slidev build
```

The output is in `dist/`. Deploy to any static host.

## Style

Uses the **tufte-data** preset: EB Garamond display, Source Sans 3 body, Source Code Pro mono. Warm white background (`#fffff8`), near-black text, data-blue accent.

## Structure

| Slide | Kind | Title |
|-------|------|-------|
| 1 | cover | Olsen |
| 2 | default-content | What Olsen does in 62 milliseconds |
| 3 | center-statement | Read-only is not a limitation |
| 4 | section | The state machine insight |
| 5 | comparison | Hierarchical vs. state machine |
| 6 | default-content | One rule for every facet |
| 7 | default-content | 11 colors, saturation first |
| 8 | default-content | Debug at the source, not the display |
| 9 | end | Constraints compound into trust |

## Through-line

"Constraint as architecture" -- every design decision in Olsen is a deliberate restriction that eliminates a class of problems.
