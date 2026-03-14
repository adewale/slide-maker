layout: section
transition: iris
---

# Transitions and Effects

13 cinematic transitions. 6 hover patterns. Scoped CSS.

---
transition: morph-fade
---

# Each Transition Carries Semantic Meaning

Not cosmetic — a grammar.

<v-clicks>

- **fade** — reflection, pause, denouement
- **slide-left** — progression, forward momentum
- **slide-up** — reveal, elevation
- **iris** — new chapter, section entry
- **morph-fade** — conceptual shift
- **wipe-right** / **wipe-up** — comparison, before/after
- **zoom-in** / **zoom-out** — focus or defocus

</v-clicks>

<v-click>

Plus **flip-x**, **flip-y**, **cube**, **swing**, **blur**, and **glide** for 3D, filter, and motion effects.

</v-click>

<!-- The transition grammar assigns semantic meaning to each transition. This is not cosmetic — it is a language. fade for reflection, iris for new chapters, wipe-right for comparison. The default transition in frontmatter should be the most common one in the deck.

Sources:
- file:slide-maker/COMPILER_RULES.md — transition grammar with semantic meanings -->

---
transition: slide-left
---

# Six Hover Patterns, No JavaScript

Reusable CSS from `interactions.css`.

<div class="spotlight-group" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; margin-top: 1.5rem;">

<div class="hover-lift" style="padding: 1.5rem; border: 1px solid var(--deck-accent); border-radius: 8px; text-align: center;">

**hover-lift**

translateY(-4px) + shadow

</div>

<div class="hover-scale" style="padding: 1.5rem; border: 1px solid var(--deck-accent); border-radius: 8px; text-align: center;">

**hover-scale**

scale(1.03)

</div>

<div class="hover-glow" style="padding: 1.5rem; border: 1px solid var(--deck-accent); border-radius: 8px; text-align: center;">

**hover-glow**

accent shadow

</div>

</div>

The parent `spotlight-group` dims all siblings when hovering any one card.

<!-- Six interaction patterns in interactions.css: hover-lift, spotlight-group, hover-scale, hover-accent, hover-glow, hover-dim. The spotlight-group class on the parent container dims all children except the one being hovered. CSS-only, no JavaScript.

Sources:
- file:slide-maker/styles/interactions.css — hover pattern definitions -->

---
transition: wipe-right
---

# Scoped Styles and Tokens

The `<style>` block adds per-slide CSS. All values reference `--deck-*` tokens.

```css
:root {
  --deck-bg: #0c0e14;
  --deck-fg: #e4e8ef;
  --deck-accent: #22d3ee;
  --deck-accent-alt: #f472b6;
  --deck-muted: rgba(228, 232, 239, 0.5);
}
```

<v-click>

`tokens.css` declares. `theme.css` applies. Components read. Never hardcode hex values in scoped styles.

</v-click>

<!-- The token system is the bridge between presets and slides. tokens.css contains only :root declarations. theme.css maps tokens to .slidev-layout classes. Scoped styles must use var(--deck-*) references, never raw hex or rgb values. deck-lint.mjs flags hardcoded colors.

Sources:
- file:slide-maker/COMPILER_RULES.md — token specification and scoped style rules -->
