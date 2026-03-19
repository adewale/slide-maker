# Planet CF — Slide Deck

A 7-slide presentation about [Planet CF](https://github.com/adewale/planet_cf), a feed aggregator built on Cloudflare's Python Workers platform.

## Through-line

"What happens when Python runs inside JavaScript?" — explores how Planet CF handles the type boundary between Pyodide and Cloudflare's JavaScript APIs.

## Running

```bash
npm install
npx slidev slides.md
```

## Building

```bash
npx slidev build
```

The `dist/` directory can be deployed to any static host.

## Style

Uses the **cloudflare** preset with Cloudflare orange (`#ff4801`) accent on warm cream (`#fffbf5`) background.

## Source

Grounded in the project's README.md, ARCHITECTURE.md, LESSONS_LEARNED.md, SPEC.md, and source code (config.py, wrappers.py).
