'use client';

import * as React from 'react';
import { useTheme, useMounted } from './theme';
import { Button } from './Button';
import { Tooltip } from './Tooltip';

/**
 * Optional icon dependency. Only apps that render <ThemeSwitch> need
 * `lucide-react` (theme glyphs). Imported normally and kept external in the
 * build so it is never bundled into the library.
 */
import { Circle, Moon, SunMoon } from 'lucide-react';

export interface ThemeSwitchProps {
  /** Extra class(es) appended to the wrapping element. */
  className?: string;
  /** Accessible label for the button. Default "Toggle theme". */
  ariaLabel?: string;
}

/**
 * Standalone theme switch: cycles `light → dark → system` through whatever
 * `ThemeController` is provided (e.g. the host's `next-themes` via
 * `LotusNextProvider`, or the default `data-theme` controller). Extracted from
 * <Footer> so hosts can place the toggle wherever their layout requires.
 */
export function ThemeSwitch({ className, ariaLabel = 'Toggle theme' }: ThemeSwitchProps) {
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
      <Button onClick={cycleTheme} aria-label={ariaLabel} className={className}>
        <Icon />
      </Button>
    </Tooltip>
  );
}

export default ThemeSwitch;
