<!-- lotus-library — Button.vue
  Blocky button. Mirrors the React <Button> component.
  On hover the label plays the global glitch effect and the border fills with
  --primary (color-burn). Emits `click`; navigates via href (external links open
  in a new tab).

  NOTE: the root is rendered by two explicit branches — a native <button> when
  there is no `href`, and <component :is="linkComponent"> when there is. We do
  NOT use `<component :is="href ? linkComponent : 'button'">`: Vue's dynamic
  resolution is case-insensitive, so the lowercase tag `'button'` would resolve
  back to a globally-registered `Button` and recurse infinitely during SSR.
-->
<template>
  <button
    v-if="!href"
    type="button"
    :class="['lotus-btn', buttonClasses]"
    :title="title"
    :disabled="disabled"
    @mouseenter="triggerGlitch"
    @click="$emit('click', $event)"
  >
    <ButtonInner :arrow="arrow" :arrow-glyph="arrowGlyph" :is-glitching="isGlitching">
      <slot />
    </ButtonInner>
  </button>

  <component
    v-else
    :is="linkComponent"
    :href="href"
    :class="['lotus-btn', buttonClasses]"
    :title="title"
    :target="targetBlank || isExternal ? '_blank' : undefined"
    :rel="targetBlank || isExternal ? 'noopener noreferrer' : undefined"
    @mouseenter="triggerGlitch"
    @click="$emit('click', $event)"
  >
    <ButtonInner :arrow="arrow" :arrow-glyph="arrowGlyph" :is-glitching="isGlitching">
      <slot />
    </ButtonInner>
  </component>
</template>

<script setup lang="ts">
import { computed, h, ref, type Slots, type VNode } from 'vue'

type ArrowDir = 'left' | 'right' | 'up' | 'down'
type PadY = 'none' | 'sm' | 'md' | 'lg'

/**
 * Shared inner markup (arrows + glitch layers). A functional component so both
 * root branches render identical content; the default slot is forwarded once
 * to every glitch layer.
 */
const ButtonInner = (
  props: { arrow?: ArrowDir; arrowGlyph: string; isGlitching: boolean },
  { slots }: { slots: Slots },
) => {
  const { arrow, arrowGlyph, isGlitching } = props
  const render = (): VNode[] => slots.default?.() ?? []
  return [
    arrow === 'left' ? h('span', { class: 'lotus-btn-arrow' }, '\u2190') : null,
    h('span', { class: 'lotus-btn-text' }, [
      h(
        'span',
        { class: ['glitch-text-wrap', { 'is-glitching': isGlitching }] },
        [
          h('span', { class: 'glitch-base' }, render()),
          ...['r', 'g', 'b', 'c', 'm', 'y'].map((c) =>
            h(
              'span',
              { class: `glitch-chroma glitch-chroma-${c}`, 'aria-hidden': 'true' },
              render(),
            ),
          ),
          h('span', { class: 'glitch-motion-blur', 'aria-hidden': 'true' }),
        ],
      ),
    ]),
    arrow && arrow !== 'left'
      ? h('span', { class: 'lotus-btn-arrow' }, arrowGlyph)
      : null,
  ]
}
ButtonInner.props = {
  arrow: { type: String, default: undefined },
  arrowGlyph: { type: String, default: '' },
  isGlitching: { type: Boolean, default: false },
}

const props = defineProps({
  href: { type: String, default: undefined },
  targetBlank: { type: Boolean, default: false },
  arrow: { type: String as () => ArrowDir, default: undefined },
  title: { type: String, default: undefined },
  disabled: { type: Boolean, default: false },
  linkComponent: { type: [String, Object], default: 'a' },
  className: { type: String, default: '' },
  glitchCooldown: { type: Number, default: 400 },
  /** Render the resting 1px border. Default false (borderless). */
  bordered: { type: Boolean, default: false },
  /** @deprecated Use `bordered` (inverted). `border` maps to `bordered`. */
  border: { type: Boolean, default: undefined },
  /** Vertical padding preset. Default 'md'. */
  paddingY: { type: String as () => PadY, default: 'md' },
  /** Hover fills with the host background so dynamic backgrounds show through. */
  invertOnHover: { type: Boolean, default: false },
})
defineEmits<{ click: [event: MouseEvent] }>()

/** Composed modifier classes (variant + caller className). */
const buttonClasses = computed(() => {
  // `border` is a deprecated alias for `bordered`.
  const isBordered = props.border !== undefined ? props.border : props.bordered
  return [
    props.invertOnHover ? 'lotus-btn--invert-hover' : '',
    isBordered ? 'lotus-bordered' : '',
    props.paddingY !== 'md' ? `lotus-btn--pad-${props.paddingY}` : '',
    props.className,
  ]
    .filter(Boolean)
    .join(' ')
})

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

