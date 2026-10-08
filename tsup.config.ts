import { defineConfig } from 'tsup';
import vue from 'esbuild-plugin-vue-next';
import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync } from 'node:fs';
import { resolve, dirname } from 'node:path';

/**
 * Ensure an emitted bundle starts with a `"use client"` directive.
 * esbuild strips per-file directives while bundling, so we re-add it here.
 */
function withUseClient(file: string): void {
  if (!existsSync(file)) return;
  const src = readFileSync(file, 'utf-8');
  if (/^\s*['"]use client['"]/.test(src)) return;
  writeFileSync(file, `'use client';\n${src}`);
}

/**
 * Build the React and Vue entry points, then concatenate the core + component
 * CSS into a single dist/lotus.css for one-line theming.
 */
export default defineConfig([
  {
    entry: { 'react/index': 'src/react/index.ts' },
  format: ['esm', 'cjs'],
    tsconfig: './tsconfig.build.json',
    dts: { compilerOptions: { incremental: false, noEmit: false, emitDeclarationOnly: true, declaration: true } },
    clean: true,
  splitting: false,
  sourcemap: true,
  treeshake: true,
    external: ['react', 'react-dom'],
  esbuildOptions(options) {
    options.loader = { ...options.loader, '.css': 'empty' };
  },
  // The React entry contains client-only components ('use client' in source).
  // tsup/esbuild drops per-file directives when bundling, so re-emit the banner
  // on the emitted bundles — otherwise a Next server component that imports the
  // library evaluates it in the RSC runtime and crashes (React.useRef undefined).
  async onSuccess() {
    withUseClient(resolve('dist/react/index.js'));
    withUseClient(resolve('dist/react/index.cjs'));
    console.log('\u2713 added "use client" banner to dist/react');
  },
  },
  {
    entry: { 'vue/index': 'src/vue/index.ts' },
    format: ['esm', 'cjs'],
    dts: false,
    clean: false,
    splitting: false,
    sourcemap: false,
    treeshake: true,
    external: ['vue'],
    esbuildPlugins: [vue()],
  },
  {
    entry: { 'style-entry': 'src/core/style-entry.ts' },
    format: ['esm'],
    dts: false,
    clean: false,
    esbuildOptions(options) {
      options.loader = { ...options.loader, '.css': 'empty' };
      // Keep the placeholder bundle out of dist; only the CSS is shipped.
      options.outdir = '.tmp-style';
    },
    async onSuccess() {
      const files = [
        'src/core/theme.css',
        'src/core/components.css',
        'src/react/glitch/glitch.css',
        'src/vue/glitch.css',
      ];
      const out = files
        .filter((f) => existsSync(f))
        .map((f) => readFileSync(f, 'utf-8'))
        .join('\n\n');

      const dest = resolve('dist/lotus.css');
      mkdirSync(dirname(dest), { recursive: true });
      writeFileSync(dest, out);

      // Remove the temporary placeholder JS bundle.
      const tmp = resolve('.tmp-style');
      if (existsSync(tmp)) rmSync(tmp, { recursive: true, force: true });

      console.log('\u2713 built dist/lotus.css');
    },
  },
]);

