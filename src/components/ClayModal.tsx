/**
 * MOCHI UI — ClayModal v2.0
 *
 * Claymorphic modal with spring-physics open/close animation,
 * backdrop blur, and focus trap.
 */

'use client';

import React, { useRef, useEffect, useCallback } from 'react';
import { useSpring, useReducedMotion } from '../lib/spring-hooks';
import { SpringConfig } from '../lib/spring-physics';

export interface ClayModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  springConfig?: Partial<SpringConfig>;
  maxWidth?: string;
  showCloseButton?: boolean;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  className?: string;
}

export const ClayModal: React.FC<ClayModalProps> = ({
  isOpen, onClose, title, description, children, springConfig,
  maxWidth = '560px', showCloseButton = true, closeOnBackdrop = true,
  closeOnEscape = true, className = '',
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const previousActiveElement = useRef<HTMLElement | null>(null);

  const opacity = useSpring({ from: 0, mass: 1, tension: 300, friction: 30, ...springConfig });
  const scale = useSpring({ from: 0.9, mass: 1.2, tension: 250, friction: 24, ...springConfig });
  const translateY = useSpring({ from: 30, mass: 1, tension: 280, friction: 26, ...springConfig });

  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      opacity.set(1); scale.set(1); translateY.set(0);
      setTimeout(() => { closeButtonRef.current?.focus(); }, 100);
    } else {
      opacity.set(0); scale.set(0.95); translateY.set(20);
      previousActiveElement.current?.focus();
    }
  }, [isOpen, opacity, scale, translateY]);

  useEffect(() => {
    if (!isOpen) return;
    const modal = modalRef.current;
    if (!modal) return;
    const focusable = modal.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
    };
    modal.addEventListener('keydown', handleTab);
    return () => modal.removeEventListener('keydown', handleTab);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;
    const handleEscape = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEscape, onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (closeOnBackdrop && e.target === backdropRef.current) onClose();
  }, [closeOnBackdrop, onClose]);

  if (!isOpen && opacity.value <= 0.01) return null;

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
      style={{
        background: 'rgba(0,0,0,0.3)',
        backdropFilter: 'blur(8px)',
        opacity: opacity.value,
        pointerEvents: opacity.value > 0.5 ? 'auto' : 'none',
      }}
      onClick={handleBackdropClick}
      role="presentation"
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'clay-modal-title' : undefined}
        aria-describedby={description ? 'clay-modal-desc' : undefined}
        className={`relative w-full max-h-[90vh] overflow-y-auto p-8 rounded-[var(--mochi-radius-2xl)] ${className}`}
        style={{
          transform: `scale(${scale.value}) translateY(${translateY.value}px)`,
          opacity: opacity.value,
          maxWidth,
          willChange: 'transform, opacity',
          background: 'linear-gradient(145deg, var(--mochi-surface-elevated), var(--mochi-surface))',
          boxShadow: '20px 20px 60px rgba(0,0,0,0.15), -20px -20px 60px rgba(255,255,255,0.8), 0 0 0 1px rgba(255,255,255,0.4)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute inset-0 rounded-[inherit] pointer-events-none" style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.3) 0%, transparent 50%, rgba(0,0,0,0.02) 100%)' }} />
        {(title || showCloseButton) && (
          <div className="relative z-10 flex items-start justify-between mb-6">
            {title && (
              <div>
                <h2 id="clay-modal-title" className="text-2xl font-semibold text-[var(--mochi-text-primary)]" style={{ fontFamily: 'var(--mochi-font-display)' }}>{title}</h2>
                {description && <p id="clay-modal-desc" className="mt-1 text-sm text-[var(--mochi-text-secondary)]">{description}</p>}
              </div>
            )}
            {showCloseButton && (
              <button ref={closeButtonRef} onClick={onClose} className="clay-button clay-button--ghost p-2 rounded-full" aria-label="Close modal">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
        )}
        <div className="relative z-10">{children}</div>
      </div>
    </div>
  );
};

ClayModal.displayName = 'ClayModal';
export default ClayModal;