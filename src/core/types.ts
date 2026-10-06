/**
 * lotus-library — shared types
 *
 * Framework-agnostic types used by both the React and Vue bindings so the two
 * implementations stay in lock-step.
 */

/** A single piece of work rendered as a Panel (image + copy + tags). */
export interface PanelData {
  /** Stable identifier, also used to build the detail link. */
  id: string;
  /** Display title. Falls back to `id` when omitted. */
  title?: string;
  /** Short marketing copy shown under the title. */
  description?: string;
  /** Thumbnail filename (e.g. "thumbnail.png") or absolute URL. */
  thumbnail?: string;
  /** Base path prepended to `thumbnail` for locally-stored assets. */
  thumbnailPath?: string;
  /** Link target. Defaults to `${basePath}/${id}` when not provided. */
  href?: string;
  /** Tech / category tags rendered as pills. */
  tags?: string[];
}

/** Grid container that lays out a collection of panels. */
export interface PanelGroup {
  /** Optional anchor id for in-page navigation. */
  id?: string;
  /** Optional heading rendered above the grid. */
  heading?: string;
  /** Shared base path for all panel links in this group. */
  basePath?: string;
  /** Shared thumbnail base path for all panels in this group. */
  thumbnailPath?: string;
  /** The panels to render. */
  panels: PanelData[];
}

/** Direction glyph appended to a Button label. */
export type ButtonArrow = 'left' | 'right' | 'up' | 'down';
