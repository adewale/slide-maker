---
theme: seriph
title: Claude History Explorer
colorSchema: dark
transition: fade
layout: cover
fonts:
  sans: Playfair Display
  serif: Source Sans 3
  mono: JetBrains Mono
  weights: '300,400,600,700,900'
  italic: true
selectable: true
routerMode: hash
download: true
---

# Claude History Explorer

Python CLI tool to explore, search and visualise your Claude Code conversation history

<span style="font-family: var(--deck-font-mono); font-size: 0.85rem; color: var(--deck-muted); margin-top: 1.5rem; display: inline-block;">github.com/adewale/claude-history-explorer</span>

<!--
The cover establishes the project identity. The subtitle is the README description verbatim. The GitHub URL appears below so the audience knows where to find the project from the first slide.

Sources:
- https://github.com/adewale/claude-history-explorer — repository description
-->

---
transition: slide-left
---

# Hundreds of conversations. Zero visibility.

You have months of Claude conversations in `~/.claude/projects/` as JSONL files. Session lengths, message rates, tool usage -- all recorded, none visible.

<v-clicks>

- How long are your typical sessions?
- Are you delegating more over time?
- What patterns hide in your usage history?

</v-clicks>

<!--
This slide names the problem before introducing the solution. Every Claude Code user generates structured JSONL logs -- timestamped messages, tool calls, session boundaries -- but the files are opaque. There is no built-in way to search, aggregate, or visualize usage patterns. The data is rich (start times, message counts, agent flags, tool invocations) but completely inaccessible without tooling. The through-line begins here: your conversations contain patterns you cannot see, and this tool makes them visible.

Sources:
- https://github.com/adewale/claude-history-explorer/blob/main/claude_history_explorer/parser.py — JSONL parsing of ~/.claude/projects/ conversation logs
- https://github.com/adewale/claude-history-explorer/blob/main/claude_history_explorer/models.py — SessionInfo dataclass capturing timestamps, message counts, agent flags
-->

---
layout: section
transition: iris
---

# Architecture

Three layers, 2600 lines, three dependencies

<!--
Section break for the architecture deep-dive. The three layers are: data models (Message, Session, Project dataclasses in models.py), business logic (parsing in parser.py, statistics and story generation in stories.py), and CLI interface (Click commands in cli.py plus Rich formatting for terminal output). The codebase fits in six core modules.

Sources:
- https://github.com/adewale/claude-history-explorer/blob/main/docs/ARCHITECTURE.md — three-layer architecture overview
-->

---
layout: center
transition: slide-up
---

# The `classify()` Function Does All the Work

<div style="margin-top: 1.5rem;">

```python {all|3-5|6}
def classify(value, thresholds, default):
    """Threshold-based classification."""
    for threshold, label in thresholds:
        if value > threshold:
            return label
    return default
```

</div>

<p style="color: var(--deck-muted); font-size: 0.95rem; margin-top: 1.5rem; text-align: center;">Six lines turn timestamps into visible patterns.</p>

<!--
This is the mechanism that makes the through-line work: your conversations contain patterns, and classify() is how they become visible. The function is called with metrics like message_rate and thresholds such as [(30, "Rapid-fire"), (20, "Steady flow"), (10, "Deliberate")]. The same function classifies session style, agent ratio, and activity intensity. Every "personality trait" in the output is a deterministic lookup against constants defined in constants.py -- not a probabilistic inference.

Sources:
- https://github.com/adewale/claude-history-explorer/blob/main/claude_history_explorer/utils.py — classify() function definition
- https://github.com/adewale/claude-history-explorer/blob/main/claude_history_explorer/constants.py — MESSAGE_RATE_HIGH=30, SESSION_LENGTH_LONG=2.0, AGENT_RATIO_HIGH=0.5
-->

---
layout: fact
transition: slide-up
---

# 3

Runtime dependencies

click, rich, sparklines -- no HTTP, no AI, works offline

<!--
The minimal dependency count is a deliberate architectural choice, not an accident. click (30M+ weekly downloads) handles CLI commands and argument parsing. rich (20M+ weekly downloads) does terminal formatting -- tables, panels, syntax highlighting. sparklines (100K+ weekly downloads) renders ASCII activity charts. No dependency touches the filesystem for writes or the network for anything. The tool works the same with airplane mode on. This constraint is verified by static analysis tests that grep for import statements.

Sources:
- https://github.com/adewale/claude-history-explorer/blob/main/pyproject.toml — dependency list: click>=8.1.0, rich>=13.0.0, sparklines>=0.4.0
- https://github.com/adewale/claude-history-explorer/blob/main/TRUST.md — dependency audit and verification commands
-->

---
transition: slide-left
---

# From Timestamps to Personality Traits

The story generator builds narratives from session metadata:

<v-clicks>

