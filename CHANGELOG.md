# Changelog

All notable changes to the slide-maker project and its Slidev extensions.

## [Unreleased]

### Added
- **Mobile scroll view spec** — design for vertically scrollable card view on portrait phones
- **Slidev vs Reveal.js comparison** — comprehensive feature matrix

### Fixed
- **Cross-platform build** — `sed -i.bak` replaces macOS-only `sed -i ''` in build.sh

---

## 2025-03-18

### Added
- **AudienceQRCode component** — press Q to display current slide URL as scannable QR code (z-index: 9500, qrcode library)
- **QR shortcut in keyboard help** — Q listed under Screen column

### Changed
- **Keyboard help d-pad layout** — replaced flat "Next / Back" hero row with directional pad: horizontal arrows = step navigation, vertical arrows = slide navigation
- **Move column clarified** — removed redundant arrow keys (now in d-pad), relabeled `]`/`[` as "hold to skip"

---

## 2025-03-06

### Changed
- **Keyboard overlay CRAP audit** — applied Contrast, Repetition, Alignment, Proximity principles to layout
- **Hero zone + two-column redesign** — Move column (navigation) and Screen column (display controls)

---

## 2025-03-04

### Added
- **PresenterSectionNav** — horizontal tab bar with past/current/future section states, click to jump
- **PresenterThumbnailGrid** — fullscreen slide grid modal, filterable by section, 6/5-column responsive layout
- **useSections composable** — extracts sections from frontmatter (`layout: section` or `layout: cover`)
- **useThumbnails composable** — shared state for thumbnail grid visibility and section filter

### Changed
- **Standardized UI consistency** — all overlay components use shared deck CSS tokens

---

## 2025-03-02

### Added
- 9 presenter mode improvements in a single batch:
  - **PresenterClickDots** — visual click progress indicator
  - **PresenterNotesZoom** — adjustable notes font size (12-28px)
  - **PresenterLayoutPicker** — 3-mode split (notes-focus, balanced, slides-focus)
  - **PresenterSectionLabel** — "Section N of M" display
  - **Laser pointer** — red dot following cursor, auto-hides after 3s
  - **TouchNavigation** — swipe right/left/up for click and slide navigation

---

## 2025-02-28

### Added
- **KeyboardHelp component** — press ? for full keyboard shortcut overlay
- **Themed overlays** — keyboard help styled per deck palette using `--deck-*` tokens

### Changed
- **Click-level vs slide-level navigation** — distinguished in keyboard overlay labels

---

## 2025-02-25

### Added
- **5 progress indicator components**:
  - ProgressSegmentBar (section-aware top bar)
  - ProgressDotRail (right-side vertical dots)
  - ProgressTallyMarks (bottom-left tally marks)
  - ProgressArcGauge (bottom-right quarter-circle)
- **Section-aware progress** — ProgressSegmentBar divides bar into deck sections

### Removed
- Fraction badge progress indicator (replaced by segment bar)

---

## 2025-02-20

### Changed
- **Anti-LLM theme for demo deck** — warm parchment palette (Young Serif + Source Sans 3), no purple gradients, no emoji, no "Let's dive in"
- **Index page card accents** — matched to actual deck theme colors

---

## 2025-02-15

### Added
- **Per-slide Markdown splitting** — Python script in build.sh resolves `src:` imports and outputs individual slide files
- **llms.txt generation** — [llmstxt.org](https://llmstxt.org/) manifest for AI discoverability
- **view.html** — standalone slide viewer page

### Removed
- sumi-e style preset (consolidated to 6 presets)

---

## 2025-02-10

### Added
- **CRAP design principles** — Contrast, Repetition, Alignment, Proximity checks in compiler
- **WCAG contrast checker** — AA compliance validation (4.5:1 body, 3:1 large text)

### Fixed
- 10 decks updated for contrast compliance

---

## 2025-02-05

### Added
- **screenshot-audit.mjs** — Playwright-based visual regression (WCAG contrast, overlap, overflow, Mermaid, v-click states)
- **Text overlap detection** — identifies overlapping elements in slide renders

### Fixed
- Code block contrast handling in audit tool
- SlopeChart label overlap

---

## 2025-02-01

### Added
- **Mermaid theme integration** — `setup/mermaid-renderer.ts` reads `--deck-*` CSS tokens and injects into diagram rendering via `beautiful-mermaid`
- **Mermaid reliability matrix** — documented which diagram types work reliably in Slidev

### Fixed
- Removed edge labels on dark backgrounds (Mermaid renders as black boxes)
- Durable Objects diagram corrected
- Body-text contrast failures across 4 decks

---

## 2025-01-28

### Added
- **deck-lint.mjs** — structural validator (required files, CSS tokens, frontmatter, src: imports)
- **style-audit.mjs** — verifies CSS custom properties survive Vite build
- **deck-diff.mjs** — pixel-level visual regression with HTML diff report

---

## 2025-01-20

### Changed
- **Core/local deck split** — core decks (demo, reference) in `examples/`, personal decks in `decks/`
- **Reference deck redesign** — nord-light theme with native diagrams

---

## 2025-01-15

### Added
- **GitHub Pages deployment** — `deploy-gh-pages.sh` with auto-detected base path
- **SPA routing** — `serve.json`, `_redirects`, `404.html` for GitHub Pages and Cloudflare

---

## 2025-01-10

### Added
- **Reference deck** — comprehensive feature showcase exercising every Slidev feature and extension
- **LLM tells document** — 60+ anti-patterns for detecting AI-generated slide content

---

## [0.1.0] — 2025-02-27

Initial public release. See [docs/CHANGELOG.md](docs/CHANGELOG.md) for the full
skill changelog covering the compiler rules, style presets, and slide types.

### Infrastructure
- 13 cinematic transitions (iris, wipe, morph-fade, zoom, flip, cube, swing, blur, glide)
- 6 hover interaction patterns
- 4 visual effect components (GlassCard, ImageFX, ShadowStack, CornerCard, RevealPath)
- 8 data visualization components (Sparkline, SmallMultiples, DataTable, MicroBar, BulletBar, DotStrip, WinLoss, SlopeChart)
- Multi-deck build system with configurable base paths
- `--deck-*` CSS token system for consistent theming
