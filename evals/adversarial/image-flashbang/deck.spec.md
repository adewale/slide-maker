# Deck Spec — Night Shipping

Adversarial eval deck. Authored to pass `deck-lint` clean while embodying a
flash-bang defect the static linter cannot see.

## Direction

- Palette: warm cream content surfaces (`--deck-bg: #fffbf5`), near-black text.
- Type: Source Serif 4 display, Source Sans 3 body — preset-sanctioned families.
- Tone: calm operations narrative about an overnight CI runner.

## The planted defect

The cover slide carries a near-black photographic `background:` image URL in its
frontmatter. In a darkened room the cover is almost pure black, then the deck
cuts immediately to a full-cream content slide — a flash-bang.

deck-lint's flash-bang check (`checkFlashBang`) only resolves flat token and
frontmatter colors to hex via `colorToHex`, which returns null for image URLs.
So the cover is treated as the light `--deck-bg`, no luminance jump is measured,
and the deck passes clean. Only a rendered-screenshot pixel audit catches it.

## Layouts

cover, center, section — three distinct layouts for visual variety.
