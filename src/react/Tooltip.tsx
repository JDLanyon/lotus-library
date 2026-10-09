'use client';

import * as React from 'react';
import type { TooltipProps } from '../core/types';

/**
 * Hover tooltip. Wraps arbitrary content and reveals `text` on hover/focus.
 * Styling lives in `.lotus-tooltip*` (core components.css) so the React and
 * Vue bindings render identically.
 */
export function Tooltip({
  text,
  className = '',
  children,
}: TooltipProps & { children: React.ReactNode }) {
  return (
    <span className={`lotus-tooltip ${className}`.trim()}>
      {children}
      <span role="tooltip" className="lotus-tooltip-text">
        {text}
      </span>
    </span>
  );
}

export default Tooltip;
