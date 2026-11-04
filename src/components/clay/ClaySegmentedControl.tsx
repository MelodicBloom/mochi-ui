import React, { useState } from 'react';
import { motion } from 'motion/react';
import { withClayReducedMotion } from './withClayReducedMotion';

export interface ClaySegmentedControlProps {
  options: { value: string; label: string; icon?: React.ReactNode }[];
  value?: string;
  onChange?: (value: string) => void;
  colorway?: 'mint' | 'blue' | 'pink' | 'lavender' | 'neutral';
  size?: 'sm' | 'md';
}

const colorwayBg = {
  mint: 'linear-gradient(160deg, #D6F7E6, var(--mochi-mint-soft, #8FE0B8))',
  blue: 'hsl(200deg 90% 90%)',
  pink: 'hsl(350deg 90% 90%)',
  lavender: 'hsl(270deg 70% 90%)',
  neutral: 'hsl(30deg 20% 92%)',
};

const ClaySegmentedControlBase: React.FC<ClaySegmentedControlProps> = ({
  options,
  value: controlledValue,
  onChange,
  colorway = 'neutral',
  size = 'md',
}) => {
  const [internalValue, setInternalValue] = useState(options[0]?.value);
  const selected = controlledValue !== undefined ? controlledValue : internalValue;

  const handleSelect = (val: string) => {
    if (controlledValue === undefined) setInternalValue(val);
    onChange?.(val);

    if ('vibrate' in navigator) navigator.vibrate(5);
  };

  const selectedIndex = options.findIndex(o => o.value === selected);
  const bg = colorwayBg[colorway];

  return (
    <div style={{
      display: 'inline-flex',
      padding: 4,
      borderRadius: 16,
      background: 'var(--bg-surface)',
      boxShadow: 'inset 3px 3px 6px rgba(0,0,0,0.08), inset -3px -3px 6px rgba(255,255,255,0.8)',
      position: 'relative',
    }}>
      {/* Sliding background */}
      <motion.div
        layoutId="segmented-bg"
        style={{
          position: 'absolute',
          top: 4,
          bottom: 4,
          width: `calc(${100 / options.length}% - 4px)`,
          left: `calc(${selectedIndex * (100 / options.length)}% + 2px)`,
          borderRadius: 12,
          background: bg,
          // Extruded rim + soft glow (ref styleguide selected pill): outer lift layers,
          // a 1px light rim, top highlight and bottom inner shade.
          boxShadow: [
            '0 1px 2px rgba(90,80,120,0.10)',
            '0 6px 14px rgba(90,80,120,0.14)',
            '0 0 0 1px rgba(255,255,255,0.85)',
            '0 0 14px 2px color-mix(in srgb, var(--mochi-mint-soft, #8FE0B8) 45%, transparent)',
            'inset 0 2px 3px rgba(255,255,255,0.85)',
            'inset 0 -3px 6px rgba(80,60,120,0.12)',
          ].join(', '),
          zIndex: 0,
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      />

      {options.map(option => (
        <button
          key={option.value}
          onClick={() => handleSelect(option.value)}
          style={{
            position: 'relative',
            zIndex: 1,
            padding: size === 'sm' ? '6px 16px' : '10px 24px',
            borderRadius: 12,
            border: 'none',
            background: 'transparent',
            color: selected === option.value ? 'var(--text-primary)' : 'var(--text-secondary)',
            fontSize: size === 'sm' ? 13 : 14,
            fontWeight: selected === option.value ? 600 : 500,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            transition: 'color 0.2s',
            whiteSpace: 'nowrap',
          }}
        >
          {option.icon}
          {option.label}
        </button>
      ))}
    </div>
  );
};

export const ClaySegmentedControl = withClayReducedMotion(ClaySegmentedControlBase, 'ClaySegmentedControl');

export default ClaySegmentedControl;
