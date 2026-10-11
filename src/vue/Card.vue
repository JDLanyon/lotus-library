<!-- lotus-library — Card.vue
  Dated, tagged entry card. Mirrors the React <Card>.
  Keyboard-activatable when a click listener is attached. Pass `href` to make
  the whole card a link (routed via `linkComponent`; native <a> otherwise).
  Thumbnail URL rules are shared with Panel via `resolveThumbnail` (core).
-->
<template>
  <div
    v-if="!href"
    :class="rootClasses"
    :tabindex="tabIndex"
    :role="role"
    :aria-label="ariaLabel"
    @click="$emit('click', $event)"
    @keydown="onKeydown"

  >
    <div v-if="$slots.media || mediaSrc" class="lotus-card-media" :style="mediaStyle">
      <slot name="media">
        <component
          :is="Image"
          v-if="adapterImage && Image"
          class="lotus-card-media-img"
          :src="mediaSrc"
          :width="1000"
          :height="1000"
          :alt="thumbnailAlt ?? title"
        />
        <img
          v-else-if="mediaSrc"
          class="lotus-card-media-img"
          :src="mediaSrc"
          :alt="thumbnailAlt ?? title"
          loading="lazy"
        />
      </slot>
    </div>
    <CardInner :title="title" :date="date" :description="description" :computed-tags="computedTags">
      <slot />
    </CardInner>
  </div>

  <component
    v-else
    :is="linkComponent"
    :href="href"
    :class="rootClasses"
    :tabindex="tabIndex"
    :role="role"
    :aria-label="ariaLabel"
    @click="$emit('click', $event)"
    @keydown="onKeydown"
  >
    <div v-if="$slots.media || mediaSrc" class="lotus-card-media" :style="mediaStyle">
      <slot name="media">
        <component
          :is="Image"
          v-if="adapterImage && Image"
          class="lotus-card-media-img"
          :src="mediaSrc"
          :width="1000"
          :height="1000"
          :alt="thumbnailAlt ?? title"
        />
        <img
          v-else-if="mediaSrc"
          class="lotus-card-media-img"
          :src="mediaSrc"
          :alt="thumbnailAlt ?? title"
          loading="lazy"
        />
      </slot>
    </div>
    <CardInner :title="title" :date="date" :description="description" :computed-tags="computedTags">
      <slot />
    </CardInner>
  </component>
</template>

<script setup lang="ts">
import { computed, h, type Slots, type VNode } from 'vue';
import { resolveThumbnail } from '../core/utils';
import { useAdapter } from './adapter';

type CardSize = 'auto' | 'full' | 'compact';

const { Image } = useAdapter();

/**
 * Shared inner markup. Functional component so both root branches share one
 * definition (and the default slot is forwarded once).
 */
const CardInner = (
  props: {
    title: string;
    date?: string;
    description?: string;
    computedTags: string[];
  },
  { slots }: { slots: Slots },
) => {
  const { title, date, description, computedTags } = props;
  const defaultSlot = (): VNode[] => slots.default?.() ?? [];
  const kids = [
    h('div', { class: 'lotus-card-head' }, [
      h('h3', { class: 'lotus-card-title' }, title),
      date ? h('time', { class: 'lotus-card-date' }, date) : null,
    ]),
    description ? h('p', { class: 'lotus-card-desc' }, description) : null,
    computedTags.length > 0
      ? h(
          'div',
          { class: 'lotus-card-tags' },
          computedTags.map((t) => h('span', { class: 'lotus-card-tag' }, t)),
        )
      : null,
    slots.default ? h('div', { class: 'lotus-card-body' }, defaultSlot()) : null,
  ];
  return kids;
};
CardInner.props = {
  title: { type: String, required: true },
  date: { type: String, default: undefined },
  description: { type: String, default: undefined },
  computedTags: { type: Array, default: () => [] },
};

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
    /** Render the resting 1px border. Default false (borderless). */
    bordered?: boolean;
    /** Layout preset. Default 'auto'. */
    size?: CardSize;
    /** Stretch to the height of the grid row. */
    fill?: boolean;
    /** When set, the whole card navigates here. */
    href?: string;
    /** Override the link element (host router Link). */
    linkComponent?: string | object;
    /** Media (parity with Panel; see resolveThumbnail in core). */
    thumbnail?: string;
    thumbnailPath?: string;
    /** Identifier used by thumbnailDefaultsId; falls back to the title. */
    slug?: string;
    thumbnailDefaultsId?: boolean;
    defaultThumbnail?: string;
    thumbnailAlt?: string;
    /** Use the adapter's Image (Next <Image>) for the media. Default true. */
    adapterImage?: boolean;
    /** Fixed media aspect ratio, e.g. "16/9". */
    aspect?: string;
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
    bordered: false,
    size: 'auto',
    fill: false,
    href: undefined,
    linkComponent: 'a',
    thumbnail: undefined,
    thumbnailPath: undefined,
    slug: undefined,
    thumbnailDefaultsId: false,
    defaultThumbnail: 'thumbnail.png',
    thumbnailAlt: undefined,
    adapterImage: true,
    aspect: undefined,
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

const mediaSrc = computed(() =>
  resolveThumbnail(
    props.thumbnail,
    props.thumbnailPath,
    props.slug ?? props.title,
    props.thumbnailDefaultsId,
    props.defaultThumbnail,
  ),
);

const mediaStyle = computed(() =>
  props.aspect ? { aspectRatio: props.aspect } : undefined,
);

const rootClasses = computed(() =>  [
    'lotus-card',
    props.size !== 'auto' ? `lotus-card--${props.size}` : '',
    props.fill ? 'lotus-card--fill' : '',
    props.bordered ? 'lotus-bordered' : '',
    props.className,
  ]
    .filter(Boolean)
    .join(' '),
);

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    emit('click', e);
  }
}
</script>

