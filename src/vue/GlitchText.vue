<!-- lotus-library — GlitchText.vue
  Convenience wrapper around <Glitch> for glitching text. Vue counterpart of the
  React <GlitchText>. Pass `text`/children, or `names` for the name-cycler mode.
-->
<template>
  <Glitch
    ref="glitchRef"
    :names="names ? nameList : undefined"
    :duration="duration"
    :delay="delay"
    :variance="variance"
    :glitch-intensity="intensity"
    :class-name="className"
    :scanlines="scanlines"
    @glitch-complete="emit('glitchComplete')"
  >
    <slot>{{ text }}</slot>
  </Glitch>
</template>

<script setup lang="ts">
import { computed, useTemplateRef } from 'vue';
import Glitch from './glitch/Glitch.vue';

const props = withDefaults(
  defineProps<{
    /** Text content (used when no children are supplied). */
    text?: string;
    /** Rotating names — enables the name-cycler mode. */
    names?: string[];
    duration?: number;
    delay?: number;
    variance?: number;
    intensity?: number;
    className?: string;
    /** Scanline overlay (deprecated, off by default). See Glitch. */
    scanlines?: boolean;
  }>(),
  {
    text: '',
    names: undefined,
    duration: undefined,
    delay: undefined,
    variance: undefined,
    intensity: undefined,
    className: '',
    scanlines: false,
  },
);

const emit = defineEmits<{ (e: 'glitchComplete'): void }>();

const nameList = computed(() =>
  props.names ?? (props.text ? [props.text] : undefined),
);

const glitchRef = useTemplateRef<InstanceType<typeof Glitch>>('glitchRef');
defineExpose({ glitch: () => glitchRef.value?.glitch() });
</script>
