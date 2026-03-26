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

You have months of Claude conversations sitting in `~/.claude/projects/` as JSONL files. Session lengths, message rates, tool usage patterns, time-of-day habits -- all recorded, none of it visible.

<v-clicks>

- How long are your typical sessions? You do not know.
- Are you delegating more over time, or less? The data exists, but you have never looked.
- What if you could see the patterns hiding in your own usage history?

</v-clicks>

<!--
This slide names the problem before introducing the solution. Every Claude Code user generates structured JSONL logs -- timestamped messages, tool calls, session boundaries -- but the files are opaque. There is no built-in way to search, aggregate, or visualize usage patterns. The data is rich (start times, message counts, agent flags, tool invocations) but completely inaccessible without tooling. The next slide introduces the architecture section, and then the mechanism: deterministic threshold arithmetic that turns this raw data into readable patterns.

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
Section break for the architecture deep-dive. The three layers are: data models (Message, Session, Project), business logic (parsing, statistics, story generation), and CLI interface (Click commands + Rich formatting).

Sources:
- https://github.com/adewale/claude-history-explorer/blob/main/docs/ARCHITECTURE.md — three-layer architecture overview
-->

---
layout: center
transition: fade
---

# The `classify()` Function Does All the Work

<div style="margin-top: 1.5rem;">

```python {all|3-5|6}
def classify(value, thresholds, default):
    """Threshold-based classification for traits."""
    for threshold, label in thresholds:
        if value > threshold:
            return label
    return default
```

</div>

<p style="color: var(--deck-muted); font-size: 0.95rem; margin-top: 1.5rem; text-align: center;">Six lines. No model. No training data. Just arithmetic.</p>

<!--
This is the mechanism behind the provocation. classify() is called with message_rate and thresholds like [(30, "Rapid-fire"), (20, "Steady flow"), (10, "Deliberate")]. The same function classifies session style, agent ratio, and activity intensity. Every "personality trait" in the output is a deterministic lookup, not a probabilistic inference. The function lives in utils.py and is used by stories.py for all personality generation.

Sources:
- https://github.com/adewale/claude-history-explorer/blob/main/claude_history_explorer/utils.py — classify() function definition
- https://github.com/adewale/claude-history-explorer/blob/main/claude_history_explorer/constants.py — all threshold values
-->

---
layout: fact
transition: slide-up
---

# 3

Runtime dependencies

click, rich, sparklines — no HTTP libraries, no AI libraries, works identically offline

<!--
The minimal dependency count is a deliberate architectural choice, not an accident. click (30M+ weekly downloads) handles CLI commands. rich (20M+ weekly downloads) does terminal formatting — tables, panels, syntax highlighting. sparklines (100K+ weekly downloads) renders ASCII activity charts. No dependency touches the filesystem for writes or the network for anything. This is verified by static analysis tests in the test suite that grep for import statements. The tool works the same with airplane mode on.

Sources:
- https://github.com/adewale/claude-history-explorer/blob/main/pyproject.toml — dependency list: click>=8.1.0, rich>=13.0.0, sparklines>=0.4.0
- https://github.com/adewale/claude-history-explorer/blob/main/TRUST.md — dependency audit and verification commands
-->

---
transition: slide-left
---

# From Timestamps to Personality Traits

The story generator pipeline builds narratives from session metadata alone:

<v-clicks>

- **Collect** SessionInfo objects from JSONL — start time, message count, agent flag
- **Compute** agent ratio, messages per hour, average session length, concurrent instances
- **Classify** each metric against thresholds in `constants.py`
- **Compose** traits into a narrative: "Agent-driven, Deep-work focused, High-intensity"

</v-clicks>

<p v-click style="color: var(--deck-accent); font-size: 0.95rem; margin-top: 1.5rem;">The output reads like a personality test. It is deterministic arithmetic.</p>

