/**
 * MOCHI UI — ClaySlider v2.0
 * 
 * Claymorphic range slider with spring-physics thumb,
 * progress fill, and value tooltip.
 */

'use client';

import React, { useRef, useCallback, useState, useEffect } from 'react';
import { useSpring, useReducedMotion } from '../lib/spring-hooks';
import { SpringConfig } from '../lib/spring-physics';

export interface ClaySliderProps {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
  onChangeEnd?: (value: number) => void;
  showTooltip?: boolean;
  showFill?: boolean;
  label?: string;
  disabled?: boolean;
  springConfig?: Partial<SpringConfig>;
  fillColor?: string;
  className?: string;
}

export const ClaySlider: React.FC<ClaySliderProps> = ({
  value,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  onChangeEnd,
  showTooltip = true,
  showFill = true,
  label,
  disabled = false,
  springConfig,
  fillColor = 'var(--mochi-terra-400)',
  className = '',
}) => {
  const prefersReducedMotion = useReducedMotion();
  const [isDragging, setIsDragging] = useState(false);
  const [showTip, setShowTip] = useState(false);

  const thumbScale = useSpring({ from: 1, mass: 0.5, tension: 500, friction: 20, ...springConfig });
  const fillWidth = useSpring({ from: ((value - min) / (max - min)) * 100, mass: 1, tension: 300, friction: 28, ...springConfig });

  useEffect(() => {
    fillWidth.set(((value - min) / (max - min)) * 100);
  }, [value, min, max]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value));
  }, [onChange]);

  const handlePointerDown = useCallback(() => {
    setIsDragging(true);
    setShowTip(true);
    thumbScale.set(1.15);
  }, [thumbScale]);

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
    setShowTip(false);
    thumbScale.set(1);
    onChangeEnd?.(value);
  }, [thumbScale, onChangeEnd, value]);

  const percent = ((value - min) / (max - min)) * 100;

  return (
    <div className={`clay-slider-wrapper ${className}`} style={{ position: 'relative', width: '100%' }}>
      {label && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <label className="text-sm font-medium" style={{ color: 'var(--mochi-text-secondary)' }}>{label}</label>
          <span className="text-sm font-mono" style={{ color: 'var(--mochi-text-tertiary)' }}>{value}</span>
        </div>
      )}
      <div style={{ position: 'relative' }}>
        {showFill && (
          <div style={{
            position: 'absolute', top: '50%', left: 0,
            height: 8, width: `${fillWidth.value}%`,
            background: `linear-gradient(90deg, ${fillColor}, var(--mochi-terra-500))`,
            borderRadius: 'var(--mochi-radius-full)',
            transform: 'translateY(-50%)',
            pointerEvents: 'none',
            zIndex: 1,
            boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.3)',
            transition: prefersReducedMotion ? 'none' : undefined,
          }} />
        )}
        <input
          type="range"
          className="clay-slider"
          min={min} max={max} step={step}
          value={value}
          disabled={disabled}
          onChange={handleChange}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          style={{ width: '100%', position: 'relative', zIndex: 2, background: 'transparent' }}
          aria-label={label}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
        />
      </div>
      {showTooltip && showTip && (
        <div style={{
          position: 'absolute',
          top: -36,
          left: `calc(${percent}% - 20px)`,
          background: 'var(--mochi-sand-800)',
          color: 'var(--mochi-text-inverse)',
          padding: '2px 8px',
          borderRadius: 'var(--mochi-radius-md)',
          fontSize: 12,
          fontFamily: 'var(--mochi-font-mono)',
          pointerEvents: 'none',
          boxShadow: '2px 2px 8px rgba(0,0,0,0.15)',
          whiteSpace: 'nowrap',
        }}>
          {value}
        </div>
      )}
    </div>
  );
};

ClaySlider.displayName = 'ClaySlider';
export default ClaySlider;
