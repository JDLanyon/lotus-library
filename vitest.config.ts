import { defineConfig } from 'vitest/config';

/**
 * Unit tests for the framework-agnostic core (markdown parsing, URL/adapter
 * helpers, shared helpers, glitch maths) plus type-level guards on the project
 * model. The core has no DOM or framework dependency, so the fast `node`
 * environment is all that's needed.
 */
export default defineConfig({
  test: {
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    typecheck: {
      include: ['src/**/*.test-d.ts'],
      tsconfig: './tsconfig.json',
    },
  },
});
