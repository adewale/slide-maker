# Deck Spec

## Meta
- title: GeistFabrik
- subtitle: A Python-based divergence engine for Obsidian vaults
- purpose: introduce GeistFabrik's philosophy and architecture to developers who use Obsidian
- audience: Obsidian power users, PKM enthusiasts, developers interested in tools for thought
- tone: precise, curious, grounded
- target-length: 7
- notes: yes
- style-preset: swiss-minimal
- project-url: https://github.com/adewale/geist_fabrik
- progress: segment-bar

## Source Materials
- readme: README.md (factual backbone -- what it does, how to run, feature inventory, design philosophy)
- lessons-learned: LESSONS_LEARNED.md (the "muses not oracles" insight -- questions beat computed answers)

## Through-Line
- concept: "A well-asked question is better than a poorly-computed answer."
- type: design-rule
- appears-in:
  - slide 1: cover -- the project's identity and what it is
  - slide 3: center-statement -- the design rule stated directly
  - slide 5: default-content -- muses not oracles in practice via Tracery vs code
  - slide 7: end -- the rule as resolution

## Design Tokens
- colors:
  - bg: "#ffffff"
  - fg: "#1a1a2e"
  - accent: "#4a6741"
  - accent-alt: "#7a5c3a"
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
  - section
  - default
  - center
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
- subtitle: A Python-based divergence engine for Obsidian vaults
- notes:
  - GeistFabrik means "spirit factory" in German. Open by establishing what this project actually is before anything else.

### Slide 2
- kind: default-content
- layout: default
- title: What GeistFabrik is and why it exists
- body: |
  GeistFabrik (German for "spirit factory") generates creative suggestions through both code and Tracery grammars. It is a tool for thought that acts as a muse, not an oracle -- offering provocative "What if...?" questions rather than prescriptive answers.

  Inspired by Gordon Brander's work on tools for thought.
- sources:
  - file:README.md -- first paragraph description and attribution
- notes:
  - This slide grounds the audience. The first paragraph from the README appears verbatim. Emphasize the "muse, not an oracle" framing -- this is the core philosophy.

### Slide 3
- kind: center-statement
- layout: center
- title: A WELL-ASKED QUESTION IS BETTER THAN A POORLY-COMPUTED ANSWER
- subtitle: The design rule that shaped every geist
- sources:
  - file:LESSONS_LEARNED.md -- the "muses not oracles" principle
- notes:
  - This is the through-line. Pause here. The caps are deliberate -- one-per-section emphasis per PRESENTATION_PHILOSOPHY principle 5.

### Slide 4
- kind: fact
- layout: fact
- title: "57"
- subtitle: Default geists
- body: 48 code + 9 Tracery. 611 tests passing. Zero external API calls.
- sources:
  - file:README.md -- status section (version 0.9.0, geist count, test count)
- notes:
  - The 57 geists ship out of the box. The "zero external API calls" reinforces local-first. 611 tests is the real number from the README status section.

### Slide 5
- kind: comparison
- layout: two-cols
- title: Code geist vs Tracery geist
- left:
  - "Code: 100+ lines of pattern matching"
  - "Contradictor tried to compute opposites"
  - "Success rate: ~10%"
- right:
  - "Tracery: 13 lines of YAML"
  - "Just asks: 'What contradicts this note?'"
  - "Success rate: 100%"
- sources:
  - file:LESSONS_LEARNED.md -- Contradictor geist comparison (code vs question approach)
- notes:
  - The Contradictor war story from LESSONS_LEARNED.md. The code approach failed because it tried to compute answers. The Tracery approach succeeded because it asked questions. This is the through-line in action.

### Slide 6
- kind: default-content
- layout: default
- title: The data flow
- body: Mermaid diagram showing vault files through sync, embeddings, geist execution, filtering, and session notes
- sources:
  - file:README.md -- architecture section, data flow diagram
- notes:
  - Walk through the pipeline. Vault files are read-only. Everything stays local. The output is a linkable Obsidian note.

### Slide 7
- kind: end
- layout: end
- title: Muses, not oracles
- subtitle: GeistFabrik asks questions so you can find answers
- notes:
  - Circle back to the through-line. The closing echoes the opening philosophy. Do not end with an install command.
