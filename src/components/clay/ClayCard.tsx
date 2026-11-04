import React, { useState } from 'react';
import { motion, useSpring, useTransform } from 'motion/react';
import { withClayReducedMotion } from './withClayReducedMotion';

export interface ClayCardProps {
  children: React.ReactNode;
  variant?: 'default' | 'bento' | 'stats' | 'notification';
  colorway?: 'mint' | 'blue' | 'pink' | 'lavender' | 'peach' | 'neutral' | 'ivory';
  elevation?: 'low' | 'medium' | 'high';
  interactive?: boolean;
  onClick?: () => void;
  className?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  style?: React.CSSProperties;
}

const colorwayBg = {
  mint: 'hsl(142deg 76% 90%)',
  blue: 'hsl(200deg 90% 92%)',
  pink: 'hsl(350deg 90% 92%)',
  lavender: 'hsl(270deg 70% 92%)',
  peach: 'hsl(25deg 95% 90%)',
  neutral: 'hsl(30deg 20% 95%)',
  ivory: '#FEF3C7',
};

const ClayCardBase: React.FC<ClayCardProps> = ({
  children,
  variant = 'default',
  colorway = 'neutral',
  elevation = 'medium',
  interactive = true,
  onClick,
  className = '',
  header,
  footer,
  style,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Spring physics for card
  const springConfig = { stiffness: 200, damping: 20, mass: 1 };

  const y = useSpring(0, springConfig);
  const rotateX = useSpring(0, springConfig);
  const rotateY = useSpring(0, springConfig);
  const shadowY = useSpring(8, springConfig);
  const shadowBlur = useSpring(16, springConfig);

  // 3D tilt effect on mouse move
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    // Subtle 3D rotation based on mouse position
    rotateX.set(mouseY / 20);
    rotateY.set(-mouseX / 20);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    y.set(-8);
    shadowY.set(20);
    shadowBlur.set(40);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    y.set(0);
    rotateX.set(0);
    rotateY.set(0);
    shadowY.set(8);
    shadowBlur.set(16);
  };

  const boxShadow = useTransform(
    [shadowY, shadowBlur],
    ([latestY, latestBlur]) => {
      const sy = latestY as number;
      const sb = latestBlur as number;
      return `
        0 ${sy}px ${sb}px rgba(0,0,0,0.1),
        inset -10px -10px 20px rgba(0,0,0,0.05),
        inset 10px 10px 20px rgba(255,255,255,0.8)
      `;
    }
  );

  const bg = colorwayBg[colorway];

  return (
    <motion.div
      className={`clay-card clay-card--${variant} ${className}`}
      style={{
        background: bg,
        y,
        rotateX,
        rotateY,
        boxShadow,
        transformPerspective: 1000,
        cursor: interactive ? 'pointer' : 'default',
        ...style,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      whileTap={interactive ? { scale: 0.98, y: 2 } : undefined}
    >
      {header && (
        <div className="clay-card__header">{header}</div>
      )}

      <div className="clay-card__content">
        {children}
      </div>

      {footer && (
        <div className="clay-card__footer">{footer}</div>
      )}

      {/* Subtle shine effect on hover */}
      {isHovered && (
        <motion.div
          className="clay-card__shine"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 'inherit',
            background: 'linear-gradient(135deg, transparent 40%, white 50%, transparent 60%)',
            pointerEvents: 'none',
          }}
        />
      )}
    </motion.div>
  );
};

export const ClayCard = withClayReducedMotion(ClayCardBase, 'ClayCard');

export default ClayCard;
