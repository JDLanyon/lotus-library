'use client';

import * as React from 'react';
import type { ProjectCardData } from '../core/types';
import { Card } from './Card';
import { ProjectModal, type ProjectModalProps } from './ProjectModal';

export interface CardGridProps {
  /** Cards to render. */
  items: ProjectCardData[];
  /** Layout preset forwarded to each Card. Default 'auto'. */
  size?: 'auto' | 'full' | 'compact';
  /** Equal-height grid cards. Default true. */
  fill?: boolean;
  /** Render each card's links via this element (e.g. Next's <Link>). */
  linkComponent?: string | object;
  /** Extra class(es) appended to `.lotus-card-grid`. **The host owns the grid CSS.** */
  className?: string;
  /**
   * Props forwarded to the single shared <ProjectModal> (e.g.
   * `projectBasePath`, `contentSelector`). `slug`/`repo` are supplied per card.
   */
  modalProps?: Omit<ProjectModalProps, 'open' | 'onClose' | 'slug' | 'repo'>;
}

/**
 * Convenience composition: maps `items` to `<Card>`s and owns ONE shared
 * `<ProjectModal>` (so hosts don't re-implement open/close state). Clicking a
 * card without a `url` opens the modal for its `slug`/`repo`; cards with a
 * `url` link out instead.
 *
 * LAYOUT IS THE HOST'S JOB. This renders a plain container with a default
 * responsive auto-fill grid (`className` overrides it). The library ships no
 * mosaic/span engine — arrange cards with your own CSS. See README "Layout".
 */
export function CardGrid({
  items,
  size = 'auto',
  fill = true,
  linkComponent,
  className = '',
  modalProps,
}: CardGridProps) {
  const [active, setActive] = React.useState<ProjectCardData | null>(null);

  return (
    <div className={`lotus-card-grid ${className}`.trim()}>
      {items.map((item) => (
        <Card
          key={item.slug}
          title={item.title}
          date={item.date}
          description={item.description}
          tags={item.tags}
          size={size}
          fill={fill}
          href={item.url}
          linkComponent={linkComponent}
          slug={item.slug}
          thumbnail={item.thumbnail}
          thumbnailPath={item.thumbnailPath}
          thumbnailDefaultsId={item.thumbnailDefaultsId}
          defaultThumbnail={item.defaultThumbnail}
          thumbnailAlt={item.thumbnailAlt}
          aspect={item.aspect}
          onClick={item.url ? undefined : () => setActive(item)}
        />
      ))}

      <ProjectModal
        {...modalProps}
        open={!!active}
        onClose={() => setActive(null)}
        slug={active?.slug ?? ''}
        repo={active?.repo}
      />
    </div>
  );
}

export default CardGrid;
