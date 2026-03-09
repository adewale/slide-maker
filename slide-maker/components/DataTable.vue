<script setup>
defineProps({
  headers: { type: Array, required: true },
  rows: { type: Array, required: true },
})
</script>

<template>
  <table class="data-table">
    <thead>
      <tr>
        <th v-for="header in headers" :key="header">{{ header }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(row, i) in rows" :key="i">
        <td v-for="(cell, j) in row" :key="j">{{ cell }}</td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
.data-table {
  border-collapse: collapse;
  width: 100%;
  font-family: var(--deck-font-body, sans-serif);
  font-size: 0.88rem;
}

.data-table th {
  text-align: left;
  border-bottom: 2px solid var(--deck-fg, #111);
  padding: 0.5rem 1.25rem 0.5rem 0;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.data-table td {
  border-bottom: 1px solid var(--deck-muted, rgba(17, 17, 17, 0.08));
  padding: 0.4rem 1.25rem 0.4rem 0;
  vertical-align: top;
}

.data-table tr:last-child td {
  border-bottom: none;
}
</style>
