// ── Clay Primitives ──────────────────────────────────────────────────────────
export { ClayButton }           from './clay/ClayButton';
export type { ClayButtonProps } from './clay/ClayButton';

export { ClayCard }             from './clay/ClayCard';
export type { ClayCardProps }   from './clay/ClayCard';

export { ClayModal }            from './clay/ClayModal';
export type { ClayModalProps }  from './clay/ClayModal';

export { ClaySkeleton }             from './clay/ClaySkeleton';
export type { ClaySkeletonProps }   from './clay/ClaySkeleton';

export { ClayTooltip }              from './clay/ClayTooltip';
export type { ClayTooltipProps }    from './clay/ClayTooltip';

export { ClaySlider }               from './clay/ClaySlider';
export type { ClaySliderProps }     from './clay/ClaySlider';

export { ClayToggle }               from './clay/ClayToggle';
export type { ClayToggleProps }     from './clay/ClayToggle';

export { ClayInput }                from './clay/ClayInput';
export type { ClayInputProps }      from './clay/ClayInput';

export { ClayBadge }                from './clay/ClayBadge';
export type { ClayBadgeProps }      from './clay/ClayBadge';

export { ClayAvatar }               from './clay/ClayAvatar';
export type { ClayAvatarProps }     from './clay/ClayAvatar';

export { ClayProgress }             from './clay/ClayProgress';
export type { ClayProgressProps }   from './clay/ClayProgress';

export { ClaySegmentedControl }             from './clay/ClaySegmentedControl';
export type { ClaySegmentedControlProps }   from './clay/ClaySegmentedControl';

export { ClayChartBar }             from './clay/ClayChartBar';
export type { ClayChartBarProps }   from './clay/ClayChartBar';

export { ClayToast, useToast }      from './clay/ClayToast';
export type { ToastItem, ToastVariant, ClayToastProps } from './clay/ClayToast';

export { ClayCommandPalette }       from './clay/ClayCommandPalette';
export type { CommandItem, ClayCommandPaletteProps } from './clay/ClayCommandPalette';

export { ClayDataTable }            from './clay/ClayDataTable';
export type { TableColumn, ClayDataTableProps } from './clay/ClayDataTable';

export { ClayRebound }              from './clay/ClayRebound';
export type { ClayReboundProps }    from './clay/ClayRebound';

// ── Layout ───────────────────────────────────────────────────────────────────
export { BentoGrid }                from './layout/BentoGrid';
export { FloatingContainer }        from './layout/FloatingContainer';
export type { FloatingContainerProps } from './layout/FloatingContainer';
export { FloatingGroup }            from './layout/FloatingGroup';
export type { FloatingGroupProps }  from './layout/FloatingGroup';

// ── Physics ──────────────────────────────────────────────────────────────────
export { PhysicsProvider, usePhysics, physicsPresets } from './physics/PhysicsProvider';
export type { PhysicsProviderProps, PhysicsPreset, PhysicsConfig } from './physics/PhysicsProvider';

// ── Motion ───────────────────────────────────────────────────────────────────
export { CursorOrb }                from './motion/CursorOrb';
export { SectionReveal }            from './motion/SectionReveal';
export { StaggerGrid }              from './motion/StaggerGrid';
export { MochiBounce }              from './motion/MochiBounce';
export { ScrollReveal, SplitText, ParallaxLayer, ScrollProgressBar, TextRevealBlock } from './motion/ScrollTypography';

// ── Hero ──────────────────────────────────────────────────────────────────────
export { ClayHero3D }               from './hero/ClayHero3D';
export type { ClayHero3DProps }     from './hero/ClayHero3D';

// ── Playground ────────────────────────────────────────────────────────────────
export { ClayPlayground }           from './playground/ClayPlayground';
export { SpringGraph }              from './playground/SpringGraph';

// ── Theme System ─────────────────────────────────────────────────────────────
export { MochiThemeProvider, useMochiTheme, createMochiTheme } from './theme/MochiThemeProvider';
export type { MochiTheme, ColorMode, MochiTokenOverrides } from './theme/MochiThemeProvider';
export { DarkModeToggle }           from './theme/DarkModeToggle';
