import { ref, onUnmounted, watch } from 'vue';
import type { GlitchPhase } from '../../core/types';
import { computeGlitchTimeline } from '../../core/glitch';

export interface UseGlitchStateOptions {
  duration?: number;
  delay?: number;
  variance?: number;
  glitchCountForFlash?: number;
  glitchIntensity?: number;
  enabled?: boolean;
}

const FLASH_DURATION = 24;
const FLASH_GAP = 12;
const NOISE_FRAMES = 4;
const DISPLACEMENT_INTENSITY = 8;

/**
 * Vue mirror of the React `useGlitchState` hook. The timing sequence and
 * constants are intentionally identical so both builds glitch the same way.
 */
export function useGlitchState({
  duration = 200,
  delay = 8000,
  variance = 500,
  glitchCountForFlash = 3,
  glitchIntensity = 1,
  enabled = true,
}: UseGlitchStateOptions = {}) {
  const phase = ref<GlitchPhase>('idle');
  const isInverted = ref(false);
  const glitchCount = ref(0);
  const displacement = ref(0);
  const intensity = ref(0);
  let timer: ReturnType<typeof setTimeout> | null = null;

  function clearTimers() {
    if (timer) clearTimeout(timer);
  }

  function triggerDoubleFlash() {
    isInverted.value = true;
    timer = setTimeout(() => {
      isInverted.value = false;
      timer = setTimeout(() => {
        isInverted.value = true;
        timer = setTimeout(() => {
          isInverted.value = false;
        }, FLASH_DURATION);
      }, FLASH_GAP);
    }, FLASH_DURATION);
  }

  function triggerGlitch() {
    if (phase.value !== 'idle') return;

    clearTimers();
    const base = (Math.floor(Math.random() * NOISE_FRAMES) + 1) * DISPLACEMENT_INTENSITY;
    const jitter = Math.floor(Math.random() * 10);
    displacement.value = base + jitter;
    phase.value = 'easeIn';
    intensity.value = glitchIntensity;

    const timeline = computeGlitchTimeline(duration);

    timer = setTimeout(() => {
      phase.value = 'active';
      intensity.value = 1 * glitchIntensity;
      glitchCount.value += 1;
      if (glitchCount.value % glitchCountForFlash === 0) triggerDoubleFlash();

      timer = setTimeout(() => {
        phase.value = 'easeOut';
        intensity.value = 0.3 * glitchIntensity;

        timer = setTimeout(() => {
          phase.value = 'idle';
          intensity.value = 0;
        }, timeline.easeOutMs);
      }, timeline.activeMs);
    }, timeline.easeInMs);
  }

  function scheduleNext() {
    if (!enabled) return;
    const min = Math.max(100, delay - variance);
    const max = delay + variance;
    const nextDelay = Math.random() * (max - min) + min;
    timer = setTimeout(() => {
      triggerGlitch();
      scheduleNext();
    }, nextDelay);
  }

  if (enabled) scheduleNext();

  watch(
    () => enabled,
    (on) => {
      if (on) scheduleNext();
      else clearTimers();
    },
  );

  onUnmounted(clearTimers);

  return {
    phase,
    intensity,
    isInverted,
    displacement,
    glitchDuration: duration,
    triggerGlitch,
  };
}
