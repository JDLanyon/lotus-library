// Ambient declarations for the OPTIONAL icon peer dependencies.
//
// `lucide-react` and `@icons-pack/react-simple-icons` are only required by
// hosts that render <Nav> / <Footer>. Declaring the icons we import here means
// the library's declaration build type-checks even when those packages are not
// installed, while consumers who do install them get the real components.
declare module 'lucide-react' {
  import type { ComponentType, SVGProps } from 'react';
  export type LucideIcon = ComponentType<SVGProps<SVGSVGElement>>;
  export const Menu: LucideIcon;
  export const X: LucideIcon;
  export const Circle: LucideIcon;
  export const Moon: LucideIcon;
  export const SunMoon: LucideIcon;
  export const Linkedin: LucideIcon;
}

declare module '@icons-pack/react-simple-icons' {
  import type { ComponentType, SVGProps } from 'react';
  export type SimpleIcon = ComponentType<SVGProps<SVGSVGElement>>;
  export const SiGithub: SimpleIcon;
  export const SiInstagram: SimpleIcon;
  export const SiYoutube: SimpleIcon;
}
