# Deck Spec

## Meta
- title: Claude History Explorer
- purpose: showcase a CLI tool that earns trust through radical transparency and read-only guarantees
- audience: developers and Claude users interested in conversation data exploration
- tone: calm, confident, transparent
- target-length: 10
- notes: yes
- style-preset: editorial-dark
- project-url: https://github.com/adewale/claude-history-explorer

## Source Materials
- readme: README.md (features, commands, installation, streaming JSONL, read-only design)
- trust: TRUST.md (5 trust guarantees — read-only, no network, open source, minimal deps, scoped reads)
- changelog: CHANGELOG.md (v0.1.0 initial release — 10 commands, story generation, concurrent detection)
- architecture: docs/ARCHITECTURE.md (3-layer architecture — data models, business logic, CLI; streaming JSONL; read-only data access pattern)

## Through-Line
- concept: "Read-only means zero risk"
- type: design-rule
- appears-in:
  - slide 1: cover — subtitle introduces the read-only guarantee
  - slide 2: statement — tension about trusting tools with conversation data
  - slide 3: default — 5 trust guarantees, read-only is first
  - slide 5: section — through-line named explicitly
  - slide 8: default — minimal deps reinforce read-only (no file/network libraries)
  - slide 10: end — resolution echoes read-only promise

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
- kind: deps
- layout: default
- transition: slide-up
- title: Three dependencies
- body: click (CLI), rich (formatting), sparklines (charts) — all formatting, no file/network ops
- sources:
  - https://github.com/adewale/claude-history-explorer/blob/main/TRUST.md — Guarantee #4 minimal dependencies table
  - https://github.com/adewale/claude-history-explorer/blob/main/docs/ARCHITECTURE.md — core dependencies section

### Slide 9
- kind: fact
- layout: fact
- transition: fade
- title: "~2,600 lines"
- subtitle: of Python. Small enough to audit in an afternoon.
- sources:
  - https://github.com/adewale/claude-history-explorer/blob/main/TRUST.md — Guarantee #3: "Total: ~2,600 lines of Python"

### Slide 10
- kind: end
- layout: end
- transition: fade
- title: You don't have to trust us. The code is small enough to read.
