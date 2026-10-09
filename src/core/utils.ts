/**
 * lotus-library — pure, framework-agnostic helpers.
 *
 * Anything placed here must not touch the DOM or a framework runtime so it can
 * be unit-tested and shared verbatim by the React and Vue builds.
 */

/** Convert display text to a URL-safe slug. */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/** Format a date as e.g. "5 April 2025" (en-AU). */
export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-AU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/** Delete the last word (and its leading whitespace) from a string. */
export function deleteLastWord(text: string): string {
  return text.replace(/\s*\S+$/, '');
}
