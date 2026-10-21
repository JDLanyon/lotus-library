import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useGlobals } from 'storybook/preview-api';
import { Button, Footer, Glitch, GlitchLink, TypeWriter } from '../src/react';

/**
 * The static Storybook has no landing route of its own — opening
 * https://lotus-library.jdlanyon.dev/ would otherwise redirect straight to the
 * first docs page. This story is that landing page, and it is also a live demo
 * of Glitch, TypeWriter, Button, GlitchLink and Footer working together.
 *
 * `preview.ts` sorts `Overview` first, so this is the entry story. Links use
 * `?path=…` so they work from the deployed Storybook and from `npm run
 * storybook` alike, without needing to know the origin.
 */

const SECTIONS = [
  'build reproducible custom websites',
  'share one component API across React and Vue',
  'keep styling in CSS custom properties',
  'glitch the things that deserve glitching',
  'ship a themeable baseline, not a framework',
];

const NAMES = ['lotus-library', 'React + Vue', 'lotus'];

const meta = {
  title: 'Overview/Welcome',
  // No autodocs: this story IS the page. A docs page would wrap the same hero
  // in a redundant frame, so links target the story URL
  // (`?path=/story/overview-welcome--welcome`), which preview.ts sorts first.
  tags: ['!autodocs'],
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

/**
 * The lotus is a near-WHITE glyph, so it must be inverted on a light canvas
 * (the same `filter: invert()` the jdlanyon.dev navbar applies). The theme
 * toolbar drives it, resolving `system` against the OS.
 */
function Lotus() {
  const [globals] = useGlobals();
  const mode = (globals?.theme as string) ?? 'system';
  const systemDark =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-color-scheme: dark)').matches;
  const dark = mode === 'dark' || (mode === 'system' && systemDark);

  return (
    <Glitch duration={3000} delay={16000}>
      {/* A raw <img>: this is a static Storybook page, not a Next app, so
          next/image's optimizer is not available. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/storybook/lotus.png"
        width={160}
        height={160}
        alt="lotus"
        style={{
          display: 'block',
          margin: '1rem auto',
          filter: dark ? 'none' : 'invert(1)',
          transition: 'filter 120ms ease',
        }}
      />
    </Glitch>
  );
}

export const Welcome: Story = {
  render: () => (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        gap: '1rem',
        padding: '2rem 1rem',
      }}
    >
      <h1 style={{ margin: 0, fontSize: 'clamp(2rem, 6vw, 3.5rem)', letterSpacing: '-0.02em' }}>
        <Glitch names={NAMES} duration={1200} delay={6000} />
      </h1>

      <p style={{ margin: 0, maxWidth: '52ch', opacity: 0.8 }}>
        Reusable components for reproducible custom websites. One component API, two
        frameworks.
      </p>

      <div style={{ minHeight: '2rem' }}>
        <TypeWriter headings={SECTIONS} speed={300} />
      </div>

      <Lotus />

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.5rem',
          justifyContent: 'center',
          whiteSpace: 'nowrap',
        }}
      >
        <Button text="Button" href="?path=/docs/components-button--docs" />
        <Button text="Glitch" href="?path=/docs/components-glitch--docs" />
        <Button text="Modal" href="?path=/docs/components-modal--docs" />
      </div>

      <p style={{ margin: 0, opacity: 0.7, fontSize: '0.9rem' }}>
        <GlitchLink href="?path=/docs/components-button--docs">Browse the docs</GlitchLink>{' '}
        or{' '}
        <GlitchLink href="https://github.com/JDLanyon/lotus-library">
          read the source
        </GlitchLink>
        .
      </p>

      <div style={{ width: '100%', maxWidth: 480, marginTop: '2rem' }}>
        <Footer />
      </div>
    </div>
  ),
};

