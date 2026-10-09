<!-- lotus-library — TypeWriter.vue
  Cycling typewriter heading. Mirrors the React <TypeWriter>. The word-deletion
  logic is shared via core's `deleteLastWord`; styling lives in `.lotus-typewriter*`.
-->
<template>
  <span :class="['lotus-typewriter', className]">
    <span>{{ currentText }}</span>
    <span
      class="lotus-typewriter-caret"
      :class="{ 'is-idle': isIdle }"
      aria-hidden="true"
    />
    <span v-if="remainingText" class="lotus-typewriter-rest">{{ remainingText }}</span>
  </span>
</template>

<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue';
import { deleteLastWord } from '../core/utils';

const props = withDefaults(
  defineProps<{
    headings: string[];
    speed?: number;
    delayBetweenHeadings?: number;
    className?: string;
  }>(),
  {
    speed: 240,
    delayBetweenHeadings: 4000,
    className: '',
  },
);

const currentHeadingIndex = ref(0);
const currentText = ref('');
const isDeleting = ref(false);
let timer: ReturnType<typeof setTimeout> | null = null;

const currentFullText = computed(
  () => props.headings[currentHeadingIndex.value] ?? '',
);
const remainingText = computed(() =>
  !isDeleting.value ? currentFullText.value.substring(currentText.value.length) : '',
);
const isIdle = computed(
  () => !isDeleting.value && currentText.value === currentFullText.value,
);

function tick() {
  const full = currentFullText.value;
  const charDelayMs = props.speed > 0 ? 12000 / props.speed : 60;
  const wordDeleteDelayMs = 150;

  if (!isDeleting.value && currentText.value === full) {
    timer = setTimeout(() => {
      isDeleting.value = true;
      tick();
    }, props.delayBetweenHeadings);
  } else if (isDeleting.value && currentText.value === '') {
    isDeleting.value = false;
    currentHeadingIndex.value =
      (currentHeadingIndex.value + 1) % props.headings.length;
    timer = setTimeout(tick, charDelayMs);
  } else {
    const delay = isDeleting.value ? wordDeleteDelayMs : charDelayMs;
    timer = setTimeout(() => {
      if (isDeleting.value) {
        currentText.value = deleteLastWord(currentText.value);
      } else {
        currentText.value = full.substring(0, currentText.value.length + 1);
      }
      tick();
    }, delay);
  }
}

// Start typing the first heading shortly after mount.
timer = setTimeout(tick, 500);

watch(
  () => props.headings,
  () => {
    currentHeadingIndex.value = 0;
    currentText.value = '';
    isDeleting.value = false;
  },
);

onUnmounted(() => {
  if (timer) clearTimeout(timer);
});
</script>
