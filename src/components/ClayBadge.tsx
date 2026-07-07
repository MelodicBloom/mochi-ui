/**
 * MOCHI UI — ClayBadge v2.0
 *
 * Claymorphic badge with spring-physics scale on appearance.
 * All variants now use design tokens exclusively — previously
 * warning/error used hardcoded amber/red hex values that bypassed
 * dark mode and theme overrides.
 */

'use client';

import React, { useEffect } from 'react';
import { useSpring, useReducedMotion } from '../lib/spring-hooks';
import { SpringConfig } from '../lib/spring-physics';

export interface ClayBadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'accent' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md';
  animate?: boolean;
  dot?: boolean;
  springConfig?: Partial<SpringConfig>;
  className?: string;
}

export const ClayBadge: React.FC<ClayBadgeProps> = ({
  children, variant = 'default', size = 'sm', animate = true, dot, springConfig, className = '',
}) => {
  const prefersReducedMotion = useReducedMotion();
  const scale = useSpring({
    from: animate && !prefersReducedMotion ? 0 : 1,
    mass: 0.8, tension: 400, friction: 18, ...springConfig,
  });

  useEffect(() => {
    if (animate && !prefersReducedMotion) scale.set(1);
  }, [animate, scale, prefersReducedMotion]);

  // All variants use semantic tokens — respects dark mode and theme overrides
  const variantStyles: Record<string, React.CSSProperties> = {
    default: {
      background: 'linear-gradient(145deg, var(--mochi-surface-elevated), var(--mochi-surface))',
      color: 'var(--mochi-text-secondary)',
    },
    accent: {
      background: 'linear-gradient(145deg, var(--mochi-terra-50), var(--mochi-terra-100))',
      color: 'var(--mochi-terra-600)',
    },
    success: {
      background: 'linear-gradient(145deg, var(--mochi-sage-50), var(--mochi-sage-100))',
      color: 'var(--mochi-sage-600)',
    },
    warning: {
      background: 'linear-gradient(145deg, var(--mochi-warning-50), var(--mochi-warning-100))',
      color: 'var(--mochi-warning-800)',
    },
    error: {
      background: 'linear-gradient(145deg, var(--mochi-error-50), var(--mochi-error-100))',
      color: 'var(--mochi-error-800)',
    },
  };

  const dotColor: Record<string, string> = {
    default: 'var(--mochi-text-tertiary)',
    accent:  'var(--mochi-terra-500)',
    success: 'var(--mochi-sage-500)',
    warning: 'var(--mochi-warning-500)',
    error:   'var(--mochi-error-500)',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium ${
        size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm'
      } ${className}`}
      style={{
        ...variantStyles[variant],
        transform: `scale(${scale.value})`,
        willChange: 'transform',
        boxShadow: 'var(--mochi-clay-rest)',
      }}
    >
      {dot && (
        <span
          style={{ width: 6, height: 6, borderRadius: '50%', background: dotColor[variant], flexShrink: 0 }}
        />
      )}
      {children}
    </span>
  );
};

ClayBadge.displayName = 'ClayBadge';
export default ClayBadge;
