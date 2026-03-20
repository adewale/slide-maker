# Deck Spec

## Meta
- title: Claude History Explorer
- purpose: present a CLI tool that turns opaque JSONL conversation history into searchable narratives and personality insights
- audience: developers who use Claude Code and want to understand their own coding patterns
- tone: serious, restrained, curious
- target-length: 7
- notes: yes
- style-preset: editorial-dark
- project-url: https://github.com/adewale/claude-history-explorer
- progress: segment-bar

## Source Materials
- readme: README.md (project overview -- CLI commands, installation, history format, story generation features, example terminal output)
- changelog: CHANGELOG.md (v0.1.0 initial release -- 9 commands, story generation, concurrent detection)
- trust: TRUST.md (trust model -- read-only guarantee, no network calls, 2600 lines auditable, 3 dependencies, five verifiable guarantees)
- faq: FAQ.md (agent concepts -- main vs agent sessions, concurrent instances, personality classification thresholds)
- roadmap: ROADMAP.md (wrapped feature -- URL-encoded stats, Cloudflare Workers website, social cards)

## Through-Line
- concept: "What does your conversation history say about you?"
- type: question
- appears-in:
  - slide 1: cover -- the question is implicit in the project's purpose
  - slide 3: section -- "reading the receipts" -- history files become searchable conversations
  - slide 5: center -- the surprise: personality analysis uses no AI, just timestamp arithmetic
  - slide 6: section -- "the trust contract" -- earning the right to read your history
  - slide 7: end -- resolution: your history is already telling a story

## Design Tokens
- colors:
  - bg: "#0a0a0f"
  - fg: "#e8e4de"
  - accent: "#38bdf8"
  - accent-alt: "#7dd3fc"
  - muted: "rgba(232, 228, 222, 0.45)"
  - surface: "#141419"
  - border: "rgba(232, 228, 222, 0.12)"
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
  - end
- custom-layouts: []
- components:
  - ProgressSegmentBar
- css-files:
  - styles/tokens.css
  - styles/theme.css

## Slides

### Slide 1
- kind: cover
- layout: cover
- title: Claude History Explorer
- subtitle: Python CLI tool to explore, search and visualise your Claude Code conversation history

### Slide 2
- kind: default-content
- layout: default
- title: What Is Claude History Explorer?
- body: Read-only CLI that parses JSONL files from ~/.claude/projects/. Nine commands, streams line-by-line, detects concurrent instances. 2,600 lines of Python with three runtime dependencies.
- sources:
  - https://github.com/adewale/claude-history-explorer/blob/main/README.md -- project overview and feature list
  - https://github.com/adewale/claude-history-explorer/blob/main/pyproject.toml -- dependency list

### Slide 3
- kind: section
- layout: section
- title: Reading the Receipts

### Slide 4
- kind: default-content
- layout: default
- title: From JSONL to Narrative
- body: Mermaid diagram showing data flow from raw session files through parser, classifier, to story generator. Includes real terminal output from the story command showing delegation style, message rates, and concurrent instance detection.
- sources:
  - https://github.com/adewale/claude-history-explorer/blob/main/claude_history_explorer/stories.py -- narrative generation
  - https://github.com/adewale/claude-history-explorer/blob/main/claude_history_explorer/constants.py -- classification thresholds
  - https://github.com/adewale/claude-history-explorer/blob/main/README.md -- example output

### Slide 5
- kind: center-statement
- layout: center
- title: A tool about AI that uses no AI
- body: Personality traits derived from arithmetic on JSONL timestamps -- not machine learning. The surprising constraint: no NLP, no embeddings, just deterministic thresholds.
- sources:
  - https://github.com/adewale/claude-history-explorer/blob/main/FAQ.md -- personality trait definitions
  - https://github.com/adewale/claude-history-explorer/blob/main/claude_history_explorer/constants.py -- threshold constants

### Slide 6
- kind: section
- layout: section
- title: The Trust Contract

### Slide 7
- kind: end
- layout: end
- title: Your History Is Already Telling a Story
- subtitle: Claude History Explorer just lets you read it
