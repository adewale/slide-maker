# Deck Rubric — General Visual Quality

Scoring guide for evaluating and improving the visual quality and interest of any Slidev deck. For project-specific content scoring (motivation, real code, design insight), see `PROJECT_DECK_RUBRIC.md`.

> This rubric scores decks against rules defined in COMPILER_RULES.md, STYLE_PRESETS.md, and PRESENTATION_PHILOSOPHY.md. For the authoritative rule definitions, see those files. This rubric defines the scoring criteria only.

---

## Part 1: Visual Interest Heuristics

Visual features are not decoration. Each should serve the story. The test: "If I remove this effect, does the slide lose meaning or just lose sparkle?"

### Transitions

Slide-to-slide transitions set rhythm and signal structure.

| Practice | Why |
|----------|-----|
| Vary transitions by slide role | Section breaks feel different from content flow. A `slide-up` into a section divider signals "new chapter." A `fade` between content slides signals continuity. |
| Use `view-transition` for shared-element morphs | When a concept carries across slides (e.g., a diagram evolving), morph the shared element rather than cutting. |
| Match transition speed to content weight | Fast transitions (200ms) for rapid sequences. Slow transitions (600ms) for dramatic reveals. |
| Never use the same transition for every slide | Uniform transitions create monotony. The compiler rules already prohibit this. |

**Anti-pattern:** `transition: slide-left` in headmatter and nothing else. Every slide feels identical.

**Good example:** Component-showcase varies `fade`, `slide-up`, `slide-left`, and `view-transition` by section.

### Progressive Reveals (v-click)

Control when information appears to match the presenter's spoken rhythm.

| Practice | Why |
|----------|-----|
| Reveal bullet points one at a time | Prevents the audience from reading ahead. Each point gets its moment. |
| Reveal then highlight (`v-after` + `v-mark`) | Show the point, then mark the critical word for emphasis. |
| Use `v-click="[2, 4]"` ranges for coordinated reveals | Multiple elements appearing together (e.g., a label and its value) feel intentional. |
| Hide-then-show for before/after | `v-click.hide` on the "before" state, `v-click` on the "after" state creates transformation. |

**Anti-pattern:** Dumping 8 bullets on screen at once. The audience reads faster than you speak.

**Good example:** Material's war stories — each MDChip appears on click, building the weight of accumulated problems.

### Annotations (v-mark)

Highlight specific words or phrases to draw the eye to what matters.

| Practice | Why |
|----------|-----|
| `v-mark.underline.red` on the key constraint | Draws the eye to the single most important word in a dense slide. |
| `v-mark.circle` on a number or metric | Circles feel hand-drawn and spontaneous, like a presenter marking up their own slide. |
| `v-mark.highlight` for definitions or terms | Yellow-highlight effect for terms being introduced. |
| `v-mark.strike-through` for wrong approaches | Shows what you tried and rejected. Powerful for debugging narratives. |
| Delay marks with click timing | `v-mark.underline="3"` — the mark appears on click 3, synchronized with the spoken narrative. |

**Anti-pattern:** Marking everything. If every line is highlighted, nothing is.

**Good example:** Tufte's strike-throughs on wrong debugging steps — each crossed-out hypothesis builds tension toward the real answer.

### Motion (v-motion)

Animate elements to show relationships, growth, or transformation.

| Practice | Why |
|----------|-----|
| Animate position to show flow | An element sliding from left to center shows a journey or progression. |
| Animate scale to show importance | Growing from small to large signals "this matters more than you think." |
| Animate opacity for layered reveals | Fade in supporting context around a central element. |
| Use `:click-N` variants for multi-step choreography | Element moves to position A on click 1, position B on click 2 — tells a spatial story. |

**Anti-pattern:** Motion for decoration. Bouncing logos, spinning icons, wobbling text — motion without meaning.

**Good example:** Sumi-e's growth/emergence animation — an element physically grows to embody the concept of emergence.

### Hover States and Interactivity

Interactive elements reward exploration and make data tangible.

| Practice | Why |
|----------|-----|
| CSS `:hover` on metric cards | Hovering a card to see detail transforms passive viewing into active exploration. |
| Hover-to-reveal on comparison elements | In a two-column comparison, hovering one side dims the other — focuses attention. |
| Scale-on-hover for clickable elements | Subtle `transform: scale(1.02)` signals "this is interactive." |
| Tooltip-on-hover for data points | When showing metrics, hover reveals the context behind the number. |
| Hover color shifts for code blocks | Highlight the relevant line when the presenter hovers over it. |

**Implementation:** Use scoped `<style>` blocks with CSS `:hover` and `transition`. Keep transitions under 300ms for responsiveness.

```css
.metric-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.metric-card:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}
```

**Anti-pattern:** Hover effects on elements that aren't meaningful. Hover should reward curiosity, not distract.

