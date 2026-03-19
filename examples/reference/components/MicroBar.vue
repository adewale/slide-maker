<script setup>
import { computed } from 'vue'

const props = defineProps({
  data: { type: Array, required: true },
  max: { type: Number, default: 0 },
  color: { type: String, default: 'currentColor' },
})

const effectiveMax = computed(() =>
  props.max || Math.max(...props.data.map(d => d.value))
)
</script>

<template>
  <div class="micro-bar">
    <div v-for="(item, i) in data" :key="i" class="micro-bar-row">
      <span class="micro-bar-label">{{ item.label }}</span>
      <svg class="micro-bar-svg" width="100" height="12" viewBox="0 0 100 12">
        <rect
          x="0" y="1" rx="1"
          :width="(item.value / effectiveMax) * 100"
          height="10"
          :fill="color"
          opacity="0.85"
        />
      </svg>
      <span class="micro-bar-value">{{ item.value }}</span>
    </div>
  </div>
</template>

<style scoped>
.micro-bar {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.micro-bar-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--deck-font-body, sans-serif);
  font-size: 0.8rem;
}

.micro-bar-label {
  min-width: 4em;
  text-align: right;
  color: var(--deck-muted, currentColor);
}

.micro-bar-svg {
  flex: 1;
  max-width: 120px;
}

.micro-bar-value {
  min-width: 2.5em;
  font-variant-numeric: tabular-nums;
}
</style>
