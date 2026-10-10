<!-- lotus-library — ProjectRenderer.vue
  Renders a ParsedProject from its typed section list. By default it wraps the
  content in the pure <Modal> shell; pass :modal="false" to render inline.
  Mirrors the React <ProjectRenderer>.
-->
<template>
  <Modal v-if="modal" :open="true" :class-name="className">
    <div class="lotus-project-content">
      <ProjectSections :project="project" />
    </div>
  </Modal>

  <div v-else>
    <div class="lotus-project-content">
      <ProjectSections :project="project" />
    </div>
  </div>
          </template>

<script setup lang="ts">
import type { ParsedProject } from '../core/projects';
import Modal from './Modal.vue';
import ProjectSections from './ProjectSections.vue';

withDefaults(
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
</script>

