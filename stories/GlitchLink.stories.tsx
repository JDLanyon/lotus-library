import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { GlitchLink, GlitchText } from '../src/react';

const meta: Meta<typeof GlitchLink> = {
  title: 'Components/GlitchLink',
  component: GlitchLink,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof GlitchLink>;

export const Default: Story = {
  args: { href: 'https://sausytime.com', text: 'Design Portfolio' },
};

export const Inline: Story = {
  render: () => (
    <p>
      Check out my{' '}
      <GlitchLink href="https://sausytime.com">Design Portfolio</GlitchLink>{' '}
      :&gt;
    </p>
  ),
};

export const TextGlitch: StoryObj<typeof GlitchText> = {
  render: () => (
    <GlitchText
      names={['Python', 'C#', 'React', 'TypeScript']}
      delay={2500}
      intensity={1.5}
    />
  ),
};
