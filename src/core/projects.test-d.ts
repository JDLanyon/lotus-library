import { describe, expectTypeOf, it } from 'vitest';
import type {
  FlexRowSection,
  ImageRowSection,
  ImageSection,
  ParsedProject,
  ProjectSection,
  TextSection,
} from './projects';

/**
 * Type-level tests for the shared project model. These run under
 * `vitest --typecheck` and guard the discriminated union that both the React
 * and Vue renderers switch over.
 *
 * (File is named `*.test-d.ts` so vitest picks it up for typechecking only.)
 */
describe('project section model', () => {
  it('discriminates ProjectSection by `type`', () => {
    expectTypeOf<ProjectSection['type']>().toEqualTypeOf<
      | 'heading'
      | 'warnings'
      | 'github_button'
      | 'embed'
      | 'image'
      | 'image_row'
      | 'text'
      | 'flex_row'
    >();
  });

  it('ImageSection is assignable to an image shape with src/width', () => {
    // Structural assignability (extra optional `alt` is fine).
    expectTypeOf<ImageSection>().toMatchTypeOf<{
      type: 'image';
      src: string;
      width?: string;
    }>();
  });

  it('FlexRowSection only allows leaf (non-nested) sections', () => {
    expectTypeOf<FlexRowSection['sections'][number]>().toEqualTypeOf<
      ImageSection | TextSection
    >();
    // A FlexRowSection must not itself be a flex-row child (no nesting).
    expectTypeOf<FlexRowSection>().not.toMatchTypeOf<
      FlexRowSection['sections'][number]
    >();
  });

  it('ImageRowSection carries an images array', () => {
    expectTypeOf<ImageRowSection['images']>().toEqualTypeOf<
      Array<{ src: string; alt?: string; width?: string }>
    >();
  });

  it('ParsedProject pairs meta with a section list', () => {
    expectTypeOf<ParsedProject>().toMatchTypeOf<{
      meta: { id: string; title: string };
      sections: ProjectSection[];
    }>();
  });
});
