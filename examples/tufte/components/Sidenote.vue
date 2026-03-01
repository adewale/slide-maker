<script setup>
defineProps({
  number: { type: [String, Number], default: '' },
})
</script>

<template>
  <div class="sidenote">
    <sup v-if="number" class="sidenote-number">{{ number }}</sup>
    <slot />
  </div>
</template>

<style scoped>
.sidenote {
  font-family: var(--deck-font-labels, 'Source Sans 3', sans-serif);
  font-size: 0.82rem;
  line-height: 1.5;
  color: var(--deck-muted, rgba(17, 17, 17, 0.5));
  margin-bottom: 0.75rem;
  padding-left: 0;
}

.sidenote-number {
  font-weight: 700;
  color: var(--deck-accent, #2d5f8a);
  margin-right: 0.25em;
  font-size: 0.75rem;
}
</style>
