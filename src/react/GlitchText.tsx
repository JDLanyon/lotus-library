'use client';


import * as React from 'react';
import { Glitch, type GlitchHandle } from './glitch/Glitch';

export interface GlitchTextProps {
  /** Text content (used when no children are supplied). */
  text?: string;
  /** Rotating names — enables the name-cycler mode. */
  names?: string[];
  duration?: number;
  delay?: number;
  variance?: number;
  intensity?: number;
  className?: string;
  children?: React.ReactNode;
  /** Scanline overlay (deprecated, off by default). See <Glitch>. */
  scanlines?: boolean;
}

/**
 * Convenience wrapper around <Glitch> for rendering glitching text.
 */
export const GlitchText = React.forwardRef<GlitchHandle, GlitchTextProps>(function GlitchText(
  { text, names, duration, delay, variance, intensity, className = '', children, scanlines },
  ref,
) {
  const content = children ?? text;
  const nameList = names ?? (typeof content === 'string' ? [content] : undefined);

  return (
    <Glitch
      ref={ref}
      names={names ? nameList : undefined}
      duration={duration}
      delay={delay}
      variance={variance}
      glitchIntensity={intensity}
      className={className}
      scanlines={scanlines}
    >
      {content}
    </Glitch>
  );
});

GlitchText.displayName = 'GlitchText';
export default GlitchText;
