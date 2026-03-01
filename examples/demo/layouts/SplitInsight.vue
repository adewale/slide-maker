<template>
  <div class="slidev-layout split-insight">
    <div class="split-header">
      <slot />
    </div>
    <div class="split-grid">
      <div class="split-left">
        <slot name="left" />
      </div>
      <div class="split-right">
        <slot name="right" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.split-insight {
  padding: 3rem 4rem;
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--deck-bg);
  color: var(--deck-fg);
}

.split-header {
  margin-bottom: 1.5rem;
}

.split-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  flex: 1;
  align-items: start;
}

.split-left {
  border-right: 2px solid var(--deck-accent);
  padding-right: 2rem;
}
</style>
