'use client';

export function MotionBlurEffect({ intensity }: { intensity: number }) {
  if (intensity === 0) return null;
  return (
    <span
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 4,
        pointerEvents: 'none',
        backdropFilter: `blur(${1.5 * intensity}px)`,
        opacity: intensity,
      }}
    />
  );
}
