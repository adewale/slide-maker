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
            <h3>Click-level</h3>
            <div class="help-row">
              <kbd>&#8594;</kbd> / <kbd>Space</kbd>
              <span>Next click</span>
            </div>
            <div class="help-row">
              <kbd>&#8592;</kbd>
              <span>Previous click</span>
            </div>
            <h3>Slide-level</h3>
            <div class="help-row">
              <kbd>&#8595;</kbd>
              <span>Next slide</span>
            </div>
            <div class="help-row">
              <kbd>&#8593;</kbd>
              <span>Previous slide</span>
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
  background: color-mix(in srgb, var(--deck-bg, #eceff4) 88%, transparent);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.help-panel {
  background: var(--deck-bg, #eceff4);
  border: 1px solid color-mix(in srgb, var(--deck-fg, #2e3440) 12%, transparent);
  border-radius: 16px;
  padding: 2rem 2.5rem;
  max-width: 720px;
  width: 90vw;
  box-shadow: 0 8px 32px color-mix(in srgb, var(--deck-fg, #2e3440) 14%, transparent);
}

.help-title {
  font-family: var(--deck-font-display, sans-serif);
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--deck-fg, #2e3440);
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
  color: var(--deck-accent, #3b5f87);
  margin-bottom: 0.75rem;
}

.help-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-family: var(--deck-font-body, sans-serif);
  font-size: 0.8rem;
  color: var(--deck-muted, rgba(46, 52, 64, 0.45));
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
  color: var(--deck-accent, #3b5f87);
  background: color-mix(in srgb, var(--deck-accent, #3b5f87) 8%, transparent);
  border: 1px solid color-mix(in srgb, var(--deck-accent, #3b5f87) 22%, transparent);
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
