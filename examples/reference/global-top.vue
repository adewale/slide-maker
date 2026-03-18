<script setup lang="ts">
import { showHelp } from './composables/useHelp'
import KeyboardHelp from './components/KeyboardHelp.vue'
import ProgressFractionBadge from './components/ProgressFractionBadge.vue'
</script>

<template>
  <ProgressFractionBadge />
  <KeyboardHelp v-if="showHelp" />
</template>
