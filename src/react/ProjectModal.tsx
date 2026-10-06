'use client';

import * as React from 'react';
import { Modal } from './Modal';

export interface ProjectModalProps {
  /** When falsy the modal renders nothing (and no fetch is made). */
  open: boolean;
  onClose: () => void;
  /** Project slug — the modal fetches `${baseUrl}/${slug}`. */
  slug: string;
  /** Optional repository URL, shown as a "View on GitHub" action. */
  repo?: string;
  /** Where the project HTML lives. Default `/projects`. */
  projectBasePath?: string;
  /** Renders a "View on GitHub" link when a repo is provided. Default true. */
  showRepoAction?: boolean;
  /** Label for the repo action. */
  repoLabel?: string;
  /** Message shown while the project HTML is loading. */
  loadingText?: string;
  /** Message shown if the fetch fails. */
  errorText?: string;
  /** Selector for the fragment to extract from the fetched page. */
  contentSelector?: string;
  /** Extra class(es) appended to `.lotus-modal-container`. */
  className?: string;
  /** Rendered in the header's right action zone, before the ✕ button. */
  headerActionsRight?: React.ReactNode;
}

/**
 * Project detail modal. Wraps the pure <Modal> shell and owns the fetching of the
 * generated `/projects/:slug` HTML, extracting the `.project-fullpage-body`
 * fragment and rendering it with loading/error states. The base shell stays pure.
 *
 * Mirrors the Vue `ProjectModal.vue` API.
 */
export function ProjectModal({
  open,
  onClose,
  slug,
  repo,
  projectBasePath = '/projects',
  showRepoAction = true,
  repoLabel = 'View on GitHub',
  loadingText = 'Loading...',
  errorText = 'Could not load project details.',
  contentSelector = '.project-fullpage-body',
  className = '',
  headerActionsRight,
}: ProjectModalProps) {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);
  const [content, setContent] = React.useState('');

  const pageUrl = `${projectBasePath}/${slug}`;

  React.useEffect(() => {
    if (!open) return;

    let cancelled = false;
    setLoading(true);
    setError(false);

    (async () => {
      try {
        // Try the clean URL first (dev server), fall back to .html (static deploy).
        let res = await fetch(pageUrl);
        if (!res.ok) res = await fetch(`${pageUrl}.html`);
        if (!res.ok) throw new Error('Failed to fetch');

        const html = await res.text();
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const bodyEl = doc.querySelector(contentSelector);

        if (cancelled) return;

        if (bodyEl) {
          setContent(
            bodyEl.innerHTML
              // Strip framework component tags that won't hydrate inside raw HTML.
              .replace(/<\/?GlitchLink[^>]*>/g, '')
              .replace(/<\/?LotusGlitchLink[^>]*>/g, '')
              .replace(/<YouTubeEmbeds\s*\/?>/g, ''),
          );
        } else {
          const mainEl =
            doc.querySelector('.vp-doc > div') ||
            doc.querySelector('.content-container') ||
            doc.querySelector('.VPDoc .content');
          setContent(mainEl?.innerHTML || '<p>Could not extract content.</p>');
        }
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [open, pageUrl, contentSelector]);

  const headerActionsLeft =
    showRepoAction && repo ? (
      <a
        className="lotus-btn"
        href={repo}
        target="_blank"
        rel="noopener noreferrer"
      >
        {repoLabel} &rarr;
      </a>
    ) : null;

  const signature = (
    <>
      Fetched from GitHub —{' '}
      <a href={repo || pageUrl} target="_blank" rel="noopener noreferrer">
        source
      </a>
    </>
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      className={className}
      headerActionsLeft={headerActionsLeft}
      headerActionsRight={
        <>
          <a className="lotus-btn" href={pageUrl}>
            Open full page
          </a>
          {headerActionsRight}
        </>
      }
      signature={signature}
    >
      {loading ? (
        <div className="lotus-modal-loading">{loadingText}</div>
      ) : error ? (
        <div className="lotus-modal-error">{errorText}</div>
      ) : (
        <div
          className="lotus-project-content"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      )}
    </Modal>
  );
}

export default ProjectModal;
