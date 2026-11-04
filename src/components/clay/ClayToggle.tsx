import React, { useState, useCallback } from 'react';
import { motion, useSpring, useTransform } from 'motion/react';
import { withClayReducedMotion } from './withClayReducedMotion';

export interface ClayToggleProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  colorway?: 'mint' | 'blue' | 'pink' | 'lavender';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  label?: string;
}

const colorwayColors = {
  mint: { active: 'var(--mochi-mint-soft, #8FE0B8)', knob: '#ffffff' },
  blue: { active: 'hsl(200deg 90% 85%)', knob: '#ffffff' },
  pink: { active: 'hsl(350deg 90% 85%)', knob: '#ffffff' },
  lavender: { active: 'hsl(270deg 70% 85%)', knob: '#ffffff' },
};

const sizes = {
  sm: { width: 48, height: 28, knob: 22 },
  md: { width: 64, height: 36, knob: 28 },
  lg: { width: 80, height: 44, knob: 36 },
};

const ClayToggleBase: React.FC<ClayToggleProps> = ({
  checked: controlledChecked,
  onChange,
  colorway = 'mint',
  size = 'md',
  disabled = false,
  label,
}) => {
  const [internalChecked, setInternalChecked] = useState(false);
  const isChecked = controlledChecked !== undefined ? controlledChecked : internalChecked;

  const colors = colorwayColors[colorway];
  const dims = sizes[size];

  // Spring for knob position
  const springConfig = { stiffness: 400, damping: 25, mass: 0.8 };
  const knobX = useSpring(isChecked ? dims.width - dims.knob - 4 : 4, springConfig);

  // Spring for scale (squish effect)
  const scale = useSpring(1, { stiffness: 500, damping: 20 });

  // Shadow animation
  const shadowX = useTransform(knobX, (x) => x > dims.width / 2 ? -2 : 2);

  const handleToggle = useCallback(() => {
    if (disabled) return;

    const newValue = !isChecked;

    // Squish animation on toggle
    scale.set(0.9);
    setTimeout(() => scale.set(1), 150);

    // Move knob
    knobX.set(newValue ? dims.width - dims.knob - 4 : 4);

    // Haptic
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(newValue ? [10, 5, 15] : [8]);
    }

    if (controlledChecked === undefined) {
      setInternalChecked(newValue);
    }
    onChange?.(newValue);
  }, [isChecked, disabled, onChange, controlledChecked, knobX, scale, dims]);

  return (
    <div 
      className="clay-toggle-wrapper"
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 12,
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {label && (
        <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>
          {label}
        </span>
      )}

      <motion.div
        className="clay-toggle"
        style={{
          width: dims.width,
          height: dims.height,
          borderRadius: dims.height / 2,
          background: isChecked ? colors.active : 'var(--bg-surface)',
          boxShadow: `
            inset 4px 4px 8px rgba(0,0,0,0.1),
            inset -4px -4px 8px rgba(255,255,255,0.8)
          `,
          cursor: disabled ? 'not-allowed' : 'pointer',
          scale,
        }}
        onClick={handleToggle}
        whileTap={{ scale: 0.95 }}
        data-checked={isChecked}
      >
        <motion.div
          className="clay-toggle__knob"
          style={{
            width: dims.knob,
            height: dims.knob,
            borderRadius: '50%',
            background: `radial-gradient(circle at 35% 35%, ${colors.knob}, #f0f0f0)`,
            x: knobX,
            y: (dims.height - dims.knob) / 2,
            boxShadow: useTransform(
              shadowX,
              (sx) => `
                ${sx}px 2px 6px rgba(0,0,0,0.15),
                ${-sx}px -1px 3px rgba(255,255,255,0.9)
              `
            ),
          }}
        />
      </motion.div>
    </div>
  );
};

export const ClayToggle = withClayReducedMotion(ClayToggleBase, 'ClayToggle');

export default ClayToggle;
