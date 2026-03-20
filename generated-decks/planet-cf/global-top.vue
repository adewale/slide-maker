<script setup lang="ts">
import { showHelp } from './composables/useHelp'
import KeyboardHelp from './components/KeyboardHelp.vue'
</script>

<template>
  <KeyboardHelp v-if="showHelp" />
</template>
