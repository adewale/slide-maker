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

# An AI Tool Analyzer That Uses Zero AI

Claude History Explorer reads `~/.claude/projects/` JSONL files and turns raw conversation logs into searchable sessions, statistics, and personality narratives.

<v-clicks>

- Every classification comes from **deterministic threshold arithmetic**
- "Heavy delegation", "Marathon sessions", "Rapid-fire" — all from `classify(value, thresholds, default)`
- No LLM calls. No embeddings. No inference. Just timestamps and counts.

</v-clicks>

<!--
This is the core provocation: a tool that analyzes AI conversations but uses zero AI itself. All personality classification is deterministic arithmetic on timestamps. The classify() function takes a numeric value, walks a threshold list, and returns the first label that matches. MESSAGE_RATE_HIGH is 30 messages per hour. SESSION_LENGTH_LONG is 2 hours. These are constants, not learned weights.

Sources:
- https://github.com/adewale/claude-history-explorer/blob/main/claude_history_explorer/stories.py — personality classification via threshold arithmetic
- https://github.com/adewale/claude-history-explorer/blob/main/claude_history_explorer/constants.py — threshold constants (MESSAGE_RATE_HIGH=30, etc.)
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
layout: end
transition: fade
---

# Personality without AI. Trust without complexity.

github.com/adewale/claude-history-explorer

<!--
Resolve the through-line. The project proves you can extract meaningful personality insights from AI conversation data using nothing but arithmetic on timestamps. That constraint — no AI, no network, no writes — is what makes the trust model not just possible but inevitable. The classify() function is the entire inference engine: six lines of Python that turn numbers into labels. This is what happens when you decide the tool that reads AI conversations should itself use zero AI.

Sources:
- https://github.com/adewale/claude-history-explorer — project repository
-->
