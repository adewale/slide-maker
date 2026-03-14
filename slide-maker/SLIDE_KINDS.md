# slide kinds

These are the canonical slide kinds for `slidev-project-studio`.
Use the smallest set that covers the deck cleanly.

## Decision rule

For each slide kind, prefer:
1. plain Markdown
2. built-in Slidev layout
3. one local custom layout
4. one local custom component
5. inline HTML

Do not skip levels without a real reason.
Do not invent a new kind for a one-off slide.

See COMPILER_RULES.md § 3 ("Decide implementation level per slide") for the full escalation rules.

## Kinds

### cover
Use for opening slides.
Default target: built-in `cover`.
Density limit: title + subtitle only.
Escalate only for a recurring branded hero treatment.

### section
Use for chapter breaks.
Default target: built-in `section`.
Density limit: section title + optional subtitle.
Escalate only for a recurring bespoke divider.

### default-content
Use for standard explanatory slides.
Default target: Markdown with `default`.
Density limit: max 7 bullets, 60 chars each.
Escalate only when a structure repeats.

### center-statement
Use for punchy single-idea slides.
Default target: built-in `center`.
Density limit: 1-2 sentences max.

### fact
Use for one primary metric or proof point.
Default target: built-in `fact`.
Density limit: 1 number + 1 context line.
Escalate when the deck has a repeated stat system.

### end
Use for closing slides.
Default target: built-in `end`.
Density limit: title + subtitle only.

### split-insight
Use for left/right reasoning, explanation plus proof, or a narrative split.
Default target: one local custom layout if repeated.
Density limit: max 5 bullets per column.

### metrics-grid
Use for a small set of comparable metrics.
Default target: one local layout plus a reusable card component if needed.
Density limit: 1 number + 1 context line per metric.

### image-caption
Use for one dominant image plus short text.
Default target: Markdown or one local layout.
Density limit: 1 image + optional caption.

### quote-pull
Use for testimonials, principles, or sharp external quotes.
Default target: built-in quote treatment if the project has one, otherwise one local layout only if repeated.
Density limit: 1 quote + attribution.

### comparison
Use for before/after or option-vs-option slides.
Default target: Markdown or one local layout if the shell repeats.
Density limit: max 5 bullets per column.

### timeline
Use for phased plans or a simple roadmap.
Default target: Markdown list first, local layout only when the visual timeline materially helps.
Density limit: max 7 bullets, 60 chars each.

### visual-evidence
Use for real project screenshots or terminal output that prove the project works.
Default target: built-in `image-right` or `image-left`.
Density limit: 1 image + optional caption.
Required: `image`, `alt`. Never use placeholders — only real screenshots from the running project.
Escalate only for a recurring screenshot treatment with consistent framing.

### through-line-echo
Use to resurface the deck's through-line mid-deck.
Default target: built-in `section` or `center`.
Density limit: 1-2 sentences max.
Max 2-3 per deck. The through-line should gain new meaning each time it appears — never repeat the exact same phrasing.
Escalate only if the through-line requires a unique visual treatment.

## Density guardrails

- one idea per slide
- 3 to 5 bullets is normal
- one strong stat beats six weak ones
- if the slide needs tiny text, redesign it
