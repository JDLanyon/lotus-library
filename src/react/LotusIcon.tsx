'use client';

import * as React from 'react';
import type { ImageProps } from '../core/types';
import { useAdapter } from './adapter';

export interface LotusIconProps {
  /**
   * Path to the lotus mark. Defaults to the packaged asset
   * (`/lotus.png`); override to point at your own file.
   */
  src?: string;
  /**
   * Dark-ink twin of `src`, shown on light themes. When set, both images render
   * and CSS shows one per theme (`[data-theme='dark']`, `.lotus-dark`, `.dark`).
   */
  darkSrc?: string;
  /** Accessible label. Default "Lotus". */
  alt?: string;
  /** Extra class(es) appended to `.lotus-icon`. */
  className?: string;
  width?: number;
  height?: number;
  /** Inline style applied to the wrapper (e.g. a theme-dependent filter). */
  style?: React.CSSProperties;
}

/**
 * The lotus mark. Renders an <img> through the adapter (so a Next host gets
 * `next/image`) rather than inlining SVG paths — the artwork lives in a real
 * asset the consumer ships. Styling lives in `.lotus-icon` (core
 * components.css). With `darkSrc`, two images render and CSS shows one per
 * theme.
 */
export function LotusIcon({
  src = '/lotus.png',
  darkSrc,
  alt = 'Lotus',
  className = '',
  width = 64,
  height = 64,
  style,
}: LotusIconProps) {
  const { Image } = useAdapter();
  const ImageComponent = Image as React.ComponentType<ImageProps>;

  return (
    <span className={`lotus-icon ${className}`.trim()} style={style}>
      {darkSrc ? (
        // Label only one of the two so the mark is not announced twice.
        <ImageComponent
          src={darkSrc}
          alt={alt}
          width={width}
          height={height}
          className="lotus-footer-logo-dark"
        />
      ) : null}
      <ImageComponent
        src={src}
        alt={darkSrc ? '' : alt}
        width={width}
        height={height}
        className={darkSrc ? 'lotus-footer-logo-light' : undefined}
      />
    </span>
  );
}

export default LotusIcon;
