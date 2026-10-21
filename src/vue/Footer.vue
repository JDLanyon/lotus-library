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
      <component
        :is="Link"
        v-for="s in leftLinks"
        :key="s.href"
        :href="s.href"
        target="_blank"
        rel="noopener noreferrer"
        class="lotus-footer-link"
      >
        <component :is="s.icon" color="var(--lotus-secondary)" />
        <span class="lotus-footer-label">{{ s.label }}</span>
      </component>

      <Tooltip v-if="!hideLogo" :text="logoLabel">
        <component
          :is="Link"
          :href="logoHref"
          target="_blank"
          rel="noopener noreferrer"
          class="lotus-footer-logo"
          :aria-label="logoLabel"
          @mouseenter="logoRef?.glitch()"
          @focus="logoRef?.glitch()"
        >
          <Glitch ref="logoRef" :auto-glitch="false" :duration="260">
            <LotusIcon :src="logoSrc" alt="" :width="40" :height="40" class="lotus-footer-logo-img" />
          </Glitch>
        </component>
      </Tooltip>

      <component
        :is="Link"
        v-for="s in rightLinks"
        :key="s.href"
        :href="s.href"
        target="_blank"
        rel="noopener noreferrer"
        class="lotus-footer-link"
      >
        <component :is="s.icon" color="var(--lotus-secondary)" />
        <span class="lotus-footer-label">{{ s.label }}</span>
      </component>

      <slot name="extra" />
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue';
import { useAdapter } from './adapter';
import { DEFAULT_FOOTER_LINKS, type FooterLink } from './defaults';
import Glitch from './glitch/Glitch.vue';
import LotusIcon from './LotusIcon.vue';
import Tooltip from './Tooltip.vue';
export type { FooterLink };

const props = withDefaults(
  defineProps<{
    landingPage?: boolean;
    links?: FooterLink[];
    className?: string;
    /** @deprecated Footers are glitchless by design; accepted and ignored. */
    glitchLinks?: boolean;
    /** Centre lotus glyph: where it links to. Defaults to the portfolio. */
    logoHref?: string;
    /** Accessible name + tooltip text for the centre lotus. */
    logoLabel?: string;
    /** Lotus image source. */
    logoSrc?: string;
    /** Hide the centre lotus entirely. */
    hideLogo?: boolean;
  }>(),
  {
    landingPage: false,
    links: () => DEFAULT_FOOTER_LINKS,
    className: '',
    glitchLinks: false,
    logoHref: 'https://jdlanyon.dev',
    logoLabel: 'jdlanyon.dev — portfolio',
    logoSrc: '/lotus.svg',
    hideLogo: false,
  },
);

const { Link } = useAdapter();
const logoRef = useTemplateRef<{ glitch: () => void }>('logoRef');

// Split the row so the lotus lands in the visual centre regardless of how many
// links there are. With N links the glyph goes after ceil(N/2).
const leftLinks = computed(() => props.links.slice(0, Math.ceil(props.links.length / 2)));
const rightLinks = computed(() => props.links.slice(Math.ceil(props.links.length / 2)));
</script>

