# Project Deck Rubric

Scoring guide for evaluating and improving Slidev decks that present GitHub/Git open-source projects. For general visual quality scoring, see `DECK_RUBRIC.md`.

> This rubric extends DECK_RUBRIC.md with project-specific scoring criteria. For the authoritative rule definitions, see COMPILER_RULES.md (source material, through-line, visual evidence) and STYLE_PRESETS.md (project color override).

---

## Part 1: Content Rubric (11 axes, 1-5 each, max 55)

### 1. Motivation — "Why does this exist?"

The audience needs a reason to care before they see features.

| Score | Criteria |
|-------|----------|
| 1 | No motivation. Jumps straight to features or architecture. |
| 2 | Tagline or statement slide hints at purpose but doesn't develop it. |
| 3 | Clear problem statement or use case on a dedicated slide. |
| 4 | Problem framed as a tension or gap, audience can feel the need. |
| 5 | Origin story: what broke, what was missing, what moment sparked the project. |

**What good looks like:** Material (Keyboardia) opens with web audio war stories — you understand the pain before seeing the solution. Tufte opens with a mystery (wrong thumbnail dimensions) that pulls you in.

**What bad looks like:** Feature lists with no context for why anyone would build or use this.

### 2. Real Code

Showing actual code from the repo proves the project is real and reveals design decisions that prose can't capture.

| Score | Criteria |
|-------|----------|
| 1 | No code at all. |
| 2 | Pseudocode or install commands only. |
| 3 | One code snippet showing usage or API. |
| 4 | Code showing a real design decision or interesting implementation detail. |
| 5 | Before/after code (Magic Move), bug-and-fix pair, or code that advances the narrative. |

**What good looks like:** Tufte's Shiki Magic Move showing the DNG extraction before/after. Material's DO hibernation workaround with `v-mark` highlighting the critical constraint.

### 3. Quantitative Proof

Specific numbers make abstract claims concrete and memorable.

| Score | Criteria |
|-------|----------|
| 1 | No numbers, or only counts (e.g., "9 commands"). |
| 2 | One hero metric on a fact slide. |
| 3 | Multiple relevant metrics scattered through the deck. |
| 4 | Comparative metrics: before/after, cost/benefit, scale demonstrations. |
| 5 | Data visualizations (Sparklines, charts, SmallMultiples) that argue a point. |

**What good looks like:** Tufte's Sparkline showing 1200ms to 20ms. Material's "$0 server-side audio" juxtaposed with "64 instruments."

### 4. Design Insight

One memorable idea the audience takes home — a principle, framework, or constraint that shaped the project.

| Score | Criteria |
|-------|----------|
| 1 | No design insight articulated. |
| 2 | A vague design principle ("keep it simple"). |
| 3 | A specific design rule tied to the project ("read-only to sources"). |
| 4 | A framework or mental model ("three surfaces must align"). |
| 5 | A counterintuitive insight that reframes how the audience thinks about the problem domain. |

**What good looks like:** Material's "three surfaces must align" framework. Tufte's "debug at the source, not the display layer."

### 5. Storytelling

Does the deck have a narrative arc — tension, development, resolution — or is it a flat feature list?

| Score | Criteria |
|-------|----------|
| 1 | Flat feature list: features, architecture, metric, CTA. |
| 2 | Has a hook (statement/quote) but reverts to feature listing. |
| 3 | Organized around a theme or argument, not just features. |
| 4 | Clear narrative arc with tension and resolution across multiple slides. |
| 5 | A specific story (bug hunt, design evolution, build journey) that the audience follows from problem to payoff. |

### 6. Inspiration

Does the deck elevate beyond the technical? Does it make the audience want to build something?

| Score | Criteria |
|-------|----------|
| 1 | Purely functional. No emotional register. |
| 2 | One aspirational line (tagline or closing quote). |
| 3 | Design philosophy articulated with conviction. |
| 4 | Philosophical framing that connects the project to larger ideas. |
| 5 | The deck itself is an artifact of craft — the form reinforces the message. |

### 7. Education

Does the audience learn something transferable — not just what the project does, but how or why?

| Score | Criteria |
|-------|----------|
| 1 | Feature list only. No explanation of how anything works. |
| 2 | Architecture diagram showing high-level structure. |
| 3 | Architecture + implementation details that explain decisions. |
| 4 | Generalizable lessons or patterns the audience can apply elsewhere. |
| 5 | Teaching moments with code, data, and principles that work as standalone knowledge. |

