<!-- lotus-library — ProjectModal.vue
  Project detail modal. Wraps the base <Modal> shell and handles the heavy lifting:
  fetching the generated /projects/:slug HTML, extracting the .project-fullpage-body
  fragment, and rendering it with loading/error states. Header actions and the
  signature footer are provided via Modal slots.

  Props: open, slug, repo, projectBasePath, showRepoAction, repoLabel,
         loadingText, errorText, contentSelector, className.
  Emits: close.
-->
<template>
  <Modal
    :open="open"
    :className="className"
    @close="$emit('close')"
  >
    <template #header-actions-left>
      <a
        v-if="showRepoAction && repo"
        :href="repo"
        target="_blank"
        rel="noopener noreferrer"
        class="lotus-btn"
      >{{ repoLabel }} →</a>
      <span
        v-else-if="showRepoAction"
        class="lotus-btn lotus-btn-disabled"
        title="private repository"
      >This repo is private for now :(</span>
    </template>

    <template #header-actions-right>
      <a class="lotus-btn" :href="pageUrl">Open full page</a>
    </template>

    <template #signature>
      Fetched from GitHub —
      <a :href="repo || pageUrl" target="_blank" rel="noopener noreferrer">source</a>
    </template>

    <div v-if="loading" class="lotus-modal-loading">{{ loadingText }}</div>
    <div v-else-if="error" class="lotus-modal-error">{{ errorText }}</div>
    <div v-else v-html="content" class="lotus-project-content" />
  </Modal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import Modal from './Modal.vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  slug: { type: String, required: true },
  repo: { type: String, default: undefined },
  projectBasePath: { type: String, default: '/projects' },
  showRepoAction: { type: Boolean, default: true },
  repoLabel: { type: String, default: 'View on GitHub' },
  loadingText: { type: String, default: 'Loading...' },
  errorText: { type: String, default: 'Could not load project details.' },
  contentSelector: { type: String, default: '.project-fullpage-body' },
  className: { type: String, default: '' },
})

defineEmits<{ close: [] }>()

const loading = ref(false)
const error = ref(false)
const content = ref('')

const pageUrl = computed(() => `${props.projectBasePath}/${props.slug}`)

async function loadContent() {
  loading.value = true
  error.value = false

  try {
    // Try clean URL first (dev server), fall back to .html (static deploy).
    let res = await fetch(pageUrl.value)
    if (!res.ok) {
      res = await fetch(`${pageUrl.value}.html`)
    }
    if (!res.ok) throw new Error('Failed to fetch')

    const html = await res.text()
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')

    const bodyEl = doc.querySelector(props.contentSelector)
    if (bodyEl) {
      content.value = bodyEl.innerHTML
        // Strip framework component tags that won't hydrate inside v-html.
        .replace(/<\/?GlitchLink[^>]*>/g, '')
        .replace(/<\/?LotusGlitchLink[^>]*>/g, '')
        .replace(/<YouTubeEmbeds\s*\/?>/g, '')
    } else {
      const mainEl =
        doc.querySelector('.vp-doc > div') ||
        doc.querySelector('.content-container') ||
        doc.querySelector('.VPDoc .content')
      content.value = mainEl?.innerHTML || '<p>Could not extract content.</p>'
    }
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
}

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) loadContent()
  },
  { immediate: true },
)
</script>
