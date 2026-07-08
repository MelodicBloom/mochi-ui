import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { ClayButton, ClayTooltip, FloatingContainer } from '../index';
import { useMochiAudio } from '../enhanced/audio/AudioEngine';
import { useResponsive } from '../enhanced/responsive/ResponsiveSystem';
import { physicsPresets } from '../index';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface NavItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

export interface NavShellProps {
  items: NavItem[];
  activeId: string;
  onNavigate: (id: string) => void;
  logoLabel?: string;
  onLogoClick?: () => void;
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
  audioEnabled: boolean;
  onAudioToggle: () => void;
  physicsPreset: string;
  onPhysicsChange: (preset: string) => void;
  children?: React.ReactNode;
}

// ─── Icons ────────────────────────────────────────────────────────────────────

const MenuIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const CloseIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const MoonIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
  </svg>
);

const SunIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2m-7.07-14.07 1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
  </svg>
);

const AudioOnIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
  </svg>
);

const AudioOffIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <line x1="23" x2="17" y1="9" y2="15" />
    <line x1="17" x2="23" y1="9" y2="15" />
  </svg>
);

// ─── MobileDrawer ─────────────────────────────────────────────────────────────

const MobileDrawer: React.FC<{
  open: boolean;
  onClose: () => void;
  items: NavItem[];
  activeId: string;
  onNavigate: (id: string) => void;
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
  audioEnabled: boolean;
  onAudioToggle: () => void;
  physicsPreset: string;
  onPhysicsChange: (preset: string) => void;
}> = ({ open, onClose, items, activeId, onNavigate, theme, onThemeToggle, audioEnabled, onAudioToggle, physicsPreset, onPhysicsChange }) => {
  // Lock body scroll when drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 200,
              background: 'rgba(0,0,0,0.35)',
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)',
            }}
          />

          {/* Drawer panel */}
          <motion.aside
            key="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 380, damping: 36, mass: 0.8 }}
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              zIndex: 300,
              width: 'min(320px, 90vw)',
              background: 'var(--bg-surface, #fff8f0)',
              boxShadow: '-8px 0 32px rgba(0,0,0,0.12)',
              display: 'flex',
              flexDirection: 'column',
              padding: '24px 20px 32px',
              gap: 8,
              overflowY: 'auto',
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            {/* Drawer header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <span style={{ fontWeight: 700, fontSize: 18, color: 'var(--text-primary)' }}>Menu</span>
              <button
                onClick={onClose}
                aria-label="Close menu"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-secondary)',
                  padding: 6,
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CloseIcon />
              </button>
            </div>

            {/* Nav items */}
            <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
              {items.map((item, i) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, type: 'spring', stiffness: 400, damping: 30 }}
                  onClick={() => { onNavigate(item.id); onClose(); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '14px 16px',
                    borderRadius: 14,
                    border: 'none',
                    background: activeId === item.id
                      ? 'var(--mochi-mint, #c8f6d8)'
                      : 'transparent',
                    color: activeId === item.id
                      ? 'white'
                      : 'var(--text-primary)',
                    fontSize: 16,
                    fontWeight: activeId === item.id ? 700 : 500,
                    cursor: 'pointer',
                    textAlign: 'left',
                    width: '100%',
                    transition: 'background 0.15s, color 0.15s',
                  }}
                  whileTap={{ scale: 0.97 }}
                >
                  {item.icon && (
                    <span style={{ opacity: 0.8, flexShrink: 0 }}>{item.icon}</span>
                  )}
                  {item.label}
                  {activeId === item.id && (
                    <motion.span
                      layoutId="mobile-active-dot"
                      style={{
                        marginLeft: 'auto',
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: 'white',
                        opacity: 0.8,
                      }}
                    />
                  )}
                </motion.button>
              ))}
            </nav>

            {/* Controls footer */}
            <div style={{
              borderTop: '1px solid rgba(0,0,0,0.07)',
              paddingTop: 20,
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}>
              {/* Theme + Audio row */}
              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  onClick={onThemeToggle}
                  aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    padding: '12px 0',
                    borderRadius: 12,
                    border: 'none',
                    background: 'var(--bg-card)',
                    boxShadow: 'var(--shadow-clay)',
                    color: 'var(--text-primary)',
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {theme === 'light' ? <MoonIcon /> : <SunIcon />}
                  {theme === 'light' ? 'Dark' : 'Light'}
                </button>
                <button
                  onClick={onAudioToggle}
                  aria-label={audioEnabled ? 'Disable audio' : 'Enable audio'}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    padding: '12px 0',
                    borderRadius: 12,
                    border: 'none',
                    background: audioEnabled ? 'var(--mochi-mint, #c8f6d8)' : 'var(--bg-card)',
                    boxShadow: 'var(--shadow-clay)',
                    color: audioEnabled ? 'white' : 'var(--text-primary)',
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {audioEnabled ? <AudioOnIcon /> : <AudioOffIcon />}
                  {audioEnabled ? 'Sound On' : 'Sound Off'}
                </button>
              </div>

              {/* Physics preset selector */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 8 }}>
                  Physics Preset
                </label>
                <select
                  value={physicsPreset}
                  onChange={(e) => onPhysicsChange(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: 12,
                    border: 'none',
                    background: 'var(--bg-card)',
                    boxShadow: 'var(--shadow-clay)',
                    fontSize: 14,
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                  }}
                >
                  {Object.keys(physicsPresets).map((preset) => (
                    <option key={preset} value={preset}>
                      {preset.charAt(0).toUpperCase() + preset.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

// ─── NavShell ─────────────────────────────────────────────────────────────────

export const NavShell: React.FC<NavShellProps> = ({
  items,
  activeId,
  onNavigate,
  logoLabel = 'M',
  onLogoClick,
  theme,
  onThemeToggle,
  audioEnabled,
  onAudioToggle,
  physicsPreset,
  onPhysicsChange,
  children,
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const progressBarWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  // Close drawer on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeDrawer();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [closeDrawer]);

  return (
    <>
      {/* Scroll progress bar */}
      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: 3,
          background: 'var(--mochi-mint)',
          zIndex: 1000,
          width: progressBarWidth,
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      />

      {/* Header */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: 'rgba(var(--bg-surface-rgb, 255, 248, 240), 0.85)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          borderBottom: '1px solid rgba(0,0,0,0.05)',
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            padding: '16px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <FloatingContainer amplitude={4} frequency={0.8}>
              <motion.div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: 'linear-gradient(135deg, var(--mochi-mint), var(--mochi-sage))',
                  boxShadow: 'var(--shadow-clay)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  color: 'white',
                  fontSize: 18,
                  cursor: 'pointer',
                }}
                whileHover={{ scale: 1.1, rotate: 10 }}
                whileTap={{ scale: 0.9 }}
                onClick={onLogoClick}
              >
                {logoLabel}
              </motion.div>
            </FloatingContainer>
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>Mochi UI</h1>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Claymorphism Design System</p>
            </div>
          </div>

          {/* Desktop controls */}
          <div
            style={{ display: 'flex', alignItems: 'center', gap: 12 }}
            className="nav-desktop-controls"
          >
            <ClayTooltip content={audioEnabled ? 'Audio On' : 'Audio Off'}>
              <ClayButton size="sm" colorway={audioEnabled ? 'mint' : 'neutral'} onClick={onAudioToggle}>
                {audioEnabled ? <AudioOnIcon /> : <AudioOffIcon />}
              </ClayButton>
            </ClayTooltip>

            <select
              value={physicsPreset}
              onChange={(e) => onPhysicsChange(e.target.value)}
              style={{
                padding: '8px 16px',
                borderRadius: 12,
                border: 'none',
                background: 'var(--bg-card)',
                boxShadow: 'var(--shadow-clay)',
                fontSize: 13,
                color: 'var(--text-primary)',
                cursor: 'pointer',
              }}
            >
              {Object.keys(physicsPresets).map((preset) => (
                <option key={preset} value={preset}>
                  {preset.charAt(0).toUpperCase() + preset.slice(1)}
                </option>
              ))}
            </select>

            <ClayButton size="sm" colorway="neutral" onClick={onThemeToggle}>
              {theme === 'light' ? <MoonIcon /> : <SunIcon />}
            </ClayButton>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={openDrawer}
            aria-label="Open navigation menu"
            aria-expanded={drawerOpen}
            aria-controls="mobile-nav-drawer"
            className="nav-hamburger"
            style={{
              display: 'none', // hidden on desktop; CSS below handles mobile
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-primary)',
              padding: 6,
              borderRadius: 8,
            }}
          >
            <MenuIcon />
          </button>
        </div>

        {/* Desktop section navigation */}
        <nav
          aria-label="Page sections"
          className="nav-section-bar"
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            padding: '0 24px 12px',
            display: 'flex',
            gap: 8,
            overflowX: 'auto',
            scrollbarWidth: 'none',
          }}
        >
          {items.map((item) => (
            <motion.button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              aria-label={`Go to ${item.label} section`}
              aria-current={activeId === item.id ? 'location' : undefined}
              style={{
                padding: '8px 16px',
                borderRadius: 12,
                border: 'none',
                background: activeId === item.id ? 'var(--mochi-mint)' : 'transparent',
                color: activeId === item.id ? 'white' : 'var(--text-secondary)',
                fontSize: 14,
                fontWeight: 500,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {item.label}
            </motion.button>
          ))}
        </nav>
      </header>

      {/* Mobile drawer */}
      <MobileDrawer
        open={drawerOpen}
        onClose={closeDrawer}
        items={items}
        activeId={activeId}
        onNavigate={onNavigate}
        theme={theme}
        onThemeToggle={onThemeToggle}
        audioEnabled={audioEnabled}
        onAudioToggle={onAudioToggle}
        physicsPreset={physicsPreset}
        onPhysicsChange={onPhysicsChange}
      />

      {/* Responsive CSS */}
      <style>{`
        @media (max-width: 768px) {
          .nav-desktop-controls { display: none !important; }
          .nav-hamburger { display: flex !important; }
          .nav-section-bar { display: none !important; }
        }
      `}</style>

      {/* Page content slot */}
      {children}
    </>
  );
};

export default NavShell;
