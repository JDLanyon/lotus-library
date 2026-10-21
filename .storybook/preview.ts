import * as React from 'react';
import type { Preview, ReactRenderer } from '@storybook/nextjs-vite';
import type { DecoratorFunction } from 'storybook/internal/types';

import { BRAND, type ColorMode } from './themes';

// Load the library's theme + component styles for every story.
import '../src/core/theme.css';
import '../src/core/components.css';
import '../src/react/glitch/glitch.css';
import '../src/vue/glitch.css';

// The library ships no fonts; load Poppins for the preview.
const POPPINS_URL =
  'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap';

if (typeof document !== 'undefined' && !document.getElementById('lotus-poppins')) {
  const link = document.createElement('link');
  link.id = 'lotus-poppins';
  link.rel = 'stylesheet';
  link.href = POPPINS_URL;
  document.head.appendChild(link);
}

/**
 * Canvas shell for every story.
 *
 * The library already defines dark tokens for `[data-theme="dark"]` (and
 * `.lotus-dark` / `.dark`) in `src/core/theme.css`, so dark mode needs no
 * duplicate token block here — we only need the wrapper box.
 *
 * `system` has no attribute of its own: it is expressed as a media query on the
 * wrapper, which keeps the decorator hook-free (a decorator function is not a
 * component, and this is a `.ts` file, so it cannot hold JSX or hooks). Inside a
 * preview iframe `prefers-color-scheme` reflects the OS, which is what "system"
 * should mean.
 */
const CANVAS_CSS = `
.lotus-sb-canvas {
  --lotus-canvas-pad: 2rem;
  background: var(--lotus-background);
  color: var(--lotus-primary);
  min-height: 100%;
  padding: var(--lotus-canvas-pad);
  transition: background 120ms ease, color 120ms ease;
}
.lotus-sb-canvas[data-fullscreen='true'] { --lotus-canvas-pad: 0; }

/* System: follow the OS, using the same values as theme.css's dark block. */
@media (prefers-color-scheme: dark) {
  .lotus-sb-canvas[data-theme='system'] {
    --lotus-primary: #eee;
    --lotus-secondary: #ccc;
    --lotus-background: #111;
    --lotus-border-color: #222;
  }
}
`;

if (typeof document !== 'undefined' && !document.getElementById('lotus-sb-canvas')) {
  const style = document.createElement('style');
  style.id = 'lotus-sb-canvas';
  style.textContent = CANVAS_CSS;
  document.head.appendChild(style);
}

/**
 * Wraps every story in a canvas painted from the lotus theme tokens.
 * `light` is the token default, so only `dark`/`system` need the overrides
 * above.
 */
const withTheme: DecoratorFunction<ReactRenderer> = (Story, context) => {
  const mode = (context.globals.theme as ColorMode) ?? 'system';
  const fullscreen = context.parameters?.layout === 'fullscreen';

  return React.createElement(
    'div',
    {
      className: 'lotus-sb-canvas',
      'data-theme': mode,
      'data-fullscreen': fullscreen ? 'true' : 'false',
    },
    React.createElement(Story),
  );
};

const preview: Preview = {
  decorators: [withTheme],

  globalTypes: {
    theme: {
      description: 'Colour theme for the preview and Storybook UI',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: 'system', icon: 'browser', title: 'System' },
          { value: 'light', icon: 'sun', title: 'Light' },
          { value: 'dark', icon: 'moon', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },

  initialGlobals: {
    theme: 'system',
  },

  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    // The decorator paints the canvas from the theme tokens, so static
    // background swatches are redundant (and could disagree with the selected
    // theme). Disable them to keep one source of truth.
    backgrounds: { disable: true },

    docs: { toc: true },

    // `Overview` first so the landing page is the default story; everything
    // else stays alphabetical under `Components`.
    options: {
      storySort: {
        order: ['Overview', '*'],
      },
    },
  },
};

export default preview;
export { BRAND };

