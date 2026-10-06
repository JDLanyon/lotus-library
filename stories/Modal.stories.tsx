import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Modal, ProjectModal, Button } from '../src/react';

const meta: Meta<typeof Modal> = {
  title: 'Components/Modal',
  component: Modal,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj<typeof Modal>;

/** Small helper that owns the open state for the interactive stories. */
function ModalDemo(props: Partial<React.ComponentProps<typeof Modal>>) {
  const [open, setOpen] = React.useState(true);
  return (
    <div style={{ padding: '2rem' }}>
      <Button text="Open modal" onClick={() => setOpen(true)} />
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        headerActionsLeft={<Button text="View on GitHub" href="https://github.com" arrow="right" />}
        headerActionsRight={<Button text="Open full page" href="#" />}
        signature={
          <>
            Fetched from GitHub — <a href="https://github.com">source</a>
          </>
        }
        {...props}
      >
        <h2>Project title</h2>
        <p>
          This is the scrollable modal body. Anything can go in here — text,
          images, even other components from the library.
        </p>
        <p>
          Close it with the ✕ button, the Escape key, or by clicking the
          backdrop.
        </p>
        {Array.from({ length: 20 }).map((_, i) => (
          <p key={i}>Scroll filler line {i + 1} to demonstrate the scroll box.</p>
        ))}
      </Modal>
    </div>
  );
}

export const Default: Story = { render: () => <ModalDemo /> };

export const NoSignature: Story = {
  render: () => <ModalDemo signature={undefined} />,
};

export const BodyOnly: Story = {
  render: () => {
    const [open, setOpen] = React.useState(true);
    return (
      <div style={{ padding: '2rem' }}>
        <Button text="Open bare modal" onClick={() => setOpen(true)} />
        <Modal open={open} onClose={() => setOpen(false)}>
          <p style={{ margin: 0 }}>A minimal modal with just a body.</p>
        </Modal>
      </div>
    );
  },
};

/**
 * ProjectModal fetches `${projectBasePath}/${slug}` (falling back to `.html`),
 * extracts `.project-fullpage-body`, and shows loading/error states. In Storybook
 * the fetch is stubbed so the shell can be previewed without a backend.
 */
export const Project: Story = {
  render: () => {
    const [open, setOpen] = React.useState(true);

    React.useEffect(() => {
      const orig = globalThis.fetch;
      globalThis.fetch = (async (input: RequestInfo | URL) => {
        const url = String(input);
        if (url.includes('/projects/')) {
          return new Response(
            `<html><body><div class="project-fullpage-body">
              <h2>Dead Bread</h2>
              <p>A browser game about a loaf of bread on a quest.</p>
              <h3>Tech</h3>
              <ul><li>TypeScript</li><li>Canvas</li></ul>
            </div></body></html>`,
            { status: 200, headers: { 'Content-Type': 'text/html' } },
          );
        }
        return orig(input as RequestInfo);
      }) as typeof fetch;
      return () => {
        globalThis.fetch = orig;
      };
    }, []);

    return (
      <div style={{ padding: '2rem' }}>
        <Button text="Open project" onClick={() => setOpen(true)} />
        <ProjectModal
          open={open}
          onClose={() => setOpen(false)}
          slug="dead-bread"
          repo="https://github.com/example/dead-bread"
        />
      </div>
    );
  },
};
