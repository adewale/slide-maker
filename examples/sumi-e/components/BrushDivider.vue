<script setup>
defineProps({
  width: { type: [String, Number], default: '60%' },
  opacity: { type: Number, default: 0.3 },
})
</script>

<template>
  <div class="brush-divider" :style="{ width: typeof width === 'number' ? width + 'px' : width }">
    <svg viewBox="0 0 400 12" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="ink-texture">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="4" seed="3" />
          <feDisplacementMap in="SourceGraphic" scale="3" />
        </filter>
      </defs>
      <path
        d="M 0 6 Q 40 2, 100 5 T 200 6 T 300 5 T 400 6"
        fill="none"
        :stroke="'rgba(26, 26, 26, ' + opacity + ')'"
        stroke-width="2"
        stroke-linecap="round"
        filter="url(#ink-texture)"
      />
    </svg>
  </div>
</template>

<style scoped>
.brush-divider {
  margin: 2rem 0;
}

.brush-divider svg {
  width: 100%;
  height: 12px;
  overflow: visible;
}
</style>
