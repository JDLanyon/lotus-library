'use client';

import * as React from 'react';
import type { LinkProps } from '../core/types';
import { useAdapter } from './adapter';
import { useTheme, useMounted } from './theme';
import { Button } from './Button';
import { Tooltip } from './Tooltip';
import { GlitchLink } from './GlitchLink';

/**
 * Icon dependencies are OPTIONAL peers. Only apps that render <Footer> need
 * `@icons-pack/react-simple-icons` (social glyphs) and `lucide-react` (theme
 * glyphs). They are imported normally and kept external in the build so they
 * are never bundled into the library.
 */
import { SiGithub, SiInstagram, SiYoutube } from '@icons-pack/react-simple-icons';
import { Circle, Moon, Linkedin, SunMoon } from 'lucide-react';

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
}

const DEFAULT_LINKS = [
  { href: 'https://github.com/JDLanyon', icon: SiGithub, label: 'GitHub' },
  { href: 'https://www.linkedin.com/in/jdlanyon/', icon: Linkedin, label: 'LinkedIn' },
  { href: 'https://www.youtube.com/@sausytime', icon: SiYoutube, label: 'YouTube' },
  { href: 'https://www.instagram.com/sausytime/', icon: SiInstagram, label: 'Instagram' },
];

function ThemeSwitch() {
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();

  const Icon = !mounted
    ? Circle
    : theme === 'light'
      ? Circle
      : theme === 'dark'
        ? Moon
        : SunMoon;

  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  const tooltipText = !mounted
    ? 'Light mode'
    : theme === 'light'
      ? 'Light mode'
      : theme === 'dark'
        ? 'Dark mode'
        : 'System theme';

  return (
    <Tooltip text={tooltipText}>
      <Button onClick={cycleTheme} aria-label="Toggle theme">
        <Icon />
      </Button>
    </Tooltip>
  );
}

/**
 * Site footer: a row of social links plus a theme switch. Opinionated by
 * design — it references Jackson by default and can be overridden via `links`.
 * Styling lives in `.lotus-footer*` (core components.css).
 */
export function Footer({
  landingPage = false,
  links = DEFAULT_LINKS,
  className = '',
  glitchLinks = false,
}: FooterProps) {
  const { Link } = useAdapter();
  const LinkComponent = Link as React.ComponentType<LinkProps>;

  return (
    <footer
      className={`lotus-footer${landingPage ? ' is-landing' : ''} ${className}`.trim()}
    >
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
      <ThemeSwitch />
    </footer>
  );
}

export default Footer;
