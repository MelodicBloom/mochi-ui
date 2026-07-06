/**
 * MOCHI UI — ClayProgress v2.0
 *
 * Claymorphic progress bar with spring-physics fill animation
 * and optional gradient.
 */

'use client';

import React from 'react';
import { useSpring, useReducedMotion } from '../lib/spring-hooks';
import { SpringConfig } from '../lib/spring-physics';

export interface ClayProgressProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'gradient';
  springConfig?: Partial<SpringConfig>;
  showLabel?: boolean;
  labelFormat?: (value: number, max: number) => string;
  className?: string;
}

export const ClayProgress: React.FC<ClayProgressProps> = ({
  value, max = 100, size = 'md', variant = 'gradient',
  springConfig, showLabel = false, labelFormat, className = '',
}) => {
  const prefersReducedMotion = useReducedMotion();
  const fillWidth = useSpring({ from: 0, mass: 1, tension: 200, friction: 28, ...springConfig });

  React.useEffect(() => {
    fillWidth.set((value / max) * 100);
  }, [value, max, fillWidth]);

  const heights: Record<string, number> = { sm: 6, md: 12, lg: 18 };
  const h = heights[size];

  return (
    <div className={className}>
      {showLabel && (
        <div className="flex justify-between mb-1.5">
          <span className="text-sm font-medium text-[var(--mochi-text-secondary)]">
            {labelFormat ? labelFormat(value, max) : `${Math.round((value / max) * 100)}%`}
          </span>
        </div>
      )}
      <div
        className="clay-progress"
        style={{
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
      >
        <div
          style={{
            height: h,
            width: `${fillWidth.value}%`,
            borderRadius: 'var(--mochi-radius-full)',
            background: variant === 'gradient'
              ? 'linear-gradient(90deg, var(--mochi-terra-400), var(--mochi-terra-500))'
              : 'var(--mochi-terra-500)',
            boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.3), 2px 0 8px rgba(224,68,46,0.2)',
            willChange: 'width',
            transition: prefersReducedMotion ? 'none' : undefined,
          }}
        />
      </div>
    </div>
  );
};

ClayProgress.displayName = 'ClayProgress';
export default ClayProgress;