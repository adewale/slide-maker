<script setup lang="ts">
withDefaults(defineProps<{
  size?: string
  thickness?: string
  color?: string
  padding?: string
}>(), {
  size: '12px',
  thickness: '2px',
  color: 'var(--deck-accent)',
  padding: '1.5rem',
})
</script>

<template>
  <div class="corner-card" :style="{ padding }">
    <span class="corner tl" :style="{ width: size, height: size, borderWidth: thickness, borderColor: color }" />
    <span class="corner tr" :style="{ width: size, height: size, borderWidth: thickness, borderColor: color }" />
    <span class="corner bl" :style="{ width: size, height: size, borderWidth: thickness, borderColor: color }" />
    <span class="corner br" :style="{ width: size, height: size, borderWidth: thickness, borderColor: color }" />
    <slot />
  </div>
</template>

<style scoped>
.corner-card {
  position: relative;
}

.corner {
  position: absolute;
  border-style: solid;
  border-color: var(--deck-accent);
}

.corner.tl {
  top: 0; left: 0;
  border-right: none;
  border-bottom: none;
}

.corner.tr {
  top: 0; right: 0;
  border-left: none;
  border-bottom: none;
}

.corner.bl {
  bottom: 0; left: 0;
  border-right: none;
  border-top: none;
}

.corner.br {
  bottom: 0; right: 0;
  border-left: none;
  border-top: none;
}
</style>
