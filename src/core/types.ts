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
  /**
   * When true, the resolved thumbnail path includes the panel `id` as a path
   * segment: `${thumbnailPath}/${id}/${thumbnail ?? defaultThumbnail}`.
   * Use this to match layouts that store one thumbnail per panel folder.
   */
  thumbnailDefaultsId?: boolean;
  /**
   * Filename used for `thumbnail` when none is supplied (only meaningful when
   * `thumbnailDefaultsId` is on). Defaults to `"thumbnail.png"`.
   */
  defaultThumbnail?: string;
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
  /** Default for each panel's `thumbnailDefaultsId` (see PanelData). */
  thumbnailDefaultsId?: boolean;
  /** Default for each panel's `defaultThumbnail` (see PanelData). */
  defaultThumbnail?: string;
  /** The panels to render. */
  panels: PanelData[];
}

/** Direction glyph appended to a Button label. */
export type ButtonArrow = 'left' | 'right' | 'up' | 'down';

