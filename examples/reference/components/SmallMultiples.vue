<script setup>
defineProps({
  cols: { type: Number, default: 4 },
})
</script>

<template>
  <div class="small-multiples" :style="{ gridTemplateColumns: 'repeat(' + cols + ', 1fr)' }">
    <slot />
  </div>
</template>

<style scoped>
.small-multiples {
  display: grid;
  gap: 1rem;
  align-items: end;
}

.small-multiples :deep(> *) {
  text-align: center;
  font-family: var(--deck-font-body, 'Source Sans 3', sans-serif);
  font-size: 0.8rem;
}
</style>
