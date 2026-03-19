<script setup>
import { computed } from 'vue'
import { useNav } from '@slidev/client'

const { currentPage, total, currentLayout } = useNav()
const hidden = computed(() => ['cover', 'end'].includes(currentLayout.value))

const dots = computed(() => {
  const count = total.value
  const current = currentPage.value
  return Array.from({ length: count }, (_, i) => {
    const page = i + 1
    return {
      page,
      state: page === current ? 'current' : page < current ? 'visited' : 'future',
    }
  })
})
</script>

<template>
  <div v-if="!hidden" class="progress-dot-rail">
    <span
      v-for="dot in dots"
      :key="dot.page"
      class="dot"
      :class="dot.state"
    />
  </div>
</template>

<style scoped>
.progress-dot-rail {
  position: fixed;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: max(2px, min(8px, calc((100vh - 80px) / v-bind('total') - 6px)));
  z-index: 100;
  pointer-events: none;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
  transition: background-color 0.2s ease, border-color 0.2s ease;
}

.dot.current {
  background-color: var(--deck-accent);
  border: 1.5px solid var(--deck-accent);
}

.dot.visited {
  background-color: var(--deck-muted);
  border: 1.5px solid var(--deck-muted);
}

.dot.future {
  background-color: transparent;
  border: 1.5px solid var(--deck-border, var(--deck-muted));
}
</style>
