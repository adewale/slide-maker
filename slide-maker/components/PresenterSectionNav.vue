<script setup>
import { useNav } from '@slidev/client'
import { showThumbnails, selectedSection } from '../composables/useThumbnails'
import { useSections } from '../composables/useSections'

const { go } = useNav()
const { sections, currentSectionIndex } = useSections()

function sectionState(index) {
  const ci = currentSectionIndex.value
  if (index < ci) return 'past'
  if (index === ci) return 'current'
  return 'future'
}

function handleClick(index) {
  const sec = sections.value[index]
  if (!sec) return

  if (showThumbnails.value) {
    // When thumbnail grid is open, set selectedSection to filter/scroll
    selectedSection.value = index
  } else {
    // Navigate directly to the section's first slide
    go(sec.page)
  }
}
</script>

<template>
  <nav class="presenter-section-nav" role="navigation" aria-label="Deck sections">
    <button
      v-for="(sec, i) in sections"
      :key="sec.page"
      class="section-tab"
      :class="sectionState(i)"
      :title="`Go to: ${sec.title} (slide ${sec.page})`"
      @click="handleClick(i)"
    >
      {{ sec.title }}
    </button>
  </nav>
</template>

<style scoped>
.presenter-section-nav {
  display: flex;
  align-items: center;
  gap: 2px;
  height: 32px;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: thin;
  scrollbar-color: var(--deck-border, #444) transparent;
  font-family: var(--deck-font-body, sans-serif);
  user-select: none;
}

/* Hide scrollbar on WebKit while keeping scroll functional */
.presenter-section-nav::-webkit-scrollbar {
  height: 3px;
}

.presenter-section-nav::-webkit-scrollbar-track {
  background: transparent;
}

.presenter-section-nav::-webkit-scrollbar-thumb {
  background: var(--deck-border, #444);
  border-radius: 2px;
}

.section-tab {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border: none;
  border-radius: 4px;
  background: transparent;
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.02em;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.2s ease;
  line-height: 1;
}

.section-tab.current {
  background: var(--deck-accent, #6366f1);
  color: #fff;
}

.section-tab.past {
  color: var(--deck-muted, #888);
}

.section-tab.past:hover {
  color: var(--deck-fg, #ccc);
  background: color-mix(in srgb, var(--deck-muted, #888) 15%, transparent);
}

.section-tab.future {
  color: var(--deck-border, #444);
}

.section-tab.future:hover {
  color: var(--deck-muted, #888);
  background: color-mix(in srgb, var(--deck-border, #444) 15%, transparent);
}

.section-tab.current:hover {
  opacity: 0.9;
}
</style>
