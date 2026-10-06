<!-- lotus-library — Tags.vue
  Row of uppercase tag pills. Mirrors the React <Tags> component.
-->
<template>
  <div v-if="tags && tags.length" class="lotus-tags">
    <span v-for="tag in tags" :key="tag" class="lotus-tag">{{ tag }}</span>
  </div>
</template>

<script setup lang="ts">
defineProps<{ tags?: string[] }>()
</script>
