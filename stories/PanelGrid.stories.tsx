import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { PanelGrid } from '../src/react';
import type { PanelData } from '../src/core/types';

const IMG =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="320" height="200">' +
      '<rect width="320" height="200" fill="%23ddd"/>' +
      '<text x="50%" y="52%" font-family="monospace" font-size="20" ' +
      'text-anchor="middle" fill="%23666">panel</text></svg>',
  );

const PANELS: PanelData[] = [
  { id: 'dead-bread', title: 'Dead Bread', description: 'VR zombie co-op', tags: ['Unity', 'VR'], thumbnail: IMG },
  { id: 'task-tank', title: 'Task Tank', description: 'Gamified task tracker', tags: ['Java', 'JavaFX'], thumbnail: IMG },
  { id: 'lotus', title: 'Lotus', description: 'This component library', tags: ['React', 'Vue'], thumbnail: IMG },
];

const meta: Meta<typeof PanelGrid> = {
  title: 'Components/PanelGrid',
  component: PanelGrid,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Minified flex-wrap grid of <Panel>s. Layout lives in `.lotus-panel-grid` ' +
          '(core components.css); override with `className`.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof PanelGrid>;

export const Default: Story = {
  args: { heading: 'Projects', data: PANELS },
};

export const NoHeading: Story = {
  args: { data: PANELS },
};

export const Single: Story = {
  args: { data: [PANELS[0]] },
};
