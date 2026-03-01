<script setup>
defineProps({
  intensity: { type: Number, default: 0.03 },
  position: { type: String, default: 'bottom-right' },
})
</script>

<template>
  <div class="ink-wash" :class="'ink-wash--' + position" :style="{ '--intensity': intensity }" />
</template>

<style scoped>
.ink-wash {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.ink-wash--bottom-right {
  background: radial-gradient(
    ellipse at 85% 85%,
    rgba(26, 26, 26, var(--intensity)) 0%,
    transparent 60%
  );
}

.ink-wash--top-left {
  background: radial-gradient(
    ellipse at 15% 15%,
    rgba(26, 26, 26, var(--intensity)) 0%,
    transparent 60%
  );
}

.ink-wash--center {
  background: radial-gradient(
    ellipse at 50% 50%,
    rgba(26, 26, 26, var(--intensity)) 0%,
    transparent 70%
  );
}
</style>
