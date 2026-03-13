<script setup>
import { computed } from 'vue'

const props = defineProps({
  value: { type: Number, required: true },
  target: { type: Number, required: true },
  max: { type: Number, required: true },
  label: { type: String, default: '' },
})

const valuePct = computed(() => (props.value / props.max) * 100)
const targetPct = computed(() => (props.target / props.max) * 100)
</script>

<template>
  <div class="bullet-bar">
    <span v-if="label" class="bullet-bar-label">{{ label }}</span>
    <svg class="bullet-bar-svg" width="200" height="20" viewBox="0 0 200 20">
      <rect x="0" y="4" width="200" height="12" rx="1" fill="currentColor" opacity="0.1" />
      <rect x="0" y="4" :width="valuePct * 2" height="12" rx="1" fill="currentColor" opacity="0.7" />
      <line
        :x1="targetPct * 2" y1="2"
        :x2="targetPct * 2" y2="18"
        stroke="currentColor"
        stroke-width="2"
      />
    </svg>
    <span class="bullet-bar-value">{{ value }}<span class="bullet-bar-target"> / {{ target }}</span></span>
  </div>
</template>

<style scoped>
.bullet-bar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--deck-font-body, sans-serif);
  font-size: 0.8rem;
}

.bullet-bar-label {
  min-width: 4em;
  text-align: right;
  color: var(--deck-muted, currentColor);
}

.bullet-bar-svg {
  flex-shrink: 0;
}

.bullet-bar-value {
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.bullet-bar-target {
  color: var(--deck-muted, currentColor);
  font-size: 0.75em;
}
</style>
