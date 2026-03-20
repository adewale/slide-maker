# Deck Spec

## Meta
- title: GeistFabrik
- purpose: introduce a divergence engine for Obsidian vaults that generates creative suggestions through code and Tracery grammars
- audience: developers and PKM enthusiasts interested in tools for thought
- tone: curious, precise, grounded
- target-length: 7
- notes: yes
- style-preset: swiss-minimal
- progress: segment-bar
- project-url: https://github.com/adewale/geist_fabrik

## Source Materials
- readme: README.md (project overview — what it does, feature inventory, architecture, design principles)
- lessons-learned: LESSONS_LEARNED.md (two key insights: questions beat computed answers, API consistency over avoiding breaking changes)
- status: STATUS.md (611 tests, 99% complete, 57 default geists, schema v6)

## Through-Line
- concept: "Muses, not oracles"
- type: design-rule
- appears-in:
  - slide 2: default — introduced as the governing principle
  - slide 4: center — the surprising proof: 13 lines of YAML beat 100+ lines of Python
  - slide 5: section — reframed as architecture: questions win because they work universally
  - slide 7: end — resolved: the best tool for thought asks, it never answers

## Design Tokens
- colors:
  - bg: "#ffffff"
  - fg: "#1a1a2e"
  - accent: "#16697a"
  - muted: "#6b7280"
- typography:
  - display: Plus Jakarta Sans
  - body: Figtree
  - mono: JetBrains Mono
- motion:
  - preset: restrained-fade

## Layout System
- prefer-builtins: true
- builtins:
  - cover
  - default
  - center
  - section
  - two-cols
  - fact
  - end
- custom-layouts: []
- components:
  - ProgressSegmentBar
  - KeyboardHelp
  - AudienceQRCode
  - MobileScrollView
- css-files:
  - styles/tokens.css
  - styles/theme.css
  - styles/transitions.css

## Slides

### Slide 1
- kind: cover
- layout: cover
- title: GeistFabrik
- subtitle: A Python-based divergence engine for Obsidian vaults
- notes:
  - GeistFabrik means "spirit factory" in German. The name captures both the creative and industrial aspects — it manufactures creative provocations.
  - The subtitle is the project's own README description, verbatim.

### Slide 2
- kind: default-content
- layout: default
- title: A spirit factory for your notes
- body: GeistFabrik parses your Obsidian vault into a SQLite database, computes 384-dimensional embeddings via sentence-transformers, then runs 57 "geists" — small programs that generate creative suggestions. The output is always a question, never an answer. All processing is local. Your vault never leaves your machine.
- sources:
  - https://github.com/adewale/geist_fabrik/blob/main/README.md — project overview and feature list
- notes:
  - "Muses, not oracles" is introduced here as the governing design principle. This is the through-line that runs through every design decision.
  - The 384-dim embeddings use the all-MiniLM-L6-v2 model via sentence-transformers. Emphasize: zero cloud dependency.

### Slide 3
- kind: default-content
- layout: two-cols
- title: Two kinds of geists
- left:
  - Code geists (48 default)
  - Full Python with VaultContext API
  - Graph traversal, temporal analysis, semantic search
  - When computation is truly needed
- right:
  - Tracery geists (9 default)
  - Declarative YAML grammars
  - Template variations, creative collision
  - When a question is better than a computation
- sources:
  - https://github.com/adewale/geist_fabrik/blob/main/README.md — geist inventory and extensibility model
- notes:
  - The two-type system is not arbitrary. Code geists handle objective computation (orphan detection, embedding similarity). Tracery geists handle subjective provocation (what-ifs, contradictions). The ratio tells the story: 48 code to 9 Tracery, but the Tracery geists punch above their weight.

### Slide 4
- kind: center-statement
- layout: center
- title: 13 lines of YAML outperformed 100 lines of Python
- body: The Contradictor geist tried to algorithmically generate opposites of note titles. It succeeded 10% of the time. A simple Tracery question — "What contradicts this note?" — works for every note, every time.
- sources:
  - https://github.com/adewale/geist_fabrik/blob/main/LESSONS_LEARNED.md — Muses Not Oracles case study
- notes:
  - This is the surprising slide. The LESSONS_LEARNED.md documents this in detail. The Python approach produced absurdities like "The opposite of 2023-09-12" while the YAML question engaged the user's own creativity. The insight: a well-asked question is better than a poorly-computed answer.

### Slide 5
- kind: section
- layout: section
- title: Questions scale. Answers don't.
- notes:
  - Through-line echo: "Muses, not oracles" reframed as a scalability argument. A question that works for any note is more valuable than an answer that works for 10% of notes. This is why GeistFabrik deliberately avoids LLM integration — it provokes thinking rather than replacing it.

### Slide 6
- kind: default-content
- layout: default
- title: Deterministic randomness
- body: Same date plus same vault equals same suggestions. GeistFabrik seeds its random number generator with the session date, so results are reproducible. Execution order in config.yaml determines which geist gets which random numbers. Suggestions flow through a 4-stage filter — boundary, novelty, diversity, quality — before reaching the session note.
- sources:
  - https://github.com/adewale/geist_fabrik/blob/main/README.md — configuration and filtering pipeline
- notes:
  - Deterministic randomness is a counterintuitive design choice. Most creative tools lean into unpredictability. GeistFabrik makes randomness reproducible because the user should be able to replay a productive session. The filtering pipeline is another constraint: not every geist output reaches the user. About 5 suggestions survive from 150+ raw outputs.

### Slide 7
- kind: end
- layout: end
- title: The best tool for thought asks. It never answers.
- body: github.com/adewale/geist_fabrik
- notes:
  - Resolution of the through-line. "Muses, not oracles" becomes a design philosophy that other tool-for-thought builders can adopt. The closing echoes the opening: GeistFabrik is a divergence engine — it manufactures creative questions, not creative answers.

## Notes Policy
- style: delivery-oriented, speaker-facing
- minimum: 2 sentences per content slide
- include: source citations for all factual claims
