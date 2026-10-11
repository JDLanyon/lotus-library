import type { StorybookConfig } from '@storybook/nextjs-vite';

/**
 * Static Storybook is served from a subpath on jdlanyon.dev
 * (https://jdlanyon.dev/lotus-library/). Set `STORYBOOK_BASE_PATH=/lotus-library`
 * when building for that host so asset URLs resolve; leave it unset for local
 * dev (served at the root).
 */
const BASE_PATH = process.env.STORYBOOK_BASE_PATH ?? '';

const config: StorybookConfig = {
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
  "staticDirs": [
    "../public"
  ],
  viteFinal(viteConfig) {
    if (BASE_PATH) {
      viteConfig.base = `${BASE_PATH.replace(/\/$/, '')}/`;
    }
    return viteConfig;
  }
};
export default config;