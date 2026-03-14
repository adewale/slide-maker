<script setup lang="ts">
import { onKeyStroke } from '@vueuse/core'
import { toggleHelp } from '../composables/useHelp'

onKeyStroke('Escape', () => toggleHelp())
</script>

<template>
  <Teleport to="body">
    <div class="help-backdrop" @click.self="toggleHelp()">
      <div class="help-panel">
        <h2 class="help-title">Keyboard Shortcuts</h2>
        <div class="help-grid">
          <div class="help-column">
            <h3>Navigation</h3>
            <div class="help-row">
              <kbd>&#8594;</kbd> / <kbd>Space</kbd>
              <span>Next slide</span>
            </div>
            <div class="help-row">
              <kbd>&#8592;</kbd>
              <span>Previous slide</span>
            </div>
            <div class="help-row">
              <kbd>&#8593;</kbd>
              <span>Previous click</span>
            </div>
            <div class="help-row">
              <kbd>&#8595;</kbd>
              <span>Next click</span>
            </div>
            <div class="help-row">
              <kbd>Home</kbd>
              <span>First slide</span>
            </div>
            <div class="help-row">
              <kbd>End</kbd>
              <span>Last slide</span>
            </div>
          </div>

          <div class="help-column">
            <h3>View</h3>
            <div class="help-row">
              <kbd>o</kbd>
              <span>Slide overview</span>
            </div>
            <div class="help-row">
              <kbd>d</kbd>
              <span>Toggle dark mode</span>
            </div>
            <div class="help-row">
              <kbd>f</kbd>
              <span>Fullscreen</span>
            </div>
            <div class="help-row">
              <kbd>g</kbd>
              <span>Go to slide</span>
            </div>
            <div class="help-row">
              <kbd>Esc</kbd>
              <span>Close overlays</span>
            </div>
          </div>

          <div class="help-column">
            <h3>Tools</h3>
            <div class="help-row">
              <kbd>p</kbd>
              <span>Presenter mode</span>
            </div>
            <div class="help-row">
              <kbd>?</kbd>
              <span>Toggle this panel</span>
            </div>
            <div class="help-row">
              <kbd>e</kbd>
              <span>Pen / drawing</span>
            </div>
            <div class="help-row">
              <kbd>u</kbd>
              <span>Pen color</span>
            </div>
            <div class="help-row">
              <kbd>Delete</kbd>
              <span>Clear drawings</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.help-backdrop {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.help-panel {
  background: rgba(30, 30, 40, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 2rem 2.5rem;
  max-width: 720px;
  width: 90vw;
}

.help-title {
  font-family: var(--deck-font-display, sans-serif);
  font-size: 1.4rem;
  font-weight: 700;
  color: #f0eef5;
  margin-bottom: 1.5rem;
  text-align: center;
}

.help-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.help-column h3 {
  font-family: var(--deck-font-display, sans-serif);
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--deck-accent, #a78bfa);
  margin-bottom: 0.75rem;
}

.help-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 0.8rem;
  color: rgba(240, 238, 245, 0.7);
}

.help-row span {
  margin-left: auto;
  white-space: nowrap;
}

kbd {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.6em;
  padding: 0.15em 0.45em;
  font-family: var(--deck-font-mono, monospace);
  font-size: 0.75rem;
  color: #f0eef5;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 4px;
  line-height: 1.4;
}

@media (max-width: 640px) {
  .help-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}
</style>
