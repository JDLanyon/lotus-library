'use client';

import * as React from 'react';
import type { ImageProps, LinkProps } from '../core/types';
import { useAdapter } from './adapter';
import { GlitchLink } from './GlitchLink';

/**
 * Icon dependencies are OPTIONAL peers. Only apps that render <Nav> need to
 * install `lucide-react` (for the menu/close glyphs). They are imported
 * normally and kept external in the build so they are never bundled into the
 * library. If a consumer never renders Nav, `lucide-react` is not required.
 */
import { Menu, X } from 'lucide-react';

export interface NavLinkItem {
  name: string;
  href: string;
  position?: 'left' | 'right';
}

export interface NavProps {
  links?: NavLinkItem[];
  /** Path to the lotus logo in the public dir. Default `/lotus.png`. */
  logoSrc?: string;
  /** Accessible label for the <nav>. Default "Primary". */
  ariaLabel?: string;
  /**
   * Layout variant. v0.1.6 ships `'classic'` only; additional layouts land in
   * a later release. The prop is accepted now so call-sites can opt in early.
   */
  layout?: 'classic';
  /** Extra class(es) appended to `.lotus-nav`. */
  className?: string;
  /**
   * Render nav links through <GlitchLink> (glitch-hover underline) instead of
   * a bare adapter <Link>. Default false. Routing is preserved via the adapter.
   */
  glitchLinks?: boolean;
  /**
   * Class(es) applied to the logo <img>. Use to control its size/appearance.
   * Defaults to `.lotus-nav-logo-img`.
   */
  logoClassName?: string;
  /**
   * Invert the logo on dark themes for legibility (default true; the bundled
   * lotus.svg is near-black). Set false when shipping a light/dark pair.
   */
  logoInvert?: boolean;
  /** Optional right-aligned slot rendered inside the mobile drawer. */
  children?: React.ReactNode;
}

const DEFAULT_LINKS: NavLinkItem[] = [
  { name: 'Home', href: '/', position: 'left' },
  { name: 'About', href: '/about', position: 'left' },
  { name: 'Programming', href: '/programming', position: 'right' },
  { name: 'Motion Graphics', href: '/motion_graphics', position: 'right' },
];

/**
 * Top navigation bar. Centred logo with links split left/right of it, plus a
 * slide-in mobile drawer. Link rendering goes through the adapter (so a Next
 * host routes via `next/link`); active-link styling uses the adapter pathname.
 */
export function Nav({
  links = DEFAULT_LINKS,
  logoSrc = '/lotus.png',
  ariaLabel = 'Primary',
  className = '',
  glitchLinks = false,
  logoClassName = '',
  logoInvert = true,
  children,
}: NavProps) {
  const { Link, Image, usePathname } = useAdapter();
  const pathname = usePathname();
  const [isMenuOpen, setMenuOpen] = React.useState(false);
  const toggleMenu = React.useCallback(() => setMenuOpen((open) => !open), []);

  const LinkComponent = Link as React.ComponentType<LinkProps>;
  const ImageComponent = Image as React.ComponentType<ImageProps>;

  const renderLink = (l: NavLinkItem, onClick?: () => void) => {
    const isActive = pathname === l.href;
    const linkClass = `lotus-nav-link${isActive ? ' is-active' : ''}`;

    if (glitchLinks) {
      return (
        <GlitchLink
          key={l.href}
          href={l.href}
          onClick={onClick}
          className={linkClass}
          linkComponent={LinkComponent}
        >
          {l.name}
        </GlitchLink>
      );
    }

    return (
      <LinkComponent
        key={l.href}
        href={l.href}
        rel="noopener noreferrer"
        onClick={onClick}
        className={linkClass}
      >
        {l.name}
      </LinkComponent>
    );
  };

  const logoClasses = [
    'lotus-nav-logo-img',
    !logoInvert ? 'lotus-nav-logo-img--no-invert' : '',
    logoClassName,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <nav aria-label={ariaLabel} className={`lotus-nav ${className}`.trim()}>
      <div className="lotus-nav-group lotus-nav-group-left">
        {links.filter((x) => x.position === 'left').map((l) => renderLink(l))}
      </div>

      <LinkComponent href="/" className="lotus-nav-logo">
        <ImageComponent
          className={logoClasses}
          src={logoSrc}
          width={64}
          height={64}
          alt="lotus"
        />
      </LinkComponent>

      <div className="lotus-nav-group lotus-nav-group-right">
        {links.filter((x) => x.position === 'right').map((l) => renderLink(l))}
      </div>

      <div className="lotus-nav-mobile-toggle">
        <button
          type="button"
          className="lotus-nav-icon-btn"
          aria-label="Open menu"
          aria-expanded={isMenuOpen}
          onClick={toggleMenu}
        >
          <Menu color="var(--lotus-secondary)" />
        </button>

        <div
          className={`lotus-nav-drawer${isMenuOpen ? ' is-open' : ''}`}
          aria-hidden={!isMenuOpen}
        >
          <div className="lotus-nav-drawer-head">
            <button
              type="button"
              className="lotus-nav-icon-btn"
              aria-label="Close menu"
              onClick={toggleMenu}
            >
              <X color="var(--lotus-secondary)" />
            </button>
          </div>
          <div className="lotus-nav-drawer-body">
            {links.map((l) => renderLink(l, toggleMenu))}
            {children}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Nav;

