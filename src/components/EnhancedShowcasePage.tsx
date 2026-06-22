import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import {
  ClayButton,
  ClayCard,
  ClayToggle,
  ClaySlider,
  ClayInput,
  ClayChartBar,
  ClayBadge,
  ClayAvatar,
  ClayTooltip,
  ClayModal,
  ClayProgress,
  ClaySegmentedControl,
  ClaySkeleton,
  BentoGrid,
  BentoItem,
  FloatingContainer,
  ClayRebound,
  PhysicsProvider,
  physicsPresets,
} from './index';
import { AudioProvider, useMochiAudio } from './enhanced/audio/AudioEngine';
import { SmoothScrollProvider } from './enhanced/effects/SmoothScroll';
import { AtmosphereCanvas } from './enhanced/effects/AtmosphereCanvas';
import { useActiveSection } from '../hooks/useActiveSection';
import { useResponsive } from './enhanced/responsive/ResponsiveSystem';
import { ErrorBoundary } from './ErrorBoundary';
import { MochiLoader } from './MochiLoader';
import MochiBounce from './MochiBounce';

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icons = {
  Search: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>,
  Bell: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>,
  Chart: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>,
  Moon: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>,
  Sun: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2m-7.07-14.07 1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2m-2.93-7.07-1.41 1.41M6.34 17.66l-1.41 1.41"/></svg>,
  Audio: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>,
  VolumeOff: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" x2="17" y1="9" y2="15"/><line x1="17" x2="23" y1="9" y2="15"/></svg>,
  Zap: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  Layers: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>,
  Code: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
  Figma: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5z"/><path d="M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z"/><path d="M12 12.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 1 1-7 0z"/><path d="M5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 1 1-7 0z"/><path d="M5 12.5A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 12.5z"/></svg>,
  Accessibility: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>,
  Palette: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.01 17.461 2 12 2z"/></svg>,
  GameController: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="6" y1="12" x2="10" y2="12"/><line x1="8" y1="10" x2="8" y2="14"/><circle cx="15" cy="12" r="1" fill="currentColor"/><circle cx="17" cy="10" r="1" fill="currentColor"/><path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.544-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z"/></svg>,
  Copy: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>,
  ArrowRight: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>,
  GitHub: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>,
};

// ─── Constants ────────────────────────────────────────────────────────────────
const SECTION_IDS = ['hero', 'about', 'features', 'components', 'game', 'teams', 'start'];
const SECTION_LABELS: Record<string, string> = {
  hero: 'Home', about: 'About', features: 'Features',
  components: 'Components', game: 'Play', teams: 'Teams', start: 'Install',
};

// ─── Shared primitives ────────────────────────────────────────────────────────
const ScrollReveal: React.FC<{ children: React.ReactNode; delay?: number; reducedMotion?: boolean }> = ({ children, delay = 0, reducedMotion }) => {
  if (reducedMotion) return <>{children}</>;
  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-72px' }}
      transition={{ duration: 0.55, delay, ease: [0.34, 1.56, 0.64, 1] }}
    >
      {children}
    </motion.div>
  );
};

const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p style={{
    fontSize: 'var(--type-label-size)',
    fontWeight: 'var(--type-label-weight)' as any,
    letterSpacing: 'var(--type-label-tracking)',
    textTransform: 'var(--type-label-transform)' as any,
    color: 'var(--mochi-mint-vivid)',
    marginBottom: 10,
  }}>
    {children}
  </p>
);

const SectionHeading: React.FC<{ label?: string; title: string; subtitle?: string; reducedMotion?: boolean; centered?: boolean }> = ({
  label, title, subtitle, reducedMotion, centered,
}) => {
  const align = centered ? 'center' : 'left';
  const inner = (
    <div style={{ marginBottom: 40, textAlign: align }}>
      {label && <SectionLabel>{label}</SectionLabel>}
      <h2 style={{
        fontSize: 'var(--type-title-size)',
        fontWeight: 'var(--type-title-weight)' as any,
        lineHeight: 'var(--type-title-line)',
        letterSpacing: 'var(--type-title-tracking)',
        color: 'var(--text-primary)',
        marginBottom: subtitle ? 14 : 0,
      }}>
        {title}
      </h2>
      {subtitle && (
        <p style={{
          fontSize: 'var(--type-body-size)',
          color: 'var(--text-secondary)',
          maxWidth: centered ? 560 : 640,
          margin: centered ? '0 auto' : undefined,
          lineHeight: 'var(--type-body-line)',
        }}>
          {subtitle}
        </p>
      )}
    </div>
  );
  if (reducedMotion) return inner;
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
    >
      {inner}
    </motion.div>
  );
};

