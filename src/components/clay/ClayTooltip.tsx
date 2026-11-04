import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { withClayReducedMotion } from './withClayReducedMotion';

export interface ClayTooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  colorway?: 'dark' | 'light';
}

const ClayTooltipBase: React.FC<ClayTooltipProps> = ({
  children,
  content,
  position = 'top',
  delay = 300,
  colorway = 'dark',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const show = () => {
    timerRef.current = setTimeout(() => {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        const scrollX = window.scrollX;
        const scrollY = window.scrollY;

        let x = rect.left + rect.width / 2 + scrollX;
        let y = rect.top + scrollY;

        switch (position) {
          case 'top': y -= 8; break;
          case 'bottom': y += rect.height + 8; break;
          case 'left': x = rect.left + scrollX - 8; break;
          case 'right': x = rect.right + scrollX + 8; break;
        }

        setCoords({ x, y });
        setIsVisible(true);
      }
    }, delay);
  };

  const hide = () => {
    clearTimeout(timerRef.current);
    setIsVisible(false);
  };

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  const isDark = colorway === 'dark';

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        style={{ display: 'inline-block' }}
      >
        {children}
      </div>

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: position === 'top' ? 4 : -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: position === 'top' ? 4 : -4 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            style={{
              position: 'fixed',
              left: coords.x,
              top: coords.y,
              transform: 'translate(-50%, -100%)',
              zIndex: 1000,
              pointerEvents: 'none',
            }}
          >
            <div style={{
              padding: '8px 16px',
              borderRadius: 12,
              background: isDark ? 'var(--mochi-dark-surface)' : 'var(--bg-card)',
              color: isDark ? 'white' : 'var(--text-primary)',
              fontSize: 13,
              fontWeight: 500,
              boxShadow: `
                0 8px 24px rgba(0,0,0,0.15),
                inset 1px 1px 2px rgba(255,255,255,${isDark ? '0.1' : '0.8'})
              `,
              whiteSpace: 'nowrap',
            }}>
              {content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export const ClayTooltip = withClayReducedMotion(ClayTooltipBase, 'ClayTooltip');

export default ClayTooltip;
