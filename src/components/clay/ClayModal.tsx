import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { withClayReducedMotion } from './withClayReducedMotion';

export interface ClayModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  colorway?: 'mint' | 'blue' | 'pink' | 'lavender' | 'neutral';
}

const sizes = {
  sm: { maxWidth: 400 },
  md: { maxWidth: 560 },
  lg: { maxWidth: 720 },
};

const ClayModalBase: React.FC<ClayModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  colorway = 'neutral',
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
            background: 'rgba(0,0,0,0.3)',
            backdropFilter: 'blur(8px)',
          }}
          onClick={handleBackdropClick}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 25,
              mass: 0.8,
            }}
            style={{
              width: '100%',
              maxWidth: sizes[size].maxWidth,
              borderRadius: 28,
              background: 'var(--bg-card)',
              boxShadow: `
                0 40px 80px rgba(0,0,0,0.2),
                inset -10px -10px 20px rgba(0,0,0,0.05),
                inset 10px 10px 20px rgba(255,255,255,0.8)
              `,
              overflow: 'hidden',
            }}
          >
            {title && (
              <div style={{
                padding: '24px 24px 0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>
                  {title}
                </h3>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    border: 'none',
                    background: 'var(--bg-surface)',
                    boxShadow: 'var(--shadow-clay)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 18,
                    color: 'var(--text-secondary)',
                  }}
                >
                  ×
                </motion.button>
              </div>
            )}

            <div style={{ padding: 24 }}>
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const ClayModal = withClayReducedMotion(ClayModalBase, 'ClayModal');

export default ClayModal;
