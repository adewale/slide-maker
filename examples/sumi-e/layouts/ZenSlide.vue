<script setup>
defineProps({
  class: { type: String, default: '' },
})
</script>

<template>
  <div class="slidev-layout zen-slide" :class="class">
    <slot />
  </div>
</template>

<style scoped>
.zen-slide {
  padding: 12% 18%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 100%;
  background: var(--deck-bg);
  color: var(--deck-fg);
}

.zen-slide :deep(> *) {
  max-width: 60%;
}

.zen-slide :deep(h1) {
  font-family: var(--deck-font-display);
  font-size: 2.4rem;
  font-weight: 400;
  letter-spacing: -0.02em;
  line-height: 1.25;
  margin-bottom: 1.5rem;
}

.zen-slide :deep(p) {
  font-family: var(--deck-font-body);
  font-size: 1.15rem;
  line-height: 1.7;
  color: var(--deck-muted);
}
</style>
