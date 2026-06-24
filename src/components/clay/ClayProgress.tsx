import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';

export interface ClayProgressProps {
  value: number;
  max?: number;
  colorway?: 'mint' | 'blue' | 'pink' | 'lavender' | 'peach';
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  label?: string;
  indeterminate?: boolean;
  /** Animate fill on scroll entry instead of on mount */
  scrollTrigger?: boolean;
}

// Token gradient pairs — no raw hex
const colorwayGradients: Record<string, [string, string]> = {
  mint:     ['var(--mochi-sage)',         'var(--mochi-mint)'],
  blue:     ['var(--mochi-baby-blue)',    'var(--mochi-sky-blue)'],
  pink:     ['var(--mochi-blush-pink)',   'var(--mochi-soft-rose)'],
  lavender: ['var(--mochi-lavender)',     'var(--mochi-lavender-vivid)'],
  peach:    ['var(--mochi-peach-pale)',   'var(--mochi-peach)'],
};

// Same token for the value label accent colour
const colorwayAccent: Record<string, string> = {
  mint:     'var(--mochi-mint-vivid)',
  blue:     'var(--mochi-sky-blue)',
  pink:     'var(--mochi-soft-rose)',
  lavender: 'var(--mochi-lavender-vivid)',
  peach:    'var(--mochi-peach)',
};

const sizes = {
  sm: { height: 6,  fontSize: 'var(--type-micro-size, 11px)' },
  md: { height: 12, fontSize: 'var(--type-meta-size)' },
  lg: { height: 20, fontSize: 'var(--type-body-size)' },
};

export const ClayProgress: React.FC<ClayProgressProps> = ({
  value, max = 100,
  colorway = 'mint', size = 'md',
  showValue = true, label,
  indeterminate = false, scrollTrigger = false,
}) => {
  const percentage  = Math.min((value / max) * 100, 100);
  const [gradStart, gradEnd] = colorwayGradients[colorway];
  const accent      = colorwayAccent[colorway];
  const dims        = sizes[size];
  const trackRadius = `${dims.height / 2}px`;

  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const shouldAnimate = scrollTrigger ? inView : true;

  return (
    <div style={{ width: '100%' }}>
      {(label || (showValue && !indeterminate)) && (
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: 'var(--space-2)',
        }}>
          {label && (
            <span style={{
              fontSize: dims.fontSize,
              fontWeight: 500,
              fontFamily: 'var(--font-family)',
              color: 'var(--text-primary)',
            }}>{label}</span>
          )}
          {showValue && !indeterminate && (
            <span style={{
              fontSize: dims.fontSize,
              fontWeight: 700,
              fontFamily: 'var(--font-mono)',
              color: accent,
            }}>{Math.round(percentage)}%</span>
          )}
        </div>
      )}

      <div
        ref={ref}
        role="progressbar"
        aria-valuenow={indeterminate ? undefined : value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label}
        aria-busy={indeterminate}
        style={{
          height: dims.height,
          borderRadius: trackRadius,
          background: 'var(--bg-surface)',
          boxShadow: 'inset 3px 3px 6px rgba(0,0,0,0.08), inset -3px -3px 6px rgba(255,255,255,0.8)',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {indeterminate ? (
          <motion.div
            style={{
              position: 'absolute', top: 0, bottom: 0,
              width: '40%',
              borderRadius: trackRadius,
              background: `linear-gradient(90deg, ${gradStart}88, ${gradEnd})`,
            }}
            animate={{ left: ['-40%', '100%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        ) : (
          <motion.div
            animate={{ width: shouldAnimate ? `${percentage}%` : '0%' }}
            transition={{ type: 'spring', stiffness: 80, damping: 22, mass: 1 }}
            style={{
              height: '100%',
              borderRadius: trackRadius,
              background: `linear-gradient(90deg, ${gradStart}, ${gradEnd})`,
              boxShadow: `1px 1px 4px rgba(0,0,0,0.12), inset 1px 1px 2px rgba(255,255,255,0.5)`,
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ClayProgress;
