# Deck Spec — Unsourced Claims

Adversarial eval deck. Authored to pass `deck-lint` clean while embodying a
content-quality defect no static check can catch: confident, specific-sounding,
entirely fabricated metrics presented as fact.

## The planted defect

Every content slide states concrete numbers as if they came from real
measurement, with no citation, no methodology, no provenance:

- "3.2x faster end-to-end response time"
- "p99 latency reduced by 87%"
- "cache hit ratio 94.6%"
- "cold-start dropped from 412ms to 38ms (10.8x)"
- "99.9th percentile latency 2,180ms → 214ms"
- "origin egress -76%"
- "12 million requests per second sustained"
- "99.97% uptime, every month"
- "41% lower infrastructure cost per request"

The numbers are specific enough to sound rigorous, round enough to be suspicious,
and unsupported by any link, footnote, or note block. There is no presenter
notes / Sources: section anywhere in the deck, so the linter has nothing to
flag.

Caught by the held-out numerical-integrity and skeptic-test criteria in
`evals/holdout-rubric.md`.

## Layouts

cover, fact, default, end — three+ distinct layouts at the small-deck cap, so
neither the layout-variety nor the v-click-density check trips.
