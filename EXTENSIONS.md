# Slidev Extensions

Custom components, composables, transitions, tooling, and infrastructure built
on top of [Slidev](https://sli.dev) (v52+). These are project-level extensions,
not part of the slide-maker skill.

---

## Components

### Audience & Navigation

| Component | Trigger | Purpose |
|---|---|---|
| **AudienceQRCode** | Press `Q` | Fullscreen overlay with QR code of current slide URL. Uses `qrcode` library. Dismiss with Q, Escape, or click outside. z-index: 9500 |
| **KeyboardHelp** | Press `?` | Keyboard shortcut overlay with d-pad hero zone (arrows = step vs slide navigation) and two-column reference (Move / Screen). z-index: 9000 |
| **TouchNavigation** | Swipe gestures | Renderless component. Swipe right = next click, left = prev click, up = next slide. 50px threshold. Passive listeners |

### Progress Indicators

| Component | Position | Style |
|---|---|---|
| **ProgressSegmentBar** | Fixed top | Thin bar (3px) divided into sections. Current section fills with `--deck-accent`. Most commonly used |
| **ProgressDotRail** | Fixed right | Vertical dot column. Current dot highlighted. Hides on cover/end layouts. z-index: 100 |
| **ProgressTallyMarks** | Fixed bottom-left | SVG tally marks grouped in fives. z-index: 100 |
| **ProgressArcGauge** | Fixed bottom-right | Quarter-circle SVG arc. 36x36px. z-index: 100 |

### Presenter Mode

| Component | Purpose |
|---|---|
| **PresenterSectionNav** | Horizontal tab bar showing all sections with past/current/future states. Click to jump |
| **PresenterThumbnailGrid** | Fullscreen modal grid of all slides. Filterable by section. 6/5 column responsive grid. z-index: 500 |
| **PresenterNotesZoom** | Font size control for notes panel (12-28px, step 2). Persists to localStorage |
| **PresenterClickDots** | Inline SVG dots showing click progress within current slide |
| **PresenterLayoutPicker** | 3-mode toggle: notes-focus (70/30), balanced (50/50), slides-focus (30/70). Persists to localStorage |
| **PresenterSectionLabel** | Displays "Section N of M" in presenter view |
| **Laser pointer** | Red dot following mouse cursor in presenter mode. Auto-hides after 3s inactivity. Implemented in global-top.vue |

### Data Visualization

| Component | Props | Output |
|---|---|---|
| **Sparkline** | `data[]`, `width`, `height`, `color` | Inline SVG line chart |
| **SmallMultiples** | `cols` (default 4) | CSS grid container for repeated charts |
| **DataTable** | `headers[]`, `rows[][]` | Styled table with deck theme |
| **MicroBar** | `data[]` (label + value), `max`, `color` | Horizontal bar chart |
| **BulletBar** | `value`, `target`, `max`, `label` | Actual vs target bar with marker |
| **DotStrip** | `data[]`, `min`, `max`, `radius` | SVG dot plot on a baseline |
| **WinLoss** | `data[]`, `barWidth`, `barHeight` | Binary up/down bar chart |
| **SlopeChart** | `items[]`, `startLabel`, `endLabel`, `height` | Before/after comparison lines |

### Visual Effects

| Component | Props | Effect |
|---|---|---|
| **GlassCard** | `blur`, `opacity`, `border` | Frosted glass with backdrop-filter |
| **ImageFX** | `effect` (duotone, vignette, grain, grayscale, sepia, none) | CSS/SVG image filters |
| **ShadowStack** | `preset` (subtle, dramatic, glow, neon, long) | Multi-layer drop shadow |
| **CornerCard** | `size`, `thickness`, `color`, `padding` | Decorative corner bracket frame |
| **RevealPath** | `path`, `duration`, `delay` | SVG path drawing animation |

---

## Composables

| Composable | Returns | Used by |
|---|---|---|
| **useSections** | `sections[]` (page, title, start, end), `currentSectionIndex` | ProgressSegmentBar, PresenterSectionNav, PresenterSectionLabel, PresenterThumbnailGrid |
| **useThumbnails** | `showThumbnails`, `selectedSection`, `toggleThumbnails()` | PresenterThumbnailGrid, PresenterSectionNav |
| **useHelp** | `showHelp`, `toggleHelp()` | KeyboardHelp, shortcuts.ts |

---

## Transitions

13 cinematic transitions defined in `skills/slide-maker/styles/transitions.css`:

| Transition | Effect | Duration |
|---|---|---|
| **iris** | Circle clip-path expanding from center | 0.7s |
| **wipe-right** | Inset wipe left to right | 0.6s |
| **wipe-up** | Inset wipe bottom to top | 0.6s |
| **morph-fade** | Scale + blur + opacity | 0.5s |
| **zoom-in** | Scale 0.6 to 1 with fade | 0.5s |
| **zoom-out** | Scale 1.2 to 1 with fade | 0.5s |
| **flip-x** | 3D rotateY with perspective | 0.6s |
| **flip-y** | 3D rotateX with perspective | 0.6s |
| **cube** | 3D rotateY + translateZ | 0.7s |
| **swing** | Eased rotateY with spring timing | 0.5s |
| **blur** | Blur 12px to 0 with fade | 0.5s |
| **glide** | TranslateX +/- 3% with scale 0.98 | 0.5s |

All use `cubic-bezier(0.4, 0, 0.2, 1)` easing. Slidev's built-in `fade` and
`slide-left`/`slide-right`/`slide-up` are also available.

---

## Hover Interactions

6 interaction patterns defined in `skills/slide-maker/styles/interactions.css`:

| Class | Effect |
|---|---|
| `.hover-lift` | translateY(-4px) + shadow on hover |
| `.spotlight-group` | Dim siblings, highlight hovered item |
| `.hover-scale` | scale(1.03) on hover |
| `.hover-accent` | Border changes to `--deck-accent` |
| `.hover-glow` | Box-shadow glow with accent color |
| `.hover-dim` | Opacity drops to 0.7 |

---

## CSS Custom Properties

### Deck tokens (`--deck-*`)

Every deck defines these in `styles/tokens.css`. Components and theme CSS
reference them for consistent theming.

| Property | Purpose | Demo deck value |
|---|---|---|
| `--deck-bg` | Background | `#f4f0e8` (parchment) |
| `--deck-fg` | Foreground / text | `#2b2622` |
| `--deck-accent` | Primary accent | `#b44215` (rust) |
| `--deck-muted` | Secondary text | `#746a5e` |
| `--deck-accent-alt` | Secondary accent | `#2a6e4e` (sage) |
| `--deck-rule` | Divider lines | `#c9c1b3` |
| `--deck-code-bg` | Code block background | `#ebe5d9` |
| `--deck-font-display` | Heading font | `'Young Serif'` |
| `--deck-font-body` | Body font | `'Source Sans 3'` |
| `--deck-font-mono` | Code font | `'Source Code Pro'` |

### Presenter tokens (`--presenter-*`)

| Property | Purpose | Set by |
|---|---|---|
| `--presenter-notes-width` | Notes panel width (30/50/70%) | PresenterLayoutPicker |
| `--presenter-slides-width` | Slide panel width (70/50/30%) | PresenterLayoutPicker |
| `--presenter-notes-font-size` | Notes font size (12-28px) | PresenterNotesZoom |

---

## Setup Files

| File | Purpose |
|---|---|
| `setup/shortcuts.ts` | Registers `?` (help toggle), `p` (presenter), `]`/`[` (next/prev slide with auto-repeat) |
| `setup/mermaid-renderer.ts` | Reads `--deck-*` CSS properties from DOM and injects into Mermaid diagram theme via `beautiful-mermaid` |

---

## Build System

`examples/build.sh` compiles all decks into a deployable static site.

### Features

| Feature | Details |
|---|---|
| **Multi-deck build** | Builds core decks (`demo`→`slide-maker`, `reference`) and optional external decks via `DECKS_DIR` |
| **Per-slide splitting** | Python script parses `slides.md`, resolves `src:` imports, outputs `slides/1.md` through `slides/N.md` + `slides/count` |
| **llms.txt** | Generates [llmstxt.org](https://llmstxt.org/) manifest listing all decks and per-slide URLs |
| **HTML link injection** | Adds `<link rel="alternate" type="text/markdown">` to each deck's index.html |
| **SPA routing** | Generates `serve.json` (npx serve), `_redirects` (Cloudflare), `404.html` (GitHub Pages) |
| **Configurable base path** | `BASE_PREFIX` env var for deployment under a subdirectory |

### Usage

```bash
npm run build                          # build all decks
npm run dev                            # build + serve at localhost:3030
npm run serve                          # serve pre-built at localhost:3030
BASE_PREFIX=/slide-maker npm run build # for GitHub Pages subdirectory
```

---

## Tooling

Four CLI tools in `tools/`:

| Tool | Purpose | Usage |
|---|---|---|
| **deck-lint.mjs** | Validates deck structure (required files, CSS tokens, frontmatter, src: imports) | `node deck-lint.mjs [deck...]` |
| **screenshot-audit.mjs** | Playwright-based visual checks (WCAG contrast, overlap, overflow, Mermaid, v-click states) at 1280x720 and 1024x768 | `node screenshot-audit.mjs <url> [deck]` |
| **style-audit.mjs** | Verifies CSS custom properties survive the Vite build (source tokens vs minified output) | `node style-audit.mjs [deck...]` |
| **deck-diff.mjs** | Pixel-level comparison of two screenshot sets with HTML diff report | `node deck-diff.mjs --left <dir> --right <dir>` |

---

## Deployment

Two deployment targets are supported:

### GitHub Pages

Automated via `.github/workflows/deploy.yml`. Triggers on push to `main`.
Sets `BASE_PREFIX=/slide-maker` for subdirectory hosting.

### Cloudflare Workers

Separate project at `slides.oshineye.dev/`. Uses `wrangler.jsonc` with static
asset hosting and SPA fallback (`not_found_handling: "single-page-application"`).

```bash
# From the Cloudflare project
./pull-slides.sh /path/to/slide-maker --deploy
```

---

## Integration Points

### global-top.vue

The main integration file for each deck. Renders overlay components on every slide:

```vue
<script setup>
import ProgressSegmentBar from './components/ProgressSegmentBar.vue'
import KeyboardHelp from './components/KeyboardHelp.vue'
import AudienceQRCode from './components/AudienceQRCode.vue'
</script>

<template>
  <ProgressSegmentBar />
  <KeyboardHelp v-if="showHelp" />
  <AudienceQRCode />
  <!-- Laser pointer (presenter-only) -->
</template>
```

### global-bottom.vue

Footer with deck title and slide counter. Hidden on cover/end layouts.

### Adding to a new deck

1. Copy needed components into `your-deck/components/`
2. Copy composables into `your-deck/composables/`
3. Import transitions in `your-deck/styles/index.css`
4. Wire into `global-top.vue` and `global-bottom.vue`
5. Register shortcuts in `setup/shortcuts.ts`
6. Define `--deck-*` tokens in `styles/tokens.css`
