# Deck Spec

## Meta
- title: GeistFabrik
- purpose: showcase the project
- audience: developers and Obsidian users
- tone: serious, intellectual, restrained
- target-length: 7
- notes: no
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
  - center
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
- title: GeistFabrik
- subtitle: A divergence engine for Obsidian vaults.

### Slide 2
- kind: center-statement
- layout: center
- title: Muses, not oracles. Questions, not answers.

### Slide 3
- kind: default-content
- layout: default
- title: What it does
- body:
  - bullet: 57 default geists — 48 code + 9 Tracery grammars
  - bullet: Semantic search via 384-dim embeddings
  - bullet: Temporal embeddings track how understanding evolves
  - bullet: Session notes with linkable suggestions in your vault

### Slide 4
- kind: default-content
- layout: default
- title: Three ways to extend
- body:
  - bullet: Metadata inference — add custom note properties via Python modules
  - bullet: Vault functions — reusable query functions with @vault_function
  - bullet: Geists — full Python or declarative Tracery YAML grammars

### Slide 5
- kind: default-content
- layout: default
- title: Design principles
- body:
  - bullet: Sample, don't rank — avoid preferential attachment
  - bullet: Intermittent invocation — user-initiated, not continuous
  - bullet: Local-first — no network required, 100% private
  - bullet: Deterministic randomness — same date + vault = same output

### Slide 6
- kind: fact
- layout: fact
- title: 57
- subtitle: Default geists
- body: 48 code geists + 9 Tracery grammars. All local. All extensible.

### Slide 7
- kind: end
- layout: end
- title: Start exploring
- body: uv run geistfabrik init ~/your-vault
