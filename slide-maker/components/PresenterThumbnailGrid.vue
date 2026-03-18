<script setup>
import { computed, watch, ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useNav } from '@slidev/client'
import { showThumbnails, selectedSection, toggleThumbnails } from '../composables/useThumbnails'
import { useSections } from '../composables/useSections'

const { currentPage, total, slides, go } = useNav()
const { sections } = useSections()

const gridRef = ref(null)

function extractTitle(slide) {
  const content = slide?.content || slide?.source?.content || ''
  const match = content.match(/^#\s+(.+)$/m)
  return match ? match[1].trim() : null
}

// Build slide card data
const slideCards = computed(() => {
  const all = slides.value || []
  return all.map((slide, i) => {
    const fm = slide?.frontmatter || slide?.meta?.frontmatter || {}
    const page = i + 1
    const title = fm.title || extractTitle(slide) || ''
    const layout = fm.layout || 'default'

    // Determine which section this slide belongs to
    let sectionIndex = 0
    for (let s = sections.value.length - 1; s >= 0; s--) {
      if (page >= sections.value[s].start) {
        sectionIndex = s
        break
      }
    }

    return { page, title, layout, sectionIndex }
  })
})

// Filter cards when a section is selected
const visibleCards = computed(() => {
  if (selectedSection.value !== null) {
    return slideCards.value.filter((c) => c.sectionIndex === selectedSection.value)
  }
  return slideCards.value
})

// Section label for filter indicator
const filterLabel = computed(() => {
  if (selectedSection.value !== null && sections.value[selectedSection.value]) {
    return sections.value[selectedSection.value].title
  }
  return null
})

function navigateTo(page) {
  go(page)
  showThumbnails.value = false
  selectedSection.value = null
}

function clearFilter() {
  selectedSection.value = null
}

function handleKeydown(e) {
  if (e.key === 'Escape' && showThumbnails.value) {
    showThumbnails.value = false
    selectedSection.value = null
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})

// Scroll to current slide when grid opens
watch(showThumbnails, async (open) => {
  if (open) {
    await nextTick()
    const activeCard = gridRef.value?.querySelector('.card.active')
    if (activeCard) {
      activeCard.scrollIntoView({ block: 'center', behavior: 'smooth' })
    }
  }
})

// Scroll to section when selectedSection changes while grid is open
watch(selectedSection, async (secIdx) => {
  if (secIdx !== null && showThumbnails.value) {
    await nextTick()
    const firstCard = gridRef.value?.querySelector('.card')
    if (firstCard) {
      firstCard.scrollIntoView({ block: 'start', behavior: 'smooth' })
    }
  }
})
</script>

<template>
  <Teleport to="body">
    <Transition name="grid-fade">
      <div v-if="showThumbnails" class="thumbnail-overlay" @click.self="toggleThumbnails">
        <div class="thumbnail-panel" ref="gridRef">
          <div class="panel-header">
            <span class="panel-title">
              All Slides
              <span v-if="filterLabel" class="filter-badge">
                {{ filterLabel }}
                <button class="clear-filter" title="Clear section filter" @click="clearFilter">&times;</button>
              </span>
            </span>
            <span class="slide-count">{{ visibleCards.length }} of {{ total }} slides</span>
            <button class="close-btn" title="Close (Esc)" @click="toggleThumbnails">&times;</button>
          </div>
          <div class="card-grid">
            <button
              v-for="card in visibleCards"
              :key="card.page"
              class="card"
              :class="{ active: card.page === currentPage }"
              @click="navigateTo(card.page)"
            >
              <span class="card-number">{{ card.page }}</span>
              <span class="card-layout">{{ card.layout }}</span>
              <span v-if="card.title" class="card-title">{{ card.title }}</span>
              <span v-else class="card-title card-title--empty">Slide {{ card.page }}</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.thumbnail-overlay {
  position: fixed;
  inset: 0;
  z-index: 500;
  background: color-mix(in srgb, var(--deck-bg) 88%, transparent);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.thumbnail-panel {
  width: 90vw;
  max-width: 1200px;
  max-height: 85vh;
  overflow-y: auto;
  background: var(--deck-bg, #111);
  border: 1px solid var(--deck-border, #444);
  border-radius: 12px;
  padding: 16px;
  scrollbar-width: thin;
  scrollbar-color: var(--deck-border, #444) transparent;
}

.panel-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  font-family: var(--deck-font-body, sans-serif);
}

.panel-title {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--deck-fg, #ccc);
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 4px;
  background: var(--deck-accent, #6366f1);
  color: #fff;
  font-size: 0.7rem;
  font-weight: 500;
}

.clear-filter {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  font-size: 0.75rem;
  cursor: pointer;
  padding: 0;
  line-height: 1;
}

.clear-filter:hover {
  background: rgba(255, 255, 255, 0.35);
}

.slide-count {
  font-size: 0.7rem;
  color: var(--deck-muted, #888);
  margin-left: auto;
}

.close-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: 1px solid var(--deck-border, #444);
  border-radius: 4px;
  background: transparent;
  color: var(--deck-muted, #888);
  font-size: 1.1rem;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  flex-shrink: 0;
}

.close-btn:hover {
  color: var(--deck-fg, #ccc);
  border-color: var(--deck-muted, #888);
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 10px;
}

@media (min-width: 900px) {
  .card-grid {
    grid-template-columns: repeat(6, 1fr);
  }
}

@media (min-width: 600px) and (max-width: 899px) {
  .card-grid {
    grid-template-columns: repeat(5, 1fr);
  }
}

.card {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 10px;
  border: 1px solid var(--deck-border, #444);
  border-radius: 6px;
  background: transparent;
  cursor: pointer;
  text-align: left;
  font-family: var(--deck-font-body, sans-serif);
  transition: all 0.2s ease;
  min-height: 72px;
}

.card:hover {
  border-color: var(--deck-muted, #888);
  background: color-mix(in srgb, var(--deck-border, #444) 20%, transparent);
}

.card.active {
  border-color: var(--deck-accent, #6366f1);
  border-width: 2px;
  padding: 9px; /* compensate for 2px border */
}

.card-number {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--deck-fg, #ccc);
  font-family: var(--deck-font-mono, monospace);
}

.card.active .card-number {
  color: var(--deck-accent, #6366f1);
}

.card-layout {
  display: inline-block;
  align-self: flex-start;
  padding: 1px 5px;
  border-radius: 4px;
  font-size: 0.6rem;
  font-weight: 500;
  letter-spacing: 0.03em;
  background: color-mix(in srgb, var(--deck-border, #444) 40%, transparent);
  color: var(--deck-muted, #888);
}

.card-title {
  font-size: 0.65rem;
  color: var(--deck-muted, #888);
  line-height: 1.3;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.card-title--empty {
  color: var(--deck-border, #444);
  font-style: italic;
}

/* Transition */
.grid-fade-enter-active,
.grid-fade-leave-active {
  transition: opacity 0.2s ease;
}

.grid-fade-enter-from,
.grid-fade-leave-to {
  opacity: 0;
}
</style>
