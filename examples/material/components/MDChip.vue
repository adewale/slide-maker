<script setup>
defineProps({
  label: { type: String, required: true },
  selected: { type: Boolean, default: false },
  icon: { type: String, default: '' },
})
</script>

<template>
  <span class="md-chip" :class="{ 'md-chip--selected': selected }">
    <span v-if="icon" class="md-chip__icon">{{ icon }}</span>
    <span class="md-chip__label">{{ label }}</span>
  </span>
</template>

<style scoped>
.md-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem 0.85rem;
  border-radius: 8px;
  font-family: var(--deck-font-body);
  font-size: 0.82rem;
  font-weight: 500;
  border: 1px solid var(--deck-outline-variant, #CAC4D0);
  background: transparent;
  color: var(--deck-fg);
  transition: all 0.2s var(--m3-easing-standard);
  cursor: default;
}

.md-chip--selected {
  background: var(--deck-secondary-container, #E8DEF8);
  border-color: transparent;
  color: var(--deck-on-secondary-container, #1D192B);
}

.md-chip__icon {
  font-size: 1rem;
  line-height: 1;
}
</style>
