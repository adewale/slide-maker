<script setup>
import { computed } from 'vue'
import { useNav } from '@slidev/client'

const { currentPage, total, currentLayout, slides } = useNav()
const hidden = computed(() => ['cover', 'end'].includes(currentLayout.value))

// Build section boundaries from slides with layout: 'section'
const sections = computed(() => {
  const all = slides.value || []
  const sectionStarts = []

  for (let i = 0; i < all.length; i++) {
    const fm = all[i]?.frontmatter || all[i]?.meta?.frontmatter || {}
    if (fm.layout === 'section' || fm.layout === 'cover') {
      sectionStarts.push(i + 1) // 1-indexed page number
    }
  }

  // If no section slides found, treat the whole deck as one segment
  if (sectionStarts.length === 0) {
    return [{ start: 1, end: total.value }]
  }

  // Build ranges: each section runs from its start to the next section's start - 1
  const result = []
  for (let i = 0; i < sectionStarts.length; i++) {
    const start = sectionStarts[i]
    const end = i < sectionStarts.length - 1 ? sectionStarts[i + 1] - 1 : total.value
    result.push({ start, end })
  }
  return result
})

const segmentData = computed(() => {
  const page = currentPage.value
  return sections.value.map((sec, i) => {
    let state = 'unfilled'
    let fillPercent = 0

    if (page > sec.end) {
      state = 'completed'
      fillPercent = 100
    } else if (page >= sec.start) {
      state = 'active'
      const range = sec.end - sec.start + 1
      const progress = page - sec.start
      fillPercent = Math.round((progress / range) * 100)
    }

    return { index: i, state, fillPercent }
  })
})
</script>

<template>
  <div v-if="!hidden" class="progress-segment-bar">
    <span
      v-for="seg in segmentData"
      :key="seg.index"
      class="segment"
      :class="seg.state"
      :style="seg.state === 'active' ? { background: `linear-gradient(to right, var(--deck-accent) ${seg.fillPercent}%, var(--deck-border, var(--deck-muted)) ${seg.fillPercent}%)`, opacity: 1 } : {}"
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
  gap: 2px;
  z-index: 100;
  pointer-events: none;
}

.segment {
  flex: 1;
  height: 100%;
  transition: background-color 0.3s ease;
}

.segment.completed {
  background-color: var(--deck-accent);
}

.segment.active {
  background-color: var(--deck-border, var(--deck-muted));
}

.segment.unfilled {
  background-color: var(--deck-border, var(--deck-muted));
  opacity: 0.25;
}
</style>
