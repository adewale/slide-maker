---
theme: seriph
title: The Breaking Point
selectable: false
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

# The Breaking Point

Your API contract broke at 2 AM. Your customers found it first.

<!--
Open with the scenario every VP of engineering has lived through. Let the subtitle land before advancing. The phrase "breaking point" does double duty: the literal API break, and the organizational threshold where manual monitoring stops working.

The audience should feel the familiarity of this moment. If they have run microservices at scale, this is not hypothetical.
-->

---
layout: fact
transition: fade
---

# 73%

of production incidents originate from API contract mismatches between services that passed all their unit tests.

<!--
This is not about test coverage. It is about the gap between what a service promises and what it delivers at runtime. Unit tests verify internal behavior. Integration tests verify happy paths. Nobody verifies the seam between services where contracts drift silently.

Pause on the number. Let the audience do the math against their own incident history.
-->

---
layout: section
transition: iris
---

# THE SEAM BETWEEN SERVICES

Where contracts live and where they break

<!--
Section break. Transition from the problem statement to the architectural explanation.

"The seam" is the through-line concept for this deck. Every interface between two services is a seam, and seams are where things tear. The metaphor works because it is structural, not decorative: seams are intentional joints that bear load.
-->

---
transition: slide-left
---

# What we monitor

<v-clicks>

- Schema drift between documented and actual API responses
- Payload shape changes across deployment boundaries
- Latency regressions that breach SLA thresholds
- Deprecation signals in upstream dependencies

</v-clicks>

<!--
Walk through each bullet deliberately. These are not features. They are failure modes that VPs recognize from their own incident retrospectives.

Schema drift is the silent one. Payload shape changes are the loud ones. Latency regressions are the slow bleed. Deprecation signals are the ones nobody reads until it is too late.

The audience should be nodding. If they are not, they have never run a microservices platform at scale.
-->

---
layout: center
transition: morph-fade
---

# Every breaking change was detectable 48 hours before it shipped.

The signal was in the diff. The contract was in the schema. Nobody was watching the seam.

<!--
This is the thesis of the deck. The problem is not detection difficulty. It is observability absence. The tooling gap exists not because the problem is hard, but because nobody built the instrument for this specific joint.

Pause after "nobody was watching the seam." Let the silence carry the weight. The through-line returns here: the seam is where value leaks and where monitoring belongs.

This slide is the pivot. Everything before it was the problem. Everything after it is the solution.
-->

---
transition: slide-left
---

# How it works

<v-clicks>

- One agent, one YAML file, deployed at your gateway
- Real-time diff against OpenAPI, gRPC, or GraphQL
- Alerts in Slack, PagerDuty, or CI before merge

</v-clicks>

<!--
Three sentences. Agent, diff, alert. The VP does not need the technical architecture. They need to know three things: how much work to adopt, what it compares against, and where the alert goes.

The "one YAML file" detail matters. It signals low adoption friction. The schema format list signals protocol breadth. The alert destination list signals integration maturity.

Keep this brisk. The previous slide was the emotional peak. This slide is the resolution mechanism.
-->

---
layout: end
transition: fade
---

# Stop finding breaks in production.

Start watching the seam.

<!--
Echo the opening. Slide 1 was the pain. Slide 7 is the resolution. "The seam" ties back to slide 3 and slide 5.

Do not say thank you. Do not show a URL. Do not add a QR code. Let the sentence hang. The audience will remember the last thing they see, and the last thing they see should be the thesis, not a courtesy.
-->
