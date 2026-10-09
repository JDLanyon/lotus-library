import { describe, expect, it } from 'vitest';
import { deleteLastWord, formatDate, slugify } from './utils';

describe('slugify', () => {
  it('is lowercase, hyphenated and trimmed', () => {
    expect(slugify('Hello, World!')).toBe('hello-world');
  });

  it('collapses runs of non-alphanumerics to a single hyphen', () => {
    expect(slugify('a   ---   b')).toBe('a-b');
  });

  it('strips leading and trailing separators', () => {
    expect(slugify('  --Foo Bar--  ')).toBe('foo-bar');
  });

  it('handles an all-symbol string', () => {
    expect(slugify('!!!')).toBe('');
  });
});

describe('formatDate', () => {
  it('formats an ISO date as "D Month YYYY"', () => {
    expect(formatDate('2025-04-05')).toBe('5 April 2025');
  });

  it('accepts a Date instance', () => {
    expect(formatDate(new Date(2025, 3, 5))).toBe('5 April 2025');
  });
});

describe('deleteLastWord', () => {
  it('removes the last word', () => {
    expect(deleteLastWord('hello world')).toBe('hello');
  });

  it('removes the trailing word with its leading whitespace', () => {
    expect(deleteLastWord('hello   world')).toBe('hello');
  });

  it('returns an empty string when only one word remains', () => {
    expect(deleteLastWord('solo')).toBe('');
  });

  it('is a no-op on an empty string', () => {
    expect(deleteLastWord('')).toBe('');
  });
});
