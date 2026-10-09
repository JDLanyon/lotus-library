/**
 * lotus-library — shared adapter helpers.
 *
 * Framework-agnostic predicates used by both the React and Vue adapter
 * implementations so that link/image behaviour stays in lock-step.
 */

/** True for absolute URLs, protocol-relative URLs, mailto: and tel: links. */
export function isExternalHref(href: string): boolean {
  return (
    /^(https?:)?\/\//.test(href) ||
    href.startsWith('mailto:') ||
    href.startsWith('tel:')
  );
}
