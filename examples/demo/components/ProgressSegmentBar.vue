<script setup>
import { computed } from 'vue'
import { useNav } from '@slidev/client'

const { currentPage, total, currentLayout } = useNav()
const hidden = computed(() => ['cover', 'end'].includes(currentLayout.value))

const segments = computed(() => {
  const count = total.value
  const current = currentPage.value
  return Array.from({ length: count }, (_, i) => {
    const page = i + 1
    return {
      page,
      state: page < current ? 'completed' : page === current ? 'active' : 'unfilled',
    }
  })
})
</script>

<template>
  <div v-if="!hidden" class="progress-segment-bar">
    <span
      v-for="seg in segments"
      :key="seg.page"
      class="segment"
      :class="seg.state"
    />
  </div>
</template>

<style scoped>
.progress-segment-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  display: flex;
  gap: 1px;
  z-index: 100;
  pointer-events: none;
}

.segment {
  flex: 1;
  height: 100%;
  transition: background-color 0.2s ease;
}

.segment.completed {
  background-color: var(--deck-accent);
}

.segment.active {
  background-color: var(--deck-accent);
  opacity: 0.7;
}

.segment.unfilled {
  background-color: var(--deck-border, var(--deck-muted));
  opacity: 0.3;
}
</style>
