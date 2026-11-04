import React, { useState, useEffect } from 'react';
import { motion, useSpring, useTransform } from 'motion/react';
import { withClayReducedMotion } from './withClayReducedMotion';

export interface ClayChartBarProps {
  value: number;
  max?: number;
  label?: string;
  colorway?: 'mint' | 'blue' | 'pink' | 'lavender' | 'peach';
  width?: number;
  delay?: number;
  onHover?: (value: number) => void;
}

const colorwayColors = {
  mint: { main: '#A3E635', dark: '#86EFAC' },
  blue: { main: '#7DD3FC', dark: '#38BDF8' },
  pink: { main: '#FDA4AF', dark: '#FB7185' },
  lavender: { main: '#C084FC', dark: '#A78BFA' },
  peach: { main: '#FB923C', dark: '#FDBA74' },
};

const ClayChartBarBase: React.FC<ClayChartBarProps> = ({
  value,
  max = 100,
  label,
  colorway = 'mint',
  width = 48,
  delay = 0,
  onHover,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const colors = colorwayColors[colorway];
  const percentage = Math.min((value / max) * 100, 100);

  // Spring for height animation (grow from bottom)
  const height = useSpring(0, { 
    stiffness: 200, 
    damping: 20,
    mass: 1 
  });

  // Spring for hover scale
  const scale = useSpring(1, { stiffness: 400, damping: 25 });

  // Animate height on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      height.set(percentage);
    }, delay);
    return () => clearTimeout(timer);
  }, [percentage, delay, height]);

  // Shadow based on height
  const shadowY = useTransform(height, (h) => Math.max(4, h / 10));
  const shadowBlur = useTransform(height, (h) => Math.max(8, h / 5));

  const boxShadow = useTransform(
    [shadowY, shadowBlur],
    ([sy, sb]) => `
      0 ${sy}px ${sb}px rgba(0,0,0,0.1),
      inset -2px -2px 4px rgba(0,0,0,0.05),
      inset 2px 2px 4px rgba(255,255,255,0.5)
    `
  );

  return (
    <div 
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        gap: 8,
      }}
    >
      {/* Value tooltip on hover */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: isHovered ? 1 : 0,
          scale: isHovered ? 1 : 0.8,
          y: isHovered ? -4 : 0,
        }}
        transition={{ duration: 0.2 }}
        style={{
          padding: '4px 12px',
          borderRadius: 12,
          background: colors.main,
          color: 'white',
          fontSize: 12,
          fontWeight: 700,
          boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
        }}
      >
        {Math.round(value)}%
      </motion.div>

      {/* Bar container */}
      <div 
        style={{ 
          height: 200, 
          display: 'flex', 
          alignItems: 'flex-end',
          position: 'relative',
        }}
      >
        <motion.div
          style={{
            width,
            height: useTransform(height, (h) => `${h}%`),
            borderRadius: 999,
            background: `linear-gradient(180deg, ${colors.main}, ${colors.dark})`,
            boxShadow,
            scale,
            originY: 1, // Scale from bottom
          }}
          onMouseEnter={() => {
            setIsHovered(true);
            scale.set(1.05);
            onHover?.(value);
          }}
          onMouseLeave={() => {
            setIsHovered(false);
            scale.set(1);
          }}
          whileTap={{ scale: 0.95 }}
        >
          {/* 3D cylinder highlight */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: '15%',
            right: '15%',
            height: '30%',
            borderRadius: '50%',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.6), transparent)',
          }} />

          {/* Side shadow for 3D effect */}
          <div style={{
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            width: '20%',
            borderRadius: '0 999px 999px 0',
            background: 'linear-gradient(90deg, transparent, rgba(0,0,0,0.1))',
          }} />
        </motion.div>
      </div>

      {/* Label */}
      {label && (
        <span style={{ 
          fontSize: 12, 
          fontWeight: 600, 
          color: 'var(--text-secondary)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}>
          {label}
        </span>
      )}
    </div>
  );
};

export const ClayChartBar = withClayReducedMotion(ClayChartBarBase, 'ClayChartBar');

export default ClayChartBar;
