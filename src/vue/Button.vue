<!-- lotus-library — Button.vue
  Blocky button. Mirrors the React <Button> component.
  On hover the label plays the global glitch effect and the border fills with
  --primary (color-burn). Emits `click`; navigates via href (external links open
  in a new tab).
-->
<template>
  <component
    :is="href ? linkComponent : 'button'"
    :href="href || undefined"
    :type="href ? undefined : 'button'"
    :class="['lotus-btn', buttonClasses]"
    :title="title"
    :disabled="href ? undefined : disabled"
    :target="href && (targetBlank || isExternal) ? '_blank' : undefined"
    :rel="href && (targetBlank || isExternal) ? 'noopener noreferrer' : undefined"
    @mouseenter="triggerGlitch"
    @click="$emit('click', $event)"
  >
    <span v-if="arrow === 'left'" class="lotus-btn-arrow">&larr;</span>
    <span class="lotus-btn-text">
      <span class="glitch-text-wrap" :class="{ 'is-glitching': isGlitching }">
        <span class="glitch-base"><slot /></span>
        <span class="glitch-chroma glitch-chroma-r" aria-hidden="true"><slot /></span>
        <span class="glitch-chroma glitch-chroma-g" aria-hidden="true"><slot /></span>
        <span class="glitch-chroma glitch-chroma-b" aria-hidden="true"><slot /></span>
        <span class="glitch-chroma glitch-chroma-c" aria-hidden="true"><slot /></span>
        <span class="glitch-chroma glitch-chroma-m" aria-hidden="true"><slot /></span>
        <span class="glitch-chroma glitch-chroma-y" aria-hidden="true"><slot /></span>
        <span class="glitch-motion-blur" aria-hidden="true" />
      </span>
    </span>
    <span v-if="arrow && arrow !== 'left'" class="lotus-btn-arrow">{{ arrowGlyph }}</span>
  </component>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

type ArrowDir = 'left' | 'right' | 'up' | 'down'
type PadY = 'none' | 'sm' | 'md' | 'lg'

const props = defineProps({
  href: { type: String, default: undefined },
  targetBlank: { type: Boolean, default: false },
  arrow: { type: String as () => ArrowDir, default: undefined },
  title: { type: String, default: undefined },
  disabled: { type: Boolean, default: false },
  linkComponent: { type: String, default: 'a' },
  className: { type: String, default: '' },
  glitchCooldown: { type: Number, default: 400 },
  /** Render the 1px border. Default true. */
  border: { type: Boolean, default: true },
  /** Vertical padding preset. Default 'md'. */
  paddingY: { type: String as () => PadY, default: 'md' },
  /** Hover fills with the host background so dynamic backgrounds show through. */
  invertOnHover: { type: Boolean, default: false },
})
defineEmits<{ click: [event: MouseEvent] }>()

/** Composed modifier classes (variant + caller className). */
const buttonClasses = computed(() =>
  [
    props.invertOnHover ? 'lotus-btn--invert-hover' : '',
    !props.border ? 'lotus-btn--borderless' : '',
    props.paddingY !== 'md' ? `lotus-btn--pad-${props.paddingY}` : '',
    props.className,
  ]
    .filter(Boolean)
    .join(' '),
)

const ARROWS: Record<ArrowDir, string> = {
  left: '\u2190',
  right: '\u2192',
  up: '\u2191',
  down: '\u2193',
}

const arrowGlyph = computed(() => (props.arrow ? ARROWS[props.arrow] : ''))
const isExternal = computed(() => (props.href ? /^https?:\/\//.test(props.href) : false))

const isGlitching = ref(false)
const lastTrigger = ref(0)

function triggerGlitch() {
  const now = Date.now()
  if (now - lastTrigger.value < props.glitchCooldown) return
  lastTrigger.value = now
  isGlitching.value = true
  setTimeout(() => {
    isGlitching.value = false
  }, 350)
}
</script>
