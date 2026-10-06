import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Panel, PanelGrid } from '../src/react';
import type { PanelData } from '../src/core/types';

const SAMPLE: PanelData[] = [
  {
    id: 'task-tank',
    title: 'Task Tank',
    description: 'A gamified task tracking and pomodoro timer application',
    tags: ['Java', 'JavaFX', 'SQLite'],
  },
  {
    id: 'dead-bread',
    title: 'Dead Bread',
    description: 'A group VR project about resupplying a store while fighting zombies',
    tags: ['Unity', 'C#', 'VR'],
  },
  {
    id: 'boids',
    title: 'Boids',
    description: 'Flocking simulation with finite state machines',
    tags: ['Unity', 'C#'],
  },
];

const meta: Meta<typeof Panel> = {
  title: 'Components/Panel',
  component: Panel,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof Panel>;

export const Single: Story = {
  args: {
    id: 'task-tank',
    title: 'Task Tank',
    description: 'A gamified task tracking and pomodoro timer application',
    tags: ['Java', 'JavaFX', 'SQLite'],
    basePath: '/programming/uni',
  },
};

export const Grid: StoryObj<typeof PanelGrid> = {
  render: (args) => <PanelGrid {...args} />,
  args: {
    heading: 'University Projects',
    basePath: '/programming/uni',
    panels: SAMPLE,
  },
};
