<script setup>
import { computed } from 'vue'
import { useNav } from '@slidev/client'

const { currentPage, total, currentLayout } = useNav()
const hidden = computed(() => ['cover', 'end'].includes(currentLayout.value))

const marks = computed(() => {
  const current = currentPage.value
  const count = total.value
  const result = []

  for (let i = 1; i <= count; i++) {
    const groupIndex = Math.ceil(i / 5) - 1
    const posInGroup = ((i - 1) % 5)
    const isCrossStroke = posInGroup === 4

    let state
    if (i === current) state = 'current'
    else if (i < current) state = 'completed'
    else state = 'future'

    result.push({
      page: i,
      groupIndex,
      posInGroup,
      isCrossStroke,
      state,
    })
  }

  return result
})

const groups = computed(() => {
  const map = new Map()
  for (const mark of marks.value) {
    if (!map.has(mark.groupIndex)) map.set(mark.groupIndex, [])
    map.get(mark.groupIndex).push(mark)
  }
  return Array.from(map.values())
})
</script>

<template>
  <div v-if="!hidden" class="progress-tally-marks">
    <svg
      v-for="(group, gi) in groups"
      :key="gi"
      class="tally-group"
      :width="group.length <= 4 ? group.length * 8 + 4 : 44"
      height="20"
      :viewBox="'0 0 ' + (group.length <= 4 ? group.length * 8 + 4 : 44) + ' 20'"
    >
      <template v-for="mark in group" :key="mark.page">
        <!-- Regular vertical strokes -->
        <line
          v-if="!mark.isCrossStroke"
          :x1="mark.posInGroup * 8 + 4"
          y1="3"
          :x2="mark.posInGroup * 8 + 4"
          y2="17"
          :class="['stroke', mark.state]"
          stroke-width="2"
          stroke-linecap="round"
        />
        <!-- Diagonal cross stroke (every 5th) -->
        <line
          v-else
          x1="1"
          y1="15"
          x2="37"
          y2="1"
          :class="['stroke', mark.state]"
          stroke-width="1.5"
          stroke-linecap="round"
        />
      </template>
    </svg>
  </div>
</template>

<style scoped>
.progress-tally-marks {
  position: fixed;
  bottom: 8px;
  left: 16px;
  right: 16px;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 10px;
  z-index: 100;
  pointer-events: none;
}

.tally-group {
  flex-shrink: 0;
}

.stroke.current {
  stroke: var(--deck-accent);
}

.stroke.completed {
  stroke: var(--deck-muted);
}

.stroke.future {
  stroke: var(--deck-border, var(--deck-muted));
  opacity: 0.25;
}
</style>
