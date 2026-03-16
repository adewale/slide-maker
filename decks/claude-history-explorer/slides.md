---
theme: seriph
title: Claude History Explorer
selectable: true
routerMode: hash
colorSchema: dark
transition: fade
layout: cover
fonts:
  sans: Playfair Display
  serif: Source Sans 3
  mono: JetBrains Mono
  weights: '300,400,600,700,900'
  italic: true
---

# Claude History Explorer

Read-only exploration of your Claude Code conversations.

github.com/adewale/claude-history-explorer

<!-- Claude History Explorer is a Python CLI that turns the raw JSONL files Claude Code writes to ~/.claude/projects/ into searchable conversations, statistics, narrative stories, and shareable annual summaries about your development journey. Ten commands across eleven modules — from regex search to a full Wrapped annual review with heatmaps, trait scores, and token tracking. The core design rule: the tool never writes to, modifies, or deletes your history files. Read-only means zero risk.

Sources:
- https://github.com/adewale/claude-history-explorer/blob/main/README.md — project overview, 10 commands, and feature list
- https://github.com/adewale/claude-history-explorer/blob/main/TRUST.md — read-only guarantee and trust model -->

---
layout: statement
transition: fade
---

# Your conversations contain proprietary code, architecture decisions, and accidental secrets

Any tool that reads them must earn trust before it runs. Read-only is where that trust begins.

<!-- Claude Code conversations may contain API keys accidentally pasted, business logic discussions, internal architecture decisions, and personal coding struggles. TRUST.md opens with this exact framing: "You're being asked to run a tool that reads your AI coding conversations." The skepticism is warranted — and the project addresses it with five testable guarantees rather than asking users to take anything on faith.

Sources:
- https://github.com/adewale/claude-history-explorer/blob/main/TRUST.md — "The Trust Question" section listing what conversations may contain -->

---
transition: slide-up
---

# Every guarantee is independently testable

