<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const time = ref('')
let timer: ReturnType<typeof setInterval>

function updateClock() {
  const now = new Date()
  time.value = now.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
}

onMounted(() => {
  updateClock()
  timer = setInterval(updateClock, 1000)
})

onUnmounted(() => {
  clearInterval(timer)
})
</script>

<template>
  <span class="nav-clock">{{ time }}</span>
</template>

<style scoped>
.nav-clock {
  font-family: var(--deck-font-mono, 'JetBrains Mono', monospace);
  font-size: 0.75rem;
  color: rgba(240, 238, 245, 0.5);
  letter-spacing: 0.04em;
  padding: 0 0.5rem;
  user-select: none;
}
</style>
