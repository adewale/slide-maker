<script setup lang="ts">
defineProps<{
  label: string
  value: number
  max?: number
  suffix?: string
}>()
</script>

<template>
  <div class="progress-bar">
    <div class="progress-header">
      <span class="progress-label">{{ label }}</span>
      <span class="progress-value">{{ value }}{{ suffix || '%' }}</span>
    </div>
    <div class="progress-track">
      <div
        class="progress-fill"
        :style="{ width: `${(value / (max || 100)) * 100}%` }"
      />
    </div>
  </div>
</template>

<style scoped>
.progress-bar {
  margin-bottom: 1rem;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 0.4rem;
}

.progress-label {
  font-size: 0.9rem;
  opacity: 0.8;
}

.progress-value {
  font-family: var(--deck-font-mono);
  font-size: 0.85rem;
  color: var(--deck-accent);
  font-weight: 600;
}

.progress-track {
  height: 8px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--deck-accent);
  border-radius: 4px;
  transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
