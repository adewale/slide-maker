# Deck Spec

## Meta
- title: GeistFabrik
- subtitle: A Python-based divergence engine for Obsidian vaults
- purpose: present GeistFabrik's architecture, philosophy, and surprising design insights to developers interested in tools for thought
- audience: developers and PKM enthusiasts curious about creative computing and Obsidian extensibility
- tone: precise, curious, grounded in code
- target-length: 9
- notes: yes
- style-preset: swiss-minimal
- progress: segment-bar
- project-url: https://github.com/adewale/geist_fabrik

## Source Materials
- readme: README.md (factual backbone -- what it does, feature inventory, quick start, 57 default geists)
- architecture: docs/ARCHITECTURE.md (two-layer design -- Vault for I/O, VaultContext for intelligence, data flow diagram)
- lessons-learned: LESSONS_LEARNED.md (muses not oracles insight, Contradictor geist case study, code vs Tracery comparison)
- specs: specs/geistfabrik_vision.md (Gordon Brander inspiration, tarot for thought, diverge/converge feedback loops)
- research: docs/TRACERY_COMPARISON.md (283-line custom Tracery engine, vault function bridge, standard Tracery omissions)
- changelog: CHANGELOG.md (performance optimizations, O(N^2) fixes, sklearn vectorization, schema migrations)

## Through-Line
- concept: "Your notes know things you have forgotten. GeistFabrik asks them the questions you would not ask yourself."
- shape: boy-meets-girl
- type: problem-resolution
- appears-in:
  - slide 1: cover -- the project is named as a spirit factory, a divergence engine for vaults
  - slide 2: default -- name the problem: thousands of notes, connections invisible because you never re-read them
  - slide 3: default -- introduce GeistFabrik's mechanism: geists that ask "What if...?" questions about your notes
  - slide 6: center-statement -- the surprising finding: 13 lines of YAML outperformed 100+ lines of Python
  - slide 8: default-content -- deterministic randomness makes the muse reproducible
  - slide 9: default -- build toward resolution: the connections were always in your notes
  - slide 10: end -- resolve: "The connections were always in your notes. Now something asks you about them."

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
  - section
  - default
  - center
  - fact
  - two-cols
  - end
- custom-layouts: []
- components:
  - ProgressSegmentBar
  - KeyboardHelp
- css-files:
  - styles/tokens.css
  - styles/theme.css
  - styles/transitions.css
  - styles/index.css

## Slides

### Slide 1
- kind: cover
- layout: cover
- title: GeistFabrik
- subtitle: A Python-based divergence engine for Obsidian vaults
- body: github.com/adewale/geist_fabrik
- notes:
  - GeistFabrik means "spirit factory" in German. The name is intentional -- geists are small programs that generate creative provocations from your notes.
  - Created by Adewale, inspired by Gordon Brander's work on tools for thought and the concept of "tarot for thought."

### Slide 2
- kind: default-content
- layout: default
- title: Thousands of notes. Zero connections visible.
- body: You have years of notes in your Obsidian vault. The contradictions between them, the forgotten threads, the ideas that link across projects and years -- all invisible because you never re-read them. A note from 2022 contradicts something you wrote last month. Two ideas in different folders are the same idea. What if something could read your vault and ask you the questions you would never think to ask yourself?
- sources:
  - file:README.md -- project description, what GeistFabrik does with Obsidian vaults
  - file:specs/geistfabrik_vision.md -- Gordon Brander's insight about accumulated knowledge
- notes:
  - This slide names the problem before introducing the solution. Obsidian vaults grow over years but are rarely re-read at scale. The connections are structurally invisible to the author.

### Slide 3
- kind: default-content
- layout: default
- title: What GeistFabrik does
- body:
  - Parses Obsidian vaults into SQLite with 384-dim embeddings
  - 57 geists (48 Python, 9 YAML) ask "What if...?" questions about your notes
  - 4-stage filtering samples ~5 suggestions per session
  - 100% local, read-only, deterministic -- same date = same output
- sources:
  - file:README.md -- feature inventory, 57 default geists count, filtering pipeline
  - file:docs/ARCHITECTURE.md -- two-layer design, session orchestrator flow
- notes:
  - The 384-dim embeddings come from all-MiniLM-L6-v2 via sentence-transformers, bundled locally -- no API calls.
  - "Deterministic randomness" means the RNG is seeded by session date. Same vault state on the same date always produces identical suggestions.

### Slide 4
- kind: default-content
- layout: two-cols
- title: Two-layer architecture
- left:
  - "Layer 1: Vault" -- raw data access
  - Parses Markdown, extracts wikilinks and tags
  - Incremental sync to SQLite
  - Computes temporal and semantic embeddings
- right:
  - "Layer 2: VaultContext" -- intelligence
  - Semantic search, graph operations
  - Deterministic sampling (date-seeded RNG)
  - Metadata inference and function registry
