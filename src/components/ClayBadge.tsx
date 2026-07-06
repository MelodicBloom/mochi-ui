/**
 * MOCHI UI — ClayBadge v2.0
 *
 * Claymorphic badge with spring-physics scale on appearance
 * and variant color system.
 */

'use client';

import React from 'react';
import { useSpring, useReducedMotion } from '../lib/spring-hooks';
import { SpringConfig } from '../lib/spring-physics';

export interface ClayBadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'accent' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md';
  animate?: boolean;
  springConfig?: Partial<SpringConfig>;
  className?: string;
}

export const ClayBadge: React.FC<ClayBadgeProps> = ({
  children, variant = 'default', size = 'sm', animate = true, springConfig, className = '',
}) => {
  const prefersReducedMotion = useReducedMotion();
  const scale = useSpring({
    from: animate && !prefersReducedMotion ? 0 : 1,
    mass: 0.8, tension: 400, friction: 18, ...springConfig,
  });

  React.useEffect(() => {
    if (animate && !prefersReducedMotion) scale.set(1);
  }, [animate, scale, prefersReducedMotion]);

  const variantStyles: Record<string, React.CSSProperties> = {
    default: { background: 'linear-gradient(145deg, var(--mochi-surface-elevated), var(--mochi-surface))', color: 'var(--mochi-text-secondary)' },
    accent:  { background: 'linear-gradient(145deg, var(--mochi-terra-50), var(--mochi-terra-100))', color: 'var(--mochi-terra-600)' },
    success: { background: 'linear-gradient(145deg, var(--mochi-sage-50), var(--mochi-sage-100))', color: 'var(--mochi-sage-600)' },
    warning: { background: 'linear-gradient(145deg, #fffbeb, #fef3c7)', color: '#92400e' },
    error:   { background: 'linear-gradient(145deg, #fef2f2, #fee2e2)', color: '#991b1b' },
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium ${size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm'} ${className}`}
      style={{ ...variantStyles[variant], transform: `scale(${scale.value})`, willChange: 'transform', boxShadow: 'var(--mochi-clay-rest)' }}
    >
      {variant === 'error' && <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />}
      {children}
    </span>
  );
};

ClayBadge.displayName = 'ClayBadge';
export default ClayBadge;