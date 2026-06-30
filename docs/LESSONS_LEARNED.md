# Lessons Learned: Slide Maker

## 1. The styles/index.css discovery rule

**What happened:** Every deck in the monorepo (10 decks at the time) had `styles/tokens.css` and `styles/theme.css` but no `styles/index.css`. Slidev only auto-loads `./style.css` or `./styles/index.css` as its global style entry point. Neither tokens nor theme styles were ever loaded into any build.

**Why it wasn't caught:** Decks that appeared to work (sumi-e, material) had custom Vue components (layouts, global layers) whose scoped `<style>` blocks referenced `var(--deck-*)` tokens or hardcoded colors inline. Fonts loaded via the headmatter `fonts:` config, which Slidev processes separately. So decks looked "close enough" without any global styles actually loading.

**The fix:** Create `styles/index.css` in every deck directory with `@import './tokens.css'; @import './theme.css';`. This is now documented in COMPILER_RULES.md as step 6b and enforced by `tools/deck-lint.mjs`.

**The lesson:** Read the framework's actual auto-discovery mechanism, not what you assume it does. Slidev's directory structure documentation is explicit: `styles/index.css` is the entry point. The existence of a `styles/` directory with CSS files in it does nothing on its own.

---

## 2. Silent failures require verification tooling

**What happened:** `build.sh` completed successfully for all 10 decks. No errors. No warnings. But the CSS was silently absent from every build. The only way to detect this was to grep the build output CSS for expected values.

**The lesson:** A successful build is not a successful product. Post-build verification (`tools/style-audit.mjs`, `tools/build-and-verify.sh`) catches the gap between "the build ran" and "the build produced correct output." This is especially important in monorepos where configuration errors compound silently across all projects.

---

## 3. Build verification before visual inspection

**What happened:** We built a Playwright comparison tool (`tools/compare-decks.mjs`) to take screenshots of the cloudflare deck, then spent multiple iterations fixing the comparison infrastructure (SPA server, slide detection, v-click advancement) before discovering the real problem was missing CSS. Hours of screenshot debugging for a problem that `grep '#f5f1eb' examples/_build/cloudflare/assets/*.css` would have caught in seconds.

**The lesson:** When a visual comparison shows unexpected results, verify the build artifacts first. Check that expected CSS values, class names, and tokens appear in the compiled output before inspecting screenshots. `tools/style-audit.mjs` exists to make this instant.

**The priority order:**
1. `tools/deck-lint.mjs` (structural validation before build)
2. `npm run build` (`tools/build.py`) (build)
3. `tools/style-audit.mjs` + `tools/build-and-verify.sh` (verify build output)
4. `tools/deck-preview.mjs` (visual inspection)
5. `tools/deck-diff.mjs` (visual regression comparison)

---

## 4. SPA routing breaks naive static servers

**What happened:** We used `python3 -m http.server` and `npx serve` to serve the Slidev build, but Slidev is a Vue SPA with client-side routing. URLs like `/cloudflare/3` need to serve `/cloudflare/index.html`, not return 404.

**The lesson:** When serving SPA builds for testing, always use a server that falls back to `index.html` for routes without file extensions. `tools/deck-preview.mjs` has this built in. For ad-hoc serving, `npx serve examples/_build --single` works but needs the `--single` flag.

---

## 5. Scaffolding prevents configuration drift

**What happened:** The cloudflare deck was hand-created and used `theme: default` while sumi-e used `theme: seriph`. Both were missing `styles/index.css`. These subtle differences were invisible until build time (or later).

**The lesson:** `tools/new-deck.sh` now generates every required file from a known-good template for each preset. This eliminates configuration drift between decks and ensures structural parity. When you find yourself creating the third instance of a pattern, automate it.

---

## 6. Comparison tooling needs layered checks

**What happened:** The visual comparison between the reference Cloudflare deck and our local build was initially invalid because our deck had no styles. We burned effort on the comparison tool itself (fixing slide detection, SPA routing, v-click advancement) when the comparison input was fundamentally broken.

