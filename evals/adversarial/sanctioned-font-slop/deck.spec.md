# Deck Spec — Platform Synergy

Adversarial eval deck. Authored to pass `deck-lint` clean while embodying a
content-slop defect no static check can catch.

## Direction

- Palette: cool-grey surfaces (`--deck-bg: #f7f8fa`), near-black text, blue accent.
- Type: Source Serif 4 display, Source Sans 3 body — preset-SANCTIONED families,
  so the linter's overused-font check (Inter/Roboto/Arial) finds nothing.
- Contrast: all tokens verified WCAG AA against `--deck-bg`.

## The planted defect

Every static signal is clean: sanctioned fonts, AA contrast, valid tokens, no
emoji, no scoped-style hex, three-plus layout names for variety. But the CONTENT
is pure slop:

- The identical icon + heading + one-line-text three-card grid is reused on
  every content slide (Capabilities, How It Works, Why Teams Choose Us, Built
  for Every Stage). Same structure, interchangeable filler copy.
- A hero-metric cliche ("10x faster time to value") with no source.
- Flat type hierarchy — every card heading is the same weight and size.
- Zero progressive reveal; nothing is staged or argued.
- Generic, says-nothing prose: "scalable, future-ready", "enterprise-grade",
  "your whole team will love".

deck-lint measures structure and tokens, not whether the deck argues anything.
Only the LLM judge (visual rubric + held-out memorability/compression criteria)
catches that this deck is competent-looking and says nothing.

## Layouts

cover, fact, end (explicit) plus default content slides — satisfies the
layout-variety check while the content stays monotonous.
