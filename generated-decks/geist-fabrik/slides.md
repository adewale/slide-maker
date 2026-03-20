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

<!-- GeistFabrik means "spirit factory" in German. Open by establishing what this project actually is. The subtitle is the project's own description from the README, not the through-line.

Sources:
- file:README.md -- repo description and first-paragraph identity -->

---
transition: slide-left
---

# What GeistFabrik is and why it exists

GeistFabrik (German for "spirit factory") generates creative suggestions through both code and Tracery grammars. It's a tool for thought that acts as a muse, not an oracle -- offering provocative "What if...?" questions rather than prescriptive answers.

Inspired by Gordon Brander's work on tools for thought.

<v-clicks>

- **100% local** -- no data leaves your machine
- **Read-only** -- never modifies your notes
- **Deterministic** -- same date + vault = same suggestions

</v-clicks>

<!-- This slide grounds the audience. The first paragraph from the README appears verbatim. The three properties reinforce why a user should trust this tool with their vault.

Sources:
- file:README.md -- first paragraph description, privacy section, design principles -->

---
layout: center
transition: fade
---

# A WELL-ASKED QUESTION IS BETTER THAN A POORLY-COMPUTED ANSWER

The design rule that shaped every geist

<!-- This is the through-line. Pause here. The caps are deliberate -- one strategic emphasis per PRESENTATION_PHILOSOPHY principle 5. This principle comes directly from LESSONS_LEARNED.md and it governs every design decision in the project.

Sources:
- file:LESSONS_LEARNED.md -- "Muses, Not Oracles: The Case for Asking Over Answering" -->

---
layout: fact
transition: slide-left
---

# 57

Default geists

48 code + 9 Tracery. 611 tests passing. Zero external API calls.

<!-- The 57 geists ship out of the box with zero configuration. "Zero external API calls" reinforces the local-first architecture. 611 is the actual test count from the README status section at version 0.9.0.

Sources:
- file:README.md -- status section (version 0.9.0 beta, 57 default geists, 611 tests at 100%) -->

---
layout: two-cols
transition: slide-left
---

# Code vs Tracery

The Contradictor experiment

::left::

### Code approach

<v-clicks>

- 100+ lines of pattern matching
- Tried to compute opposites algorithmically
- "Evergreen notes" became "The opposite of Evergreen notes"
- **Success rate: ~10%**

</v-clicks>

::right::

### Tracery approach

<v-clicks>

- 13 lines of YAML
- Asks: "What contradicts this note?"
- Works for any note, any title, any topic
- **Success rate: 100%**

</v-clicks>

<!-- The Contradictor war story from LESSONS_LEARNED.md. The code approach failed on anything that wasn't a pattern like "Benefits of X." The Tracery approach works universally because it asks the human to generate the answer. This is the through-line in action: questions beat computed answers.

Sources:
- file:LESSONS_LEARNED.md -- Contradictor geist comparison, code vs question approach, success rate data -->

---
transition: fade
---

# How suggestions reach your vault

```mermaid {scale: 0.75}
flowchart LR
    A[Vault Files] --> B[Sync + SQLite]
    B --> C[Embeddings]
    C --> D[VaultContext]
    D --> E[Geists Execute]
    E --> F[Filter Pipeline]
    F --> G[Session Note]

    style A fill:#ffffff,stroke:#4a6741,color:#1a1a2e
    style B fill:#ffffff,stroke:#4a6741,color:#1a1a2e
    style C fill:#ffffff,stroke:#4a6741,color:#1a1a2e
    style D fill:#ffffff,stroke:#4a6741,color:#1a1a2e
    style E fill:#ffffff,stroke:#4a6741,color:#1a1a2e
    style F fill:#ffffff,stroke:#4a6741,color:#1a1a2e
    style G fill:#4a6741,stroke:#4a6741,color:#ffffff

    linkStyle default stroke:#4a6741,stroke-width:2px
```

Your notes are **read-only**. The only output is a linkable session note in `geist journal/`.

<!-- Walk through the pipeline left to right. Vault files are parsed and synced to SQLite. Embeddings are computed locally via sentence-transformers. VaultContext provides the rich query API. Geists execute against it. A 4-stage filter (boundary, novelty, diversity, quality) reduces noise. The final output is an Obsidian-native journal entry.

Sources:
- file:README.md -- architecture section, data flow diagram, two-layer design description -->

---
layout: end
transition: fade
---

# Muses, not oracles

GeistFabrik asks questions so you can find answers

<!-- Circle back to the through-line. The closing echoes the opening philosophy from the README and the design rule from LESSONS_LEARNED.md. "Muses, not oracles" is the project's own phrase for its core principle.

Sources:
- file:README.md -- key design principles, "Muses, not oracles"
- file:LESSONS_LEARNED.md -- the principle stated as a design rule -->
