'use client';

import * as React from 'react';
import type { ImageProps, LinkProps, LotusAdapter, LotusRouter } from '../core/types';
import { isExternalHref } from '../core/adapter';

/**
 * DOM-default adapter. Components read their Link/Image renderers from this
 * context, which means a Next.js host can swap them out at the app root
 * (see `@jdlanyon/lotus-library/react` `/next` entry) without any component
 * change. Components also accept a per-instance `linkComponent` prop, which
 * takes precedence over the context default.
 */

function DomLink({ href, children, ...rest }: LinkProps) {
  const external = isExternalHref(href);
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
    >
      {children as React.ReactNode}
    </a>
  );
}

function DomImage({ src, alt, width, height, ...rest }: ImageProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt ?? ''}
      width={width}
      height={height}
      {...(rest as React.ImgHTMLAttributes<HTMLImageElement>)}
    />
  );
}

const DOM_ROUTER: LotusRouter = {
  push: (href: string) => {
    if (typeof window !== 'undefined') window.location.assign(href);
  },
  back: () => {
    if (typeof window !== 'undefined') window.history.back();
  },
  refresh: () => {
    if (typeof window !== 'undefined') window.location.reload();
  },
};

export const defaultAdapter: LotusAdapter = {
  Link: DomLink,
  Image: DomImage,
  usePathname: () =>
    typeof window !== 'undefined' ? window.location.pathname : '',
  useRouter: () => DOM_ROUTER,
};

const AdapterContext = React.createContext<LotusAdapter>(defaultAdapter);

export function LotusAdapterProvider({
  adapter,
  children,
}: {
  adapter: Partial<LotusAdapter>;
  children: React.ReactNode;
}) {
  const value = React.useMemo(
    () => ({ ...defaultAdapter, ...adapter }),
    [adapter],
  );
  return (
    <AdapterContext.Provider value={value}>{children}</AdapterContext.Provider>
  );
}

export function useAdapter(): LotusAdapter {
  return React.useContext(AdapterContext);
}

/** Convenience: the current pathname, via whatever adapter is installed. */
export function usePathname(): string {
  return useAdapter().usePathname();
}

/** Convenience: the router, via whatever adapter is installed. */
export function useRouter(): LotusRouter | null {
  return useAdapter().useRouter();
}
