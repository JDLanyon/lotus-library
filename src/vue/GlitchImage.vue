<!-- lotus-library — GlitchImage.vue
  Wraps an image with the auto-looping glitch effect. Vue counterpart of the
  React <GlitchImage>. Pass `src`/`alt`, or use the slot for custom markup.
-->
<template>
  <Glitch
    ref="glitchRef"
    :duration="duration"
    :delay="delay"
    :variance="variance"
    :glitch-intensity="intensity"
    :preserve-space="false"
    :class-name="className"
    @glitch-complete="emit('glitchComplete')"
  >
    <slot>
      <img v-if="src" :src="src" :alt="alt" />
    </slot>
  </Glitch>
</template>

<script setup lang="ts">
import { useTemplateRef } from 'vue';
import Glitch from './glitch/Glitch.vue';

withDefaults(
  defineProps<{
    /** Image source. If omitted, children (e.g. <img>) are used instead. */
    src?: string;
    alt?: string;
    duration?: number;
    delay?: number;
    variance?: number;
    intensity?: number;
    className?: string;
  }>(),
  {
    src: undefined,
    alt: '',
    duration: undefined,
    delay: undefined,
    variance: undefined,
    intensity: undefined,
    className: '',
  },
);

const emit = defineEmits<{ (e: 'glitchComplete'): void }>();

const glitchRef = useTemplateRef<InstanceType<typeof Glitch>>('glitchRef');
defineExpose({ glitch: () => glitchRef.value?.glitch() });
</script>