### 8. Source Material Depth

Does the deck draw from real project documents — README, changelog, architecture docs, lessons learned — or is it assembled from surface impressions?

| Score | Criteria |
|-------|----------|
| 1 | No evidence of source material. Generic descriptions that could apply to any project. |
| 2 | README-level facts only — what the project does, how to install it. |
| 3 | README + one deeper source (architecture or changelog) informing specific slides. |
| 4 | Multiple sources digested — code examples, version history, architecture decisions visible in slides. |
| 5 | Full source material depth — lessons learned, specific bugs, evolution narrative, with citations traceable to documents. |

### 9. Through-Line Coherence

Does a single conceptual thread run through the deck, gaining meaning with each appearance?

| Score | Criteria |
|-------|----------|
| 1 | No through-line. Slides are independent units with no connecting thread. |
| 2 | Bookend syndrome — a phrase appears on cover and closing but nowhere in between. |
| 3 | Through-line present in 3 slides but doesn't evolve — same phrasing each time. |
| 4 | Through-line appears in 4-5 slides, each appearance adding new context or meaning. |
| 5 | Through-line woven through 6+ slides, each refraction deepening the audience's understanding. The resolution feels earned. |

### 10. Visual Evidence

Does the deck prove the project works with real screenshots, terminal output, or recorded demos?

| Score | Criteria |
|-------|----------|
| 1 | No visual evidence. The project could be vaporware for all the audience knows. |
| 2 | One screenshot, used decoratively (hero image on cover). |
| 3 | 1-2 screenshots placed contextually — they prove a specific claim. |
| 4 | Multiple visual evidence moments — screenshots, terminal output, or recordings that advance the narrative. |
| 5 | Visual evidence is integral to the story — before/after screenshots, live terminal output, or annotated UI showing the exact feature being discussed. |

### 11. Project-Sourced Design

Does the deck's visual identity come from the project itself — its brand colors, typography, UI patterns — rather than a generic preset?

| Score | Criteria |
|-------|----------|
| 1 | Generic preset colors with no connection to the project. |
| 2 | Accent color loosely inspired by the project but not extracted from it. |
| 3 | Project's primary brand color used as accent. Preset controls everything else. |
| 4 | Project colors override accent + bg/fg. Visual identity feels like the project, not the preset. |
| 5 | Full project-sourced design — colors, visual motifs, and layout choices reflect the project's own aesthetic. The deck could only belong to this project. |

---

## Part 2: Project Deck Archetypes

Three proven structures from high-scoring decks. Choose one as a starting framework.

### War Stories (Material pattern)

Problem, architecture, battle scars, results, lessons.

```
1. Cover
2. The problem (what broke, what was hard)
3. War story 1 — a specific battle with code
4. Architecture (how it works now)
5. War story 2 — production lesson with data
6. The framework / design insight
7. Results (metrics, comparison)
8. Lessons learned (transferable)
9. End
```

**Best for:** Multiplayer/real-time, distributed systems, production-hardened tools.

**Through-line type:** `concept` or `provocation` — a technical insight earned through battle.

**Why it works:** War stories create empathy. The audience sees their own struggles in yours. The lessons feel earned, not prescribed.

### Detective Story (Tufte pattern)

Mystery, false trails, evidence, resolution, lessons.

```
1. Cover (the mystery hook)
2. The mystery (what went wrong, specific symptoms)
3. False trail (what you tried first — with strike-throughs)
4. The evidence (code, data, the "aha" moment)
5. The data (visualized proof of the solution)
6. The rule (generalizable debugging principle)
7. Lessons learned (5 transferable insights)
8. Thesis (the big takeaway)
9. End
```

**Best for:** Debugging stories, performance optimization, data-intensive projects.

**Through-line type:** `question` or `design-rule` — the mystery's answer becomes a transferable principle.

**Why it works:** Mystery creates tension. False trails create identification ("I would have tried that too"). The resolution is satisfying because the audience earned it.

### Philosophical Reflection

Paradox, thesis, emergence, insight, silence.

```
1. Cover (minimal, evocative)
2. The paradox (X things. Zero Y.)
3. Constraints breed creativity (the thesis)
4. What it does (spare, essential only)
5. The flow (architecture as metaphor)
6. Emergence (the deeper meaning)
7. The simple solution (a transferable insight)
8. The word (one concept, marked)
9. Fact (the number that matters)
10. End (visual punctuation — enso, silence)
```

