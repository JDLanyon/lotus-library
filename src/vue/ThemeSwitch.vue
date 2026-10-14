<!-- lotus-library — ThemeSwitch.vue
  Standalone theme switch: cycles `light → dark → system` through whatever
  ThemeController is provided (host `next-themes`, or the default `data-theme`
  controller). Extracted from <Footer> so hosts can place the toggle wherever
  their layout requires.

  NOTE: `lucide-vue-next` (theme glyphs) is an OPTIONAL peer dependency. Only
  hosts that render <ThemeSwitch> need it.
-->
<template>
  <Tooltip :text="tooltipText">
    <Button :aria-label="ariaLabel" :class="className" @click="cycleTheme">
      <component :is="icon" />
    </Button>
  </Tooltip>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Circle, Moon, SunMoon } from 'lucide-vue-next';
import { useTheme, useMounted } from './theme';
import Button from './Button.vue';
import Tooltip from './Tooltip.vue';

withDefaults(
  defineProps<{
    className?: string;
    ariaLabel?: string;
  }>(),
  {
    className: '',
    ariaLabel: 'Toggle theme',
  },
);

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
