<!-- lotus-library — Footer.vue
  Site footer: an optional site-content slot (default) above a centered,
  wrapping row of social links plus an optional inline `extra` slot (e.g. a
  theme toggle). Opinionated by design — it references Jackson by default and
  can be overridden via `links`.

  Slots:
    default -> rendered ABOVE the links row (site-specific content)
    extra   -> rendered NEXT TO the links, inside the same row
  NOTE: `vue-simple-icons` (social glyphs) is an OPTIONAL peer dependency. Only
  hosts that render <Footer> need it.
-->
<template>
  <footer :class="['lotus-footer', { 'is-landing': landingPage }, className]">
    <slot />
    <div class="lotus-footer-row">
    <template v-if="glitchLinks">
      <GlitchLink
        v-for="s in links"
        :key="s.href"
        :href="s.href"
        :link-component="Link"
        class="lotus-footer-link"
      >
        <component :is="s.icon" color="var(--lotus-secondary)" />
        <p>{{ s.label }}</p>
      </GlitchLink>
    </template>
    <template v-else>
      <component
        :is="Link"
        v-for="s in links"
        :key="s.href"
        :href="s.href"
        target="_blank"
        rel="noopener noreferrer"
        class="lotus-footer-link"
      >
        <component :is="s.icon" color="var(--lotus-secondary)" />
        <p>{{ s.label }}</p>
      </component>
    </template>
      <slot name="extra" />
    </div>
  </footer>
</template>

<script setup lang="ts">
import { useAdapter } from './adapter';
import { DEFAULT_FOOTER_LINKS, type FooterLink } from './defaults';
import GlitchLink from './GlitchLink.vue';
export type { FooterLink };

withDefaults(
  defineProps<{
    landingPage?: boolean;
    links?: FooterLink[];
    className?: string;
    /** Render social links via <GlitchLink>. Default false. */
    glitchLinks?: boolean;
  }>(),
  {
    landingPage: false,
    links: () => DEFAULT_FOOTER_LINKS,
    className: '',
    glitchLinks: false,
  },
);

const { Link } = useAdapter();
</script>

