<!-- lotus-library — CardGrid.vue
  Convenience composition: maps `items` to <Card>s and owns ONE shared
  <ProjectModal> (so hosts don't re-implement open/close state). Clicking a card
  without a `url` opens the modal for its slug/repo; cards with a `url` link out.
  Mirrors the React <CardGrid>.

  LAYOUT IS THE HOST'S JOB. Renders a plain container with a default responsive
  auto-fill grid (`className` overrides it). The library ships no mosaic/span
  engine — arrange cards with your own CSS. See README "Layout".
-->
<template>
  <div :class="['lotus-card-grid', className]">
    <Card
      v-for="item in items"
      :key="item.slug"
      :title="item.title"
      :date="item.date"
      :description="item.description"
      :tags="item.tags"
      :size="size"
      :fill="fill"
      :href="item.url"
      :link-component="linkComponent"
      :slug="item.slug"
      :thumbnail="item.thumbnail"
      :thumbnail-path="item.thumbnailPath"
      :thumbnail-defaults-id="item.thumbnailDefaultsId"
      :default-thumbnail="item.defaultThumbnail"
      :thumbnail-alt="item.thumbnailAlt"
      :aspect="item.aspect"
      @click="item.url ? undefined : (active = item)"
    />

    <ProjectModal
      v-bind="modalProps"
      :open="!!active"
      :slug="active?.slug ?? ''"
      :repo="active?.repo"
      @close="active = null"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { ProjectCardData } from '../core/types';
import Card from './Card.vue';
import ProjectModal from './ProjectModal.vue';

withDefaults(
  defineProps<{
    items: ProjectCardData[];
    size?: 'auto' | 'full' | 'compact';
    fill?: boolean;
    linkComponent?: string | object;
    /** Extra class(es) appended to `.lotus-card-grid`. Host owns the grid CSS. */
    className?: string;
    /** Props forwarded to the shared ProjectModal (slug/repo supplied per card). */
    modalProps?: Record<string, unknown>;
  }>(),
  {
    size: 'auto',
    fill: true,
    linkComponent: 'a',
    className: '',
    modalProps: () => ({}),
  },
);

const active = ref<ProjectCardData | null>(null);
</script>
