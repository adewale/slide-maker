<script setup lang="ts">
defineProps<{
  cols?: number
}>()
</script>

<template>
  <div class="stat-grid" :style="{ gridTemplateColumns: `repeat(${cols || 3}, 1fr)` }">
    <slot />
  </div>
</template>

<style scoped>
.stat-grid {
  display: grid;
  gap: 1.25rem;
  margin-top: 1.5rem;
}
</style>
