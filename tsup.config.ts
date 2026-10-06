import { defineConfig } from 'tsup';
import vue from 'esbuild-plugin-vue-next';
import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync } from 'node:fs';
import { resolve, dirname } from 'node:path';

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

