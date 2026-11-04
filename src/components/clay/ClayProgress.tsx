import React from 'react';
import { motion } from 'motion/react';
import { withClayReducedMotion } from './withClayReducedMotion';

export interface ClayProgressProps {
  value: number;
  max?: number;
  colorway?: 'mint' | 'blue' | 'pink' | 'lavender' | 'peach';
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  label?: string;
  indeterminate?: boolean;
}

const colorwayColors = {
  mint: '#A3E635',
  blue: '#7DD3FC',
  pink: '#FDA4AF',
  lavender: '#C084FC',
  peach: '#FB923C',
};

const sizes = {
  sm: { height: 6, fontSize: 11 },
  md: { height: 12, fontSize: 13 },
  lg: { height: 20, fontSize: 14 },
};

const ClayProgressBase: React.FC<ClayProgressProps> = ({
  value,
  max = 100,
  colorway = 'mint',
  size = 'md',
  showValue = true,
  label,
  indeterminate = false,
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  const color = colorwayColors[colorway];
  const dims = sizes[size];

  return (
    <div style={{ width: '100%' }}>
      {(label || showValue) && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 8,
        }}>
          {label && (
            <span style={{ fontSize: dims.fontSize, fontWeight: 500, color: 'var(--text-primary)' }}>
              {label}
            </span>
          )}
          {showValue && !indeterminate && (
            <span style={{ fontSize: dims.fontSize, fontWeight: 700, color }}>
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}

      <div style={{
        height: dims.height,
        borderRadius: dims.height / 2,
        background: 'var(--bg-surface)',
        boxShadow: 'inset 3px 3px 6px rgba(0,0,0,0.08), inset -3px -3px 6px rgba(255,255,255,0.8)',
        overflow: 'hidden',
        position: 'relative',
      }}>
        {indeterminate ? (
          <motion.div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              width: '40%',
              borderRadius: dims.height / 2,
              background: `linear-gradient(90deg, ${color}88, ${color})`,
              boxShadow: `1px 1px 4px ${color}44`,
            }}
            animate={{
              left: ['-40%', '100%'],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ) : (
          <motion.div
            animate={{ width: `${percentage}%` }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            style={{
              height: '100%',
              borderRadius: dims.height / 2,
              background: `linear-gradient(90deg, ${color}cc, ${color})`,
              boxShadow: `
                1px 1px 4px ${color}44,
                inset 1px 1px 2px rgba(255,255,255,0.5)
              `,
            }}
          />
        )}
      </div>
    </div>
  );
};

export const ClayProgress = withClayReducedMotion(ClayProgressBase, 'ClayProgress');

export default ClayProgress;
