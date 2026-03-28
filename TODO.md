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

### Viewport discipline (medium priority)
- [ ] Audit all decks for overflow: any slide that scrolls is a bug
- [ ] Add viewport overflow to the acceptance checklist as a hard fail
- [ ] Consider adding `overflow: hidden` to `.slidev-layout` in the universal scaffold
- [ ] Add `clamp()` for typography in theme.css to handle edge cases

## Feature gaps

## Build and tooling

### Quickstart mode
- [ ] Add a `--quick` flag or mode that skips the spec phase for simple decks
- [ ] For a user who says "make me 10 slides about X", don't force them through deck.spec.md
- [ ] Still generate deck.spec.md, but do it silently/automatically

### Gallery improvements
- [ ] Auto-generate `index.html` from deck metadata during `build.sh`
- [ ] Add deck thumbnails to the gallery (screenshot of cover slide)
- [ ] Add search/filter to the gallery page

### CI/CD
- [x] GitHub Actions workflow for GitHub Pages (`.github/workflows/deploy.yml`)
- [ ] Fix GitHub Pages environment protection rules — `main` branch blocked from deploying
- [x] Cloudflare Workers deployment (`slides.oshineye.dev/`)

## Quality and testing

### Mobile screenshot testing
- [x] Playwright capture script for mobile viewports (iPhone SE, iPhone 14, Pixel 7)
- [ ] Add landscape mobile viewport captures
- [ ] Capture click states (slides with v-click animations at each step)

### Eval framework
- [ ] Use the reference deck (`examples/reference/`) as the primary eval fixture
- [ ] Define pass/fail criteria for each feature the Skill claims to support
- [ ] Automate: generate a deck from a prompt → diff against expected structure → score

### Acceptance checklist enforcement
- [ ] Extract the 30+ item acceptance checklist from COMPILER_RULES.md into a machine-readable format
- [ ] Wire into deck-lint.mjs so it can be run automatically
- [ ] Fail CI if any hard-fail items are violated

## Documentation

### README rewrite (high priority)
Current README assumes the user is a developer who knows Slidev. Should lead with the primary userflow.

- [ ] Identify a complete user journey from creating decks to sharing


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
