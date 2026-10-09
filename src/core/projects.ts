/**
 * Project content model shared by the React and Vue project renderers.
 *
 * A `ParsedProject` is the structured form of a project page: a small `meta`
 * block plus an ordered list of typed `sections`. The parsers live in the
 * consuming app (they read the source markdown/HTML); the library only renders
 * the parsed shape, so the same project renders identically in React and Vue.
 */

export interface ProjectMeta {
  id: string;
  title: string;
  category?: string;
  repo?: string;
  extra?: string;
}

export type ProjectSection =
  | HeadingSection
  | WarningsSection
  | GitHubButtonSection
  | EmbedSection
  | ImageSection
  | ImageRowSection
  | TextSection
  | FlexRowSection;

export interface HeadingSection {
  type: 'heading';
  text: string;
}
export interface WarningsSection {
  type: 'warnings';
}
export interface GitHubButtonSection {
  type: 'github_button';
  href: string;
}
export interface EmbedSection {
  type: 'embed';
  uuid: string;
}
export interface ImageSection {
  type: 'image';
  src: string;
  alt?: string;
  width?: string;
}
export interface ImageRowSection {
  type: 'image_row';
  images: Array<{ src: string; alt?: string; width?: string }>;
}
export interface TextSection {
  type: 'text';
  content: string;
  width?: string;
}
export interface FlexRowSection {
  type: 'flex_row';
  sections: Array<ImageSection | TextSection>;
}

export interface ParsedProject {
  meta: ProjectMeta;
  sections: ProjectSection[];
}
