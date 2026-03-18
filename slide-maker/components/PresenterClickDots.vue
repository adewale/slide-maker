<script setup>
import { computed } from 'vue'
import { useNav } from '@slidev/client'

const { clicks, clicksTotal, currentPage } = useNav()

const total = computed(() => clicksTotal.value || 0)
const current = computed(() => clicks.value || 0)
</script>

<template>
  <div v-if="total > 0" class="presenter-click-dots" aria-label="Click progress">
    <svg
      :width="total * 12 - 4"
      height="8"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        v-for="i in total"
        :key="i"
        :cx="(i - 1) * 12 + 4"
        cy="4"
        r="4"
        :fill="i <= current ? 'var(--deck-accent, #6366f1)' : 'none'"
        :stroke="i <= current ? 'var(--deck-accent, #6366f1)' : 'var(--deck-muted, #888)'"
        stroke-width="1.5"
      />
    </svg>
  </div>
</template>

<style scoped>
.presenter-click-dots {
  display: inline-flex;
  align-items: center;
  padding: 4px 0;
}
</style>
