# Deck Spec

## Meta
- title: GeistFabrik
- subtitle: A Divergence Engine for Obsidian Vaults
- purpose: introduce GeistFabrik's philosophy and architecture to developers and PKM enthusiasts
- audience: Obsidian users, tools-for-thought practitioners, developers curious about creative augmentation
- tone: precise, curious, grounded
- target-length: 7
- notes: yes
- style-preset: swiss-minimal
- project-url: https://github.com/adewale/geist_fabrik
- progress: segment-bar

## Source Materials
- readme: README.md (project overview -- what it does, 57 default geists, three-layer extensibility, privacy model)
- lessons-learned: LESSONS_LEARNED.md (design insight -- questions beat computed answers, Contradictor case study)
- status: STATUS.md (project health -- 611 tests, 99% complete, 16 modules, schema v6)

## Through-Line
- concept: "Muses, not oracles -- a well-asked question beats a poorly-computed answer."
- type: design-rule
- appears-in:
  - slide 1: cover -- the design rule is introduced as subtitle framing
  - slide 3: center-statement -- the Contradictor case study proves questions beat algorithms
  - slide 5: default-content -- extensibility layers show how questions compose with computation
  - slide 7: end -- the design rule resolves as an invitation

## Design Tokens
- colors:
  - bg: "#ffffff"
  - fg: "#1a1a2e"
  - accent: "#2563eb"
  - muted: "rgba(26, 26, 46, 0.45)"
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
  - center
  - default
  - section
  - fact
  - two-cols
  - end
- custom-layouts: []
- components: []
- css-files:
  - styles/tokens.css
  - styles/theme.css

## Slides

### Slide 1
- kind: cover
- layout: cover
- title: GeistFabrik
- subtitle: What happens when your notes ask the questions?
- notes:
  - GeistFabrik means "spirit factory" in German. The name signals its role -- manufacturing provocations, not answers.
  - Set the frame: this is about augmenting human thinking, not replacing it.

### Slide 2
- kind: fact
- layout: fact
- title: 611
- body: tests passing across 16 modules. 57 geists. Zero network calls.
- sources:
  - file:STATUS.md -- test count, module count, feature completeness
  - file:README.md -- privacy model, local-first architecture
- notes:
  - The "zero network calls" claim is the real headline. Everything runs locally with sentence-transformers.
  - 611 tests at 100% pass rate across unit and integration suites.

### Slide 3
- kind: center-statement
- layout: center
- title: The Contradictor taught us something
- body: 100 lines of Python to compute opposites. 10% success rate. 13 lines of Tracery to ask "What contradicts this?" 100% success rate.
- sources:
  - file:LESSONS_LEARNED.md -- Contradictor case study, code vs question comparison
- notes:
  - This is the war story. The Contradictor geist tried to algorithmically generate opposite note titles. It worked for "Benefits of Morning Routines" but failed for "Evergreen notes" and dates.
  - The fix: stop computing answers, start asking questions. A YAML template that says "What contradicts [[note]]?" works on any note title.

### Slide 4
- kind: default-content
- layout: two-cols
- title: Two Engines, One Pipeline
- left:
  - Code geists: Python with full VaultContext API
  - Graph ops, semantic search, temporal drift
  - Best when computation reveals structure
- right:
  - Tracery geists: YAML grammars with vault functions
  - Template variations, provocative questions
  - Best when human creativity exceeds algorithmic reach
- sources:
  - file:README.md -- code vs Tracery geist architecture
  - file:LESSONS_LEARNED.md -- when to use code vs Tracery decision framework
- notes:
  - The two engines are not competitors -- they compose. Vault functions written in Python can be called from Tracery grammars.
  - The pipeline runs both types through the same 4-stage filter: boundary, novelty, diversity, quality.

### Slide 5
- kind: default-content
- layout: default
- title: Three Dimensions of Extension
- bullets:
  - Metadata inference adds properties to notes
  - Vault functions create reusable queries
  - Geists compose both into provocations
- body: Each layer builds on the one below.
- sources:
  - file:README.md -- three-dimensional extensibility section
- notes:
  - Metadata inference adds computed properties (reading time, lexical diversity, sentence count). Vault functions wrap reusable queries behind a decorator. Geists compose both.
  - Non-programmers write Tracery geists that call functions written by developers.

### Slide 6
- kind: default-content
- layout: default
- title: The Data Flow
- body: A Mermaid diagram showing vault files through sync, embeddings, VaultContext, geist execution, filtering, to session notes.
- sources:
  - file:README.md -- architecture section, data flow diagram
- notes:
  - The pipeline is deterministic -- same date plus same vault equals same output. This is by design for reproducible sessions.
  - Incremental sync means only changed files are reprocessed. Batch embeddings are 15-20x faster than naive implementation.

### Slide 7
- kind: end
- layout: end
- title: A well-asked question beats a poorly-computed answer
- body: github.com/adewale/geist_fabrik
- notes:
  - Circle back to the through-line. The closing resolves the opening by restating the design principle that shapes every decision in the project.
  - The URL is secondary to the thesis. Let the principle linger.
