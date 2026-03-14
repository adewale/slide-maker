# Debug at the Source (tufte)

A debugging detective story from the Olsen photo indexing project, rendered in Tufte data-narrative style.

## Style preset
`tufte-data` — scholarly, dense, evidence-driven

## Fonts
- Display + Body: EB Garamond
- Labels/Captions: Source Sans 3
- Mono: Source Code Pro

## Custom components
- `Sparkline.vue` — inline SVG sparkline that flows with text
- `Sidenote.vue` — marginal annotation with numbered references
- `SmallMultiples.vue` — grid of identical small charts
- `DataTable.vue` — minimal table with no gridlines

## Custom layout
- `TufteSlide.vue` — 60% body column + 30% right margin for sidenotes

## Slidev features used
- Shiki Magic Move for code before/after transformation
- v-mark.highlight for critical code lines
- v-mark.strike for wrong debugging steps
- v-clicks for progressive evidence reveal

## Dev
```bash
npx slidev --port 3040
```

## Build
Included in `bash build.sh` from project root.
