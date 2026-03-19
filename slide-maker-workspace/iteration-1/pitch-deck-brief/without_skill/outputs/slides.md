---
theme: default
title: Sentinel API — Catch Breaking Changes Before Production
selectable: true
routerMode: hash
colorSchema: dark
transition: fade
layout: cover
fonts:
  sans: Source Sans 3
  serif: Playfair Display
  mono: JetBrains Mono
  weights: '300,400,600,700,900'
  italic: true
---

# Sentinel API

Catch breaking changes before they hit production.

<!-- The cover is spare on purpose. One product name, one value proposition. No tagline soup, no feature list. The audience is VPs of engineering — they have seen a hundred pitch decks this quarter. Earn their attention with restraint, not volume. Playfair Display at 900 weight on near-black sets the editorial tone immediately. -->

---
layout: statement
transition: morph-fade
---

# Your customers find your API bugs before your engineers do

<!-- The tension slide. This is the failure mode that every VP of engineering recognizes: a partner integration breaks on a Friday afternoon, the on-call gets paged, and the post-mortem reveals that a schema change shipped without anyone checking downstream consumers. The statement layout centers the text for maximum rhetorical weight. No bullets, no explanation — just the pain. -->

---
transition: slide-left
---

# The cost of a breaking change in production

<v-clicks>

- **$140K** — average cost of a single API-related outage for mid-market SaaS
- **4.2 hours** — mean time to detect a breaking change through customer reports
- **3 sprints** — typical recovery cycle including partner communication and hotfixes
- **37%** of engineering leaders cite API instability as their top integration risk

</v-clicks>

<!-- The problem slide uses specific numbers to establish credibility. Each statistic escalates: money, time, organizational drag, strategic risk. The v-clicks progressive reveal lets the presenter control the pacing — pause on the dollar figure, let the audience absorb the hours, then land the percentage as the strategic framing. Bold text maps to the accent color (steel blue) for visual anchoring. -->

---
layout: center
transition: morph-fade
---

# Sentinel monitors every API contract, runs schema diffing on every commit, and alerts your team before a breaking change reaches any environment

<!-- The solution slide. One sentence, centered, no bullets. This is the product pitch distilled to its irreducible core. The center layout with morph-fade transition signals a conceptual shift from problem to solution. The sentence structure is deliberately parallel: monitors, runs, alerts — three verbs, one pipeline. -->

---
transition: wipe-right
---

# How Sentinel works

<v-clicks>

1. **Connect** — point Sentinel at your API specs (OpenAPI, GraphQL SDL, gRPC proto)
2. **Monitor** — every pull request triggers automated schema diffing against all registered consumers
3. **Detect** — breaking changes are classified by severity: additive, compatible, or breaking
4. **Alert** — blocking PR checks, Slack notifications, and PagerDuty escalations before merge
5. **Report** — weekly API health scores with trend lines for your engineering leadership review

</v-clicks>

<!-- The mechanism slide. Five steps, each with a bold verb and a concrete implementation detail. The ordered list earns the numbered format because sequence matters — this is a pipeline, not a feature set. Wipe-right transition reinforces the left-to-right flow of the pipeline metaphor. Progressive reveal lets the presenter walk through each step without the audience reading ahead. -->

---
layout: fact
transition: zoom-in
---

# 94%

fewer breaking-change incidents in production

Sentinel customers reduce mean time to detect API contract violations from 4.2 hours to under 6 minutes.

<!-- The proof slide. The fact layout renders the headline number at maximum size (7rem). 94% is the anchor — specific enough to be credible, dramatic enough to be memorable. The subtitle adds the MTTD comparison that grounds the percentage in operational reality. zoom-in transition focuses attention on the number itself. -->

---
layout: end
transition: iris
---

# Stop shipping broken contracts

Request a demo at sentinel-api.com

<!-- The closing slide mirrors the opening's restraint. One imperative sentence as the call to action, one URL. No "questions?" slide — that is implied. No team photo, no logo grid. The iris transition (circular reveal) creates a visual full-stop. The end layout centers everything and applies a top border in the accent color for structural closure. -->
