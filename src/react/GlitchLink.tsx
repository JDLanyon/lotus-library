'use client';

import * as React from 'react';
import { Glitch, type GlitchHandle } from './glitch/Glitch';

export interface GlitchLinkProps {
  href: string;
  /** Fallback link text when no children are supplied. */
  text?: string;
  children?: React.ReactNode;
  className?: string;
  /** ms the underline takes to grow. */
  underlineDuration?: number;
  glitchIntensity?: number;
  /** Minimum ms between glitch triggers. */
  cooldown?: number;
  target?: string;
  rel?: string;
  /** Override the anchor component (e.g. Next's <Link>). */
  linkComponent?: React.ElementType;
  onClick?: React.MouseEventHandler;
}

/**
 * Link that plays a glitch animation on hover plus an animated underline.
 */
export function GlitchLink({
  href,
  text,
  children,
  className = '',
  underlineDuration = 200,
  glitchIntensity = 1.5,
  cooldown = 500,
  target,
  rel,
  linkComponent: LinkComponent = 'a',
  onClick,
}: GlitchLinkProps) {
  const glitchRef = React.useRef<GlitchHandle>(null);
  const lastGlitchTime = React.useRef(0);

  const content = children ?? text ?? href;

  const handleMouseEnter = () => {
    const now = Date.now();
    if (now - lastGlitchTime.current >= cooldown) {
      lastGlitchTime.current = now;
      glitchRef.current?.glitch();
    }
  };

  const isExternal = /^https?:\/\//.test(href);

  return (
    <LinkComponent
      href={href}
      className={`lotus-glitch-link ${className}`.trim()}
      onMouseEnter={handleMouseEnter}
      onClick={onClick}
      target={target ?? (isExternal ? '_blank' : undefined)}
      rel={rel ?? (isExternal ? 'noopener noreferrer' : undefined)}
    >
      <Glitch ref={glitchRef} names={[typeof content === 'string' ? content : String(content)]} duration={300} glitchIntensity={glitchIntensity}>
        {content}
      </Glitch>
      <span
        className="lotus-glitch-underline"
        aria-hidden="true"
        style={{
          transitionDuration: `${underlineDuration}ms`,
        }}
      />
    </LinkComponent>
  );
}

export default GlitchLink;
