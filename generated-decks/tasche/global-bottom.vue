<template>
  <div v-if="!['cover', 'end'].includes($nav.currentLayout)" class="deck-footer">
    <span class="deck-footer-title">{{ $slidev.configs.title }}</span>
    <span class="deck-footer-page">{{ $nav.currentPage }} / {{ $nav.total }}</span>
  </div>
  <ProgressSegmentBar />
</template>

<script setup>
import ProgressSegmentBar from './components/ProgressSegmentBar.vue'
</script>

<style scoped>
.deck-footer {
  position: absolute; bottom: 0; left: 0; right: 0;
  display: flex; justify-content: space-between;
  padding: 0.5rem 1.5rem;
  font-family: var(--deck-font-body, sans-serif);
  font-size: 0.65rem; color: var(--deck-muted);
  pointer-events: none; z-index: 1;
}
</style>
