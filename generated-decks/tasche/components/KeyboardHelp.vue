<script setup lang="ts">
import { onKeyStroke } from '@vueuse/core'
import { toggleHelp } from '../composables/useHelp'

onKeyStroke('Escape', () => toggleHelp())
</script>

<template>
  <Teleport to="body">
    <div class="help-backdrop" @click.self="toggleHelp()">
      <div class="help-panel">
        <button class="close-btn" title="Close (Esc)" @click="toggleHelp()">&times;</button>
        <h2 class="help-title">Keyboard Shortcuts</h2>

        <div class="hero">
          <div class="hero-row">
            <div class="hero-item">
              <kbd class="hero-key">&#8593;</kbd>
              <span class="hero-label">Prev slide</span>
            </div>
          </div>
          <div class="hero-row hero-mid">
            <div class="hero-item">
              <kbd class="hero-key">&#8592;</kbd>
              <span class="hero-label">Prev</span>
            </div>
            <div class="hero-item">
              <kbd class="hero-key">&#8594;</kbd>
              <kbd class="hero-key">Space</kbd>
              <span class="hero-label">Next</span>
            </div>
          </div>
          <div class="hero-row">
            <div class="hero-item">
              <kbd class="hero-key">&#8595;</kbd>
              <span class="hero-label">Next slide</span>
            </div>
          </div>
        </div>

        <div class="help-grid">
          <div class="help-column">
            <h3>Move</h3>
            <div class="help-row"><kbd>]</kbd><span>Skip to next slide</span></div>
            <div class="help-row"><kbd>[</kbd><span>Skip to prev slide</span></div>
            <div class="help-row"><kbd>Home</kbd><span>First slide</span></div>
            <div class="help-row"><kbd>End</kbd><span>Last slide</span></div>
            <div class="help-row"><kbd>g</kbd><span>Go to slide...</span></div>
            <div class="help-row"><kbd>o</kbd><span>All slides</span></div>
          </div>

          <div class="help-column">
            <h3>Screen</h3>
            <div class="help-row"><kbd>f</kbd><span>Fullscreen</span></div>
            <div class="help-row"><kbd>d</kbd><span>Light / dark</span></div>
            <div class="help-row"><kbd>b</kbd><span>Black screen</span></div>
            <div class="help-row"><kbd>w</kbd><span>White screen</span></div>
            <div class="help-row"><kbd>p</kbd><span>Presenter view</span></div>
            <div class="help-row"><kbd>e</kbd><span>Draw on slide</span></div>
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
  z-index: 9000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: color-mix(in srgb, var(--deck-bg, #0a0a0f) 88%, transparent);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.help-panel {
  position: relative;
  background: var(--deck-bg, #0a0a0f);
  border: 1px solid color-mix(in srgb, var(--deck-fg, #f0f0f5) 12%, transparent);
  border-radius: 12px;
  padding: 2rem 2.5rem;
  max-width: 720px;
  width: 90vw;
  box-shadow: 0 8px 32px color-mix(in srgb, var(--deck-fg, #f0f0f5) 14%, transparent);
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: 1px solid color-mix(in srgb, var(--deck-fg, #f0f0f5) 20%, transparent);
  border-radius: 4px;
  background: transparent;
  color: var(--deck-muted, #888);
  font-size: 1.1rem;
  cursor: pointer;
  padding: 0;
  line-height: 1;
}

.close-btn:hover {
  color: var(--deck-fg, #f0f0f5);
  border-color: var(--deck-muted, #888);
}

.help-title {
  font-family: var(--deck-font-display, sans-serif);
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--deck-fg, #f0f0f5);
  margin-bottom: 1.5rem;
  text-align: center;
}

.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid color-mix(in srgb, var(--deck-fg, #f0f0f5) 10%, transparent);
}

.hero-row {
  display: flex;
  justify-content: center;
}

.hero-mid {
  gap: 3rem;
}

.hero-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.hero-key {
  font-size: 0.95rem;
  padding: 0.25em 0.6em;
  background: color-mix(in srgb, var(--deck-accent, #e2e2e8) 14%, transparent);
  border-color: color-mix(in srgb, var(--deck-accent, #e2e2e8) 30%, transparent);
}

.hero-label {
  font-family: var(--deck-font-body, sans-serif);
  font-size: 1rem;
  font-weight: 600;
  color: var(--deck-fg, #f0f0f5);
  margin-left: 0.3rem;
}

.help-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem 2.5rem;
  align-items: start;
}

.help-column h3 {
  font-family: var(--deck-font-body, sans-serif);
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--deck-accent, #e2e2e8);
  margin-bottom: 0.6rem;
  padding-bottom: 0.4rem;
  border-bottom: 1px solid color-mix(in srgb, var(--deck-accent, #e2e2e8) 15%, transparent);
}

.help-row {
  display: grid;
  grid-template-columns: 3.2rem 1fr;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 0.35rem;
  font-family: var(--deck-font-body, sans-serif);
  font-size: 0.8rem;
  color: var(--deck-fg, #f0f0f5);
}

.help-row span {
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
  color: var(--deck-muted, #888);
  background: color-mix(in srgb, var(--deck-fg, #f0f0f5) 5%, transparent);
  border: 1px solid color-mix(in srgb, var(--deck-fg, #f0f0f5) 12%, transparent);
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
