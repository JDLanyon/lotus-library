<!-- lotus-library — Footer.vue
  Site footer: a row of social links plus a theme switch. Opinionated by design
  — it references Jackson by default and can be overridden via `links`.

  NOTE: `vue-simple-icons` (social glyphs) and `lucide-vue-next` (theme glyphs)
  are OPTIONAL peer dependencies. Only hosts that render <Footer> need them.
-->
<template>
  <footer :class="['lotus-footer', { 'is-landing': landingPage }, className]">
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

    <Tooltip :text="tooltipText">
      <Button aria-label="Toggle theme" @click="cycleTheme">
        <component :is="icon" />
      </Button>
    </Tooltip>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Circle, Moon, SunMoon } from 'lucide-vue-next';
import { useAdapter } from './adapter';
import { useTheme, useMounted } from './theme';
import { DEFAULT_FOOTER_LINKS, type FooterLink } from './defaults';
import Button from './Button.vue';
import Tooltip from './Tooltip.vue';

export type { FooterLink };

withDefaults(
  defineProps<{
    landingPage?: boolean;
    links?: FooterLink[];
    className?: string;
  }>(),
  {
    landingPage: false,
    links: () => DEFAULT_FOOTER_LINKS,
    className: '',
  },
);

const { Link } = useAdapter();
const { theme, setTheme } = useTheme();
const mounted = useMounted();

const cycleTheme = () => {
  if (theme.value === 'light') setTheme('dark');
  else if (theme.value === 'dark') setTheme('system');
  else setTheme('light');
};

const icon = computed(() => {
  if (!mounted.value) return Circle;
  if (theme.value === 'light') return Circle;
  if (theme.value === 'dark') return Moon;
  return SunMoon;
});

const tooltipText = computed(() => {
  if (!mounted.value) return 'Light mode';
  if (theme.value === 'light') return 'Light mode';
  if (theme.value === 'dark') return 'Dark mode';
  return 'System theme';
});
</script>
