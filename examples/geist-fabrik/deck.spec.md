# Deck Spec

## Meta
- title: GeistFabrik
- purpose: showcase the project
- audience: developers and Obsidian users
- tone: serious, intellectual, restrained
- target-length: 9
- notes: yes
- style-preset: editorial-dark

## Design Tokens
- colors:
  - bg: "#151008"
  - fg: "#f5f0e8"
  - accent: "#f59e0b"
  - muted: "rgba(245, 240, 232, 0.5)"
- typography:
  - display: Inter Tight
  - body: Inter
  - mono: JetBrains Mono
- motion:
  - preset: restrained-fade

## Layout System
- prefer-builtins: true
- builtins:
  - cover
  - statement
  - quote
  - default
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
- transition: fade
- title: GeistFabrik
- subtitle: A divergence engine for Obsidian vaults.
- notes: yes

### Slide 2
- kind: statement
- layout: statement
- transition: slide-left
- title: AI tools give answers. Creativity needs divergent questions.
- body: LLMs are convergent by design. Creative thinking needs unexpected connections, oblique angles, surprising juxtapositions. That's what a muse does.

### Slide 3
- kind: quote
- layout: quote
- transition: fade
- title: Muses, not oracles. Questions, not answers.

### Slide 4
- kind: code
- layout: default
- transition: slide-up
- title: A geist definition
- body: YAML Tracery grammar definition for the bridge-builder geist. Shows declarative rule structure with vault-data interpolation.
- notes: yes

### Slide 5
- kind: default-content
- layout: default
- transition: slide-left
- title: What a geist session produces
- body: Concrete example of a session note with divergent question output and linked suggestions. v-mark highlights the divergent output line.
- features:
  - v-mark

### Slide 6
- kind: diagram
- layout: default
- transition: fade
- title: How a geist runs
- body: Mermaid LR pipeline — Vault Notes, Embeddings, Semantic Sampling, Geist, Session Note.
- features:
  - v-motion

### Slide 7
- kind: default-content
- layout: default
- transition: slide-up
- title: Four guardrails
- body:
  - bullet: Sample, don't rank — avoid preferential attachment
  - bullet: Intermittent invocation — user-initiated, not continuous
  - bullet: Local-first — no network required, 100% private
  - bullet: Deterministic randomness — same date + vault = same output
- features:
  - v-clicks
  - v-mark on Local-first
  - hover-lift interactive styling
- notes: yes

### Slide 8
- kind: fact
- layout: fact
- transition: fade
- title: 57
- subtitle: geists, 384-dim embeddings, 0 cloud dependencies
- body: 48 code geists + 9 Tracery grammars. All local. All extensible. All deterministic.

### Slide 9
- kind: end
- layout: end
- transition: slide-left
- title: Start exploring
- body: uv run geistfabrik init ~/your-vault
