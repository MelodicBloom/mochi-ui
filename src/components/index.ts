// Mochi UI - Claymorphism Component Library
// Export all components for easy imports
// Built with Astro + Motion v12 + Spring Physics

// Clay Primitives
export { ClayButton, type ClayButtonProps } from './clay/ClayButton';
export { ClayCard, type ClayCardProps } from './clay/ClayCard';
export { ClayToggle, type ClayToggleProps } from './clay/ClayToggle';
export { ClaySlider, type ClaySliderProps } from './clay/ClaySlider';
export { ClayInput, type ClayInputProps } from './clay/ClayInput';
export { ClayChartBar, type ClayChartBarProps } from './clay/ClayChartBar';
export { ClayBadge, type ClayBadgeProps } from './clay/ClayBadge';
export { ClayAvatar, type ClayAvatarProps } from './clay/ClayAvatar';
export { ClayTooltip, type ClayTooltipProps } from './clay/ClayTooltip';
export { ClayModal, type ClayModalProps } from './clay/ClayModal';
export { ClaySkeleton, type ClaySkeletonProps } from './clay/ClaySkeleton';
export { ClayProgress, type ClayProgressProps } from './clay/ClayProgress';
export { ClaySegmentedControl, type ClaySegmentedControlProps } from './clay/ClaySegmentedControl';
export { ClayTabBar, type ClayTabBarProps } from './clay/ClayTabBar';
export { ClaySearchInput, type ClaySearchInputProps } from './clay/ClaySearchInput';

// Animation Systems
export { 
  PhysicsProvider, 
  usePhysics, 
  toSpringConfig,
  physicsPresets,
  triggerHaptic,
  useClayState,
  type PhysicsConfig,
  type PhysicsPreset,
  type ClayState,
} from './animations/SpringPhysics';

export { ClayRebound, type ClayReboundProps } from './animations/ClayRebound';
export { 
  FloatingContainer, 
  FloatingGroup,
  ParallaxLayer,
  type FloatingContainerProps,
  type FloatingGroupProps,
  type ParallaxLayerProps,
} from './animations/FloatingContainer';

// Layout
export { 
  BentoGrid, 
  BentoItem,
  BentoLayouts,
  type BentoGridProps,
  type BentoItemProps,
} from './layout/BentoGrid';
