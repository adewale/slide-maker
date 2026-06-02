---
theme: apple-basic
title: Slide Maker Reference
selectable: true
routerMode: hash
download: true
colorSchema: light
transition: slide-left
layout: cover
fonts:
  sans: Source Sans 3
  serif: Source Serif 4
  mono: JetBrains Mono
  weights: '400,500,600,700'
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
src: ./pages/components.md
---

---
src: ./pages/transitions.md
---

---
src: ./pages/ecosystem.md
---

---
src: ./pages/infrastructure.md
---

---
src: ./pages/progress.md
---

---
src: ./pages/presenter.md
---

---
src: ./pages/skill.md
---

---
src: ./pages/advanced.md
---