- **Collect** SessionInfo from JSONL files
- **Compute** agent ratio, messages per hour
- **Classify** each metric via `constants.py` thresholds
- **Compose** traits: "Agent-driven, Deep-work focused"

</v-clicks>

<p v-click style="color: var(--deck-accent); font-size: 0.95rem; margin-top: 1.5rem;">Reads like a personality test. It is deterministic arithmetic.</p>

<!--
generate_project_story() in stories.py is the main pipeline. It parses every JSONL session file for a project, creates SessionInfo objects (start_time, duration_minutes, message_count, is_agent), then computes four metrics: agent_ratio (agent_sessions / main_sessions), message_rate (total_messages / total_dev_time), avg_session_hours, and messages_per_day. Each metric feeds into classify() with threshold constants. Concurrent Claude instance detection uses a 30-minute window (CONCURRENT_WINDOW_MINUTES) to find overlapping sessions. The WrappedStoryV3 model extends this with 7x24 activity heatmaps, session duration distributions, and session fingerprints.

Sources:
- https://github.com/adewale/claude-history-explorer/blob/main/claude_history_explorer/stories.py — generate_project_story() pipeline
- https://github.com/adewale/claude-history-explorer/blob/main/claude_history_explorer/models.py — SessionInfo, ProjectStory, WrappedStoryV3 dataclasses
-->

---
layout: section
transition: iris
---

# Wrapped

A shareable URL with no server-side storage

<!--
Section break for the Wrapped feature. This is the most ambitious part of the project: a shareable year-in-review (like Spotify Wrapped) where all the data lives in the URL itself. The CLI generates the URL locally, and the website decodes it on the fly with zero server-side storage. The V3 format includes 168-value activity heatmaps, session duration distributions, and trait scores -- all encoded with msgpack and base64.

Sources:
- https://github.com/adewale/claude-history-explorer/blob/main/ROADMAP.md — Wrapped feature phases
- https://github.com/adewale/claude-history-explorer/blob/main/claude_history_explorer/wrapped.py — V3 encoding/decoding
-->

---
transition: morph-fade
---

# Read-Only, Offline, Auditable

The trust model follows from the deterministic design:

<v-clicks>

- **Read-only** -- verified by static analysis tests
- **No network** -- zero HTTP dependencies
- **Auditable** -- 2600 lines, readable in an afternoon
- **Wrapped privacy** -- stats in the URL via msgpack

</v-clicks>

<p v-click style="color: var(--deck-muted); font-size: 0.95rem; margin-top: 1.5rem;">No inference means no data pipeline.</p>

<!--
The five trust guarantees from TRUST.md map directly to architectural constraints. Read-only is enforced by tests that grep for write operations -- all file operations use open(file, 'r'). No-network is enforced by having zero HTTP dependencies in pyproject.toml -- no requests, no httpx, no urllib. Auditability comes from the small codebase: four core modules (cli.py, models.py, parser.py, stories.py) plus constants.py and utils.py. The Wrapped URL contains only aggregate stats -- project count, session count, message count, monthly activity, personality traits. It never includes actual conversation content, code, or file paths. The decode command lets anyone inspect what a URL contains before sharing.

Sources:
- https://github.com/adewale/claude-history-explorer/blob/main/TRUST.md — five guarantees with verification commands
- https://github.com/adewale/claude-history-explorer/blob/main/claude_history_explorer/wrapped.py — URL encoding with msgpack
-->

---
transition: fade
---

# The patterns were always in the JSONL

Six lines of `classify()`. Three dependencies. Read-only access. No network. No AI.

The data was always there -- session lengths, message rates, time-of-day habits, delegation ratios. This tool surfaced structure your JSONL files already contained.

<!--
This slide builds toward the closing resolution. The patterns were not created by the tool -- they were surfaced from data already being recorded by Claude Code. Timestamps became session lengths. Message counts became usage rates. Agent flags became delegation ratios. All via deterministic arithmetic, all without touching the network or writing a single byte. The through-line resolves here: the patterns you could not see were always in the JSONL, waiting for six lines of threshold arithmetic to make them visible.

Sources:
- https://github.com/adewale/claude-history-explorer — project repository
- https://github.com/adewale/claude-history-explorer/blob/main/claude_history_explorer/utils.py — classify() function
-->

---
layout: end
transition: fade
---

# The patterns were always in the JSONL. Now you can see them.

github.com/adewale/claude-history-explorer

<!--
The closing resolves the through-line opened on slide 2. "Hundreds of conversations, zero visibility" becomes "the patterns were always there, now you can see them." The tool did not create patterns from nothing -- it surfaced structure that the JSONL files already contained. Timestamps became session lengths, message counts became usage rates, agent flags became delegation ratios. All via deterministic arithmetic.

Sources:
- https://github.com/adewale/claude-history-explorer — project repository
-->
