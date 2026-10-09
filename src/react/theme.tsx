'use client';

import * as React from 'react';

/**
 * Theme abstraction. Consumers can supply their own implementation (e.g.
 * `next-themes`) via the provider; the default reads/writes the `data-theme`
 * attribute on <html> that the token layer already understands.
 */

export type Theme = 'light' | 'dark' | 'system';

export interface ThemeController {
  theme: Theme | undefined;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = React.createContext<ThemeController>({
  theme: 'system',
  setTheme: () => {},
});

function defaultController(): ThemeController {
  return {
    theme: 'system',
    setTheme: (theme) => {
      if (typeof document === 'undefined') return;
      const root = document.documentElement;
      if (theme === 'system') root.removeAttribute('data-theme');
      else root.setAttribute('data-theme', theme);
    },
  };
}

export function LotusThemeProvider({
  controller,
  children,
}: {
  controller?: ThemeController;
  children: React.ReactNode;
}) {
  const value = React.useMemo(() => controller ?? defaultController(), [controller]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeController {
  return React.useContext(ThemeContext);
}

const emptySubscribe = () => () => {};

/**
 * Client-only mounted flag (avoids hydration mismatch for theme icons).
 * Uses `useSyncExternalStore` so the server snapshot is `false` and the
 * client snapshot is `true` without a setState-in-effect cascading render.
 */
export function useMounted(): boolean {
  return React.useSyncExternalStore(
    emptySubscribe,
    () => true, // client
    () => false, // server
  );
}
