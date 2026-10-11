import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Glitch } from '../src/react';

const meta: Meta<typeof Glitch> = {
  title: 'Components/Glitch',
  component: Glitch,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'The base glitch effect (chromatic aberration, shake, displacement, ' +
          'motion blur, noise, flicker). GlitchText/GlitchImage/' +
          'GlitchLink build on this. Scanlines are deprecated and off by ' +
          'default (set `scanlines` to opt in).',
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof Glitch>;

export const Text: Story = {
  args: { duration: 300, delay: 2500, variance: 800, glitchIntensity: 1.2, children: 'Glitching…' },
};

export const NameCycler: Story = {
  args: {
    names: ['Hello', 'Bonjour', 'Hola', 'こんにちは'],
    duration: 250,
    delay: 2000,
    variance: 300,
    glitchIntensity: 1,
  },
};

/** Deprecated opt-in: scanline overlay (paints a box on transparent art). */
export const WithScanlines: Story = {
  args: { children: 'Scanlines on', glitchIntensity: 1.2, scanlines: true, duration: 300, delay: 2500 },
};

