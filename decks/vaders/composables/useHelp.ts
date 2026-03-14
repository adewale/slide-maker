import { ref } from 'vue'

export const showHelp = ref(false)

export function toggleHelp() {
  showHelp.value = !showHelp.value
}
