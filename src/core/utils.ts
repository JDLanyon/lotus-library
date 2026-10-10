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

/**
 * Resolve a component thumbnail/media URL. Shared by Panel and Card in both
 * frameworks so the rules are defined exactly once.
 *
 * - Absolute (`http(s)://`, `//`) and root-relative (`/`) paths pass through.
 * - Otherwise the filename is joined onto `thumbnailPath`.
 * - When `defaultsToId` is set, the owner's `id`/`slug` is inserted as a path
 *   segment: `<thumbnailPath>/<id>/<thumbnail | defaultThumbnail>`.
 */
export function resolveThumbnail(
  thumbnail: string | undefined,
  thumbnailPath: string | undefined,
  id: string,
  defaultsToId = false,
  defaultThumbnail = 'thumbnail.png',
): string | undefined {
  if (thumbnail && (/^(https?:)?\/\//.test(thumbnail) || thumbnail.startsWith('/'))) {
    return thumbnail;
  }
  if (!thumbnailPath) return thumbnail;
  const base = thumbnailPath.replace(/\/$/, '');
  if (defaultsToId) {
    return `${base}/${id}/${thumbnail ?? defaultThumbnail}`;
  }
  if (!thumbnail) return undefined;
  return `${base}/${thumbnail}`;
}

