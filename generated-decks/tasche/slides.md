---
theme: default
title: Tasche
routerMode: hash
selectable: true
colorSchema: dark
fonts:
  sans: Bebas Neue
  serif: DM Sans
  mono: JetBrains Mono
  weights: '400,500,700'
transition: slide-left
layout: cover
---

# Tasche

A self-hosted read-it-later service. Your articles survive.

<!-- Tasche is German for "pocket." The name signals intent: this is a personal preservation tool, not a social reading platform. The through-line -- "your articles survive" -- establishes the core promise immediately. The audience should feel the stakes: every article they have bookmarked on a SaaS service is one shutdown away from vanishing.

Sources:
- https://github.com/adewale/tasche — README: "Save articles, read them offline, and listen to them as audio -- all running in your own Cloudflare account." -->

---
layout: statement
transition: morph-fade
---

# The original gets paywalled. The domain expires. The CDN drops the images. Your copy is still there.

<!-- This slide names the failure mode that every reader has experienced. The rhythm of three losses (paywall, domain death, CDN expiry) followed by the survival statement is deliberate -- it builds the case through accumulation. The product spec for Tasche puts it more directly: "If you click the original URL and it 404s: Good thing you saved it." This is not hypothetical; link rot studies consistently show 25% of URLs break within 5 years.

Sources:
- https://github.com/adewale/tasche/blob/main/specs/tasche-spec.md — section 1.1: "Your Articles Survive" -->

---
transition: slide-up
---

# What gets archived when you save a URL

<v-clicks>

- **Clean HTML** via Readability extraction -- not a raw page dump
- **Every image** downloaded and converted to WebP (2MB limit per image)
- **Full markdown** for offline reading in the PWA
- **TTS audio** on demand via Workers AI (MeloTTS, up to 100K characters)
- **Three-URL dedup** across original, final, and canonical URLs

</v-clicks>

<!-- This is the specificity slide. Each bullet names a concrete mechanism, not a vague promise. The numbers matter: 2MB per image, 100K character TTS limit, three distinct URL fields for deduplication. The audience should understand that "archival" means a 14-step processing pipeline that fetches the page, resolves redirects, extracts content with Readability, downloads and converts every image to WebP, stores clean HTML and Markdown to R2, and indexes full text in D1 with FTS5. This is not a bookmark -- it is a self-contained archive.

[click] Readability extraction strips ads, navigation, and chrome. The result is clean article content.

[click] Images are the most fragile part of the web. Hotlink protection, CDN expiry, and domain death all kill images faster than text.

[click] Markdown enables the offline PWA reader. Service worker caches it locally.

[click] Text-to-speech converts markdown to audio via Workers AI. The audio is stored in R2 alongside the article.

[click] Three-URL deduplication catches the same article shared via Twitter t.co links, newsletter tracking URLs, and the canonical URL the page declares.

Sources:
- https://github.com/adewale/tasche/blob/main/specs/tasche-spec.md — section 1.2: asset table
- https://github.com/adewale/tasche/blob/main/CHANGELOG.md — v0.1.0: "14-step processing pipeline" -->

---
layout: section
transition: iris
---

# Six Cloudflare services, one worker

No containers. No VMs. No ops.

<!-- Section break. The shift from "what it does" to "how it works" is marked by an iris transition -- new chapter. The subtitle makes the architectural claim explicit: this is not a traditional deployment. There are no servers to patch, no containers to orchestrate, no VMs to resize. Everything runs on Cloudflare's edge.

Sources:
- https://github.com/adewale/tasche/blob/main/docs/architecture.md — section 1: "Tasche runs Python on Pyodide inside Cloudflare V8 isolates. This is not a container or a VM." -->

---
layout: two-cols
transition: slide-left
---

# The platform does the work

<v-clicks>

- **Python Workers** -- FastAPI API + queue consumer
- **D1** -- articles, users, tags, FTS5 search
- **R2** -- archived HTML, markdown, images, audio

</v-clicks>

::right::

<v-clicks>

- **KV** -- auth sessions with 7-day TTL
- **Queues** -- async article processing and TTS
- **Workers AI** -- text-to-speech via MeloTTS

</v-clicks>

<!-- Six bindings, each doing one job. This is the architecture slide but presented as an inventory, not a diagram, because the relationships are straightforward: the Worker orchestrates everything else. D1 holds structured data and FTS5 search indexes. R2 holds archived content (HTML, Markdown, images, audio). KV holds ephemeral sessions. Queues decouple the save-article request from the 14-step processing pipeline. Workers AI provides TTS without an external API dependency.

[click] through [click] The left column is the heavy infrastructure: compute, database, object storage.

[click] through [click] The right column is the supporting services: sessions, async processing, AI.

The Python Workers runtime deserves a note: this is Pyodide (CPython compiled to WebAssembly) running inside V8 isolates. No C extensions, no threading, no multiprocessing. Every handler must be async def. The FFI boundary between Python and JavaScript required a custom wrappers.py layer to safely convert JsProxy objects at every D1/R2/KV/Queue boundary.

Sources:
- https://github.com/adewale/tasche/blob/main/README.md — architecture table
- https://github.com/adewale/tasche/blob/main/docs/architecture.md — binding topology and Pyodide constraints -->

---
layout: fact
transition: slide-up
---

# $5/month

CLOUDFLARE WORKERS PAID PLAN

Your data, your account, your infrastructure. The free tier covers light personal use.

<!-- The cost slide is the through-line moment: permanence has a price, and that price is $5/month paid directly to Cloudflare. No middleman, no SaaS markup, no "free tier that becomes $29/month when you exceed limits." The emphasis on "your account" reinforces self-hosting -- the data lives in the user's own Cloudflare D1 database and R2 bucket. If Tasche the project disappears tomorrow, the data remains accessible through the Cloudflare dashboard. One-click deploy via the Deploy to Cloudflare button provisions all six resources automatically.

Sources:
- https://github.com/adewale/tasche/blob/main/README.md — "Requires the Cloudflare Workers Paid plan ($5/month as of early 2026)" -->

---
layout: end
transition: fade
---

# Your pocket. Your rules.

Your articles survive.

<!-- The closing resolves the opening. "Tasche" means "pocket" in German -- the name is the thesis. The through-line phrase returns one final time, now carrying the weight of everything the deck has shown: the archival pipeline, the six-service architecture, the $5/month permanence guarantee. No install command, no QR code. The idea is small enough to hold in one hand. -->