<!--
generate_project_story() in stories.py is the main pipeline. It parses every JSONL session file for a project, creates SessionInfo objects (start_time, duration_minutes, message_count, is_agent), then computes four metrics: agent_ratio (agent_sessions / main_sessions), message_rate (total_messages / total_dev_time), avg_session_hours, and messages_per_day. Each metric feeds into classify() with threshold constants. Concurrent Claude instance detection uses a 30-minute window (CONCURRENT_WINDOW_MINUTES) to find overlapping sessions. The WrappedStoryV3 model adds 7x24 activity heatmaps, session duration distributions, and session fingerprints — all computed from the same timestamp data.

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
Section break for the Wrapped feature. This is the most ambitious part of the project: a shareable year-in-review (like Spotify Wrapped) where all the data lives in the URL itself. The CLI generates the URL locally, and the website decodes it on the fly. Nothing is stored on any server. The V3 format includes 168-value activity heatmaps, session duration distributions, and trait scores — all encoded with msgpack and base64.

Sources:
- https://github.com/adewale/claude-history-explorer/blob/main/ROADMAP.md — Wrapped feature phases
- https://github.com/adewale/claude-history-explorer/blob/main/claude_history_explorer/wrapped.py — V3 encoding/decoding
-->

---
transition: morph-fade
---

# Read-Only, Offline, Auditable

The trust model is a consequence of the deterministic philosophy:

<v-clicks>

- **Read-only** — all file operations use `open(file, 'r')`, verified by static analysis tests
- **No network** — no `requests`, no `httpx`, no `urllib` in the dependency tree
- **Auditable** — 2600 lines of Python, small enough to read in an afternoon
- **Wrapped privacy** — aggregate counts encoded in the URL via msgpack + base64

</v-clicks>

<p v-click style="color: var(--deck-muted); font-size: 0.95rem; margin-top: 1.5rem;">When your tool does no inference, it needs no data pipeline.</p>

<!--
The five trust guarantees from TRUST.md map directly to architectural constraints. Read-only is enforced by tests that grep for write operations. No network is enforced by having zero HTTP dependencies. Auditability comes from the small codebase — four core modules (cli.py, models.py, parser.py, stories.py) plus constants.py and utils.py. The Wrapped URL contains only aggregate stats: project count, session count, message count, monthly activity (12 numbers), personality traits (computed labels). It never includes actual conversation content, code, or file paths. The decode command lets anyone inspect what a URL contains. The trust model works because the tool's deterministic design means it never needs to send data anywhere for processing.

Sources:
- https://github.com/adewale/claude-history-explorer/blob/main/TRUST.md — five guarantees with verification commands
- https://github.com/adewale/claude-history-explorer/blob/main/claude_history_explorer/wrapped.py — URL encoding with msgpack
-->

---
transition: fade
---

# The patterns were always in the JSONL

Six lines of `classify()`. Three dependencies. Read-only access. No network. No AI. The data was always there -- session lengths, message rates, time-of-day habits, delegation ratios. Now you can see them.

<!--
This closing resolves the tension opened in slide 2. The problem was invisible patterns in JSONL files. The resolution is that the patterns were always present in the data -- they just needed deterministic arithmetic to surface them. The classify() function, the three-dependency constraint, and the read-only trust model are the mechanisms that make this possible. The tool does not infer or predict. It makes visible what was already recorded.

Sources:
- https://github.com/adewale/claude-history-explorer — project repository
- https://github.com/adewale/claude-history-explorer/blob/main/claude_history_explorer/utils.py — classify() function
-->

---
layout: end
transition: fade
---

# Six lines of classify(). Zero AI. Every pattern visible.

github.com/adewale/claude-history-explorer

<!--
The closing h1 resolves the opening. Slide 2 said: you have hundreds of conversations, zero visibility. This slide says: the patterns were always there. The tool did not create insight from nothing -- it surfaced structure that the JSONL files already contained. Timestamps became session lengths. Message counts became usage rates. Agent flags became delegation ratios. All via deterministic arithmetic, all without touching the network or writing a single byte.

Sources:
- https://github.com/adewale/claude-history-explorer — project repository
-->
