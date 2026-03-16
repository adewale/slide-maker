# Deck Spec

## Meta
- title: Claude History Explorer
- purpose: showcase a CLI tool that earns trust through radical transparency and read-only guarantees
- audience: developers and Claude users interested in conversation data exploration
- tone: calm, confident, transparent
- target-length: 11
- notes: yes
- style-preset: editorial-dark
- project-url: https://github.com/adewale/claude-history-explorer

## Source Materials
- readme: README.md (features, commands, installation, streaming JSONL, read-only design)
- trust: TRUST.md (5 trust guarantees — read-only, no network, open source, minimal deps, scoped reads)
- changelog: CHANGELOG.md (v0.1.0 initial release — 10 commands, story generation, concurrent detection, wrapped annual summaries)
- architecture: docs/ARCHITECTURE.md (3-layer architecture — 11 modules; streaming JSONL; read-only data access pattern)
- wrapped-arch: docs/WRAPPED_ARCHITECTURE.md (V3 wrapped format with heatmaps, trait scores, token tracking)

## Through-Line
- concept: "Read-only means zero risk"
- type: design-rule
- appears-in:
  - slide 1: cover — subtitle introduces the read-only guarantee
  - slide 2: statement — tension about trusting tools with conversation data
  - slide 3: default — 5 trust guarantees, read-only is first
  - slide 5: section — through-line named explicitly
  - slide 8: default — Wrapped feature maintains trust contract (no network, decodable URLs)
  - slide 9: default — minimal deps reinforce read-only (no file/network libraries)
  - slide 11: end — resolution echoes read-only promise

## Design Tokens
- colors:
  - bg: "#0f1219"
  - fg: "#e2e8f0"
  - accent: "#38bdf8"
  - muted: "rgba(226, 232, 240, 0.5)"
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
- title: Claude History Explorer
- subtitle: Read-only exploration of your Claude Code conversations.

### Slide 2
- kind: opening-tension
- layout: statement
- transition: fade
- title: Your conversations contain proprietary code, architecture decisions, and accidental secrets
- body: Any tool that reads them must earn trust before it runs.
- sources:
  - https://github.com/adewale/claude-history-explorer/blob/main/TRUST.md — the trust question and threat model

### Slide 3
- kind: trust-guarantees
- layout: default
- transition: slide-up
- title: Five guarantees
- body: v-clicks list of 5 trust guarantees from TRUST.md — read-only, no network, open source, minimal deps, scoped reads
- sources:
  - https://github.com/adewale/claude-history-explorer/blob/main/TRUST.md — all 5 guarantees with enforcement and verification methods

### Slide 4
- kind: code
- layout: default
- transition: slide-up
- title: Read-only enforcement
- body: Code showing verification — grep for write ops, no write imports, automated static analysis test
- sources:
  - https://github.com/adewale/claude-history-explorer/blob/main/TRUST.md — Guarantee #1 enforcement details
  - https://github.com/adewale/claude-history-explorer/blob/main/docs/ARCHITECTURE.md — read-only data access pattern

### Slide 5
- kind: section-divider
- layout: section
- transition: iris
- title: Read-only means zero risk

### Slide 6
- kind: feature
- layout: default
- transition: slide-left
- title: Stories from conversations
- body: Story generation pipeline — session discovery, pattern analysis, personality classification, narrative output
- sources:
  - https://github.com/adewale/claude-history-explorer/blob/main/README.md — story command with brief/detailed/timeline formats
  - https://github.com/adewale/claude-history-explorer/blob/main/docs/ARCHITECTURE.md — story generation pipeline

### Slide 7
- kind: feature
- layout: default
- transition: slide-left
- title: Concurrent Claude detection
- body: Streaming JSONL parsing, overlapping session detection, lazy loading for performance
- sources:
  - https://github.com/adewale/claude-history-explorer/blob/main/README.md — concurrent Claude detection and streaming JSONL
  - https://github.com/adewale/claude-history-explorer/blob/main/docs/ARCHITECTURE.md — streaming JSONL and lazy loading performance

### Slide 8
- kind: feature
- layout: default
- transition: slide-up
- title: Wrapped — your year in Claude Code
- body: Shareable annual summary URL with heatmaps, trait scores, distributions, token tracking; all data encoded in URL, nothing stored server-side
- sources:
  - https://github.com/adewale/claude-history-explorer/blob/main/README.md — wrapped command options
  - https://github.com/adewale/claude-history-explorer/blob/main/TRUST.md — Wrapped privacy model
  - https://github.com/adewale/claude-history-explorer/blob/main/claude_history_explorer/wrapped.py — V3 implementation

### Slide 9
- kind: deps
- layout: default
- transition: slide-up
- title: Five dependencies
- body: click (CLI), rich (formatting), sparklines (charts), msgpack (binary encoding), pyperclip (clipboard) — no HTTP libraries, no network ops
- sources:
  - https://github.com/adewale/claude-history-explorer/blob/main/TRUST.md — Guarantee #4 minimal dependencies
  - https://github.com/adewale/claude-history-explorer/blob/main/pyproject.toml — 5 runtime dependencies

### Slide 10
- kind: fact
- layout: fact
- transition: fade
- title: "~4,600 lines"
- subtitle: of Python across eleven modules. Still auditable in a day.
- sources:
  - https://github.com/adewale/claude-history-explorer/blob/main/claude_history_explorer/ — 11 modules totaling ~4,600 lines

### Slide 11
- kind: end
- layout: end
- transition: fade
- title: You don't have to trust us. The code is small enough to read.
