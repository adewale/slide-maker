---
theme: default
title: GeistFabrik
selectable: true
routerMode: hash
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

github.com/adewale/geist_fabrik

<!-- GeistFabrik means "spirit factory" in German. The name is intentional -- geists are small programs that generate creative provocations from your notes. Created by Adewale, inspired by Gordon Brander's work on tools for thought and his concept of "tarot for thought" from the Subconscious project.

Sources:
- file:README.md -- project name, description, Gordon Brander attribution
- file:specs/geistfabrik_vision.md -- Brander's "Building a Second Subconscious" essay, Hegel's owl of Minerva connection -->

---
transition: slide-left
---

# What GeistFabrik does

<v-clicks>

- Parses Obsidian vaults into SQLite with 384-dim embeddings
- 57 geists (48 Python, 9 YAML) ask "What if...?" questions
- 4-stage filtering samples ~5 suggestions per session
- 100% local, read-only, deterministic -- same date = same output

</v-clicks>

<!-- The 384-dim embeddings come from all-MiniLM-L6-v2 via sentence-transformers, bundled locally with zero API calls. "Deterministic randomness" means the RNG is seeded by session date -- identical vault state on the same date always produces identical suggestions. This makes debugging reproducible: replay any session by passing its date.

Sources:
- file:README.md -- feature inventory, 57 default geists count, deterministic randomness principle
- file:docs/ARCHITECTURE.md -- session orchestrator flow, embedding computation details -->

---
layout: center
transition: fade
---

# Muses, not oracles

Geists provoke thinking. They do not pretend to think for you.

<!-- Gordon Brander described building "a creative oracle that helps provoke ideas... More tarot than flash cards. Tarot for thought." GeistFabrik takes that vision and grounds it in a concrete system. The name "Geists" also invokes Hegel's owl of Minerva -- wisdom comes from reflecting on accumulated knowledge, not from predicting the future.

Sources:
- file:LESSONS_LEARNED.md -- "Muses, not oracles" as the governing design principle
- file:specs/geistfabrik_vision.md -- Gordon Brander's original "tarot for thought" framing -->

---
layout: two-cols
transition: slide-left
---

# Two-layer architecture

**Layer 1: Vault** -- raw data

<v-clicks>

- Parses Markdown, extracts wikilinks and tags
- Incremental sync to SQLite
- Computes temporal + semantic embeddings

</v-clicks>

::right::

<div style="padding-top: 3.5rem;">

**Layer 2: VaultContext** -- intelligence

<v-clicks>

- Semantic search and graph operations
- Deterministic sampling (date-seeded RNG)
- Metadata inference + function registry

</v-clicks>

</div>

<!-- Notes are frozen dataclasses -- lightweight and immutable. All intelligence lives in VaultContext, not in the Note objects themselves. This separation means Layer 1 can be replaced or upgraded (different vault format, different database) without touching the 57 geists that depend on Layer 2's API. The function registry is the critical bridge: it lets Tracery grammars call Python vault functions via the $vault.function() syntax.

Sources:
- file:docs/ARCHITECTURE.md -- two-layer design, VaultContext wraps Vault
- file:src/geistfabrik/vault_context.py -- VaultContext API surface, frozen Note dataclass -->

---
layout: two-cols
transition: slide-left
---

# Code geists vs Tracery geists

**Code geists** (Python)

<v-clicks>

- Full VaultContext API access
- Graph algorithms, similarity scores
- Best for computation-heavy analysis

</v-clicks>

::right::

<div style="padding-top: 3.5rem;">

**Tracery geists** (YAML)

<v-clicks>

- Declarative grammar with `$vault.*` calls
- Template variations, question patterns
- Non-programmers can create and modify

</v-clicks>

</div>

<!-- The custom Tracery engine is only 283 lines of Python. It intentionally omits standard Tracery features -- modifiers like .capitalize and push-pop stack memory -- in favor of the $vault.function() call system that queries live vault data at expansion time. Standard Tracery requires all content to be pre-computed; GeistFabrik's engine resolves vault queries dynamically during grammar expansion.

Sources:
- file:LESSONS_LEARNED.md -- decision criteria: when to use code vs Tracery
- file:docs/TRACERY_COMPARISON.md -- 283-line engine, omitted features, vault function bridge -->

---
layout: center
transition: morph-fade
---

# 13 lines of YAML beat 100+ lines of Python

The Contradictor geist tried to algorithmically generate opposites. 10% success rate. Replaced with questions -- 100% success.

<!-- The original Python approach pattern-matched note titles: "Benefits of Morning Routines" became "Costs of Morning Routines" (works), but "Evergreen notes" became "The opposite of Evergreen notes" (useless), and "Meeting with Sarah" became "The opposite of Meeting with Sarah" (nonsensical). The YAML replacement just asks "What contradicts this note?" -- it works for ANY note because it delegates the hard cognitive work to the human. This is the purest expression of "muses, not oracles": a well-asked question is better than a poorly-computed answer.

Sources:
- file:LESSONS_LEARNED.md -- full Contradictor case study, 10% vs 100% comparison table
- file:src/geistfabrik/default_geists/tracery/contradictor.yaml -- the 13-line replacement -->

---
transition: slide-left
---

# Three-dimensional extensibility

<v-clicks>

- **Metadata inference** -- custom note properties via Python
- **Vault functions** -- reusable queries, callable from Tracery
- **Geists** -- new generators in Python or YAML
- Each layer feeds the next: metadata to functions to geists

</v-clicks>

<!-- This three-layer model is what makes GeistFabrik a platform rather than a tool. A non-programmer can write a Tracery geist that calls vault functions written by a programmer, which use metadata computed by a data scientist. All extensibility is filesystem-based: drop a .py file in the right directory and it becomes available. No configuration beyond the file itself.

Sources:
- file:README.md -- three extensibility dimensions with examples
- file:docs/ARCHITECTURE.md -- metadata system, function registry, geist executor interaction -->

---
transition: slide-left
---

# Design principles as constraints

<v-clicks>

- **Questions, not answers** -- "What if...?" not "Here is how"
- **Sample, do not rank** -- avoid preferential attachment
- **Never destructive** -- read-only vault access
- **Deterministic randomness** -- reproducible sessions for debugging
- **Local-first** -- no network required after installation

</v-clicks>

<!-- "Sample, do not rank" is a deliberate choice against recommendation algorithms. Ranking creates preferential attachment where popular notes attract more attention. Sampling ensures orphans and forgotten notes surface with equal probability. The deterministic randomness principle means that if a geist produces a bad suggestion, you can replay the exact session that generated it by passing --date to the CLI.

Sources:
- file:README.md -- eight design principles
- file:specs/geistfabrik_vision.md -- diverge/converge feedback loops, Brander's influence -->

---
layout: end
transition: fade
---

# The geist's job is to ask questions you would not ask yourself

github.com/adewale/geist_fabrik

<!-- This line comes directly from the Lessons Learned document and is the resolution of the "muses, not oracles" through-line. GeistFabrik is at v0.9.0, approaching 1.0 -- 611 passing tests, 57 default geists, feature-complete. The Contradictor case study proved the principle: a simple question achieves what complex code cannot.

Sources:
- file:LESSONS_LEARNED.md -- concluding principle from the Contradictor case study -->
