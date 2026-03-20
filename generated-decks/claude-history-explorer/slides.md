---
theme: seriph
title: Claude History Explorer
routerMode: hash
selectable: true
colorSchema: dark
fonts:
  sans: Playfair Display
  serif: Source Sans 3
  mono: JetBrains Mono
  weights: '300,400,600,700,900'
  italic: true
transition: fade
layout: cover
---

# Claude History Explorer

A Python CLI tool to explore, search and visualise your Claude Code conversation history

<!-- The subtitle is the project's verbatim README first-paragraph description. The through-line ("read-only to your history, never silent about what it reads") is introduced on the next slide, not here. The editorial-dark preset uses Playfair Display for display type and Source Sans 3 for body, with a sky-blue accent on near-black. -->

---
transition: slide-left
---

# What it is and why it exists

A Python CLI tool to explore, search and visualise your Claude Code conversation history. The history is stored locally at `~/.claude/projects/` and this tool turns raw JSONL files into searchable conversations and insights about your coding journey.

<v-clicks>

- **Turns raw logs into searchable conversations**
- **Generates narrative insights** about coding patterns
- Read-only -- never modifies a single file
- No network calls -- data stays on your machine

</v-clicks>

<!-- The verbatim README description opens this slide. This slide answers two questions before anything else: what IS this project, and why should you trust it? The read-only and no-network guarantees are not features -- they are the foundation the entire tool is built on. Every command in the tool inherits these properties.

Sources:
- https://github.com/adewale/claude-history-explorer/blob/main/README.md -- project overview, first-paragraph description
- https://github.com/adewale/claude-history-explorer/blob/main/TRUST.md -- read-only guarantee, no-network guarantee -->

---
layout: fact
transition: fade
---

# ~2,600 lines of Python
3 runtime dependencies: click, rich, sparklines

<!-- The small codebase is a deliberate trust mechanism, not an accident. At 2,600 lines across 4 modules, you can audit the entire project in an afternoon. The three dependencies are all output-formatting libraries -- click for CLI framework (30M+ weekly downloads), rich for terminal formatting (20M+ weekly downloads), sparklines for ASCII charts. None of them touch files or network. The pyproject.toml confirms: no requests, no httpx, no urllib, no aiohttp.

Sources:
- https://github.com/adewale/claude-history-explorer/blob/main/TRUST.md -- "Total: ~2,600 lines of Python. Small enough to audit in an afternoon." and dependency audit table
- https://github.com/adewale/claude-history-explorer/blob/main/pyproject.toml -- runtime dependencies list -->

---
layout: section
transition: iris
---

# Read-only by design

<!-- Through-line echo. This is not a policy statement -- it is a verifiable property of the code. The read-only guarantee is enforced three ways: (1) all file operations use read-only mode via open(file, 'r'), (2) the codebase imports no write-capable modules like shutil or os.remove, (3) the test suite includes static analysis that fails if write operations are detected. You can verify it yourself: grep -r "open.*'w'" claude_history_explorer/ returns nothing. The tests enforce this permanently.

Sources:
- https://github.com/adewale/claude-history-explorer/blob/main/TRUST.md -- three enforcement mechanisms for read-only guarantee -->

---
transition: slide-left
---

# Nine commands, zero writes

<v-clicks>

- `projects` / `sessions` / `show` -- navigate history
- `search` -- regex across all conversations
- `export` -- JSON, Markdown, or plain text
- `stats` / `summary` -- numbers and charts
- `story` -- personality insights, concurrency detection
- `wrapped` -- shareable year-in-review URL

</v-clicks>

<!-- The story command is the most distinctive feature. It analyzes session metadata to detect concurrent Claude instance usage, classify work intensity (messages per hour thresholds defined in constants.py), and generate personality trait labels. The wrapped command takes this further: it encodes aggregate stats into a MessagePack + Base64URL payload embedded in the URL. The website at wrapped-claude-codes.adewale-883.workers.dev decodes and renders on-the-fly. No database, no cookies, no persistence. The URL IS the data.

Sources:
- https://github.com/adewale/claude-history-explorer/blob/main/README.md -- command inventory with all 9 commands
- https://github.com/adewale/claude-history-explorer/blob/main/docs/WRAPPED_ARCHITECTURE.md -- URL anatomy, privacy architecture, "data is in the URL, not our database" -->

---
transition: slide-up
---

# The architecture is the argument

```mermaid {scale: 0.8}
graph LR
  A["CLI Layer"] --> B["Business Logic"]
  B --> C["Data Models"]
  C --> D["JSONL Files"]
  style A fill:#1a2332,stroke:#38bdf8,color:#38bdf8
  style B fill:#38bdf8,stroke:#38bdf8,color:#0a0a0f
  style C fill:#1a2332,stroke:#38bdf8,color:#38bdf8
  style D fill:#1a2332,stroke:#38bdf8,color:#38bdf8
  linkStyle default stroke:#38bdf8,stroke-width:2px
```

Streaming JSONL parsing -- line-by-line, no full file loading. The story generation pipeline flows from session discovery through pattern analysis to personality classification.

<!-- The three-layer architecture (CLI, Business Logic, Data Models) is clean but the interesting part is the data flow direction: it is strictly one-way, always reading. The parser streams JSONL line by line using generators, which means memory usage stays flat even for sessions with thousands of messages. The story generation pipeline chains: Project Discovery to Session File Collection to SessionInfo Extraction to Pattern Analysis to Personality Classification to formatted output. Constants.py centralizes the thresholds: MESSAGE_RATE_HIGH at 30 msgs/hour, SESSION_LENGTH_LONG at 2 hours, AGENT_RATIO_HIGH at 0.8.

Sources:
- https://github.com/adewale/claude-history-explorer/blob/main/docs/ARCHITECTURE.md -- three-layer diagram, data flow, story generation pipeline, streaming JSONL design -->

---
layout: end
transition: fade
---

# The tool that reads everything writes nothing.

That is the entire trust model.

<!-- Resolution of the through-line. "Read-only to your history, never silent about what it reads" -- the tool surfaces patterns, stories, and stats from your Claude Code conversations while maintaining a verifiable guarantee that it will never modify your files, never phone home, and never store your data anywhere you did not choose. 2,600 lines. 3 dependencies. Zero writes. The trust model is not a promise -- it is a testable property of the code. -->
