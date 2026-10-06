'use client';

import * as React from 'react';

const CHROMA_COLORS = [
  { name: 'red', value: '#ff0000', x: 2, y: 0 },
  { name: 'green', value: '#00ff00', x: -2, y: 2 },
  { name: 'blue', value: '#0000ff', x: 0, y: -2 },
  { name: 'cyan', value: '#00ffff', x: 2, y: -2 },
  { name: 'magenta', value: '#ff00ff', x: -2, y: 0 },
  { name: 'yellow', value: '#ffff00', x: 0, y: 2 },
];

interface ChromaticAberrationEffectProps {
  intensity: number;
  displacement: number;
  duration: number;
  children: React.ReactNode;
  disableDisplacement?: boolean;
}

export function ChromaticAberrationEffect({
  intensity,
  displacement,
  duration,
  children,
  disableDisplacement = false,
}: ChromaticAberrationEffectProps) {
  const layerRandomness = React.useMemo(
    () =>
      CHROMA_COLORS.map(() => ({
        xJitter: (Math.random() - 0.5) * 4,
        yJitter: (Math.random() - 0.5) * 4,
        glowJitter: Math.random() * 3,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [intensity],
  );

  if (intensity === 0) return null;

  return (
    <span style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} aria-hidden="true">
      {CHROMA_COLORS.map((color, i) => {
        const rand = layerRandomness[i];

        const displaceX =
          !disableDisplacement && displacement > 0
            ? Math.random() * displacement * 0.8 * (i % 2 ? 1 : -1)
            : 0;
        const displaceY =
          !disableDisplacement && displacement > 0
            ? Math.random() * displacement * 0.5 * (i % 3 ? 1 : -1)
            : 0;

        const clipX = !disableDisplacement
          ? (displacement * (i % 2) + rand.xJitter * 5) % 30
          : 0;
        const clipY = !disableDisplacement
          ? (displacement * (i % 3) + rand.yJitter * 5) % 30
          : 0;

        const glowSize = 6 * intensity + rand.glowJitter;
        const translateX = (color.x * intensity + rand.xJitter + displaceX) * (i % 2 ? -1 : 1);
        const translateY = (color.y * intensity + rand.yJitter + displaceY) * (i % 3 ? -1 : 1);

        return (
          <span
            key={color.name}
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 2,
              mixBlendMode: i >= 3 ? 'difference' : 'screen',
              color: color.value,
              opacity: intensity,
              transform: `translate(${translateX}px, ${translateY}px)`,
              filter: `blur(0.5px) drop-shadow(0 0 ${glowSize}px ${color.value})`,
              clipPath:
                !disableDisplacement && displacement > 0
                  ? `inset(${clipX}% ${clipY}% 0 0)`
                  : undefined,
              transition: `transform ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
              willChange: 'transform',
            }}
          >
            {children}
          </span>
        );
      })}
    </span>
  );
}
