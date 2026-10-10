<!-- lotus-library — Panel.vue
  Image-featured panel. Mirrors the React <Panel> component.
  Renders as an <a> by default (router-link friendly via `linkComponent`).
-->
<template>
  <component
    :is="linkComponent"
    :href="target"
    class="lotus-panel"
    :aria-label="label"
  >
    <img
      v-if="resolvedThumbnail"
      class="lotus-panel-media"
      :src="resolvedThumbnail"
      :alt="label"
      loading="lazy"
    />
    <h3 class="lotus-panel-title">{{ label }}</h3>
    <p v-if="description" class="lotus-panel-desc">{{ description }}</p>
    <Tags :tags="tags" />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { resolveThumbnail } from '../core/utils'
import Tags from './Tags.vue'

const props = defineProps({
  id: { type: String, required: true },
  title: { type: String, default: undefined },
  description: { type: String, default: undefined },
  thumbnail: { type: String, default: undefined },
  thumbnailPath: { type: String, default: undefined },
  href: { type: String, default: undefined },
  tags: { type: Array as () => string[], default: undefined },
  basePath: { type: String, default: '' },
  linkComponent: { type: String, default: 'a' },
  thumbnailDefaultsId: { type: Boolean, default: false },
  defaultThumbnail: { type: String, default: 'thumbnail.png' },
})
const label = computed(() => props.title ?? props.id)

const target = computed(() => {
  if (props.href) return props.href
  if (props.basePath) return `${props.basePath.replace(/\/$/, '')}/${props.id}`
  return undefined
})

const resolvedThumbnail = computed(() =>
  resolveThumbnail(
    props.thumbnail,
    props.thumbnailPath,
    props.id,
    props.thumbnailDefaultsId,
    props.defaultThumbnail,
  ),
)
</script>


