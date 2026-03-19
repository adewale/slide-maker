<script setup>
const props = defineProps({
  data: { type: Array, required: true },
  width: { type: Number, default: 80 },
  height: { type: Number, default: 16 },
  color: { type: String, default: '#22d3ee' },
})

const points = computed(() => {
  const max = Math.max(...props.data)
  const min = Math.min(...props.data)
  const range = max - min || 1
  const step = props.width / (props.data.length - 1)

  return props.data
    .map((val, i) => {
      const x = i * step
      const y = props.height - ((val - min) / range) * (props.height - 2) - 1
      return `${x},${y}`
    })
    .join(' ')
})

import { computed } from 'vue'
</script>

<template>
  <svg
    class="sparkline"
    :width="width"
    :height="height"
    :viewBox="'0 0 ' + width + ' ' + height"
    xmlns="http://www.w3.org/2000/svg"
  >
    <polyline
      :points="points"
      fill="none"
      :stroke="color"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>

<style scoped>
.sparkline {
  display: inline-block;
  vertical-align: middle;
  margin: 0 0.25em;
}
</style>
