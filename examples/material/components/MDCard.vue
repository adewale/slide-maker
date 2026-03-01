<script setup>
defineProps({
  variant: {
    type: String,
    default: 'elevated',
    validator: (v) => ['elevated', 'filled', 'outlined'].includes(v),
  },
  title: { type: String, default: '' },
})
</script>

<template>
  <div class="md-card" :class="'md-card--' + variant">
    <h3 v-if="title" class="md-card__title">{{ title }}</h3>
    <div class="md-card__content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.md-card {
  border-radius: var(--deck-radius, 12px);
  padding: 1.25rem;
  font-family: var(--deck-font-body);
  font-size: 0.9rem;
  line-height: 1.5;
}

.md-card--elevated {
  background: var(--deck-surface, #FFFBFE);
  box-shadow: var(--m3-elevation-1);
}

.md-card--filled {
  background: var(--deck-surface-container-high, #ECE6F0);
}

.md-card--outlined {
  background: var(--deck-surface, #FFFBFE);
  border: 1px solid var(--deck-outline-variant, #CAC4D0);
}

.md-card__title {
  font-family: var(--deck-font-display);
  font-size: 1rem;
  font-weight: 600;
  color: var(--deck-fg);
  margin-bottom: 0.5rem;
  letter-spacing: -0.01em;
}

.md-card__content {
  color: var(--deck-muted);
}

.md-card__content :deep(strong) {
  color: var(--deck-primary, #6750A4);
}
</style>
