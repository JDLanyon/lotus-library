<!-- lotus-library — Nav.vue
  Top navigation bar. Centred logo with links split left/right, plus a slide-in
  mobile drawer. Link rendering goes through the adapter (so a host routes via
  vue-router / Nuxt); active-link styling uses the adapter pathname.

  NOTE: `lucide-vue-next` (menu/close glyphs) is an OPTIONAL peer dependency.
  Only hosts that render <Nav> need to install it.
-->
<template>
  <nav :aria-label="ariaLabel" :class="['lotus-nav', className]">
    <div class="lotus-nav-group lotus-nav-group-left">
      <component
        :is="renderLink(l)"
        v-for="l in links.filter((x) => x.position === 'left')"
        :key="l.href"
      />
    </div>

    <component :is="Link" href="/" class="lotus-nav-logo">
      <component :is="Image" :class="logoClasses" :src="logoSrc" :width="64" :height="64" alt="lotus" />
    </component>

    <div class="lotus-nav-group lotus-nav-group-right">
      <component
        :is="renderLink(l)"
        v-for="l in links.filter((x) => x.position === 'right')"
        :key="l.href"
      />
    </div>

    <div class="lotus-nav-mobile-toggle">
      <button
        type="button"
        class="lotus-nav-icon-btn"
        aria-label="Open menu"
        :aria-expanded="isMenuOpen"
        @click="toggleMenu"
      >
        <Menu color="var(--lotus-secondary)" />
      </button>

      <div :class="['lotus-nav-drawer', { 'is-open': isMenuOpen }]" :aria-hidden="!isMenuOpen">
        <div class="lotus-nav-drawer-head">
          <button type="button" class="lotus-nav-icon-btn" aria-label="Close menu" @click="toggleMenu">
            <X color="var(--lotus-secondary)" />
          </button>
        </div>
        <div class="lotus-nav-drawer-body">
          <component :is="renderLink(l, toggleMenu)" v-for="l in links" :key="l.href" />
          <slot />
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed, h, ref } from 'vue';
import { Menu, X } from 'lucide-vue-next';
import { useAdapter } from './adapter';
import GlitchLink from './GlitchLink.vue';
import { DEFAULT_NAV_LINKS, type NavLinkItem } from './defaults';

export type { NavLinkItem };

const props = withDefaults(
  defineProps<{
    links?: NavLinkItem[];
    logoSrc?: string;
    ariaLabel?: string;
    /** Layout variant. v0.1.6 ships 'classic' only. */
    layout?: 'classic';
    className?: string;
    /** Render nav links via <GlitchLink>. Default false. */
    glitchLinks?: boolean;
    /** Class(es) applied to the logo <img>. */
    logoClassName?: string;
    /** Invert the logo on dark themes. Default true. */
    logoInvert?: boolean;
  }>(),
  {
    links: () => DEFAULT_NAV_LINKS,
    logoSrc: '/lotus.svg',
    ariaLabel: 'Primary',
    layout: 'classic',
    className: '',
    glitchLinks: false,
    logoClassName: '',
    logoInvert: true,
  },
);

const { Link, Image, usePathname } = useAdapter();
const pathname = usePathname();
const isMenuOpen = ref(false);
const toggleMenu = () => (isMenuOpen.value = !isMenuOpen.value);

const logoClasses = computed(() =>
  [
    'lotus-nav-logo-img',
    !props.logoInvert ? 'lotus-nav-logo-img--no-invert' : '',
    props.logoClassName,
  ]
    .filter(Boolean)
    .join(' '),
);

function renderLink(l: NavLinkItem, onClick?: () => void) {
  const isActive = pathname === l.href;
  const linkClass = ['lotus-nav-link', isActive ? 'is-active' : ''];

  if (props.glitchLinks) {
    return h(
      GlitchLink,
      {
        href: l.href,
        onClick,
        class: linkClass,
        linkComponent: Link,
      },
      () => l.name,
    );
  }

  return h(
    Link,
    {
      href: l.href,
      rel: 'noopener noreferrer',
      onClick,
      class: linkClass,
    },
    () => l.name,
  );
}
</script>
