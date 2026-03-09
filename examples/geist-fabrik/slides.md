---
theme: seriph
title: Geist Fabrik
colorSchema: dark
transition: fade
layout: cover
fonts:
  sans: Playfair Display
  serif: Source Sans 3
  mono: JetBrains Mono
  weights: '300,400,600,700,900'
  italic: true
---

# Geist Fabrik

A well-asked question is better than a poorly-computed answer.

github.com/adewale/geist\_fabrik

<!-- GeistFabrik (German for "spirit factory") is a Python-based divergence engine for Obsidian vaults. It generates creative suggestions through 57 geists — specialized reasoning patterns that act as muses, not oracles. The through-line: "A well-asked question is better than a poorly-computed answer" — this provocation threads through the entire deck, gaining meaning as we see algorithmic failure and question-based success.

Sources:
- https://github.com/adewale/geist_fabrik/blob/main/README.md — project overview and philosophy
- https://github.com/adewale/geist_fabrik/blob/main/specs/geistfabrik_vision.md — vision document and Gordon Brander inspiration -->

---
layout: statement
transition: fade
---

# AI tools compute answers. Creativity needs divergent questions.

LLMs converge on the most probable token. Creative thinking needs the opposite — unexpected connections, oblique angles, productive confusion. A well-asked question opens possibility space. A computed answer closes it.

<!-- Gordon Brander described the vision as "tarot for thought" — a creative oracle that provokes ideas rather than retrieves them. LLMs optimize for the highest-probability token sequence, which is the exact opposite of what creative work needs. GeistFabrik embraces this tension: it uses computation (embeddings, graph queries) in service of divergence, never convergence. The through-line surfaces here for the first time as operational principle.

Sources:
- https://github.com/adewale/geist_fabrik/blob/main/specs/geistfabrik_vision.md — "Tarot for thought" from Gordon Brander, diverge/converge framework
- https://github.com/adewale/geist_fabrik/blob/main/README.md — "muse, not an oracle — offering provocative 'What if...?' questions rather than prescriptive answers" -->

---
transition: slide-left
---

# Geists are reasoning patterns, not algorithms

Geists come in two forms, chosen by what kind of thinking they need to do:

<v-clicks>

- **Code geists** — Python with VaultContext API
- **Tracery geists** — declarative YAML grammars
- Code when you need computation (graphs, stats)
- Grammars when you need provocation (questions)
- 48 code geists + 9 Tracery ship by default
- Users create custom geists without writing Python

</v-clicks>

<!-- The 57 default geists span 10 pattern categories: temporal analysis, semantic similarity, graph analysis, clustering, metadata-driven, contrarian, creative transformation, recency, extraction (harvesters), and Tracery-only. The two-form design is deliberate: code geists handle objective analysis (finding orphans, computing similarity scores), while Tracery geists handle subjective provocation (asking "What contradicts [[note]]?"). This split emerged from the first lesson learned — see next slide.

Sources:
- https://github.com/adewale/geist_fabrik/blob/main/README.md — 57 default geists (48 code + 9 Tracery), extensibility
- https://github.com/adewale/geist_fabrik/blob/main/docs/GEIST_CATALOG.md — 10 pattern categories, classification by mechanism -->

---
transition: slide-left
---

# The algorithmic approach

The Contradictor geist tried to compute opposites with 100+ lines of pattern matching:

```python
# 100+ lines of pattern matching
opposite = _generate_opposite(title)
text = f"[[{title}]] exists — what about '{opposite}'?"
```

<v-clicks>

- "Benefits of Morning Routines" -> "Costs of..." (works)
- "Evergreen notes" -> <v-mark at="3" color="#f59e0b" type="strike">"The opposite of Evergreen notes"</v-mark>
- "Meeting with Sarah" -> <v-mark at="4" color="#f59e0b" type="strike">"The opposite of Meeting with Sarah"</v-mark>
- Success rate: <v-mark at="5" color="#f59e0b" type="strike">roughly 10%</v-mark>

