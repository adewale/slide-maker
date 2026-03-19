<script setup lang="ts">
withDefaults(defineProps<{
  blur?: number
  opacity?: number
  border?: boolean
}>(), {
  blur: 12,
  opacity: 0.15,
  border: true,
})
</script>

<template>
  <div
    class="glass-card"
    :style="{
      backdropFilter: `blur(${blur}px) saturate(180%)`,
      WebkitBackdropFilter: `blur(${blur}px) saturate(180%)`,
      background: `rgba(255, 255, 255, ${opacity})`,
      border: border ? '1px solid rgba(255, 255, 255, 0.18)' : 'none',
    }"
  >
    <slot />
  </div>
</template>

<style scoped>
.glass-card {
  border-radius: var(--deck-radius, 12px);
  padding: 1.5rem;
}
</style>
