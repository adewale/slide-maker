---
layout: section
transition: iris
---

# Interactivity

Progressive reveals, annotations, and motion.

---
transition: slide-left
---

# v-clicks: Progressive Reveal

Wrap a list in `<v-clicks>` to reveal items one at a time on click.

<v-clicks>

- First item appears on first click
- Second item on second click
- Third item on third click
- The audience focuses on each point before seeing the next
- Aim for fewer than 40% of slides using v-clicks

</v-clicks>

<!-- v-clicks is the primary interactivity mechanism. It wraps any list to make each item appear sequentially.

[click] First item appears on first click — the audience focuses on one point before seeing the next.

[click] Second item on second click — progressive reveal prevents the audience from reading ahead.

[click] Third item on third click — each point gets its own moment.

[click] The audience focuses on each point — this is the pedagogical purpose. Information arrives at the pace of your delivery.

[click] Aim for fewer than 40% of slides using v-clicks — restraint matters. Not every list needs progressive reveal. The acceptance checklist requires bullet lists to use v-clicks, but overuse creates click fatigue.

Sources:
- file:slide-maker/COMPILER_RULES.md — v-click usage rules and 40% budget -->

---
transition: wipe-up
---

# v-mark: Five Annotation Types

Each type draws attention differently.

<v-clicks>

- <v-mark type="highlight" color="rgba(34, 211, 238, 0.2)">Highlight</v-mark> — soft background wash for key phrases
- <v-mark type="underline" color="#22d3ee">Underline</v-mark> — emphasis without obscuring text
- <v-mark type="strike" color="#f472b6">Strikethrough</v-mark> — for ideas being rejected or superseded
- <v-mark type="box" color="#22d3ee">Box</v-mark> — border around a term for definition or focus
- <v-mark at="6" type="circle" color="#f472b6">Circle</v-mark> — draws a hand-drawn circle, best on numbers

</v-clicks>

<!-- v-mark renders Rough Notation annotations over text. Five types, each with a semantic purpose.

[click] Highlight — soft background wash for key phrases. Use for terms you want to emphasize without interrupting reading flow.

[click] Underline — emphasis without obscuring text. Cleaner than highlight for single words.

[click] Strikethrough — for ideas being rejected or superseded. Use in before/after comparisons.

[click] Box — border around a term for definition or focus. Good for technical terminology.

[click] Circle — draws a hand-drawn circle, best on numbers and stats. The at="N" prop delays the annotation until click N.

Sources:
- file:slide-maker/COMPILER_RULES.md — v-mark variants with semantic meanings -->

---
transition: slide-up
---

# v-click with Targeted Timing

Individual elements can appear at specific click numbers.

Step 1 is visible immediately.

<v-click at="1">

Step 2 appears on the first click.

</v-click>

<v-click at="2">

Step 3 appears on the second click.

</v-click>

<v-click at="3">

The `at` prop controls which click triggers each element. This enables non-linear reveal sequences — later DOM elements can appear before earlier ones.

</v-click>

<!-- v-click wraps a single element for click-gated reveal. The at="N" prop specifies which click number triggers it. Unlike v-clicks (which auto-increments), v-click gives explicit control over reveal order.

Sources:
- file:slide-maker/COMPILER_RULES.md — v-click timing and reveal patterns -->

---
transition: blur
---

# v-motion: Animated Entrance

<div v-motion
  :initial="{ opacity: 0, y: -40 }"
  :enter="{ opacity: 1, y: 0, transition: { delay: 300, duration: 800 } }">

This entire block slides down and fades in after a 300ms delay.

</div>

<div v-motion
  :initial="{ opacity: 0, x: -60 }"
  :enter="{ opacity: 1, x: 0, transition: { delay: 600, duration: 600 } }">

This block slides in from the left after 600ms.

</div>

<div v-motion
  :initial="{ opacity: 0, scale: 0.8 }"
  :enter="{ opacity: 1, scale: 1, transition: { delay: 900, duration: 500 } }">

This block scales up from 80% after 900ms. Reserve v-motion for 3-4 dramatic entrances per deck.

</div>

<!-- v-motion uses @vueuse/motion for physics-based element animations. Properties: opacity, x, y, scale, rotate. The :initial state is where the element starts, :enter is where it ends up. Each can have independent delay and duration.

Sources:
- file:slide-maker/COMPILER_RULES.md — v-motion budget: 3-4 per deck max -->
