import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Button, Card, Panel, CardGrid } from '../src/react';
import type { ProjectCardData, PanelData } from '../src/core/types';

const IMG =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="320" height="200">' +
      '<rect width="320" height="200" fill="%23ddd"/>' +
      '<text x="50%" y="52%" font-family="monospace" font-size="20" ' +
      'text-anchor="middle" fill="%23666">media</text></svg>',
  );

const CARD_ITEMS: ProjectCardData[] = [
  { slug: 'a', title: 'Dead Bread', description: 'VR zombie co-op', tags: ['Unity'], thumbnail: IMG },
  { slug: 'b', title: 'Task Tank', description: 'Gamified tracker', tags: ['Java'], thumbnail: IMG },
  { slug: 'c', title: 'Lotus', description: 'This library', tags: ['React', 'Vue'], thumbnail: IMG },
];

const PANEL: PanelData = { id: 'p', title: 'Panel', description: 'Image-first', tags: ['X'], thumbnail: IMG };

const meta = {
  title: 'Foundations/Borderless by default',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Button, Card and Panel are BORDERLESS by default. Opt into a resting ' +
          '1px border with the shared `bordered` prop. Hover affordances still ' +
          'apply. This is the same `bordered` prop across all three siblings.',
      },
    },
  },
} satisfies Meta;
export default meta;

type Story = StoryObj;

export const Comparison: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '2rem', justifyItems: 'start' }}>
      <section>
        <h3>Buttons — default (borderless) vs bordered</h3>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Button text="Default" />
          <Button text="Bordered" bordered />
          <Button text="With arrow" bordered arrow="right" />
        </div>
      </section>
      <section>
        <h3>Cards</h3>
        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(2, minmax(0,1fr))', maxWidth: 640 }}>
          <Card title="Borderless" description="default" tags={['a']} thumbnail={IMG} />
          <Card title="Bordered" description="bordered" tags={['b']} thumbnail={IMG} bordered />
        </div>
      </section>
      <section>
        <h3>Panel</h3>
        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(2, minmax(0,1fr))', maxWidth: 640 }}>
          <Panel id="p1" title="Borderless" thumbnail={IMG} />
          <Panel id="p2" title="Bordered" thumbnail={IMG} bordered />
        </div>
      </section>
    </div>
  ),
};

export const CardGridShowcase: Story = {
  render: () => <CardGrid items={CARD_ITEMS} />,
};
