/**
 * MOCHI UI — ClaySegmentedControl v2.0
 *
 * Claymorphic segmented control with sliding indicator
 * and spring-physics selection animation.
 */

'use client';

import React, { useRef, useEffect, useCallback } from 'react';
import { useSpring, useReducedMotion } from '../lib/spring-hooks';
import { SpringConfig } from '../lib/spring-physics';

export interface SegmentedOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

export interface ClaySegmentedControlProps {
  options: SegmentedOption[];
  value: string;
  onChange: (value: string) => void;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  springConfig?: Partial<SpringConfig>;
  className?: string;
}

export const ClaySegmentedControl: React.FC<ClaySegmentedControlProps> = ({
  options, value, onChange, size = 'md', fullWidth = false, springConfig, className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const indicatorX = useSpring({ from: 0, mass: 0.8, tension: 450, friction: 24, ...springConfig });
  const indicatorW = useSpring({ from: 0, mass: 0.8, tension: 450, friction: 24, ...springConfig });

  const updateIndicator = useCallback(() => {
    if (!containerRef.current) return;
    const idx = options.findIndex((o) => o.value === value);
    if (idx === -1) return;
    const buttons = containerRef.current.querySelectorAll<HTMLButtonElement>('[data-segment]');
    const btn = buttons[idx];
    if (!btn) return;
    const cRect = containerRef.current.getBoundingClientRect();
    const bRect = btn.getBoundingClientRect();
    indicatorX.set(bRect.left - cRect.left - 4);
    indicatorW.set(bRect.width);
  }, [value, options, indicatorX, indicatorW]);

  useEffect(() => { updateIndicator(); }, [updateIndicator]);
  useEffect(() => {
    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
  }, [updateIndicator]);

  const btnCls: Record<string, string> = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
  };

  return (
    <div
      ref={containerRef}
      className={`relative inline-flex p-1 gap-1 rounded-[var(--mochi-radius-lg)] ${fullWidth ? 'w-full' : ''} ${className}`}
      style={{ background: 'var(--mochi-surface-inset)', boxShadow: 'var(--mochi-clay-inset)' }}
    >
      <div
        style={{
          position: 'absolute', top: 4,
          left: `${indicatorX.value}px`,
          width: `${indicatorW.value}px`,
          height: 'calc(100% - 8px)',
          borderRadius: 'calc(var(--mochi-radius-lg) - 4px)',
          background: 'linear-gradient(145deg, var(--mochi-surface-elevated), var(--mochi-surface))',
          boxShadow: 'var(--mochi-clay-rest)',
          willChange: 'left, width',
          transition: prefersReducedMotion ? 'none' : undefined,
        }}
      />
      {options.map((option) => {
        const isActive = option.value === value;
        return (
          <button
            key={option.value}
            data-segment
            onClick={() => onChange(option.value)}
            className={`relative z-10 inline-flex items-center justify-center gap-1.5 font-medium border-none bg-transparent cursor-pointer rounded-[calc(var(--mochi-radius-lg)-4px)] transition-colors duration-150 ${btnCls[size]} ${fullWidth ? 'flex-1' : ''} ${isActive ? 'text-[var(--mochi-text-primary)]' : 'text-[var(--mochi-text-tertiary)] hover:text-[var(--mochi-text-secondary)]'}`}
          >
            {option.icon}{option.label}
          </button>
        );
      })}
    </div>
  );
};

ClaySegmentedControl.displayName = 'ClaySegmentedControl';
export default ClaySegmentedControl;