// ─── Main showcase ────────────────────────────────────────────────────────────
const ShowcaseContent: React.FC = () => {
  const [theme, setTheme] = useState(() => {
    if (typeof localStorage !== 'undefined') return localStorage.getItem('theme') || 'light';
    return 'light';
  });
  const [sliderValue, setSliderValue] = useState(65);
  const [toggleChecked, setToggleChecked] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [segmentValue, setSegmentValue] = useState('design');
  const [reboundTrigger, setReboundTrigger] = useState(false);
  const [copied, setCopied] = useState(false);

  const audio = useMochiAudio();
  const { prefersReducedMotion } = useResponsive();
  const { activeId, scrollTo } = useActiveSection(SECTION_IDS);

  const { scrollYProgress } = useScroll();
  const progressBarWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const n = parseInt(e.key);
      if (n >= 1 && n <= SECTION_IDS.length) scrollTo(SECTION_IDS[n - 1]);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [scrollTo]);

  const toggleTheme = useCallback(() => {
    audio.success();
    setTheme(t => t === 'light' ? 'dark' : 'light');
  }, [audio]);

  const triggerRebound = useCallback(() => {
    audio.playClick?.('soft');
    setReboundTrigger(true);
    setTimeout(() => setReboundTrigger(false), 600);
  }, [audio]);

  const copyInstall = useCallback(() => {
    navigator.clipboard.writeText('npm install @mochi-ui/react');
    audio.success?.();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [audio]);

  const chartData = [
    { value: 45, label: 'Q1', colorway: 'lavender' as const },
    { value: 70, label: 'Q2', colorway: 'peach' as const },
    { value: 55, label: 'Q3', colorway: 'mint' as const },
    { value: 85, label: 'Q4', colorway: 'blue' as const },
  ];

  // ── Shared style helpers ───────────────────────────────────────────────────
  const sectionPad = { padding: 'var(--space-20) 0' };
  const iconBox = (bg: string) => ({
    width: 44, height: 44,
    borderRadius: 'var(--radius-squircle-sm)',
    background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: 'white', flexShrink: 0,
    boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
  } as React.CSSProperties);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', transition: 'background 0.3s, color 0.3s' }}>

      {/* ── Scroll progress bar ── */}
      <motion.div style={{
        position: 'fixed', top: 0, left: 0, height: 3,
        background: 'linear-gradient(90deg, var(--mochi-mint-vivid), var(--mochi-lavender-vivid))',
        zIndex: 1000, width: progressBarWidth,
        borderRadius: '0 3px 3px 0',
      }} />

      {/* ════ HEADER ════════════════════════════════════════════════════════ */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(var(--bg-surface-rgb, 255,248,245), 0.88)',
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        borderBottom: '1px solid var(--border-subtle)',
      }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto', padding: '14px 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
        }}>
          {/* Wordmark */}
          <motion.button
            onClick={() => scrollTo('hero')}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: 'none', border: 'none', cursor: 'pointer', padding: 0,
            }}
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          >
            <div style={{
              width: 36, height: 36,
              borderRadius: 'var(--radius-squircle-sm)',
              background: 'linear-gradient(135deg, var(--mochi-mint), var(--mochi-mint-vivid))',
              boxShadow: 'var(--shadow-glow-mint)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 900, color: 'white', fontSize: 16,
            }}>M</div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.1 }}>Mochi UI</div>
              <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>Claymorphism</div>
            </div>
          </motion.button>

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ClayTooltip content={audio.isEnabled ? 'Mute' : 'Unmute'}>
              <ClayButton size="sm" colorway={audio.isEnabled ? 'mint' : 'neutral'} onClick={() => audio.isEnabled ? audio.disable() : audio.enable()}>
                {audio.isEnabled ? <Icons.Audio /> : <Icons.VolumeOff />}
              </ClayButton>
            </ClayTooltip>
            <ClayButton size="sm" colorway="neutral" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === 'light' ? <Icons.Moon /> : <Icons.Sun />}
            </ClayButton>
            <ClayButton size="sm" colorway="mint" onClick={() => window.open('https://github.com/qt314wink/mochi-ui', '_blank')} icon={<Icons.GitHub />} iconPosition="leading">
              GitHub
            </ClayButton>
          </div>
        </div>

        {/* Subnav */}
        <nav style={{
          maxWidth: 1200, margin: '0 auto', padding: '0 24px 10px',
          display: 'flex', gap: 4, overflowX: 'auto', scrollbarWidth: 'none',
        }}>
          {SECTION_IDS.map(id => (
            <motion.button
              key={id}
              onClick={() => scrollTo(id)}
              aria-label={`Go to ${SECTION_LABELS[id]}`}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-squircle-xs)',
                border: 'none',
                background: activeId === id
                  ? 'linear-gradient(135deg, var(--mochi-mint), var(--mochi-mint-vivid))'
                  : 'transparent',
                color: activeId === id ? 'white' : 'var(--text-secondary)',
                fontSize: 13, fontWeight: activeId === id ? 700 : 500,
                cursor: 'pointer', whiteSpace: 'nowrap',
                boxShadow: activeId === id ? 'var(--shadow-glow-mint)' : 'none',
              }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              {SECTION_LABELS[id]}
            </motion.button>
          ))}
        </nav>
      </header>

      {/* ════ HERO ══════════════════════════════════════════════════════════ */}
      <section id="hero" style={{ padding: 'var(--space-24) 24px var(--space-20)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <FloatingContainer amplitude={5} frequency={0.6}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '7px 16px',
                borderRadius: 'var(--radius-pill)',
                background: 'var(--bg-card)',
                boxShadow: 'var(--shadow-clay)',
                fontSize: 12, fontWeight: 700,
                letterSpacing: '0.06em', textTransform: 'uppercase',
                color: 'var(--text-secondary)',
                marginBottom: 24,
              }}
            >
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--mochi-mint-vivid)' }} />
              v2.0 — Open Source
            </motion.div>
          </FloatingContainer>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.34, 1.56, 0.64, 1] }}
            style={{
              fontSize: 'var(--type-display-size)',
              fontWeight: 'var(--type-display-weight)' as any,
              lineHeight: 'var(--type-display-line)',
              letterSpacing: 'var(--type-display-tracking)',
              marginBottom: 22, color: 'var(--text-primary)',
            }}
          >
            The{' '}
            <span style={{
              background: 'linear-gradient(120deg, var(--mochi-mint) 0%, var(--mochi-lavender-vivid) 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              Claymorphism
            </span>
            <br />Design System
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.22, ease: [0.34, 1.56, 0.64, 1] }}
            style={{
              fontSize: 'clamp(1rem, 1.8vw, 1.2rem)',
              color: 'var(--text-secondary)',
              maxWidth: 540, margin: '0 auto 36px',
              lineHeight: 'var(--type-body-line)',
            }}
          >
            Soft, tactile React components with spring physics, squircle geometry,
            haptic feedback, and accessible design tokens. Ship interfaces that{' '}
            <em style={{ color: 'var(--text-primary)', fontStyle: 'normal', fontWeight: 600 }}>feel alive</em>.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.34, ease: [0.34, 1.56, 0.64, 1] }}
            style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}
          >
            <ClayButton colorway="mint" size="lg" onClick={() => { audio.playClick?.('soft'); scrollTo('components'); }} icon={<Icons.ArrowRight />} iconPosition="trailing">
              Explore Components
            </ClayButton>
            <ClayButton colorway="neutral" size="lg" onClick={() => { audio.playSquish?.(); scrollTo('game'); }} icon={<Icons.GameController />} iconPosition="leading">
              Play the Game
            </ClayButton>
          </motion.div>
        </div>
      </section>

      {/* ════ TRUST BAR ═════════════════════════════════════════════════════ */}
      <div style={{
        borderTop: '1px solid var(--border-subtle)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '20px 24px',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: 'var(--type-label-size)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginRight: 6 }}>Built with</span>
          {['Astro', 'React 19', 'Motion', 'TypeScript', 'Three.js', 'Web Audio'].map(tech => (
            <span key={tech} style={{
              padding: '5px 12px',
              borderRadius: 'var(--radius-squircle-xs)',
              background: 'var(--bg-card)',
              boxShadow: 'var(--shadow-lift-sm)',
              fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)',
            }}>
              {tech}
            </span>
          ))}
        </div>
      </div>

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 80px' }}>

        {/* ════ ABOUT ═════════════════════════════════════════════════════ */}
        <section id="about" style={sectionPad}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 56, alignItems: 'center' }}>
            <ScrollReveal reducedMotion={prefersReducedMotion}>
              <SectionLabel>What is Claymorphism?</SectionLabel>
              <h2 style={{
                fontSize: 'var(--type-title-size)',
                fontWeight: 900, lineHeight: 1.1,
                letterSpacing: 'var(--type-title-tracking)',
                marginBottom: 18, color: 'var(--text-primary)',
              }}>
                Soft UI that responds to touch
              </h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 'var(--type-body-line)', marginBottom: 16 }}>
                Claymorphism evolves neumorphism — replacing harsh shadows with organic, inflated depth that mimics physical clay. Every Mochi element has mass: buttons compress, cards lift, inputs recess.
              </p>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 'var(--type-body-line)' }}>
                Shape is enforced as <strong style={{ color: 'var(--text-primary)' }}>superellipse (squircle)</strong> throughout — no raw rectangles. The geometry itself communicates softness before a single animation fires.
              </p>
            </ScrollReveal>

            <ScrollReveal reducedMotion={prefersReducedMotion} delay={0.14}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { icon: <Icons.Zap />, title: 'Spring Physics', desc: 'Real mass & damping on every interaction — no cubic-bezier guessing.', bg: 'var(--mochi-mint-vivid)', cw: 'mint' },
                  { icon: <Icons.Accessibility />, title: 'Accessibility First', desc: 'WCAG 2.1 AA compliant with reduced motion & high-contrast support.', bg: 'var(--mochi-sky-blue)', cw: 'blue' },
                  { icon: <Icons.Palette />, title: 'Design Tokens', desc: 'Figma-ready variables with automatic dark mode via CSS custom properties.', bg: 'var(--mochi-lavender-vivid)', cw: 'lavender' },
                ].map(item => (
                  <ClayCard key={item.title} colorway={item.cw as any} interactive={false}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div style={iconBox(item.bg)}>{item.icon}</div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 2 }}>{item.title}</div>
                        <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{item.desc}</div>
                      </div>
                    </div>
                  </ClayCard>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ════ FEATURES ══════════════════════════════════════════════════ */}
        <section id="features" style={sectionPad}>
          <ScrollReveal reducedMotion={prefersReducedMotion}>
            <SectionHeading
              reducedMotion={prefersReducedMotion}
              label="What's inside"
              title="Everything you need to ship faster"
              subtitle="A comprehensive component library with production-ready tooling for design systems, product teams, and indie developers."
            />
          </ScrollReveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20 }}>
            {[
              { icon: <Icons.Zap />, title: 'Spring Physics', desc: 'Mass-spring-damper physics on every animation. Tunable presets.', bg: 'var(--mochi-mint-vivid)', cw: 'mint' },
              { icon: <Icons.Layers />, title: '30+ Components', desc: 'Buttons, cards, inputs, toggles, sliders, charts, modals, tooltips.', bg: 'var(--mochi-sky-blue)', cw: 'blue' },
              { icon: <Icons.Figma />, title: 'Figma-Ready', desc: 'Design tokens map 1:1 between Figma variables and CSS custom properties.', bg: 'var(--mochi-blush-pink)', cw: 'pink' },
              { icon: <Icons.Accessibility />, title: 'A11y Built-In', desc: 'ARIA labels, keyboard navigation, focus rings, reduced-motion.', bg: 'var(--mochi-lavender-vivid)', cw: 'lavender' },
              { icon: <Icons.Code />, title: 'TypeScript Native', desc: 'Fully typed props, strict inference, and IntelliSense-friendly APIs.', bg: 'var(--mochi-peach)', cw: 'peach' },
              { icon: <Icons.Palette />, title: 'Dark Mode', desc: 'Automatic theme switching via CSS custom props and localStorage.', bg: 'var(--text-secondary)', cw: 'neutral' },
            ].map((f, i) => (
              <ScrollReveal key={f.title} reducedMotion={prefersReducedMotion} delay={i * 0.07}>
                <ClayCard colorway={f.cw as any} interactive={false} style={{ height: '100%' }}>
                  <div style={{ ...iconBox(f.bg), marginBottom: 14 }}>{f.icon}</div>
                  <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 6, letterSpacing: '-0.01em' }}>{f.title}</h3>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.55 }}>{f.desc}</p>
                </ClayCard>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* ════ COMPONENTS ════════════════════════════════════════════════ */}
        <section id="components" style={sectionPad}>
          <ScrollReveal reducedMotion={prefersReducedMotion}>
            <SectionHeading
              reducedMotion={prefersReducedMotion}
              label="Component kitchen"
              title="Production-ready components"
              subtitle="Not just demos — real components you can drop into your next project, optimised for performance, accessibility, and delight."
            />
          </ScrollReveal>

          {/* ── Dashboard ─── */}
          <ScrollReveal reducedMotion={prefersReducedMotion} delay={0.08}>
            <div style={{ marginBottom: 48 }}>
              <p style={{ fontSize: 'var(--type-label-size)', fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: 14 }}>Dashboard widgets</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
                <ClayCard colorway="mint">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <ClayBadge colorway="mint">Revenue</ClayBadge>
                    <ClayAvatar size="sm" fallback="JD" />
                  </div>
                  <div style={{ fontSize: 'clamp(1.8rem,3.5vw,2.4rem)', fontWeight: 900, color: 'var(--mochi-mint-vivid)', marginBottom: 4, letterSpacing: '-0.03em' }}>$48.2K</div>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 14 }}>Monthly recurring revenue</p>
                  <ClaySlider value={72} onChange={() => {}} colorway="mint" showTicks label="Goal progress" />
                </ClayCard>
                <ClayCard colorway="blue">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <ClayBadge colorway="blue">Users</ClayBadge>
                    <span style={{ fontSize: 20 }}>👥</span>
                  </div>
                  <div style={{ fontSize: 'clamp(1.8rem,3.5vw,2.4rem)', fontWeight: 900, color: 'var(--mochi-sky-blue)', marginBottom: 4, letterSpacing: '-0.03em' }}>2,847</div>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 14 }}>Active subscribers this month</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Icons.Chart />
                    <span style={{ fontSize: 13, color: 'var(--mochi-mint-vivid)', fontWeight: 700 }}>+12.5% from last month</span>
                  </div>
                </ClayCard>
                <ClayCard colorway="lavender" variant="stats">
                  <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.08em' }}>System Health</h4>
                  {[
                    { label: 'API', value: 99.9 },
                    { label: 'Database', value: 98.2 },
                    { label: 'CDN', value: 99.5 },
                  ].map(item => (
                    <div key={item.label} style={{ marginBottom: 10 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 5 }}>
                        <span style={{ fontWeight: 500 }}>{item.label}</span>
                        <span style={{ fontWeight: 700 }}>{item.value}%</span>
                      </div>
                      <ClayProgress value={item.value} size="sm" showValue={false} colorway={item.value > 99 ? 'mint' : 'peach'} />
                    </div>
                  ))}
                </ClayCard>
              </div>
            </div>
          </ScrollReveal>

          {/* ── Form ─── */}
          <ScrollReveal reducedMotion={prefersReducedMotion} delay={0.12}>
            <div style={{ marginBottom: 48 }}>
              <p style={{ fontSize: 'var(--type-label-size)', fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: 14 }}>Settings form</p>
              <div style={{ maxWidth: 500, display: 'flex', flexDirection: 'column', gap: 18 }}>
                <ClayInput placeholder="you@company.com" type="email" label="Work Email" icon={<Icons.Bell />} />
                <ClayInput placeholder="Enter password" type="password" label="Password" />
                <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                  <ClayToggle colorway="mint" label="Notifications" checked={toggleChecked} onChange={v => { audio.pop?.(); setToggleChecked(v); }} />
                  <ClayToggle colorway="blue" label="Dark mode" checked={theme === 'dark'} onChange={toggleTheme} />
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <ClayButton colorway="mint">Save Changes</ClayButton>
                  <ClayButton colorway="neutral">Cancel</ClayButton>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* ── Buttons ─── */}
          <ScrollReveal reducedMotion={prefersReducedMotion} delay={0.16}>
            <div style={{ marginBottom: 48 }}>
              <p style={{ fontSize: 'var(--type-label-size)', fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: 14 }}>Buttons & controls</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 16 }}>
                {(['mint', 'blue', 'pink', 'lavender', 'peach', 'neutral'] as const).map(cw => (
                  <ClayButton key={cw} colorway={cw} onClick={triggerRebound}>
                    {cw.charAt(0).toUpperCase() + cw.slice(1)}
                  </ClayButton>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                <ClayButton colorway="mint" icon={<Icons.Search />} iconPosition="leading">Search</ClayButton>
                <ClayButton colorway="blue" icon={<Icons.Bell />} iconPosition="trailing">Notify</ClayButton>
                <ClayRebound trigger={reboundTrigger}>
                  <ClayButton colorway="lavender" onClick={triggerRebound}>Rebound</ClayButton>
                </ClayRebound>
              </div>
            </div>
          </ScrollReveal>

          {/* ── Chart ─── */}
          <ScrollReveal reducedMotion={prefersReducedMotion} delay={0.2}>
            <div style={{ marginBottom: 48 }}>
              <p style={{ fontSize: 'var(--type-label-size)', fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: 14 }}>Data visualization</p>
              <ClayCard colorway="neutral">
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: 220, gap: 20, padding: '0 12px' }}>
                  {chartData.map((bar, i) => (
                    <ClayChartBar key={bar.label} value={bar.value} label={bar.label} colorway={bar.colorway} delay={i * 200} />
                  ))}
                </div>
              </ClayCard>
              <div style={{ marginTop: 20 }}>
                <ClaySlider value={sliderValue} onChange={v => { audio.slide?.(sliderValue, v); setSliderValue(v); }} colorway="mint" showTicks label="Adjust projection" />
              </div>
            </div>
          </ScrollReveal>

          {/* ── Segmented ─── */}
          <ScrollReveal reducedMotion={prefersReducedMotion} delay={0.22}>
            <div style={{ marginBottom: 48 }}>
              <p style={{ fontSize: 'var(--type-label-size)', fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: 14 }}>Segmented control</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'center' }}>
                <ClaySegmentedControl
                  options={[
                    { value: 'design', label: 'Design' },
                    { value: 'code', label: 'Code' },
                    { value: 'docs', label: 'Docs' },
                  ]}
                  value={segmentValue}
                  onChange={v => { audio.pop?.(); setSegmentValue(v); }}
                  colorway="mint"
                />
                <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
                  Active: <strong style={{ color: 'var(--text-primary)' }}>{segmentValue}</strong>
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* ── Tooltips ─── */}
          <ScrollReveal reducedMotion={prefersReducedMotion} delay={0.24}>
            <div style={{ marginBottom: 48 }}>
              <p style={{ fontSize: 'var(--type-label-size)', fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: 14 }}>Tooltips</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
                {(['top', 'bottom', 'left', 'right'] as const).map((pos, i) => (
                  <ClayTooltip key={pos} content={`${pos.charAt(0).toUpperCase() + pos.slice(1)} tooltip`} position={pos}>
                    <ClayButton colorway={(['mint', 'blue', 'lavender', 'peach'] as const)[i]} size="sm">
                      {pos.charAt(0).toUpperCase() + pos.slice(1)}
                    </ClayButton>
                  </ClayTooltip>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* ── Skeleton ─── */}
          <ScrollReveal reducedMotion={prefersReducedMotion} delay={0.26}>
            <div>
              <p style={{ fontSize: 'var(--type-label-size)', fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: 14 }}>Skeleton loading</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
                <ClayCard colorway="neutral">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                    <ClaySkeleton variant="circular" width={40} height={40} animation="pulse" />
                    <div style={{ flex: 1 }}>
                      <ClaySkeleton variant="text" width="60%" animation="pulse" />
                      <ClaySkeleton variant="text" width="40%" animation="pulse" />
                    </div>
                  </div>
                  <ClaySkeleton variant="rounded" height={72} animation="wave" />
                </ClayCard>
                <ClayCard colorway="neutral">
                  <ClaySkeleton variant="rectangular" height={110} animation="pulse" />
                  <div style={{ marginTop: 12 }}>
                    <ClaySkeleton variant="text" width="80%" animation="wave" />
                    <ClaySkeleton variant="text" width="50%" animation="wave" />
                  </div>
                </ClayCard>
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* ════ GAME ══════════════════════════════════════════════════════ */}
        <section id="game" style={sectionPad}>
          <ScrollReveal reducedMotion={prefersReducedMotion}>
            <SectionHeading
              reducedMotion={prefersReducedMotion}
              label="Interactive playground"
              title="Mochi Bounce"
              subtitle="The design system in play form. Drag the squircle blob, fling it upward, collect stars and chain peg bounces. Built entirely with the same tokens and shape language as the components above."
            />
          </ScrollReveal>
          <ScrollReveal reducedMotion={prefersReducedMotion} delay={0.1}>
            <MochiBounce />
          </ScrollReveal>
        </section>

        {/* ════ TEAMS ═════════════════════════════════════════════════════ */}
        <section id="teams" style={sectionPad}>
          <ScrollReveal reducedMotion={prefersReducedMotion}>
            <SectionHeading
              reducedMotion={prefersReducedMotion}
              label="Made for every team"
              title="Built for designers and developers alike"
              subtitle="Whether you're sketching in Figma or shipping to production, Mochi UI fits your workflow."
            />
          </ScrollReveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            <ScrollReveal reducedMotion={prefersReducedMotion} delay={0.1}>
              <ClayCard colorway="blue">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <div style={iconBox('var(--mochi-sky-blue)')}><Icons.Figma /></div>
                  <h3 style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.02em' }}>For Designers</h3>
                </div>
                <ul style={{ padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    'Figma variable library with 1:1 token mapping',
                    'Auto-layout components that mirror React props',
                    'Dark mode preview baked into every frame',
                    'A11y annotations for WCAG compliance',
                  ].map(item => (
                    <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 14, color: 'var(--text-secondary)' }}>
                      <span style={{ color: 'var(--mochi-mint-vivid)', fontWeight: 800, flexShrink: 0 }}>✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </ClayCard>
            </ScrollReveal>
            <ScrollReveal reducedMotion={prefersReducedMotion} delay={0.18}>
              <ClayCard colorway="mint">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <div style={iconBox('var(--mochi-mint-vivid)')}><Icons.Code /></div>
                  <h3 style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.02em' }}>For Developers</h3>
                </div>
                <ul style={{ padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    'Tree-shakeable ESM exports with zero runtime overhead',
                    'TypeScript-native with strict prop inference',
                    'CSS custom properties for instant theming',
                    'SSR-friendly with Astro, Next.js, and Remix',
                  ].map(item => (
                    <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 14, color: 'var(--text-secondary)' }}>
                      <span style={{ color: 'var(--mochi-mint-vivid)', fontWeight: 800, flexShrink: 0 }}>✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </ClayCard>
            </ScrollReveal>
          </div>
        </section>

        {/* ════ GET STARTED ═══════════════════════════════════════════════ */}
        <section id="start" style={sectionPad}>
          <ScrollReveal reducedMotion={prefersReducedMotion}>
            <div style={{
              maxWidth: 640, margin: '0 auto', textAlign: 'center',
              padding: 'var(--space-16) var(--space-8)',
              borderRadius: 'var(--radius-squircle-xl)',
              background: 'var(--bg-card)',
              boxShadow: 'var(--shadow-clay)',
            }}>
              <SectionLabel>Get started in 30 seconds</SectionLabel>
              <h2 style={{
                fontSize: 'var(--type-title-size)',
                fontWeight: 900, letterSpacing: 'var(--type-title-tracking)',
                marginBottom: 12, color: 'var(--text-primary)',
              }}>
                Ready to build something soft?
              </h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 32, lineHeight: 'var(--type-body-line)' }}>
                Install Mochi UI and start building claymorphic interfaces with spring physics, haptic feedback, and accessible components.
              </p>

              {/* Install command */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '14px 20px',
                borderRadius: 'var(--radius-squircle-sm)',
                background: 'var(--bg-inset)',
                boxShadow: 'inset 3px 3px 8px rgba(0,0,0,0.06), inset -3px -3px 8px rgba(255,255,255,0.8)',
                fontFamily: 'var(--font-mono)',
                fontSize: 14, color: 'var(--text-primary)',
                marginBottom: 28, textAlign: 'left',
                justifyContent: 'space-between',
              }}>
                <code>npm install @mochi-ui/react</code>
                <motion.button
                  onClick={copyInstall}
                  whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: copied ? 'var(--mochi-mint-vivid)' : 'var(--text-tertiary)', transition: 'color 0.2s' }}
                  aria-label="Copy install command"
                >
                  <AnimatePresence mode="wait">
                    <motion.span key={copied ? 'check' : 'copy'} initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.7, opacity: 0 }} transition={{ duration: 0.15 }}>
                      {copied ? '✓' : <Icons.Copy />}
                    </motion.span>
                  </AnimatePresence>
                </motion.button>
              </div>

              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <ClayButton colorway="mint" size="lg" onClick={() => window.open('https://github.com/qt314wink/mochi-ui', '_blank')} icon={<Icons.GitHub />} iconPosition="leading">
                  Get Started
                </ClayButton>
                <ClayButton colorway="neutral" size="lg" onClick={() => setShowModal(true)}>
                  Read Docs
                </ClayButton>
              </div>
            </div>
          </ScrollReveal>
        </section>

        <ClayModal isOpen={showModal} onClose={() => { audio.pop?.(); setShowModal(false); }} title="Documentation" size="md">
          <div style={{ padding: 24 }}>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 24, lineHeight: 'var(--type-body-line)' }}>
              Full documentation is in development. Explore the component source code on GitHub or inspect the live examples on this page.
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <ClayButton colorway="neutral" onClick={() => { audio.pop?.(); setShowModal(false); }}>Close</ClayButton>
              <ClayButton colorway="mint" onClick={() => window.open('https://github.com/qt314wink/mochi-ui', '_blank')}>View GitHub</ClayButton>
            </div>
          </div>
        </ClayModal>
      </main>

      {/* ════ FOOTER ════════════════════════════════════════════════════ */}
      <footer style={{
        padding: '48px 24px 32px',
        borderTop: '1px solid var(--border-subtle)',
        textAlign: 'center',
        color: 'var(--text-tertiary)',
        fontSize: 13,
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 20, flexWrap: 'wrap', marginBottom: 20 }}>
            {['Home', 'About', 'Features', 'Components', 'Play', 'GitHub'].map(link => (
              <a
                key={link}
                href={link === 'GitHub' ? 'https://github.com/qt314wink/mochi-ui' : `#${link.toLowerCase()}`}
                target={link === 'GitHub' ? '_blank' : undefined}
                rel={link === 'GitHub' ? 'noopener noreferrer' : undefined}
                style={{ color: 'var(--text-tertiary)', textDecoration: 'none', fontWeight: 500, fontSize: 13 }}
              >
                {link}
              </a>
            ))}
          </div>
          <p style={{ marginBottom: 6, fontSize: 13 }}>Mochi UI — A claymorphism design system built with Astro, React, and Motion.</p>
          <p style={{ fontSize: 11, opacity: 0.6 }}>© {new Date().getFullYear()} Mochi UI. Open source under MIT License.</p>
        </div>
      </footer>
    </div>
  );
};

// ─── Root component ───────────────────────────────────────────────────────────
const EnhancedShowcasePage: React.FC = () => {
  const { prefersReducedMotion } = useResponsive();
  const [loaded, setLoaded] = useState(false);
  return (
    <AudioProvider>
      <SmoothScrollProvider>
        {!loaded && <MochiLoader onDone={() => setLoaded(true)} />}
        <ErrorBoundary fallback={<div style={{ position: 'fixed', inset: 0, zIndex: 0, opacity: 0.5, background: 'linear-gradient(135deg, #DCEBfA 0%, #F0E6F5 50%, #E6F5EB 100%)' }} />}>
          <AtmosphereCanvas reducedMotion={prefersReducedMotion} />
        </ErrorBoundary>
        <ShowcaseContent />
      </SmoothScrollProvider>
    </AudioProvider>
  );
};

export default EnhancedShowcasePage;
