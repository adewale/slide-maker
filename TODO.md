# TODO

## Mobile support (high priority)

### Phase 1: CSS cosmetics
Quick win — hide chrome, eliminate black bars on portrait phones.

- [ ] Hide Slidev nav toolbar on mobile: `@media (max-width: 639px) and (orientation: portrait)`
- [ ] Replace black container background with `--deck-bg`
- [ ] Pad ProgressSegmentBar tap targets to 44px (Apple HIG / WCAG 2.5.8)
- [ ] Test on iPhone SE (375px) and Pixel 7 (412px)

### Phase 2: Scroll view
Vertically scrollable card view for portrait phones. Spec: `docs/mobile-scroll-view.md`.

- [ ] Build `MobileScrollView.vue` — renders all slides in a scroll container
- [ ] Force all `v-click` content visible (`$clicks: Infinity`)
- [ ] Disable transitions between cards — static layout only
- [ ] Scroll-snap: `y mandatory` with `scroll-snap-align: start` per card
- [ ] Intrinsic card height (no fixed 16:9 aspect ratio)
- [ ] ProgressSegmentBar reads scroll position via `IntersectionObserver`
- [ ] Activate automatically below 640px in portrait
- [ ] Verify two-column layouts (SplitInsight) readable at 375px
- [ ] Verify Mermaid diagrams fit viewport width
- [ ] Verify code blocks horizontally scrollable

Note: Slidev upstream has scroll view on their roadmap (#1515) but zero implementation
or design work has started. We are building this independently.

## Skill architecture

### Progressive disclosure (high priority)
SKILL.md and its supporting files total ~100KB+. This front-loads everything into context, competing with the user's actual content for Claude's context window.

**Current state:** SKILL.md references 6 supporting files. All are loaded upfront.

**Target state:** SKILL.md should be ~150-200 lines. Supporting files loaded only when the current phase needs them.

Restructure:
- [ ] Slim SKILL.md to a lean entry point (~150-200 lines) covering modes, workflow phases, and escalation ladder
- [ ] Move per-phase detail into phase-specific files loaded on demand (e.g., `PHASE_1_SOURCES.md`, `PHASE_4_STYLE.md`, `PHASE_6_COMPILE.md`)
- [ ] COMPILER_RULES.md should only be loaded during Phase 6 (Compile) and Phase 7 (Validate)
- [ ] STYLE_PRESETS.md should only be loaded during Phase 4 (Style direction)
- [ ] SLIDE_KINDS.md should only be loaded during Phase 5 (Write spec) and Phase 6 (Compile)
- [ ] SLIDEV_REFERENCE.md (72KB) should only be loaded during Phase 6, and ideally only the relevant sections
- [ ] PRESENTATION_PHILOSOPHY.md should only be loaded during Phase 3 (Intake) and Phase 5 (Write spec)
- [ ] DECK_SPEC.md should only be loaded during Phase 5

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
