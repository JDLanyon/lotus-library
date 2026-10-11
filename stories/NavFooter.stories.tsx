import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Nav, Footer } from '../src/react';

/**
 * Nav and Footer are site chrome — they expect an adapter (routing) and a
 * `lotus.svg` in the public dir. These stories render the real components to
 * make their layout/appearance reviewable in isolation.
 */
const LINKS = [
  { name: 'Home', href: '/', position: 'left' as const },
  { name: 'Projects', href: '/projects', position: 'left' as const },
  { name: 'Blog', href: '/blog', position: 'right' as const },
  { name: 'Contact', href: '/contact', position: 'right' as const },
];

const meta = {
  title: 'Components/Nav & Footer',
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta;
export default meta;

type Story = StoryObj;

export const Navigation: Story = {
  render: () => <Nav links={LINKS} />,
};

export const FooterDefault: Story = {
  render: () => <Footer />,
};

export const FooterLanding: Story = {
  render: () => <Footer landingPage />,
};
