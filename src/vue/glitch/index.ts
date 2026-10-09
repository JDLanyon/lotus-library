/**
 * lotus-library — Vue glitch barrel.
 *
 * Exposes the ported global `Glitch` component (with the full chromatic
 * aberration / shake / displacement effect) plus its composables, so the Vue
 * build reaches parity with the React <Glitch>.
 */
export { default as Glitch } from './Glitch.vue';
export { useGlitchState, type UseGlitchStateOptions } from './useGlitchState';
export { useNameCycler } from './useNameCycler';
