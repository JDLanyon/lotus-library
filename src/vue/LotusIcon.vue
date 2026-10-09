<!-- lotus-library — LotusIcon.vue
  The lotus mark. Renders an <img> through the adapter (so a host may swap in a
  framework image component) rather than inlining SVG paths — the artwork lives
  in a real `.svg` asset the consumer ships.
-->
<template>
  <span :class="['lotus-icon', className]">
    <component :is="Image" :src="src" :alt="alt" :width="width" :height="height" />
  </span>
</template>

<script setup lang="ts">
import { useAdapter } from './adapter';

withDefaults(
  defineProps<{
    src?: string;
    alt?: string;
    className?: string;
    width?: number;
    height?: number;
  }>(),
  {
    src: '/lotus.svg',
    alt: 'Lotus',
    className: '',
    width: 64,
    height: 64,
  },
);

const { Image } = useAdapter();
</script>
