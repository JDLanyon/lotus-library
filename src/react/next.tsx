'use client';

import * as React from 'react';
import NextLink from 'next/link';
import NextImage from 'next/image';
import {
  usePathname as useNextPathname,
  useRouter as useNextRouter,
} from 'next/navigation';
import { LotusAdapterProvider } from './adapter';
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

export function LotusNextProvider({ children }: { children: React.ReactNode }) {
  const adapter = React.useMemo(
    () => ({
      Link: AdaptedLink,
      Image: AdaptedImage,
      usePathname: useNextPathname,
      useRouter: useAdaptedRouter,
    }),
    [],
  );

  return (
    <LotusAdapterProvider adapter={adapter}>{children}</LotusAdapterProvider>
  );
}
