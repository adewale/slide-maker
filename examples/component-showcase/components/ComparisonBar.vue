<script setup lang="ts">
defineProps<{
  label: string
  left: { name: string; value: number }
  right: { name: string; value: number }
}>()
</script>

<template>
  <div class="comparison-bar">
    <div class="comparison-label">{{ label }}</div>
    <div class="comparison-track">
      <div
        class="comparison-left"
        :style="{ width: `${(left.value / (left.value + right.value)) * 100}%` }"
      >
        <span class="comparison-name">{{ left.name }}</span>
        <span class="comparison-value">{{ left.value }}</span>
      </div>
      <div
        class="comparison-right"
        :style="{ width: `${(right.value / (left.value + right.value)) * 100}%` }"
      >
        <span class="comparison-name">{{ right.name }}</span>
        <span class="comparison-value">{{ right.value }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.comparison-bar {
  margin-bottom: 1.25rem;
}

.comparison-label {
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  opacity: 0.6;
  margin-bottom: 0.5rem;
}

.comparison-track {
  display: flex;
  height: 40px;
  border-radius: 6px;
  overflow: hidden;
  gap: 2px;
}

.comparison-left {
  background: var(--deck-accent);
  color: var(--deck-bg);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 0.75rem;
  font-size: 0.8rem;
  font-weight: 600;
  border-radius: 6px 0 0 6px;
}

.comparison-right {
  background: var(--deck-accent-alt, rgba(255, 255, 255, 0.15));
  color: var(--deck-bg);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 0.75rem;
  font-size: 0.8rem;
  font-weight: 600;
  border-radius: 0 6px 6px 0;
}

.comparison-value {
  font-family: var(--deck-font-mono);
}
</style>
