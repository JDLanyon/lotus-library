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

/**
 * Long headings must WRAP to multiple lines, with the caret following the last
 * typed character onto whichever line it lands on.
 */
export const MultiLine: Story = {
  render: (args) => (
    <h1 style={{ maxWidth: '28rem', textAlign: 'center', margin: '0 auto' }}>
      <TypeWriter {...args} />
    </h1>
  ),
  args: {
    headings: [
      'I build robust, accessible web experiences',
      'I design and ship full-stack applications',
    ],
  },
};
