/**
 * Fold the Vue SFC scoped CSS into dist/lotus.css.
 *
 * Vue SFCs with `<style scoped>` compile to hashed `data-v-*` rules, which tsup
 * extracts to dist/vue/index.css. Nothing imports that file (the components are
 * pre-compiled at build time, so there is no runtime CSS import), so without
 * this step Vue consumers importing `@jdlanyon/lotus-library/style.css` would
 * silently miss GlitchLink's scoped styles.
 *
 * This cannot live in tsup's `onSuccess`: tsup runs every config in the array
 * concurrently, and the Vue build (which emits the CSS) is still running when
 * the earlier hooks fire. It must therefore run AFTER tsup finishes — see the
 * `build:lib` script, which chains `tsup && node scripts/fold-vue-css.mjs`.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const VUE_CSS = resolve('dist/vue/index.css');
const LOTUS_CSS = resolve('dist/lotus.css');
const MARKER = '[data-v-';

if (!existsSync(LOTUS_CSS)) {
  console.error('✘ dist/lotus.css not found — did the style step run?');
  process.exit(1);
}

if (!existsSync(VUE_CSS)) {
  console.log('· no dist/vue/index.css to fold in (skipped)');
  process.exit(0);
}

const base = readFileSync(LOTUS_CSS, 'utf-8');

if (base.includes(MARKER)) {
  console.log('· Vue scoped CSS already present in dist/lotus.css (skipped)');
  process.exit(0);
}

writeFileSync(LOTUS_CSS, `${base}\n\n${readFileSync(VUE_CSS, 'utf-8')}`);
console.log('✓ folded Vue scoped CSS into dist/lotus.css');
