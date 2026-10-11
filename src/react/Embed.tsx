'use client';

import * as React from 'react';

export interface EmbedProps {
  /** YouTube video id (the `v=` value). */
  uuid: string;
  /**
   * Serve the privacy-preserving `youtube-nocookie.com` host instead of
   * `youtube.com`. Default false (current behaviour).
   */
  nocookie?: boolean;
  /** Override the embed host (wins over `nocookie`), e.g. a custom domain. */
  host?: string;
  /** Extra class(es) appended to `.lotus-embed`. */
  className?: string;
}

/**
 * Responsive 16:9 YouTube embed. Styling lives in `.lotus-embed`
 * (core components.css). Pass `nocookie` (or a custom `host`) to avoid the
 * tracking host.
 */
export function Embed({ uuid, nocookie = false, host, className = '' }: EmbedProps) {
  const embedHost = host ?? (nocookie ? 'www.youtube-nocookie.com' : 'www.youtube.com');
  return (
    <div className={`lotus-embed ${className}`.trim()}>
      <iframe
        className="lotus-embed-frame"
        src={`https://${embedHost}/embed/${uuid}`}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </div>
  );
}

export default Embed;
