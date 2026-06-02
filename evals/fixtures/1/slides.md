---
theme: default
title: Sentinel
colorSchema: dark
fonts:
  sans: Playfair Display
  serif: Source Sans 3
  mono: JetBrains Mono
  weights: '400,600,700,900'
transition: fade
layout: cover
---

# Sentinel

Catch breaking API changes before they reach production.

---
layout: statement
---

# A schema change shipped on Friday broke every mobile client by Saturday

---
transition: fade
---

# The cost of finding out in production

<v-clicks>

- mean time to detection measured in hours, not seconds
- every consumer team debugs the same outage independently
- the fix is trivial; the discovery is what hurts

</v-clicks>

---
layout: section
---

# What Sentinel does

It diffs every deploy against the last known-good schema and blocks the ones that break a contract.

---
transition: fade
---

# How it works

<v-clicks>

- snapshot the schema on every merge to main
- diff the candidate against the snapshot inside CI
- fail the pipeline on a breaking change, naming the offending field

</v-clicks>

---
layout: fact
---

# 0

breaking changes reached production in the six months after adoption

---
layout: end
transition: fade
---

# Ship the change. Keep the contract.
