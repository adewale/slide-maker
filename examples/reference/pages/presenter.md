---
layout: section
transition: iris
---

# Presenter Mode Components

Six components that make presenter view a control center, not just a mirror.

<!-- Section divider for the presenter mode chapter. These six components enhance Slidev's built-in presenter view with click indicators, layout control, notes zoom, section awareness, and a thumbnail grid. All are mounted in the custom presenter layout and adapt to --deck-* tokens.

Sources:
- file:slide-maker/COMPILER_RULES.md — presenter mode component catalog -->

---
transition: slide-left
---

# PresenterClickDots — Click Sequence Indicator

Shows how many clicks remain on the current slide as a row of dots.

<v-clicks>

- Renders one SVG circle per click on the current slide
- Filled dots (up to current click) use `--deck-accent`
- Unfilled dots (remaining clicks) are outlined with `--deck-muted`
- Hidden when the slide has zero clicks
- Compact inline layout — fits in the presenter toolbar

</v-clicks>

<!-- PresenterClickDots provides at-a-glance click progress. The presenter sees exactly how many clicks remain before the next slide transition.

[click] Each dot is an SVG circle 8px in diameter, spaced 12px apart. The total count comes from clicksTotal via useNav().

[click] Dots up to the current click index are filled with --deck-accent (fallback: #6366f1).

[click] Remaining dots are unfilled (transparent) with a --deck-muted stroke.

[click] When clicksTotal is 0 (no v-clicks on the slide), the component renders nothing.

[click] The inline-flex layout means it sits naturally alongside other toolbar elements like NavClock and PresenterNotesZoom.

Sources:
- file:slide-maker/components/PresenterClickDots.vue — full component source -->

---
transition: slide-left
---

# PresenterLayoutPicker — Three-Mode Split Control

Switch the presenter view between notes-focus, balanced, and slides-focus layouts.

<v-clicks>

- Three modes: **notes-focus** (70/30), **balanced** (50/50), **slides-focus** (30/70)
- Each button renders an SVG icon showing the split ratio visually
- Active mode highlighted with `--deck-accent` border and fill
- Sets `--presenter-notes-width` and `--presenter-slides-width` CSS custom properties
- Persisted to `localStorage` under the key `presenter-layout-mode`

</v-clicks>

<!-- PresenterLayoutPicker gives the presenter control over how much screen space notes vs slides receive.

[click] Three layout modes. Notes-focus gives 70% to notes and 30% to slides — for dense presenter notes. Balanced is a 50/50 split. Slides-focus gives 70% to slides — for visually complex slides.

[click] Each button contains a 28x18 SVG showing a rectangle with a vertical divider at the split position. The left side (slides area) has a tinted fill.

[click] The active mode's button gets a --deck-accent border and the SVG fill switches to --deck-accent at 20% opacity.

[click] Applies the split by setting two CSS custom properties on document.documentElement. The presenter view's CSS grid reads these values to size the panels.

[click] The selected mode survives page reloads via localStorage. On mount, the component reads the stored value and applies it immediately.

Sources:
- file:slide-maker/components/PresenterLayoutPicker.vue — full component source -->

---
transition: slide-left
---

# PresenterNotesZoom — Font Size Control for Notes

Increase or decrease the presenter notes font size from 12px to 28px.

<v-clicks>

- **minus** and **plus** buttons adjust font size in 2px steps
- Range: 12px minimum, 28px maximum, 16px default
- Sets `--presenter-notes-font-size` CSS custom property on the document root
- Also applies `fontSize` directly to elements matching `.slidev-layout-presenter-notes`
- Persisted to `localStorage` under the key `presenter-notes-font-size`
- Uses `--deck-font-mono` for the size label and `--deck-accent` on hover

</v-clicks>

<!-- PresenterNotesZoom solves the common problem of notes text being too small or too large for the presenter's viewing distance.

[click] Two buttons: minus to decrease, plus to increase. Both are 24px square with --deck-muted borders.

[click] The font size range (12-28px in 2px steps) covers typical needs from dense notes at arm's length to large text for standing presentations.

[click] Sets --presenter-notes-font-size on the document root so any CSS that references this property updates automatically.

[click] As a fallback, directly sets el.style.fontSize on all elements matching .slidev-layout-presenter-notes, .presenter-notes, or [class*="notes"].

[click] The selected size persists via localStorage, so it survives page reloads.

[click] The current size (e.g., "16px") is displayed between the buttons using --deck-font-mono. Buttons highlight with --deck-accent on hover.

Sources:
- file:slide-maker/components/PresenterNotesZoom.vue — full component source -->

---
transition: fade
---

# PresenterSectionLabel — "Section N of M" Display

Shows the current section name and its position within the deck.

<v-clicks>

- Format: `Section Title (N of M)` where N is the current section index
- Reads sections from the `useSections` composable
- Section prefix styled with `--deck-accent` in uppercase
- Section name styled with `--deck-fg`
- Body text uses `--deck-font-body` at 0.8rem

</v-clicks>

<!-- PresenterSectionLabel provides context about where the presenter is in the overall deck structure.

[click] The label renders as two spans: "Section:" prefix followed by the section title and position, e.g., "Interactivity (3 of 8)".

[click] Uses the useSections composable which detects sections from slides with layout: section or layout: cover in their frontmatter.

[click] The "Section:" prefix is uppercase, 0.7rem, font-weight 600, colored with --deck-accent.

[click] The section name uses --deck-fg for readable contrast.

[click] The entire label uses --deck-font-body at 0.8rem, keeping it compact enough for the presenter toolbar.

Sources:
- file:slide-maker/components/PresenterSectionLabel.vue — full component source -->

---
transition: slide-left
---

# PresenterSectionNav — Horizontal Section Tabs

A row of clickable tabs representing each section of the deck.

<v-clicks>

- One button per section, labeled with the section title
- Current section highlighted with `--deck-accent` background and white text
- Past sections use `--deck-muted` text, future sections use `--deck-border` text
- When the thumbnail grid is open, clicking a tab filters to that section
- When the thumbnail grid is closed, clicking a tab navigates to the section's first slide
- Horizontal overflow scrolls with a thin `--deck-border` scrollbar

</v-clicks>

<!-- PresenterSectionNav provides quick navigation between deck sections from the presenter toolbar.

[click] Each tab is a flex-shrink: 0 button at 0.7rem with 500 weight. Tabs render in source order, matching the deck's section sequence.

[click] The current section tab gets background: --deck-accent with white text. This is the most prominent visual indicator.

[click] Past sections use --deck-muted for a subdued look. Future sections use --deck-border, even more subtle.

[click] When the PresenterThumbnailGrid is open (showThumbnails is true), clicking a tab sets selectedSection to filter the grid to that section's slides.

[click] When the grid is closed, clicking a tab calls go(sec.page) to navigate directly to the section's first slide.

[click] The nav bar has overflow-x: auto with scrollbar-width: thin. On WebKit, the scrollbar track is transparent and the thumb uses --deck-border.

Sources:
- file:slide-maker/components/PresenterSectionNav.vue — full component source -->

---
transition: slide-left
---

# PresenterThumbnailGrid — Fullscreen Slide Grid

A filterable grid of all slides, accessible from the presenter view.

<v-clicks>

- Fullscreen overlay with card-based grid layout
- Each card shows: slide number, layout badge, and title (extracted from markdown headings)
- Current slide card highlighted with a 2px `--deck-accent` border
- Filter by section using `PresenterSectionNav` tabs — filter badge shows active section name
- Click any card to navigate directly to that slide and close the grid
- Dismiss with **Esc** or click outside — uses a `backdrop-filter: blur(8px)` overlay

</v-clicks>

<!-- PresenterThumbnailGrid provides a bird's-eye view of the entire deck from the presenter view.

[click] The overlay uses color-mix(in srgb, var(--deck-bg) 88%, transparent) with backdrop-filter: blur(8px). The panel itself is 90vw wide, max 1200px, with 85vh max height.

[click] Each card is a button with three pieces of information: page number in --deck-font-mono at 700 weight, layout name in a small badge, and the slide title extracted from the first markdown heading.

[click] The current slide's card gets a 2px --deck-accent border. All other cards use 1px --deck-border.

[click] When PresenterSectionNav sets selectedSection, the grid filters to show only slides in that section. A filter badge appears in the header with a clear button.

[click] Clicking a card calls go(page) and closes the grid. The header shows "N of M slides" with the filtered count.

[click] Escape key closes the grid. Clicking the overlay backdrop also closes it. On open, the grid auto-scrolls to the current slide.

Sources:
- file:slide-maker/components/PresenterThumbnailGrid.vue — full component source -->

---
layout: fact
transition: zoom-in
---

# <v-mark at="1" color="#22d3ee" type="circle">6</v-mark>

presenter components

Click dots, layout picker, notes zoom, section label, section nav, and thumbnail grid — a complete presenter control center.

<!-- Six presenter mode components transform the built-in presenter view into a control center: PresenterClickDots (click progress), PresenterLayoutPicker (3-mode split), PresenterNotesZoom (12-28px font control), PresenterSectionLabel (section N of M), PresenterSectionNav (horizontal tabs), PresenterThumbnailGrid (filterable fullscreen grid). All use --deck-* tokens and are mounted in the custom presenter layout.

Sources:
- file:slide-maker/COMPILER_RULES.md — presenter mode component catalog -->
