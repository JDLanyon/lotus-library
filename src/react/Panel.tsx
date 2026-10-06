import * as React from 'react';
import type { PanelData } from '../core/types';
import { Tags } from './Tags';

export interface PanelProps extends PanelData {
  /** Base path prepended to the link when `href` is not set. */
  basePath?: string;
  /** Override the anchor component (e.g. Next's <Link>). */
  linkComponent?: React.ElementType;
  className?: string;
}

function resolveThumbnail(
  thumbnail: string | undefined,
  thumbnailPath: string | undefined,
): string | undefined {
  if (!thumbnail) return undefined;
  // Absolute URLs and root-relative paths pass through untouched.
  if (/^(https?:)?\/\//.test(thumbnail) || thumbnail.startsWith('/')) {
    return thumbnail;
  }
  if (!thumbnailPath) return thumbnail;
  return `${thumbnailPath.replace(/\/$/, '')}/${thumbnail}`;
}

/**
 * A single image-featured panel. Renders an <a> (or the supplied
 * `linkComponent`) wrapping a cover image, title, description and tags.
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
}: PanelProps) {
  const label = title ?? id;
  const target = href ?? (basePath ? `${basePath.replace(/\/$/, '')}/${id}` : undefined);
  const src = resolveThumbnail(thumbnail, thumbnailPath);

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
