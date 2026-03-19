<script setup>
import { computed } from 'vue'

const props = defineProps({
  data: { type: Array, required: true },
  min: { type: Number, default: 0 },
  max: { type: Number, default: 0 },
  radius: { type: Number, default: 3 },
})

const effectiveMin = computed(() => props.min || Math.min(...props.data))
const effectiveMax = computed(() => props.max || Math.max(...props.data))
const range = computed(() => effectiveMax.value - effectiveMin.value || 1)

const dots = computed(() =>
  props.data.map(val => ({
    x: ((val - effectiveMin.value) / range.value) * 180 + 10,
    val,
  }))
)
</script>

<template>
  <svg class="dot-strip" width="200" height="20" viewBox="0 0 200 20">
    <line x1="10" y1="10" x2="190" y2="10" stroke="currentColor" stroke-opacity="0.15" stroke-width="1" />
    <circle
      v-for="(dot, i) in dots"
      :key="i"
      :cx="dot.x"
      cy="10"
      :r="radius"
      fill="currentColor"
      opacity="0.7"
    />
  </svg>
</template>

<style scoped>
.dot-strip {
  display: inline-block;
  vertical-align: middle;
}
</style>
