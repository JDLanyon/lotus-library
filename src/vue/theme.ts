import {
  inject,
  provide,
  ref,
  onMounted,
  type InjectionKey,
  type Ref,
} from 'vue';

export type Theme = 'light' | 'dark' | 'system';

export interface ThemeController {
  theme: Ref<Theme | undefined>;
  setTheme: (theme: Theme) => void;
}

export const LOTUS_THEME_KEY: InjectionKey<ThemeController> =
  Symbol('lotus-theme');

function defaultController(): ThemeController {
  const theme = ref<Theme | undefined>('system');
  return {
    theme,
    setTheme: (next) => {
      theme.value = next;
      if (typeof document === 'undefined') return;
      const root = document.documentElement;
      if (next === 'system') root.removeAttribute('data-theme');
      else root.setAttribute('data-theme', next);
    },
  };
}

export function provideLotusTheme(controller?: ThemeController): void {
  provide(LOTUS_THEME_KEY, controller ?? defaultController());
}

export function useTheme(): ThemeController {
  return inject(LOTUS_THEME_KEY, defaultController());
}

export function useMounted(): Ref<boolean> {
  const mounted = ref(false);
  onMounted(() => (mounted.value = true));
  return mounted;
}
