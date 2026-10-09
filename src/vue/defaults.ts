/**
 * Default data for opinionated components. Kept in a separate module so the
 * `withDefaults` factories in Nav.vue / Footer.vue can reference them: Vue's
 * `defineProps()` is hoisted and may only reference imported bindings, not
 * other module-scope variables declared in the same SFC.
 */
import type { Component } from 'vue';
import { SiGithub, SiInstagram, SiYoutube } from 'vue-simple-icons';
import { Linkedin } from 'lucide-vue-next';

export interface NavLinkItem {
  name: string;
  href: string;
  position?: 'left' | 'right';
}

export interface FooterLink {
  href: string;
  label: string;
  icon: Component;
}

export const DEFAULT_NAV_LINKS: NavLinkItem[] = [
  { name: 'Home', href: '/', position: 'left' },
  { name: 'About', href: '/about', position: 'left' },
  { name: 'Programming', href: '/programming', position: 'right' },
  { name: 'Motion Graphics', href: '/motion_graphics', position: 'right' },
];

export const DEFAULT_FOOTER_LINKS: FooterLink[] = [
  { href: 'https://github.com/JDLanyon', icon: SiGithub, label: 'GitHub' },
  { href: 'https://www.linkedin.com/in/jdlanyon/', icon: Linkedin, label: 'LinkedIn' },
  { href: 'https://www.youtube.com/@sausytime', icon: SiYoutube, label: 'YouTube' },
  { href: 'https://www.instagram.com/sausytime/', icon: SiInstagram, label: 'Instagram' },
];
