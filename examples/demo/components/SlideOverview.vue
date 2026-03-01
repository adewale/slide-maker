<script setup lang="ts">
const slides = [
  { num: 1, title: 'Slide Maker', kind: 'cover', color: 'var(--deck-accent, #a78bfa)' },
  { num: 2, title: 'Too generic or brittle', kind: 'statement', color: 'var(--deck-muted, rgba(240,238,245,0.5))' },
  { num: 3, title: 'Two layers', kind: 'split', color: 'var(--deck-accent-alt, #fb923c)' },
  { num: 4, title: 'Escalation ladder', kind: 'section', color: 'rgba(240,238,245,0.15)' },
  { num: 5, title: 'Five levels', kind: 'content', color: 'rgba(240,238,245,0.08)' },
  { num: 6, title: 'In / Out', kind: 'split', color: 'var(--deck-accent-alt, #fb923c)' },
  { num: 7, title: 'Seven presets', kind: 'content', color: 'rgba(240,238,245,0.08)' },
  { num: 8, title: 'Five-step workflow', kind: 'content', color: 'rgba(240,238,245,0.08)' },
  { num: 9, title: '6 Priorities', kind: 'fact', color: 'var(--deck-accent, #a78bfa)' },
  { num: 10, title: 'Restraint', kind: 'quote', color: 'rgba(240,238,245,0.12)' },
  { num: 11, title: 'Overview', kind: 'content', color: 'rgba(240,238,245,0.08)' },
  { num: 12, title: 'Start building', kind: 'end', color: 'var(--deck-accent, #a78bfa)' },
]
</script>

<template>
  <div class="overview-grid">
    <div
      v-for="s in slides"
      :key="s.num"
      class="overview-card"
      :style="{ borderColor: s.color }"
    >
      <div class="card-color-bar" :style="{ background: s.color }" />
      <div class="card-num">{{ s.num }}</div>
      <div class="card-title">{{ s.title }}</div>
      <div class="card-kind">{{ s.kind }}</div>
    </div>
  </div>
</template>

<style scoped>
.overview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 0.6rem;
  padding: 0.5rem 0;
}

.overview-card {
  border: 1px solid rgba(240, 238, 245, 0.12);
  border-radius: 6px;
  padding: 0.5rem;
  position: relative;
  overflow: hidden;
  background: rgba(240, 238, 245, 0.03);
}

.card-color-bar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
}

.card-num {
  font-family: var(--deck-font-mono, monospace);
  font-size: 0.65rem;
  color: var(--deck-muted, rgba(240,238,245,0.5));
  margin-top: 0.15rem;
}

.card-title {
  font-family: var(--deck-font-display, sans-serif);
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--deck-fg, #f0eef5);
  line-height: 1.3;
  margin-top: 0.2rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-kind {
  font-size: 0.55rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--deck-muted, rgba(240,238,245,0.5));
  margin-top: 0.15rem;
}
</style>
