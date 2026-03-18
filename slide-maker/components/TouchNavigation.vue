<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useNav } from '@slidev/client'

const { next, prev, nextSlide } = useNav()

const THRESHOLD_X = 50
const THRESHOLD_Y = 50

let startX = 0
let startY = 0
let tracking = false

function onTouchStart(e) {
  if (e.touches.length !== 1) return
  startX = e.touches[0].clientX
  startY = e.touches[0].clientY
  tracking = true
}

function onTouchEnd(e) {
  if (!tracking) return
  tracking = false

  const touch = e.changedTouches[0]
  if (!touch) return

  const dx = touch.clientX - startX
  const dy = touch.clientY - startY
  const absDx = Math.abs(dx)
  const absDy = Math.abs(dy)

  // Vertical swipe takes priority when both exceed threshold
  if (absDy > THRESHOLD_Y && absDy > absDx) {
    // Swipe up = next slide
    if (dy < 0) {
      nextSlide()
    }
    // Swipe down is intentionally not mapped (avoids conflict with pull-to-refresh)
    return
  }

  // Horizontal swipe
  if (absDx > THRESHOLD_X && absDx > absDy) {
    if (dx > 0) {
      // Swipe right = next click
      next()
    } else {
      // Swipe left = previous click
      prev()
    }
  }
}

onMounted(() => {
  document.addEventListener('touchstart', onTouchStart, { passive: true })
  document.addEventListener('touchend', onTouchEnd, { passive: true })
})

onUnmounted(() => {
  document.removeEventListener('touchstart', onTouchStart)
  document.removeEventListener('touchend', onTouchEnd)
})
</script>

<template>
  <!-- Renderless component: touch handlers are attached to the document -->
  <slot />
</template>
