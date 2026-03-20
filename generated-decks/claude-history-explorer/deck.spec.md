# Deck Spec

## Meta
- title: Claude History Explorer
- subtitle: Python CLI tool to explore, search and visualise your Claude Code conversation history
- purpose: present a developer tool that analyzes AI conversations using zero AI
- audience: developers who use Claude Code and are curious about their usage patterns
- tone: sharp, curious, technically grounded
- target-length: 9
- notes: yes
- style-preset: editorial-dark
- progress: segment-bar
- project-url: https://github.com/adewale/claude-history-explorer

## Source Materials
- readme: README.md (project overview — CLI commands, installation, JSONL format)
- architecture: docs/ARCHITECTURE.md (three-layer architecture — data models, business logic, CLI)
- trust: TRUST.md (read-only guarantee, no network calls, minimal dependencies, auditable)
- faq: FAQ.md (personality trait classification, concurrent detection, work types)
- changelog: CHANGELOG.md (v0.1.0 initial release with 9 commands)
- roadmap: ROADMAP.md (Wrapped feature — URL encoding, Cloudflare Workers website, social cards)
- constants: claude_history_explorer/constants.py (threshold values for personality classification)
- stories: claude_history_explorer/stories.py (narrative generation — deterministic arithmetic)
- models: claude_history_explorer/models.py (dataclasses — Message, Session, Project, WrappedStoryV3)
- wrapped: claude_history_explorer/wrapped.py (V3 wrapped format — heatmaps, distributions, fingerprints)

## Through-Line
- concept: "Deterministic arithmetic on timestamps — personality without AI"
- type: provocation
- appears-in:
  - slide 2: default — introduce the paradox: an AI tool analyzer that uses no AI
  - slide 4: center — the classify() function as the mechanism behind the provocation
  - slide 6: default — how threshold arithmetic produces rich narratives
  - slide 8: center — the trust model as a consequence of the deterministic philosophy
  - slide 9: end — resolve with the full provocation

## Design Tokens
- colors:
  - bg: "#0a0a0f"
  - fg: "#e8e6e1"
  - accent: "#38bdf8"
  - accent-alt: "#a78bfa"
  - muted: "rgba(232, 230, 225, 0.45)"
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
  - section
  - default
  - center
  - fact
  - end
- custom-layouts: []
- components:
  - ProgressSegmentBar
  - KeyboardHelp
- css-files:
  - styles/tokens.css
  - styles/theme.css
  - styles/transitions.css

## Slides

### Slide 1
- kind: cover
- layout: cover
- title: Claude History Explorer
- subtitle: Python CLI tool to explore, search and visualise your Claude Code conversation history
- notes:
  - Open with the project identity. The subtitle is the README description verbatim.
  - The GitHub URL appears below the subtitle.

### Slide 2
- kind: default-content
- layout: default
- title: An AI Tool Analyzer That Uses Zero AI
- body: Claude History Explorer reads ~/.claude/projects/ JSONL files and turns raw conversation logs into searchable sessions, statistics, and personality narratives. Every classification — "Heavy delegation", "Marathon sessions", "Rapid-fire development" — comes from deterministic threshold arithmetic on timestamps and message counts. No LLM calls. No embeddings. No inference.
- sources:
  - https://github.com/adewale/claude-history-explorer/blob/main/claude_history_explorer/stories.py — personality classification via threshold arithmetic
  - https://github.com/adewale/claude-history-explorer/blob/main/claude_history_explorer/constants.py — threshold constants

### Slide 3
- kind: section
- layout: section
- title: Architecture
- subtitle: Three layers, 2600 lines, three dependencies

### Slide 4
- kind: default-content
- layout: default
- title: The classify() Function Does All the Work
- body: A single 6-line function maps every personality trait. It takes a numeric value (messages per hour, session length, agent ratio), walks a threshold list, and returns the first label that matches. No machine learning. No heuristics. Just if-then on numbers the user already generated.
- sources:
  - https://github.com/adewale/claude-history-explorer/blob/main/claude_history_explorer/utils.py — classify() function
  - https://github.com/adewale/claude-history-explorer/blob/main/claude_history_explorer/constants.py — MESSAGE_RATE_HIGH=30, SESSION_LENGTH_LONG=2.0, etc.

### Slide 5
- kind: fact
- layout: fact
- title: 3
- body: Runtime dependencies. click for the CLI, rich for terminal formatting, sparklines for ASCII charts. No HTTP libraries. No AI libraries. The tool works identically offline.
- sources:
  - https://github.com/adewale/claude-history-explorer/blob/main/pyproject.toml — dependency list

### Slide 6
- kind: default-content
- layout: default
- title: From Timestamps to Personality Traits
- body: The story generator collects SessionInfo objects, computes agent ratio, messages per hour, average session length, and concurrent instance count. Each metric feeds into classify() with constants from constants.py. The result — "Agent-driven, Deep-work focused, High-intensity" — reads like a personality test. It is deterministic arithmetic.
- sources:
  - https://github.com/adewale/claude-history-explorer/blob/main/claude_history_explorer/stories.py — generate_project_story() pipeline
  - https://github.com/adewale/claude-history-explorer/blob/main/claude_history_explorer/models.py — SessionInfo, ProjectStory dataclasses

### Slide 7
- kind: section
- layout: section
- title: Wrapped
- subtitle: A shareable URL with no server-side storage

### Slide 8
- kind: default-content
- layout: default
- title: Read-Only, Offline, Auditable
- body: The tool never writes to ~/.claude/. It never makes network calls. The entire codebase is 2600 lines of Python — auditable in an afternoon. The Wrapped feature encodes aggregate stats into a URL with msgpack + base64. The website decodes on the fly. Nothing is stored. The trust model is a direct consequence of the deterministic philosophy — when your tool does no inference, it needs no data pipeline.
- sources:
  - https://github.com/adewale/claude-history-explorer/blob/main/TRUST.md — five guarantees (read-only, no network, open source, minimal deps, wrapped privacy)
  - https://github.com/adewale/claude-history-explorer/blob/main/claude_history_explorer/wrapped.py — URL encoding with msgpack

### Slide 9
- kind: end
- layout: end
- title: Personality without AI. Trust without complexity.
- subtitle: github.com/adewale/claude-history-explorer
- notes:
  - Resolve the through-line. The project proves you can extract meaningful personality insights from AI conversation data using nothing but arithmetic on timestamps. That constraint is what makes the trust model possible.
