<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  effect?: 'duotone' | 'vignette' | 'grain' | 'grayscale' | 'sepia' | 'none'
}>(), {
  effect: 'none',
})

const filterStyle = computed(() => {
  switch (props.effect) {
    case 'grayscale':
      return { filter: 'grayscale(100%)' }
    case 'sepia':
      return { filter: 'sepia(80%) saturate(120%)' }
    case 'duotone':
      return { filter: 'grayscale(100%) contrast(1.1) brightness(1.1)' }
    case 'vignette':
      return {}
    case 'grain':
      return {}
    default:
      return {}
  }
})
</script>

<template>
  <div class="image-fx" :class="`fx-${effect}`" :style="filterStyle">
    <slot />
    <div v-if="effect === 'vignette'" class="vignette-overlay" />
    <svg v-if="effect === 'grain'" class="grain-overlay" width="100%" height="100%">
      <filter id="grain-filter">
        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain-filter)" opacity="0.12" />
    </svg>
  </div>
</template>

<style scoped>
.image-fx {
  position: relative;
  display: inline-block;
  overflow: hidden;
}

.image-fx :deep(img) {
  display: block;
  width: 100%;
  height: auto;
}

.fx-duotone {
  position: relative;
}

.fx-duotone::after {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--deck-accent, #a78bfa);
  mix-blend-mode: color;
  opacity: 0.6;
  pointer-events: none;
}

.vignette-overlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at center, transparent 50%, rgba(0, 0, 0, 0.6) 100%);
  pointer-events: none;
}

.grain-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  mix-blend-mode: overlay;
}
</style>