### Cursor and Pointer Effects

The presenter's cursor is a storytelling tool — guide the audience's eye.

| Practice | Why |
|----------|-----|
| `cursor: pointer` on interactive elements | Signals "something happens here" when presenting. |
| Spotlight effect (dim surroundings on hover) | Hovering an element dims everything else — forces focus on what the presenter is pointing at. |
| Trail or glow on key navigation elements | Subtle glow on the element under cursor helps remote audiences track the presenter's focus. |
| Click-to-expand for dense content | A compact card that expands on click lets the presenter choose depth on the fly. |

**Implementation:** Spotlight effect using CSS siblings:

```css
.spotlight-group:hover .spotlight-item:not(:hover) {
  opacity: 0.3;
  filter: blur(1px);
  transition: all 0.3s ease;
}
.spotlight-item {
  transition: all 0.3s ease;
}
```

**Anti-pattern:** Custom cursor shapes, animated cursor trails, or pointer effects that fight the OS cursor. Let the system cursor do its job.

### Data Visualization Components

Present data as visual arguments, not just numbers.

| Practice | Why |
|----------|-----|
| Sparklines for trends | A 60px-tall inline chart shows direction without taking slide real estate. |
| Progress bars for completion/proportion | Visual proportion is grasped faster than percentages. |
| Small multiples for comparison | Multiple small charts side-by-side reveal patterns across categories. |
| Animated counters for hero metrics | A number counting up from 0 to its value on reveal is more dramatic than a static number. |
| Color-coded severity/status | Red/amber/green or gradient scales communicate priority without words. |

**Anti-pattern:** Complex charts with axes, legends, and labels that require study. Presentation charts should be glanceable.

### Scoped Styles for Slide Identity

Each slide can have its own visual character via scoped `<style>` blocks.

| Practice | Why |
|----------|-----|
| Unique accent color per section | Helps the audience unconsciously track where they are in the deck. |
| Background texture or gradient for key slides | Cover, section, and end slides benefit from visual distinction. |
| Typography scale shifts for emphasis slides | A fact slide with 7rem text feels different from a content slide with 1.1rem. |

**Anti-pattern:** Every slide having a unique scoped style. If every slide is special, none are. Reserve scoped styles for 3-5 key moments.

### Layout Variety

Alternating layouts prevents visual fatigue.

| Practice | Why |
|----------|-----|
| Never use `default` for more than 2 consecutive slides | Two defaults in a row is fine. Three signals monotony. |
| Use `two-cols` or `two-cols-header` for comparisons | Side-by-side layout communicates "these are parallel" faster than sequential bullets. |
| Use `center` or `statement` for thesis slides | Centering a single idea gives it weight. |
| Use `fact` for hero metrics | The oversized number treatment signals "this is the takeaway." |

---

## Part 2: Quick Scoring Template

Use this when evaluating any deck:

```
Deck: _______________

VISUAL INTEREST (max 20)
  Transitions:      _/4   Varied and purposeful?
  Reveals:          _/4   Progressive disclosure, not info-dumps?
  Annotations:      _/4   v-mark, hover states, spotlight effects?
  Motion/Animation: _/4   v-motion, animated data, cursor effects?
  Layout Variety:   _/4   Alternating layouts, scoped styles, visual rhythm?

CONTENT (optional, max 35 — use PROJECT_DECK_RUBRIC.md for project decks)
  Relevant Code:    _/5   Does it show code or demos appropriate to the topic?
  Storytelling:     _/5   Is there a narrative arc?
  Education:        _/5   Does the audience learn something transferable?
  (Other axes as appropriate for the deck type)

TOTAL:              _/20 (visual only) or _/55 (with content)
```

### Grade Bands (Visual Only, /20)

| Score | Grade | Meaning |
|-------|-------|---------|
| 17-20 | A | Exceptional visual craft |
| 13-16 | B | Strong — good variety and purposeful effects |
| 9-12  | C | Adequate — some variety, missing polish |
| 5-8   | D | Weak — monotonous, minimal interactivity |
| < 5   | F | Placeholder — needs fundamental rethinking |

---

## Part 3: Three Moves That Raise Any Deck by 5+ Points

1. **Vary transitions** — Set a global default, then override per-slide. Use `fade` for reflective moments, `slide-up` for reveals, `iris` for dramatic sections. Never let two consecutive slides share the same transition. (+2-3 transitions, +1 layout variety)

2. **Add one interactive element** — A hover-lift card, a spotlight group, or a hover-accent code block. Import from `styles/interactions.css` or write inline. (+2-3 annotations/hover)

3. **Add v-motion to one key moment** — The architecture diagram entrance, the hero metric reveal, the thesis statement emergence. One well-placed v-motion elevates the entire deck. (+2-3 motion/animation)
