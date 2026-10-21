import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { LotusIcon } from '../src/react';

const meta: Meta<typeof LotusIcon> = {
  title: 'Components/LotusIcon',
  component: LotusIcon,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'The lotus mark. Defaults to `/lotus.png` — ship one in your public dir ' +
          'or pass `src`.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof LotusIcon>;

export const Default: Story = {
  args: { width: 64, height: 64 },
};

export const Large: Story = {
  args: { width: 160, height: 160 },
};