</v-clicks>

<!-- This is the war story. The initial Contradictor implementation was a classic oracle approach — the system tries to know the answer. It worked only for titles with specific patterns like "Benefits of X" or "Advantages of Y." For most note titles (dates, names, abstract concepts), it produced useless tautologies. The 100+ lines of code were an attempt to poorly compute what a simple question handles effortlessly. This is the through-line in action: a poorly-computed answer.

Sources:
- https://github.com/adewale/geist_fabrik/blob/main/LESSONS_LEARNED.md — "Muses, Not Oracles: The Case for Asking Over Answering," contradictor implementation, 10% success rate -->

---
layout: section
transition: morph-fade
---

# Muses, not oracles

The geist's job is not to know the answer. Its job is to ask.

---
transition: slide-left
---

# Simple questions win

13 lines of YAML replaced 100+ lines of Python:

```yaml
# 13 lines of YAML
suggestion:
  - "[[#note#]] exists. But what about the opposite?"
  - "What contradicts [[#note#]]?"
```

<v-clicks>

- Works for any note title, regardless of content
- Opens possibility space instead of closing it
- Forces active cognitive engagement
- Success rate: <v-mark at="4" color="#f59e0b" type="underline">100%</v-mark>

</v-clicks>

<!-- The Tracery version asks "What contradicts [[note]]?" — a question that works universally because the user generates the answer, not the system. The user produces multiple possible opposites, not just one computed guess. This is the through-line proven: a well-asked question (13 lines, 100% success) beats a poorly-computed answer (100+ lines, 10% success). The muse approach is not just philosophically preferable — it is measurably superior.

Sources:
- https://github.com/adewale/geist_fabrik/blob/main/LESSONS_LEARNED.md — question approach YAML, 100% success rate, "Why Questions Win" analysis -->

---
transition: slide-left
---

# Computation vs. questions

<div class="spotlight-group">

| | <v-mark at="1" color="#f59e0b" type="strike">Algorithmic</v-mark> | Questions |
|---|---|---|
| Lines of code | 100+ | 10-15 |
| Maintenance | High | Minimal |
| Success rate | 10-20% | 100% |
| Divergence | Narrow | Wide |
| Edge cases | Fails | Works |
| Non-programmer | No | Yes |

</div>

<!-- The comparison table comes directly from the LESSONS_LEARNED document. Every dimension favors the question approach. But the most important row is "Divergence quality" — the algorithmic approach produces narrow, predictable outputs while the question approach produces wide, surprising ones. This is because questions engage the user's creativity rather than replacing it. The v-mark.strike on "Algorithmic" signals rejection — this is the approach GeistFabrik abandoned.

Sources:
- https://github.com/adewale/geist_fabrik/blob/main/LESSONS_LEARNED.md — complexity comparison table, all metrics -->

---
transition: slide-left
---

# API consistency

A bug in `semantic_neighbours` revealed a two-pattern API:

````md magic-move
```yaml
# Before: two patterns, easy to forget which applies
note: ["$vault.sample_notes(1)"]      # bare text
origin: "Check out [[#note#]]"        # add brackets

cluster: ["$vault.semantic_clusters(2, 3)"]  # bracketed
origin: "#seed# connects to #neighbours#"    # use as-is
```
```yaml
# After: one pattern, all functions return [[links]]
note: ["$vault.sample_notes(1)"]      # [[Note Title]]
origin: "Check out #note#"            # just works

cluster: ["$vault.semantic_clusters(2, 3)"]  # [[Seed]]
origin: "#seed# connects to #neighbours#"    # just works
```
````

7 functions, 7 Tracery geists — one breaking change.

<!-- The two-pattern API was documented as "intentional" but was actually a design flaw. When all vault functions return bracketed links, questions compose cleanly — Tracery templates never need to know whether a function returns bare text or links. This is the through-line at the API level: a well-asked question about API design ("should all functions behave the same way?") was better than the poorly-computed justification for the inconsistency. Fixed in commits 3efc96c and d080f66 — acceptable in beta, unacceptable post-1.0.

