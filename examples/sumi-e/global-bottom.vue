<template>
  <div class="global-paper-texture" />
</template>

<style>
.global-paper-texture {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: -1;
  background:
    radial-gradient(ellipse at 30% 70%, rgba(26, 26, 26, 0.015) 0%, transparent 50%),
    radial-gradient(ellipse at 70% 30%, rgba(26, 26, 26, 0.01) 0%, transparent 50%),
    linear-gradient(180deg, rgba(245, 240, 232, 0) 0%, rgba(235, 228, 218, 0.3) 100%);
}
</style>
