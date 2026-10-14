'use client';

import * as React from 'react';
import type { LinkProps } from '../core/types';
import { useAdapter } from './adapter';
import { GlitchLink } from './GlitchLink';
/**
 * Icon dependencies are OPTIONAL peers. Only apps that render <Footer> need
 * `@icons-pack/react-simple-icons` (social glyphs). Imported normally and kept
 * external in the build so they are never bundled into the library.
 */
import { SiGithub, SiInstagram, SiYoutube } from '@icons-pack/react-simple-icons';
import { Linkedin } from 'lucide-react';

export interface FooterProps {
  /** When true the footer is absolutely pinned to the bottom of the viewport. */
  landingPage?: boolean;
  /** Social links to render. Defaults to Jackson's profiles. */
  links?: Array<{ href: string; label: string; icon: React.ComponentType<{ color?: string }> }>;
  /** Extra class(es) appended to `.lotus-footer`. */
  className?: string;
  /**
   * Render social links through <GlitchLink> (glitch-hover underline) instead
   * of a bare adapter <Link>. Default false. Routing is preserved.
   */
  glitchLinks?: boolean;
  /**
   * Site-specific content rendered ABOVE the links row (e.g. a tagline, nav,
   * or newsletter form). Hosts own their own footer content.
   */
  children?: React.ReactNode;
  /**
   * Optional node rendered inline NEXT TO the social links, inside the same
   * centered wrapping row (e.g. a theme toggle). Sits beside the links rather
   * than in the block above.
   */
  extraSlot?: React.ReactNode;
}

const DEFAULT_LINKS = [
  { href: 'https://github.com/JDLanyon', icon: SiGithub, label: 'GitHub' },
  { href: 'https://www.linkedin.com/in/jdlanyon/', icon: Linkedin, label: 'LinkedIn' },
  { href: 'https://www.youtube.com/@sausytime', icon: SiYoutube, label: 'YouTube' },
  { href: 'https://www.instagram.com/sausytime/', icon: SiInstagram, label: 'Instagram' },
];

/**
 * Site footer: an optional site-content block (children) above a centered,
 * wrapping row of social links plus an optional inline `extraSlot` (e.g. a
 * theme toggle). Opinionated by design — it references Jackson by default and
 * can be overridden via `links`. Styling lives in `.lotus-footer*`
 * (core components.css).
 */
export function Footer({
  landingPage = false,
  links = DEFAULT_LINKS,
  className = '',
  glitchLinks = false,
  children,
  extraSlot,
}: FooterProps) {
  const { Link } = useAdapter();
  const LinkComponent = Link as React.ComponentType<LinkProps>;

  return (
    <footer
      className={`lotus-footer${landingPage ? ' is-landing' : ''} ${className}`.trim()}
    >
      {children}
      <div className="lotus-footer-row">
      {links.map(({ href, icon: Icon, label }) => {
        const inner = (
          <>
            <Icon color="var(--lotus-secondary)" />
            <p>{label}</p>
          </>
        );

        if (glitchLinks) {
          return (
            <GlitchLink
              key={href}
              href={href}
              linkComponent={LinkComponent}
              className="lotus-footer-link"
            >
              {inner}
            </GlitchLink>
          );
        }

        return (
          <LinkComponent
            key={href}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="lotus-footer-link"
          >
            {inner}
          </LinkComponent>
        );
      })}
      {extraSlot}
      </div>
    </footer>
  );
}

export default Footer;

