'use client';

import * as React from 'react';
import NextLink from 'next/link';
import NextImage from 'next/image';
import {
  usePathname as useNextPathname,
  useRouter as useNextRouter,
} from 'next/navigation';
import { LotusAdapterProvider } from './adapter';
import { LotusThemeProvider, type ThemeController } from './theme';
import type {
  ImageProps,
  LinkProps,
  LotusRouter,
} from '../core/types';

/**
 * Next.js adapter. Wrap your app (or just the subtree that uses Lotus
 * components) once:
 *
 *   import { LotusNextProvider } from '@jdlanyon/lotus-library/react/next';
 *   <LotusNextProvider>{children}</LotusNextProvider>
 *
 * It installs `next/link`, `next/image` and `next/navigation`'s usePathname
 * as the renderers every Lotus component uses under the hood.
 *
 * `themeController` (optional) forwards a host-owned theme state (e.g.
 * `next-themes`) into the library's theme context, so <Footer>'s ThemeSwitch
 * reflects and updates the real theme without a separate <LotusThemeProvider>.
 * Pass `{ theme, setTheme }` from `useTheme()` (next-themes):
 *
 *   <LotusNextProvider themeController={{ theme, setTheme }}>
 *
 * Note: `<Link>` renders an `<a>`, accepts normal anchor props, and no longer
 * needs a child `<a>`.
 */

function AdaptedLink({ href, children, ...rest }: LinkProps) {
  return (
    <NextLink href={href} {...(rest as Record<string, unknown>)}>
      {children as React.ReactNode}
    </NextLink>
  );
}

function AdaptedImage({ src, alt, width, height, ...rest }: ImageProps) {
  return (
    <NextImage
      src={src}
      alt={alt ?? ''}
      width={width ?? 1000}
      height={height ?? 1000}
      {...(rest as Record<string, unknown>)}
    />
  );
}

function useAdaptedRouter(): LotusRouter {
  const router = useNextRouter();
  return React.useMemo(
    () => ({
      push: (href: string) => router.push(href),
      back: () => router.back(),
      refresh: () => router.refresh(),
    }),
    [router],
  );
}

export function LotusNextProvider({
  children,
  themeController,
}: {
  children: React.ReactNode;
  /** Optional host-owned theme state forwarded into the library theme context. */
  themeController?: ThemeController;
}) {
  const adapter = React.useMemo(
    () => ({
      Link: AdaptedLink,
      Image: AdaptedImage,
      usePathname: useNextPathname,
      useRouter: useAdaptedRouter,
    }),
    [],
  );

  const tree = (
    <LotusAdapterProvider adapter={adapter}>{children}</LotusAdapterProvider>
  );

  if (!themeController) return tree;

  return (
    <LotusThemeProvider controller={themeController}>{tree}</LotusThemeProvider>
  );
}
