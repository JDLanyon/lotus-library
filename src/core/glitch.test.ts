import { describe, expect, it } from 'vitest';
import {
  GLITCH_CHROMA_COLORS,
  GLITCH_FLICKER_PROBABILITY,
  GLITCH_SHAKE_STEPS,
  computeGlitchTimeline,
  isGlitchIdle,
} from './glitch';

describe('computeGlitchTimeline', () => {
  it('splits the duration 20% / 60% / 20%', () => {
    expect(computeGlitchTimeline(200)).toEqual({
      easeInMs: 40,
      activeMs: 120,
      easeOutMs: 40,
    });
  });

  it('conserves total duration', () => {
    const { easeInMs, activeMs, easeOutMs } = computeGlitchTimeline(150);
    expect(easeInMs + activeMs + easeOutMs).toBeCloseTo(150);
  });

  it('handles a zero duration', () => {
    expect(computeGlitchTimeline(0)).toEqual({
      easeInMs: 0,
      activeMs: 0,
      easeOutMs: 0,
    });
  });
});

describe('isGlitchIdle', () => {
  it('is true only for the idle phase', () => {
    expect(isGlitchIdle('idle')).toBe(true);
    expect(isGlitchIdle('easeIn')).toBe(false);
    expect(isGlitchIdle('active')).toBe(false);
    expect(isGlitchIdle('easeOut')).toBe(false);
  });
});

describe('glitch constants', () => {
  it('defines six chroma layers', () => {
    expect(GLITCH_CHROMA_COLORS).toHaveLength(6);
  });

  it('uses only screen/difference blend modes', () => {
    for (const c of GLITCH_CHROMA_COLORS) {
      expect(['screen', 'difference']).toContain(c.blend);
    }
  });

  it('has a sorted, monotonically increasing shake ramp within (0, 1]', () => {
    for (let i = 1; i < GLITCH_SHAKE_STEPS.length; i++) {
      expect(GLITCH_SHAKE_STEPS[i]).toBeGreaterThan(GLITCH_SHAKE_STEPS[i - 1]);
    }
    expect(Math.min(...GLITCH_SHAKE_STEPS)).toBeGreaterThan(0);
    expect(Math.max(...GLITCH_SHAKE_STEPS)).toBeLessThanOrEqual(1);
  });

  it('exposes a strictly-probability flicker constant', () => {
    expect(GLITCH_FLICKER_PROBABILITY).toBeGreaterThan(0);
    expect(GLITCH_FLICKER_PROBABILITY).toBeLessThanOrEqual(1);
  });
});
