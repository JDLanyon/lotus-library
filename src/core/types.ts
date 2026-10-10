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

/* -------------------------------------------------------------------------- *
 * Adapters — the boundary that keeps the React and Vue builds free of any hard
 * dependency on Next.js, VitePress or a router. Components that render a link
 * or image, or that read the current pathname, do so through these contracts.
 * -------------------------------------------------------------------------- */

/** Minimal structural description of an anchor-like element. */
export interface LinkProps {
  href: string;
  children?: unknown;
  className?: string;
  target?: string;
  rel?: string;
  download?: boolean | string;
  onClick?: (event: unknown) => void;
  onMouseEnter?: (event: unknown) => void;
  [key: string]: unknown;
}

/** Minimal structural description of an image-like element. */
export interface ImageProps {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
  [key: string]: unknown;
}

/**
 * A renderer is opaque to core: it is whatever the host framework uses to
 * produce an element (a React component, a Vue component object, etc.). Core
 * only carries it around and never inspects it, so the type is intentionally
 * widened to `unknown`; each framework package casts it to its own concrete
 * component type. The phantom `P` keeps the intended prop shape documented.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type ElementRenderer<_P = unknown> = unknown;

/** Navigation surface used by modal-like components to dismiss themselves. */
export interface LotusRouter {
  /** Navigate forward in history. */
  push: (href: string) => void;
  /** Navigate back in history. */
  back: () => void;
  /** Re-fetch the current route's data. */
  refresh: () => void;
}

/** Contract every host adapter must satisfy. */
export interface LotusAdapter {
  /** Renderer used in place of a raw `<a>`. Defaults to a DOM anchor. */
  Link: ElementRenderer<LinkProps>;
  /** Renderer used in place of a raw `<img>`. Defaults to a DOM image. */
  Image: ElementRenderer<ImageProps>;
  /** Returns the current pathname, or '' when unavailable. */
  usePathname: () => string;
  /** Returns a router used to dismiss modals, or null when unavailable. */
  useRouter: () => LotusRouter | null;
}

/* -------------------------------------------------------------------------- *
 * Component prop shapes shared by the React and Vue bindings.
 *
 * Conventions (kept identical across React + Vue, enforced in review):
 * - Prop names are camelCase and match exactly between frameworks (`tabIndex`,
 *   not `tabindex`).
 * - Content convention: components that render a single labelled control take
 *   a slot/children (`Button`, `Card`, `GlitchLink`) and ALSO accept a `text`
 *   prop as a fallback when no children are supplied (`GlitchLink`, `Button`
 *   via `text`). Prefer children/slot; `text` exists for data-driven callers.
 * - Links/buttons converge on one mechanism: native `<a>` by default, with a
 *   `linkComponent` override for host routers (Next `Link`, vue-router). Do
 *   not introduce a third linking pattern.
 * -------------------------------------------------------------------------- */

