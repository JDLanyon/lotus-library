<!-- lotus-library — Embed.vue
  Responsive 16:9 YouTube embed. Mirrors the React <Embed>.
-->
<template>
  <div :class="['lotus-embed', className]">
    <iframe
      class="lotus-embed-frame"
      :src="`https://www.youtube.com/embed/${uuid}`"
      title="YouTube video player"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerpolicy="strict-origin-when-cross-origin"
      allowfullscreen
    />
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    uuid: string;
    className?: string;
  }>(),
  { className: '' },
);
</script>
