<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useNav } from '@slidev/client'
import { showHelp } from './composables/useHelp'
import KeyboardHelp from './components/KeyboardHelp.vue'

const nav = useNav()
const pointerX = ref(0)
const pointerY = ref(0)
const pointerVisible = ref(false)
let hideTimer: ReturnType<typeof setTimeout>

function onMouseMove(e: MouseEvent) {
  pointerX.value = e.clientX
  pointerY.value = e.clientY
  pointerVisible.value = true
  clearTimeout(hideTimer)
  hideTimer = setTimeout(() => {
    pointerVisible.value = false
  }, 3000)
}

onMounted(() => {
  if (nav.isPresenter?.value) {
    document.addEventListener('mousemove', onMouseMove)
  }
})

onUnmounted(() => {
  document.removeEventListener('mousemove', onMouseMove)
  clearTimeout(hideTimer)
})
</script>

<template>
  <!-- Laser pointer (presenter only) -->
  <div
    v-if="nav.isPresenter?.value && pointerVisible"
    class="laser-pointer"
    :style="{
      left: `${pointerX}px`,
      top: `${pointerY}px`,
    }"
  />

  <!-- Keyboard help overlay -->
  <KeyboardHelp v-if="showHelp" />
</template>

<style scoped>
.laser-pointer {
  position: fixed;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(239, 68, 68, 0.9) 0%, rgba(239, 68, 68, 0.4) 40%, transparent 70%);
  box-shadow: 0 0 12px 4px rgba(239, 68, 68, 0.5);
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 9998;
  transition: opacity 0.3s ease;
}
</style>
