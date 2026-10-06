'use client';

interface NoiseEffectProps {
  intensity: number;
  duration: number;
}

export function NoiseEffect({ intensity }: NoiseEffectProps) {
  if (intensity === 0) return null;

  return (
    <span
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 5,
        pointerEvents: 'none',
        opacity: intensity * 0.15,
        backgroundImage: `
          radial-gradient(circle at 30% 40%, rgba(255,255,255,0.1) 0%, transparent 40%),
          radial-gradient(circle at 70% 60%, rgba(0,0,0,0.1) 0%, transparent 40%),
          repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(255,255,255,0.02) 4px, rgba(255,255,255,0.02) 8px)
        `,
        backgroundSize: '100% 100%, 100% 100%, 8px 8px',
        mixBlendMode: 'overlay',
      }}
    />
  );
}
