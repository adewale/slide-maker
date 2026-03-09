# Deck Spec

## Meta
- title: Geist Fabrik
- purpose: showcase a divergence engine that uses creative reasoning patterns instead of computation
- audience: developers and knowledge workers interested in AI-augmented thinking
- tone: philosophical, precise, curious
- target-length: 12
- notes: yes
- style-preset: editorial-dark
- project-url: https://github.com/adewale/geist_fabrik

## Source Materials
- readme: README.md (features, status, architecture overview, 57 default geists, 611 tests, privacy guarantees)
- lessons-learned: LESSONS_LEARNED.md (contradictor war story — algorithmic opposites at 10% vs questions at 100%, API consistency breaking change)
- specs: specs/geistfabrik_vision.md (philosophy — muses not oracles, diverge/converge loops, Gordon Brander inspiration, success metrics)
- architecture: docs/ARCHITECTURE.md (two-layer design — Vault + VaultContext, data flow, 384-dim embeddings via all-MiniLM-L6-v2)
- catalog: docs/GEIST_CATALOG.md (51 geists classified by pattern — 42 code + 9 Tracery, computational complexity, design principles)

## Through-Line
- concept: "A well-asked question is better than a poorly-computed answer"
- type: provocation
- appears-in:
  - slide 1: cover — subtitle poses the provocation
  - slide 2: statement — AI tools compute answers, creativity needs questions
  - slide 4: default — the algorithmic approach fails at 10% (poorly-computed answer)
  - slide 6: default — simple questions succeed at 100% (well-asked question)
  - slide 8: default/code — API consistency proves questions compose better than functions
  - slide 11: center — through-line resolution

## Design Tokens
- colors:
  - bg: "#151008"
  - fg: "#f5f0e8"
  - accent: "#f59e0b"
  - muted: "rgba(245, 240, 232, 0.5)"
- typography:
  - display: Playfair Display
  - body: Source Sans 3
  - mono: JetBrains Mono
- motion:
  - preset: restrained-fade

## Layout System
- prefer-builtins: true
- builtins:
  - cover
  - statement
  - section
  - default
  - center
  - fact
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
- title: Geist Fabrik
- subtitle: A well-asked question is better than a poorly-computed answer.

### Slide 2
- kind: opening-tension
- layout: statement
- transition: fade
- title: AI tools compute answers. Creativity needs divergent questions.
- body: LLMs converge on the most probable token. Creative thinking needs the opposite — unexpected connections, oblique angles, productive confusion.
- sources:
  - https://github.com/adewale/geist_fabrik/blob/main/specs/geistfabrik_vision.md — "Tarot for thought" and diverge/converge philosophy
  - https://github.com/adewale/geist_fabrik/blob/main/README.md — "muse, not an oracle" framing

### Slide 3
- kind: default
- layout: default
- transition: slide-left
- title: Geists are reasoning patterns, not algorithms
- body: 57 geists ship by default — 48 code geists for computation, 9 Tracery grammars for questions. Code when you need math. Grammars when you need provocation.
- sources:
  - https://github.com/adewale/geist_fabrik/blob/main/README.md — 57 default geists (48 code + 9 Tracery)
  - https://github.com/adewale/geist_fabrik/blob/main/docs/GEIST_CATALOG.md — classification by pattern

### Slide 4
- kind: war-story
- layout: default
- transition: slide-left
- title: The algorithmic approach
- body: Contradictor geist tried to compute opposites with 100+ lines of pattern matching. "Evergreen notes" became "The opposite of Evergreen notes." Success rate: ~10%.
- sources:
  - https://github.com/adewale/geist_fabrik/blob/main/LESSONS_LEARNED.md — contradictor war story, algorithmic opposite generation

### Slide 5
- kind: section-divider
- layout: section
- transition: morph-fade
- title: Muses, not oracles

### Slide 6
- kind: insight
- layout: default
- transition: slide-left
- title: Simple questions win
- body: 13 lines of YAML replaced 100+ lines of Python. "What contradicts [[note]]?" works for any note. Success rate: 100%.
- sources:
  - https://github.com/adewale/geist_fabrik/blob/main/LESSONS_LEARNED.md — question approach at 100% success rate

### Slide 7
- kind: comparison
- layout: default
- transition: slide-left
- title: Computation vs. questions
- body: Comparison of algorithmic approach (v-mark.strike) with questioning approach. Lines, maintenance, success rate, divergence quality, user engagement.
- sources:
  - https://github.com/adewale/geist_fabrik/blob/main/LESSONS_LEARNED.md — complexity comparison table

### Slide 8
- kind: code
- layout: default
- transition: slide-left
- title: API consistency
- body: Breaking change from two-pattern API to unified bracketed links. 7 functions, 7 Tracery geists updated. Consistent API means questions compose cleanly.
- sources:
  - https://github.com/adewale/geist_fabrik/blob/main/LESSONS_LEARNED.md — API consistency lesson, commits 3efc96c and d080f66

### Slide 9
- kind: default
- layout: default
- transition: slide-left
- title: Embeddings and semantic sampling
- body: 384-dim vectors via all-MiniLM-L6-v2. Sampling, not ranking — weighted random draw from embedding space avoids preferential attachment.
- sources:
  - https://github.com/adewale/geist_fabrik/blob/main/README.md — sentence-transformers, 384-dim embeddings
  - https://github.com/adewale/geist_fabrik/blob/main/docs/ARCHITECTURE.md — all-MiniLM-L6-v2, cosine similarity

### Slide 10
- kind: fact
- layout: fact
- transition: fade
- title: "611"
- subtitle: tests passing. 57 geists. Zero cloud dependencies.
- sources:
  - https://github.com/adewale/geist_fabrik/blob/main/README.md — 611 tests, 57 geists, 100% local
  - https://github.com/adewale/geist_fabrik/blob/main/STATUS.md — test counts and status

### Slide 11
- kind: through-line-resolution
- layout: center
- transition: fade
- title: A well-asked question is better than a poorly-computed answer
- body: The geist's job is not to know the answer. Its job is to ask questions you would not ask yourself.
- sources:
  - https://github.com/adewale/geist_fabrik/blob/main/LESSONS_LEARNED.md — the principle stated
  - https://github.com/adewale/geist_fabrik/blob/main/specs/geistfabrik_vision.md — muses not oracles philosophy

### Slide 12
- kind: end
- layout: end
- transition: fade
- title: The best tool for thought is not the one that thinks for you.
