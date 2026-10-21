import { create } from 'storybook/theming';

/**
 * Storybook UI themes (manager + docs) for the lotus-library showcase.
 *
 * These are Storybook's STANDARD light/dark themes with our branding, and
 * Storybook's colours swapped for the library's own tokens (src/core/theme.css)
 * so the docs chrome and the components read as one product.
 *
 * The manager re-themes at runtime from manager.ts, driven by the toolbar's
 * light / dark / system choice.
 */

/** Branding shared by both themes. */
export const BRAND = {
  title: 'Lotus Library',
  url: 'https://lotus-library.jdlanyon.dev/',
  /**
   * The lotus glyph — the same asset the jdlanyon.dev / sausytime.com navbars
   * use. It is near-WHITE (#fbf8f8), so light mode inverts it; that lives in
   * manager-head.html because `brandImage` cannot carry CSS.
   *
   * Public assets live at `/` in both `npm run storybook` and the static build
   * (no `base` override in main.ts), so this is the one canonical copy —
   * `public/storybook/lotus.png` was a duplicate that 404'd.
   */
  logo: '/lotus.png',
} as const;


const SHARED = {
  brandTitle: BRAND.title,
  brandUrl: BRAND.url,
  brandTarget: '_self' as const,
  fontBase:
    '"Poppins", "Inter", "Noto Sans", "DejaVu Sans", "Liberation Sans", ui-sans-serif, system-ui, sans-serif',
  fontCode:
    '"Overpass Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
} as const;

/** Standard Storybook light theme — mirrors `:root` in src/core/theme.css. */
export const lightTheme = create({
  ...SHARED,
  base: 'light',
  brandImage: BRAND.logo,

  colorPrimary: '#111111',
  colorSecondary: '#333333',

  appBg: '#eeeeee',
  appContentBg: '#f6f6f6',
  appPreviewBg: '#eeeeee',
  appBorderColor: '#dddddd',
  appBorderRadius: 0,

  textColor: '#111111',
  textInverseColor: '#eeeeee',
  textMutedColor: '#555555',

  barBg: '#eeeeee',
  barTextColor: '#333333',
  barHoverColor: '#111111',
  barSelectedColor: '#111111',

  inputBg: '#ffffff',
  inputBorder: '#dddddd',
  inputTextColor: '#111111',
  inputBorderRadius: 0,
});

/** Standard Storybook dark theme — mirrors `[data-theme="dark"]` in theme.css. */
export const darkTheme = create({
  ...SHARED,
  base: 'dark',
  brandImage: BRAND.logo,

  colorPrimary: '#eeeeee',
  colorSecondary: '#cccccc',

  appBg: '#111111',
  appContentBg: '#161616',
  appPreviewBg: '#111111',
  appBorderColor: '#222222',
  appBorderRadius: 0,

  textColor: '#eeeeee',
  textInverseColor: '#111111',
  textMutedColor: '#aaaaaa',

  barBg: '#111111',
  barTextColor: '#cccccc',
  barHoverColor: '#eeeeee',
  barSelectedColor: '#eeeeee',

  inputBg: '#161616',
  inputBorder: '#222222',
  inputTextColor: '#eeeeee',
  inputBorderRadius: 0,
});

export type ColorMode = 'light' | 'dark' | 'system';

/** Map a toolbar choice to a concrete theme object. */
export function resolveTheme(mode: ColorMode) {
  return mode === 'dark' ? darkTheme : lightTheme;
}

