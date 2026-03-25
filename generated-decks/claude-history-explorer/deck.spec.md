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
- concept: "Your Claude conversations contain patterns you cannot see. This tool makes them visible."
- shape: boy-meets-girl
- type: problem-resolution
- appears-in:
  - slide 2: default — name the problem: hundreds of conversations in JSONL, zero visibility into patterns
  - slide 4: center — the classify() function as the mechanism that turns timestamps into visible patterns
  - slide 6: default — how threshold arithmetic surfaces personality traits from session metadata
  - slide 8: default — the trust model as a consequence of read-only, offline, deterministic design
  - slide 9: default — build toward resolution: the patterns were always in the JSONL
  - slide 10: end — resolve: "The patterns were always in the JSONL. Now you can see them."

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
- title: Hundreds of conversations. Zero visibility.
- body: You have months of Claude conversations sitting in ~/.claude/projects/ as JSONL files. Session lengths, message rates, tool usage patterns, time-of-day habits -- all recorded, none of it visible. How long are your typical sessions? Are you delegating more over time? The data exists, but you have never looked. What if you could see the patterns?
- sources:
  - https://github.com/adewale/claude-history-explorer/blob/main/claude_history_explorer/parser.py — JSONL parsing of conversation logs
  - https://github.com/adewale/claude-history-explorer/blob/main/claude_history_explorer/models.py — SessionInfo dataclass

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
- kind: default-content
- layout: default
- title: The patterns were always in the JSONL
- body: Six lines of classify(). Three dependencies. Read-only access. No network. No AI. The data was always there -- session lengths, message rates, time-of-day habits, delegation ratios. Now you can see them.
- notes:
  - Build toward the closing resolution. The patterns were not created by the tool -- they were surfaced from data that was already being recorded.

### Slide 10
- kind: end
- layout: end
- title: The patterns were always in the JSONL. Now you can see them.
- subtitle: github.com/adewale/claude-history-explorer
- notes:
  - Resolve the through-line. Slide 2 said: hundreds of conversations, zero visibility. This slide says: the patterns were always there. The tool surfaces structure that the JSONL files already contained.
