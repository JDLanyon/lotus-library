// `vue-simple-icons` ships no type declarations. Declare the icons we use so
// the Footer type-checks without pulling the package's (missing) types.
declare module 'vue-simple-icons' {
  import type { Component } from 'vue';
  export const SiGithub: Component;
  export const SiInstagram: Component;
  export const SiYoutube: Component;
}
