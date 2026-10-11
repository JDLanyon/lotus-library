'use client';

import * as React from 'react';
import { Glitch, type GlitchHandle } from './glitch/Glitch';

export interface GlitchImageProps {
  /** Image source. If omitted, children (e.g. <img>) are used instead. */
  src?: string;
  alt?: string;
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
 * Wraps an image with the auto-looping glitch effect. Pass `src`/`alt` for the
 * common case, or use the children slot for custom markup (e.g. Next <Image>).
 */
export const GlitchImage = React.forwardRef<GlitchHandle, GlitchImageProps>(function GlitchImage(
  { src, alt = '', duration, delay, variance, intensity, className = '', children, scanlines },
  ref,
) {
  return (
    <Glitch
      ref={ref}
      duration={duration}
      delay={delay}
      variance={variance}
      glitchIntensity={intensity}
      preserveSpace={false}
      className={className}
      scanlines={scanlines}
    >
      {children ?? (src ? <img src={src} alt={alt} /> : null)}
    </Glitch>
  );
});

GlitchImage.displayName = 'GlitchImage';
export default GlitchImage;
