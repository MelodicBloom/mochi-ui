/**
 * MOCHI UI — ClayToggle v2.0
 *
 * Fully controlled toggle (checked + onChange).
 * Spring syncs whenever the external `checked` prop changes,
 * fixing the previous stale-state bug where the thumb wouldn't
 * animate when a parent flipped the prop without user interaction.
 */

'use client';

import React, { useRef, useCallback, useId, useEffect } from 'react';
import { useSpring, useReducedMotion } from '../lib/spring-hooks';
import { SpringConfig } from '../lib/spring-physics';

export interface ClayToggleProps {
  /** Controlled checked state — component is fully controlled */
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  labelPosition?: 'left' | 'right';
  disabled?: boolean;
  springConfig?: Partial<SpringConfig>;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  checkedColor?: string;
  uncheckedColor?: string;
}

const THUMB_TRAVEL: Record<string, number> = {
  sm: 40 - 18 - 4,   // track - thumb - padding*2
  md: 52 - 24 - 4,
  lg: 64 - 30 - 4,
};

const SIZE_CONFIG = {
  sm: { width: 40, height: 22, thumb: 18, padding: 2 },
  md: { width: 52, height: 28, thumb: 24, padding: 2 },
  lg: { width: 64, height: 34, thumb: 30, padding: 2 },
};

export const ClayToggle: React.FC<ClayToggleProps> = ({
  checked,
  onChange,
  label,
  labelPosition = 'right',
  disabled = false,
  springConfig,
  size = 'md',
  className = '',
  checkedColor = 'var(--mochi-terra-500)',
  uncheckedColor = 'var(--mochi-surface-inset)',
}) => {
  const id = useId();
  const prefersReducedMotion = useReducedMotion();

  const thumbX     = useSpring({ from: checked ? THUMB_TRAVEL[size] : 0, mass: 0.8, tension: 400, friction: 22, ...springConfig });
  const thumbScale = useSpring({ from: 1, mass: 0.5, tension: 500, friction: 20, ...springConfig });

  // Sync spring target whenever controlled `checked` or `size` changes.
  // This was the source of the controlled/uncontrolled mismatch bug.
  useEffect(() => {
    thumbX.set(checked ? THUMB_TRAVEL[size] : 0);
  }, [checked, size, thumbX]);

  const cfg = SIZE_CONFIG[size];

  const handleClick    = useCallback(() => { if (!disabled) onChange(!checked); }, [checked, disabled, onChange]);
  const handleKeyDown  = useCallback((e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); handleClick(); }
  }, [handleClick]);

  const trackStyle: React.CSSProperties = {
    width: cfg.width, height: cfg.height,
    background: checked
      ? `linear-gradient(145deg, var(--mochi-terra-400), ${checkedColor})`
      : uncheckedColor,
    borderRadius: cfg.height / 2,
    boxShadow: checked ? 'inset 2px 2px 4px rgba(0,0,0,0.1)' : 'var(--mochi-clay-inset)',
    transition: prefersReducedMotion ? 'none' : 'background var(--mochi-duration-normal) var(--mochi-ease-default)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    display: 'inline-flex',
    alignItems: 'center',
    padding: cfg.padding,
  };

  const toggleEl = (
    <div
      role="switch" aria-checked={checked} aria-label={label}
      tabIndex={disabled ? -1 : 0} id={id}
      className={className}
      style={trackStyle}
      onClick={handleClick} onKeyDown={handleKeyDown}
      onPointerDown={() => { if (!disabled) thumbScale.set(0.9); }}
      onPointerUp={() => thumbScale.set(1)}
      onPointerLeave={() => thumbScale.set(1)}
    >
      <div style={{
        width: cfg.thumb, height: cfg.thumb, borderRadius: '50%',
        background: 'linear-gradient(145deg, var(--mochi-surface-elevated), var(--mochi-surface))',
        boxShadow: 'var(--mochi-clay-rest)',
        transform: `translateX(${thumbX.value}px) scale(${thumbScale.value})`,
        willChange: 'transform',
      }} />
    </div>
  );

  if (!label) return toggleEl;

  return (
    <label
      htmlFor={id}
      className={`inline-flex items-center gap-3 cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {labelPosition === 'left' && (
        <span className="text-sm font-medium text-[var(--mochi-text-secondary)] select-none">{label}</span>
      )}
      {toggleEl}
      {labelPosition === 'right' && (
        <span className="text-sm font-medium text-[var(--mochi-text-secondary)] select-none">{label}</span>
      )}
    </label>
  );
};

ClayToggle.displayName = 'ClayToggle';
export default ClayToggle;
