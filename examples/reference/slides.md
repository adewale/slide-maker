---
theme: seriph
title: Slide Maker Reference
selectable: true
routerMode: hash
colorSchema: dark
transition: slide-left
layout: cover
fonts:
  sans: Inter
  serif: Source Sans 3
  mono: JetBrains Mono
  weights: '300,400,500,600,700'
---

# Slide Maker Reference

Every feature. One deck.

<!--
  This deck is split across multiple files for maintainability.
  Each src: import pulls in a section of slides.
  Edit the individual files in pages/ to modify content.
-->

<!-- This reference deck documents and demonstrates every Slidev feature and Slide Maker extension. Each slide names the feature it exemplifies and uses it in practice. The deck serves as both documentation and a test fixture for iterating on the Skill.

Sources:
- file:slide-maker/COMPILER_RULES.md — feature inventory and acceptance criteria
- file:slide-maker/STYLE_PRESETS.md — visual direction system -->

---
layout: statement
transition: fade
---

# This deck exists to be broken, fixed, and improved

It is the test fixture for the Slide Maker skill and the reference for what Slidev can do.

<!-- The statement layout centers text with maximum visual weight. Use it for provocative or framing statements — never for content with bullet points. This is a good layout for opening tension or closing resolution.

Sources:
- file:slide-maker/SLIDE_KINDS.md — statement/center-statement kind definition -->

---
src: ./pages/layouts.md
---

---
src: ./pages/interactivity.md
---

---
src: ./pages/code.md
---

---
src: ./pages/dataviz.md
---

---
src: ./pages/transitions.md
---

---
src: ./pages/skill.md
---

---
src: ./pages/advanced.md
---
