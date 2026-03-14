# TODO

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

### Visual style preview (high priority)
Users currently choose styles from prose descriptions. frontend-slides generates 3 visual HTML previews so users *see* before committing.

- [ ] Design a style preview mechanism — generate 3 mini-decks (3 slides each: cover, content, code) in candidate presets
- [ ] Each preview should be a self-contained HTML file the user can open in a browser
- [ ] The preview should use the user's actual title and a representative content slide, not generic lorem ipsum
- [ ] Integrate into Phase 4 (Style direction): instead of describing styles in words, show them

### Viewport discipline (medium priority)
frontend-slides treats viewport fitting as non-negotiable — `100vh`, `overflow:hidden`, `clamp()` everywhere. We rely on Slidev's defaults which are good but not as strict.

- [ ] Audit all decks for overflow: any slide that scrolls is a bug
- [ ] Add viewport overflow to the acceptance checklist as a hard fail
- [ ] Consider adding `overflow: hidden` to `.slidev-layout` in the universal scaffold
- [ ] Add `clamp()` for typography in theme.css to handle edge cases

## Feature gaps

### PPT/PPTX conversion (medium priority)
Many corporate environments require PowerPoint. frontend-slides has a Python HTML→PPTX converter.

- [ ] Investigate `slidev export --format pptx` (if supported in v52+)
- [ ] If not native, investigate post-build conversion (e.g., `pdf2pptx`, `libreoffice --convert-to pptx`)
- [ ] Alternative: document a manual path using PDF export + Google Slides import
- [ ] Add to Phase 8 (Deliver) as an option

### Single-file HTML export (low priority)
frontend-slides outputs a single self-contained HTML file — zero dependencies, opens in any browser. We require npm + Slidev.

- [ ] Investigate post-build inlining of all assets into a single HTML file
- [ ] Could be a "lite mode" for simple decks that don't need Slidev's full power
- [ ] Or a post-processing step: `slidev build` → inline → single `.html`

### More style presets (low priority)
We have 7 presets, frontend-slides has 12 (4 dark, 4 light, 4 specialty).

- [ ] Add 3-5 more presets to reach parity
- [ ] Specifically: add at least 2 light-mode presets (we currently skew dark)
- [ ] Consider specialty presets: terminal/hacker, academic/paper, startup-pitch

## Build and tooling

### Quickstart mode
- [ ] Add a `--quick` flag or mode that skips the spec phase for simple decks
- [ ] For a user who says "make me 10 slides about X", don't force them through deck.spec.md
- [ ] Still generate deck.spec.md, but do it silently/automatically

### Gallery improvements
- [ ] Auto-generate `index.html` from deck metadata during `build.sh` (currently hand-maintained)
- [ ] Add deck thumbnails to the gallery (screenshot of cover slide)
- [ ] Add search/filter to the gallery page

### CI/CD templates
- [ ] GitHub Actions workflow for auto-building and deploying to GitHub Pages
- [ ] Cloudflare Pages integration template
- [ ] Netlify build plugin or `netlify.toml` template

## Quality and testing

### Eval framework
- [ ] Use the reference deck (`examples/reference/`) as the primary eval fixture
- [ ] Define pass/fail criteria for each feature the Skill claims to support
- [ ] Automate: generate a deck from a prompt → diff against expected structure → score

### Acceptance checklist enforcement
- [ ] Extract the 30+ item acceptance checklist from COMPILER_RULES.md into a machine-readable format
- [ ] Wire into deck-lint.mjs so it can be run automatically
- [ ] Fail CI if any hard-fail items are violated

## Documentation

### Example gallery with live previews
- [ ] Deploy all example decks to a public URL
- [ ] Add screenshots or live preview links to the README
- [ ] Show before/after of style presets applied to the same content

### Skill marketplace metadata
- [ ] Add marketplace-compatible metadata (icon, category, tags, version)
- [ ] Write a compelling skill description for marketplace listings
- [ ] Add usage examples that show the skill in action
