/**
 * MOCHI UI — ClayProgress v2.0
 *
 * Claymorphic progress bar driven exclusively by spring physics.
 * No CSS keyframe animation is used — the previous `animated` prop
 * created a dual-animation conflict where @keyframes width overrode
 * the spring-driven inline style, making the spring value meaningless.
 *
 * Use `springConfig` to customize the feel (e.g. SPRING_PRESETS.gentle
 * for slow fill, SPRING_PRESETS.snappy for instant snap).
 */

'use client';

import React, { useEffect } from 'react';
import { useSpring, useReducedMotion } from '../lib/spring-hooks';
import { SpringConfig } from '../lib/spring-physics';

export interface ClayProgressProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'gradient' | 'success' | 'warning' | 'error';
  springConfig?: Partial<SpringConfig>;
  showLabel?: boolean;
  /** Custom label renderer. Receives (value, max, percent). */
  labelFormat?: (value: number, max: number, percent: number) => string;
  /** Accessible label for screen readers */
  label?: string;
  className?: string;
}

const HEIGHTS: Record<string, number> = { sm: 6, md: 12, lg: 18 };

const VARIANT_GRADIENT: Record<string, string> = {
  default: 'linear-gradient(90deg, var(--mochi-terra-400), var(--mochi-terra-500))',
  gradient: 'linear-gradient(90deg, var(--mochi-terra-300), var(--mochi-terra-400), var(--mochi-terra-500))',
  success: 'linear-gradient(90deg, var(--mochi-sage-400), var(--mochi-sage-500))',
  warning: 'linear-gradient(90deg, var(--mochi-warning-400), var(--mochi-warning-500))',
  error:   'linear-gradient(90deg, var(--mochi-error-400), var(--mochi-error-500))',
};

export const ClayProgress: React.FC<ClayProgressProps> = ({
  value, max = 100, size = 'md', variant = 'gradient',
  springConfig, showLabel = false, labelFormat, label, className = '',
}) => {
  const prefersReducedMotion = useReducedMotion();
  const percent = Math.min(100, Math.max(0, (value / max) * 100));

  const fillWidth = useSpring({
    from: 0,
    mass: 1, tension: 200, friction: 28,
    ...springConfig,
  });

  useEffect(() => {
    fillWidth.set(prefersReducedMotion ? percent : percent);
  }, [percent, fillWidth, prefersReducedMotion]);

  const h = HEIGHTS[size];
  const displayLabel = labelFormat
    ? labelFormat(value, max, percent)
    : `${Math.round(percent)}%`;

  return (
    <div className={className}>
      {showLabel && (
        <div className="flex justify-between mb-1.5">
          <span className="text-sm font-medium" style={{ color: 'var(--mochi-text-secondary)' }}>
            {displayLabel}
          </span>
        </div>
      )}
      <div
        style={{
          position: 'relative',
          height: h,
          borderRadius: 'var(--mochi-radius-full)',
          background: 'var(--mochi-surface-inset)',
          boxShadow: 'var(--mochi-clay-inset)',
          overflow: 'hidden',
        }}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label}
      >
        <div
          style={{
            height: '100%',
            width: `${fillWidth.value}%`,
            borderRadius: 'var(--mochi-radius-full)',
            background: VARIANT_GRADIENT[variant],
            boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.3), 2px 0 8px rgba(224,68,46,0.2)',
            willChange: 'width',
          }}
        />
      </div>
    </div>
  );
};

ClayProgress.displayName = 'ClayProgress';
export default ClayProgress;
