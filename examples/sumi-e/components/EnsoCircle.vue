<script setup>
defineProps({
  size: { type: [String, Number], default: 320 },
  opacity: { type: Number, default: 0.08 },
  strokeWidth: { type: Number, default: 3 },
})
</script>

<template>
  <div class="enso-container">
    <svg
      :width="size"
      :height="size"
      :viewBox="'0 0 ' + size + ' ' + size"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id="brush-filter">
          <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="5" seed="7" />
          <feDisplacementMap in="SourceGraphic" scale="4" />
        </filter>
      </defs>
      <circle
        :cx="size / 2"
        :cy="size / 2"
        :r="size / 2 - 20"
        fill="none"
        :stroke="'rgba(26, 26, 26, ' + opacity + ')'"
        :stroke-width="strokeWidth"
        stroke-linecap="round"
        stroke-dasharray="92% 8%"
        filter="url(#brush-filter)"
      />
    </svg>
  </div>
</template>

<style scoped>
.enso-container {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
