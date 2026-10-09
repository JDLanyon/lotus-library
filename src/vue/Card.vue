<!-- lotus-library — Card.vue
  Dated, tagged entry card. Mirrors the React <Card>.
  Keyboard-activatable when a click listener is attached.
-->
<template>
  <div
    :class="['lotus-card', className]"
    :tabindex="tabIndex"
    :role="role"
    :aria-label="ariaLabel"
    @click="$emit('click', $event)"
    @keydown="onKeydown"
  >
    <div class="lotus-card-head">
      <h3 class="lotus-card-title">{{ title }}</h3>
      <time v-if="date" class="lotus-card-date">{{ date }}</time>
    </div>

    <p v-if="description" class="lotus-card-desc">{{ description }}</p>

    <div v-if="computedTags.length > 0" class="lotus-card-tags">
      <span v-for="tag in computedTags" :key="tag" class="lotus-card-tag">{{ tag }}</span>
    </div>

    <div v-if="$slots.default" class="lotus-card-body">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    title: string;
    date?: string;
    description?: string;
    tags?: string[];
    hashTags?: boolean;
    tabIndex?: number;
    role?: string;
    ariaLabel?: string;
    className?: string;
  }>(),
  {
    date: undefined,
    description: undefined,
    tags: undefined,
    hashTags: false,
    tabIndex: 0,
    role: undefined,
    ariaLabel: undefined,
    className: '',
  },
);

const emit = defineEmits<{ click: [event: MouseEvent | KeyboardEvent] }>();

const computedTags = computed(() =>
  props.tags && props.tags.length > 0
    ? props.hashTags
      ? props.tags.map((t) => `#${t}`)
      : props.tags
    : [],
);

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    emit('click', e);
  }
}
</script>
