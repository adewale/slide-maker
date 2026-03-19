<script setup>
import { ref, onMounted, watch } from 'vue'

const STORAGE_KEY = 'presenter-layout-mode'

const layouts = [
  { id: 'notes-focus', label: 'Notes focus', notes: 70, slides: 30 },
  { id: 'balanced', label: 'Balanced', notes: 50, slides: 50 },
  { id: 'slides-focus', label: 'Slides focus', notes: 30, slides: 70 },
]

const active = ref('balanced')

onMounted(() => {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored && layouts.find((l) => l.id === stored)) {
    active.value = stored
  }
  applyLayout()
})

watch(active, () => {
  localStorage.setItem(STORAGE_KEY, active.value)
  applyLayout()
})

function applyLayout() {
  const layout = layouts.find((l) => l.id === active.value)
  if (!layout) return
  document.documentElement.style.setProperty(
    '--presenter-notes-width',
    `${layout.notes}%`
  )
  document.documentElement.style.setProperty(
    '--presenter-slides-width',
    `${layout.slides}%`
  )
}

function select(id) {
  active.value = id
}
</script>

<template>
  <div class="presenter-layout-picker" role="radiogroup" aria-label="Presenter layout">
    <button
      v-for="layout in layouts"
      :key="layout.id"
      class="layout-btn"
      :class="{ active: active === layout.id }"
      :title="layout.label"
      :aria-checked="active === layout.id"
      role="radio"
      @click="select(layout.id)"
    >
      <svg width="28" height="18" viewBox="0 0 28 18" xmlns="http://www.w3.org/2000/svg">
        <rect x="0.5" y="0.5" width="27" height="17" rx="2" fill="none"
              stroke="currentColor" stroke-width="1" />
        <!-- Divider line based on split ratio -->
        <line
          :x1="(layout.slides / 100) * 27"
          y1="1"
          :x2="(layout.slides / 100) * 27"
          y2="17"
          stroke="currentColor"
          stroke-width="1"
        />
        <!-- Left = slides area (filled) -->
        <rect
          x="1" y="1"
          :width="(layout.slides / 100) * 27 - 1"
          height="16"
          :fill="active === layout.id ? 'var(--deck-accent, #6366f1)' : 'currentColor'"
          opacity="0.2"
          rx="1"
        />
      </svg>
    </button>
  </div>
</template>

<style scoped>
.presenter-layout-picker {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.layout-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 3px;
  border: 1px solid transparent;
  border-radius: 4px;
  background: transparent;
  color: var(--deck-muted, #888);
  cursor: pointer;
  transition: all 0.2s ease;
}

.layout-btn:hover {
  color: var(--deck-fg, #ccc);
  border-color: var(--deck-muted, #888);
}

.layout-btn.active {
  color: var(--deck-accent, #6366f1);
  border-color: var(--deck-accent, #6366f1);
}
</style>