**The lesson:** Layer your verification:
- **Layer 1: Structure** (`tools/deck-lint.mjs`) — files exist, imports are correct
- **Layer 2: Build output** (`tools/style-audit.mjs`, `tools/build-and-verify.py`) — tokens/selectors survive the build
- **Layer 3: Rendered measurement** (`tools/render-gate.mjs`, `tools/pixel-audit.mjs`) — flash-bang, real contrast, overflow from actual pixels (Layers 1–2 read source; this reads the artifact)
- **Layer 4: Visual** (`tools/deck-preview.mjs`) — slides render correctly
- **Layer 5: Comparison** (`tools/deck-diff.mjs`) — visual regression between versions

Never skip to layer 5 without passing layers 1-3.

---

## 7. Framework auto-discovery is not magic

**What happened:** We assumed Slidev would find and import any `.css` file in a `styles/` directory. In reality, Slidev looks for exactly one entry point (`styles/index.css` or `style.css`) and that file must explicitly `@import` everything else.

Similarly, Slidev auto-discovers:
- `components/*.vue` (yes, auto-imported)
- `layouts/*.vue` (yes, auto-registered)
- `global-top.vue`, `global-bottom.vue` (yes)
- `setup/*.ts` (yes)
- `styles/index.css` (yes, ONE entry point)
- `styles/theme.css` (NO — only if imported by index.css)
- `styles/tokens.css` (NO — only if imported by index.css)

**The lesson:** Document and verify what the framework actually auto-discovers vs what it ignores. The SLIDEV_REFERENCE.md had the answer all along at line 1678: "Place in `./style.css` or `./styles/index.css`."

---

## 8. Build tools should be built before features

**What happened:** We built 10 decks, a transition library, animation components, a keyboard help panel, a presenter enhancement system, and a complete Cloudflare theme — all without any build verification tooling. The styles/index.css bug existed from the very first deck and was never caught.

**The lesson:** Invest in tooling early:
- `tools/new-deck.sh` before creating the second deck
- `tools/deck-lint.mjs` before the first build
- `tools/build-and-verify.sh` after the first build
- `tools/style-audit.mjs` after the first themed deck

The time spent building these tools is small compared to the time spent debugging a systemic issue across 11 projects.

---

## 9. Evals measure what's easy, not what matters (markdown vs pixels)

**What happened:** The flash-bang and contrast checks in `deck-lint.mjs` read Markdown and CSS tokens. They pass cleanly on a deck whose cover is a near-black background *image* over a light `--deck-bg` — the audience still gets flash-banged, but the static check only sees flat colors and reports no jump. An adversarial deck (`evals/adversarial/image-flashbang`) confirmed the blind spot: it passes `deck-lint` clean.

**The lesson:** Measure the artifact the audience experiences (rendered pixels), not its source (Markdown). `tools/pixel-audit.mjs` computes per-slide luminance from screenshots and catches what the static check structurally cannot. A static gate is necessary but never sufficient — pair it with a rendered gate.

---

## 10. A passing checklist is not a good deck (Goodhart / held-out criteria)

**What happened:** The judge grades decks against the same rubric files (`DECK_RUBRIC.md`, `LLM_TELLS.md`) that drive generation. That measures how well the generator satisfied the *known* axes, not whether the deck is good. A graded run scored the demo deck 17/20 on the public visual rubric but only 7/10 on held-out criteria — because the assigned task (splitting a dense slide) was never actually performed. High polish masked undone work.

**The lesson:** When the metric is also the target, it stops measuring (Goodhart). Keep a held-out rubric (`evals/holdout-rubric.md`) the generator never loads — memorability, the skeptic test, numerical integrity, earned endings — and flag decks where the public score is high but the held-out score is low. The divergence is the signal.

---

## 11. Static checks need adversarial probes (self-evolving evals)

**What happened:** The eval suite only tested failure modes we had already imagined. `tools/adversarial.mjs` flips that: sub-agents author decks *designed* to pass the gate while embodying a real defect. Two of two slipped (`image-flashbang`, `sanctioned-font-slop`) — each a genuine blind spot we hadn't encoded.

**The lesson:** A frozen checklist tests last year's failures. Let a model probe the gate; every "false pass" is either a check to harden or a case to canonicalize into `evals.json`. Keep the slipped decks as regression fixtures so a future hardening can prove it now catches them.

---

## 12. Track the distribution over time, not the latest number

**What happened:** A single run reports "17/18 passed." That number can stay flat while the *character* of the scores shifts — e.g. every deck suddenly acing one axis, or visual scores converging to identical values (a gaming tell).

