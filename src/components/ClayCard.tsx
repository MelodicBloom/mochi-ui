/**
 * MOCHI UI — ClayCard v2.0
 */

'use client';

import React, { useRef, useCallback, useState } from 'react';
import { useSpringTransform, useReducedMotion } from '../lib/spring-hooks';
import { SpringConfig } from '../lib/spring-physics';

export interface ClayCardProps extends React.HTMLAttributes<HTMLDivElement> {
  tilt?: boolean;
  maxTilt?: number;
  hoverElevation?: boolean;
  hoverScale?: number;
  interactive?: boolean;
  springConfig?: Partial<SpringConfig>;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'elevated' | 'inset';
  glowOnHover?: boolean;
  glowColor?: string;
  fullWidth?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const ClayCard = React.forwardRef<HTMLDivElement, ClayCardProps>(
  (
    {
      tilt = true,
      maxTilt = 8,
      hoverElevation = true,
      hoverScale = 1.02,
      interactive = true,
      springConfig,
      size = 'md',
      variant = 'default',
      glowOnHover = false,
      glowColor = 'var(--mochi-terra-300)',
      fullWidth = false,
      className = '',
      children,
      onMouseMove,
      onMouseLeave,
      onMouseEnter,
      onPointerDown,
      onPointerUp,
      ...props
    },
    forwardedRef
  ) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const prefersReducedMotion = useReducedMotion();
    const [isHovered, setIsHovered] = useState(false);
    const [isPressed, setIsPressed] = useState(false);

    const { style, setTransform } = useSpringTransform({ mass: 1.5, tension: 200, friction: 26, ...springConfig });

    const setRefs = useCallback(
      (node: HTMLDivElement | null) => {
        cardRef.current = node;
        if (typeof forwardedRef === 'function') forwardedRef(node);
        else if (forwardedRef) forwardedRef.current = node;
      },
      [forwardedRef]
    );

    const handleMouseMove = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (!tilt || prefersReducedMotion || !cardRef.current) { onMouseMove?.(e); return; }
        const rect = cardRef.current.getBoundingClientRect();
        const rotateX = (-((e.clientY - rect.top - rect.height / 2) / (rect.height / 2))) * maxTilt;
        const rotateY = ((e.clientX - rect.left - rect.width / 2) / (rect.width / 2)) * maxTilt;
        setTransform({ rotateX, rotateY, scale: isPressed ? 0.98 : hoverScale });
        onMouseMove?.(e);
      },
      [tilt, prefersReducedMotion, maxTilt, hoverScale, isPressed, setTransform, onMouseMove]
    );

    const handleMouseLeave = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        setIsHovered(false);
        if (!prefersReducedMotion) setTransform({ rotateX: 0, rotateY: 0, scale: 1 });
        onMouseLeave?.(e);
      },
      [prefersReducedMotion, setTransform, onMouseLeave]
    );

    const handleMouseEnter = useCallback((e: React.MouseEvent<HTMLDivElement>) => { setIsHovered(true); onMouseEnter?.(e); }, [onMouseEnter]);

    const handlePointerDown = useCallback(
      (e: React.PointerEvent<HTMLDivElement>) => {
        if (interactive && !prefersReducedMotion) { setIsPressed(true); setTransform({ scale: 0.97, rotateX: 0, rotateY: 0 }); }
        onPointerDown?.(e);
      },
      [interactive, prefersReducedMotion, setTransform, onPointerDown]
    );

    const handlePointerUp = useCallback(
      (e: React.PointerEvent<HTMLDivElement>) => {
        if (interactive && !prefersReducedMotion) { setIsPressed(false); setTransform({ scale: isHovered ? hoverScale : 1, rotateX: 0, rotateY: 0 }); }
        onPointerUp?.(e);
      },
      [interactive, prefersReducedMotion, setTransform, isHovered, hoverScale, onPointerUp]
    );

    const sizeClasses = { sm: 'clay-card clay-card--sm', md: 'clay-card', lg: 'clay-card clay-card--lg' };
    const variantClasses = { default: '', elevated: 'clay-card--elevated', inset: 'clay-card--inset' };

    return (
      <div
        ref={setRefs}
        className={`${sizeClasses[size]} ${variantClasses[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
        style={{ ...style, cursor: interactive ? 'pointer' : 'default', perspective: tilt ? '1000px' : undefined }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ClayCard.displayName = 'ClayCard';
export default ClayCard;
