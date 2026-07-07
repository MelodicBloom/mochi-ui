/**
 * MOCHI UI — ClayTooltip v2.0
 *
 * Fixes from v2.0 audit:
 * - `scale` was set as a standalone CSS property (invalid in most browsers
 *   outside Chrome 107+); moved into transform string
 * - setTimeout-based hide race replaced with isMounted/onRest pattern
 * - Tooltip remains in DOM during exit animation via isMounted state
 */

'use client';

import React, { useRef, useState, useCallback } from 'react';
import { useSpring, useReducedMotion } from '../lib/spring-hooks';
import { SpringConfig } from '../lib/spring-physics';

export interface ClayTooltipProps {
  children: React.ReactElement;
  content: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  springConfig?: Partial<SpringConfig>;
  className?: string;
}

export const ClayTooltip: React.FC<ClayTooltipProps> = ({
  children, content, position = 'top', delay = 200, springConfig, className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const opacity = useSpring({
    from: 0, mass: 0.5, tension: 500, friction: 25, ...springConfig,
    onRest: () => { if (!isVisible) setIsMounted(false); },
  });
  const scaleSpring = useSpring({ from: 0.9, mass: 0.5, tension: 500, friction: 25, ...springConfig });
  const offset      = useSpring({ from: 4,   mass: 0.5, tension: 500, friction: 25, ...springConfig });

  const show = useCallback(() => {
    setIsMounted(true);
    setIsVisible(true);
    opacity.set(1);
    scaleSpring.set(1);
    offset.set(0);
  }, [opacity, scaleSpring, offset]);

  const hide = useCallback(() => {
    setIsVisible(false);
    opacity.set(0);
    scaleSpring.set(0.9);
    offset.set(4);
    // isMounted cleared by onRest callback once spring settles
  }, [opacity, scaleSpring, offset]);

  const onEnter = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(show, delay);
  }, [show, delay]);

  const onLeave = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    hide();
  }, [hide]);

  // Offset direction per position
  const getTransform = () => {
    const s = `scale(${scaleSpring.value})`;
    const o = offset.value;
    switch (position) {
      case 'top':    return `${s} translateX(-50%) translateY(${-8 - o}px)`;
      case 'bottom': return `${s} translateX(-50%) translateY(${ 8 + o}px)`;
      case 'left':   return `${s} translateY(-50%) translateX(${-8 - o}px)`;
      case 'right':  return `${s} translateY(-50%) translateX(${ 8 + o}px)`;
    }
  };

  const posBase: Record<string, React.CSSProperties> = {
    top:    { bottom: '100%', left: '50%',  marginBottom: 6 },
    bottom: { top:    '100%', left: '50%',  marginTop:    6 },
    left:   { right:  '100%', top:  '50%',  marginRight:  6 },
    right:  { left:   '100%', top:  '50%',  marginLeft:   6 },
  };

  const child = React.cloneElement(children, {
    onMouseEnter: onEnter, onMouseLeave: onLeave,
    onFocus: show, onBlur: hide,
    'aria-describedby': isMounted ? 'clay-tooltip' : undefined,
  });

  return (
    <span className="relative inline-block">
      {child}
      {isMounted && (
        <div
          id="clay-tooltip"
          role="tooltip"
          className={`absolute z-[--mochi-z-tooltip] pointer-events-none whitespace-nowrap ${className}`}
          style={{
            ...posBase[position],
            position: 'absolute',
            padding: 'var(--mochi-space-2) var(--mochi-space-3)',
            borderRadius: 'var(--mochi-radius-md)',
            fontSize: 'var(--mochi-text-sm)',
            fontFamily: 'var(--mochi-font-body)',
            background: 'var(--mochi-sand-800)',
            color: 'var(--mochi-text-inverse)',
            boxShadow: '4px 4px 12px rgba(0,0,0,0.2)',
            opacity: opacity.value,
            // scale is part of transform — NOT a standalone CSS property
            transform: getTransform(),
            willChange: 'transform, opacity',
          }}
        >
          {content}
        </div>
      )}
    </span>
  );
};

ClayTooltip.displayName = 'ClayTooltip';
export default ClayTooltip;
