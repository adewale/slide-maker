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
- concept: "Muses, not oracles"
- type: design-rule
- appears-in:
  - slide 1: cover -- the project is named as a spirit factory, hinting at generative muses
  - slide 3: center-statement -- the principle is stated as the governing design rule
  - slide 5: default-content -- Tracery geists embody the muse principle by asking questions
  - slide 6: center-statement -- the surprising finding: 13 lines of YAML outperformed 100+ lines of Python
  - slide 8: default-content -- deterministic randomness makes the muse reproducible
  - slide 9: end -- the resolution: the geist's job is to ask questions you would not ask yourself

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
- title: What GeistFabrik does
- body:
  - Parses Obsidian vaults into SQLite with 384-dim embeddings
  - 57 geists (48 Python, 9 YAML) ask "What if...?" questions
  - 4-stage filtering samples ~5 suggestions per session
  - 100% local, read-only, deterministic -- same date = same output
- sources:
  - file:README.md -- feature inventory, 57 default geists count, filtering pipeline
  - file:docs/ARCHITECTURE.md -- two-layer design, session orchestrator flow
- notes:
  - The 384-dim embeddings come from all-MiniLM-L6-v2 via sentence-transformers, bundled locally -- no API calls.
  - "Deterministic randomness" means the RNG is seeded by session date. Same vault state on the same date always produces identical suggestions. This is crucial for debugging and replay.

### Slide 3
- kind: center-statement
- layout: center
- title: Muses, not oracles
- body: Geists provoke thinking. They do not pretend to think for you.
- sources:
  - file:LESSONS_LEARNED.md -- "Muses, not oracles" principle
  - file:specs/geistfabrik_vision.md -- Gordon Brander's "tarot for thought" vision
- notes:
  - Gordon Brander described building "a creative oracle that helps provoke ideas... More tarot than flash cards." GeistFabrik grounds this in a concrete, extensible system.
  - The name "Geists" also invokes Hegel's owl of Minerva -- wisdom comes from reflecting on what has already occurred. Geists work retrospectively, finding patterns in accumulated knowledge.

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
- kind: end
- layout: end
- title: The geist's job is to ask questions you would not ask yourself
- body: github.com/adewale/geist_fabrik
- sources:
  - file:LESSONS_LEARNED.md -- concluding principle from the Contradictor case study
- notes:
  - This line comes directly from the Lessons Learned document. It is the resolution of the "muses, not oracles" through-line.
  - GeistFabrik is at v0.9.0, approaching 1.0. 611 passing tests, 57 default geists, feature-complete. The project is ready for adventurous users.
