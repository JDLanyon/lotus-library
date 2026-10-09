'use client';

import * as React from 'react';

export interface EmbedProps {
  /** YouTube video id (the `v=` value). */
  uuid: string;
  /** Extra class(es) appended to `.lotus-embed`. */
  className?: string;
}

/**
 * Responsive 16:9 YouTube embed. Styling lives in `.lotus-embed`
 * (core components.css).
 */
export function Embed({ uuid, className = '' }: EmbedProps) {
  return (
    <div className={`lotus-embed ${className}`.trim()}>
      <iframe
        className="lotus-embed-frame"
        src={`https://www.youtube.com/embed/${uuid}`}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </div>
  );
}

export default Embed;
