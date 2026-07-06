/**
 * MOCHI UI — ClayInput v2.0
 *
 * Claymorphic text input with focus spring animation,
 * floating label, and validation states.
 */

'use client';

import React, { useRef, useState, useCallback } from 'react';
import { useSpring, useReducedMotion } from '../lib/spring-hooks';
import { SpringConfig } from '../lib/spring-physics';

export interface ClayInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  helperText?: string;
  error?: string;
  success?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  floatingLabel?: boolean;
  onChange: (value: string) => void;
  springConfig?: Partial<SpringConfig>;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  wrapperClassName?: string;
}

export const ClayInput = React.forwardRef<HTMLInputElement, ClayInputProps>(
  ({ label, helperText, error, success = false, leftIcon, rightIcon, floatingLabel = true,
     onChange, springConfig, size = 'md', className = '', wrapperClassName = '',
     value, placeholder, disabled, ...props }, forwardedRef) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isFocused, setIsFocused] = useState(false);
    const [isFilled, setIsFilled] = useState(!!value);
    const prefersReducedMotion = useReducedMotion();

    const focusRing = useSpring({ from: 0, mass: 0.8, tension: 400, friction: 25, ...springConfig });
    const labelY = useSpring({ from: 0, mass: 0.5, tension: 500, friction: 22, ...springConfig });
    const labelScale = useSpring({ from: 1, mass: 0.5, tension: 500, friction: 22, ...springConfig });

    React.useEffect(() => {
      if (floatingLabel) {
        const shouldFloat = isFocused || isFilled;
        labelY.set(shouldFloat ? -24 : 0);
        labelScale.set(shouldFloat ? 0.85 : 1);
      }
    }, [isFocused, isFilled, floatingLabel, labelY, labelScale]);

    const handleFocus = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true); focusRing.set(1); props.onFocus?.(e);
    }, [focusRing, props]);

    const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false); focusRing.set(0); setIsFilled(!!e.target.value); props.onBlur?.(e);
    }, [focusRing, props]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value); setIsFilled(!!e.target.value);
    }, [onChange]);

    const sizeConfig = {
      sm: { padding: '0.5rem 0.75rem', fontSize: 'var(--mochi-text-sm)', height: '36px' },
      md: { padding: '0.75rem 1rem', fontSize: 'var(--mochi-text-base)', height: '44px' },
      lg: { padding: '1rem 1.25rem', fontSize: 'var(--mochi-text-lg)', height: '52px' },
    };
    const config = sizeConfig[size];
    const padH = config.padding.split(' ')[1];

    const getBorderColor = () => {
      if (error) return 'var(--mochi-terra-500)';
      if (success) return 'var(--mochi-sage-500)';
      if (isFocused) return 'var(--mochi-terra-300)';
      return 'transparent';
    };

    const inputStyle: React.CSSProperties = {
      width: '100%', height: config.height,
      padding: floatingLabel ? `${config.padding.split(' ')[0]} ${padH} 0.25rem ${padH}` : config.padding,
      fontSize: config.fontSize, fontFamily: 'var(--mochi-font-body)',
      color: 'var(--mochi-text-primary)', background: 'var(--mochi-surface)',
      border: 'none', borderRadius: 'var(--mochi-radius-lg)',
      boxShadow: `var(--mochi-clay-inset), 0 0 0 ${focusRing.value * 2}px ${getBorderColor()}`,
      outline: 'none',
      transition: prefersReducedMotion ? 'none' : 'box-shadow var(--mochi-duration-normal) var(--mochi-ease-default)',
    };

    const labelStyle: React.CSSProperties = floatingLabel
      ? {
          position: 'absolute', left: padH, top: '50%',
          transform: `translateY(${labelY.value}px) scale(${labelScale.value})`,
          transformOrigin: 'left center',
          fontSize: isFocused || isFilled ? 'var(--mochi-text-xs)' : config.fontSize,
          color: isFocused ? 'var(--mochi-terra-500)' : 'var(--mochi-text-tertiary)',
          pointerEvents: 'none', willChange: 'transform',
          transition: prefersReducedMotion ? 'none' : 'color var(--mochi-duration-fast) var(--mochi-ease-default)',
        }
      : {
          display: 'block', marginBottom: 'var(--mochi-space-2)',
          fontSize: 'var(--mochi-text-sm)', fontWeight: 'var(--mochi-weight-medium)',
          color: 'var(--mochi-text-secondary)',
        };

    const setRefs = useCallback((node: HTMLInputElement | null) => {
      inputRef.current = node;
      if (typeof forwardedRef === 'function') forwardedRef(node);
      else if (forwardedRef) forwardedRef.current = node;
    }, [forwardedRef]);

    return (
      <div className={`w-full ${wrapperClassName}`}>
        {label && !floatingLabel && <label style={labelStyle}>{label}</label>}
        <div className="relative">
          {label && floatingLabel && <label style={labelStyle}>{label}</label>}
          {leftIcon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--mochi-text-tertiary)] pointer-events-none z-10">{leftIcon}</span>}
          <input
            ref={setRefs}
            className={`${leftIcon ? 'pl-10' : ''} ${rightIcon ? 'pr-10' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
            style={inputStyle} value={value} onChange={handleChange}
            onFocus={handleFocus} onBlur={handleBlur}
            placeholder={floatingLabel ? undefined : placeholder}
            disabled={disabled} aria-invalid={!!error}
            aria-describedby={error ? 'clay-input-error' : helperText ? 'clay-input-helper' : undefined}
            {...props}
          />
          {rightIcon && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--mochi-text-tertiary)]">{rightIcon}</span>}
        </div>
        {(helperText || error) && (
          <div className="mt-1.5">
            {error
              ? <p id="clay-input-error" className="text-xs text-[var(--mochi-terra-500)]">{error}</p>
              : <p id="clay-input-helper" className="text-xs text-[var(--mochi-text-tertiary)]">{helperText}</p>}
          </div>
        )}
      </div>
    );
  }
);

ClayInput.displayName = 'ClayInput';
export default ClayInput;