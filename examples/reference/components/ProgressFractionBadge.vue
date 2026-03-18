<script setup>
import { computed } from 'vue'
import { useNav } from '@slidev/client'

const { currentPage, total, currentLayout } = useNav()
const hidden = computed(() => ['cover', 'end'].includes(currentLayout.value))
</script>

<template>
  <div v-if="!hidden" class="progress-fraction-badge">
    <span class="numerator">{{ currentPage }}</span>
    <span class="separator">/</span>
    <span class="denominator">{{ total }}</span>
  </div>
</template>

<style scoped>
.progress-fraction-badge {
  position: fixed;
  bottom: 16px;
  right: 16px;
  display: inline-flex;
  align-items: baseline;
  gap: 1px;
  font-family: var(--deck-font-mono, ui-monospace, 'SF Mono', 'Cascadia Code', monospace);
  font-size: 0.75rem;
  font-variant-numeric: tabular-nums;
  line-height: 1;
  padding: 4px 8px;
  border-radius: 999px;
  background-color: color-mix(in srgb, var(--deck-fg) 6%, transparent);
  z-index: 100;
  pointer-events: none;
}

.numerator {
  color: var(--deck-fg);
  font-weight: 600;
}

.separator {
  color: var(--deck-muted);
}

.denominator {
  color: var(--deck-muted);
}
</style>
