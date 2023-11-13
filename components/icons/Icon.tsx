import { IconsProps } from '@/models/domain/Icon';
import React, { lazy } from 'react';

interface Props {
  value: string;
  width?: number;
  height?: number;
  className?: string;
}

interface Icons {
  [key: string]: React.LazyExoticComponent<
    (props: IconsProps) => React.JSX.Element
  >;
}

const icons: Icons = {
  miniArrowLeft: lazy(() => import('./arrowLeft/MiniArrowLeft')),
  outlineArrowLeft: lazy(() => import('./arrowLeft/OutlineArrowLeft')),
  miniArrowRight: lazy(() => import('./arrowRight/MiniArrowRight')),
  outlineArrowRight: lazy(() => import('./arrowRight/OutlineArrowRight')),
  miniArrowTopRightOnSquare: lazy(
    () => import('./arrowTopRightOnSquare/MiniArrowTopRightOnSquare')
  ),
  outlineArrowTopRightOnSquare: lazy(
    () => import('./arrowTopRightOnSquare/OutlineArrowTopRightOnSquare')
  ),
  miniArrowUpRight: lazy(() => import('./arrowUpRight/MiniArrowUpRight')),
  outlineArrowUpRight: lazy(() => import('./arrowUpRight/OutlineArrowUpRight')),
  miniChevronDown: lazy(() => import('./chevronDown/MiniChevronDown')),
  outlineChevronDown: lazy(() => import('./chevronDown/OutlineChevronDown')),
  miniChevronLeft: lazy(() => import('./chevronLeft/MiniChevronLeft')),
  outlineChevronLeft: lazy(() => import('./chevronLeft/OutlineChevronLeft')),
  miniChevronRight: lazy(() => import('./chevronRight/MiniChevronRight')),
  outlineChevronRight: lazy(() => import('./chevronRight/OutlineChevronRight')),
  miniChevronUp: lazy(() => import('./chevronUp/MiniChevronUp')),
  outlineChevronUp: lazy(() => import('./chevronUp/OutlineChevronUp')),
  miniCircleStack: lazy(() => import('./circleStack/MiniCircleStack')),
  outlineCircleStack: lazy(() => import('./circleStack/OutlineCircleStack')),
  solidCircleStack: lazy(() => import('./circleStack/SolidCircleStack')),
  miniCodeBracket: lazy(() => import('./codeBracket/MiniCodeBracket')),
  outlineCodeBracket: lazy(() => import('./codeBracket/OutlineCodeBracket')),
  miniCommandLine: lazy(() => import('./commandLine/MiniCommandLine')),
  outlineCommandLine: lazy(() => import('./commandLine/OutlineCommandLine')),
  miniEnvelope: lazy(() => import('./envelope/MiniEnvelope')),
  outlineEnvelope: lazy(() => import('./envelope/OutlineEnvelope')),
  miniEnvelopeOpen: lazy(() => import('./envelopeOpen/MiniEnvelopeOpen')),
  outlineEnvelopeOpen: lazy(() => import('./envelopeOpen/OutlineEnvelopeOpen')),
  menu: lazy(() => import('./menu/Menu')),
  miniMenu: lazy(() => import('./menu/MiniMenu')),
  miniSettings: lazy(() => import('./settings/MiniSettings')),
  outlineSettings: lazy(() => import('./settings/OutlineSettings')),
  solidSettings: lazy(() => import('./settings/SolidSettings')),
  miniLightTheme: lazy(() => import('./lightTheme/MiniLightTheme')),
  solidLightTheme: lazy(() => import('./lightTheme/SolidLightTheme')),
  miniDarkTheme: lazy(() => import('./darkTheme/MiniDarkTheme')),
  solidDarkTheme: lazy(() => import('./darkTheme/SolidDarkTheme')),
  closeMenu: lazy(() => import('./closeMenu/CloseMenu')),
  reload: lazy(() => import('./reload/Reload')),
  miniReload: lazy(() => import('./reload/MiniReload')),
  miniError: lazy(() => import('./error/MiniError')),
  outlineError: lazy(() => import('./error/OutlineError')),
  solidError: lazy(() => import('./error/SolidError')),
  miniWarning: lazy(() => import('./warning/MiniWarning')),
  outlineWarning: lazy(() => import('./warning/OutlineWarning')),
  solidWarning: lazy(() => import('./warning/SolidWarning')),
  miniSuccess: lazy(() => import('./success/MiniSuccess')),
  outlineSuccess: lazy(() => import('./success/OutlineSuccess')),
  solidSuccess: lazy(() => import('./success/SolidSuccess')),
  github: lazy(() => import('./Github')),
  linkedIn: lazy(() => import('./LinkedIn')),
  twitter: lazy(() => import('./Twitter')),
  reddit: lazy(() => import('./Reddit')),
  facebook: lazy(() => import('./Facebook')),
  default: lazy(() => import('./envelope/OutlineEnvelope')),
};

const Icon = ({ value, width = 24, height = 24, className }: Props) => {
  const SelectedIcon = icons[value] || icons.default;
  return (
    <SelectedIcon width={width} height={height} className={className || ''} />
  );
};

export default Icon;
