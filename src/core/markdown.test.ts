import { describe, expect, it } from 'vitest';
import { parseInlineMarkdown } from './markdown';

describe('parseInlineMarkdown', () => {
  it('returns a single text token for plain text', () => {
    expect(parseInlineMarkdown('hello world')).toEqual([
      { type: 'text', value: 'hello world' },
    ]);
  });

  it('returns an empty array for an empty string', () => {
    expect(parseInlineMarkdown('')).toEqual([]);
  });

  it('parses bold', () => {
    expect(parseInlineMarkdown('a **b** c')).toEqual([
      { type: 'text', value: 'a ' },
      { type: 'bold', value: 'b' },
      { type: 'text', value: ' c' },
    ]);
  });

  it('parses italic', () => {
    expect(parseInlineMarkdown('a *b* c')).toEqual([
      { type: 'text', value: 'a ' },
      { type: 'italic', value: 'b' },
      { type: 'text', value: ' c' },
    ]);
  });

  it('parses links', () => {
    expect(parseInlineMarkdown('see [docs](https://x.test) now')).toEqual([
      { type: 'text', value: 'see ' },
      { type: 'link', value: 'docs', href: 'https://x.test' },
      { type: 'text', value: ' now' },
    ]);
  });

  it('parses bold before italic when they overlap', () => {
    // `**b**` must not be read as italic `*` wrapping `*b*`.
    expect(parseInlineMarkdown('**b**')).toEqual([{ type: 'bold', value: 'b' }]);
  });

  it('emits tokens in source order for mixed inline markup', () => {
    const tokens = parseInlineMarkdown('**a** and [b](c) and *d*');
    expect(tokens.map((t) => t.type)).toEqual([
      'bold',
      'text',
      'link',
      'text',
      'italic',
    ]);
    expect(tokens[2]).toMatchObject({ type: 'link', href: 'c' });
  });

  it('keeps unmatched marker characters as literal text', () => {
    expect(parseInlineMarkdown('3 * 4 = 12')).toEqual([
      { type: 'text', value: '3 * 4 = 12' },
    ]);
  });
});
