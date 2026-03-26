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

# Thousands of notes. Zero connections visible.

You have years of notes in your Obsidian vault. The contradictions between them, the forgotten threads, the ideas that link across projects and years -- all invisible because you never re-read them.

<v-clicks>

- A note from 2022 contradicts something you wrote last month. You will never notice.
- Two ideas in different folders are the same idea, expressed differently. They will never meet.
- The question that would unlock your next project is already answered, scattered across a dozen notes.

</v-clicks>

<p v-click style="color: var(--deck-accent); font-size: 1.05rem; margin-top: 1.5rem;">What if something could read your entire vault and ask you the questions you would never think to ask yourself?</p>

<!-- This slide names the problem GeistFabrik solves. Obsidian vaults grow over years -- hundreds or thousands of Markdown files, wikilinked and tagged, but rarely re-read. The connections between notes -- semantic similarities, contradictions, forgotten threads -- are structurally invisible to the author because re-reading at scale is impractical. GeistFabrik's answer is not to summarize or search, but to surface provocative questions drawn from the vault's own content. The next slide introduces the mechanism.

Sources:
- file:README.md -- project description, what GeistFabrik does with Obsidian vaults
- file:specs/geistfabrik_vision.md -- Gordon Brander's insight about accumulated knowledge, divergent thinking -->

---
layout: default
transition: fade
---

# What GeistFabrik does

<v-clicks>

- Parses Obsidian vaults into SQLite with 384-dim embeddings
- 57 geists (48 Python, 9 YAML) ask "What if...?" questions about *your* notes
- 4-stage filtering samples ~5 suggestions per session
- 100% local, read-only, deterministic -- same date = same output

</v-clicks>

<!-- The 384-dim embeddings come from all-MiniLM-L6-v2 via sentence-transformers, bundled locally with zero API calls. "Deterministic randomness" means the RNG is seeded by session date -- identical vault state on the same date always produces identical suggestions. This makes debugging reproducible: replay any session by passing its date. The geists do not summarize or search -- they generate provocative questions that surface connections the author would not find by browsing.

Sources:
- file:README.md -- feature inventory, 57 default geists count, deterministic randomness principle
- file:docs/ARCHITECTURE.md -- session orchestrator flow, embedding computation details -->

---
layout: two-cols-header
transition: slide-left
---

# Two-layer architecture

::left::

**Layer 1: Vault** -- raw data

<v-clicks>

- Parses Markdown, extracts wikilinks and tags
- Incremental sync to SQLite
- Computes temporal + semantic embeddings

</v-clicks>

::right::

**Layer 2: VaultContext** -- intelligence

<v-clicks>

- Semantic search and graph operations
- Deterministic sampling (date-seeded RNG)
- Metadata inference + function registry

</v-clicks>

<!-- Notes are frozen dataclasses -- lightweight and immutable. All intelligence lives in VaultContext, not in the Note objects themselves. This separation means Layer 1 can be replaced or upgraded (different vault format, different database) without touching the 57 geists that depend on Layer 2's API. The function registry is the critical bridge: it lets Tracery grammars call Python vault functions via the $vault.function() syntax.

Sources:
- file:docs/ARCHITECTURE.md -- two-layer design, VaultContext wraps Vault
- file:src/geistfabrik/vault_context.py -- VaultContext API surface, frozen Note dataclass -->

---
layout: two-cols-header
transition: slide-left
---

# Code geists vs Tracery geists

::left::

**Code geists** (Python)

<v-clicks>

- Full VaultContext API access
- Graph algorithms, similarity scores
- Best for computation-heavy analysis

</v-clicks>

::right::

**Tracery geists** (YAML)

<v-clicks>

- Declarative grammar with `$vault.*` calls
- Template variations, question patterns
- Non-programmers can create and modify

</v-clicks>

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
transition: fade
---

# The connections were always in your notes

57 geists. 384-dimensional embeddings. Date-seeded deterministic sampling. But the real mechanism is simpler: your vault already contains the contradictions, the forgotten threads, the ideas that link across years. GeistFabrik does not create connections. It asks you about the ones that are already there.

<!-- This penultimate slide resolves the tension from slide 2. The problem was invisible connections in a growing vault. The resolution: the connections were always present in the notes -- GeistFabrik surfaces them by asking questions the author would not think to ask. The Contradictor case study proved this: algorithmically generating opposites failed at 10%, but simply asking "What contradicts this note?" succeeded at 100%. The tool's power comes from the vault's own content, not from computation.

Sources:
- file:LESSONS_LEARNED.md -- Contradictor case study, questions vs computed answers
- file:README.md -- 57 geists, design philosophy -->

---
layout: end
transition: fade
---

# What did you forget to ask your notes?

github.com/adewale/geist_fabrik

<!-- The closing h1 resolves the opening directly. Slide 2 said: you have thousands of notes, the connections between them are invisible. This slide says: the connections were always there -- GeistFabrik makes them visible by asking questions drawn from your own vault. Not summaries, not search results, not AI-generated answers. Questions. The geist's job is not to know things you do not know. It is to ask about things you have forgotten you know.

Sources:
- file:LESSONS_LEARNED.md -- concluding principle from the Contradictor case study
- file:specs/geistfabrik_vision.md -- Gordon Brander's "tarot for thought" vision -->
