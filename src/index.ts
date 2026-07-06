/**
 * MOCHI UI — index.ts v2.0
 * Main entry point for the component library.
 */

// Core Physics
export { SpringPhysics, MultiSpring, SPRING_PRESETS, DEFAULT_CONFIG } from './lib/spring-physics';
export type { SpringConfig, SpringState } from './lib/spring-physics';

// React Hooks
export {
  useSpring,
  useSprings,
  useSpringTransform,
  useScrollSpring,
  useMagnetic,
  useSquish,
  useStaggeredReveal,
  useReducedMotion,
} from './lib/spring-hooks';

// Components
export { ClayButton } from './components/ClayButton';
export type { ClayButtonProps } from './components/ClayButton';
export { ClayCard } from './components/ClayCard';
export type { ClayCardProps } from './components/ClayCard';
export { ClayToggle } from './components/ClayToggle';
export type { ClayToggleProps } from './components/ClayToggle';
export { ClaySlider } from './components/ClaySlider';
export type { ClaySliderProps } from './components/ClaySlider';
export { ClayProgress } from './components/ClayProgress';
export type { ClayProgressProps } from './components/ClayProgress';
export { ClayModal } from './components/ClayModal';
export type { ClayModalProps } from './components/ClayModal';
export { ClayInput } from './components/ClayInput';
export type { ClayInputProps } from './components/ClayInput';
export { ClayBadge } from './components/ClayBadge';
export type { ClayBadgeProps } from './components/ClayBadge';
export { ClaySegmentedControl } from './components/ClaySegmentedControl';
export type { SegmentedOption, ClaySegmentedControlProps } from './components/ClaySegmentedControl';
export { ClayTooltip } from './components/ClayTooltip';
export type { ClayTooltipProps } from './components/ClayTooltip';
export { ClayAvatar, ClayAvatarStack } from './components/ClayAvatar';
export type { ClayAvatarProps } from './components/ClayAvatar';

// Theme
export { ThemeProvider, useTheme } from './components/ThemeProvider';
export type { ThemeProviderProps } from './components/ThemeProvider';
