import * as React from 'react';
import { addons, types } from 'storybook/manager-api';
import { lightTheme, darkTheme } from './themes';

/**
 * Manager (sidebar + toolbar) theming and chrome.
 *
 * Storybook is re-themed whenever the user picks light/dark/system in the
 * toolbar (`globalsUpdated`). `system` is resolved here against the OS media
 * query, so the chrome is correct before the first story renders.
 */

const prefersDark = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-color-scheme: dark)').matches;

const isDark = (mode: string | undefined) =>
  mode === 'system' || !mode ? prefersDark() : mode === 'dark';

/** Resolve a toolbar choice into a Storybook theme object. */
const resolveTheme = (mode: string | undefined) =>
  isDark(mode) ? darkTheme : lightTheme;

/**
 * Mirror the resolved mode onto <html> so manager-head.html can invert the
 * near-white lotus logo on light chrome. Storybook themes with emotion at
 * runtime and exposes no DOM hook of its own, so we publish one.
 */
function applyChrome(mode: string) {
  if (typeof document === 'undefined') return;
  document.documentElement.setAttribute(
    'data-lotus-theme',
    isDark(mode) ? 'dark' : 'light',
  );
}

// What the user last chose. Kept so an OS-level change while 'system' is
// selected re-themes the manager without the user touching the toolbar.
let currentMode = 'system';

function apply(mode: string) {
  currentMode = mode;
  addons.setConfig({ theme: resolveTheme(mode) });
  applyChrome(mode);
}

addons.setConfig({
  theme: resolveTheme(currentMode),
  // Sidebar: show top-level groups as folders rather than roots.
  sidebar: { showRoots: false },
  // Hide the bottom panel on load: Actions / Interactions / Visual tests /
  // Accessibility are all empty unless a story opts in.
  showPanel: false,
  panelPosition: 'bottom',
});
applyChrome(currentMode);

/**
 * Attribution.
 *
 * Storybook 10 no longer renders a "powered by" footer, so we register a small
 * toolbar link. This is the only place we credit Storybook: one `addons.add`
 * call plus a few lines of inheriting styling.
 */
addons.register('lotus-library/storybook-credit', () => {
  addons.add('lotus-library/storybook-credit/tool', {
    type: types.TOOL,
    title: 'Built with Storybook',
    render: () =>
      React.createElement(
        'a',
        {
          className: 'lotus-storybook-credit',
          href: 'https://storybook.js.org/',
          target: '_blank',
          rel: 'noopener noreferrer',
          title: 'Built with Storybook',
          style: {
            alignSelf: 'center',
            marginRight: 10,
            font: 'inherit',
            fontSize: 12,
            lineHeight: 1,
            textDecoration: 'underline',
            textUnderlineOffset: 3,
            color: 'inherit',
            opacity: 0.75,
            whiteSpace: 'nowrap',
          },
        },
        'Built with Storybook',
      ),
  });
});

// The toolbar's global change arrives as `globalsUpdated`.
const channel = addons.getChannel();
channel.on('globalsUpdated', ({ globals }: { globals: Record<string, unknown> }) => {
  const next = (globals?.theme as string) ?? currentMode;
  if (next === currentMode) return;
  apply(next);
});

/**
 * Document title.
 *
 * Storybook hardcodes the tab title as
 *   `${storyTitle} - ${storyName} ⋅ Storybook`
 * (`getDescription` in sb-manager/runtime.js) with no config hook, so the only
 * way to brand it is to correct it after the fact. We keep Storybook's
 * `<story> - <name>` shape but swap the trailing product name for ours, and
 * re-apply on navigation because the manager rewrites it per story.
 */
const BRAND_SUFFIX = 'Lotus Library';
const TITLE_TEMPLATE = /^(.*?)\s*⋅\s*Storybook\s*$/;

function applyTitle() {
  if (typeof document === 'undefined') return;
  const current = document.title;
  // Leave already-branded titles alone (guards against re-entrancy below).
  if (current.endsWith(BRAND_SUFFIX)) return;

  const match = TITLE_TEMPLATE.exec(current);
  const next = match ? `${match[1]} ⋅ ${BRAND_SUFFIX}` : BRAND_SUFFIX;
  if (next === current) return;

  document.title = next;
}

// Storybook sets the title via react-helmet on navigation; re-assert ours a
// frame later so we land after it, without fighting it in a loop (applyTitle is
// idempotent because it bails once the suffix matches).
let titleQueued = false;
function queueTitle() {
  if (titleQueued) return;
  titleQueued = true;
  requestAnimationFrame(() => {
    titleQueued = false;
    applyTitle();
  });
}

addons.ready().then(queueTitle);
channel.on('storyPrepared', queueTitle);
channel.on('currentStoryWasSet', queueTitle);

// Catch anything that slips past the events (deep links, iframe focus, etc.).
if (typeof MutationObserver !== 'undefined' && typeof document !== 'undefined') {
  new MutationObserver(queueTitle).observe(document.documentElement, {
    subtree: true,
    childList: true,
    characterData: true,
  });
}

// Follow the OS if the user is on 'system' and switches appearance mid-session.
if (typeof window !== 'undefined' && window.matchMedia) {
  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', () => {
      if (currentMode === 'system') {
        addons.setConfig({ theme: resolveTheme(currentMode) });
        applyChrome(currentMode);
      }
    });
}

