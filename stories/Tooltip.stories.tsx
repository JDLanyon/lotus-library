import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Tooltip, Button } from '../src/react';

const meta: Meta<typeof Tooltip> = {
  title: 'Components/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Hover/focus tooltip wrapping arbitrary content. Styling in `.lotus-tooltip*`.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof Tooltip>;

export const OnButton: Story = {
  render: (args) => (
    <Tooltip {...args}>
      <Button text="Hover me" />
    </Tooltip>
  ),
  args: { text: 'A helpful hint' },
};

export const OnText: Story = {
  render: (args) => (
    <Tooltip {...args}>
      <span style={{ textDecoration: 'underline dotted' }}>apiKey</span>
    </Tooltip>
  ),
  args: { text: 'Your secret key' },
};
