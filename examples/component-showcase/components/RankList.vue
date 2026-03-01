<script setup lang="ts">
defineProps<{
  items: { label: string; value: number; max?: number }[]
  suffix?: string
}>()
</script>

<template>
  <div class="rank-list">
    <div v-for="(item, i) in items" :key="i" class="rank-item">
      <div class="rank-header">
        <span class="rank-position">{{ i + 1 }}</span>
        <span class="rank-label">{{ item.label }}</span>
        <span class="rank-value">{{ item.value }}{{ suffix || '' }}</span>
      </div>
      <div class="rank-track">
        <div
          class="rank-fill"
          :style="{
            width: `${(item.value / (item.max || Math.max(...items.map(i => i.value)))) * 100}%`
          }"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.rank-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.rank-header {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
}

.rank-position {
  font-family: var(--deck-font-mono);
  font-size: 0.75rem;
  opacity: 0.4;
  min-width: 1.25rem;
}

.rank-label {
  flex: 1;
  font-size: 0.9rem;
}

.rank-value {
  font-family: var(--deck-font-mono);
  font-size: 0.85rem;
  color: var(--deck-accent);
  font-weight: 600;
}

.rank-track {
  height: 6px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 3px;
  overflow: hidden;
}

.rank-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--deck-accent), var(--deck-accent-alt, var(--deck-accent)));
  border-radius: 3px;
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
