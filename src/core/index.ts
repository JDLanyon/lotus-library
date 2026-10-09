/**
 * lotus-library — core barrel.
 *
 * Framework-agnostic surface: prop types, the adapter contract, pure helpers,
 * the glitch constants and the project content model. Components in the React
 * and Vue packages import from here (via relative paths) so the two builds
 * share one source of truth.
 */

export * from './types';
export * from './adapter';
export * from './utils';
export * from './markdown';
export * from './glitch';
export * from './projects';
