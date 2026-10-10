// `vue-simple-icons` ships no type declarations. Declare the icons we use so
// the Footer type-checks without pulling the package's (missing) types.
// v7 exports *Icon-suffixed names (the `Si*` prefix is the React package's).
declare module 'vue-simple-icons' {
  import type { Component } from 'vue';
  export const GitHubIcon: Component;
  export const InstagramIcon: Component;
  export const YouTubeIcon: Component;
}
