<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  preset?: 'subtle' | 'dramatic' | 'glow' | 'neon' | 'long'
}>(), {
  preset: 'subtle',
})

const shadowStyle = computed(() => {
  const accent = 'var(--deck-accent, #a78bfa)'
  switch (props.preset) {
    case 'subtle':
      return {
        boxShadow: [
          '0 1px 2px rgba(0,0,0,0.06)',
          '0 2px 4px rgba(0,0,0,0.06)',
          '0 4px 8px rgba(0,0,0,0.06)',
        ].join(', '),
      }
    case 'dramatic':
      return {
        boxShadow: [
          '0 2px 4px rgba(0,0,0,0.1)',
          '0 8px 16px rgba(0,0,0,0.12)',
          '0 16px 32px rgba(0,0,0,0.14)',
          '0 32px 64px rgba(0,0,0,0.16)',
        ].join(', '),
      }
    case 'glow':
      return {
        boxShadow: `0 0 15px color-mix(in srgb, ${accent} 30%, transparent), 0 0 30px color-mix(in srgb, ${accent} 20%, transparent), 0 0 60px color-mix(in srgb, ${accent} 10%, transparent)`,
      }
    case 'neon':
      return {
        boxShadow: `0 0 5px color-mix(in srgb, ${accent} 60%, transparent), 0 0 20px color-mix(in srgb, ${accent} 40%, transparent), 0 0 40px color-mix(in srgb, ${accent} 30%, transparent), 0 0 80px color-mix(in srgb, ${accent} 15%, transparent), inset 0 0 10px color-mix(in srgb, ${accent} 10%, transparent)`,
      }
    case 'long':
      return {
        boxShadow: [
          '0 2px 1px rgba(0,0,0,0.09)',
          '0 4px 2px rgba(0,0,0,0.09)',
          '0 8px 4px rgba(0,0,0,0.09)',
          '0 16px 8px rgba(0,0,0,0.09)',
          '0 32px 16px rgba(0,0,0,0.09)',
        ].join(', '),
      }
    default:
      return {}
  }
})
</script>

<template>
  <div class="shadow-stack" :style="shadowStyle">
    <slot />
  </div>
</template>

<style scoped>
.shadow-stack {
  border-radius: var(--deck-radius, 12px);
}
</style>
