/**
 * MOCHI UI — ClayTooltip v2.0
 *
 * Claymorphic tooltip with smart positioning, spring-physics
 * entrance, and arrow indicator.
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
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const opacity = useSpring({ from: 0, mass: 0.5, tension: 500, friction: 25, ...springConfig });
  const scale  = useSpring({ from: 0.9, mass: 0.5, tension: 500, friction: 25, ...springConfig });
  const offset = useSpring({ from: 4, mass: 0.5, tension: 500, friction: 25, ...springConfig });

  const show = useCallback(() => {
    setIsVisible(true); opacity.set(1); scale.set(1); offset.set(0);
  }, [opacity, scale, offset]);

  const hide = useCallback(() => {
    opacity.set(0); scale.set(0.9); offset.set(4);
    setTimeout(() => setIsVisible(false), 200);
  }, [opacity, scale, offset]);

  const onEnter = useCallback(() => { timerRef.current = setTimeout(show, delay); }, [show, delay]);
  const onLeave = useCallback(() => { if (timerRef.current) clearTimeout(timerRef.current); hide(); }, [hide]);

  const posStyle: Record<string, React.CSSProperties> = {
    top:    { bottom: '100%', left: '50%', transform: `translateX(-50%) translateY(${-8 - offset.value}px)`, marginBottom: 6 },
    bottom: { top: '100%',   left: '50%', transform: `translateX(-50%) translateY(${8 + offset.value}px)`,  marginTop: 6 },
    left:   { right: '100%', top: '50%',  transform: `translateY(-50%) translateX(${-8 - offset.value}px)`, marginRight: 6 },
    right:  { left: '100%',  top: '50%',  transform: `translateY(-50%) translateX(${8 + offset.value}px)`,  marginLeft: 6 },
  };

  const child = React.cloneElement(children, {
    onMouseEnter: onEnter, onMouseLeave: onLeave, onFocus: show, onBlur: hide,
  });

  return (
    <span className="relative inline-block">
      {child}
      {isVisible && (
        <div
          role="tooltip"
          className={`absolute z-[999] px-3 py-1.5 rounded-[var(--mochi-radius-md)] text-sm pointer-events-none whitespace-nowrap ${className}`}
          style={{
            ...posStyle[position],
            position: 'absolute',
            opacity: opacity.value,
            transform: posStyle[position].transform,
            scale: `${scale.value}`,
            willChange: 'transform, opacity',
            background: 'var(--mochi-sand-800, #2d2416)',
            color: '#fff',
            fontFamily: 'var(--mochi-font-body)',
            boxShadow: '4px 4px 12px rgba(0,0,0,0.2)',
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