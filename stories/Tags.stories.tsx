import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Tags } from '../src/react';

const meta: Meta<typeof Tags> = {
  title: 'Components/Tags',
  component: Tags,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Small pill row for tech/category tags. Styling in `.lotus-tags` / `.lotus-tag`.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof Tags>;

export const Default: Story = {
  args: { tags: ['Unity', 'C#', 'VR'] },
};

export const Many: Story = {
  args: { tags: ['Java', 'JavaFX', 'Desktop', 'Gradle', 'CI', 'Open Source'] },
};

export const Empty: Story = {
  args: { tags: [] },
};
