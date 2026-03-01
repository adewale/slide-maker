<script setup>
defineProps({
  class: { type: String, default: '' },
})
</script>

<template>
  <div class="slidev-layout tufte-slide" :class="class">
    <div class="tufte-body">
      <slot />
    </div>
    <div class="tufte-margin">
      <slot name="sidenote" />
    </div>
  </div>
</template>

<style scoped>
.tufte-slide {
  display: grid;
  grid-template-columns: 60% 30%;
  gap: 6%;
  padding: 6% 4% 6% 8%;
  align-content: start;
  background: var(--deck-bg);
  color: var(--deck-fg);
}

.tufte-body {
  max-width: 100%;
}

.tufte-body :deep(h1) {
  font-family: var(--deck-font-display);
  font-size: 2rem;
  font-weight: 400;
  margin-bottom: 1.25rem;
  line-height: 1.2;
}

.tufte-body :deep(p) {
  font-size: 1.05rem;
  line-height: 1.65;
  margin-bottom: 0.75rem;
}

.tufte-margin {
  padding-top: 3.5rem;
  font-family: var(--deck-font-labels);
  font-size: 0.82rem;
  line-height: 1.5;
  color: var(--deck-muted);
}

.tufte-margin :deep(p) {
  font-size: 0.82rem;
  margin-bottom: 0.6rem;
  max-width: 100%;
}
</style>
