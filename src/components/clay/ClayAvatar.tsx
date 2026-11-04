import React from 'react';
import { motion } from 'motion/react';
import { withClayReducedMotion } from './withClayReducedMotion';

export interface ClayAvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'away' | 'offline' | 'busy';
  onClick?: () => void;
}

const sizes = {
  sm: 36,
  md: 56,
  lg: 72,
  xl: 96,
};

const statusColors = {
  online: '#4ADE80',
  away: '#FBBF24',
  offline: '#9CA3AF',
  busy: '#FB7185',
};

const ClayAvatarBase: React.FC<ClayAvatarProps> = ({
  src,
  alt = 'Avatar',
  fallback,
  size = 'md',
  status,
  onClick,
}) => {
  const dim = sizes[size];
  const initial = fallback?.[0]?.toUpperCase() || alt[0]?.toUpperCase() || '?';

  return (
    <motion.div
      style={{
        position: 'relative',
        width: dim,
        height: dim,
        borderRadius: '50%',
        overflow: 'hidden',
        boxShadow: `
          4px 4px 12px rgba(0,0,0,0.1),
          inset -3px -3px 6px rgba(0,0,0,0.05),
          inset 3px 3px 6px rgba(255,255,255,0.6)
        `,
        cursor: onClick ? 'pointer' : 'default',
        background: 'var(--bg-card)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      whileHover={onClick ? { scale: 1.1, rotate: 5 } : { scale: 1.05 }}
      whileTap={onClick ? { scale: 0.95 } : undefined}
      onClick={onClick}
    >
      {src ? (
        <img 
          src={src} 
          alt={alt} 
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover',
          }} 
        />
      ) : (
        <span style={{
          fontSize: dim * 0.4,
          fontWeight: 700,
          color: 'var(--text-secondary)',
        }}>
          {initial}
        </span>
      )}

      {/* Status indicator */}
      {status && (
        <motion.div
          style={{
            position: 'absolute',
            bottom: dim * 0.05,
            right: dim * 0.05,
            width: dim * 0.25,
            height: dim * 0.25,
            borderRadius: '50%',
            background: statusColors[status],
            border: `3px solid var(--bg-card)`,
            boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
          }}
          animate={status === 'online' ? {
            scale: [1, 1.2, 1],
          } : undefined}
          transition={status === 'online' ? {
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          } : undefined}
        />
      )}
    </motion.div>
  );
};

export const ClayAvatar = withClayReducedMotion(ClayAvatarBase, 'ClayAvatar');

export default ClayAvatar;
