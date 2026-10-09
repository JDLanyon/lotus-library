import { describe, expect, it } from 'vitest';
import { isExternalHref } from './adapter';

describe('isExternalHref', () => {
  it.each([
    'https://example.com',
    'http://example.com',
    '//cdn.example.com/asset.png',
    'mailto:hi@example.com',
    'tel:+61123456789',
  ])('treats %s as external', (href) => {
    expect(isExternalHref(href)).toBe(true);
  });

  it.each(['/', '/about', 'about', '#section', '/a/b?c=d', './relative'])(
    'treats %s as internal',
    (href) => {
      expect(isExternalHref(href)).toBe(false);
    },
  );
});
