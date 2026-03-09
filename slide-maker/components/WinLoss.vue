<script setup>
const props = defineProps({
  data: { type: Array, required: true },
  barWidth: { type: Number, default: 4 },
  barHeight: { type: Number, default: 12 },
})
</script>

<template>
  <svg
    class="win-loss"
    :width="data.length * (barWidth + 2)"
    :height="barHeight * 2 + 2"
    :viewBox="'0 0 ' + data.length * (barWidth + 2) + ' ' + (barHeight * 2 + 2)"
  >
    <g v-for="(val, i) in data" :key="i">
      <rect
        v-if="val > 0"
        :x="i * (barWidth + 2)"
        :y="1"
        :width="barWidth"
        :height="barHeight"
        fill="currentColor"
        opacity="0.7"
        rx="0.5"
      />
      <rect
        v-else-if="val < 0"
        :x="i * (barWidth + 2)"
        :y="barHeight + 1"
        :width="barWidth"
        :height="barHeight"
        fill="currentColor"
        opacity="0.35"
        rx="0.5"
      />
      <rect
        v-else
        :x="i * (barWidth + 2)"
        :y="barHeight"
        :width="barWidth"
        height="2"
        fill="currentColor"
        opacity="0.2"
      />
    </g>
    <line
      x1="0" :y1="barHeight + 1"
      :x2="data.length * (barWidth + 2)" :y2="barHeight + 1"
      stroke="currentColor"
      stroke-opacity="0.15"
      stroke-width="0.5"
    />
  </svg>
</template>

<style scoped>
.win-loss {
  display: inline-block;
  vertical-align: middle;
  margin: 0 0.25em;
}
</style>
