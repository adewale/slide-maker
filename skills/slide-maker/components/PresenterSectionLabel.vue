<script setup>
import { computed } from 'vue'
import { useSections } from '../composables/useSections'

const { sections, currentSectionIndex } = useSections()

const currentSection = computed(() => {
  const idx = currentSectionIndex.value
  const sec = sections.value[idx]
  return sec ? { ...sec, index: idx } : null
})

const label = computed(() => {
  const sec = currentSection.value
  if (!sec) return ''
  return `${sec.title} (${sec.index + 1} of ${sections.value.length})`
})
</script>

<template>
  <div v-if="label" class="presenter-section-label">
    <span class="section-prefix">Section:</span>
    <span class="section-name">{{ label }}</span>
  </div>
</template>

<style scoped>
.presenter-section-label {
  display: inline-flex;
  align-items: center;
  gap: 0.4em;
  font-family: var(--deck-font-body, sans-serif);
  font-size: 0.8rem;
  color: var(--deck-muted, #888);
}

.section-prefix {
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-size: 0.7rem;
  color: var(--deck-accent, #6366f1);
}

.section-name {
  color: var(--deck-fg, #ccc);
}
</style>
