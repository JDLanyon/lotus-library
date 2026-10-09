<!-- lotus-library — Tooltip.vue
  Hover tooltip. Wraps arbitrary content and reveals `text` on hover/focus.
  Mirrors the React <Tooltip>; styling lives in core components.css.
-->
<template>
  <span :class="['lotus-tooltip', className]">
    <slot />
    <span role="tooltip" class="lotus-tooltip-text">{{ text }}</span>
  </span>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    text: string;
    className?: string;
  }>(),
  { className: '' },
);
</script>
