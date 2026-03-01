<script setup lang="ts">
defineProps<{
  label: string
  value: string
  delta?: string
  direction?: 'up' | 'down' | 'flat'
}>()
</script>

<template>
  <div class="metric-card">
    <div class="metric-label">{{ label }}</div>
    <div class="metric-value">{{ value }}</div>
    <div v-if="delta" class="metric-delta" :class="direction">
      <span class="arrow">{{ direction === 'up' ? '&#9650;' : direction === 'down' ? '&#9660;' : '&#9644;' }}</span>
      {{ delta }}
    </div>
  </div>
</template>

<style scoped>
.metric-card {
  border: 1px solid var(--deck-accent);
  border-radius: var(--deck-radius, 12px);
  padding: 1.25rem;
  text-align: center;
}

.metric-label {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  opacity: 0.6;
  margin-bottom: 0.5rem;
}

.metric-value {
  font-family: var(--deck-font-display);
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--deck-accent);
  line-height: 1.1;
}

.metric-delta {
  font-size: 0.85rem;
  margin-top: 0.5rem;
  font-family: var(--deck-font-mono);
}

.metric-delta.up { color: #22c55e; }
.metric-delta.down { color: #ef4444; }
.metric-delta.flat { color: var(--deck-muted); }
.arrow { font-size: 0.7rem; margin-right: 0.25rem; }
</style>
