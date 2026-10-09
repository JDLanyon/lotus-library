'use client';

import * as React from 'react';
import type { CardProps } from '../core/types';

export interface CardComponentProps extends CardProps {
  onClick?: React.MouseEventHandler;
  children?: React.ReactNode;
}

/**
 * Dated, tagged entry card. Keyboard-activatable when `onClick` is provided.
 * Styling lives in `.lotus-card*` (core components.css).
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
  onClick,
  children,
}: CardComponentProps) {
  const computedTags =
    tags && tags.length > 0 ? (hashTags ? tags.map((t) => `#${t}`) : tags) : [];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.(e as unknown as React.MouseEvent);
    }
  };

  return (
    <div
      className={`lotus-card ${className}`.trim()}
      tabIndex={tabIndex}
      role={role}
      aria-label={ariaLabel}
      onClick={onClick}
      onKeyDown={handleKeyDown}
    >
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
    </div>
  );
}

export default Card;
