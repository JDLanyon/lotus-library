import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Card, CardGrid } from '../src/react';
import type { ProjectCardData } from '../src/core/types';

// A tiny inline data-URI image so the media rendering is visible without
// shipping binary assets into the library.
const IMG =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="320" height="200">' +
      '<rect width="320" height="200" fill="%23ddd"/>' +
      '<text x="50%" y="52%" font-family="monospace" font-size="20" ' +
      'text-anchor="middle" fill="%23666">thumbnail</text></svg>',
  );

const SAMPLE: ProjectCardData[] = [
  {
    slug: 'dead-bread',
    title: 'Dead Bread',
    date: '2024',
    description: 'A group VR project about resupplying a store while fighting zombies',
    tags: ['Unity', 'C#', 'VR'],
    thumbnail: IMG,
  },
  {
    slug: 'task-tank',
    title: 'Task Tank',
    date: '2023',
    description: 'A gamified task tracking and pomodoro timer application',
    tags: ['Java', 'JavaFX'],
    thumbnail: IMG,
  },
];

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof Card>;

export const TextOnly: Story = {
  args: {
    title: 'Dead Bread',
    date: '2024',
    description: 'A group VR project about zombies',
    tags: ['Unity', 'VR'],
  },
};

export const WithMedia: Story = {
  args: {
    title: 'Dead Bread',
    date: '2024',
    description: 'A group VR project about zombies',
    tags: ['Unity', 'VR'],
    thumbnail: IMG,
    aspect: '16/9',
  },
};

/** `href` turns the whole card into a link (native <a> by default). */
export const Linking: Story = {
  args: {
    title: 'Task Tank',
    description: 'Links out instead of opening a modal',
    tags: ['Java'],
    thumbnail: IMG,
    href: '/projects/task-tank',
  },
};

/**
 * `CardGrid` is a **thin convenience**: it maps `items` to `<Card>`s and owns
 * one shared `ProjectModal`. Layout is the host's job — override the grid with
 * your own `className`. See the README "Layout is the host's job".
 */
export const Grid: StoryObj<typeof CardGrid> = {
  render: (args) => <CardGrid {...args} />,
  args: {
    items: SAMPLE,
  },
};