/** A dated, tagged entry rendered as a Card. */
export interface CardProps {
  /** Card heading. */
  title: string;
  /** Optional formatted date shown top-right. */
  date?: string;
  /** Optional body copy. */
  description?: string;
  /** Category tags rendered as chips. */
  tags?: string[];
  /** Prepend `#` to each tag. */
  hashTags?: boolean;
  /** Root tabindex (default 0). */
  tabIndex?: number;
  /** ARIA role for the card root. */
  role?: string;
  /** ARIA label for the card root. */
  ariaLabel?: string;
  /** Extra class(es) appended to `.lotus-card`. */
  className?: string;
  /**
   * Layout preset. `'auto'` (content width, default), `'full'` (stretch to the
   * container) or `'compact'` (tighter padding). Rendered as
   * `.lotus-card--<size>`.
   */
  size?: 'auto' | 'full' | 'compact';
  /** Stretch to the height of the grid row (equal-height grid cards). */
  fill?: boolean;
  /**
   * When set, the whole card navigates here. Rendered as an anchor (or the
   * host `linkComponent`), reusing the same mechanism as GlitchLink/Button.
   */
  href?: string;
  /**
   * Override the anchor element/component when `href` is set. Strings map to
   * native tags; pass the host router Link for SPA routing; `object` covers
   * component objects (React/Vue).
   */
  linkComponent?: string | object;
  /* --- Media (parity with Panel; see resolveThumbnail in core/utils) --- */
  /** Thumbnail filename (e.g. "thumbnail.png") or absolute URL. */
  thumbnail?: string;
  /** Base path prepended to `thumbnail` for locally-stored assets. */
  thumbnailPath?: string;
  /**
   * Identifier used by `thumbnailDefaultsId` to build the media path. Cards
   * without an explicit id fall back to the title. CardGrid passes the item's
   * `slug` here automatically.
   */
  slug?: string;
  /**
   * When true, the resolved path includes the card's `slug` as a segment:
   * `${thumbnailPath}/${slug}/${thumbnail ?? defaultThumbnail}`.
   */
  thumbnailDefaultsId?: boolean;
  /** Filename used when `thumbnail` is omitted (with `thumbnailDefaultsId`). Default "thumbnail.png". */
  defaultThumbnail?: string;
  /** Alt text for the media image. Defaults to `title`. */
  thumbnailAlt?: string;
  /** Convert the thumbnail with the host adapter's Image (Next <Image> etc). Default true when an adapter exists. */
  adapterImage?: boolean;
  /**
   * Fixed aspect ratio for the media area, e.g. "16/9", "1/1". A media
   * concern (the component owns its own image box) — not a layout concern.
   */
  aspect?: string;
}

/** A thin card entry for CardGrid: a grid of Cards + one shared detail modal. */
export interface ProjectCardData {
  /** Stable identifier; also the detail slug forwarded to ProjectModal. */
  slug: string;
  title: string;
  description?: string;
  tags?: string[];
  /** Repository URL shown in the detail modal. */
  repo?: string;
  /** When set, the card links here instead of opening the detail modal. */
  url?: string;
  /** Formatted date shown top-right. */
  date?: string;
  /* Media, forwarded to the Card */
  thumbnail?: string;
  thumbnailPath?: string;
  thumbnailDefaultsId?: boolean;
  defaultThumbnail?: string;
  thumbnailAlt?: string;
  aspect?: string;
  /** Optional grouping hint (e.g. 'featured' | 'uni' | 'snippets'). Host-facing data only — the library does not group. */
  category?: string;
}

/** A row of tag chips. */
export interface TagsListProps {
  tags?: string[];
  /** Extra class(es) appended to `.lotus-tags`. */
  className?: string;
}

/** A hover tooltip wrapping arbitrary content. */
export interface TooltipProps {
  /** Tooltip text. */
  text: string;
  /** Extra class(es) appended to `.lotus-tooltip`. */
  className?: string;
}

/** Cycling typewriter heading. */
export interface TypeWriterProps {
  /** Headings to cycle through, in order. */
  headings: string[];
  /** Typing speed in words-per-minute. Default: 240. */
  speed?: number;
  /** Pause after a heading is fully typed (ms). Default: 4000. */
  delayBetweenHeadings?: number;
  /** Extra class(es) appended to `.lotus-typewriter`. */
  className?: string;
}

/* -------------------------------------------------------------------------- *
 * Glitch — shared, framework-agnostic prop shapes and constants.
 * -------------------------------------------------------------------------- */

export type GlitchPhase = 'idle' | 'easeIn' | 'active' | 'easeOut';

export interface GlitchProps {
  /** When provided, the component cycles through these instead of children. */
  names?: string[];
  duration?: number;
  delay?: number;
  variance?: number;
  glitchCountForFlash?: number;
  glitchIntensity?: number;
  className?: string;
  /** Probability (0..1) of permanently switching to the alt name. */
  nameSwitchProbability?: number;
  /** Reserve the width of the widest name to avoid layout shift. */
  preserveSpace?: boolean;
  onGlitchComplete?: () => void;
}

export interface GlitchLinkProps {
  href: string;
  className?: string;
  underlineDuration?: number;
  glitchIntensity?: number;
  /** Minimum ms between triggers. */
  cooldown?: number;
}

/** Color layer definition shared by the chromatic aberration effect. */
export interface ChromaColor {
  name: string;
  value: string;
  x: number;
  y: number;
  blend: 'screen' | 'difference';
}
