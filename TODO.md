# TODO

## Mobile support (done)

### Phase 1: CSS cosmetics

- [x] Hide Slidev nav toolbar on mobile: `@media (max-width: 639px) and (orientation: portrait)`
- [x] Replace black container background with `--deck-bg`
- [x] Pad ProgressSegmentBar tap targets to 44px (Apple HIG / WCAG 2.5.8)
- [x] Test on iPhone SE (375px) and Pixel 7 (412px)

### Phase 2: Scroll view

- [x] Build `MobileScrollView.vue` — renders all slides in a scroll container
- [x] Force all `v-click` content visible (`$clicks: Infinity`)
- [x] Disable transitions between cards — static layout only
- [x] Scroll-snap: `y mandatory` with `scroll-snap-align: start` per card
- [x] Intrinsic card height (`100svh`, no fixed 16:9 aspect ratio)
- [x] ProgressSegmentBar reads scroll position via `IntersectionObserver`
- [x] Activate automatically below 640px in portrait
- [x] Mermaid diagrams fit viewport width (`max-width: 100%; height: auto`)
- [x] Code blocks horizontally scrollable (`overflow-x: auto`)
- [x] Propagated to all 7 generated decks (MobileScrollView, AudienceQRCode, global-top.vue, mobile CSS)

## Skill architecture

### Progressive disclosure (done)
SKILL.md is a lean 130-line entry point. Supporting files are loaded only when entering the relevant phase.

- [x] SKILL.md is ~130 lines with progressive loading table and per-phase `→ Load X now` markers
- [x] SOURCES.md extracted from COMPILER_RULES.md — loaded during Phase 2 (Gather sources) for project decks
- [x] ACCEPTANCE_CHECKLIST.md extracted from COMPILER_RULES.md — loaded during Phase 7 (Validate) only
- [x] COMPILER_RULES.md trimmed to ~700 lines (compilation core) — loaded during Phase 6 (Compile) only
- [x] STYLE_PRESETS.md loaded during Phase 4 (Style direction)
- [x] SLIDE_KINDS.md loaded during Phase 5 (Write spec) and Phase 6 (Compile)
- [x] SLIDEV_REFERENCE.md loaded during Phase 6 only
- [x] PRESENTATION_PHILOSOPHY.md loaded during Phase 3 (Intake)
- [x] DECK_SPEC.md loaded during Phase 5

### Viewport discipline (done)
- [x] Added `overflow: hidden` to `.slidev-layout` in all 9 deck `styles/index.css` files
- [x] Added viewport overflow as hard fail in ACCEPTANCE_CHECKLIST.md
- [x] Added overflow rule to COMPILER_RULES.md § 6b (styles entry point template)
- [ ] Add `clamp()` for typography in theme.css to handle edge cases

## Feature gaps

## Build and tooling

### Quickstart mode
- [ ] Add a `--quick` flag or mode that skips the spec phase for simple decks
- [ ] For a user who says "make me 10 slides about X", don't force them through deck.spec.md
- [ ] Still generate deck.spec.md, but do it silently/automatically

### Gallery improvements
- [x] Auto-generate `index.html` from deck metadata during `build.py` (title, description, accent, preset extracted per deck)
- [x] Add search/filter to the gallery page (filters by title, description, and preset)
- [ ] Add deck thumbnails to the gallery (screenshot of cover slide)

### CI/CD
- [x] GitHub Actions workflow for GitHub Pages (`.github/workflows/deploy.yml`)
- [ ] Fix GitHub Pages environment protection rules — `main` branch blocked from deploying
- [x] Cloudflare Workers deployment (`slides.oshineye.dev/`)

## Quality and testing

### Mobile screenshot testing
- [x] Playwright capture script for mobile viewports (iPhone SE, iPhone 14, Pixel 7)
- [x] Add landscape mobile viewport captures (iPhone SE landscape added to screenshot-audit.mjs)
- [x] Mobile viewports added to screenshot-audit.mjs: iPhone SE (375x667), Pixel 7 (412x915), iPhone SE landscape (667x375)
- [ ] Capture click states (slides with v-click animations at each step)

### Eval framework
- [x] Runner built: `tools/eval-runner.mjs` (`npm run eval`) — resolve output deck → grade → score → report (console + `--json`)
- [x] `evals/evals.json` assertions carry machine-runnable `assert` specs alongside the prose `check`; deterministic engine runs with zero deps
- [x] Judge scores semantic assertions + DECK_RUBRIC visual axes (/20) + slop tells + a held-out score. Judging is keyless via the sub-agent handoff only (the direct `@anthropic-ai/sdk` path was removed — no API key in the loop)
- [x] Generation hook: `--generate "<cmd>"` produces a missing deck before grading ({prompt}/{out}/{id}/{files} substitution)
- [x] Sub-agent judge handoff: `--emit-judge-tasks` / `--judge-results` so a dispatched grading sub-agent (no API key) can score decks
- [x] Create-eval fixtures committed under `evals/fixtures/{0,1}/` — evals 0 and 1 now grade end-to-end (7/7 each), not just the update eval
- [x] `countSlides` (and deck-lint's layout-variety scan) now follow `src:` page includes — reference-style decks count in full
- [ ] Fail CI on eval regressions (runner already exits non-zero on any failing assertion)

### Rendered-pixel audit (markdown vs pixels)
- [x] `tools/pixel-audit.mjs` — flash-bang detection from rendered screenshots (per-slide WCAG luminance), catching what the static deck-lint check can't see (images, gradients, theme cover/section backgrounds)
- [ ] Wire `pixel-audit` into the verify pipeline once a deck is rendered (consumes `screenshot-audit.mjs` output in `/tmp/slide-audit`)
- [ ] Extend pixel-audit to measure rendered text/background contrast, not just adjacent-slide luminance

### Acceptance checklist enforcement (done)
- [x] ACCEPTANCE_CHECKLIST.md is the canonical checklist (extracted from COMPILER_RULES.md)
- [x] deck-lint.mjs now auto-discovers generated-decks/ and runs 23 check groups
- [x] New automated checks: overflow:hidden, headmatter fields, emoji in content, spec-slides sync, through-line frequency, visual evidence, layout variety
- [x] SKILL.md Phase 7 instructs skill to run deck-lint before delivery
- [ ] Fail CI if any hard-fail items are violated

## Documentation

### README rewrite (done)
- [x] README rewritten to lead with user journey: install, create, preview, share
- [x] deploy-cf.py referenced as the one-command deploy path


### Skill marketplace metadata
- [ ] Add marketplace-compatible metadata (icon, category, tags, version)
- [ ] Write a compelling skill description for marketplace listings
- [ ] Add usage examples that show the skill in action

## Done

- [x] AudienceQRCode component — press Q to share slide URL as QR code
- [x] Keyboard help d-pad redesign — spatial layout distinguishing step vs slide navigation
- [x] QR shortcut added to keyboard help Screen column
- [x] Cross-platform build.sh — `sed -i.bak` replaces macOS-only `sed -i ''`
- [x] Cloudflare Workers deployment with SPA fallback
- [x] GitHub Actions workflow (build succeeds, deploy blocked by environment rules)
- [x] Mobile screenshot testing at 3 viewport sizes (33 screenshots across 11 slides)
- [x] Mobile scroll view spec written (`specs/mobile-scroll-view.md`)
- [x] EXTENSIONS.md — complete reference for all custom Slidev extensions
- [x] CHANGELOG.md — chronological project history
- [x] Slidev vs Reveal.js feature comparison
