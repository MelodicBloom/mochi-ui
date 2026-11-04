import React from 'react';
import { motion } from 'motion/react';
import { withClayReducedMotion } from './withClayReducedMotion';

export interface ClaySkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  count?: number;
  animation?: 'pulse' | 'wave' | 'none';
  style?: React.CSSProperties;
}

const ClaySkeletonBase: React.FC<ClaySkeletonProps> = ({
  variant = 'text',
  width = '100%',
  height,
  count = 1,
  animation = 'pulse',
  style,
}) => {
  const getDimensions = () => {
    switch (variant) {
      case 'text': return { height: height || 16, borderRadius: 8 };
      case 'circular': return { height: height || 56, borderRadius: '50%' };
      case 'rectangular': return { height: height || 120, borderRadius: 12 };
      case 'rounded': return { height: height || 48, borderRadius: 24 };
      default: return { height: 16, borderRadius: 8 };
    }
  };

  const dims = getDimensions();

  const animations = {
    pulse: {
      opacity: [0.4, 0.8, 0.4],
      transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' as const },
    },
    wave: {
      backgroundPosition: ['-200% 0', '200% 0'],
      transition: { duration: 1.5, repeat: Infinity, ease: 'linear' as const },
    },
    none: {},
  };

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          animate={animations[animation]}
          style={{
            width,
            height: dims.height,
            borderRadius: dims.borderRadius,
            background: animation === 'wave'
              ? 'linear-gradient(90deg, var(--bg-surface) 25%, var(--bg-card) 50%, var(--bg-surface) 75%)'
              : 'var(--bg-surface)',
            backgroundSize: animation === 'wave' ? '200% 100%' : undefined,
            boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.05), inset -2px -2px 4px rgba(255,255,255,0.5)',
            marginBottom: i < count - 1 ? 12 : 0,
            ...style,
          }}
        />
      ))}
    </>
  );
};

export const ClaySkeleton = withClayReducedMotion(ClaySkeletonBase, 'ClaySkeleton');

export default ClaySkeleton;
