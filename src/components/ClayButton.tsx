/**
 * MOCHI UI — ClayButton v2.0
 */

'use client';

import React, { useRef, useCallback, useState } from 'react';
import { useSpringTransform, useSquish, useMagnetic, useReducedMotion } from '../lib/spring-hooks';
import { SpringConfig } from '../lib/spring-physics';

export interface ClayButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  magnetic?: boolean;
  magneticRadius?: number;
  springConfig?: Partial<SpringConfig>;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
  squish?: boolean;
  haptic?: boolean;
  className?: string;
}

export const ClayButton = React.forwardRef<HTMLButtonElement, ClayButtonProps>(
  (
    {
      variant = 'default',
      size = 'md',
      magnetic = true,
      magneticRadius = 60,
      springConfig,
      leftIcon,
      rightIcon,
      loading = false,
      fullWidth = false,
      squish = true,
      haptic = true,
      className = '',
      children,
      disabled,
      onClick,
      ...props
    },
    forwardedRef
  ) => {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const prefersReducedMotion = useReducedMotion();
    const [hapticPulse, setHapticPulse] = useState(false);

    const setRefs = useCallback(
      (node: HTMLButtonElement | null) => {
        buttonRef.current = node;
        if (typeof forwardedRef === 'function') forwardedRef(node);
        else if (forwardedRef) forwardedRef.current = node;
      },
      [forwardedRef]
    );

    const magneticStyle = magnetic && !prefersReducedMotion ? useMagnetic(buttonRef, springConfig, magneticRadius) : {};
    const squishStyle = squish && !prefersReducedMotion ? useSquish(buttonRef, springConfig) : {};

    const transformStyle: React.CSSProperties = {
      transform: `${(magneticStyle as any).transform || ''} ${(squishStyle as any).transform || ''}`.trim() || undefined,
      willChange: 'transform',
    };

    const sizeClasses = { sm: 'px-4 py-2 text-sm', md: 'px-6 py-3 text-base', lg: 'px-8 py-4 text-lg' };
    const variantClasses = {
      default: 'clay-button',
      primary: 'clay-button clay-button--primary',
      secondary: 'clay-button clay-button--secondary',
      ghost: 'clay-button clay-button--ghost',
    };

    const handleClick = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        if (haptic && !prefersReducedMotion) {
          setHapticPulse(true);
          setTimeout(() => setHapticPulse(false), 150);
        }
        onClick?.(e);
      },
      [haptic, prefersReducedMotion, onClick]
    );

    return (
      <button
        ref={setRefs}
        className={`${variantClasses[variant]} ${sizeClasses[size]} ${fullWidth ? 'w-full' : ''} ${
          disabled || loading ? 'opacity-60 cursor-not-allowed' : ''
        } ${className}`}
        style={{ ...transformStyle, position: 'relative', overflow: 'hidden' }}
        disabled={disabled || loading}
        onClick={handleClick}
        aria-busy={loading}
        {...props}
      >
        {hapticPulse && (
          <span
            className="absolute inset-0 rounded-inherit pointer-events-none"
            style={{
              background: 'radial-gradient(circle at center, rgba(255,255,255,0.4) 0%, transparent 70%)',
              animation: 'hapticPulse 150ms ease-out forwards',
            }}
          />
        )}
        {loading && (
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </span>
        )}
        <span className={`relative z-10 flex items-center justify-center gap-2 ${loading ? 'opacity-0' : ''}`}>
          {leftIcon}
          {children}
          {rightIcon}
        </span>
      </button>
    );
  }
);

ClayButton.displayName = 'ClayButton';
export default ClayButton;
