/**
 * MOCHI UI — ClayAvatar v2.0
 *
 * Claymorphic avatar with status indicator, spring-physics
 * hover scale, and ClayAvatarStack layout support.
 */

'use client';

import React, { useCallback } from 'react';
import { useSpring, useReducedMotion } from '../lib/spring-hooks';
import { SpringConfig } from '../lib/spring-physics';

export interface ClayAvatarProps {
  src?: string;
  alt: string;
  fallback?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'away' | 'offline' | 'busy';
  border?: boolean;
  springConfig?: Partial<SpringConfig>;
  className?: string;
}

const SIZE_MAP: Record<string, number> = { xs: 24, sm: 32, md: 40, lg: 56, xl: 72 };
const STATUS_COLOR: Record<string, string> = {
  online: 'var(--mochi-sage-500)',
  away:   'var(--mochi-clay-400)',
  offline:'var(--mochi-sand-400)',
  busy:   'var(--mochi-terra-500)',
};

export const ClayAvatar: React.FC<ClayAvatarProps> = ({
  src, alt, fallback, size = 'md', status, border = true, springConfig, className = '',
}) => {
  const prefersReducedMotion = useReducedMotion();
  const scale = useSpring({ from: 1, mass: 0.8, tension: 400, friction: 20, ...springConfig });
  const dim = SIZE_MAP[size];
  const statusSize = Math.max(8, Math.floor(dim / 5));

  const onEnter = useCallback(() => { if (!prefersReducedMotion) scale.set(1.08); }, [scale, prefersReducedMotion]);
  const onLeave = useCallback(() => scale.set(1), [scale]);

  return (
    <div
      className={`relative inline-block ${className}`}
      style={{ width: dim, height: dim }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <div
        className="rounded-full overflow-hidden"
        style={{
          width: dim, height: dim,
          transform: `scale(${scale.value})`,
          willChange: 'transform',
          boxShadow: '4px 4px 12px rgba(0,0,0,0.1), inset -3px -3px 6px rgba(0,0,0,0.05), inset 3px 3px 6px rgba(255,255,255,0.6)',
          border: border ? '2px solid var(--mochi-surface)' : undefined,
        }}
      >
        {src ? (
          <img src={src} alt={alt} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center font-semibold"
            style={{
              background: 'linear-gradient(145deg, var(--mochi-terra-400), var(--mochi-terra-500))',
              color: 'var(--mochi-text-inverse)',
              fontSize: Math.floor(dim * 0.4),
            }}
          >
            {fallback || alt.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      {status && (
        <span
          className="absolute rounded-full"
          style={{
            width: statusSize, height: statusSize,
            background: STATUS_COLOR[status],
            bottom: 0, right: 0,
            border: '2px solid var(--mochi-surface)',
            boxShadow: 'var(--mochi-clay-rest)',
          }}
        />
      )}
    </div>
  );
};

export const ClayAvatarStack: React.FC<{
  avatars: ClayAvatarProps[];
  max?: number;
  size?: ClayAvatarProps['size'];
  className?: string;
}> = ({ avatars, max = 4, size = 'md', className = '' }) => {
  const display = avatars.slice(0, max);
  const remaining = avatars.length - max;
  const dim = SIZE_MAP[size];

  return (
    <div className={`flex items-center ${className}`}>
      {display.map((avatar, i) => (
        <div key={i} style={{ marginLeft: i === 0 ? 0 : -Math.floor(dim * 0.3) }}>
          <ClayAvatar {...avatar} size={size} />
        </div>
      ))}
      {remaining > 0 && (
        <div
          className="flex items-center justify-center rounded-full text-xs font-medium"
          style={{
            width: dim, height: dim,
            marginLeft: -Math.floor(dim * 0.3),
            background: 'var(--mochi-surface)',
            color: 'var(--mochi-text-secondary)',
            boxShadow: 'var(--mochi-clay-rest)',
            border: '3px solid var(--mochi-surface)',
          }}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
};

ClayAvatar.displayName = 'ClayAvatar';
export default ClayAvatar;