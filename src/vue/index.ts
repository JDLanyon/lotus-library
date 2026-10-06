/**
 * lotus-library — Vue 3 entry point
 *
 *   import { Panel, PanelGrid, Button, GlitchLink } from 'lotus-library/vue';
 *   import 'lotus-library/style.css';
 */

import Panel from './Panel.vue';
import PanelGrid from './PanelGrid.vue';
import Tags from './Tags.vue';
import Button from './Button.vue';
import GlitchLink from './GlitchLink.vue';
import Modal from './Modal.vue';
import ProjectModal from './ProjectModal.vue';

export { Panel, PanelGrid, Tags, Button, GlitchLink, Modal, ProjectModal };

/** Shape of a single panel entry. */
export interface PanelData {
  id: string;
  title?: string;
  description?: string;
  thumbnail?: string;
  thumbnailPath?: string;
  href?: string;
  tags?: string[];
}

/** A named group of panels. */
export interface PanelGroup {
  id?: string;
  heading?: string;
  basePath?: string;
  thumbnailPath?: string;
  panels: PanelData[];
}

/** Direction glyph appended to a Button label. */
export type ButtonArrow = 'left' | 'right' | 'up' | 'down';

/** Convenience plugin: app.component() everything on `app.use(LotusLibrary)`. */
export const LotusLibrary = {
  install(app: { component: (name: string, comp: unknown) => void }) {
    app.component('LotusPanel', Panel);
    app.component('LotusPanelGrid', PanelGrid);
    app.component('LotusTags', Tags);
    app.component('LotusButton', Button);
    app.component('LotusGlitchLink', GlitchLink);
    app.component('LotusModal', Modal);
    app.component('LotusProjectModal', ProjectModal);
    app.component('Panel', Panel);
    app.component('PanelGrid', PanelGrid);
    app.component('Tags', Tags);
    app.component('Button', Button);
    app.component('GlitchLink', GlitchLink);
    app.component('Modal', Modal);
    app.component('ProjectModal', ProjectModal);
  },
};

