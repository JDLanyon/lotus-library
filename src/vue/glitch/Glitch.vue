<!-- lotus-library — Glitch.vue
  Global glitch effect with chromatic aberration, shake, displacement, motion
  blur, scanlines and flicker. Mirrors the React <Glitch>. Constants and timing
  are shared via core so both builds look identical.

  When `names` is provided, cycles through them (with optional permanent switch);
  otherwise renders the default slot.
-->
<template>
  <span>
    <!-- Hidden measuring element -->
    <span ref="measureRef" aria-hidden="true" style="position: absolute; opacity: 0; pointer-events: none">
      {{ names?.[0] }}
    </span>

    <!-- Position displacement wrapper -->
    <span ref="displaceRef" style="display: inline-block; will-change: transform">
      <span
        :class="['lotus-glitch-root', props.className]"
        :style="{
          ...mainStyle,
          filter: isInverted ? 'invert(1)' : 'none',
          transition: isInverted ? 'filter 0.02s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
          willChange: 'transform, filter, opacity',
        }"
      >
        <!-- Shake layer -->
        <span ref="shakeRef" style="display: inline-block">
          <span class="lotus-glitch-base">
            <slot>{{ mainContent }}</slot>
          </span>
        </span>

        <!-- Chromatic aberration layers -->
        <span
          v-for="(layer, i) in chromaLayers"
          :key="i"
          :class="['lotus-glitch-chroma-layer', layer.blendClass]"
          :style="layer.style"
          aria-hidden="true"
          role="presentation"
        >
          <slot>{{ chromaContent }}</slot>
        </span>

        <!-- Motion blur -->
        <span
          v-if="intensity > 0"
          class="lotus-glitch-motion-blur"
          :style="{ zIndex: 4, backdropFilter: `blur(${1.5 * intensity}px)`, opacity: intensity }"
          aria-hidden="true"
        />

        <!-- Flicker -->
        <span
          v-if="phase === 'active' && showFlicker"
          class="lotus-glitch-flicker"
          :style="{ zIndex: 30, opacity: 0.1, animation: 'glitch-noise 0.05s linear', mixBlendMode: 'overlay' }"
          aria-hidden="true"
        />
      </span>
    </span>
  </span>
</template>

<script setup lang="ts">
import { computed, onUnmounted, ref, watch, useTemplateRef } from 'vue';
import {
  GLITCH_CHROMA_COLORS,
  GLITCH_FLICKER_PROBABILITY,
  GLITCH_SHAKE_STEPS,
} from '../../core/glitch';
import { useGlitchState } from './useGlitchState';
import { useNameCycler } from './useNameCycler';

const props = withDefaults(
  defineProps<{
    names?: string[];
    duration?: number;
    delay?: number;
    variance?: number;
    glitchCountForFlash?: number;
    glitchIntensity?: number;
    className?: string;
    nameSwitchProbability?: number;
    preserveSpace?: boolean;
  }>(),
  {
    names: undefined,
    duration: 200,
    delay: 8000,
    variance: 500,
    glitchCountForFlash: 5,
    glitchIntensity: 1,
    className: '',
    nameSwitchProbability: 0.1,
    preserveSpace: true,
  },
);

const emit = defineEmits<{ (e: 'glitchComplete'): void }>();

const isNameMode = computed(() => !!props.names && props.names.length > 0);
const nameCycler = isNameMode.value
  ? useNameCycler(props.names!, props.nameSwitchProbability)
  : null;

const { phase, intensity, isInverted, displacement, glitchDuration, triggerGlitch } =
  useGlitchState({
    duration: props.duration,
    delay: props.delay,
    variance: props.variance,
    glitchCountForFlash: props.glitchCountForFlash,
    glitchIntensity: props.glitchIntensity,
  });

defineExpose({ glitch: triggerGlitch });

// ---- Width preservation (avoid layout shift between names) ----------------
const measureRef = useTemplateRef<HTMLElement>('measureRef');
const maxNameWidth = ref<number | null>(null);

watch(
  [() => props.preserveSpace, () => props.names, measureRef],
  () => {
    if (!props.preserveSpace || !props.names || props.names.length === 0) return;
    const anchor = measureRef.value;
    if (!anchor || typeof window === 'undefined') return;

    const measure = document.createElement('span');
    measure.style.position = 'absolute';
    measure.style.visibility = 'hidden';
    measure.style.whiteSpace = 'nowrap';
    const computed = window.getComputedStyle(anchor);
    measure.style.font = computed.font;
    measure.style.fontSize = computed.fontSize;
    measure.style.fontFamily = computed.fontFamily;
    measure.style.fontWeight = computed.fontWeight;
    measure.style.letterSpacing = computed.letterSpacing;
    document.body.appendChild(measure);

    let max = 0;
    for (const name of props.names) {
      measure.textContent = name;
      max = Math.max(max, measure.getBoundingClientRect().width);
    }
    document.body.removeChild(measure);
    maxNameWidth.value = max;
  },
  { immediate: true },
);

// ---- Name cycling ---------------------------------------------------------
watch(phase, (p) => {
  if (!nameCycler) return;
  if (p !== 'idle') nameCycler.startGlitch();
  else nameCycler.endGlitch();
});

watch(phase, (p) => {
  if (p === 'idle') emit('glitchComplete');
});

