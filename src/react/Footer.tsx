'use client';

import * as React from 'react';
import type { LinkProps } from '../core/types';
import { useAdapter } from './adapter';
import { Button } from './Button';
import { Glitch, type GlitchHandle } from './glitch/Glitch';
import { Tooltip } from './Tooltip';
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
   * @deprecated Footers are glitchless by design (a footer is a quiet, stable
   * landmark). Hover still underlines the label. Accepted for back-compat and
   * ignored.
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
  /** Centre lotus glyph: where it links to. Defaults to the portfolio. */
  logoHref?: string;
  /** Accessible name + tooltip text for the centre lotus. */
  logoLabel?: string;
  /** Lotus image source. Defaults to the packaged `lotus.png`. */
  logoSrc?: string;
  /** Hide the centre lotus entirely. */
  hideLogo?: boolean;
}

const DEFAULT_LINKS = [
  { href: 'https://github.com/JDLanyon', icon: SiGithub, label: 'GitHub' },
  { href: 'https://www.linkedin.com/in/jdlanyon/', icon: Linkedin, label: 'LinkedIn' },
  { href: 'https://www.youtube.com/@sausytime', icon: SiYoutube, label: 'YouTube' },
  { href: 'https://www.instagram.com/sausytime/', icon: SiInstagram, label: 'Instagram' },
];

/** Portfolios: the centre lotus is the quiet "this is mine" sign-off. */
export const DEFAULT_LOGO_HREF = 'https://jdlanyon.dev';
const DEFAULT_LOGO_SRC = '/storybook/lotus.png';

/**
 * Site footer: an optional site-content block (children) above a centered,
 * wrapping row of social links, with a lotus glyph sitting in the middle of
 * that row. Opinionated by design — it references Jackson by default and can
 * be overridden via `links`. Styling lives in `.lotus-footer*` (core
 * components.css).
 *
 * Buttons are deliberately GLITCHLESS: the footer is a stable landmark, and
 * the only motion is the lotus, which glitches on hover.
 */
export function Footer({
  landingPage = false,
  links = DEFAULT_LINKS,
  className = '',
  children,
  extraSlot,
  logoHref = DEFAULT_LOGO_HREF,
  logoLabel = 'jdlanyon.dev — portfolio',
  logoSrc = DEFAULT_LOGO_SRC,
  hideLogo = false,
}: FooterProps) {
  const { Link } = useAdapter();
  const LinkComponent = Link as React.ComponentType<LinkProps>;
  const glitchRef = React.useRef<GlitchHandle>(null);

  // Split the row so the lotus lands in the visual centre regardless of how
  // many links there are. With N links the glyph goes after ceil(N/2).
  const midpoint = Math.ceil(links.length / 2);
  const left = links.slice(0, midpoint);
  const right = links.slice(midpoint);

  const renderLink = ({ href, icon: Icon, label }: (typeof links)[number]) => (
    <Button
      key={href}
      href={href}
      targetBlank
      glitchOnHover={false}
      linkComponent={LinkComponent}
      className="lotus-footer-link"
    >
      <Icon color="currentColor" />
      <span className="lotus-footer-label">{label}</span>
    </Button>
  );

  const logo = hideLogo ? null : (
    <Tooltip text={logoLabel}>
      <LinkComponent
        href={logoHref}
        target="_blank"
        rel="noopener noreferrer"
        className="lotus-footer-logo"
        aria-label={logoLabel}
        onMouseEnter={() => glitchRef.current?.glitch()}
        onFocus={() => glitchRef.current?.glitch()}
      >
        <Glitch ref={glitchRef} autoGlitch={false} duration={260}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoSrc}
            alt=""
            width={40}
            height={40}
            className="lotus-footer-logo-img"
          />
        </Glitch>
      </LinkComponent>
    </Tooltip>
  );

  return (
    <footer
      className={`lotus-footer${landingPage ? ' is-landing' : ''} ${className}`.trim()}
    >
      {children}
      <div className="lotus-footer-row">
        {left.map(renderLink)}
        {logo}
        {right.map(renderLink)}
        {extraSlot}
      </div>
    </footer>
  );
}

export default Footer;

