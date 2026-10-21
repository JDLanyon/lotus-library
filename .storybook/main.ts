import type { StorybookConfig } from '@storybook/nextjs-vite';

/**
 * Static Storybook is served at the DOMAIN ROOT of
 * https://lotus-library.jdlanyon.dev/ (Cloudflare Pages, output
 * `storybook-static`). No subpath is involved, so no `base` override is
 * needed — asset URLs resolve from `/`.
 */
const config: StorybookConfig = {
  // The displayed name/logo/link chrome comes from the themes in themes.ts
  // (brandTitle / brandImage / brandUrl), applied via manager.ts.
  "stories": [
    "../stories/**/*.mdx",
    "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@chromatic-com/storybook",
    "@storybook/addon-vitest",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    "@storybook/addon-onboarding"
  ],
  "framework": "@storybook/nextjs-vite",
  // `public/` is copied to the static root, so it is served at `/` — the brand
  // glyph is `/lotus.png` (both in dev and in the built Storybook).
  "staticDirs": [
    "../public"
  ]
};
export default config;