<!-- lotus-library — GlitchLink.vue
  Link with a CSS-animated chromatic-aberration glitch on hover + underline.
  Vue counterpart of the React <GlitchLink>. No JS animation loop, SSR safe.
-->
<template>
  <a
    :href="href"
    class="lotus-glitch-link"
    :target="target"
    :rel="rel"
    @mouseenter="triggerGlitch"
    @click="$emit('click', $event)"
  >
    <span class="glitch-text-wrap" :class="{ 'is-glitching': isGlitching }">
      <span class="glitch-base"><slot>{{ text }}</slot></span>
      <span class="glitch-chroma glitch-chroma-r" aria-hidden="true"><slot>{{ text }}</slot></span>
      <span class="glitch-chroma glitch-chroma-g" aria-hidden="true"><slot>{{ text }}</slot></span>
      <span class="glitch-chroma glitch-chroma-b" aria-hidden="true"><slot>{{ text }}</slot></span>
      <span class="glitch-chroma glitch-chroma-c" aria-hidden="true"><slot>{{ text }}</slot></span>
      <span class="glitch-chroma glitch-chroma-m" aria-hidden="true"><slot>{{ text }}</slot></span>
      <span class="glitch-chroma glitch-chroma-y" aria-hidden="true"><slot>{{ text }}</slot></span>
      <span class="glitch-motion-blur" aria-hidden="true" />
    </span>
    <span class="lotus-glitch-underline" aria-hidden="true" />
  </a>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const props = withDefaults(
  defineProps<{
    href: string
    text?: string
    cooldown?: number
    underlineDuration?: number
    target?: string
    rel?: string
  }>(),
  { text: '', cooldown: 1000 },
)

defineEmits<{ click: [event: MouseEvent] }>()

const isGlitching = ref(false)
const lastTrigger = ref(0)

const isExternal = computed(() => /^https?:\/\//.test(props.href))
const target = computed(() => props.target ?? (isExternal.value ? '_blank' : undefined))
const rel = computed(() => props.rel ?? (isExternal.value ? 'noopener noreferrer' : undefined))

function triggerGlitch() {
  const now = Date.now()
  if (now - lastTrigger.value < props.cooldown) return
  lastTrigger.value = now
  isGlitching.value = true
  setTimeout(() => {
    isGlitching.value = false
  }, 350)
}
</script>

<style scoped>
.glitch-text-wrap { position: relative; display: inline-block; }
.glitch-base { position: relative; display: inline-block; z-index: 1; }
.glitch-chroma { position: absolute; inset: 0; pointer-events: none; opacity: 0; z-index: 0; will-change: transform, opacity; }
.glitch-motion-blur { position: absolute; inset: -4px; pointer-events: none; opacity: 0; z-index: 3; will-change: opacity, backdrop-filter; }

.is-glitching .glitch-chroma-r { opacity: 1; color: rgba(255, 60, 60, 0.7); mix-blend-mode: screen; animation: lotus-chroma 0.35s steps(4, end); }
.is-glitching .glitch-chroma-g { opacity: 1; color: rgba(60, 255, 60, 0.7); mix-blend-mode: screen; animation: lotus-chroma 0.35s steps(4, end); }
.is-glitching .glitch-chroma-b { opacity: 1; color: rgba(60, 60, 255, 0.7); mix-blend-mode: screen; animation: lotus-chroma 0.35s steps(4, end); }
.is-glitching .glitch-chroma-c { opacity: 1; color: rgba(0, 200, 200, 0.6); mix-blend-mode: difference; animation: lotus-chroma 0.35s steps(4, end); }
.is-glitching .glitch-chroma-m { opacity: 1; color: rgba(200, 0, 200, 0.6); mix-blend-mode: difference; animation: lotus-chroma 0.35s steps(4, end); }
.is-glitching .glitch-chroma-y { opacity: 1; color: rgba(200, 200, 0, 0.6); mix-blend-mode: difference; animation: lotus-chroma 0.35s steps(4, end); }
.is-glitching .glitch-base { animation: lotus-text-shake 0.35s steps(4, end); }
.is-glitching .glitch-motion-blur { opacity: 0.35; backdrop-filter: blur(2px); animation: lotus-blur-pulse 0.35s steps(4, end); }

@keyframes lotus-chroma {
  0%   { transform: translate(0, 0); opacity: 0; }
  15%  { transform: translate(3px, -2px); opacity: 1; }
  40%  { transform: translate(-2px, 2px); opacity: 1; }
  70%  { transform: translate(4px, -1px); opacity: 0.8; }
  100% { transform: translate(0, 0); opacity: 0; }
}
@keyframes lotus-text-shake {
  0%   { transform: translate(0, 0); }
  15%  { transform: translate(2px, -1px); }
  35%  { transform: translate(-2px, 2px); }
  55%  { transform: translate(1px, -2px); }
  75%  { transform: translate(-1px, 1px); }
  100% { transform: translate(0, 0); }
}
@keyframes lotus-blur-pulse {
  0%   { opacity: 0; }
  15%  { opacity: 0.4; }
  40%  { opacity: 0.35; }
  70%  { opacity: 0.25; }
  100% { opacity: 0; }
}
</style>
