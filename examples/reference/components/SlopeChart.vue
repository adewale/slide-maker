<script setup>
import { computed } from 'vue'

const props = defineProps({
  items: { type: Array, required: true },
  startLabel: { type: String, default: 'Before' },
  endLabel: { type: String, default: 'After' },
  height: { type: Number, default: 160 },
})

const allValues = computed(() => [
  ...props.items.map(d => d.start),
  ...props.items.map(d => d.end),
])
const minVal = computed(() => Math.min(...allValues.value))
const maxVal = computed(() => Math.max(...allValues.value))
const range = computed(() => maxVal.value - minVal.value || 1)

function yPos(val) {
  const padding = 20
  const usable = props.height - padding * 2
  return padding + usable - ((val - minVal.value) / range.value) * usable
}
</script>

<template>
  <svg class="slope-chart" :viewBox="'0 0 240 ' + height" width="240" :height="height">
    <text x="40" y="12" class="slope-header">{{ startLabel }}</text>
    <text x="200" y="12" class="slope-header">{{ endLabel }}</text>
    <g v-for="(item, i) in items" :key="i">
      <line
        x1="50" :y1="yPos(item.start)"
        x2="190" :y2="yPos(item.end)"
        stroke="currentColor"
        :stroke-opacity="0.6"
        stroke-width="1.5"
      />
      <circle cx="50" :cy="yPos(item.start)" r="3" fill="currentColor" />
      <circle cx="190" :cy="yPos(item.end)" r="3" fill="currentColor" />
      <text x="4" :y="yPos(item.start) + 4" class="slope-label">{{ item.label }}</text>
      <text x="46" :y="yPos(item.start) - 6" class="slope-value">{{ item.start }}</text>
      <text x="194" :y="yPos(item.end) - 6" class="slope-value">{{ item.end }}</text>
    </g>
  </svg>
</template>

<style scoped>
.slope-chart {
  display: block;
  font-family: var(--deck-font-body, sans-serif);
}

.slope-header {
  font-size: 9px;
  font-weight: 600;
  fill: var(--deck-muted, currentColor);
  text-anchor: middle;
}

.slope-label {
  font-size: 8px;
  fill: var(--deck-muted, currentColor);
  text-anchor: end;
}

.slope-value {
  font-size: 8px;
  fill: currentColor;
  font-variant-numeric: tabular-nums;
}
</style>
