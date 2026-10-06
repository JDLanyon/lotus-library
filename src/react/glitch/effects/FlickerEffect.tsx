'use client';

import type { GlitchPhase } from '../glitch_state';

interface FlickerEffectProps {
  phase: GlitchPhase;
  shouldFlicker: boolean;
}

export function FlickerEffect({ phase, shouldFlicker }: FlickerEffectProps) {
  if (phase !== 'active' || !shouldFlicker) return null;
  return (
    <span
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 30,
        pointerEvents: 'none',
        background: '#fff',
        opacity: 0.1,
        animation: 'glitch-noise 0.05s linear',
        mixBlendMode: 'overlay',
      }}
    />
  );
}
