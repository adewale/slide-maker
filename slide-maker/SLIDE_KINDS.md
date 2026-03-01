# slide kinds

These are the canonical slide kinds for `slidev-project-studio`.
Use the smallest set that covers the deck cleanly.

## Decision rule

For each slide kind, prefer:
1. plain Markdown
2. built-in Slidev layout
3. one local custom layout
4. one local custom component

Do not invent a new kind for a one-off slide.

## Kinds

### cover
Use for opening slides.
Default target: built-in `cover`.
Escalate only for a recurring branded hero treatment.

### section
Use for chapter breaks.
Default target: built-in `section`.
Escalate only for a recurring bespoke divider.

### default-content
Use for standard explanatory slides.
Default target: Markdown with `default`.
Escalate only when a structure repeats.

### center-statement
Use for punchy single-idea slides.
Default target: built-in `center`.

### fact
Use for one primary metric or proof point.
Default target: built-in `fact`.
Escalate when the deck has a repeated stat system.

### end
Use for closing slides.
Default target: built-in `end`.

### split-insight
Use for left/right reasoning, explanation plus proof, or a narrative split.
Default target: one local custom layout if repeated.

### metrics-grid
Use for a small set of comparable metrics.
Default target: one local layout plus a reusable card component if needed.

### image-caption
Use for one dominant image plus short text.
Default target: Markdown or one local layout.

### quote-pull
Use for testimonials, principles, or sharp external quotes.
Default target: built-in quote treatment if the project has one, otherwise one local layout only if repeated.

### comparison
Use for before/after or option-vs-option slides.
Default target: Markdown or one local layout if the shell repeats.

### timeline
Use for phased plans or a simple roadmap.
Default target: Markdown list first, local layout only when the visual timeline materially helps.

## Density guardrails

- one idea per slide
- 3 to 5 bullets is normal
- one strong stat beats six weak ones
- if the slide needs tiny text, redesign it