**Best for:** Minimalist tools, constraint-driven design, philosophical/aesthetic projects.

**Through-line type:** `metaphor` or `provocation` — a poetic image that does analytical work.

**Why it works:** Radical restraint makes every element significant. The form embodies the message.

---

## Part 3: Common Weak Pattern — The Feature Brochure

### Diagnosis

```
1. Cover
2. Statement/quote (generic tagline)
3. Features (bullet list)
4. Architecture (Mermaid diagram, no explanation)
5. More features (another bullet list)
6. Fact (a single count like "9 commands" or "500+ feeds")
7. End (install command)
```

**Symptoms:**
- No slide answers "why does this exist?"
- No code from the actual project
- Numbers are counts, not comparisons
- Every slide could be swapped with another project's deck
- Identical structure across 8+ decks
- No design insight, no lessons, no story
- No through-line — slides are independent units
- No visual evidence — the project could be vaporware
- Generic preset colors with no connection to the project
- Source material not digested — README facts repeated verbatim without synthesis

**Score:** Typically 12-28/75.

### Treatment

1. **Add a "why" slide** (slide 2) — What broke? What was missing? What moment sparked this? (+3-5 motivation, +2-3 storytelling)

2. **Add one real code moment** — A bug and its fix. A design decision in 15 lines. A before/after with Magic Move. (+3-5 real code, +1-2 education)

3. **Replace the fact slide with a comparison** — Not "62ms per photo" but "62ms vs 1200ms, 100K photos = 33 minutes vs 44 hours." (+2-3 quantitative, +2-3 visual interest)

4. **Add a design insight slide** — One specific principle that shaped this project. Not "keep it simple" but "read-only by design means zero risk of data corruption." (+2-3 design insight)

5. **Choose an archetype** — Pick War Stories, Detective Story, or Philosophical Reflection and restructure around it. (+3-5 storytelling)

6. **Add a through-line** — Pick a question, metaphor, or concept from the source material and thread it through 5+ slides. Each appearance should add new meaning. (+3-5 through-line coherence)

7. **Add visual evidence** — Screenshot the running project. Show terminal output, UI state, or real data. Prove it works. (+2-4 visual evidence)

8. **Extract project colors** — Use the project's brand colors for accent and bg/fg. The deck should look like it belongs to the project, not the preset. (+2-4 project-sourced design)

9. **Dig deeper into source material** — Read the LESSONS_LEARNED and ARCHITECTURE docs, not just the README. Find the surprising numbers, the bugs that taught something, the decisions that shaped the project. (+3-5 source material depth)

---

## Part 4: Project Deck Scoring Template

```
Deck: _______________
Project: _______________

CONTENT (max 55)
  Motivation:             _/5   Why does this project exist?
  Real Code:              _/5   Does it show actual project code?
  Quantitative:           _/5   Are claims backed by numbers?
  Design Insight:         _/5   Is there a memorable idea to take home?
  Storytelling:           _/5   Is there a narrative arc?
  Inspiration:            _/5   Does it elevate beyond the technical?
  Education:              _/5   Does the audience learn something transferable?
  Source Material Depth:  _/5   Are project docs digested, not just summarized?
  Through-Line Coherence: _/5   Does a thread run through 5+ slides?
  Visual Evidence:        _/5   Are there real screenshots/terminal output?
  Project-Sourced Design: _/5   Do colors come from the project?

VISUAL INTEREST (max 20, see DECK_RUBRIC.md)
  Transitions:      _/4   Semantic and consistent?
  Reveals:          _/4   Progressive disclosure, not info-dumps?
  Annotations:      _/4   v-mark, hover states, spotlight effects?
  Motion/Animation: _/4   v-motion, animated data, cursor effects?
  Layout Variety:   _/4   Alternating layouts, scoped styles, visual rhythm?

TOTAL:              _/75
```

### Grade Bands

| Score | Grade | Meaning |
|-------|-------|---------|
| 63-75 | A | Exceptional — could be a conference talk |
| 49-62 | B | Strong — clear narrative, good visual craft |
| 35-48 | C | Adequate — correct structure, missing depth or polish |
| 21-34 | D | Weak — feature brochure, minimal visual interest |
| < 21  | F | Placeholder — needs fundamental rethinking |
