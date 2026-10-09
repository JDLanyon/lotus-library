/**
 * lotus-library — minimal inline-markdown parser.
 *
 * Parses the subset of inline markdown used in project pages (**bold**,
 * *italic*, [text](href)) into a token list. Each framework build maps tokens
 * to its own elements, so the parsing logic (and its tests) live here exactly
 * once and React/Vue stay in lock-step.
 */

export type InlineToken =
  | { type: 'text'; value: string }
  | { type: 'bold'; value: string }
  | { type: 'italic'; value: string }
  | { type: 'link'; value: string; href: string };

/**
 * Parse a subset of inline markdown (**bold**, *italic*, [text](href)) into a
 * token list. Tokens are returned in source order; unmatched text becomes
 * `text` tokens.
 */
export function parseInlineMarkdown(text: string): InlineToken[] {
  const parts: InlineToken[] = [];
  let remaining = text;

  const patterns: Array<{
    re: RegExp;
    make: (m: RegExpMatchArray) => InlineToken;
  }> = [
    { re: /\*\*(.+?)\*\*/, make: (m) => ({ type: 'bold', value: m[1] }) },
    {
      re: /(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/,
      make: (m) => ({ type: 'italic', value: m[1] }),
    },
    {
      re: /\[([^\]]+)\]\(([^)]+)\)/,
      make: (m) => ({ type: 'link', value: m[1], href: m[2] }),
    },
  ];

  while (remaining.length > 0) {
    const matches: Array<{ index: number; length: number; token: InlineToken }> =
      [];

    for (const { re, make } of patterns) {
      const m = remaining.match(re);
      if (m && m.index !== undefined) {
        matches.push({ index: m.index, length: m[0].length, token: make(m) });
      }
    }

    if (matches.length === 0) {
      parts.push({ type: 'text', value: remaining });
      break;
    }

    matches.sort((a, b) => a.index - b.index);
    const first = matches[0];

    if (first.index > 0) {
      parts.push({ type: 'text', value: remaining.slice(0, first.index) });
    }
    parts.push(first.token);
    remaining = remaining.slice(first.index + first.length);
  }

  return parts;
}
