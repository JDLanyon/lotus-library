import {
  inject,
  provide,
  h,
  type App,
  type Component,
  type InjectionKey,
} from 'vue';
import type {
  ImageProps,
  LinkProps,
  LotusAdapter,
  LotusRouter,
} from '../core/types';
import { isExternalHref } from '../core/adapter';

/**
 * Vue adapter. Mirrors the React build's adapter contract so both render
 * links/images/navigation identically. The DOM-default implementations keep the
 * components usable in any Vue host; a host can call `provideLotusAdapter`
 * (or `app.use(createLotusAdapter(...))`) to swap in vue-router or Nuxt.
 */

const DomLink: Component = {
  name: 'LotusDomLink',
  inheritAttrs: false,
  props: {
    href: { type: String, required: true },
    download: { type: [String, Boolean], default: undefined },
    target: { type: String, default: undefined },
    rel: { type: String, default: undefined },
  },
  setup(props, { slots, attrs }) {
    return () => {
      const external = isExternalHref(props.href);
      return h(
        'a',
        {
          href: props.href,
          download: props.download,
          target: props.target ?? (external ? '_blank' : undefined),
          rel: props.rel ?? (external ? 'noopener noreferrer' : undefined),
          ...attrs,
        },
        slots.default?.(),
      );
    };
  },
};

const DomImage: Component = {
  name: 'LotusDomImage',
  inheritAttrs: false,
  props: {
    src: { type: String, required: true },
    alt: { type: String, default: '' },
    width: { type: [Number, String], default: undefined },
    height: { type: [Number, String], default: undefined },
  },
  setup(props, { attrs }) {
    return () => h('img', { ...props, ...attrs });
  },
};

export const DOM_ROUTER: LotusRouter = {
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

export const LOTUS_ADAPTER_KEY: InjectionKey<LotusAdapter> =
  Symbol('lotus-adapter');

/** Provide an adapter for the current app subtree. */
export function provideLotusAdapter(
  adapter: LotusAdapter | Partial<LotusAdapter>,
): void {
  provide(LOTUS_ADAPTER_KEY, { ...defaultAdapter, ...adapter });
}

export interface VueLotusAdapter {
  Link: Component;
  Image: Component;
  usePathname: () => string;
  useRouter: () => LotusRouter | null;
}

export function useAdapter(): VueLotusAdapter {
  const adapter = inject(LOTUS_ADAPTER_KEY, defaultAdapter);
  return adapter as unknown as VueLotusAdapter;
}

/** Vue plugin form: `app.use(createLotusAdapter(adapter))`. */
export function createLotusAdapter(adapter?: Partial<LotusAdapter>) {
  return {
    install(app: App) {
      app.provide(LOTUS_ADAPTER_KEY, { ...defaultAdapter, ...adapter });
    },
  };
}

export type { LinkProps, ImageProps };
