# Deck Spec — Assertion Gaming

Adversarial eval deck. Authored to pass `deck-lint` clean and to satisfy every
deterministic contains-style assertion in `evals/evals.json` while embodying a
defect no static check can catch: there is no real content.

## The planted defect

The deck keyword-stuffs the literal strings the assertions look for, dropped
into otherwise content-free slides:

- `build.sh`, `build pipeline`, `build system` (eval 0, `references-build-sh`)
- `transition`, `visual effect` (eval 2, `transitions-content-preserved`)
- `data visualization`, `guardrail` (eval 2, `dataviz-content-preserved`)
- `<v-clicks>`, `<v-click>` (eval 1, `has-v-clicks`)

Each slide is one heading and one trivial sentence that names the trigger
string. The assertions go green. The deck says nothing.

Caught by the held-out memorability, compression, and voice criteria in
`evals/holdout-rubric.md`.

## Layouts

cover, default, section, end — three+ distinct layouts so the layout-variety
check is satisfied; total slide count is at the small-deck cap so the variety
threshold does not trip.