// ---- rAF shake ------------------------------------------------------------
const shakeRef = useTemplateRef<HTMLElement>('shakeRef');
let shakeFrame: number | null = null;
let shakeStart: number | null = null;
const MAX_SHAKE_OFFSET = 6;

function stopShake() {
  if (shakeFrame) cancelAnimationFrame(shakeFrame);
  if (shakeRef.value) shakeRef.value.style.transform = '';
  shakeStart = null;
}

watch([phase, intensity], () => {
  if (phase.value === 'idle' || intensity.value === 0) {
    stopShake();
    return;
  }
  shakeStart = null;
  const animate = (time: number) => {
    if (!shakeRef.value) return;
    if (shakeStart === null) shakeStart = time;
    const progress = Math.min((time - shakeStart) / glitchDuration, 1);
    const stepIndex = Math.floor(progress * GLITCH_SHAKE_STEPS.length);
    const x = (Math.random() > 0.5 ? -1 : 1) * MAX_SHAKE_OFFSET * intensity.value;
    const y = (Math.random() > 0.5 ? -1 : 1) * MAX_SHAKE_OFFSET * intensity.value;
    shakeRef.value.style.transform = `translate(${x}px, ${y}px)`;
    if (progress < 1) shakeFrame = requestAnimationFrame(animate);
    else {
      shakeRef.value.style.transform = '';
      shakeStart = null;
    }
  };
  shakeFrame = requestAnimationFrame(animate);
});

// ---- rAF position displacement -------------------------------------------
const displaceRef = useTemplateRef<HTMLElement>('displaceRef');
let displaceFrame: number | null = null;
let displaceStart: number | null = null;

function stopDisplacement() {
  if (displaceFrame) cancelAnimationFrame(displaceFrame);
  if (displaceRef.value) displaceRef.value.style.transform = '';
  displaceStart = null;
}

watch([phase, intensity], () => {
  if (phase.value === 'idle' || intensity.value === 0) {
    stopDisplacement();
    return;
  }
  displaceStart = null;
  const animate = (time: number) => {
    if (!displaceRef.value) return;
    if (displaceStart === null) displaceStart = time;
    const progress = Math.min((time - displaceStart) / glitchDuration, 1);
    const phaseMultiplier = phase.value === 'active' ? 1 : 0.4;
    const maxShift = intensity.value * phaseMultiplier;
    const x = (Math.random() - 0.5) * maxShift * 2;
    const y = (Math.random() - 0.5) * maxShift;
    displaceRef.value.style.transform = `translate(${x}px, ${y}px)`;
    if (progress < 1) displaceFrame = requestAnimationFrame(animate);
    else {
      displaceRef.value.style.transform = '';
      displaceStart = null;
    }
  };
  displaceFrame = requestAnimationFrame(animate);
});

// ---- Flicker decision (once per glitch) -----------------------------------
const showFlicker = ref(false);
watch(phase, (p) => {
  if (p === 'active') {
    showFlicker.value = Math.random() <= GLITCH_FLICKER_PROBABILITY;
  }
});

// ---- Chroma layers --------------------------------------------------------
const chromaLayers = computed(() => {
  if (intensity.value === 0) return [];
  return GLITCH_CHROMA_COLORS.map((color, i) => {
    const xJitter = (Math.random() - 0.5) * 4;
    const yJitter = (Math.random() - 0.5) * 4;
    const glowJitter = Math.random() * 3;
    const displaceX =
      displacement.value > 0 ? Math.random() * displacement.value * 0.8 * (i % 2 ? 1 : -1) : 0;
    const displaceY =
      displacement.value > 0 ? Math.random() * displacement.value * 0.5 * (i % 3 ? 1 : -1) : 0;
    const clipX = (displacement.value * (i % 2) + xJitter * 5) % 30;
    const clipY = (displacement.value * (i % 3) + yJitter * 5) % 30;
    const glowSize = 6 * intensity.value + glowJitter;
    const translateX = (color.x * intensity.value + xJitter + displaceX) * (i % 2 ? -1 : 1);
    const translateY = (color.y * intensity.value + yJitter + displaceY) * (i % 3 ? -1 : 1);

    return {
      blendClass: color.blend === 'difference' ? 'mix-blend-difference' : 'mix-blend-screen',
      style: {
        zIndex: 2,
        color: color.value,
        opacity: intensity.value,
        transform: `translate(${translateX}px, ${translateY}px)`,
        filter: `blur(0.5px) drop-shadow(0 0 ${glowSize}px ${color.value})`,
        clipPath: displacement.value > 0 ? `inset(${clipX}% ${clipY}% 0 0)` : 'none',
        transition: `transform ${glitchDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
        willChange: 'transform',
      },
    };
  });
});

onUnmounted(() => {
  stopShake();
  stopDisplacement();
});

const mainContent = computed(() =>
  nameCycler
    ? nameCycler.showAlt.value
      ? nameCycler.altName()
      : nameCycler.currentName()
    : null,
);

const chromaContent = computed(() => {
  if (nameCycler && props.names) {
    const idx = nameCycler.showAlt.value
      ? (props.names.indexOf(nameCycler.altName()) + 1) % props.names.length
      : props.names.indexOf(nameCycler.currentName());
    return props.names[idx] ?? mainContent.value;
  }
  return mainContent.value;
});

const mainStyle = computed(() => ({
  display: 'inline-block',
  minWidth:
    props.preserveSpace && maxNameWidth.value !== null
      ? `${maxNameWidth.value}px`
      : undefined,
}));
</script>
