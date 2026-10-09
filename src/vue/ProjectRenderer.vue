<!-- lotus-library — ProjectRenderer.vue
  Renders a ParsedProject from its typed section list. By default it wraps the
  content in the pure <Modal> shell; pass :modal="false" to render inline.
  Mirrors the React <ProjectRenderer>.
-->
<template>
  <component :is="modal ? Modal : 'div'" v-bind="modal ? { open: true } : {}" :class="modal ? className : undefined">
    <div class="lotus-project-content">
      <template v-for="(section, i) in project.sections" :key="i">
        <h1 v-if="section.type === 'heading'" class="lotus-project-heading">
          {{ (section as HeadingSection).text }}
        </h1>

        <div v-else-if="section.type === 'warnings'" class="lotus-project-warnings">
          <b>
            <p>*volume warning* - check volume before playing.</p>
            <p>*epilepsy warning* - flashing images.</p>
          </b>
        </div>

        <div v-else-if="section.type === 'github_button'" class="lotus-project-github">
          <Button text="View on GitHub" :href="(section as GitHubButtonSection).href" :target-blank="true" />
        </div>

        <div v-else-if="section.type === 'embed'" class="lotus-project-media">
          <Embed :uuid="(section as EmbedSection).uuid" />
        </div>

        <component
          v-else-if="section.type === 'image'"
          :is="Image"
          :class="['lotus-project-image', (section as ImageSection).width || 'is-full']"
          :src="(section as ImageSection).src"
          :width="1000"
          :height="1000"
          :alt="(section as ImageSection).alt || 'project image'"
        />

        <div v-else-if="section.type === 'image_row'" class="lotus-project-row">
          <component
            :is="Image"
            v-for="(img, k) in (section as ImageRowSection).images"
            :key="k"
            :class="['lotus-project-image', img.width || 'is-half']"
            :src="img.src"
            :width="1000"
            :height="1000"
            :alt="img.alt || `project image ${k + 1}`"
          />
        </div>

        <div v-else-if="section.type === 'flex_row'" class="lotus-project-row">
          <template v-for="(sub, k) in (section as FlexRowSection).sections" :key="k">
            <component
              :is="Image"
              v-if="sub.type === 'image'"
              :class="['lotus-project-image', (sub as ImageSection).width || 'is-half']"
              :src="(sub as ImageSection).src"
              :width="1000"
              :height="1000"
              :alt="(sub as ImageSection).alt || 'project image'"
            />
            <div
              v-else-if="sub.type === 'text'"
              :class="['lotus-project-cell', (sub as TextSection).width || 'is-half']"
            >
              <component :is="textBlocks((sub as TextSection).content)" />
            </div>
          </template>
        </div>

        <div v-else-if="section.type === 'text'" :class="(section as TextSection).width">
          <component :is="textBlocks((section as TextSection).content)" />
        </div>
      </template>
    </div>
  </component>
</template>

<script setup lang="ts">
import { h, type VNode } from 'vue';
import type {
  ParsedProject,
  ProjectSection,
  ImageSection,
  TextSection,
  ImageRowSection,
  FlexRowSection,
  HeadingSection,
  GitHubButtonSection,
  EmbedSection,
} from '../core/projects';
import { parseInlineMarkdown } from '../core/markdown';
import { useAdapter } from './adapter';
import Modal from './Modal.vue';
import Embed from './Embed.vue';
import Button from './Button.vue';

const props = withDefaults(
  defineProps<{
    project: ParsedProject;
    modal?: boolean;
    className?: string;
  }>(),
  {
    modal: true,
    className: '',
  },
);

const { Image, Link } = useAdapter();

/** Map a line of inline markdown to an array of VNodes. */
function inline(text: string): VNode[] {
  return parseInlineMarkdown(text).map((token) => {
    switch (token.type) {
      case 'bold':
        return h('strong', null, token.value);
      case 'italic':
        return h('em', null, token.value);
      case 'link':
        return h(Link, { href: token.href, target: '_blank', class: 'lotus-project-link' }, () => token.value);
      default:
        return h('span', null, token.value);
    }
  });
}

/** Build a VNode tree for a multi-line markdown text block. */
function textBlocks(content: string): VNode {
  const lines = content.split('\n');
  const children: VNode[] = lines.map((line) => {
    if (!line.trim()) return h('br');
    const li = line.match(/^\s*[-*]\s(.*)/);
    if (li) return h('li', { class: 'lotus-project-li' }, inline(li[1]));
    const h3 = line.match(/^###\s*(.*)/);
    if (h3) return h('h3', null, inline(h3[1]));
    const h2 = line.match(/^##\s*(.*)/);
    if (h2) return h('h2', null, inline(h2[1]));
    return h('p', null, inline(line));
  });
  return h('div', null, children);
}
</script>
