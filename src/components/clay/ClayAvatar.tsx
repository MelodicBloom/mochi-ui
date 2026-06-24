import React, { useState } from 'react';
import { motion } from 'motion/react';

export interface ClayAvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'away' | 'offline' | 'busy';
  colorway?: 'mint' | 'lavender' | 'blue' | 'pink' | 'peach' | 'neutral';
  onClick?: () => void;
}

// px dimensions — no tokens needed for numeric sizing
const sizes = { xs: 28, sm: 36, md: 56, lg: 72, xl: 96 };

// Token-resolved status colours — no raw hex
const statusTokens: Record<string, string> = {
  online:  'var(--mochi-mint-vivid)',
  away:    'var(--mochi-peach)',
  offline: 'var(--text-tertiary)',
  busy:    'var(--mochi-soft-rose)',
};

// Fallback avatar bg when no image — colorway accent
const fallbackBg: Record<string, string> = {
  mint:     'var(--mochi-mint)',
  lavender: 'var(--mochi-lavender)',
  blue:     'var(--mochi-baby-blue)',
  pink:     'var(--mochi-blush-pink)',
  peach:    'var(--mochi-peach-pale)',
  neutral:  'var(--bg-inset)',
};

export const ClayAvatar: React.FC<ClayAvatarProps> = ({
  src, alt = 'Avatar', fallback,
  size = 'md', status, colorway = 'neutral', onClick,
}) => {
  const [imgErr, setImgErr] = useState(false);
  const dim     = sizes[size];
  const initial = fallback?.[0]?.toUpperCase() || alt[0]?.toUpperCase() || '?';
  const showImg = src && !imgErr;

  return (
    <motion.div
      role={onClick ? 'button' : 'img'}
      aria-label={alt}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter') onClick(); } : undefined}
      style={{
        position: 'relative',
        width: dim, height: dim,
        borderRadius: '50%',
        overflow: 'hidden',
        boxShadow: '4px 4px 12px rgba(0,0,0,0.1), inset -3px -3px 6px rgba(0,0,0,0.05), inset 3px 3px 6px rgba(255,255,255,0.6)',
        cursor: onClick ? 'pointer' : 'default',
        background: showImg ? 'var(--bg-card)' : fallbackBg[colorway],
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}
      whileHover={onClick ? { scale: 1.1, rotate: 4 } : { scale: 1.04 }}
      whileTap={onClick ? { scale: 0.95 } : undefined}
      onClick={onClick}
    >
      {showImg ? (
        <img
          src={src}
          alt={alt}
          onError={() => setImgErr(true)}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : (
        <span style={{
          // Scale initial letter proportionally to avatar size
          fontSize: `calc(${dim}px * 0.38)`,
          fontWeight: 700,
          fontFamily: 'var(--font-family)',
          color: 'var(--text-primary)',
          lineHeight: 1,
          userSelect: 'none',
        }}>
          {initial}
        </span>
      )}

      {/* Status dot */}
      {status && (
        <motion.div
          aria-label={`Status: ${status}`}
          style={{
            position: 'absolute',
            bottom: `${dim * 0.05}px`,
            right:  `${dim * 0.05}px`,
            width:  `${dim * 0.26}px`,
            height: `${dim * 0.26}px`,
            borderRadius: '50%',
            background: statusTokens[status],
            border: '2.5px solid var(--bg-card)',
            boxShadow: '0 1px 4px rgba(0,0,0,0.18)',
          }}
          animate={status === 'online' ? { scale: [1, 1.25, 1] } : undefined}
          transition={status === 'online' ? { duration: 2, repeat: Infinity, ease: 'easeInOut' } : undefined}
        />
      )}
    </motion.div>
  );
};

export default ClayAvatar;
