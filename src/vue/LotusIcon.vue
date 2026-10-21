<!-- lotus-library — LotusIcon.vue
  The lotus mark. Renders an <img> through the adapter (so a host may swap in a
  framework image component) rather than inlining SVG paths — the artwork lives
  in a real `.svg` asset the consumer ships.
-->
<template>
  <span :class="['lotus-icon', className]" :style="style">
    <!-- With `darkSrc` both images render and CSS shows one per theme. Only the
         first carries the label so the mark is not announced twice. -->
    <component
      v-if="darkSrc"
      :is="Image"
      :src="darkSrc"
      :alt="alt"
      :width="width"
      :height="height"
      class="lotus-footer-logo-dark"
    />
    <component
      :is="Image"
      :src="src"
      :alt="darkSrc ? '' : alt"
      :width="width"
      :height="height"
      :class="darkSrc ? 'lotus-footer-logo-light' : undefined"
    />
  </span>
</template>

<script setup lang="ts">
import { useAdapter } from './adapter';

withDefaults(
  defineProps<{
    src?: string;
    /** Dark-ink twin of `src`, shown on light themes (CSS picks per theme). */
    darkSrc?: string;
    alt?: string;
    className?: string;
    width?: number;
    height?: number;
    /** Inline style applied to the wrapper (e.g. a theme-dependent filter). */
    style?: Record<string, string | number>;
  }>(),
  {
    src: '/lotus.png',
    alt: 'Lotus',
    className: '',
    width: 64,
    height: 64,
  },
);

const { Image } = useAdapter();
</script>
