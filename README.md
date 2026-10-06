# lotus-library

Reusable **Panel**, **Button**, **Tags**, **Glitch** and **Modal** components for
reproducible custom websites. Ships **React** and **Vue 3** bindings from a single
package with matching props, class names and behaviour.

- **React** — first release (used by `sausytime.com`, Next.js)
- **Vue 3** — used by `jdlanyon.dev` (VitePress), `arana united futsal` and other Vite sites
- Zero runtime dependencies beyond a React/Vue peer.

## Install

```bash
npm install lotus-library
```

Import the stylesheet once at your app root:

```ts
import 'lotus-library/style.css';
```

## Components

| Component      | React | Vue | Purpose                                                   |
| -------------- | :---: | :-: | --------------------------------------------------------- |
| `Panel`        |  ✅   | ✅  | A single linked card with thumbnail, title, description   |
| `PanelGrid`    |  ✅   | ✅  | Responsive flex-wrap grid that lays out `Panel`s          |
| `Tags`         |  ✅   | ✅  | Row of small tag chips                                    |
| `Button`       |  ✅   | ✅  | Blocky hover-invert button / link                         |
| `GlitchLink`   |  ✅   | ✅  | Link with a chromatic-aberration glitch on hover          |
| `GlitchText`   |  ✅   | —   | Animated glitching text                                   |
| `GlitchImage`  |  ✅   | —   | Animated glitching image                                  |
| `Glitch`       |  ✅   | —   | Low-level glitch engine (effects, name cycler)            |
| `Modal`        |  ✅   | ✅  | Pure modal shell (slot/prop driven, no fetching)          |
| `ProjectModal` |  ✅   | ✅  | `Modal` wrapper that fetches a `/projects/:slug` page     |

## React (Next.js)

```tsx
import { PanelGrid, Button, Modal, ProjectModal } from 'lotus-library/react';
import 'lotus-library/style.css';

import Link from 'next/link';

export function ProjectCards() {
  return (
    <PanelGrid
      heading="Projects"
      basePath="/programming/uni"
      linkComponent={Link}          // route through Next <Link>
      panels={[
        { id: 'task-tank', title: 'Task Tank', description: 'A to-do tank' },
        { id: 'dead-bread', title: 'Dead Bread', description: 'Browser game' },
      ]}
    />
  );
}
```

The base `Modal` is intentionally pure — it does no fetching and renders nothing
when `open` is falsy:

```tsx
import { useState } from 'react';
import { Modal, Button } from 'lotus-library/react';

export function Example() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button text="Open" onClick={() => setOpen(true)} />
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        headerActionsLeft={<Button text="View on GitHub" href="https://github.com" />}
        signature={<>Fetched from GitHub — <a href="https://github.com">source</a></>}
      >
        <p>Anything here — the body scrolls when it overflows.</p>
      </Modal>
    </>
  );
}
```

`ProjectModal` adds the fetching: it loads `${projectBasePath}/${slug}` (falling
back to `.html`), extracts `contentSelector` (default `.project-fullpage-body`),
and shows loading/error states while keeping the base shell pure.

```tsx
<ProjectModal
  open={open}
  onClose={() => setOpen(false)}
  slug="dead-bread"
  repo="https://github.com/example/dead-bread"
/>
```

## Vue 3 (VitePress / Vite)

Register globally with the plugin:

```ts
import { createApp } from 'vue';
import { LotusLibrary } from 'lotus-library/vue';
import 'lotus-library/style.css';

createApp(App).use(LotusLibrary).mount('#app');
```

Or import components directly:

```vue
<script setup lang="ts">
import { PanelGrid, Button, Modal, ProjectModal } from 'lotus-library/vue';
</script>

<template>
  <PanelGrid :panels="panels" base-path="/programming/uni" />

  <Button text="Open" @click="open = true" />
  <Modal :open="open" @close="open = false">
    <template #header-actions-left>
      <a class="lotus-btn" href="https://github.com">View on GitHub →</a>
    </template>
    <template #signature>
      Fetched from GitHub — <a href="https://github.com">source</a>
    </template>
    <p>Anything here — the body scrolls when it overflows.</p>
  </Modal>

  <ProjectModal :open="open" slug="dead-bread" @close="open = false" />
</template>
```

### Modal API (identical across React + Vue)

| Concept            | Vue                          | React                       |
| ------------------ | ---------------------------- | --------------------------- |
| open               | `:open`                      | `open`                      |
| close              | `@close`                     | `onClose`                   |
| backdrop close     | `:close-on-backdrop` (true)  | `closeOnBackdrop` (true)     |
| escape close       | `:close-on-escape` (true)    | `closeOnEscape` (true)      |
| extra class        | `className`                  | `className`                 |
| header left action | slot `header-actions-left`   | prop `headerActionsLeft`    |
| header right action| slot `header-actions-right`  | prop `headerActionsRight`   |
| body               | default slot                 | `children`                  |
| footer             | slot `signature`             | prop `signature`            |

`ProjectModal` adds: `slug`, `repo`, `projectBasePath` (default `/projects`),
`showRepoAction`, `repoLabel`, `loadingText`, `errorText`, `contentSelector`.

## Theming

Colours are monochromatic by default and driven entirely by CSS custom
properties. Override them anywhere in your cascade, or set them on `:root`:

```css
:root {
  --lotus-primary: #111;
  --lotus-secondary: #333;
  --lotus-background: #eee;
  --lotus-border-color: #ddd;
  --lotus-radius: 0px;
  --lotus-font-sans: 'Poppins', system-ui, sans-serif;
}
```

Dark mode activates via `.lotus-dark`, `.dark` or `[data-theme="dark"]`.

### Fonts

The library **ships no font files**. `--lotus-font-sans` defaults to a
**Poppins-first** stack — load Poppins yourself (self-host or Google Fonts) or
override the token to use your own typeface:

```html
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
  rel="stylesheet"
/>
```

### Buttons

`Button` is border-only (border = `--lotus-primary`, transparent background,
`--lotus-primary` text). On hover it fades to a `--primary` fill using a
`color-burn` background blend, text switches to `--lotus-background`, and the
label plays the **global glitch effect**. Disable the glitch with
`glitchOnHover={false}` (React) / `:glitch-cooldown` (Vue).

## Local development

```bash
npm run storybook        # component playground (React)
npm run build-storybook  # static Storybook
npm run build:lib        # build dist/react, dist/vue, dist/lotus.css
```
