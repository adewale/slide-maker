# Slide-Maker Skill Benchmark — Iteration 1

## Overall Results

| Configuration | Pass Rate | Time (s) | Tokens |
|---|---|---|---|
| **with_skill** | **1.000** +/- 0.000 | 256.2 +/- 109.6 | 66,584 +/- 20,050 |
| **without_skill** | **0.677** +/- 0.215 | 86.5 +/- 33.1 | 26,160 +/- 8,305 |
| **delta** | **+0.32** | +169.7 | +40,424 |

## Per-Eval Breakdown

### project-grounded-deck (8 assertions)

| Metric | with_skill | without_skill |
|---|---|---|
| Pass rate | 8/8 (100%) | 3/8 (37.5%) |
| Time (s) | 256.7 | 94.4 |
| Tokens | 77,615 | 29,803 |

**without_skill failures:** no deck.spec.md, no styles/tokens.css, no styles/index.css, wrong token location, hardcoded hex colors in slides.

### pitch-deck-brief (7 assertions)

| Metric | with_skill | without_skill |
|---|---|---|
| Pass rate | 7/7 (100%) | 6/7 (85.7%) |
| Time (s) | 390.2 | 122.5 |
| Tokens | 83,696 | 34,008 |

**without_skill failures:** no deck.spec.md.

### update-split-slide (5 assertions)

| Metric | with_skill | without_skill |
|---|---|---|
| Pass rate | 5/5 (100%) | 4/5 (80.0%) |
| Time (s) | 121.8 | 42.7 |
| Tokens | 38,442 | 14,670 |

**without_skill failures:** no deck.spec.md after slide split.

## Key Observations

1. **with_skill achieves 100% pass rate on every eval.** The skill encodes conventions (deck.spec.md, styles/ directory, token-based theming) that the base model does not infer on its own.

2. **The quality improvement costs ~2.5x tokens and ~3x wall-clock time.** The skill triggers a multi-step workflow (spec, then slides, then styles) rather than a single-shot generation.

3. **The dominant failure mode without the skill is missing deck.spec.md.** All three evals failed this assertion. The spec-first workflow is a skill-specific convention that vanilla Claude does not adopt.

4. **project-grounded-deck is the hardest eval for vanilla Claude.** It requires reading real project files, generating structured output in the correct directory layout, and avoiding hardcoded colors — the skill's structured workflow handles all of this.

5. **update-split-slide shows both configurations can handle the core editing task.** The only gap is maintaining the spec file alongside the slides, which is a bookkeeping step the skill enforces.
