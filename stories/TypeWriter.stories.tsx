import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { TypeWriter } from '../src/react';

const meta: Meta<typeof TypeWriter> = {
  title: 'Components/TypeWriter',
  component: TypeWriter,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Cycling typewriter heading. Types each heading, deletes it word by word, ' +
          'then moves on. Word-deletion logic is shared via core.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof TypeWriter>;

export const Default: Story = {
  args: { headings: ['Building things', 'Writing code', 'Breaking stuff'] },
};

export const Fast: Story = {
  args: { headings: ['Fast', 'Faster', 'Fastest'], speed: 480, delayBetweenHeadings: 1500 },
};
