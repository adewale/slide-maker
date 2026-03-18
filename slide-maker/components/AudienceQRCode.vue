<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const visible = ref(false)

const currentUrl = computed(() => {
  if (typeof window !== 'undefined') {
    return window.location.href
  }
  return ''
})

function toggle() {
  visible.value = !visible.value
}

function onKeyDown(e) {
  // Toggle with 'q' key (for QR / URL share)
  if (e.key === 'q' && !e.ctrlKey && !e.metaKey && !e.altKey) {
    // Don't trigger if user is typing in an input
    const tag = (e.target || {}).tagName
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
    toggle()
  }
  if (e.key === 'Escape' && visible.value) {
    visible.value = false
  }
}

onMounted(() => {
  document.addEventListener('keydown', onKeyDown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKeyDown)
})
</script>

<template>
  <Teleport to="body">
    <div v-if="visible" class="url-overlay" @click.self="toggle()">
      <div class="url-card">
        <button class="close-btn" title="Close (Esc)" @click="toggle">&times;</button>
        <p class="url-heading">Share this slide</p>
        <p class="url-text">{{ currentUrl }}</p>
        <p class="url-hint">Press <kbd>q</kbd> or click outside to dismiss</p>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.url-overlay {
  position: fixed;
  inset: 0;
  z-index: 9500;
  display: flex;
  align-items: center;
  justify-content: center;
  background: color-mix(in srgb, var(--deck-bg) 88%, transparent);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.url-card {
  position: relative;
  text-align: center;
  padding: 3rem 4rem;
  max-width: 90vw;
}

.close-btn {
  position: absolute;
  top: 0;
  right: 0;
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
}

.close-btn:hover {
  color: var(--deck-fg, #ccc);
  border-color: var(--deck-muted, #888);
}

.url-heading {
  font-family: var(--deck-font-display, sans-serif);
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 1.5rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.url-text {
  font-family: var(--deck-font-mono, monospace);
  font-size: clamp(1.2rem, 3vw, 2.5rem);
  color: #fff;
  word-break: break-all;
  line-height: 1.4;
  padding: 1rem 2rem;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
}

.url-hint {
  margin-top: 1.5rem;
  font-family: var(--deck-font-body, sans-serif);
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.35);
}

.url-hint kbd {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.6em;
  padding: 0.1em 0.4em;
  font-family: var(--deck-font-mono, monospace);
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 4px;
}
</style>
