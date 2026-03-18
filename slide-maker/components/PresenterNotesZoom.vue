<script setup>
import { ref, watch, onMounted } from 'vue'

const STORAGE_KEY = 'presenter-notes-font-size'
const MIN_SIZE = 12
const MAX_SIZE = 28
const STEP = 2
const DEFAULT_SIZE = 16

const fontSize = ref(DEFAULT_SIZE)

onMounted(() => {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    const parsed = parseInt(stored, 10)
    if (parsed >= MIN_SIZE && parsed <= MAX_SIZE) {
      fontSize.value = parsed
    }
  }
  applySize()
})

watch(fontSize, () => {
  localStorage.setItem(STORAGE_KEY, String(fontSize.value))
  applySize()
})

function applySize() {
  document.documentElement.style.setProperty(
    '--presenter-notes-font-size',
    `${fontSize.value}px`
  )
  // Target Slidev's presenter notes container
  const notesEls = document.querySelectorAll(
    '.slidev-layout-presenter-notes, .presenter-notes, [class*="notes"]'
  )
  notesEls.forEach((el) => {
    ;(el as HTMLElement).style.fontSize = `${fontSize.value}px`
  })
}

function increase() {
  if (fontSize.value < MAX_SIZE) fontSize.value += STEP
}

function decrease() {
  if (fontSize.value > MIN_SIZE) fontSize.value -= STEP
}
</script>

<template>
  <div class="presenter-notes-zoom">
    <button
      class="zoom-btn"
      :disabled="fontSize <= MIN_SIZE"
      title="Decrease notes font size"
      @click="decrease"
    >
      &minus;
    </button>
    <span class="zoom-label">{{ fontSize }}px</span>
    <button
      class="zoom-btn"
      :disabled="fontSize >= MAX_SIZE"
      title="Increase notes font size"
      @click="increase"
    >
      +
    </button>
  </div>
</template>

<style scoped>
.presenter-notes-zoom {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-family: var(--deck-font-mono, monospace);
  font-size: 0.75rem;
  user-select: none;
}

.zoom-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: 1px solid var(--deck-muted, #888);
  border-radius: 4px;
  background: transparent;
  color: var(--deck-fg, #ccc);
  font-size: 1rem;
  cursor: pointer;
  line-height: 1;
  padding: 0;
}

.zoom-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.zoom-btn:hover:not(:disabled) {
  background: var(--deck-accent, #6366f1);
  color: #fff;
  border-color: var(--deck-accent, #6366f1);
}

.zoom-label {
  min-width: 3em;
  text-align: center;
  color: var(--deck-muted, #888);
}
</style>