**The lesson:** `--record` appends each run to `evals/history.jsonl`; `--trend` reports drift in pass-rate, mean visual, mean held-out, and slop totals, and flags large moves, Goodhart gaps, and variance collapse. Watch the series, not the snapshot.

---

## 13. Keyless beats keyed inside an agent loop

**What happened:** The judge was first built as a direct Anthropic SDK call needing `ANTHROPIC_API_KEY`. It could never run in the sandbox (no key) and added a dependency and a secret. The sub-agent handoff (`--emit-judge-tasks` → dispatch grading sub-agents → `--judge-results`) does the same grading by reusing the orchestrating agent's own model access — no key, no SDK, runs anywhere. We removed the SDK path entirely.

**The lesson:** When the orchestrating agent already has a capability, hand the work to a sub-agent instead of re-authenticating from a standalone script. Fewer secrets, fewer dependencies, and it works in environments where a raw API key is unavailable.

---

## 14. Distinguish a wrong check from a wrong artifact

**What happened:** Four lint warnings looked alike but had opposite fixes. "Mermaid block counted as a 19-line code overflow" and "reference deck has only 2 layouts" were *linter bugs* — the diagram is fine and the layouts live in `src:`-included pages the scan didn't follow; the fix was in `deck-lint.mjs`. But "accent fails 4.5:1 body contrast" and "Inter as the display font" were *real artifact defects*; the fix was in the deck.

**The lesson:** Before silencing a warning, ask whether the check is wrong or the artifact is. Fix false positives in the rule (and add the missing capability, e.g. following includes); fix true positives in the deck. Never weaken a check just to make a real defect disappear.

---

## 15. Test the gate from both sides — precision, not just recall

**What happened:** We had adversarial decks proving the gate *misses* real defects (recall holes), but nothing proving the gate doesn't *invent* defects on good decks (precision). The mermaid-overflow and src-include false positives slipped in precisely because no test asserted "these known-good decks must lint clean."

**The lesson:** `tools/gate-check.mjs` is two-sided. The **should-pass** set (gallery + fixtures) must lint clean — any new warning is a false-positive regression. The **should-catch** set (adversarial) must be caught by *some* gate — static, rendered, or judge. A gate validated in only one direction drifts: too loose (misses defects) or too tight (flags good work). Test both, and fail CI on either.

---

## 16. Meta-signals belong on every gate, not just the evals

**What happened:** We added run-over-run trend tracking to the eval runner (Lesson 12), then realized the static gate has the same blind spot — a rule change can quietly add warnings across the whole gallery and a single green run hides it.

**The lesson:** Any gate that produces a score or a count deserves a longitudinal log. `gate-check.mjs --record/--trend` tracks gallery-wide warning counts over time the same way `eval-runner --trend` tracks eval scores. When you build a meta-signal once, look for every other place the same drift can hide.

---

## 17. Wire the new gate into the pipeline, don't leave it as a loose tool

**What happened:** `pixel-audit.mjs` existed for two sessions as a tool you had to remember to run — so it never ran. The rendered checks only became real once `render-gate.mjs` was wired into `build-and-verify.py --rendered` as a named stage with a pass/fail contribution.

**The lesson:** A check that isn't in the pipeline is documentation, not enforcement. When you build a verifier, give it a home in an existing runner (a flag, a stage, a CI step) — otherwise it decays to a tool nobody invokes. Keep it opt-in if it's slow (the rendered gate needs a browser), but make invoking it one flag, not a remembered ritual.

---

## 18. After a Slidev bump, page through a deck in a browser — the version number won't warn you

