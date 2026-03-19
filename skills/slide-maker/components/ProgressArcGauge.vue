<script setup>
import { computed } from 'vue'
import { useNav } from '@slidev/client'

const { currentPage, total, currentLayout } = useNav()
const hidden = computed(() => ['cover', 'end'].includes(currentLayout.value))
const progress = computed(() => currentPage.value / total.value)

const size = 36
const radius = 30
const center = size

// Quarter-circle arc from bottom (6 o'clock) sweeping clockwise to right (3 o'clock)
// Start angle: 90deg (bottom), End angle: 0deg (right)
// We draw from 90deg going counterclockwise to 0deg for a bottom-right quarter circle
// Actually: quarter circle in bottom-right corner, arc from right edge going clockwise down
const filledPath = computed(() => {
  // Quarter circle: starts at top of the arc (12 o'clock position relative to center)
  // and sweeps clockwise. We want bottom-right corner placement.
  // Arc starts at 0deg (3 o'clock / right) and goes to 90deg (6 o'clock / bottom)
  const angle = progress.value * (Math.PI / 2)

  if (progress.value <= 0) return ''

  const startX = center
  const startY = center - radius

  const endX = center + Math.sin(angle) * radius
  const endY = center - Math.cos(angle) * radius

  const largeArc = angle > Math.PI ? 1 : 0

  return `M ${center} ${center} L ${startX} ${startY} A ${radius} ${radius} 0 ${largeArc} 1 ${endX} ${endY} Z`
})

const fullArcPath = computed(() => {
  const angle = Math.PI / 2
  const startX = center
  const startY = center - radius
  const endX = center + Math.sin(angle) * radius
  const endY = center - Math.cos(angle) * radius

  return `M ${center} ${center} L ${startX} ${startY} A ${radius} ${radius} 0 0 1 ${endX} ${endY} Z`
})
</script>

<template>
  <div v-if="!hidden" class="progress-arc-gauge">
    <svg
      :width="size"
      :height="size"
      :viewBox="'0 0 ' + (size * 2) + ' ' + (size * 2)"
    >
      <!-- Unfilled quarter arc background -->
      <path
        :d="fullArcPath"
        class="arc-bg"
        fill="none"
      />
      <!-- Filled progress arc -->
      <path
        v-if="progress > 0"
        :d="filledPath"
        class="arc-fill"
      />
    </svg>
  </div>
</template>

<style scoped>
.progress-arc-gauge {
  position: fixed;
  bottom: 12px;
  right: 12px;
  width: 36px;
  height: 36px;
  z-index: 100;
  pointer-events: none;
  opacity: 0.85;
}

.progress-arc-gauge svg {
  display: block;
  overflow: visible;
}

.arc-bg {
  stroke: var(--deck-border, var(--deck-muted));
  stroke-width: 2;
  fill: var(--deck-border, var(--deck-muted));
  opacity: 0.15;
}

.arc-fill {
  fill: var(--deck-accent);
  stroke: none;
  transition: d 0.2s ease;
}
</style>
