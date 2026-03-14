# Learnings from frontend-slides

What we can adopt from [zarazhangrui/frontend-slides](https://github.com/zarazhangrui/frontend-slides) (~9,200 stars), adapted to our Slidev-native architecture.

## 1. Progressive disclosure in SKILL.md

**What they do:** SKILL.md is ~180 lines. It orchestrates 5 phases and references 4 supporting files by name in a resource table, each with a one-line purpose. The skill never duplicates supporting file content — it tells the AI *when* to consult each file ("use STYLE_PRESETS.md during Phase 2"). Supporting files are only loaded when the current phase needs them.

**What we do:** SKILL.md references 6 supporting files totaling ~100KB+. All are loaded upfront, competing with the user's content for context window space.

**Where to apply:**
- `slide-maker/SKILL.md` — slim to ~150-200 lines. Add a resource table with per-phase load triggers.
- `slide-maker/COMPILER_RULES.md` — load only during Phase 6 (Compile) and Phase 7 (Validate).
- `slide-maker/STYLE_PRESETS.md` — load only during Phase 4 (Style direction).
- `slide-maker/SLIDEV_REFERENCE.md` (72KB) — load only during Phase 6, and ideally only the relevant sections.
- `slide-maker/SLIDE_KINDS.md` — load during Phase 5 (Write spec) and Phase 6.
- `docs/PRESENTATION_PHILOSOPHY.md` — load during Phase 3 (Intake) and Phase 5.

## 2. "Show don't tell" style discovery

**What they do:** Phase 2 generates 3 distinct single-slide HTML previews for the user to choose from. Users *see* before committing. This sidesteps the vocabulary mismatch problem — users don't know design terminology.

**What we do:** Phase 4 offers "2 or 3 directions in words only." The user reads prose descriptions and picks one.

**Where to apply:**
- `slide-maker/SKILL.md` Phase 4 — instead of describing styles in prose, generate 3 mini-decks (3 slides each: cover, content, code) in candidate presets. Each preview should be a self-contained HTML file or a quick `slidev build` of a minimal deck.
- `slide-maker/STYLE_PRESETS.md` — add a "preview template" section with the 3 canonical slides used for style previews, using the user's actual title.

## 3. Non-negotiable invariants vs. soft guidelines

**What they do:** Hard constraints (viewport fit, no scrolling) are flagged as "non-negotiable invariants," separate from recommendations. This two-tier system prevents the AI from trading off hard constraints against soft preferences.

**What we do:** We mix hard rules and soft guidelines together in the same lists. The acceptance checklist has 30+ items but doesn't distinguish between hard-fail and nice-to-have.

**Where to apply:**
- `slide-maker/SKILL.md` "Non-negotiable rules" section — already exists but needs sharpening. Add viewport overflow as a hard fail.
- `slide-maker/COMPILER_RULES.md` acceptance checklist — split into two tiers: **MUST** (hard fail, blocks delivery) and **SHOULD** (quality issue, flag but don't block).
- Add explicit: "every slide MUST fit the viewport. No scrolling, ever. If content overflows, split the slide."

## 4. Explicit anti-pattern blocklists

**What they do:** They name *specific* things to avoid: exact hex values (`#6366f1`), exact font names (Inter, Roboto, Arial), exact layout habits (centered cards with purple gradients). They frame this as anti-"AI slop" — the aesthetic failure mode of LLM-generated designs.

**What we do:** We have an anti-patterns section but it's less specific. We ban emoji and stock phrases but don't name the specific AI-aesthetic failure modes.

**Where to apply:**
- `slide-maker/COMPILER_RULES.md` anti-patterns section — add a concrete blocklist of AI-slop patterns:
  - Specific hex values that scream "AI generated" (the purple-blue gradient family)
  - Specific font combinations that are overused in AI output
  - Specific layout patterns (centered hero with gradient background, card grid with rounded corners and shadows)
- `slide-maker/STYLE_PRESETS.md` — add a "DO NOT USE" section at the bottom with blocked fonts, colors, and patterns.

## 5. Content density caps per slide type

**What they do:** Exact limits per slide type: "4-6 bullets OR 2 paragraphs" for content slides, "max 8-10 lines" for code slides. Content exceeding limits must be split — no exception path.

**What we do:** We have overflow guards (7 bullets max, 8 code lines max, 60 char bullet max) but they're buried in the animation guidelines section of COMPILER_RULES.md, not attached to slide types.

**Where to apply:**
- `slide-maker/SLIDE_KINDS.md` — attach density limits directly to each of the 14 slide kinds. Each kind should declare its maximum content budget.
- `slide-maker/COMPILER_RULES.md` overflow guard section — promote to a top-level section, not a subsection of animation guidelines. Make it a hard fail in the acceptance checklist.

## 6. Feeling-first animation indexing

**What they do:** Their animation-patterns.md opens with an "Effect-to-Feeling Guide" table mapping emotional intent (dramatic, playful, calm, elegant) to specific animation techniques. You start by knowing the *feeling* you want, and the table tells you which animation to reach for.

**What we do:** Our transition grammar maps transitions to semantic meanings (progression, reflection, new chapter) which is good, but our animation guidelines are organized by *technique* (v-click, v-motion, Magic Move), not by *feeling*.

**Where to apply:**
- `slide-maker/COMPILER_RULES.md` animation guidelines — add a feeling-to-animation mapping table at the top, before the technique breakdowns.
- `slide-maker/STYLE_PRESETS.md` — each preset already has a motion character, but could benefit from a "feeling → recommended animations" quick lookup per preset.

## 7. Viewport fitting as a non-negotiable

**What they do:** `100vh`, `overflow:hidden`, `clamp()` for all typography. This is their single most rigid rule. Every slide fits the viewport. Period.

**What we do:** We rely on Slidev's default viewport handling and have overflow guards, but we don't enforce `overflow: hidden` at the layout level.

**Where to apply:**
- `slide-maker/styles/` (universal scaffold) — consider adding `overflow: hidden` to `.slidev-layout` in the base theme.
- `slide-maker/COMPILER_RULES.md` acceptance checklist — add "no slide overflows the viewport" as item #1 in the MUST tier.
- `slide-maker/COMPILER_RULES.md` — add `clamp()` guidance for typography edge cases in theme.css.

## 8. Mode detection at Phase 0

**What they do:** Phase 0 detects the user's mode (new presentation, PPT conversion, enhancement) before any other work. The same skill handles three workflows without three separate files.

**What we do:** Phase 1 is "determine mode" (new or update) but it's a single sentence with no branching logic. We explicitly list PPT conversion as unsupported.

**Where to apply:**
- `slide-maker/SKILL.md` Phase 1 — expand mode detection to be more like a router. Even if we don't support PPT conversion yet, the phase should explicitly detect what the user wants and redirect gracefully rather than just stating "unsupported."
- Future: when PPT/PDF conversion is added, Phase 1 becomes the branching point.

## 9. CSS gotchas and troubleshooting

**What they do:** STYLE_PRESETS.md includes a "CSS Gotchas" section documenting silent browser failures (e.g., `right: -clamp(...)` is silently ignored — the fix is `calc(-1 * clamp(...))`). animation-patterns.md ends with a 5-row troubleshooting table: problem → one-line fix.

**What we do:** We don't document common CSS pitfalls or Slidev-specific gotchas anywhere.

**Where to apply:**
- `slide-maker/COMPILER_RULES.md` — add a "Common pitfalls" section covering Slidev-specific CSS gotchas:
  - `styles/index.css` not importing all style files (tokens/theme don't load)
  - Scoped styles not reaching slot content in layouts
  - Mermaid theme defaults changing between versions
  - `v-click` not working inside certain layout slot boundaries
  - Font weights not loading when `weights` field is missing from headmatter
- `slide-maker/SLIDEV_REFERENCE.md` — add a troubleshooting section for common Slidev issues.

## 10. Constraint-driven design philosophy

**What they do:** Rather than relying on the AI's taste, they constrain it with exact density limits, explicit blocklists, non-negotiable viewport rules, and "abstract shapes only" guardrails. Good output comes from well-chosen constraints, not hoping the AI makes good choices.

**What we do:** We have constraints but they're distributed across 6 files and mixed with explanatory prose. The constraint density per paragraph is lower.

**Where to apply:**
- Across all skill files — audit every guideline and ask: "is this a constraint (MUST) or advice (SHOULD)?" Constraints should be terse, absolute, and grouped together. Advice can be prose.
- `slide-maker/SKILL.md` non-negotiable rules — expand this section to be the single source of truth for all hard constraints, not just the current 9 items.

## 11. Zero-dependency output option

**What they do:** Single self-contained HTML file. No npm, no build step, opens in any browser. Fonts from CDN, textures as inline SVG data URIs, animations as pure CSS. One constraint (zero-dependency) cascades into every technical decision.

**What we do:** We require the Slidev ecosystem (Node.js, npm, multiple dependencies). This is a higher barrier to entry.

**Where to apply:**
- `slide-maker/SKILL.md` Phase 8 (Deliver) — Option 7 (single-file HTML export) addresses this partially. Investigate post-build inlining.
- Long-term: consider a "lite mode" that generates a single HTML file for simple decks, similar to frontend-slides' output, using inline SVG data URIs for textures and CDN fonts.

## 12. Font pairing quick-reference

**What they do:** A scannable table at the bottom of STYLE_PRESETS.md listing all presets with their font pairings and sources. Optimized for the common case where you just need to know which fonts to load.

**What we do:** Font information is embedded within each preset's full specification. No quick-reference table.

**Where to apply:**
- `slide-maker/STYLE_PRESETS.md` — add a font pairing quick-reference table at the bottom. One row per preset: display font, body font, mono font, source (Google Fonts / local / CDN).

## 13. Signature elements as identity anchors

**What they do:** Each preset lists 3-4 "signature elements" — the distinctive visual features that make it recognizable (e.g., "halftone texture patterns," "binder hole decorations"). These prevent different presets from converging to the same look.

**What we do:** Our presets define palette, typography, motion, and interaction patterns, but don't explicitly call out the 3-4 distinctive visual features that make each preset unique.

**Where to apply:**
- `slide-maker/STYLE_PRESETS.md` — add a "signature elements" field to each preset. These should be the visual details that prevent preset convergence and give each deck a recognizable identity.

## Summary: priority order

| # | Learning | Impact | Effort |
|---|----------|--------|--------|
| 1 | Progressive disclosure | High — directly affects context window efficiency | Medium |
| 2 | Visual style preview | High — dramatically improves style selection UX | High |
| 3 | Invariants vs. guidelines | High — prevents AI from trading off hard constraints | Low |
| 4 | Anti-pattern blocklists | High — blocks the most common AI-aesthetic failures | Low |
| 5 | Density caps per slide type | Medium — makes overflow rules actionable | Low |
| 7 | Viewport non-negotiable | Medium — prevents the most visible quality failure | Low |
| 6 | Feeling-first animations | Medium — improves animation selection | Low |
| 10 | Constraint-driven design | Medium — systematic quality improvement | Medium |
| 13 | Signature elements | Medium — prevents preset convergence | Low |
| 12 | Font quick-reference | Low — convenience improvement | Low |
| 9 | CSS gotchas | Low — prevents debugging time | Low |
| 8 | Mode detection | Low — we already handle this simply | Low |
| 11 | Zero-dependency output | Low — architectural shift, long-term | High |
