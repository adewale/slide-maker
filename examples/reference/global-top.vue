<script setup lang="ts">
import { showHelp } from './composables/useHelp'
import KeyboardHelp from './components/KeyboardHelp.vue'
import ProgressSegmentBar from './components/ProgressSegmentBar.vue'
import AudienceQRCode from './components/AudienceQRCode.vue'
</script>

<template>
  <ProgressSegmentBar />
  <KeyboardHelp v-if="showHelp" />

  <!-- QR code sharing overlay -->
  <AudienceQRCode />
</template>
