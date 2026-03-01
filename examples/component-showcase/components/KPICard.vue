<script setup lang="ts">
defineProps<{
  label: string
  value: string
  delta: string
  direction: 'up' | 'down' | 'flat'
  period?: string
}>()
</script>

<template>
  <div class="kpi-card">
    <div class="kpi-label">{{ label }}</div>
    <div class="kpi-value">{{ value }}</div>
    <div class="kpi-footer">
      <span class="kpi-delta" :class="direction">
        <span class="kpi-arrow">{{ direction === 'up' ? '&#9650;' : direction === 'down' ? '&#9660;' : '&#9644;' }}</span>
        {{ delta }}
      </span>
      <span v-if="period" class="kpi-period">{{ period }}</span>
    </div>
  </div>
</template>

<style scoped>
.kpi-card {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--deck-radius, 12px);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.kpi-label {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  opacity: 0.5;
}

.kpi-value {
  font-family: var(--deck-font-display);
  font-size: 2.75rem;
  font-weight: 700;
  color: var(--deck-accent);
  line-height: 1.1;
  margin: 0.25rem 0;
}

.kpi-footer {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.8rem;
}

.kpi-delta {
  font-family: var(--deck-font-mono);
  font-weight: 600;
}

.kpi-delta.up { color: #22c55e; }
.kpi-delta.down { color: #ef4444; }
.kpi-delta.flat { color: var(--deck-muted); }

.kpi-arrow {
  font-size: 0.65rem;
  margin-right: 0.15rem;
}

.kpi-period {
  opacity: 0.4;
}
</style>
