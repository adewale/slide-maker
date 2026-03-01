# Deck Spec

## Meta
- title: Claude History Explorer
- purpose: showcase the project
- audience: developers and Claude Code users
- tone: serious, modern, developer-focused
- target-length: 6
- notes: no
- style-preset: editorial-dark

## Design Tokens
- colors:
  - bg: "#0f1219"
  - fg: "#e2e8f0"
  - accent: "#38bdf8"
  - muted: "rgba(226, 232, 240, 0.5)"
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
- title: Claude History Explorer
- subtitle: Search and visualize your Claude Code conversation history.

### Slide 2
- kind: center-statement
- layout: center
- title: Turn raw JSONL files into searchable conversations and insights

### Slide 3
- kind: default-content
- layout: default
- title: What it does
- body:
  - bullet: Story generation — narratives about work patterns and collaboration style
  - bullet: Concurrent Claude detection — find parallel instance usage
  - bullet: Regex search across all conversations
  - bullet: Multiple export formats — JSON, Markdown, plain text

### Slide 4
- kind: default-content
- layout: default
- title: Commands
- body:
  - numbered: projects — list all Claude Code projects
  - numbered: sessions / show — browse and display conversations
  - numbered: search — regex search with context
  - numbered: stats / summary / story — analytics and narratives
  - numbered: wrapped — shareable year-in-review URL

### Slide 5
- kind: fact
- layout: fact
- title: 9
- subtitle: CLI commands
- body: Read-only by design. Never modifies your Claude history files.

### Slide 6
- kind: end
- layout: end
- title: Explore your history
- body: uv tool install .
