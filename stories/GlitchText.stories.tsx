import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { GlitchText } from '../src/react';

const meta: Meta<typeof GlitchText> = {
  title: 'Components/GlitchText',
  component: GlitchText,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Text that plays the global glitch effect. Pass `names` to cycle through ' +
          'a list (name-cycler mode); otherwise `text`/children are shown.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof GlitchText>;

export const Default: Story = {
  args: { text: 'Jackson Lanyon', duration: 300, delay: 3000, variance: 800, intensity: 1.2 },
};

export const NameCycler: Story = {
  args: {
    names: ['Developer', 'Tinkerer', 'Designer', 'Problem Solver'],
    duration: 250,
    delay: 2500,
    variance: 400,
    intensity: 1,
  },
};
