export { Panel, type PanelProps } from './Panel';
export { PanelGrid, type PanelGridProps } from './PanelGrid';
export { Tags, type TagsProps } from './Tags';
export { Button, type ButtonProps } from './Button';
export { GlitchLink, type GlitchLinkProps } from './GlitchLink';
export { GlitchText, type GlitchTextProps } from './GlitchText';
export { GlitchImage, type GlitchImageProps } from './GlitchImage';
export { Modal, type ModalProps } from './Modal';
export { ProjectModal, type ProjectModalProps } from './ProjectModal';

// Ported from the monorepo — framework-agnostic styling lives in core.
export { Card, type CardComponentProps } from './Card';
export { CardGrid, type CardGridProps } from './CardGrid';
export { Tooltip } from './Tooltip';
export { TypeWriter } from './TypeWriter';
export { LotusIcon, type LotusIconProps } from './LotusIcon';
export { Embed, type EmbedProps } from './Embed';
export { Nav, type NavProps, type NavLinkItem } from './Nav';
export { Footer, type FooterProps } from './Footer';
export { ThemeSwitch, type ThemeSwitchProps } from './ThemeSwitch';
export {
  ProjectRenderer,
  type ProjectRendererProps,
} from './ProjectRenderer';

// Adapter + theme (context-based routing; override per-component with
// `linkComponent`). The Next.js provider lives at `…/react/next`.
export {
  LotusAdapterProvider,
  useAdapter,
  usePathname,
  useRouter,
} from './adapter';
export {
  LotusThemeProvider,
  useTheme,
  useMounted,
  type Theme,
  type ThemeController,
} from './theme';

export { Glitch, type GlitchProps, type GlitchHandle } from './glitch/Glitch';
export * from './glitch';

export type {
  PanelData,
  PanelGroup,
  ButtonArrow,
  CardProps,
  ProjectCardData,
  TooltipProps,
  TypeWriterProps,
  LinkProps,
  ImageProps,
  LotusAdapter,
  LotusRouter,
} from '../core/types';
