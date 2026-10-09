// Ambient declaration for the OPTIONAL `lucide-vue-next` peer dependency.
//
// Only hosts that render <Nav> / <Footer> need to install it. Declaring the
// icons we import here lets the library's declaration build type-check without
// the package, while consumers who install it get the real components.
declare module 'lucide-vue-next' {
  import type { Component } from 'vue';
  export const Menu: Component;
  export const X: Component;
  export const Circle: Component;
  export const Moon: Component;
  export const SunMoon: Component;
  export const Linkedin: Component;
}
