<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useNav } from '@slidev/client'
import { createFixedClicks } from '@slidev/client/composables/useClicks.ts'
import SlideContainer from '@slidev/client/internals/SlideContainer.vue'
import SlideWrapper from '@slidev/client/internals/SlideWrapper.vue'

const CLICKS_MAX = 999999

const { slides, total } = useNav()

const clicksCache = new WeakMap()
function getClicksContext(route) {
  if (!clicksCache.has(route)) {
    clicksCache.set(route, createFixedClicks(route, CLICKS_MAX))
  }
  return clicksCache.get(route)
}

// Track scroll position for progress bar
const scrollContainer = ref(null)
const currentCardIndex = ref(0)

// Section boundaries
const sections = computed(() => {
  const all = slides.value || []
  const sectionStarts = []
  for (let i = 0; i < all.length; i++) {
    const fm = all[i]?.frontmatter || all[i]?.meta?.frontmatter || {}
    if (fm.layout === 'section' || fm.layout === 'cover') {
      sectionStarts.push(i + 1)
    }
  }
  if (sectionStarts.length === 0) {
    return [{ start: 1, end: total.value }]
  }
  const result = []
  for (let i = 0; i < sectionStarts.length; i++) {
    const start = sectionStarts[i]
    const end = i < sectionStarts.length - 1 ? sectionStarts[i + 1] - 1 : total.value
    result.push({ start, end })
  }
  return result
})

const segmentData = computed(() => {
  const page = currentCardIndex.value + 1
  return sections.value.map((sec, i) => {
    let state = 'unfilled'
    let fillPercent = 0
    if (page > sec.end) {
      state = 'completed'
      fillPercent = 100
    } else if (page >= sec.start) {
      state = 'active'
      const range = sec.end - sec.start + 1
      const progress = page - sec.start
      fillPercent = Math.round((progress / range) * 100)
    }
    return { index: i, state, fillPercent }
  })
})

// IntersectionObserver to track which card is current
let observer = null
const cardRefs = ref([])

function setCardRef(el, idx) {
  if (el) cardRefs.value[idx] = el
}

onMounted(() => {
  nextTick(() => {
    if (!scrollContainer.value) return
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
            const idx = Number(entry.target.dataset.slideIdx)
            if (!isNaN(idx)) currentCardIndex.value = idx
          }
        }
      },
      {
        root: scrollContainer.value,
        threshold: [0.3, 0.6],
      },
    )
    for (const card of cardRefs.value) {
      if (card) observer.observe(card)
    }
  })
})

onUnmounted(() => {
  if (observer) observer.disconnect()
})

function scrollToSection(secIdx) {
  const sec = sections.value[secIdx]
  if (!sec) return
  const card = cardRefs.value[sec.start - 1]
  if (card) card.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <Teleport to="body">
    <div class="mobile-scroll-root">
      <!-- Progress bar -->
      <div class="mobile-progress-bar">
        <span
          v-for="seg in segmentData"
          :key="seg.index"
          class="mobile-segment"
          :class="seg.state"
          :style="seg.state === 'active' ? { background: `linear-gradient(to right, var(--deck-accent, #2563eb) ${seg.fillPercent}%, var(--deck-border, var(--deck-muted, #ccc)) ${seg.fillPercent}%)`, opacity: 1 } : {}"
          @click="scrollToSection(seg.index)"
        />
      </div>

      <!-- Scrollable slide stack -->
      <div ref="scrollContainer" class="mobile-scroll-container">
        <section
          v-for="(route, idx) in slides"
          :key="route.no"
          :ref="(el) => setCardRef(el, idx)"
          :data-slide-idx="idx"
          class="scroll-card"
        >
          <SlideContainer :no="route.no">
            <SlideWrapper
              :clicks-context="getClicksContext(route)"
              :route="route"
              render-context="overview"
            />
          </SlideContainer>
        </section>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.mobile-scroll-root {
  position: fixed;
  inset: 0;
  z-index: 10000;
  background: var(--deck-bg, #fff);
  display: flex;
  flex-direction: column;
}

/* ── Progress bar with 44px tap targets ── */
.mobile-progress-bar {
  position: sticky;
  top: 0;
  z-index: 10001;
  display: flex;
  gap: 2px;
  height: 3px;
  padding: 20px 0;
  margin: -20px 0;
  background: transparent;
  pointer-events: auto;
  align-items: center;
}

.mobile-segment {
  flex: 1;
  height: 3px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  padding: 20px 0;
  background-clip: content-box;
}

.mobile-segment.completed {
  background-color: var(--deck-accent, #2563eb);
}

.mobile-segment.active {
  background-color: var(--deck-border, var(--deck-muted, #ccc));
}

.mobile-segment.unfilled {
  background-color: var(--deck-border, var(--deck-muted, #ccc));
  opacity: 0.25;
}

/* ── Scroll container ── */
.mobile-scroll-container {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  scroll-snap-type: y mandatory;
  -webkit-overflow-scrolling: touch;
}

/* ── Individual slide cards ── */
.scroll-card {
  scroll-snap-align: start;
  height: 100svh;
  flex-shrink: 0;
  border-bottom: 1px solid color-mix(in srgb, var(--deck-fg, #222) 8%, transparent);
  overflow: hidden;
}

/* Deck bg instead of black bars */
.scroll-card :deep(.slidev-slide-content) {
  background: var(--deck-bg, #fff) !important;
}

/* All v-click content visible, no animations */
.scroll-card :deep(.slidev-vclick-target) {
  transition: none !important;
}

.scroll-card :deep(.slidev-vclick-hidden) {
  opacity: 1 !important;
  transform: none !important;
  pointer-events: auto !important;
  user-select: auto !important;
}

.scroll-card :deep(.slidev-vclick-display-none) {
  display: block !important;
}

/* Mermaid diagrams — fit width */
.scroll-card :deep(svg.mermaid) {
  max-width: 100%;
  height: auto;
}

/* Code blocks — horizontal scroll */
.scroll-card :deep(pre) {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}
</style>
