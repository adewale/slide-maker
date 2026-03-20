---
layout: section
transition: iris
---

# Infrastructure Components

Five components that handle navigation, sharing, and device adaptation.

<!-- Section divider for the infrastructure chapter. These five components are invisible in normal use — they provide keyboard overlays, QR sharing, touch navigation, mobile layout, and a clock widget. All are mounted via global-top.vue or global-bottom.vue and adapt to any preset through --deck-* tokens.

Sources:
- file:slide-maker/COMPILER_RULES.md — universal features specification -->

---
transition: slide-left
---

# AudienceQRCode — Share the Current Slide

Press <kbd>q</kbd> to display a full-screen QR code of the current slide URL.

<v-clicks>

- Toggled by the **q** key — press again or **Esc** to dismiss
- Generates a 280px QR code via the `qrcode` library with medium error correction
- URL updates per-slide so the audience lands on the exact slide you are showing
- Uses `--deck-font-display` for the heading and `--deck-font-mono` for the URL
- Mounted in `global-top.vue` — available on every slide automatically

</v-clicks>

<!-- AudienceQRCode is a full-screen overlay that renders the current window.location.href as a QR code. The audience scans the code to follow along on their own device.

[click] Toggled by the q key — a second press or Escape dismisses the overlay. The handler ignores keypresses inside INPUT, TEXTAREA, and SELECT elements.

[click] Generates the QR code at 280px width with medium error correction level. The qrcode npm package renders to a data URL, so no server round-trip.

[click] Because the URL is read from window.location.href on each toggle, it includes the current slide's hash route. The audience lands on the exact slide being presented.

[click] The heading uses --deck-font-display and the URL uses --deck-font-mono, so both adapt to the active preset.

[click] Mounted in global-top.vue alongside KeyboardHelp. No per-slide setup required.

Sources:
- file:slide-maker/components/AudienceQRCode.vue — full component source -->

---
transition: slide-left
---

# KeyboardHelp — Shortcut Overlay

Press <kbd>?</kbd> to open a full-screen keyboard shortcut reference.

<v-clicks>

- Toggled by **?** (registered in `setup/shortcuts.ts`)
- Hero zone: d-pad layout showing arrow key navigation at the top
- Two-column grid: **Move** shortcuts (brackets, Home, End, g, o) and **Screen** shortcuts (f, d, b, w, p, e, q)
- Reads `--deck-bg`, `--deck-fg`, `--deck-accent`, and `--deck-font-*` tokens
- Dismiss with **Esc** or click outside the panel

</v-clicks>

<!-- KeyboardHelp is the full-screen overlay that documents every keyboard shortcut available in the deck. It uses a d-pad layout at the top for arrow key navigation, then splits remaining shortcuts into Move and Screen columns.

[click] The ? shortcut is registered in setup/shortcuts.ts which calls toggleHelp() from composables/useHelp.ts.

[click] The hero zone renders arrow keys in a d-pad arrangement: up on top, left and right in the middle row, down at the bottom. This is the most natural representation of directional navigation.

[click] Below the hero zone, shortcuts split into Move (], [, Home, End, g, o) and Screen (f, d, b, w, p, e, q) columns.

[click] The panel background uses --deck-bg, text uses --deck-fg, key badges use --deck-accent tinting, and fonts read --deck-font-display, --deck-font-body, and --deck-font-mono.

[click] Escape key closes the overlay. Clicking the backdrop (outside the panel) also dismisses it.

Sources:
- file:slide-maker/components/KeyboardHelp.vue — full component source
- file:slide-maker/COMPILER_RULES.md — universal scaffold file list -->

---
transition: fade
---

# MobileScrollView — Portrait Phone Layout

On portrait phones under 640px, the entire deck becomes a vertical scroll view.

<v-clicks>

- Activates automatically on portrait-oriented screens narrower than 640px
- Each slide is a full-viewport scroll-snap card (`scroll-snap-type: y mandatory`)
- All `v-click` content is expanded — no click interaction needed
- Section-aware progress bar at the top with clickable segments
- Uses `--deck-bg`, `--deck-accent`, `--deck-muted`, and `--deck-border` tokens

</v-clicks>

