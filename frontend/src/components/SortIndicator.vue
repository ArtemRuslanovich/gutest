<template>
  <span class="sort-indicator">
    <span v-if="current === field">
      {{ order === 'asc' ? '↑' : '↓' }}
    </span>
  </span>
</template>

<script>
export default {
  name: 'SortIndicator',
  props: {
    field: String,
    current: String,
    order: String
  }
}
</script>
<style lang="scss" scoped>
.sort-indicator {
  display: inline-block;
  margin-left: 0.5rem;
  font-size: 0.9em;
}
</style>