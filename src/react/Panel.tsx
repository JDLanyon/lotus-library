import * as React from 'react';
import type { PanelData } from '../core/types';
import { resolveThumbnail } from '../core/utils';
import { Tags } from './Tags';

export interface PanelProps extends PanelData {
  /** Base path prepended to the link when `href` is not set. */
  basePath?: string;
  /** Override the anchor component (e.g. Next's <Link>). */
  linkComponent?: React.ElementType;
  className?: string;
  thumbnailDefaultsId?: boolean;
  defaultThumbnail?: string;
}

/**
 * A single image-featured panel. Renders an <a> (or the supplied
 * `linkComponent`) wrapping a cover image, title, description and tags.
 * Thumbnail URL rules are shared with Card via `resolveThumbnail` (core).
 */
export function Panel({
  id,
  title,
  description,
  thumbnail,
  thumbnailPath,
  href,
  tags,
  basePath,
  linkComponent: LinkComponent = 'a',
  className = '',
  thumbnailDefaultsId = false,
  defaultThumbnail = 'thumbnail.png',
}: PanelProps) {
  const label = title ?? id;
  const target = href ?? (basePath ? `${basePath.replace(/\/$/, '')}/${id}` : undefined);
  const src = resolveThumbnail(
    thumbnail,
    thumbnailPath,
    id,
    thumbnailDefaultsId,
    defaultThumbnail,
  );

  return (
    <LinkComponent
      href={target}
      className={`lotus-panel ${className}`.trim()}
      aria-label={label}
    >
      {src ? (
        <img className="lotus-panel-media" src={src} alt={label} loading="lazy" />
      ) : null}
      <h3 className="lotus-panel-title">{label}</h3>
      {description ? <p className="lotus-panel-desc">{description}</p> : null}
      <Tags tags={tags} />
    </LinkComponent>
  );
}

export default Panel;

