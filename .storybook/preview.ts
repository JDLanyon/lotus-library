import type { Preview } from '@storybook/nextjs-vite';

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

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'lotus-light',
      values: [
        { name: 'lotus-light', value: '#eeeeee' },
        { name: 'lotus-dark', value: '#111111' },
      ],
    },
  },
};

export default preview;
