<script setup>
import { computed } from 'vue'
import { useNav } from '@slidev/client'

const { currentPage, total, slides } = useNav()

// Build section list from slides with layout: 'section' or 'cover'
const sections = computed(() => {
  const all = slides.value || []
  const sectionStarts = []

  for (let i = 0; i < all.length; i++) {
    const fm = all[i]?.frontmatter || all[i]?.meta?.frontmatter || {}
    if (fm.layout === 'section' || fm.layout === 'cover') {
      // Extract title from the slide content or frontmatter
      const title = fm.title || extractTitle(all[i]) || `Section ${sectionStarts.length + 1}`
      sectionStarts.push({ page: i + 1, title })
    }
  }

  if (sectionStarts.length === 0) {
    return [{ page: 1, title: 'Presentation', start: 1, end: total.value }]
  }

  return sectionStarts.map((sec, i) => ({
    ...sec,
    start: sec.page,
    end: i < sectionStarts.length - 1 ? sectionStarts[i + 1].page - 1 : total.value,
  }))
})

function extractTitle(slide) {
  // Try to get the first heading from slide content
  const content = slide?.content || slide?.source?.content || ''
  const match = content.match(/^#\s+(.+)$/m)
  return match ? match[1].trim() : null
}

const currentSection = computed(() => {
  const page = currentPage.value
  for (let i = sections.value.length - 1; i >= 0; i--) {
    if (page >= sections.value[i].start) {
      return { ...sections.value[i], index: i }
    }
  }
  return null
})

const label = computed(() => {
  const sec = currentSection.value
  if (!sec) return ''
  return `${sec.title} (${sec.index + 1} of ${sections.value.length})`
})
</script>

<template>
  <div v-if="label" class="presenter-section-label">
    <span class="section-prefix">Section:</span>
    <span class="section-name">{{ label }}</span>
  </div>
</template>

<style scoped>
.presenter-section-label {
  display: inline-flex;
  align-items: center;
  gap: 0.4em;
  font-family: var(--deck-font-body, sans-serif);
  font-size: 0.8rem;
  color: var(--deck-muted, #888);
}

.section-prefix {
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-size: 0.7rem;
  color: var(--deck-accent, #6366f1);
}

.section-name {
  color: var(--deck-fg, #ccc);
}
</style>
