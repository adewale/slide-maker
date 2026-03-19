# Deck Spec

## Meta
- title: Claude History Explorer
- subtitle: Your conversations have a story. This tool reads it.
- purpose: present a CLI tool that turns raw Claude Code conversation history into searchable insights, narratives, and shareable wrapped stories
- audience: developers who use Claude Code daily and have never looked at their ~/.claude directory
- tone: direct, curious, grounded
- target-length: 7
- notes: no
- style-preset: editorial-dark
- project-url: https://github.com/adewale/claude-history-explorer
- progress: segment-bar

## Source Materials
- readme: README.md (feature inventory -- 10 commands, installation, data model, JSONL parsing)
- trust: TRUST.md (trust model -- read-only guarantee, no network calls, 3 dependencies, 2600 lines)
- changelog: CHANGELOG.md (v0.1.0 initial release -- full feature list, data models, safety guarantees)
- faq: FAQ.md (personality traits, concurrent detection, agent vs main sessions, other-agent feasibility)
- roadmap: ROADMAP.md (Wrapped feature -- CLI encoding, Cloudflare Workers website, OG image generation, privacy model)
- package: pyproject.toml (3 runtime deps: click, rich, sparklines; plus msgpack and pyperclip for wrapped)

## Through-Line
- concept: "Read-only to your history. Read everything about your habits."
- type: provocation
- appears-in:
  - slide 1: cover -- the provocation is introduced
  - slide 3: center -- read-only is not a limitation, it is a trust contract
  - slide 5: default -- the wrapped feature reads patterns without reading content
  - slide 6: section -- the trust model resolves the tension between access and privacy
  - slide 7: end -- the provocation is resolved

## Design Tokens
- colors:
  - bg: "#0a0a0f"
  - fg: "#e8e4df"
  - accent: "#38bdf8"
  - muted: "#6b6b76"
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
  - two-cols
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
- subtitle: Your conversations have a story. This tool reads it.

### Slide 2
- kind: fact
- layout: fact
- title: 2,600 lines of Python. 3 dependencies. Zero network calls.
- body: A CLI that parses ~/.claude/projects/ and turns JSONL session files into searchable conversations, statistics, and narrative insights.
- sources:
  - https://github.com/adewale/claude-history-explorer/blob/main/TRUST.md -- codebase size claim and dependency count
  - https://github.com/adewale/claude-history-explorer/blob/main/pyproject.toml -- click, rich, sparklines as runtime deps

### Slide 3
- kind: center-statement
- layout: center
- title: Read-only by design
- body: No write operations. No shutil. No os.remove. Enforced by static analysis tests that fail if write patterns appear in the source.
- sources:
  - https://github.com/adewale/claude-history-explorer/blob/main/TRUST.md -- read-only guarantee section, grep verification commands

### Slide 4
- kind: default-content
- layout: two-cols
- title: Ten commands, one history
- left:
  - bullet: projects -- list all Claude Code projects
  - bullet: sessions -- list sessions for a project
  - bullet: show -- display messages from a session
  - bullet: search -- regex across all conversations
  - bullet: export -- markdown, JSON, or text
- right:
  - bullet: info -- storage location and usage
  - bullet: stats -- message counts, duration, agents
  - bullet: summary -- charts and sparklines
  - bullet: story -- personality traits and patterns
  - bullet: wrapped -- shareable year-in-review URL
- sources:
  - https://github.com/adewale/claude-history-explorer/blob/main/README.md -- command inventory and usage examples

### Slide 5
- kind: default-content
- layout: default
- title: The story command finds what you missed
- body:
  - bullet: Detects concurrent Claude instances running in parallel
  - bullet: Classifies style -- heavy delegation vs hands-on
  - bullet: Measures pace -- messages per hour, session duration
  - bullet: Wrapped encodes stats into a URL, nothing stored
- sources:
  - https://github.com/adewale/claude-history-explorer/blob/main/README.md -- story command output example
  - https://github.com/adewale/claude-history-explorer/blob/main/FAQ.md -- personality trait definitions

### Slide 6
- kind: section
- layout: section
- title: Trust is verifiable, not promised

### Slide 7
- kind: end
- layout: end
- title: Read-only to your history. Read everything about your habits.
- subtitle: 2,600 lines. Verify it yourself.
