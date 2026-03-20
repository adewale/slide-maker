# Olsen

A 7-slide deck presenting [Olsen](https://github.com/adewale/olsen), a high-performance photo indexing system for DNG, JPEG, and BMP files.

## Through-line

"Read-only to sources -- the constraint that became the architecture." Olsen's O_RDONLY guarantee shapes every design decision: all output flows into a single SQLite database, making the catalog portable and the browsing experience local-first.

## Style

Uses the **tufte-data** preset: EB Garamond display, Source Sans 3 body, warm white background, scholarly tone.

## Run

```bash
npx slidev slides.md
```

## Build

```bash
npx slidev build
```

## Export PDF

```bash
npx slidev export
```