- **Read-only by design** — never writes, modifies, or deletes history files
- **No network calls** — your conversations never leave your machine
- **Open source and auditable** — every line readable before you run it
- **Minimal dependencies** — click, rich, sparklines, msgpack, and pyperclip
- **Scoped reads** — only touches ~/.claude/projects/*.jsonl

<!-- Each guarantee is independently verifiable. Read-only: grep the codebase for write operations and find none. No network: check pyproject.toml for HTTP libraries and find none. Open source: the entire tool is eleven Python modules. Minimal deps: five runtime libraries — three for formatting (click, rich, sparklines), one for compact binary encoding (msgpack, used by the Wrapped feature), and one for clipboard access (pyperclip). None perform network I/O. Scoped reads: the tool reads JSONL session files and nothing else — not your source code, not your .env, not your git history. The TRUST.md document provides exact verification commands for each guarantee.

Sources:
- https://github.com/adewale/claude-history-explorer/blob/main/TRUST.md — all five guarantees with enforcement methods and verification commands -->

---
transition: slide-up
---

# Read-only enforcement

```bash {1-2|4-5|all}
# Search for write operations — should find none
grep -r "open.*'w'" claude_history_explorer/

# No write imports anywhere in the codebase
grep -r "shutil\.\|os\.remove" claude_history_explorer/
```

Static analysis in the test suite fails the build if write operations are detected. No write imports, no shutil, no os.remove.

<!-- The read-only guarantee is enforced at three levels. First, code design: all file operations use open(file, 'r'). Second, import discipline: the codebase never imports shutil, os.remove, or similar destructive modules. Third, automated verification: the test suite includes a static analysis test that scans for write operations and fails the build if any are found. This is not a promise — it is a testable property of the codebase that runs on every commit.

Sources:
- https://github.com/adewale/claude-history-explorer/blob/main/TRUST.md — Guarantee #1 enforcement: code design, no write imports, automated verification
- https://github.com/adewale/claude-history-explorer/blob/main/docs/ARCHITECTURE.md — read-only data access pattern and static analysis in test architecture -->

---
layout: section
transition: iris
---

# Read-only means zero risk

When you never modify source files, you can explore freely. No backup needed. No undo anxiety.

---
transition: slide-left
---

# Stories from conversations

<div v-motion
  :initial="{ opacity: 0, y: 40 }"
  :enter="{ opacity: 1, y: 0, transition: { delay: 200, duration: 600 } }">

```mermaid {theme: 'dark', scale: 0.85}
graph LR
  A["Session Files"] --> B["Pattern Analysis"]
  B --> C["Personality"] & D["Intensity"] & E["Narrative"]
  style A fill:#1e3a5f,stroke:#38bdf8,color:#38bdf8
  style B fill:#38bdf8,stroke:#38bdf8,color:#0a0a0f
  style C fill:#1e3a5f,stroke:#38bdf8,color:#38bdf8
  style D fill:#1e3a5f,stroke:#38bdf8,color:#38bdf8
  style E fill:#1e3a5f,stroke:#38bdf8,color:#38bdf8
  linkStyle default stroke:#38bdf8,stroke-width:2px
```

</div>

The story command analyzes sessions to generate narratives about work patterns, collaboration style, and personality traits — in brief, detailed, or timeline format.

<!-- The story generation pipeline works in stages: discover projects, collect session files, extract SessionInfo objects (lightweight summaries with timestamps, message counts, and agent-vs-main classification), then run pattern analysis. Concurrent Claude detection identifies overlapping sessions. Personality classification uses thresholds from constants.py — for example, MESSAGE_RATE_HIGH is 30 messages per hour, AGENT_RATIO_HIGH is 0.8. The output reveals patterns you would never notice reading raw JSONL: "heavy delegation (16 agents, 2 main sessions)" or "used up to 3 Claude instances in parallel."

Sources:
- https://github.com/adewale/claude-history-explorer/blob/main/README.md — story command formats (brief, detailed, timeline) and example output
- https://github.com/adewale/claude-history-explorer/blob/main/docs/ARCHITECTURE.md — story generation pipeline and personality classification -->

---
transition: slide-left
---

# Overlapping timestamps reveal parallel usage

- Streaming JSONL — line-by-line, never loads full files
- Overlapping session timestamps reveal parallel usage
- Lazy loading — first results before last file is read
- Generators for large result sets, constant memory

<div class="spotlight-group mt-6">

```bash
claude-history story -p myproject
# "Used up to 3 Claude instances in parallel"
```

</div>

<!-- Streaming JSONL is the performance architecture: the parser yields conversations as it finds them, so the first match appears before the last file is read. For concurrent detection, the tool collects SessionInfo objects with start and end timestamps, then checks for overlaps — sessions that were active at the same time indicate parallel Claude usage. This is only possible because the tool reads all session files for a project, not just one at a time. The lazy loading pattern means even large histories with hundreds of JSONL files respond quickly.

Sources:
- https://github.com/adewale/claude-history-explorer/blob/main/README.md — concurrent Claude detection feature and streaming JSONL
- https://github.com/adewale/claude-history-explorer/blob/main/docs/ARCHITECTURE.md — efficient file operations: streaming, lazy loading, generators -->

---
transition: slide-up
---

# Wrapped — your year in Claude Code

```bash
claude-history wrapped -y 2025 -n "Ade"
# Generates a shareable URL with your annual stats
# All data encoded in the URL — nothing stored on any server
```

- Activity heatmaps, session distributions, and streak tracking
- Ten behavioral trait scores (delegation, focus, burst vs. steady, and more)
- Token usage aggregation by model
- Decode any URL to inspect exactly what it contains: `claude-history wrapped --decode "https://..."`

<!-- The wrapped command generates a shareable annual summary — like Spotify Wrapped for your Claude Code usage. It computes heatmaps (7x24 activity grid), ten behavioral trait scores (agent delegation, session depth, focus concentration, circadian consistency, weekend ratio, burst-vs-steady, context switching, message verbosity, tool diversity, response intensity), session duration distributions, project co-occurrence graphs, timeline events (streaks, gaps, milestones), session fingerprints, and token usage broken down by model. All of this is packed into a single URL using msgpack + base64url encoding — V3 format with RLE compression for the heatmap. The URL points to a Cloudflare Workers site that renders the visualization, but the CLI itself makes zero network calls. You choose whether to share.

Sources:
- https://github.com/adewale/claude-history-explorer/blob/main/README.md — wrapped command with --year, --name, --raw, --decode options
- https://github.com/adewale/claude-history-explorer/blob/main/TRUST.md — "The Wrapped Feature: Additional Privacy Model" section
- https://github.com/adewale/claude-history-explorer/blob/main/claude_history_explorer/wrapped.py — V3 wrapped generation, encoding, trait computation -->

---
transition: slide-up
---

# The dependency tree has no capability to exfiltrate data

- **click** — CLI framework (30M+ weekly downloads)
- **rich** — terminal formatting (20M+ weekly downloads)
- **sparklines** — ASCII activity charts (100K+ weekly downloads)
- **msgpack** — compact binary encoding for Wrapped URLs (50M+ weekly downloads)
- **pyperclip** — clipboard copy for Wrapped URLs (5M+ weekly downloads)

No HTTP libraries. No network operations. The tool works identically offline.

<!-- The dependency choice is deliberate and trust-reinforcing. The original three dependencies (click, rich, sparklines) handle CLI and formatting. The Wrapped feature added two more: msgpack for compact binary encoding of annual stats into URL-safe strings, and pyperclip for one-click clipboard copy. None of the five touch network — no requests, no httpx, no urllib, no aiohttp. You can verify by checking pyproject.toml or running the tool with network disabled. This is another layer of the read-only guarantee: even if you don't trust the project code, the dependency tree has no capability to exfiltrate data.

Sources:
- https://github.com/adewale/claude-history-explorer/blob/main/TRUST.md — Guarantee #4: minimal dependencies
- https://github.com/adewale/claude-history-explorer/blob/main/docs/ARCHITECTURE.md — core dependencies
- https://github.com/adewale/claude-history-explorer/blob/main/pyproject.toml — 5 runtime dependencies: click, rich, sparklines, msgpack, pyperclip -->

---
layout: fact
transition: fade
---

# <v-mark at="1" color="#38bdf8" type="circle">~4,600</v-mark> lines

of Python across eleven modules. Still auditable in a day.

<!-- The codebase grew from four files to eleven focused modules: models.py (data classes), parser.py (JSONL parsing), projects.py (project discovery), stats.py (statistics), stories.py (narrative generation), wrapped.py (annual summary with heatmaps, trait scores, and token tracking), utils.py (shared helpers), constants.py (thresholds), history.py (backward-compatible re-exports), __init__.py (package metadata), and cli.py (10 commands). At roughly 4,600 lines total, the largest single module is cli.py at ~1,600 lines. The wrapped module alone is ~950 lines — the biggest feature addition. Still small enough to audit in a focused day.

Sources:
- https://github.com/adewale/claude-history-explorer/blob/main/TRUST.md — Guarantee #3: open source and auditable
- https://github.com/adewale/claude-history-explorer/blob/main/claude_history_explorer/ — 11 modules totaling ~4,600 lines -->

---
layout: end
transition: fade
---

# You don't have to trust us. The code is small enough to read.

<!-- The closing resolves the opening tension. "Your conversations contain proprietary code, architecture decisions, and accidental secrets" — the trust question. The answer: read-only means zero risk, and even at ~4,600 lines across eleven modules the code is small enough to verify that guarantee yourself. The Wrapped feature adds shareable annual summaries but maintains the same trust contract: the CLI makes no network calls, and every Wrapped URL is decodable so you can inspect the data before sharing. This is the final form of the through-line: read-only is not just a design decision, it is a trust mechanism that makes verification possible.

Sources:
- https://github.com/adewale/claude-history-explorer/blob/main/TRUST.md — closing summary: "You don't have to trust us. The code is small enough to read, the guarantees are testable, and the Wrapped URLs are decodable. Verify everything yourself." -->
