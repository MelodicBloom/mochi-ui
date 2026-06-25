import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
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
  FloatingGroup,
  ClayRebound,
  PhysicsProvider,
  physicsPresets,
  type PhysicsPreset,
  ClayHero3D,
  ClayPlayground,
  SplitText,
  ScrollReveal,
  ParallaxLayer,
  TextRevealBlock,
  ScrollProgressBar,
} from './index';
import { AudioProvider, useMochiAudio } from './enhanced/audio/AudioEngine';
import { SmoothScrollProvider } from './enhanced/effects/SmoothScroll';
import { AtmosphereCanvas } from './enhanced/effects/AtmosphereCanvas';
import { useActiveSection } from '../hooks/useActiveSection';
import { useResponsive } from './enhanced/responsive/ResponsiveSystem';
import { ErrorBoundary } from './ErrorBoundary';
import { ClayIcon, ClayIconRow, type ClayIconName } from './icons';

const Icons = {
  Search: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>,
  Bell: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>,
  Chart: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>,
  Message: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  Moon: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>,
  Sun: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>,
  Audio: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>,
  VolumeOff: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" x2="17" y1="9" y2="15"/><line x1="17" x2="23" y1="9" y2="15"/></svg>,
  Zap: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  Layers: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>,
  Code: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
  Figma: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5z"/><path d="M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z"/><path d="M12 12.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 1 1-7 0z"/><path d="M5 19.5A3.5 3.5 0 0 1 8.5 23H12v-7H8.5A3.5 3.5 0 0 1 5 19.5z"/><path d="M5 12.5A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 12.5z"/></svg>,
  Accessibility: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>,
  Palette: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.01 17.461 2 12 2z"/></svg>,
  Download: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>,
};

const sectionIds = ['hero', 'about', 'features', 'playground', 'components', 'assets', 'teams', 'start'];
const sectionLabels: Record<string, string> = {
  hero: 'Home', about: 'About', features: 'Features',
  playground: 'Playground', components: 'Components', assets: 'Assets', teams: 'Teams', start: 'Get Started',
};

const SectionHeading: React.FC<{ title: string; subtitle?: string; reducedMotion?: boolean }> = ({ title, subtitle, reducedMotion }) => {
  if (reducedMotion) {
    return (
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: subtitle ? 12 : 0 }}>{title}</h2>
        {subtitle && <p style={{ color: 'var(--text-secondary)', maxWidth: 600, lineHeight: 1.6 }}>{subtitle}</p>}
      </div>
    );
  }
  return (
    <div style={{ marginBottom: 32 }}>
      <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }} style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: subtitle ? 12 : 0 }}>{title}</motion.h2>
      {subtitle && <motion.p initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.5, delay: 0.1, ease: [0.34, 1.56, 0.64, 1] }} style={{ color: 'var(--text-secondary)', maxWidth: 600, lineHeight: 1.6 }}>{subtitle}</motion.p>}
    </div>
  );
};

// ── Component thumbnail data ──────────────────────────────────────────────────
const THUMBNAILS = [
  { file: 'thumb-button.svg', label: 'ClayButton',  colorway: 'mint'     },
  { file: 'thumb-card.svg',   label: 'ClayCard',    colorway: 'blue'     },
  { file: 'thumb-input.svg',  label: 'ClayInput',   colorway: 'lavender' },
  { file: 'thumb-toggle.svg', label: 'ClayToggle',  colorway: 'pink'     },
  { file: 'thumb-slider.svg', label: 'ClaySlider',  colorway: 'amber'    },
  { file: 'thumb-avatar.svg', label: 'ClayAvatar',  colorway: 'lavender' },
] as const;

// ── Feature definitions (with ClayIcon names) ────────────────────────────────
const FEATURES: Array<{
  iconName: ClayIconName;
  title: string;
  desc: string;
  color: string;
}> = [
  { iconName: 'sun',      title: 'Spring Physics',    desc: 'Mass-spring-damper physics power every animation. No cubic-bezier guessing.',              color: 'mint'     },
  { iconName: 'chart',    title: '30+ Components',    desc: 'Buttons, cards, inputs, toggles, sliders, charts, modals, tooltips, and more.',             color: 'blue'     },
  { iconName: 'calendar', title: 'Figma Compatible',  desc: 'Design tokens map 1:1 between Figma variables and CSS custom properties.',                  color: 'pink'     },
  { iconName: 'bell',     title: 'A11y Built-In',     desc: 'ARIA labels, keyboard navigation, focus rings, and reduced-motion support.',                 color: 'lavender' },
  { iconName: 'copy',     title: 'TypeScript Native', desc: 'Fully typed props, strict inference, and IntelliSense-friendly APIs.',                       color: 'peach'    },
  { iconName: 'moon',     title: 'Dark Mode',         desc: 'Automatic theme switching with CSS custom properties and localStorage persistence.',         color: 'neutral'  },
];