**What happened:** Bumping Slidev 52.14.1 → 52.16.0 looked safe: same major, caret range, all decks lint-clean, demo built fine. But 52.16.0 shipped a navigation regression (slidevjs/slidev#2562) — `getSlidePath` double-prefixes `BASE_URL`, so on a subdirectory deploy (GitHub Pages, base `/slide-maker/slide-maker/`) paging to the next slide produced `#/slide-maker/slide-maker/2`, then navigation jammed and reloads 404'd. `deck-lint`, `style-audit`, and a static build all passed it; only *clicking through the deck in a real browser* exposed it. We pinned to 52.15.2 (last good release that still has the native laser + security fixes).

**The lesson:** "Same major version = safe" is a hope, not a guarantee — a minor bump can break routing without tripping any structural check. The only thing that caught this was a headless page-through: load a subdirectory-based deck, press Right a few times, assert the hash route is `#/N` (not `#/<base>/N`), then reload a deep link and confirm it resolves. Make that the smoke test after *any* Slidev bump, before deploying. When you pin around an upstream bug, record the cause/fix issue numbers and the un-pin trigger (here: slidevjs/slidev#2630) so the freeze is removable, not mysterious.

---

## 19. Reference docs drift from the tree — audit prose against `git ls-files`, not memory

**What happened:** A four-way consistency audit found that the prose docs had silently fallen out of sync with the code in ways no test caught: `EXTENSIONS.md` listed three progress components (ProgressDotRail/TallyMarks/ArcGauge) as shipping after they'd been removed; pointed at a renamed workflow (`deploy.yml` → `deploy-pages.yml`); cited a Cloudflare host (`slides.oshineye.dev`) that no longer resolves; and called the project's ~25 tools "four." `SLIDEV_REFERENCE.md` advertised a `v52.13+` floor below the `52.15` the project actually requires. `LESSONS_LEARNED` itself recommended a build command and scaffold paths (`examples/my-deck`) that don't match where `new-deck` writes (`decks/`). Each change (remove a component, rename a workflow, switch hosts) updated the code and *one* doc, never all of them.

**The lesson:** Prose has no compiler, so it rots wherever a change touches code + one doc but not the others. Two defenses: (1) when you remove/rename a component, script, workflow, URL, or version floor, grep the whole repo for the old name in the same change — the tree is the source of truth, so verify claims with `git ls-files`/`grep`, not memory; (2) distinguish **present-tense reference docs** (must match the tree now — fix them) from **dated CHANGELOG entries** (historical record — leave them). A periodic audit that diffs documented inventories (components, tools, deck count, hosts, version floors) against the actual tree catches the drift that no unit test will.

---

## Tool inventory

| Tool | Purpose | When to run |
|------|---------|-------------|
| `tools/new-deck.sh <name> <preset>` | Scaffold a new deck from preset template | When creating a new deck |
| `tools/deck-lint.mjs [deck...]` | Validate structure, tokens, imports, overflow | Before building |
| `npm run build` (`tools/build.py`) | Build all decks | After code changes |
| `tools/style-audit.mjs [deck...]` | Verify CSS tokens/selectors in build output | After building |
| `tools/build-and-verify.sh` | Full post-build smoke test (tokens, fonts, counts) | After building |
| `tools/deck-preview.mjs <deck>` | Screenshot all slides to contact sheet | For visual review |
| `tools/deck-diff.mjs --left A --right B` | Pixel-diff two screenshot sets | For visual regression |
| `tools/compare-decks.mjs` | Screenshot a reference URL and local build side-by-side, generate HTML comparison report | For comparing local deck against a live reference |
| `tools/eval-runner.mjs` | Grade decks against `evals/evals.json` — deterministic assertions + sub-agent judge (visual rubric, slop, held-out score) | After generating or updating a deck |
| `tools/eval-runner.mjs --record / --trend` | Append a run to `evals/history.jsonl`; report score drift and meta-signals over time | Each eval run / when checking for regressions |
| `tools/pixel-audit.mjs <dir>` | Flash-bang detection from rendered screenshots (per-slide luminance) — the rendered counterpart to deck-lint | After screenshotting (`screenshot-audit.mjs`) |
| `tools/render-gate.mjs <dist>` | Rendered gate: serves a built deck, drives a browser, checks flash-bang + real WCAG contrast + overflow from pixels/DOM | After building; or via `build-and-verify.py --rendered` |
| `tools/gate-check.mjs [--record/--trend]` | Two-sided gate: should-pass decks lint clean (precision) + adversarial defects all covered (recall); trends gallery warnings | When changing any check; in CI |
| `tools/adversarial.mjs --emit / --screen` | Author decks that try to slip the gate; screen them and report false passes (blind spots) | When hardening the eval gate |

### Recommended workflow

```
bash tools/new-deck.sh my-deck cloudflare          # scaffold into decks/my-deck
# ... edit decks/my-deck/slides.md ...
node tools/deck-lint.mjs decks/my-deck             # validate structure
npm run build                                       # build all (python3 tools/build.py)
node tools/style-audit.mjs my-deck                 # verify CSS in build
cd tools && bash build-and-verify.sh               # full smoke test
node tools/deck-preview.mjs my-deck                # visual review
```
