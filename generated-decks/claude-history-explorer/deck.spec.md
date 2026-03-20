# Deck Spec

## Meta
- title: Claude History Explorer
- purpose: present a Python CLI tool that turns raw Claude Code conversation history into searchable insights and narrative stories
- audience: developers who use Claude Code daily and want to understand their coding patterns
- tone: sharp, grounded, trust-conscious
- target-length: 7
- notes: yes
- style-preset: editorial-dark
- project-url: https://github.com/adewale/claude-history-explorer
- progress: segment-bar

## Source Materials
- readme: README.md (factual backbone -- what it does, CLI commands, installation, how Claude Code stores history)
- architecture: docs/ARCHITECTURE.md (three-layer architecture -- data models, business logic, CLI; read-only data flow; story generation pipeline)
- trust: TRUST.md (read-only guarantee, no network calls, minimal dependencies, privacy model)
- changelog: CHANGELOG.md (v0.1.0 initial release with 9 commands, story generation, data models)
- roadmap: ROADMAP.md (Wrapped feature -- shareable year-in-review URLs with Cloudflare edge rendering)
- wrapped-arch: docs/WRAPPED_ARCHITECTURE.md (URL anatomy, privacy architecture, Cloudflare primitives)

## Through-Line
- concept: "Read-only to your history. Never silent about what it reads."
- type: design-rule
- appears-in:
  - slide 2: default-content -- introduces the read-only principle as the project's foundation
  - slide 4: section -- "read-only by design" as a trust mechanism, verified by tests
  - slide 5: default-content -- the Wrapped feature encodes stats into the URL, stores nothing
  - slide 7: end -- resolution: the tool that reads everything writes nothing

## Design Tokens
- colors:
  - bg: "#0a0a0f"
  - fg: "#e8e4df"
  - accent: "#38bdf8"
  - muted: "rgba(232, 228, 223, 0.45)"
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
- components: []
- css-files:
  - styles/tokens.css
  - styles/theme.css
  - styles/transitions.css

## Slides

### Slide 1
- kind: cover
- layout: cover
- title: Claude History Explorer
- subtitle: A Python CLI tool to explore, search and visualise your Claude Code conversation history
- notes:
  - The subtitle is the project's actual description from its README first paragraph. The through-line appears starting in slide 2.

### Slide 2
- kind: default-content
- layout: default
- title: What it is and why it exists
- body: A Python CLI tool to explore, search and visualise your Claude Code conversation history. The history is stored locally at ~/.claude/projects/ and this tool turns raw JSONL files into searchable conversations and insights about your coding journey.
- sources:
  - https://github.com/adewale/claude-history-explorer/blob/main/README.md -- project overview, storage format, feature list
  - https://github.com/adewale/claude-history-explorer/blob/main/TRUST.md -- read-only and no-network guarantees
- notes:
  - This slide establishes what the project IS and WHY before any architecture. The verbatim README description appears here. Read-only + no-network is the trust foundation everything else builds on.

### Slide 3
- kind: fact
- layout: fact
- title: ~2,600 lines of Python. 3 runtime dependencies.
- body: click, rich, sparklines. Small enough to audit in an afternoon.
- sources:
  - https://github.com/adewale/claude-history-explorer/blob/main/TRUST.md -- "Total: ~2,600 lines of Python" and dependency table
  - https://github.com/adewale/claude-history-explorer/blob/main/pyproject.toml -- dependency list
- notes:
  - The small codebase is not incidental -- it is a trust mechanism. 2,600 lines is auditable. The 3 dependencies (click, rich, sparklines) are all output-formatting libraries with zero file or network capability.

### Slide 4
- kind: section
- layout: section
- title: Read-only by design
- notes:
  - Through-line echo. The read-only guarantee is enforced three ways: code design (all opens use 'r' mode), no write imports (no shutil, os.remove), and automated static analysis tests. This is not a policy -- it is a verifiable property.

### Slide 5
- kind: default-content
- layout: default
- title: Nine commands, zero writes
- body: projects, sessions, show, search, export, stats, summary, story, wrapped. Personality insights, concurrency detection, shareable year-in-review URLs. Every operation reads JSONL and renders output.
- sources:
  - https://github.com/adewale/claude-history-explorer/blob/main/README.md -- command inventory and usage
  - https://github.com/adewale/claude-history-explorer/blob/main/docs/WRAPPED_ARCHITECTURE.md -- URL encoding, privacy architecture
- notes:
  - The story command detects concurrent Claude instances, classifies personality traits, and generates timeline sparklines. The wrapped command is the social feature -- it creates a shareable URL where all data lives in the URL itself, not on a server. The privacy model is URL-as-database.

### Slide 6
- kind: default-content
- layout: default
- title: The architecture is the argument
- body: Three layers (CLI, Business Logic, Data Models) with a strict read-only data access pattern. JSONL files stream line-by-line -- no full file loading. Story generation pipeline flows from session discovery through pattern analysis to personality classification.
- sources:
  - https://github.com/adewale/claude-history-explorer/blob/main/docs/ARCHITECTURE.md -- three-layer architecture, data flow, story generation pipeline
- notes:
  - The streaming JSONL approach handles large history files efficiently. The story generation pipeline is the most interesting part architecturally: it classifies work intensity, collaboration style, and personality traits from session metadata alone.

### Slide 7
- kind: end
- layout: end
- title: The tool that reads everything writes nothing.
- subtitle: That is the entire trust model.
- notes:
  - Resolution of the through-line. The closing echoes the design-rule: read-only to your history, never silent about what it reads. The trust model is not a promise -- it is a testable property of 2,600 lines of code.

## Notes Policy
- every content slide has presenter notes with 2+ sentences of delivery context
- every factual slide has a Sources block citing the specific project document