interface ShowcaseContentProps {
  physicsPreset: PhysicsPreset;
  setPhysicsPreset: (p: PhysicsPreset) => void;
}

const ShowcaseContent: React.FC<ShowcaseContentProps> = ({ physicsPreset, setPhysicsPreset }) => {
  const [theme, setTheme]               = useState('light');
  const [sliderValue, setSliderValue]   = useState(65);
  const [toggleChecked, setToggleChecked] = useState(true);
  const [reboundTrigger, setReboundTrigger] = useState(false);
  const [showModal, setShowModal]       = useState(false);
  const [segmentValue, setSegmentValue] = useState('design');

  const audio = useMochiAudio();
  const { prefersReducedMotion } = useResponsive();
  const { activeId, scrollTo } = useActiveSection(sectionIds);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const progressBarWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      const n = parseInt(e.key);
      if (n >= 1 && n <= sectionIds.length) scrollTo(sectionIds[n - 1]);
    };
    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, [scrollTo]);

  const toggleTheme = useCallback(() => {
    audio.success();
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  }, [theme, audio]);

  const triggerRebound = useCallback(() => {
    audio.playClick('soft');
    setReboundTrigger(true);
    setTimeout(() => setReboundTrigger(false), 600);
  }, [audio]);

  const chartData = [
    { value: 45, label: 'Q1', colorway: 'lavender' as const },
    { value: 70, label: 'Q2', colorway: 'peach' as const },
    { value: 55, label: 'Q3', colorway: 'mint' as const },
    { value: 85, label: 'Q4', colorway: 'blue' as const },
  ];

  return (
    <div ref={containerRef} style={{ minHeight: '100vh', background: 'var(--bg-base)', transition: 'background 0.3s' }}>
      <ScrollProgressBar color="var(--mochi-mint)" />

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(var(--bg-surface-rgb, 255,248,240),0.88)', backdropFilter: 'blur(20px) saturate(180%)', WebkitBackdropFilter: 'blur(20px) saturate(180%)', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <FloatingContainer amplitude={4} frequency={0.8}>
              <motion.div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg, var(--mochi-mint), var(--mochi-sage))', boxShadow: 'var(--shadow-clay)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'white', fontSize: 18, cursor: 'pointer' }} whileHover={{ scale: 1.1, rotate: 10 }} whileTap={{ scale: 0.9 }} onClick={() => scrollTo('hero')}>M</motion.div>
            </FloatingContainer>
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>Mochi UI</h1>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Claymorphism Design System</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <ClayTooltip content={audio.isEnabled ? 'Audio On' : 'Audio Off'}>
              <ClayButton size="sm" colorway={audio.isEnabled ? 'mint' : 'neutral'} onClick={() => { if (audio.isEnabled) audio.disable(); else audio.enable(); }}>
                {audio.isEnabled ? <Icons.Audio /> : <Icons.VolumeOff />}
              </ClayButton>
            </ClayTooltip>
            <select value={physicsPreset} onChange={(e) => setPhysicsPreset(e.target.value as PhysicsPreset)} style={{ padding: '8px 16px', borderRadius: 12, border: 'none', background: 'var(--bg-card)', boxShadow: 'var(--shadow-clay)', fontSize: 13, color: 'var(--text-primary)', cursor: 'pointer' }}>
              {Object.keys(physicsPresets).map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
            </select>
            <ClayButton size="sm" colorway="neutral" onClick={toggleTheme}>{theme === 'light' ? <Icons.Moon /> : <Icons.Sun />}</ClayButton>
          </div>
        </div>

        <nav style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 12px', display: 'flex', gap: 8, overflowX: 'auto', scrollbarWidth: 'none' }}>
          {sectionIds.map(id => (
            <motion.button key={id} onClick={() => scrollTo(id)} aria-label={`Go to ${sectionLabels[id]}`} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ padding: '8px 16px', borderRadius: 12, border: 'none', background: activeId === id ? 'var(--mochi-mint)' : 'transparent', color: activeId === id ? 'white' : 'var(--text-secondary)', fontSize: 14, fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap' }}>
              {sectionLabels[id]}
            </motion.button>
          ))}
        </nav>
      </header>

      {/* ── HERO ───────────────────────────────────────────────────────────── */}
      <section id="hero" style={{ padding: '0 24px 48px', position: 'relative', overflow: 'hidden' }}>
        {/* Clay blob background */}
        <img
          src="/assets/hero-bg.svg"
          alt=""
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center top',
            pointerEvents: 'none',
            userSelect: 'none',
            zIndex: 0,
            opacity: 0.72,
          }}
        />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <ClayHero3D
            headline={
              <div>
                <ClayBadge colorway="mint">v2.0 — Open Source</ClayBadge>
                <div style={{ height: 18 }} />
                <SplitText
                  as="h1"
                  text="Interfaces you can feel"
                  style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 800, lineHeight: 1.08, color: 'var(--text-primary)', margin: 0 }}
                />
              </div>
            }
            subheadline={
              <ParallaxLayer speed={0.18}>
                <p style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)', color: 'var(--text-secondary)', maxWidth: 520, lineHeight: 1.7, margin: '20px 0 28px' }}>
                  Mochi UI is a modern React component library built around claymorphism — soft, tactile interfaces with spring physics, haptic feedback, and accessible design tokens.
                </p>
              </ParallaxLayer>
            }
            cta={
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <ClayButton colorway="mint" size="lg" onClick={() => { audio.playClick('soft'); scrollTo('playground'); }}>Open Playground</ClayButton>
                <ClayButton colorway="neutral" size="lg" onClick={() => { audio.playSquish(); window.open('https://github.com/qt314wink/mochi-ui', '_blank'); }}>View on GitHub</ClayButton>
              </div>
            }
          />
        </div>
      </section>

      {/* ── TRUST BAR ──────────────────────────────────────────────────────── */}
      <section style={{ padding: '28px 24px', borderTop: '1px solid rgba(0,0,0,0.05)', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>Built for modern product teams with</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 20, flexWrap: 'wrap', alignItems: 'center' }}>
            {['Astro', 'React 19', 'Motion', 'TypeScript', 'Three.js', 'Web Audio API'].map(t => (
              <span key={t} style={{ padding: '6px 14px', borderRadius: 100, background: 'var(--bg-card)', boxShadow: 'var(--shadow-clay)', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>{t}</span>
            ))}
          </div>
        </div>
      </section>

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 48px' }}>

        {/* ── ABOUT ──────────────────────────────────────────────────────────── */}
        <section id="about" style={{ padding: '80px 0' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 48, alignItems: 'center' }}>
            <ScrollReveal>
              <div>
                <div style={{ marginBottom: 16 }}><ClayBadge colorway="mint">What is Claymorphism?</ClayBadge></div>
                <TextRevealBlock color="var(--mochi-mint)">
                  <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', fontWeight: 700, marginBottom: 16, color: 'var(--text-primary)', lineHeight: 1.2 }}>Soft UI that responds to touch</h2>
                </TextRevealBlock>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 16 }}>Claymorphism is the evolution of neumorphism — it replaces harsh shadows with soft, organic depth that mimics real clay. Every element in Mochi UI has physical presence: buttons compress when pressed, cards lift on hover, and inputs recess into the surface.</p>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>Unlike flat design or glassmorphism, claymorphism creates interfaces that feel <strong>tactile and responsive</strong>. It is the perfect middle ground for product teams who want personality without sacrificing usability.</p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.15}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <ClayCard colorway="mint" interactive={false}><div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--mochi-mint)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}><Icons.Zap /></div><div><div style={{ fontWeight: 600 }}>Spring Physics</div><div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Every interaction uses real mass and damping</div></div></div></ClayCard>
                <ClayCard colorway="blue" interactive={false}><div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--mochi-sky-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}><Icons.Accessibility /></div><div><div style={{ fontWeight: 600 }}>Accessibility First</div><div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>WCAG 2.1 AA compliant with reduced motion support</div></div></div></ClayCard>
                <ClayCard colorway="pink" interactive={false}><div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--mochi-blossom)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}><Icons.Palette /></div><div><div style={{ fontWeight: 600 }}>Design Tokens</div><div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Figma-ready variables with automatic dark mode</div></div></div></ClayCard>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ── FEATURES ───────────────────────────────────────────────────────── */}
        <section id="features" style={{ padding: '80px 0' }}>
          <ScrollReveal>
            <SectionHeading reducedMotion={prefersReducedMotion} title="Everything you need to ship faster" subtitle="Mochi UI combines a comprehensive component library with production-ready tooling for design systems, product teams, and indie developers." />
          </ScrollReveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
            {FEATURES.map((f, i) => (
              <ScrollReveal key={f.title} delay={i * 0.06}>
                <ClayCard colorway={f.color as any} interactive={false}>
                  <div style={{ marginBottom: 14 }}>
                    <ClayIcon name={f.iconName} size={48} />
                  </div>
                  <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 6 }}>{f.title}</h3>
                  <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{f.desc}</p>
                </ClayCard>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* ── PLAYGROUND ─────────────────────────────────────────────────────── */}
        <section id="playground" style={{ padding: '80px 0' }}>
          <SectionHeading reducedMotion={prefersReducedMotion} title="Live component playground" subtitle="Tune shape, surface, and spring response in real time. Press the preview button to feel each physics preset before you ship it." />
          <ClayPlayground />
        </section>

        {/* ── COMPONENTS ─────────────────────────────────────────────────────── */}
        <section id="components" style={{ padding: '80px 0' }}>
          <ScrollReveal>
            <SectionHeading reducedMotion={prefersReducedMotion} title="Production-ready components" subtitle="Not just demos — real components you can drop into your next project. Every element is optimized for performance, accessibility, and delightful interaction." />
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div style={{ marginBottom: 48 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-secondary)', marginBottom: 16 }}>Dashboard Widget</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
                <ClayCard colorway="mint"><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}><ClayBadge colorway="mint">Revenue</ClayBadge><ClayAvatar size="sm" fallback="JD" /></div><div style={{ fontSize: 'clamp(2rem,4vw,2.5rem)', fontWeight: 700, color: 'var(--mochi-mint)', marginBottom: 4 }}>$48.2K</div><p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 16 }}>Monthly recurring revenue</p><ClaySlider value={72} onChange={() => {}} colorway="mint" showTicks label="Goal progress" /></ClayCard>
                <ClayCard colorway="blue"><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}><ClayBadge colorway="blue">Users</ClayBadge><div style={{ fontSize: 24 }}>👥</div></div><div style={{ fontSize: 'clamp(2rem,4vw,2.5rem)', fontWeight: 700, color: 'var(--mochi-sky-blue)', marginBottom: 4 }}>2,847</div><p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 16 }}>Active subscribers this month</p><div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Icons.Chart /><span style={{ fontSize: 13, color: 'var(--mochi-mint)', fontWeight: 600 }}>+12.5% from last month</span></div></ClayCard>
                <ClayCard colorway="lavender" variant="stats"><h4 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)' }}>System Health</h4><div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12 }}>{[{ label: 'API', value: 99.9 }, { label: 'Database', value: 98.2 }, { label: 'CDN', value: 99.5 }].map(item => (<div key={item.label}><div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}><span>{item.label}</span><span style={{ fontWeight: 600 }}>{item.value}%</span></div><ClayProgress value={item.value} size="sm" showValue={false} colorway={item.value > 99 ? 'mint' : 'peach'} /></div>))}</div></ClayCard>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <div style={{ marginBottom: 48 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-secondary)', marginBottom: 16 }}>Settings Form</h3>
              <div style={{ maxWidth: 520, display: 'flex', flexDirection: 'column', gap: 20 }}>
                <ClayInput placeholder="your@company.com" type="email" label="Work Email" icon={<Icons.Message />} />
                <ClayInput placeholder="Enter password" type="password" label="Password" />
                <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                  <ClayToggle colorway="mint" label="Enable notifications" checked={toggleChecked} onChange={(v) => { audio.pop(); setToggleChecked(v); }} />
                  <ClayToggle colorway="blue" label="Dark mode" checked={theme === 'dark'} onChange={toggleTheme} />
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <ClayButton colorway="mint">Save Changes</ClayButton>
                  <ClayButton colorway="neutral">Cancel</ClayButton>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div style={{ marginBottom: 48 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-secondary)', marginBottom: 16 }}>Buttons & Controls</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
                {(['mint', 'blue', 'pink', 'lavender', 'peach', 'neutral'] as const).map(cw => <ClayButton key={cw} colorway={cw} onClick={triggerRebound}>{cw.charAt(0).toUpperCase() + cw.slice(1)}</ClayButton>)}
              </div>
              <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                <ClayButton colorway="mint" icon={<Icons.Search />} iconPosition="leading">Search</ClayButton>
                <ClayButton colorway="blue" icon={<Icons.Bell />} iconPosition="trailing">Notify</ClayButton>
                <ClayRebound trigger={reboundTrigger}><ClayButton colorway="lavender" onClick={triggerRebound}>Rebound</ClayButton></ClayRebound>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.25}>
            <div style={{ marginBottom: 48 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-secondary)', marginBottom: 16 }}>Data Visualization</h3>
              <ClayCard colorway="neutral"><div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: 240, gap: 24, padding: '0 16px' }}>{chartData.map((bar, i) => <ClayChartBar key={bar.label} value={bar.value} label={bar.label} colorway={bar.colorway} delay={i * 200} />)}</div></ClayCard>
              <div style={{ marginTop: 24 }}><ClaySlider value={sliderValue} onChange={(v) => { audio.slide(sliderValue, v); setSliderValue(v); }} colorway="mint" showTicks label="Adjust projection" /></div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div style={{ marginBottom: 48 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-secondary)', marginBottom: 16 }}>Tooltips</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>
                <ClayTooltip content="Top tooltip" position="top"><ClayButton colorway="mint" size="sm">Hover Top</ClayButton></ClayTooltip>
                <ClayTooltip content="Bottom tooltip" position="bottom"><ClayButton colorway="blue" size="sm">Hover Bottom</ClayButton></ClayTooltip>
                <ClayTooltip content="Left tooltip" position="left"><ClayButton colorway="lavender" size="sm">Hover Left</ClayButton></ClayTooltip>
                <ClayTooltip content="Right tooltip" position="right"><ClayButton colorway="peach" size="sm">Hover Right</ClayButton></ClayTooltip>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <div style={{ marginBottom: 48 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-secondary)', marginBottom: 16 }}>Segmented Control</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'center' }}>
                <ClaySegmentedControl options={[{ value: 'design', label: 'Design' }, { value: 'code', label: 'Code' }, { value: 'docs', label: 'Docs' }]} value={segmentValue} onChange={(v) => { audio.pop(); setSegmentValue(v); }} colorway="mint" />
                <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Selected: <strong style={{ color: 'var(--text-primary)' }}>{segmentValue}</strong></p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-secondary)', marginBottom: 16 }}>Skeleton Loading</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
                <ClayCard colorway="neutral"><div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}><ClaySkeleton variant="circular" width={40} height={40} animation="pulse" /><div style={{ flex: 1 }}><ClaySkeleton variant="text" width="60%" animation="pulse" /><ClaySkeleton variant="text" width="40%" animation="pulse" /></div></div><ClaySkeleton variant="rounded" height={80} animation="wave" /></ClayCard>
                <ClayCard colorway="neutral"><ClaySkeleton variant="rectangular" height={120} animation="pulse" /><div style={{ marginTop: 12 }}><ClaySkeleton variant="text" width="80%" animation="wave" /><ClaySkeleton variant="text" width="50%" animation="wave" /></div></ClayCard>
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* ── ASSETS GALLERY ─────────────────────────────────────────────────── */}
        <section id="assets" style={{ padding: '80px 0' }}>
          <ScrollReveal>
            <SectionHeading
              reducedMotion={prefersReducedMotion}
              title="Visual asset pack"
              subtitle="21 production-ready SVGs — clay icon pills, component thumbnails, hero backgrounds, and CTA button states. All MIT licensed and tree-shakeable."
            />
          </ScrollReveal>

          {/* Icon row */}
          <ScrollReveal delay={0.08}>
            <div style={{ marginBottom: 40 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-secondary)', marginBottom: 16 }}>Clay Icon Pills</h3>
              <ClayIconRow size={56} gap={16} />
            </div>
          </ScrollReveal>

          {/* Component thumbnail grid */}
          <ScrollReveal delay={0.12}>
            <div style={{ marginBottom: 40 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-secondary)', marginBottom: 16 }}>Component Thumbnails</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20 }}>
                {THUMBNAILS.map((t, i) => (
                  <ScrollReveal key={t.file} delay={i * 0.07}>
                    <motion.div
                      whileHover={{ y: -4, boxShadow: '0 20px 48px rgba(0,0,0,0.12)' }}
                      style={{
                        borderRadius: 20,
                        overflow: 'hidden',
                        background: 'var(--bg-card)',
                        boxShadow: 'var(--shadow-clay)',
                        cursor: 'default',
                      }}
                    >
                      <img
                        src={`/assets/thumbs/${t.file}`}
                        alt={`${t.label} component preview`}
                        style={{ width: '100%', display: 'block', aspectRatio: '1 / 1', objectFit: 'cover' }}
                        loading="lazy"
                      />
                      <div style={{ padding: '10px 14px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{t.label}</span>
                        <ClayBadge colorway={t.colorway as any} style={{ fontSize: 11, padding: '2px 8px' }}>{t.colorway}</ClayBadge>
                      </div>
                    </motion.div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* CTA button states strip */}
          <ScrollReveal delay={0.1}>
            <div style={{ marginBottom: 16 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-secondary)', marginBottom: 16 }}>CTA Button States</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
                {(['default', 'hover', 'pressed', 'disabled'] as const).map((state) => (
                  <div key={state} style={{ borderRadius: 16, overflow: 'hidden', background: 'var(--bg-card)', boxShadow: 'var(--shadow-clay)' }}>
                    <img
                      src={`/assets/cta/cta-${state}.svg`}
                      alt={`CTA button ${state} state`}
                      style={{ width: '100%', display: 'block' }}
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* ── FOR TEAMS ──────────────────────────────────────────────────────── */}
        <section id="teams" style={{ padding: '80px 0' }}>
          <ScrollReveal>
            <SectionHeading reducedMotion={prefersReducedMotion} title="Built for every team" subtitle="Whether you are a designer sketching in Figma or a developer shipping to production, Mochi UI fits your workflow." />
          </ScrollReveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 32 }}>
            <ScrollReveal delay={0.1}><ClayCard colorway="blue"><div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}><div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--mochi-sky-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}><Icons.Figma /></div><h3 style={{ fontSize: 18, fontWeight: 700 }}>For Designers</h3></div><ul style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 0, listStyle: 'none' }}>{['Figma variable library with 1:1 token mapping', 'Auto-layout components that mirror React props', 'Dark mode preview baked into every frame', 'Accessibility annotations for WCAG compliance'].map(item => (<li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 14, color: 'var(--text-secondary)' }}><span style={{ color: 'var(--mochi-mint)', fontWeight: 700, flexShrink: 0 }}>✓</span>{item}</li>))}</ul></ClayCard></ScrollReveal>
            <ScrollReveal delay={0.2}><ClayCard colorway="mint"><div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}><div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--mochi-mint)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}><Icons.Code /></div><h3 style={{ fontSize: 18, fontWeight: 700 }}>For Developers</h3></div><ul style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 0, listStyle: 'none' }}>{['Tree-shakeable ESM exports with zero runtime overhead', 'TypeScript-native with strict prop inference', 'CSS custom properties for instant theming', 'SSR-friendly with Astro, Next.js, and Remix'].map(item => (<li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 14, color: 'var(--text-secondary)' }}><span style={{ color: 'var(--mochi-mint)', fontWeight: 700, flexShrink: 0 }}>✓</span>{item}</li>))}</ul></ClayCard></ScrollReveal>
          </div>
        </section>

        {/* ── GET STARTED ────────────────────────────────────────────────────── */}
        <section id="start" style={{ padding: '80px 0' }}>
          <ScrollReveal>
            <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center', padding: '64px 32px', borderRadius: 28, background: 'var(--bg-card)', boxShadow: 'var(--shadow-clay)' }}>
              <h2 style={{ fontSize: 'clamp(1.5rem,3vw,2rem)', fontWeight: 700, marginBottom: 12, color: 'var(--text-primary)' }}>Ready to build something soft?</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 32, lineHeight: 1.6 }}>Install Mochi UI in seconds and start building claymorphic interfaces with spring physics, haptic feedback, and accessible components.</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 20px', borderRadius: 16, background: 'var(--bg-surface)', boxShadow: 'inset 3px 3px 6px rgba(0,0,0,0.06), inset -3px -3px 6px rgba(255,255,255,0.8)', fontFamily: 'monospace', fontSize: 14, marginBottom: 32, textAlign: 'left', justifyContent: 'space-between' }}>
                <code>npm install @mochi-ui/react</code>
                <button onClick={() => { navigator.clipboard.writeText('npm install @mochi-ui/react'); audio.success(); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: 13 }}>Copy</button>
              </div>
              <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
                <ClayButton colorway="mint" size="lg" onClick={() => { audio.playClick('soft'); window.open('https://github.com/qt314wink/mochi-ui', '_blank'); }}>Get Started</ClayButton>
                <ClayButton colorway="neutral" size="lg" onClick={() => { audio.playSquish(); setShowModal(true); }}>Read Docs</ClayButton>
              </div>
            </div>
          </ScrollReveal>
        </section>

        <ClayModal isOpen={showModal} onClose={() => { audio.pop(); setShowModal(false); }} title="Documentation" size="md">
          <div style={{ padding: 24 }}>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>The docs site is deploying to Vercel. In the meantime, the live playground above is the fastest way to explore the system and feel each spring preset before you install.</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <ClayButton colorway="neutral" onClick={() => { audio.pop(); setShowModal(false); }}>Close</ClayButton>
              <ClayButton colorway="mint" onClick={() => { audio.success(); scrollTo('playground'); setShowModal(false); }}>Open Playground</ClayButton>
            </div>
          </div>
        </ClayModal>
      </main>

      {/* ── FOOTER ─────────────────────────────────────────────────────────── */}
      <footer style={{ marginTop: 64, padding: '48px 24px 32px', borderTop: '1px solid rgba(0,0,0,0.05)', textAlign: 'center', color: 'var(--text-secondary)', fontSize: 14 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap', marginBottom: 24 }}>
            {['Home', 'About', 'Features', 'Playground', 'Components', 'Assets'].map(label => (
              <a key={label} href={`#${label.toLowerCase()}`} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>{label}</a>
            ))}
            <a href="https://github.com/qt314wink/mochi-ui" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>GitHub</a>
          </div>

          {/* Asset pack download CTA */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '12px 24px', borderRadius: 16, background: 'var(--bg-card)', boxShadow: 'var(--shadow-clay)', marginBottom: 28 }}>
            <img src="/assets/pack-cover.svg" alt="" aria-hidden="true" style={{ width: 36, height: 36, borderRadius: 8, objectFit: 'cover' }} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>Mochi UI Asset Pack</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>21 SVG files · MIT License</div>
            </div>
            <a
              href="/assets/asset-manifest.json"
              download
              onClick={() => audio.success()}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 10, background: 'var(--mochi-mint)', color: 'white', textDecoration: 'none', fontSize: 13, fontWeight: 600 }}
            >
              <Icons.Download /> Download
            </a>
          </div>

          <p style={{ marginBottom: 8 }}>Mochi UI — A claymorphism design system built with Astro, React, and Motion.</p>
          <p style={{ fontSize: 12, opacity: 0.7 }}>© {new Date().getFullYear()} Mochi UI. Open source under MIT License.</p>
        </div>
      </footer>
    </div>
  );
};

const EnhancedShowcasePage: React.FC = () => {
  const [physicsPreset, setPhysicsPreset] = useState<PhysicsPreset>('clay');
  const { prefersReducedMotion } = useResponsive();
  return (
    <AudioProvider>
      <SmoothScrollProvider>
        <PhysicsProvider config={physicsPresets[physicsPreset]}>
          <ErrorBoundary fallback={<div style={{ position: 'fixed', inset: 0, zIndex: 0, opacity: 0.5, background: 'linear-gradient(135deg,rgb(220,235,250) 0%,rgb(240,230,245) 50%,rgb(230,245,235) 100%)' }} />}>
            <AtmosphereCanvas reducedMotion={prefersReducedMotion} />
          </ErrorBoundary>
          <ShowcaseContent physicsPreset={physicsPreset} setPhysicsPreset={setPhysicsPreset} />
        </PhysicsProvider>
      </SmoothScrollProvider>
    </AudioProvider>
  );
};

export default EnhancedShowcasePage;
