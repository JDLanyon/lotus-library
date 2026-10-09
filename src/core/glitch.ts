import type { ChromaColor, GlitchPhase } from './types';

/**
 * Frozen glitch constants, shared by both framework builds.
 *
 * These values are load-bearing: the glitch effect is highly sensitive to
 * changes in offsets, blend modes and timings. Do NOT tweak them to "tidy up"
 * — any change alters the visual result and breaks React/Vue parity.
 */

export const GLITCH_CHROMA_COLORS: ChromaColor[] = [
  { name: 'red', value: '#f00', x: 2, y: 0, blend: 'screen' },
  { name: 'green', value: '#0f0', x: -2, y: 2, blend: 'screen' },
  { name: 'blue', value: '#00f', x: 0, y: -2, blend: 'screen' },
  { name: 'cyan', value: '#0ff', x: 2, y: -2, blend: 'difference' },
  { name: 'magenta', value: '#f0f', x: -2, y: 0, blend: 'difference' },
  { name: 'yellow', value: '#ff0', x: 0, y: 2, blend: 'difference' },
];

/** Normalised shake magnitudes per animation step. */
export const GLITCH_SHAKE_STEPS = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9];

/** The phase progression of a single glitch, computed from its duration. */
export interface GlitchTimeline {
  easeInMs: number;
  activeMs: number;
  easeOutMs: number;
}

export function computeGlitchTimeline(duration: number): GlitchTimeline {
  return {
    easeInMs: duration * 0.2,
    activeMs: duration * 0.6,
    easeOutMs: duration * 0.2,
  };
}

/** Whether a glitch should end (phase has returned to idle). */
export function isGlitchIdle(phase: GlitchPhase): boolean {
  return phase === 'idle';
}

/** Probability a given glitch flashes the whole element white. */
export const GLITCH_FLICKER_PROBABILITY = 0.1;
