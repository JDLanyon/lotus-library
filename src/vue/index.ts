import Panel from './Panel.vue';
import PanelGrid from './PanelGrid.vue';
import Tags from './Tags.vue';
import Button from './Button.vue';
import GlitchLink from './GlitchLink.vue';
import Modal from './Modal.vue';
import ProjectModal from './ProjectModal.vue';

// Ported from the monorepo — framework-agnostic styling lives in core.
import Card from './Card.vue';
import Tooltip from './Tooltip.vue';
import TypeWriter from './TypeWriter.vue';
import LotusIcon from './LotusIcon.vue';
import Embed from './Embed.vue';
import Nav from './Nav.vue';
import Footer from './Footer.vue';
import ThemeSwitch from './ThemeSwitch.vue';
import ProjectRenderer from './ProjectRenderer.vue';
import Glitch from './glitch/Glitch.vue';
import GlitchText from './GlitchText.vue';
import GlitchImage from './GlitchImage.vue';
import CardGrid from './CardGrid.vue';

export {
  Panel,
  PanelGrid,
  Tags,
  Button,
  GlitchLink,
  Modal,
  ProjectModal,
  Card,
  CardGrid,
  Tooltip,
  TypeWriter,
  LotusIcon,
  Embed,
  Nav,
  Footer,
  ThemeSwitch,
  ProjectRenderer,
  Glitch,
  GlitchText,
  GlitchImage,
};

// Adapter + theme (context/injection-based routing). The Vue adapter also
// ships as a plugin via `createLotusAdapter`.
export {
  provideLotusAdapter,
  createLotusAdapter,
  useAdapter,
  defaultAdapter,
  DOM_ROUTER,
  LOTUS_ADAPTER_KEY,
  type VueLotusAdapter,
} from './adapter';
export {
  provideLotusTheme,
  useTheme,
  useMounted,
  LOTUS_THEME_KEY,
  type Theme,
  type ThemeController,
} from './theme';

export { useGlitchState, useNameCycler } from './glitch';
export type { UseGlitchStateOptions } from './glitch';

export type { NavLinkItem } from './Nav.vue';

// Shared data shapes (single source of truth in core).
export type { ProjectCardData, CardProps } from '../core/types';

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
    app.component('LotusCard', Card);
    app.component('LotusTooltip', Tooltip);
    app.component('LotusTypeWriter', TypeWriter);
    app.component('LotusIcon', LotusIcon);
    app.component('LotusEmbed', Embed);
    app.component('LotusNav', Nav);
    app.component('LotusFooter', Footer);
    app.component('LotusThemeSwitch', ThemeSwitch);
    app.component('LotusProjectRenderer', ProjectRenderer);
    app.component('LotusGlitch', Glitch);
    app.component('LotusGlitchText', GlitchText);
    app.component('LotusGlitchImage', GlitchImage);
    app.component('LotusCardGrid', CardGrid);
    app.component('Panel', Panel);
    app.component('PanelGrid', PanelGrid);
    app.component('Tags', Tags);
    app.component('Button', Button);
    app.component('GlitchLink', GlitchLink);
    app.component('Modal', Modal);
    app.component('ProjectModal', ProjectModal);
    app.component('Card', Card);
    app.component('Tooltip', Tooltip);
    app.component('TypeWriter', TypeWriter);
    app.component('Embed', Embed);
    app.component('Nav', Nav);
    app.component('Footer', Footer);
    app.component('ThemeSwitch', ThemeSwitch);
    app.component('ProjectRenderer', ProjectRenderer);
    app.component('Glitch', Glitch);
    app.component('GlitchText', GlitchText);
    app.component('GlitchImage', GlitchImage);
    app.component('CardGrid', CardGrid);
  },
};

