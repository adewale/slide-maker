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
