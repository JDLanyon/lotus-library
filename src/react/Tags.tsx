import * as React from 'react';

export interface TagsProps {
  tags?: string[];
  className?: string;
}

/** Simple row of uppercase tag pills. */
export function Tags({ tags, className = '' }: TagsProps) {
  if (!tags || tags.length === 0) return null;
  return (
    <div className={`lotus-tags ${className}`.trim()}>
      {tags.map((tag) => (
        <span key={tag} className="lotus-tag">
          {tag}
        </span>
      ))}
    </div>
  );
}

export default Tags;
