/**
 * MOCHI UI — ClayCard v2.0
 *
 * Claymorphic card with spring-physics tilt, magnetic hover,
 * optional glow, and press-down interaction.
 *
 * Perspective fix: applied to an outer wrapper div, NOT the transformed
 * element itself. Setting perspective on a self-transformed element produces
 * no 3D effect — it must be on the parent.
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
  /** Render a colored box-shadow glow on hover */
  glowOnHover?: boolean;
  glowColor?: string;
  glowRadius?: number;
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
      glowRadius = 40,
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
    const glowOpacity = useRef(0);

    const { style, setTransform } = useSpringTransform({
      mass: 1.5, tension: 200, friction: 26, ...springConfig,
    });

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
        const rotateX = (-((e.clientY - rect.top  - rect.height / 2) / (rect.height / 2))) * maxTilt;
        const rotateY = ( ((e.clientX - rect.left - rect.width  / 2) / (rect.width  / 2))) * maxTilt;
        setTransform({ rotateX, rotateY, scale: isPressed ? 0.98 : hoverScale });
        onMouseMove?.(e);
      },
      [tilt, prefersReducedMotion, maxTilt, hoverScale, isPressed, setTransform, onMouseMove]
    );

    const handleMouseEnter = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        setIsHovered(true);
        glowOpacity.current = 1;
        onMouseEnter?.(e);
      },
      [onMouseEnter]
    );

    const handleMouseLeave = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        setIsHovered(false);
        glowOpacity.current = 0;
        if (!prefersReducedMotion) setTransform({ rotateX: 0, rotateY: 0, scale: 1 });
        onMouseLeave?.(e);
      },
      [prefersReducedMotion, setTransform, onMouseLeave]
    );

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

    const sizeClasses  = { sm: 'clay-card clay-card--sm', md: 'clay-card', lg: 'clay-card clay-card--lg' };
    const variantExtra = { default: '', elevated: 'clay-card--elevated', inset: 'clay-card--inset' };

    // Glow box-shadow is layered on top of the clay shadow when hovered
    const glowShadow = glowOnHover && isHovered && !prefersReducedMotion
      ? `, 0 0 ${glowRadius}px ${Math.round(glowRadius * 0.6)}px ${glowColor}`
      : '';

    return (
      // Outer wrapper carries perspective so inner 3D transforms work correctly
      <div style={{ perspective: tilt ? '1000px' : undefined, display: fullWidth ? 'block' : 'inline-block' }}>
        <div
          ref={setRefs}
          className={`${sizeClasses[size]} ${variantExtra[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
          style={{
            ...style,
            cursor: interactive ? 'pointer' : 'default',
            boxShadow: `var(--mochi-clay-${
              isPressed ? 'pressed' : isHovered && hoverElevation ? 'elevated' : 'rest'
            })${glowShadow}`,
            transition: glowOnHover
              ? 'box-shadow var(--mochi-duration-normal) var(--mochi-ease-default)'
              : undefined,
          }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onMouseEnter={handleMouseEnter}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          {...props}
        >
          {children}
        </div>
      </div>
    );
  }
);

ClayCard.displayName = 'ClayCard';
export default ClayCard;
