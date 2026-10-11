import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { GlitchImage } from '../src/react';

const IMG =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256">' +
      '<rect width="256" height="256" rx="32" fill="%23c8f"/>' +
      '<text x="50%" y="52%" font-family="monospace" font-size="28" ' +
      'text-anchor="middle" fill="%23333">logo</text></svg>',
  );

const meta: Meta<typeof GlitchImage> = {
  title: 'Components/GlitchImage',
  component: GlitchImage,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Wraps an image with the auto-looping glitch effect. Pass `src`/`alt`, ' +
          'or children for custom markup. Structurally identical to the Vue ' +
          '<GlitchImage> (both mirror the React <Glitch>).',
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof GlitchImage>;

export const Default: Story = {
  args: { src: IMG, alt: 'Lotus', duration: 300, delay: 2500, variance: 1500, intensity: 1.5 },
};

export const WithChildren: Story = {
  render: (args) => (
    <GlitchImage {...args}>
      <img src={IMG} alt="Lotus" style={{ width: 256, height: 256 }} />
    </GlitchImage>
  ),
};
