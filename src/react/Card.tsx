'use client';

import * as React from 'react';
import type { CardProps } from '../core/types';
import { resolveThumbnail } from '../core/utils';
import { useAdapter } from './adapter';

export interface CardComponentProps extends CardProps {
  onClick?: React.MouseEventHandler;
  children?: React.ReactNode;
  /**
   * Render-prop for the media area (React equivalent of Vue's `#media` slot).
   * Wins over `thumbnail`. Use to supply <img>/<video>/Next <Image>.
   */
  renderMedia?: () => React.ReactNode;
}

/**
 * Dated, tagged entry card — the library's mid-size content surface
 * (thumbnail + title + description + tags). Use for blog lists and project
 * mosaics. Pass `href` to make the whole card a link (routed via
 * `linkComponent`, e.g. Next's <Link>; native <a> otherwise). Styling lives in
 * `.lotus-card*` (core components.css). Thumbnail URL rules are shared with
 * Panel via `resolveThumbnail`.
 */
export function Card({
  title,
  date,
  description,
  tags,
  hashTags = false,
  tabIndex = 0,
  role,
  ariaLabel,
  className = '',
  size = 'auto',
  fill = false,
  href,
  linkComponent: LinkComponent,
  slug,
  thumbnail,
  thumbnailPath,
  thumbnailDefaultsId = false,
  defaultThumbnail = 'thumbnail.png',
  thumbnailAlt,
  adapterImage = true,


  aspect,
  onClick,
  renderMedia,
  children,
}: CardComponentProps) {
  const { Image: AdapterImage } = useAdapter();
  // The adapter exposes renderers as opaque `unknown` (see ElementRenderer).
  const Image = AdapterImage as React.ElementType | undefined;

  const computedTags =
    tags && tags.length > 0 ? (hashTags ? tags.map((t) => `#${t}`) : tags) : [];

  const src = resolveThumbnail(
    thumbnail,
    thumbnailPath,
    // Prefer an explicit slug; fall back to the title for id-based media paths.
    slug ?? title,
    thumbnailDefaultsId,
    defaultThumbnail,
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.(e as unknown as React.MouseEvent);
    }
  };

  const classes = [
    'lotus-card',
    size !== 'auto' ? `lotus-card--${size}` : '',
    fill ? 'lotus-card--fill' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const mediaStyle = aspect ? { aspectRatio: aspect } : undefined;

  let media: React.ReactNode = null;
  if (renderMedia) {
    media = (
      <div className="lotus-card-media" style={mediaStyle}>
        {renderMedia()}
      </div>
    );
  } else if (src) {
    media = (
      <div className="lotus-card-media" style={mediaStyle}>
        {adapterImage && Image ? (
          <Image src={src} alt={thumbnailAlt ?? title} width={1000} height={1000} className="lotus-card-media-img" />
        ) : (
          <img className="lotus-card-media-img" src={src} alt={thumbnailAlt ?? title} loading="lazy" />
        )}
      </div>
    );
  }

  const inner = (
    <>
      {media}
      <div className="lotus-card-head">
        <h3 className="lotus-card-title">{title}</h3>
        {date && <time className="lotus-card-date">{date}</time>}
      </div>

      {description && <p className="lotus-card-desc">{description}</p>}

      {computedTags.length > 0 && (
        <div className="lotus-card-tags">
          {computedTags.map((tag) => (
            <span key={tag} className="lotus-card-tag">
              {tag}
            </span>
          ))}
        </div>
      )}

      {children && <div className="lotus-card-body">{children}</div>}
    </>
  );

  const shared = {
    className: classes,
    tabIndex,
    role,
    'aria-label': ariaLabel,
    onClick,
    onKeyDown: handleKeyDown,
  };

  if (href) {
    const Tag = (LinkComponent ?? 'a') as React.ElementType;
    return (
      <Tag href={href} {...shared}>
        {inner}
      </Tag>
    );
  }

  return <div {...shared}>{inner}</div>;
}

export default Card;
