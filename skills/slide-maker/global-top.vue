<!--
  Standard global-top.vue for Slide Maker decks.
  Copy to your deck root or symlink from slide-maker/.

  Includes: mobile scroll view, progress bar, keyboard help, and QR code sharing.

  Laser pointer is provided natively by Slidev (>=52.15.0): in the slide view or
  presenter mode, open the navigation bar and set the cursor style to "Laser".
-->
<script setup lang="ts">
import { computed } from 'vue'
import { useNav } from '@slidev/client'
import { useMediaQuery } from '@vueuse/core'
import { showHelp } from './composables/useHelp'
import KeyboardHelp from './components/KeyboardHelp.vue'
import ProgressSegmentBar from './components/ProgressSegmentBar.vue'
import AudienceQRCode from './components/AudienceQRCode.vue'
import MobileScrollView from './components/MobileScrollView.vue'

const nav = useNav()
const isNarrow = useMediaQuery('(max-width: 639px) and (orientation: portrait)')
const isMobileScroll = computed(() => isNarrow.value && !nav.isPresenter?.value)
</script>

<template>
  <!-- Mobile scroll view replaces everything on portrait phones -->
  <MobileScrollView v-if="isMobileScroll" />

  <!-- Desktop / landscape: normal slide chrome -->
  <template v-if="!isMobileScroll">
    <ProgressSegmentBar />
    <KeyboardHelp v-if="showHelp" />
    <AudienceQRCode />
  </template>
</template>
