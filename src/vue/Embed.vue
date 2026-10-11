<!-- lotus-library — Embed.vue
  Responsive 16:9 YouTube embed. Mirrors the React <Embed>.
-->
<template>
  <div :class="['lotus-embed', className]">
    <iframe
      class="lotus-embed-frame"
      :src="src"
      title="YouTube video player"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerpolicy="strict-origin-when-cross-origin"
      allowfullscreen
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    uuid: string;
    /** Serve the privacy-preserving `youtube-nocookie.com` host. Default false. */
    nocookie?: boolean;
    /** Override the embed host (wins over `nocookie`). */
    host?: string;
    className?: string;
  }>(),
  { nocookie: false, host: undefined, className: '' },
);

const src = computed(() => {
  const embedHost = props.host ?? (props.nocookie ? 'www.youtube-nocookie.com' : 'www.youtube.com');
  return `https://${embedHost}/embed/${props.uuid}`;
});
</script>
