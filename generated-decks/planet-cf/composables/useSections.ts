import { computed } from 'vue'
import { useNav } from '@slidev/client'

function extractTitle(slide: any): string | null {
  const content = slide?.content || slide?.source?.content || ''
  const match = content.match(/^#\s+(.+)$/m)
  return match ? match[1].trim() : null
}

export function useSections() {
  const { currentPage, total, slides } = useNav()

  const sections = computed(() => {
    const all = slides.value || []
    const sectionStarts: { page: number; title: string }[] = []

    for (let i = 0; i < all.length; i++) {
      const fm = (all[i] as any)?.frontmatter || (all[i] as any)?.meta?.frontmatter || {}
      if (fm.layout === 'section' || fm.layout === 'cover') {
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

  const currentSectionIndex = computed(() => {
    const page = currentPage.value
    for (let i = sections.value.length - 1; i >= 0; i--) {
      if (page >= sections.value[i].start) {
        return i
      }
    }
    return 0
  })

  return { sections, currentSectionIndex }
}
