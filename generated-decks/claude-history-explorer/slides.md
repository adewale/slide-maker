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

*Your conversations have a story. This tool reads it.*

<!--
The cover establishes the through-line: this tool reads your history without writing to it. The subtitle frames the deck as a narrative about discovery, not a feature walkthrough.

Sources:
- https://github.com/adewale/claude-history-explorer/blob/main/README.md -- project tagline and purpose
-->

---
transition: slide-up
layout: fact
---

# 2,600 lines of Python. 3 dependencies. Zero network calls.

A CLI that parses `~/.claude/projects/` and turns JSONL session files into searchable conversations, statistics, and narrative insights.

<!--
The fact slide lands the scale of the project immediately. The three numbers are from TRUST.md and pyproject.toml -- not estimates. The dependency count refers to click, rich, and sparklines (the three original runtime deps). msgpack and pyperclip were added later for the wrapped feature.

Sources:
- https://github.com/adewale/claude-history-explorer/blob/main/TRUST.md -- "Total: ~2,600 lines of Python. Small enough to audit in an afternoon."
- https://github.com/adewale/claude-history-explorer/blob/main/pyproject.toml -- click>=8.1.0, rich>=13.0.0, sparklines>=0.4.0
-->

---
transition: morph-fade
layout: center
---

# Read-only by design

No write operations. No `shutil`. No `os.remove`. Enforced by static analysis tests that fail if write patterns appear in the source.

<!--
This is the through-line's second appearance. "Read-only" is not a limitation -- it is the trust contract. The tool accesses your most sensitive AI conversations but guarantees it will never modify them. The enforcement mechanism is concrete: automated tests grep for write operations and fail the build if any are found.

Sources:
- https://github.com/adewale/claude-history-explorer/blob/main/TRUST.md -- "All file operations use read-only mode (open(file, 'r'))" and "Automated verification: Our test suite includes static analysis that fails if write operations are detected"
-->

---
transition: slide-left
layout: two-cols
---

# Ten commands, one history

<v-clicks>

- **projects** -- list all Claude Code projects
- **sessions** -- list sessions for a project
- **show** -- display messages from a session
- **search** -- regex across all conversations
- **export** -- markdown, JSON, or text

</v-clicks>

::right::

<v-clicks>

- **info** -- storage location and usage
- **stats** -- message counts, duration, agents
- **summary** -- charts and sparklines
- **story** -- personality traits and patterns
- **wrapped** -- shareable year-in-review URL

</v-clicks>

<!--
The two-column layout groups commands by function: left column is data access (find, read, search, export), right column is analysis (aggregate, visualize, narrate, share). The split is not alphabetical -- it follows the user's journey from "what do I have?" to "what does it mean?"

Sources:
- https://github.com/adewale/claude-history-explorer/blob/main/README.md -- full command inventory with usage examples and option tables
-->

---
transition: fade
---

# The story command finds what you missed

<v-clicks>

- Detects concurrent Claude instances running in parallel
- Classifies style: **heavy delegation** vs **hands-on**
- Measures pace -- messages per hour, session duration
- Wrapped encodes stats into a URL; nothing stored

</v-clicks>

<!--
The story and wrapped commands are the analytical heart of the tool. "Concurrent Claude detection" identifies overlapping sessions within a 30-minute window. Collaboration style is derived from the ratio of agent-prefixed session files to main session files. The wrapped feature uses msgpack + base64url encoding to put all stats in the URL itself -- the Cloudflare Worker that renders the page stores nothing and has no database.

Sources:
- https://github.com/adewale/claude-history-explorer/blob/main/README.md -- story command output example showing "Used up to 3 Claude instances in parallel"
- https://github.com/adewale/claude-history-explorer/blob/main/FAQ.md -- personality trait definitions: "Heavy delegation: High ratio of agent sessions to main sessions"
- https://github.com/adewale/claude-history-explorer/blob/main/ROADMAP.md -- wrapped URL privacy model: "Data is in the URL, not our database -- we store nothing"
-->

---
transition: iris
layout: section
---

# Trust is verifiable, not promised

<!--
This section divider refracts the through-line. The entire trust model is designed to be auditable: grep for writes, check dependencies, run offline, decode any wrapped URL. The claim is not "trust us" but "verify it yourself." This is the pivot from "what the tool does" to "why you should believe it."
-->

---
transition: fade
layout: end
---

# Read-only to your history. Read everything about your habits.

2,600 lines. Verify it yourself.

<!--
The closing resolves the through-line provocation. The two halves of the sentence -- read-only access, total insight -- capture the tool's core tension. The final line is a challenge, not a courtesy. It echoes the TRUST.md ethos: "You don't have to trust us. The code is small enough to read."

Sources:
- https://github.com/adewale/claude-history-explorer/blob/main/TRUST.md -- "The bottom line: You don't have to trust us."
-->
