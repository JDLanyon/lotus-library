'use client';

import * as React from 'react';
import type { ButtonArrow } from '../core/types';
import { Glitch, type GlitchHandle } from './glitch/Glitch';

export interface ButtonProps {
  /** Button label. Alternatively pass children. */
  text?: string;
  /** If set, clicking navigates here. */
  href?: string;
  /** Open http(s) links in a new tab. */
  targetBlank?: boolean;
  /** Direction glyph appended to the label. */
  arrow?: ButtonArrow;
  /** Native tooltip. */
  title?: string;
  disabled?: boolean;
  /** Override the link component (e.g. Next's <Link>). */
  linkComponent?: React.ElementType;
  /** Play the global glitch effect on the label when hovered. Default true. */
  glitchOnHover?: boolean;
  /** Minimum ms between glitch triggers. */
  glitchCooldown?: number;
  onClick?: React.MouseEventHandler;
  className?: string;
  children?: React.ReactNode;
}

const ARROWS: Record<ButtonArrow, string> = {
  left: '\u2190',
  right: '\u2192',
  up: '\u2191',
  down: '\u2193',
};

/**
 * Blocky button. Renders a <button> by default, or an anchor when `href` is
 * supplied (using `linkComponent` if provided). On hover the label plays the
 * global glitch effect and the border fills with --primary.
 */
export function Button({
  text,
  href,
  targetBlank,
  arrow,
  title,
  disabled,
  linkComponent: LinkComponent,
  glitchOnHover = true,
  glitchCooldown = 350,
  onClick,
  className = '',
  children,
}: ButtonProps) {
  const glitchRef = React.useRef<GlitchHandle>(null);
  const lastGlitch = React.useRef(0);
  const label = children ?? text;

  const triggerGlitch = React.useCallback(() => {
    if (!glitchOnHover) return;
    const now = Date.now();
    if (now - lastGlitch.current < glitchCooldown) return;
    lastGlitch.current = now;
    glitchRef.current?.glitch();
  }, [glitchOnHover, glitchCooldown]);

  const content = (
    <>
      {arrow === 'left' ? <span className="lotus-btn-arrow">{ARROWS.left}</span> : null}
      <span className="lotus-btn-text">
        <Glitch
          ref={glitchRef}
          autoGlitch={false}
          duration={280}
          glitchIntensity={1.3}
          preserveSpace={false}
        >
          {label}
        </Glitch>
      </span>
      {arrow && arrow !== 'left' ? (
        <span className="lotus-btn-arrow">{ARROWS[arrow]}</span>
      ) : null}
    </>
  );

  const classes = `lotus-btn ${className}`.trim();
  const isExternal = href ? /^https?:\/\//.test(href) : false;

  if (href) {
    const Tag = LinkComponent ?? 'a';
    return (
      <Tag
        href={href}
        className={classes}
        title={title}
        onClick={onClick}
        onMouseEnter={triggerGlitch}
        target={targetBlank || isExternal ? '_blank' : undefined}
        rel={targetBlank || isExternal ? 'noopener noreferrer' : undefined}
      >
        {content}
      </Tag>
    );
  }

  return (
    <button
      type="button"
      className={classes}
      title={title}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={triggerGlitch}
    >
      {content}
    </button>
  );
}

export default Button;
