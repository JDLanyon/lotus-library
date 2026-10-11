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
          'motion blur, noise, scanlines, flicker). GlitchText/GlitchImage/' +
          'GlitchLink build on this. The React and Vue versions share one DOM ' +
          'structure and per-layer styles.',
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
