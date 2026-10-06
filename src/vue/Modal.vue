<!-- lotus-library — Modal.vue
  Pure base shell for modals. Renders the empty box: off-click / ✕ / Escape to
  close, a scrollable body (default slot), and an optional signature footer
  (slot "signature"). This component does NO fetching or backend work — wrappers
  like <ProjectModal> supply their own content via slots.

  Props:
    open           (bool)  — when falsy the modal renders nothing
    closeOnBackdrop(bool)  — close when the backdrop is clicked (default true)
    closeOnEscape  (bool)  — close when Escape is pressed (default true)
    className      (string)— appended to `.lotus-modal-container`
  Slots:
    header-actions-left  : e.g. "View on GitHub"
    header-actions-right : e.g. "Open full page" (✕ is appended after it)
    default              : the modal body (scrolls when too large)
    signature            : small footer line at the bottom
  Emits: close.
-->
<template>
  <Teleport to="body">
    <div v-if="open" class="lotus-modal-backdrop" @click.self="onBackdrop">
      <div :class="['lotus-modal-container', className]" role="dialog" aria-modal="true">
        <div class="lotus-modal-header">
          <div class="lotus-modal-actions-left">
            <slot name="header-actions-left" />
          </div>
          <div class="lotus-modal-actions-right">
            <slot name="header-actions-right" />
            <button class="lotus-modal-close" type="button" @click="close" aria-label="Close">✕</button>
          </div>
        </div>

        <div class="lotus-modal-scroll">
          <slot />
        </div>

        <div v-if="$slots.signature" class="lotus-modal-signature">
          <slot name="signature" />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  closeOnBackdrop: { type: Boolean, default: true },
  closeOnEscape: { type: Boolean, default: true },
  className: { type: String, default: '' },
})

const emit = defineEmits<{ close: [] }>()

function close() {
  emit('close')
}

function onBackdrop() {
  if (props.closeOnBackdrop) close()
}

function onKeydown(e: KeyboardEvent) {
  if (props.closeOnEscape && e.key === 'Escape') close()
}

let prevOverflow = ''

function lockScroll() {
  prevOverflow = document.documentElement.style.overflow
  document.documentElement.style.overflow = 'hidden'
}

function unlockScroll() {
  document.documentElement.style.overflow = prevOverflow
}

watch(
  () => props.open,
  (isOpen) => (isOpen ? lockScroll() : unlockScroll()),
)

onMounted(() => {
  if (props.open) lockScroll()
  document.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  unlockScroll()
  document.removeEventListener('keydown', onKeydown)
})

defineExpose({ close })
</script>
