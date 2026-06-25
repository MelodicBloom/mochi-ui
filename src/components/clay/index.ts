/**
 * MOCHI UI — Clay Components Barrel Export
 * Includes all claymorphic components and ThemeProvider.
 */

// ── Buttons & Actions ──────────────────────────────
export { ClayButton }              from './ClayButton';
export type { ClayButtonProps }    from './ClayButton';

// ── Layout & Containers ───────────────────────────
export { ClayCard }                from './ClayCard';
export type { ClayCardProps }      from './ClayCard';

export { ClayModal }               from './ClayModal';
export type { ClayModalProps }     from './ClayModal';

// ── Form Controls ─────────────────────────────────
export { ClayInput }               from './ClayInput';
export type { ClayInputProps }     from './ClayInput';

export { ClayToggle }              from './ClayToggle';
export type { ClayToggleProps }    from './ClayToggle';

export { ClaySlider }              from './ClaySlider';
export type { ClaySliderProps }    from './ClaySlider';

export { ClaySegmentedControl }                        from './ClaySegmentedControl';
export type { ClaySegmentedControlProps, SegmentOption } from './ClaySegmentedControl';

// ── Feedback & Status ─────────────────────────────
export { ClayProgress }            from './ClayProgress';
export type { ClayProgressProps }  from './ClayProgress';

export { ClayBadge }               from './ClayBadge';
export type { ClayBadgeProps }     from './ClayBadge';

export { ClayToast }               from './ClayToast';
export type { ClayToastProps }     from './ClayToast';

export { ClaySkeleton }            from './ClaySkeleton';
export type { ClaySkeletonProps }  from './ClaySkeleton';

// ── Overlays & Floating UI ────────────────────────
export { ClayTooltip }             from './ClayTooltip';
export type { ClayTooltipProps }   from './ClayTooltip';

// ── Data Display ──────────────────────────────────
export { ClayAvatar }              from './ClayAvatar';
export type { ClayAvatarProps }    from './ClayAvatar';

export { ClayChartBar }            from './ClayChartBar';
export type { ClayChartBarProps }  from './ClayChartBar';

export { ClayDataTable }           from './ClayDataTable';
export type { ClayDataTableProps } from './ClayDataTable';

export { ClayCommandPalette }                   from './ClayCommandPalette';
export type { ClayCommandPaletteProps }         from './ClayCommandPalette';

// ── Theme ─────────────────────────────────────────
export { ThemeProvider, useTheme } from '../../providers/ThemeProvider';
export type { ThemeProviderProps } from '../../providers/ThemeProvider';
