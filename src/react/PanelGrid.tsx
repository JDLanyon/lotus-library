import * as React from 'react';
import type { PanelData, PanelGroup } from '../core/types';
import { Panel } from './Panel';

export interface PanelGridProps extends Omit<PanelGroup, 'panels'> {
  panels?: PanelData[];
  /** Raw list alias so both `panels` and `data` work. */
  data?: PanelData[];
  /** Shared base path for links. */
  basePath?: string;
  linkComponent?: React.ElementType;
  className?: string;
}

/**
 * Minified flex-wrap grid of <Panel>s. Replaces the verbose hand-rolled
 * grid markup previously duplicated across sites.
 */
export function PanelGrid({
  id,
  heading,
  panels,
  data,
  basePath,
  thumbnailPath,
  linkComponent,
  className = '',
}: PanelGridProps) {
  const items = panels ?? data ?? [];
  if (items.length === 0) return null;

  return (
    <section id={id}>
      {heading ? <h2>{heading}</h2> : null}
      <div className={`lotus-panel-grid ${className}`.trim()}>
        {items.map((panel) => (
          <Panel
            key={panel.id}
            {...panel}
            basePath={basePath ?? panel.thumbnailPath}
            thumbnailPath={thumbnailPath ?? panel.thumbnailPath}
            href={panel.href}
            linkComponent={linkComponent}
          />
        ))}
      </div>
    </section>
  );
}

export default PanelGrid;
