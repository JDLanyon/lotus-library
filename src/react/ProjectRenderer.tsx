'use client';

import * as React from 'react';
import type {
  ParsedProject,
  ProjectSection,
  ImageSection,
  TextSection,
  ImageRowSection,
  FlexRowSection,
  HeadingSection,
  GitHubButtonSection,
  EmbedSection,
} from '../core/projects';
import type { ImageProps, LinkProps } from '../core/types';
import { parseInlineMarkdown } from '../core/markdown';
import { useAdapter } from './adapter';
import { Modal } from './Modal';
import { Embed } from './Embed';
import { Button } from './Button';

/** Map inline-markdown tokens to React nodes using the adapter's Link. */
function renderInlineMarkdown(
  text: string,
  LinkComponent: React.ComponentType<LinkProps>,
) {
  return parseInlineMarkdown(text).map((token, i) => {
    switch (token.type) {
      case 'bold':
        return <strong key={i}>{token.value}</strong>;
      case 'italic':
        return <em key={i}>{token.value}</em>;
      case 'link':
        return (
          <LinkComponent
            key={i}
            href={token.href}
            target="_blank"
            className="lotus-project-link"
          >
            {token.value}
          </LinkComponent>
        );
      default:
        return token.value;
    }
  });
}

function TextBlock({
  content,
  className,
  LinkComponent,
}: {
  content: string;
  className?: string;
  LinkComponent: React.ComponentType<LinkProps>;
}) {
  const lines = content.split('\n');
  return (
    <div className={className}>
      {lines.map((line, i) => {
        if (!line.trim()) return <br key={i} />;
        if (line.match(/^\s*[-*]\s/)) {
          return (
            <li key={i} className="lotus-project-li">
              {renderInlineMarkdown(line.replace(/^\s*[-*]\s/, ''), LinkComponent)}
            </li>
          );
        }
        if (line.startsWith('###')) {
          return (
            <h3 key={i}>
              {renderInlineMarkdown(line.replace(/^###\s*/, ''), LinkComponent)}
            </h3>
          );
        }
        if (line.startsWith('##')) {
          return (
            <h2 key={i}>
              {renderInlineMarkdown(line.replace(/^##\s*/, ''), LinkComponent)}
            </h2>
          );
        }
        return (
          <p key={i}>{renderInlineMarkdown(line, LinkComponent)}</p>
        );
      })}
    </div>
  );
}

function SectionRenderer({ section }: { section: ProjectSection }) {
  const { Image, Link } = useAdapter();
  const ImageComponent = Image as React.ComponentType<ImageProps>;
  const LinkComponent = Link as React.ComponentType<LinkProps>;

  switch (section.type) {
    case 'heading':
      return (
        <h1 className="lotus-project-heading">
          {(section as HeadingSection).text}
        </h1>
      );
    case 'warnings':
      return (
        <div className="lotus-project-warnings">
          <b>
            <p>*volume warning* - check volume before playing.</p>
            <p>*epilepsy warning* - flashing images.</p>
          </b>
        </div>
      );
    case 'github_button':
      return (
        <div className="lotus-project-github">
          <Button
            text="View on GitHub"
            href={(section as GitHubButtonSection).href}
            targetBlank
          />
        </div>
      );
    case 'embed':
      return (
        <div className="lotus-project-media">
          <Embed uuid={(section as EmbedSection).uuid} />
        </div>
      );
    case 'image': {
      const img = section as ImageSection;
      return (
        <ImageComponent
          className={`lotus-project-image ${img.width ?? 'is-full'}`}
          src={img.src}
          width={1000}
          height={1000}
          alt={img.alt || 'project image'}
        />
      );
    }
    case 'image_row': {
      const row = section as ImageRowSection;
      return (
        <div className="lotus-project-row">
          {row.images.map((img, i) => (
            <ImageComponent
              key={i}
              className={`lotus-project-image ${img.width ?? 'is-half'}`}
              src={img.src}
              width={1000}
              height={1000}
              alt={img.alt || `project image ${i + 1}`}
            />
          ))}
        </div>
      );
    }
    case 'text': {
      const txt = section as TextSection;
      return (
        <TextBlock
          content={txt.content}
          className={txt.width}
          LinkComponent={LinkComponent}
        />
      );
    }
    case 'flex_row': {
      const flex = section as FlexRowSection;
      return (
        <div className="lotus-project-row">
          {flex.sections.map((sub, i) => {
            if (sub.type === 'image') {
              const img = sub as ImageSection;
              return (
                <ImageComponent
                  key={i}
                  className={`lotus-project-image ${img.width ?? 'is-half'}`}
                  src={img.src}
                  width={1000}
                  height={1000}
                  alt={img.alt || 'project image'}
                />
              );
            }
            if (sub.type === 'text') {
              const txt = sub as TextSection;
              return (
                <TextBlock
                  key={i}
                  content={txt.content}
                  className={`lotus-project-cell ${txt.width ?? 'is-half'}`}
                  LinkComponent={LinkComponent}
                />
              );
            }
            return null;
          })}
        </div>
      );
    }
    default:
      return null;
  }
}

export interface ProjectRendererProps {
  /** The parsed project to render. */
  project: ParsedProject;
  /**
   * Render inside a <Modal> shell. Default true. Set false to render the
   * sections inline (e.g. on a full page).
   */
  modal?: boolean;
  /** Extra class(es) appended to the modal container. */
  className?: string;
}

/**
 * Renders a `ParsedProject` from its typed section list. By default it wraps
 * the content in the pure <Modal> shell; pass `modal={false}` to render inline.
 * The same section model is rendered by the Vue `ProjectRenderer.vue`.
 */
export function ProjectRenderer({
  project,
  modal = true,
  className = '',
}: ProjectRendererProps) {
  const body = (
    <div className="lotus-project-content">
      {project.sections.map((section, i) => (
        <SectionRenderer key={i} section={section} />
      ))}
    </div>
  );

  if (!modal) return body;

  return <Modal open onClose={() => {}} className={className}>{body}</Modal>;
}

export default ProjectRenderer;
