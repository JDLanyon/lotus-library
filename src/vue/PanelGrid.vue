<!-- lotus-library — PanelGrid.vue
  Flex-wrap grid of <Panel>s. Mirrors the React <PanelGrid> component.
-->
<template>
  <section v-if="items.length" :id="id">
    <h2 v-if="heading">{{ heading }}</h2>
    <div class="lotus-panel-grid">
      <Panel
        v-for="panel in items"
        :key="panel.id"
        v-bind="panel"
        :base-path="basePath || panel.thumbnailPath"
        :thumbnail-path="thumbnailPath || panel.thumbnailPath"
        :link-component="linkComponent"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Panel from './Panel.vue'

interface PanelShape {
  id: string
  title?: string
  description?: string
  thumbnail?: string
  thumbnailPath?: string
  href?: string
  tags?: string[]
}
const props = defineProps({
  id: { type: String, default: undefined },
  heading: { type: String, default: undefined },
  panels: { type: Array as () => PanelShape[], default: undefined },
  data: { type: Array as () => PanelShape[], default: undefined },
  basePath: { type: String, default: undefined },
  thumbnailPath: { type: String, default: undefined },
  linkComponent: { type: String, default: 'a' },
})
const items = computed(() => props.panels ?? props.data ?? [])
</script>

