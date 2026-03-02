# Deck Spec

## Meta
- title: Claude History Explorer
- purpose: showcase the project
- audience: developers and Claude Code users
- tone: serious, modern, developer-focused
- target-length: 8
- notes: yes
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
  - statement
  - default
  - two-cols
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
- notes: yes

### Slide 2
- kind: why-statement
- layout: statement
- transition: slide-left
- title: JSONL files are where Claude conversations go to die
- body: Raw JSONL logs are unreadable — thousands of lines, no search, no structure. You need a tool to explore them.

### Slide 3
- kind: code
- layout: default
- transition: slide-up
- title: Search in action
- body: Python CLI example showing `che search` with context output
- notes: yes

### Slide 4
- kind: two-cols
- layout: two-cols
- transition: fade
- title: What it does / Design principles
- body:
  - left:
    - bullet: Story generation — narratives about work patterns
    - bullet: Concurrent detection — find parallel instance usage
    - bullet: Regex search across all conversations
    - bullet: Multiple exports — JSON, Markdown, plain text
  - right:
    - bullet: Read-only by design (v-mark underline)
    - bullet: Never modifies history files
    - bullet: Local-first, no network
    - bullet: Fast — streams JSONL lazily
- interactive: hover-accent on design principles list items

### Slide 5
- kind: architecture
- layout: default
- transition: slide-left
- title: How data flows
- body: Mermaid graph LR — JSONL Files -> Parser -> Conversations -> Search / Stats / Stories
- motion: v-motion fade-up on diagram

### Slide 6
- kind: fact
- layout: fact
- transition: slide-up
- title: "1,200 lines of JSONL"
- subtitle: becomes a 3-second search
- body: 9 commands. All read-only. Your data never leaves your machine.

### Slide 7
- kind: design-insight
- layout: center
- transition: fade
- title: Read-only by design means zero risk
- body: When you never modify source files, you can experiment freely. No backup needed. No undo anxiety.

### Slide 8
- kind: end
- layout: end
- transition: fade
- title: Explore your history
- body: uv tool install .
- notes: yes
