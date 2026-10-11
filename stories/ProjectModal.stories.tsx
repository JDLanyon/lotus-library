import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ProjectModal } from '../src/react';

const meta: Meta<typeof ProjectModal> = {
  title: 'Components/ProjectModal',
  component: ProjectModal,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Fetches project HTML (`${basePath}/${slug}`), extracts `contentSelector`, ' +
          'and renders it in a Modal shell with an optional "View on GitHub" action. ' +
          'Renders nothing when `open` is falsy. NOTE: needs a real project page at ' +
          '`projectBasePath` — the story below will show its loading/error state.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof ProjectModal>;

export const Open: Story = {
  render: (args) => {
    const [open, setOpen] = React.useState(true);
    return (
      <>
        <button onClick={() => setOpen(true)}>Open project modal</button>
        <ProjectModal {...args} open={open} onClose={() => setOpen(false)} />
      </>
    );
  },
  args: { slug: 'dead-bread', repo: 'https://github.com/JDLanyon/dead-bread' },
};
