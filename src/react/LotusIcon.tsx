'use client';

import * as React from 'react';
import type { ImageProps } from '../core/types';
import { useAdapter } from './adapter';

export interface LotusIconProps {
  /** Path to the lotus mark. Default `/lotus.svg` (ship one in your public dir). */
  src?: string;
  /** Accessible label. Default "Lotus". */
  alt?: string;
  /** Extra class(es) appended to `.lotus-icon`. */
  className?: string;
  width?: number;
  height?: number;
}

/**
 * The lotus mark. Renders an <img> through the adapter (so a Next host gets
 * `next/image`) rather than inlining SVG paths — the artwork lives in a real
 * `.svg` asset the consumer ships. A CSS glitch/scanline filter is layered on
 * top via `.lotus-icon` (core components.css).
 */
export function LotusIcon({
  src = '/lotus.svg',
  alt = 'Lotus',
  className = '',
  width = 64,
  height = 64,
}: LotusIconProps) {
  const { Image } = useAdapter();
  const ImageComponent = Image as React.ComponentType<ImageProps>;

  return (
    <span className={`lotus-icon ${className}`.trim()}>
      <ImageComponent src={src} alt={alt} width={width} height={height} />
    </span>
  );
}

export default LotusIcon;
