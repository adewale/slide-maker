<script setup>
defineProps({
  class: { type: String, default: '' },
})
</script>

<template>
  <div class="slidev-layout material-slide" :class="class">
    <slot />
  </div>
</template>

<style scoped>
.material-slide {
  padding: 3rem 3rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  background: var(--deck-surface);
  color: var(--deck-fg);
}

.material-slide :deep(h1) {
  font-family: var(--deck-font-display);
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-bottom: 0.5rem;
}

.material-slide :deep(.card-grid) {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-top: 0.5rem;
}

.material-slide :deep(.card-grid-2) {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-top: 0.5rem;
}

.material-slide :deep(.chip-group) {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.material-slide :deep(.metric-row) {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-top: 0.5rem;
}
</style>
