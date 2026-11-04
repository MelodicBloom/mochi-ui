import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, useSpring, useTransform, useMotionValue } from 'motion/react';
import { withClayReducedMotion } from './withClayReducedMotion';

export interface ClaySliderProps {
  value?: number;
  min?: number;
  max?: number;
  step?: number;
  onChange?: (value: number) => void;
  colorway?: 'mint' | 'blue' | 'pink' | 'lavender' | 'peach';
  showTicks?: boolean;
  label?: string;
  disabled?: boolean;
}

const colorwayGradients = {
  mint: 'linear-gradient(90deg, #A3E635, #86EFAC)',
  blue: 'linear-gradient(90deg, #7DD3FC, #38BDF8)',
  pink: 'linear-gradient(90deg, #FDA4AF, #FB7185)',
  lavender: 'linear-gradient(90deg, #C084FC, #A78BFA)',
  peach: 'linear-gradient(90deg, #FB923C, #FDBA74)',
};

const ClaySliderBase: React.FC<ClaySliderProps> = ({
  value: controlledValue,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  colorway = 'mint',
  showTicks = false,
  label,
  disabled = false,
}) => {
  const [internalValue, setInternalValue] = useState(min);
  const value = controlledValue !== undefined ? controlledValue : internalValue;

  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Spring for knob position
  const knobX = useSpring(0, { stiffness: 300, damping: 30, mass: 0.5 });
  const knobScale = useSpring(1, { stiffness: 400, damping: 20 });

  // Spring for fill width
  const fillWidth = useSpring(0, { stiffness: 300, damping: 30 });

  const percentage = ((value - min) / (max - min)) * 100;

  // Update positions when value changes
  useEffect(() => {
    if (trackRef.current) {
      const rect = trackRef.current.getBoundingClientRect();
      const x = (percentage / 100) * rect.width;
      knobX.set(x);
      fillWidth.set(x);
    }
  }, [value, percentage, knobX, fillWidth]);

  const handleInteraction = useCallback((clientX: number) => {
    if (!trackRef.current || disabled) return;

    const rect = trackRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const pct = (x / rect.width) * 100;
    const rawValue = min + (pct / 100) * (max - min);
    const steppedValue = Math.round(rawValue / step) * step;
    const clampedValue = Math.max(min, Math.min(max, steppedValue));

    knobX.set(x);
    fillWidth.set(x);

    if (controlledValue === undefined) {
      setInternalValue(clampedValue);
    }
    onChange?.(clampedValue);

    // Granular haptic feedback
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator && step > 0) {
      navigator.vibrate(3);
    }
  }, [min, max, step, disabled, onChange, controlledValue, knobX, fillWidth]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    knobScale.set(1.2);
    handleInteraction(e.clientX);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    knobScale.set(1.2);
    handleInteraction(e.touches[0].clientX);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) handleInteraction(e.clientX);
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging) handleInteraction(e.touches[0].clientX);
    };
    const handleEnd = () => {
      setIsDragging(false);
      knobScale.set(1);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging, handleInteraction, knobScale]);

  const gradient = colorwayGradients[colorway];

  return (
    <div className="clay-slider-wrapper" style={{ opacity: disabled ? 0.5 : 1 }}>
      {label && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          marginBottom: 8,
          fontSize: 14,
          fontWeight: 500,
        }}>
          <span>{label}</span>
          <span style={{ color: 'var(--text-secondary)' }}>{value}</span>
        </div>
      )}

      <div className="clay-slider" style={{ height: 48 }}>
        <div 
          ref={trackRef}
          className="clay-slider__track"
          style={{
            width: '100%',
            height: 12,
            borderRadius: 999,
            background: 'var(--bg-surface)',
            boxShadow: 'inset 3px 3px 6px rgba(0,0,0,0.08), inset -3px -3px 6px rgba(255,255,255,0.8)',
            position: 'relative',
            cursor: disabled ? 'not-allowed' : 'pointer',
          }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          {/* Fill */}
          <motion.div
            className="clay-slider__fill"
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              height: '100%',
              borderRadius: 999,
              background: gradient,
              width: fillWidth,
              boxShadow: '1px 1px 3px rgba(0,0,0,0.1), inset 1px 1px 2px rgba(255,255,255,0.5)',
            }}
          />

          {/* Knob */}
          <motion.div
            className="clay-slider__knob"
            style={{
              position: 'absolute',
              top: '50%',
              x: knobX,
              y: '-50%',
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: 'radial-gradient(circle at 35% 35%, #ffffff, #f0f0f0)',
              boxShadow: `
                3px 3px 8px rgba(0,0,0,0.15),
                -2px -2px 4px rgba(255,255,255,0.9),
                inset 1px 1px 2px rgba(255,255,255,1)
              `,
              scale: knobScale,
              cursor: disabled ? 'not-allowed' : isDragging ? 'grabbing' : 'grab',
              zIndex: 10,
            }}
          />
        </div>

        {/* Ticks */}
        {showTicks && (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            marginTop: 4,
            padding: '0 16px',
          }}>
            {[min, (min + max) / 2, max].map((tick) => (
              <span key={tick} style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                {Math.round(tick)}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const ClaySlider = withClayReducedMotion(ClaySliderBase, 'ClaySlider');

export default ClaySlider;
