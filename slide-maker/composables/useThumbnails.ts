import { ref } from 'vue'

export const showThumbnails = ref(false)
export const selectedSection = ref<number | null>(null)

export function toggleThumbnails() {
  showThumbnails.value = !showThumbnails.value
  if (!showThumbnails.value) {
    selectedSection.value = null
  }
}
