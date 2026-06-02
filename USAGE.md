# slide-maker — usage examples

Real prompts the skill is built for, ordered roughly from simplest to most involved.

## Quickstart — short, ad-hoc decks

For these, the skill skips the spec dialogue and goes straight to compile.

> *"Make me 5 slides about why monorepos are hard."*

> *"Quick deck on the difference between WebSockets and Server-Sent Events, 7 slides, technical audience."*

> *"Draft a short talk on prompt caching — I'll polish the wording later."*

## Create — full structured deck

For these, the skill walks the full intake → spec → compile → validate flow with you.

> *"Create a 12-slide architecture talk for our internal eng all-hands about how our build system works. Audience is senior engineers. Use the cloudflare preset."*

> *"I need a 7-slide investor pitch for an API monitoring startup that catches breaking schema changes before they hit production. Tone: confident, dark editorial. No emoji. Source: the README in the current repo."*

## Project deck — grounded in a real codebase

The skill reads source material (README, ARCHITECTURE, LESSONS_LEARNED) and threads a through-line.

> *"Make a project deck for github.com/anthropics/claude-agent-sdk. War-story archetype, around 10 slides, dark palette, include real code and metrics, no generic claims."*

> *"Update the deck at examples/cloudflare/ to use the latest LESSONS_LEARNED and add a war-story slide about the Pyodide migration."*

## Update — surgical changes to an existing deck

> *"Update examples/demo/slides.md — slide 8 is too dense. Split it into two slides: one for transitions, one for guardrails."*

> *"Re-font the reference deck — it currently uses Inter as the display font, which is on the slop list."*

> *"The cover of examples/keyboardia is flash-banging into slide 2 on mobile. Fix it."*

## Quality gates the skill always runs before delivery

- `node tools/deck-lint.mjs <deck>` — structural validation (must be clean).
- Rendered gate (`node tools/render-gate.mjs <built-dist>` or `python tools/build-and-verify.py <dir>:<name> --rendered`) for decks with image, gradient, or per-slide backgrounds — catches flash-bang, real WCAG contrast, and overflow the static check can't see.
- Sub-agent grading against `evals/holdout-rubric.md` for a quality (not just structural) judgment — criteria deliberately *not* in the generation docs.

## What the skill will refuse

- Standalone HTML decks (use Slidev).
- PPTX export pipelines.
- AI-aesthetic clichés it has rules against: purple-gradient-on-dark, glassmorphism by default, identical card grids, generic preset Inter/Roboto unless the project's brand demands it.
