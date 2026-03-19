# Mobile Scroll View — Spec

## Problem

On portrait phones, 16:9 slides occupy ~25% of the screen. The rest is black bars.
Slide-by-slide navigation with transitions and click animations is designed for
presenters, not readers. Mobile viewers want to consume the deck, not perform it.

## Goal

When the viewport is narrow and portrait, switch from scaled-slide mode to a
vertically scrollable card view. All slides visible by scrolling. No transitions,
no click animations — all content revealed. Minimal chrome.

## Activation

| Condition | Value |
|---|---|
| Trigger | `window.innerWidth < 640px` AND portrait orientation |
| CSS selector | `@media (max-width: 639px) and (orientation: portrait)` |
| Deactivation | Viewport widens past 640px or rotates to landscape |
| No JS toggle | Pure CSS where possible; one reactive boolean (`isMobileScroll`) for DOM changes |

When the scroll view activates, Slidev's built-in slide routing and transitions
are bypassed. The URL stays at the deck root (e.g., `/#/`).

## Layout

```
┌──────────────────────────┐
│ ProgressSegmentBar (3px) │  ← fixed top, same as desktop
├──────────────────────────┤
│                          │
│   Slide 1 card           │  ← full viewport width, intrinsic height
│   (all v-clicks visible) │
│                          │
├──────────────────────────┤
│                          │
│   Slide 2 card           │  ← gap between cards: 1px hairline
│                          │
├──────────────────────────┤
│   ...                    │
├──────────────────────────┤
│   Slide N card           │
│                          │
└──────────────────────────┘
  ↕ scroll-snap: y mandatory
```

### Card rendering

- Each slide renders at **viewport width minus safe-area insets**
- Height is **intrinsic** — the card grows to fit content, no fixed aspect ratio
- Slide content uses the deck's `--deck-bg` as background, not the Slidev default
- The black container background is replaced with the deck's `--deck-bg`
- Cards separated by a 1px hairline in `--deck-border` color
- `scroll-snap-align: start` on each card
- `scroll-snap-type: y mandatory` on the scroll container

### Content changes in scroll view

| Desktop behavior | Mobile scroll behavior |
|---|---|
| `v-click` / `v-clicks` hide content until clicked | All content visible immediately |
| `transition: fade` etc. between slides | No transitions — cards are static |
| Slide fixed at 980x550, scaled via `transform` | Slide fills viewport width, height is intrinsic |
| Click-indexed fragments render progressively | All fragments at their final state |
| Mermaid diagrams at authored `scale` | Mermaid diagrams at width: 100%, auto height |

## Chrome

### Hidden in scroll view

- Slidev bottom nav toolbar (arrows, grid, draw, overview, settings)
- Slide number counter
- Clock / timer
- Drawing tools
- Presenter mode controls

### Kept in scroll view

- **ProgressSegmentBar** — fixed top, updates based on scroll position
- **Swipe-to-dismiss** — swipe right from left edge returns to menu (if applicable)

### Touch targets

All interactive elements must meet the **44x44px minimum** (Apple HIG / WCAG 2.5.8).

| Element | Size | Behavior |
|---|---|---|
| Progress bar segments | 44px tap height (visual 3px, tap target padded) | Tap to scroll to section |
| Links in slide content | Default font size ≥ 16px, ≥ 44px line height | Standard tap |
| Code blocks | Horizontal scroll if overflow, no wrapping | Touch-scroll horizontally |

## Scroll position tracking

- The ProgressSegmentBar reads scroll position via `IntersectionObserver` on each card
- Current card index derived from which card's top edge is nearest the viewport top
- Progress bar segments fill proportionally within the current section
- URL hash does not update per-card (avoids history spam on scroll)

## Implementation approach

### Phase 1: CSS-only cosmetics (Option A)

Achievable without modifying Slidev internals. Ship first.

1. Media query hides nav toolbar: `.slidev-nav-controls { display: none }`
2. Container background: `--slidev-slide-container-background: var(--deck-bg)`
3. Progress bar tap target padding

### Phase 2: Scroll view (Option C)

Requires a Vue component that renders all slides in a scrollable column.

1. New component: `MobileScrollView.vue`
   - Detects `isMobileScroll` via `useMediaQuery('(max-width: 639px) and (orientation: portrait)')`
   - When active, replaces Slidev's `<SlideContainer>` with a scroll container
   - Renders each slide's component with `$clicks: Infinity` (forces all v-clicks visible)
   - Wraps each slide in a `<section class="scroll-card">` with snap alignment

2. Integration point: `global-top.vue`
   - Conditionally renders `<MobileScrollView v-if="isMobileScroll" />`
   - The scroll view teleports to body and covers the normal slide view

3. ProgressSegmentBar gains scroll-position mode
   - Existing slide-index tracking swapped for `IntersectionObserver` when in scroll mode

### What we do NOT build

- No content reflow (Gamma-style) — slide layouts render as-is, just at viewport width
- No offline/PWA — mobile scroll view is online-only like the desktop version
- No slide editing on mobile
- No presenter mode on mobile — scroll view is audience-only
- No horizontal swipe between slides — vertical scroll is the only navigation
- No lazy loading of slide content — all slides render in the DOM (11 slides is trivial)

## Testing

Screenshot each slide card at 375px (iPhone SE) and 412px (Pixel 7) widths.
Compare against the 16:9 desktop renders for content parity — every element
visible on desktop must be visible in scroll view.

Specific checks:
- [ ] All v-click content visible without interaction
- [ ] Mermaid diagrams fit within viewport width, no horizontal overflow
- [ ] Two-column layouts (SplitInsight) readable at 375px
- [ ] Code blocks horizontally scrollable, not clipped
- [ ] ProgressSegmentBar tap targets ≥ 44px
- [ ] No Slidev nav chrome visible
- [ ] Scroll snap locks to card boundaries
- [ ] Deck background color used everywhere (no black bars)
