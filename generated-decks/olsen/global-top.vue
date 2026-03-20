<script setup lang="ts">
import { showHelp } from './composables/useHelp'
import KeyboardHelp from './components/KeyboardHelp.vue'
import ProgressTallyMarks from './components/ProgressTallyMarks.vue'
</script>

<template>
  <ProgressTallyMarks />
  <KeyboardHelp v-if="showHelp" />
</template>
