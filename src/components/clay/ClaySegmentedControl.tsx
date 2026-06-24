import React, { useState } from 'react';
import { motion } from 'motion/react';

export interface SegmentOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface ClaySegmentedControlProps {
  options: SegmentOption[];
  value?: string;
  onChange?: (value: string) => void;
  colorway?: 'mint' | 'blue' | 'pink' | 'lavender' | 'neutral';
  size?: 'sm' | 'md';
  fullWidth?: boolean;
}

// Token-resolved active pill backgrounds — no raw hsl()
const colorwayActive: Record<string, string> = {
  mint:     'var(--mochi-mint)',
  blue:     'var(--mochi-baby-blue)',
  pink:     'var(--mochi-blush-pink)',
  lavender: 'var(--mochi-lavender)',
  neutral:  'var(--bg-card)',
};

export const ClaySegmentedControl: React.FC<ClaySegmentedControlProps> = ({
  options, value: controlledValue, onChange,
  colorway = 'neutral', size = 'md', fullWidth = false,
}) => {
  const [internal, setInternal] = useState(options[0]?.value ?? '');
  const selected = controlledValue !== undefined ? controlledValue : internal;
  const selectedIdx = options.findIndex(o => o.value === selected);
  const activeBg = colorwayActive[colorway];

  const handleSelect = (val: string, disabled?: boolean) => {
    if (disabled) return;
    if (controlledValue === undefined) setInternal(val);
    onChange?.(val);
    try { if ('vibrate' in navigator) navigator.vibrate(5); } catch {}
  };

  const padH = size === 'sm' ? 'var(--space-4)' : 'var(--space-6)';
  const padV = size === 'sm' ? 'var(--space-2)' : 'var(--space-3)';

  return (
    <div
      role="radiogroup"
      style={{
        display: fullWidth ? 'flex' : 'inline-flex',
        padding: 'var(--space-1)',
        borderRadius: 'var(--radius-squircle-md)',
        background: 'var(--bg-surface)',
        boxShadow: 'inset 3px 3px 6px rgba(0,0,0,0.08), inset -3px -3px 6px rgba(255,255,255,0.8)',
        position: 'relative',
        width: fullWidth ? '100%' : undefined,
      }}
    >
      {/* Spring-animated active pill */}
      {selectedIdx >= 0 && (
        <motion.div
          layoutId="seg-pill"
          style={{
            position: 'absolute',
            top: 'var(--space-1)',
            bottom: 'var(--space-1)',
            width: `calc(${100 / options.length}% - var(--space-1))`,
            left: `calc(${selectedIdx * (100 / options.length)}% + calc(var(--space-1) / 2))`,
            borderRadius: 'var(--radius-squircle-sm)',
            background: activeBg,
            boxShadow: '2px 2px 6px rgba(0,0,0,0.1), inset 1px 1px 2px rgba(255,255,255,0.8)',
            zIndex: 0,
          }}
          transition={{ type: 'spring', stiffness: 420, damping: 32 }}
        />
      )}

      {options.map(opt => (
        <button
          key={opt.value}
          role="radio"
          aria-checked={selected === opt.value}
          aria-disabled={opt.disabled}
          tabIndex={opt.disabled ? -1 : 0}
          onClick={() => handleSelect(opt.value, opt.disabled)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight') {
              const next = options[(selectedIdx + 1) % options.length];
              if (next && !next.disabled) handleSelect(next.value);
            }
            if (e.key === 'ArrowLeft') {
              const prev = options[(selectedIdx - 1 + options.length) % options.length];
              if (prev && !prev.disabled) handleSelect(prev.value);
            }
          }}
          style={{
            position: 'relative', zIndex: 1,
            flex: fullWidth ? 1 : undefined,
            padding: `${padV} ${padH}`,
            borderRadius: 'var(--radius-squircle-sm)',
            border: 'none', background: 'transparent',
            color: selected === opt.value ? 'var(--text-primary)' : 'var(--text-secondary)',
            fontSize: size === 'sm' ? 'var(--type-meta-size)' : 'var(--type-body-size)',
            fontWeight: selected === opt.value ? 600 : 500,
            fontFamily: 'var(--font-family)',
            cursor: opt.disabled ? 'not-allowed' : 'pointer',
            opacity: opt.disabled ? 0.4 : 1,
            display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
            transition: 'color 0.15s ease',
            whiteSpace: 'nowrap',
            minHeight: 32,
          }}
        >
          {opt.icon}
          {opt.label}
        </button>
      ))}
    </div>
  );
};

export default ClaySegmentedControl;
