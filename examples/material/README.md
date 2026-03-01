# Keyboardia (material)

A product launch narrative for the Keyboardia multiplayer step sequencer, rendered in Material Design 3 style.

## Style preset
`material-design` — systematic, polished, product-oriented

## Fonts
- Display: Outfit
- Body: Plus Jakarta Sans
- Mono: Roboto Mono

## Custom components
- `MDCard.vue` — M3 card with elevated, filled, and outlined variants
- `MDChip.vue` — M3 chip with selected state
- `MDSurface.vue` — tonal surface wrapper with level 0-5

## Custom layout
- `MaterialSlide.vue` — 16px grid-aligned layout with M3 spacing

## Slidev features used
- v-motion for M3 container-transform entrances
- v-mark.box for highlighting constraints
- v-clicks on chip groups and card grids
- M3 easing curves (emphasized-decelerate)

## Dev
```bash
npx slidev --port 3041
```

## Build
Included in `bash build.sh` from project root.
