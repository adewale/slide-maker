# Lessons Learned: Slide Maker

## 1. The styles/index.css discovery rule

**What happened:** Every deck in the monorepo (14 decks) had `styles/tokens.css` and `styles/theme.css` but no `styles/index.css`. Slidev only auto-loads `./style.css` or `./styles/index.css` as its global style entry point. Neither tokens nor theme styles were ever loaded into any build.

**Why it wasn't caught:** Decks that appeared to work (sumi-e, material) had custom Vue components (layouts, global layers) whose scoped `<style>` blocks referenced `var(--deck-*)` tokens or hardcoded colors inline. Fonts loaded via the headmatter `fonts:` config, which Slidev processes separately. So decks looked "close enough" without any global styles actually loading.

**The fix:** Create `styles/index.css` in every deck directory with `@import './tokens.css'; @import './theme.css';`. This is now documented in COMPILER_RULES.md as step 5b and enforced by `tools/deck-lint.mjs`.

**The lesson:** Read the framework's actual auto-discovery mechanism, not what you assume it does. Slidev's directory structure documentation is explicit: `styles/index.css` is the entry point. The existence of a `styles/` directory with CSS files in it does nothing on its own.

---

## 2. Silent failures require verification tooling

**What happened:** `build.sh` completed successfully for all 14 decks. No errors. No warnings. But the CSS was silently absent from every build. The only way to detect this was to grep the build output CSS for expected values.

**The lesson:** A successful build is not a successful product. Post-build verification (`tools/style-audit.mjs`, `tools/build-and-verify.sh`) catches the gap between "the build ran" and "the build produced correct output." This is especially important in monorepos where configuration errors compound silently across all projects.

---

## 3. Build verification before visual inspection

**What happened:** We built a Playwright comparison tool (`tools/compare-decks.mjs`) to take screenshots of the cloudflare deck, then spent multiple iterations fixing the comparison infrastructure (SPA server, slide detection, v-click advancement) before discovering the real problem was missing CSS. Hours of screenshot debugging for a problem that `grep '#f5f1eb' examples/_build/cloudflare/assets/*.css` would have caught in seconds.

**The lesson:** When a visual comparison shows unexpected results, verify the build artifacts first. Check that expected CSS values, class names, and tokens appear in the compiled output before inspecting screenshots. `tools/style-audit.mjs` exists to make this instant.

**The priority order:**
1. `tools/deck-lint.mjs` (structural validation before build)
2. `examples/build.sh` (build)
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
- **Layer 2: Build output** (`tools/style-audit.mjs`, `tools/build-and-verify.sh`) — tokens/selectors survive the build
- **Layer 3: Visual** (`tools/deck-preview.mjs`) — slides render correctly
- **Layer 4: Comparison** (`tools/deck-diff.mjs`) — visual regression between versions

Never skip to layer 4 without passing layers 1-3.

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

**What happened:** We built 14 decks, a transition library, animation components, a keyboard help panel, a presenter enhancement system, and a complete Cloudflare theme — all without any build verification tooling. The styles/index.css bug existed from the very first deck and was never caught.

**The lesson:** Invest in tooling early:
- `tools/new-deck.sh` before creating the second deck
- `tools/deck-lint.mjs` before the first build
- `tools/build-and-verify.sh` after the first build
- `tools/style-audit.mjs` after the first themed deck

The time spent building these tools is small compared to the time spent debugging a systemic issue across 14 projects.

---

## Tool inventory

| Tool | Purpose | When to run |
|------|---------|-------------|
| `tools/new-deck.sh <name> <preset>` | Scaffold a new deck from preset template | When creating a new deck |
| `tools/deck-lint.mjs [deck...]` | Validate structure, tokens, imports, overflow | Before building |
| `examples/build.sh` | Build all decks | After code changes |
| `tools/style-audit.mjs [deck...]` | Verify CSS tokens/selectors in build output | After building |
| `tools/build-and-verify.sh` | Full post-build smoke test (tokens, fonts, counts) | After building |
| `tools/deck-preview.mjs <deck>` | Screenshot all slides to contact sheet | For visual review |
| `tools/deck-diff.mjs --left A --right B` | Pixel-diff two screenshot sets | For visual regression |

### Recommended workflow

```
cd tools && bash new-deck.sh my-deck cloudflare   # scaffold
# ... edit examples/my-deck/slides.md ...
cd tools && node deck-lint.mjs ../examples/my-deck # validate structure
cd examples && bash build.sh                       # build all
cd tools && node style-audit.mjs my-deck           # verify CSS in build
cd tools && bash build-and-verify.sh               # full smoke test
cd tools && node deck-preview.mjs my-deck          # visual review
```
