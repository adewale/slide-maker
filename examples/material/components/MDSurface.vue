<script setup>
const props = defineProps({
  level: {
    type: Number,
    default: 0,
    validator: (v) => v >= 0 && v <= 5,
  },
})

const surfaceColors = [
  'var(--deck-surface, #FFFBFE)',
  'var(--deck-surface-container, #F3EDF7)',
  'var(--deck-surface-container-high, #ECE6F0)',
  'var(--deck-surface-variant, #E7E0EC)',
  'var(--deck-primary-container, #EADDFF)',
  'var(--deck-secondary-container, #E8DEF8)',
]

import { computed } from 'vue'

const bgColor = computed(() => surfaceColors[props.level] || surfaceColors[0])
</script>

<template>
  <div class="md-surface" :style="{ background: bgColor }">
    <slot />
  </div>
</template>

<style scoped>
.md-surface {
  border-radius: var(--deck-radius, 12px);
  padding: 1.25rem;
}
</style>