<!-- MobileScrollView replaces the normal slide navigation with a vertical scroll experience on small portrait screens. This is the fallback for devices where click-based navigation is impractical.

[click] The component checks viewport width and orientation. Below 640px in portrait mode, it takes over the entire viewport with position: fixed and z-index: 10000.

[click] Each slide renders as a scroll-snap card using 100svh height. Scroll-snap ensures clean transitions between slides when swiping vertically.

[click] All v-click-hidden elements are forced visible (opacity: 1, transform: none) and v-click-display-none elements are forced to display: block. This means every slide shows its full content without interaction.

[click] A section-aware progress bar sits at the top. It mirrors ProgressSegmentBar behavior — one segment per section, current section fills with accent color. Segments are clickable tap targets (44px hit area).

[click] Uses --deck-bg for the scroll container background, --deck-accent for completed and active segments, --deck-muted and --deck-border for unfilled segments.

Sources:
- file:slide-maker/components/MobileScrollView.vue — full component source -->

---
transition: slide-left
---

# NavClock — Time in the Navigation Bar

A simple clock widget that displays the current time in 24-hour format.

<v-clicks>

- Renders as `HH:MM:SS` using `toLocaleTimeString('en-GB')`
- Updates every second via `setInterval`
- Uses `--deck-font-mono` for the clock face and `--deck-muted` for the text color
- Designed for the presenter's navigation bar — not visible to the audience

</v-clicks>

<!-- NavClock is a small inline component that shows the current time. It is mounted in the presenter view's navigation bar so the speaker can track time without looking away from the screen.

[click] The time format is 24-hour (HH:MM:SS) using the en-GB locale. No date, no AM/PM — just the essentials.

[click] A setInterval fires every 1000ms. The timer is cleared on unmount to prevent memory leaks.

[click] The clock uses --deck-font-mono for a fixed-width display that does not shift as digits change. Text color comes from --deck-muted so it stays unobtrusive.

[click] NavClock lives in the presenter view's toolbar. The audience never sees it.

Sources:
- file:slide-maker/components/NavClock.vue — full component source -->

---
transition: slide-left
---

# TouchNavigation — Swipe Gestures for Mobile

A renderless component that maps touch swipes to navigation actions.

<v-clicks>

- **Swipe right** = next click (`next()`)
- **Swipe left** = previous click (`prev()`)
- **Swipe up** = next slide (`nextSlide()`)
- Swipe down is intentionally unmapped (avoids conflict with pull-to-refresh)
- Threshold: 50px in both axes — vertical swipe takes priority when both exceed threshold
- Uses passive event listeners for scroll performance

</v-clicks>

<!-- TouchNavigation attaches touchstart and touchend listeners to the document. It calculates the swipe delta and maps it to Slidev navigation actions.

[click] Swipe right triggers next() — the same as pressing the right arrow key or spacebar. This advances to the next click within a slide.

[click] Swipe left triggers prev() — same as pressing the left arrow key.

[click] Swipe up triggers nextSlide() — jumps to the next slide regardless of remaining clicks.

[click] Swipe down is deliberately not mapped. On mobile browsers, swipe-down triggers pull-to-refresh, so mapping it would cause conflicts.

[click] Both THRESHOLD_X and THRESHOLD_Y are 50px. When both axes exceed their threshold, vertical takes priority (absDy > absDx).

[click] Event listeners use { passive: true } to avoid blocking the browser's scroll handling.

Sources:
- file:slide-maker/components/TouchNavigation.vue — full component source -->

---
layout: fact
transition: zoom-in
---

# <v-mark at="1" color="#22d3ee" type="circle">5</v-mark>

infrastructure components

QR sharing, keyboard help, mobile scroll, clock, and touch navigation — invisible until needed.

<!-- Five infrastructure components handle device adaptation and navigation without the audience noticing. AudienceQRCode (q key), KeyboardHelp (? key), MobileScrollView (auto on small screens), NavClock (presenter toolbar), and TouchNavigation (swipe gestures). All are mounted in global-top.vue or the presenter view and adapt to --deck-* tokens automatically.

Sources:
- file:slide-maker/COMPILER_RULES.md — universal features specification -->
