import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Embed } from '../src/react';

const meta: Meta<typeof Embed> = {
  title: 'Components/Embed',
  component: Embed,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Responsive 16:9 YouTube embed. Pass `nocookie` for the ' +
          'privacy-preserving `youtube-nocookie.com` host, or `host` to override ' +
          'the embed domain entirely.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof Embed>;

export const Default: Story = {
  args: { uuid: 'nZdhINf1foU' },
};

export const NoCookie: Story = {
  args: { uuid: 'nZdhINf1foU', nocookie: true },
};

export const CustomHost: Story = {
  args: { uuid: 'nZdhINf1foU', host: 'www.youtube-nocookie.com' },
};
