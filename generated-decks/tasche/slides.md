---
theme: default
title: Tasche
routerMode: hash
selectable: true
colorSchema: dark
fonts:
  sans: DM Sans
  serif: Bebas Neue
  mono: JetBrains Mono
  weights: '400,500,700'
transition: slide-left
layout: cover
---

# Tasche

A self-hosted read-it-later service built on Cloudflare Python Workers

<!--
"Tasche" is German for "pocket." The name signals the tool's intent -- a personal, portable knowledge store. Let the subtitle land before saying anything else. The audience should understand what this is before you explain why it exists.

Sources:
- https://github.com/adewale/tasche/blob/main/README.md -- project description, first paragraph
-->

---
transition: fade
---

# Your reading list should not be someone else's business model

A self-hosted read-it-later service built on Cloudflare Python Workers. Save articles, read them offline, and listen to them as audio -- all running in your own Cloudflare account.

<v-clicks>

- **Save articles by URL** with automatic content extraction and archival
- **Full-text search** across your entire library via FTS5
- **Listen Later** -- generate audio via Workers AI TTS
- **Offline reading** -- PWA with service worker caching
- **Self-hosted** -- your data stays in your Cloudflare account

</v-clicks>

<!--
This slide explains what Tasche IS and WHY it exists. The title makes the argument; the bullets prove it. Pause after "self-hosted" -- that is the differentiator. Every other read-it-later service holds your data hostage. Tasche does not.

Sources:
- https://github.com/adewale/tasche/blob/main/README.md -- feature list and project description
-->

---
layout: fact
transition: slide-up
---

# 6 Cloudflare services. 1 worker. $5/month.

Python Workers + D1 + R2 + KV + Queues + Workers AI

No external dependencies. No egress fees.

<!--
The $5/month figure is the Cloudflare Workers Paid plan as of early 2026. The free tier covers light personal use at 100K requests/day. The point is not the price -- it is the absence of hidden costs. No S3 bills, no database hosting, no third-party TTS API keys.

Sources:
- https://github.com/adewale/tasche/blob/main/README.md -- cost section and architecture table
- https://github.com/adewale/tasche/blob/main/wrangler.jsonc -- D1, R2, KV, Queues, AI, Service Binding in one config
-->

---
layout: section
transition: iris
---

# Every byte lives in your account

<!--
This is the through-line surfacing as an architectural claim. Pause here. The audience should feel the weight of "self-hosted" -- it is not a marketing label, it is a topology decision. D1 stores your articles. R2 stores your archived HTML, images, and audio. KV stores your sessions. Nothing leaves your Cloudflare account.

Sources:
- https://github.com/adewale/tasche/blob/main/README.md -- architecture table showing all 6 bindings
-->

---
layout: two-cols
transition: slide-left
---

# The 14-step pipeline

<v-clicks>

- Save URL -- API creates article
- Queue consumer fetches the page
- Readability extracts content
- Images converted to WebP

</v-clicks>

::right::

<v-clicks>

- HTML + Markdown stored in R2
- FTS5 indexed in D1
- TTS audio generated on demand

</v-clicks>

<!--
Walk through left column first, then right. The key insight: this is not a synchronous request. The API returns immediately with a "pending" article. The queue consumer does the heavy lifting asynchronously -- fetch, extract, convert, store, index. The user sees the article appear in their library as processing completes. Article-status polling updates cards automatically.

Sources:
- https://github.com/adewale/tasche/blob/main/README.md -- data flow description
- https://github.com/adewale/tasche/blob/main/LESSONS_LEARNED.md -- Phase 4 content processing pipeline, 14-step processing
-->

---
transition: fade
---

# FTS5 accepts operators inside your query parameter

Parameterized queries prevent SQL injection. But FTS5's `MATCH` clause accepts its own operators -- `OR`, `NOT`, `NEAR`, wildcards. Unsanitized user input is query injection *inside* the parameter value.

<v-clicks>

- Every search word quoted as a literal
- FTS5 operators stripped before execution
- Discovered during edge-case hardening -- 17 issues fixed in one pass

</v-clicks>

<!--
This is the war story. Phase 9 of the implement-audit loop found 3 CRITICAL, 6 HIGH, and 8 MEDIUM issues in a single hardening pass. The FTS5 injection was one of the critical findings. The fix is simple -- strip operators, quote words -- but the discovery required an explicit security audit. Parameterized queries gave false confidence. The lesson: FTS5 is its own query language, and it needs its own sanitization layer.

Sources:
- https://github.com/adewale/tasche/blob/main/LESSONS_LEARNED.md -- Pattern 11: "FTS5 Is Its Own Query Language", Phase 9: 17 edge cases fixed
-->

---
layout: end
transition: fade
---

# Your pocket. Your rules.

What happens when you trust no one with your reading list? You build Tasche.

<!--
Echo the through-line question and answer it. "Your pocket" connects back to the German name. "Your rules" connects to the architecture -- every byte in your account, every pipeline on your infrastructure. Let this slide sit. Do not rush to close the window.
-->
