<script setup lang="ts">
import { showHelp } from './composables/useHelp'
import KeyboardHelp from './components/KeyboardHelp.vue'
import ProgressSegmentBar from './components/ProgressSegmentBar.vue'
</script>

<template>
  <ProgressSegmentBar />
  <KeyboardHelp v-if="showHelp" />
</template>