Sources:
- https://github.com/adewale/geist_fabrik/blob/main/LESSONS_LEARNED.md — "API Consistency Over Avoiding Breaking Changes," commits 3efc96c and d080f66, before/after code -->

---
transition: slide-left
---

# Embeddings and semantic sampling

<v-motion
  :initial="{ opacity: 0, y: 40 }"
  :enter="{ opacity: 1, y: 0, transition: { delay: 200, duration: 600 } }">

```mermaid {theme: 'dark', scale: 0.85}
graph LR
  V["Vault Notes"] --> E["384-dim Embeddings"]
  E --> S["Semantic Sampling"]
  S --> G["Geist"]
  G --> N["Session Note"]
  style G fill:#f59e0b,stroke:#f59e0b,color:#0a0a0f
  style N fill:#2a1f08,stroke:#f59e0b,color:#f59e0b
```

</v-motion>

<v-clicks>

- **all-MiniLM-L6-v2** — 384 dimensions, local
- **Sample, don't rank** — weighted random draw
- Ranking always surfaces the same popular notes
- Sampling produces genuine surprise

</v-clicks>

<!-- The architecture uses sentence-transformers with all-MiniLM-L6-v2 for 384-dimensional embeddings, computed locally with no API calls. The critical design choice is sampling vs ranking. Ranking produces the same top-K notes every time — convergent behavior. Sampling draws from a probability distribution weighted by semantic distance — divergent behavior. This is the muse principle at the algorithm level: the system deliberately introduces controlled randomness to avoid preferential attachment to popular notes.

Sources:
- https://github.com/adewale/geist_fabrik/blob/main/docs/ARCHITECTURE.md — all-MiniLM-L6-v2, 384 dimensions, cosine similarity, sampling vs ranking
- https://github.com/adewale/geist_fabrik/blob/main/README.md — sentence-transformers, local processing, deterministic randomness -->

---
layout: fact
transition: fade
---

# <v-mark at="1" color="#f59e0b" type="circle">611</v-mark>

tests passing. 57 geists. Zero cloud dependencies.

<!-- 611 tests (505 unit + 106 integration) at 100% pass rate. 57 default geists (48 code + 9 Tracery). The zero cloud dependency guarantee is architectural — all processing happens locally using sentence-transformers for embeddings. Your vault never leaves your machine. The project is at version 0.9.0, roughly 99% complete, with 13,500 lines of code across 16 source modules. Mypy strict and Ruff linting both pass.

Sources:
- https://github.com/adewale/geist_fabrik/blob/main/README.md — 611 tests, 57 geists, 100% local processing
- https://github.com/adewale/geist_fabrik/blob/main/STATUS.md — 505 unit + 106 integration, version 0.9.0, 13,500 LOC -->

---
layout: center
transition: fade
---

# A well-asked question is better than a poorly-computed answer

## The geist's job is not to know the answer. Its job is to ask questions you would not ask yourself.

<!-- The through-line resolves here. We started with the provocation, saw it proven by the Contradictor war story (10% vs 100%), saw it manifest in API design (one consistent pattern composes better than two), and saw it embedded in the architecture (sampling over ranking). The principle "muses, not oracles" is not a marketing tagline — it is a design constraint that shaped every technical decision in the project: Tracery over algorithms for subjective tasks, sampling over ranking for note selection, questions over answers for user engagement.

Sources:
- https://github.com/adewale/geist_fabrik/blob/main/LESSONS_LEARNED.md — "A well-asked question is better than a poorly-computed answer"
- https://github.com/adewale/geist_fabrik/blob/main/specs/geistfabrik_vision.md — muses not oracles as architectural constraint -->

---
layout: end
transition: fade
---

# The best tool for thought is not the one that thinks for you.
