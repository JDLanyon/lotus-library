'use client';

import * as React from 'react';

interface ScanlineEffectProps {
  intensity: number;
  duration: number;
}

export function ScanlineEffect({ intensity, duration }: ScanlineEffectProps) {
  if (intensity <= 0.7) return null;
  return (
    <span
      aria-hidden="true"
      className="lotus-animate-glitch-noise"
      style={
        {
          position: 'absolute',
          inset: 0,
          zIndex: 25,
          pointerEvents: 'none',
          background:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
          mixBlendMode: 'overlay',
          opacity: intensity * 0.3,
          animation: `glitch-noise ${duration}ms ease-in-out`,
          ['--noise-intensity' as string]: intensity,
        } as React.CSSProperties
      }
    />
  );
}
