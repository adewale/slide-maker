---
theme: default
title: GeistFabrik
colorSchema: light
transition: fade
layout: cover
fonts:
  sans: Plus Jakarta Sans
  serif: Figtree
  mono: JetBrains Mono
  weights: '400,500,600,700'
---

# GeistFabrik

A Python-based divergence engine for Obsidian vaults

<!--
GeistFabrik means "spirit factory" in German. The name captures both the creative and the industrial — it manufactures creative provocations, not creative answers. Inspired by Gordon Brander's work on tools for thought.

The subtitle is the project's own README description, verbatim. This sets the stage: divergence engine is the key term. Not a search tool, not an AI assistant, not a recommendation system. A divergence engine.

Sources:
- https://github.com/adewale/geist_fabrik/blob/main/README.md — project description and philosophy
-->

---
transition: slide-left
---

# A spirit factory for your notes

<div v-motion :initial="{ x: -40, opacity: 0 }" :enter="{ x: 0, opacity: 1, transition: { delay: 200, duration: 600 } }">

GeistFabrik parses your Obsidian vault into a SQLite database, computes 384-dimensional embeddings via `sentence-transformers`, then runs 57 "geists" — small programs that generate creative suggestions.

</div>

<v-clicks>

- The output is always a question, never an answer
- All processing is local — your vault never leaves your machine
- The governing principle: **muses, not oracles**

</v-clicks>

<!--
"Muses, not oracles" is introduced here as the governing design principle. This is the through-line that runs through every design decision GeistFabrik makes.

The 384-dim embeddings use the all-MiniLM-L6-v2 model via sentence-transformers. The project has zero cloud dependency — after installation, it never contacts a server. This is a deliberate architectural choice, not a limitation. The README explicitly states: "100% local processing."

611 tests pass at 100%. The project is at version 0.9.0, feature-complete and approaching 1.0.

Sources:
- https://github.com/adewale/geist_fabrik/blob/main/README.md — feature list, privacy guarantees, and design principles
- https://github.com/adewale/geist_fabrik/blob/main/STATUS.md — 611 tests, 99% complete
-->

---
transition: slide-left
layout: two-cols
---

# Two kinds of geists

<v-clicks>

- **Code geists** (48 default)
- Full Python with VaultContext API
- Graph traversal, temporal analysis
- When computation is truly needed

</v-clicks>

::right::

<v-clicks>

- **Tracery geists** (9 default)
- Declarative YAML grammars
- Template variations, creative collision
- When a question beats a computation

</v-clicks>

<!--
The two-type system reflects a fundamental split in what creative suggestion needs. Code geists handle objective computation — orphan detection, embedding similarity, temporal drift analysis. Tracery geists handle subjective provocation — what-ifs, contradictions, creative collisions.

The ratio tells a story: 48 code geists to 9 Tracery grammars. But the Tracery geists punch above their weight, as the next slide will demonstrate. The extensibility model is three-dimensional: metadata inference modules, vault functions, and geists themselves. Non-programmers can write Tracery geists in YAML without touching Python.

Sources:
- https://github.com/adewale/geist_fabrik/blob/main/README.md — geist inventory, extensibility model, code vs Tracery distinction
-->

---
transition: fade
layout: center
---

# 13 lines of YAML outperformed 100 lines of Python

The Contradictor geist tried to algorithmically generate opposites of note titles. It succeeded 10% of the time. A simple Tracery question — "What contradicts this note?" — works for every note, every time.

<!--
This is the genuinely surprising finding from the project's own LESSONS_LEARNED.md. The Python implementation used 100+ lines of pattern matching to generate opposite titles. Results: "Benefits of Morning Routines" produced "Costs of Morning Routines" (works). But "Evergreen notes" produced "The opposite of Evergreen notes" (useless). And "2023-09-12" produced "The opposite of 2023-09-12" (absurd).

The Tracery replacement is 13 lines of YAML. It asks "What contradicts this note?" and lets the human generate the opposite. Success rate: 100%, because the question works for any note regardless of title structure.

The insight, stated in LESSONS_LEARNED.md: "A well-asked question is better than a poorly-computed answer." This proved the through-line — muses, not oracles — was not just philosophy but engineering.

Sources:
- https://github.com/adewale/geist_fabrik/blob/main/LESSONS_LEARNED.md — Muses Not Oracles case study, 10% vs 100% success rates, code vs YAML comparison
-->

---
transition: iris
layout: section
---

# Questions scale. Answers don't.

<!--
Through-line echo: "Muses, not oracles" reframed as a scalability argument. A question that works for any note is more valuable than an answer that works for 10% of notes.

This is also why GeistFabrik deliberately avoids LLM integration. An LLM would turn the tool into an oracle — generating answers, not questions. The project's philosophy page quotes Gordon Brander: the geist's job is not to know the answer, but to ask questions you would not ask yourself. The project calls this "intermittent invocation" — the user initiates a session, receives provocations, then thinks. It is the opposite of a continuous recommendation feed.

Sources:
- https://github.com/adewale/geist_fabrik/blob/main/LESSONS_LEARNED.md — "Muses, not oracles" principle and its engineering implications
- https://github.com/adewale/geist_fabrik/blob/main/README.md — design principles section
-->

---
transition: slide-left
---

# Deterministic randomness

Same date plus same vault equals same suggestions. GeistFabrik seeds its RNG with the session date, making every session reproducible.

<v-clicks>

- Execution order in `config.yaml` determines which geist gets which random numbers
- 150+ raw suggestions flow through a 4-stage filter: boundary, novelty, diversity, quality
- About 5 survive to the session note

</v-clicks>

<!--
Deterministic randomness is a counterintuitive design choice. Most creative tools lean into unpredictability. GeistFabrik makes randomness reproducible because the user should be able to replay a productive session — same date, same vault, same output. The config.yaml execution order matters because all geists share a single RNG.

The filtering pipeline is aggressive: from 150+ raw geist outputs, the 4-stage filter (boundary check, novelty scoring, diversity sampling, quality threshold) reduces suggestions to roughly 5. Three invocation modes let the user control filtering: default (filtered + sampled), full (filtered, no sampling), and no-filter (raw output). The session note is written to the vault's "geist journal" directory as a linkable Obsidian note with block IDs.

Sources:
- https://github.com/adewale/geist_fabrik/blob/main/README.md — configuration, filtering modes, session notes
-->

---
transition: fade
layout: end
---

# The best tool for thought asks. It never answers.

github.com/adewale/geist_fabrik

<!--
Resolution of the through-line. "Muses, not oracles" resolves here as a design philosophy that extends beyond this single project. GeistFabrik demonstrates that creative tools can be more powerful when they constrain themselves to questions rather than attempting answers.

The closing echoes the opening: a divergence engine manufactures creative questions, not creative answers. The name itself — GeistFabrik, spirit factory — captures this perfectly. It is industrial (factory) in its mechanism but spiritual (geist) in its purpose.

Sources:
- https://github.com/adewale/geist_fabrik — project repository
-->