- sources:
  - file:docs/ARCHITECTURE.md -- two-layer design, VaultContext API surface
  - file:src/geistfabrik/vault_context.py -- VaultContext implementation
- notes:
  - The key architectural insight is that Notes are frozen dataclasses -- lightweight and immutable. All intelligence lives in VaultContext, not in the Note objects themselves.
  - The function registry is the bridge that lets Tracery grammars call Python vault functions via the $vault.function() syntax.

### Slide 5
- kind: default-content
- layout: two-cols
- title: Code geists vs Tracery geists
- left:
  - Code geists (Python)
  - Full VaultContext API access
  - Graph algorithms, similarity scores
  - Best for computation-heavy analysis
- right:
  - Tracery geists (YAML)
  - Declarative grammar with $vault.* calls
  - Template variations, question patterns
  - Non-programmers can create and modify
- sources:
  - file:LESSONS_LEARNED.md -- when to use code vs Tracery
  - file:docs/TRACERY_COMPARISON.md -- 283-line custom engine, vault function bridge
- notes:
  - The custom Tracery engine is only 283 lines. It intentionally omits standard Tracery features like modifiers and push-pop stack memory in favor of the $vault.function() call system.
  - Vault functions are the bridge: Python functions decorated with @vault_function work with Note objects internally but return strings for Tracery consumption.

### Slide 6
- kind: center-statement
- layout: center
- title: 13 lines of YAML beat 100+ lines of Python
- body: The Contradictor geist tried to algorithmically generate opposites. 10% success rate. Replaced with questions -- 100% success.
- sources:
  - file:LESSONS_LEARNED.md -- Contradictor geist case study, complexity comparison table
  - file:src/geistfabrik/default_geists/tracery/contradictor.yaml -- the 13-line replacement
- notes:
  - The original code approach pattern-matched note titles to generate opposites: "Benefits of Morning Routines" became "Costs of Morning Routines" (works), but "Evergreen notes" became "The opposite of Evergreen notes" (useless).
  - The YAML replacement just asks: "What contradicts [[note]]?" -- works for ANY note because it delegates the hard part to the human. A well-asked question is better than a poorly-computed answer.

### Slide 7
- kind: default-content
- layout: default
- title: Three-dimensional extensibility
- body:
  - Metadata inference -- custom note properties via Python
  - Vault functions -- reusable queries, callable from Tracery
  - Geists -- new generators in Python or YAML
  - Each layer feeds the next: metadata to functions to geists
- sources:
  - file:README.md -- three extensibility dimensions
  - file:docs/ARCHITECTURE.md -- metadata, vault functions, function registry
- notes:
  - This three-layer extensibility model is what makes GeistFabrik a platform, not just a tool. A non-programmer can write a Tracery geist that calls vault functions written by a programmer, which in turn use metadata computed by a data scientist.
  - The extensibility is filesystem-based: drop a .py file in the right directory and it becomes available. No configuration needed beyond the file itself.

### Slide 8
- kind: default-content
- layout: default
- title: Design principles as constraints
- body:
  - Questions, not answers -- "What if...?" not "Here is how"
  - Sample, do not rank -- avoid preferential attachment
  - Never destructive -- read-only vault access
  - Deterministic randomness -- same date plus same vault equals same output
  - Local-first -- no network required after installation
- sources:
  - file:README.md -- key design principles list
  - file:specs/geistfabrik_vision.md -- diverge/converge feedback loops
- notes:
  - "Sample, do not rank" is a deliberate choice against recommendation algorithms. Ranking creates preferential attachment where popular notes get more attention. Sampling ensures orphans and forgotten notes surface regularly.
  - The deterministic randomness principle enables debugging: if a geist produces a bad suggestion, you can replay the exact session that generated it.

### Slide 9
- kind: default-content
- layout: default
- title: The connections were always in your notes
- body: 57 geists. 384-dimensional embeddings. Date-seeded deterministic sampling. But the real mechanism is simpler -- your vault already contains the contradictions, the forgotten threads, the ideas that link across years. GeistFabrik does not create connections. It asks you about the ones that are already there.
- sources:
  - file:LESSONS_LEARNED.md -- Contradictor case study, questions vs computed answers
  - file:README.md -- 57 geists, design philosophy
- notes:
  - Build toward the closing resolution. The connections were not created by the tool -- they were surfaced by asking questions about content the author already wrote.

### Slide 10
- kind: end
- layout: end
- title: The connections were always in your notes. Now something asks you about them.
- body: github.com/adewale/geist_fabrik
- sources:
  - file:LESSONS_LEARNED.md -- concluding principle from the Contradictor case study
  - file:specs/geistfabrik_vision.md -- Gordon Brander's "tarot for thought" vision
- notes:
  - Resolve the through-line. Slide 2 said: thousands of notes, zero connections visible. This slide says: the connections were always there. GeistFabrik makes them visible by asking questions drawn from the vault's own content.
