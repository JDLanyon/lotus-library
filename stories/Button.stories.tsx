import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Button } from '../src/react';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  args: { text: 'View Projects' },
  parameters: {
    docs: {
      description: {
        component:
          'Border-only button that fills with --primary (color-burn blend) on ' +
          'hover, with --lotus-background text. The label plays the global glitch ' +
          'effect on hover.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Default: Story = {};

export const WithArrow: Story = { args: { arrow: 'right' } };

export const Disabled: Story = { args: { disabled: true, text: 'Unavailable' } };

export const NoGlitch: Story = { args: { glitchOnHover: false, text: 'Calm Button' } };

export const Row: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
      <Button text="Contact" />
      <Button text="View Projects" href="/projects" arrow="right" />
      <Button text="Read Blog" href="/blog" arrow="right" />
    </div>
  ),
};
