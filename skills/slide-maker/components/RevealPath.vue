<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = withDefaults(defineProps<{
  path?: string
  duration?: number
  delay?: number
}>(), {
  path: 'M 0,50 C 20,0 80,0 100,50',
  duration: 2000,
  delay: 0,
})

const el = ref<HTMLElement>()
const visible = ref(false)

onMounted(() => {
  setTimeout(() => {
    visible.value = true
  }, props.delay)
})
</script>

<template>
  <div
    ref="el"
    class="reveal-path"
    :class="{ 'reveal-path--active': visible }"
    :style="{
      offsetPath: `path('${path}')`,
      animationDuration: `${duration}ms`,
      animationDelay: `${delay}ms`,
    }"
  >
    <slot />
  </div>
</template>

<style scoped>
.reveal-path {
  offset-distance: 0%;
  opacity: 0;
}

.reveal-path--active {
  animation: reveal-along-path var(--duration, 2000ms) cubic-bezier(0.4, 0, 0.2, 1) forwards;
  animation-duration: inherit;
  animation-delay: inherit;
}

@keyframes reveal-along-path {
  0% {
    offset-distance: 0%;
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  100% {
    offset-distance: 100%;
    opacity: 1;
  }
}
</style>
