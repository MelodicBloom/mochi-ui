import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ClayButton,
  ClayCard,
  ClayToggle,
  ClaySlider,
  ClayInput,
  ClayChartBar,
  ClayBadge,
  ClayAvatar,
  BentoGrid,
  BentoItem,
  FloatingContainer,
  FloatingGroup,
  ClayRebound,
  PhysicsProvider,
  physicsPresets,
  ClayNotificationProvider,
  useNotification,
} from './index';

// Icons
const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
  </svg>
);
const BellIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
  </svg>
);
const ChartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/>
  </svg>
);
const CalendarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/>
  </svg>
);
const MessageIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);
const MoonIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
  </svg>
);
const SunIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="4"/>
    <path d="M12 2v2M12 20v2m-7.07-14.07 1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2m-4.34 5.66-1.41 1.41M6.34 6.34 4.93 4.93"/>
  </svg>
);
const CopyIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <rect width="14" height="14" x="8" y="8" rx="2"/>
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
  </svg>
);

// Inner component — has access to useNotification
const ShowcaseInner: React.FC = () => {
  const { notify } = useNotification();
  const [theme, setTheme] = useState('light');
  const [sliderValue, setSliderValue] = useState(65);
  const [toggleChecked, setToggleChecked] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const [activeSection, setActiveSection] = useState('buttons');
  const [reboundTrigger, setReboundTrigger] = useState(false);
  const [physicsPreset, setPhysicsPreset] = useState<keyof typeof physicsPresets>('clay');
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    notify({ message: `Switched to ${next} mode`, type: 'info', duration: 2000 });
  };

  const changePreset = (preset: keyof typeof physicsPresets) => {
    setPhysicsPreset(preset);
    notify({
      message: `Physics preset: ${preset.charAt(0).toUpperCase() + preset.slice(1)}`,
      type: 'success',
      duration: 2000,
    });
  };

  const triggerRebound = () => {
    setReboundTrigger(true);
    setTimeout(() => setReboundTrigger(false), 600);
  };

  const copySnippet = useCallback((label: string, code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedSnippet(label);
      notify({
        message: `Copied ${label} snippet!`,
        type: 'success',
        duration: 2500,
        action: { label: 'Dismiss', onClick: () => {} },
      });
      setTimeout(() => setCopiedSnippet(null), 1500);
    }).catch(() => {
      notify({ message: 'Copy failed — check clipboard permissions', type: 'error' });
    });
  }, [notify]);

  const chartData = [
    { value: 45, label: 'Q1', colorway: 'lavender' as const },
    { value: 70, label: 'Q2', colorway: 'peach'    as const },
    { value: 55, label: 'Q3', colorway: 'mint'     as const },
    { value: 85, label: 'Q4', colorway: 'blue'     as const },
  ];

  const sections = [
    { id: 'buttons', label: 'Buttons'    },
    { id: 'cards',   label: 'Cards'      },
    { id: 'inputs',  label: 'Inputs'     },
    { id: 'toggles', label: 'Toggles'   },
    { id: 'charts',  label: 'Charts'    },
    { id: 'bento',   label: 'Bento Grid'},
    { id: 'physics', label: 'Physics'   },
  ];

  const snippets: Record<string, { label: string; code: string }> = {
    buttons: { label: 'ClayButton', code: `<ClayButton colorway="mint" size="md">\n  Click me\n</ClayButton>` },
    cards:   { label: 'ClayCard',   code: `<ClayCard colorway="blue">\n  Content here\n</ClayCard>` },
    inputs:  { label: 'ClayInput',  code: `<ClayInput\n  label="Search"\n  placeholder="Search anything..."\n  icon={<SearchIcon />}\n/>` },
    toggles: { label: 'ClayToggle', code: `<ClayToggle\n  colorway="mint"\n  label="Enable feature"\n  checked={checked}\n  onChange={setChecked}\n/>` },
    charts:  { label: 'ClayChartBar', code: `<ClayChartBar value={85} label="Q4" colorway="blue" />` },
    bento:   { label: 'BentoGrid',  code: `<BentoGrid columns={4} gap={24}>\n  <BentoItem colSpan={2} rowSpan={1}>\n    <ClayCard colorway="mint">Content</ClayCard>\n  </BentoItem>\n</BentoGrid>` },
    physics: { label: 'PhysicsProvider', code: `<PhysicsProvider config={physicsPresets.jelly}>\n  <ClayButton colorway="mint">Bouncy!</ClayButton>\n</PhysicsProvider>` },
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', transition: 'background 0.3s' }}>
      {/* Header */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'var(--bg-surface)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(0,0,0,0.05)',
      }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto', padding: '16px 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <FloatingContainer amplitude={4} frequency={0.8}>
              <div style={{
                width: 40, height: 40, borderRadius: 12,
                background: 'var(--mochi-mint)', boxShadow: 'var(--shadow-clay)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, color: 'white', fontSize: 18,
              }}>M</div>
            </FloatingContainer>
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>Mochi UI</h1>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Claymorphism Design System</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <select
              value={physicsPreset}
              onChange={(e) => changePreset(e.target.value as keyof typeof physicsPresets)}
              style={{
                padding: '8px 16px', borderRadius: 12, border: 'none',
                background: 'var(--bg-card)', boxShadow: 'var(--shadow-clay)',
                fontSize: 13, color: 'var(--text-primary)', cursor: 'pointer',
              }}
            >
              {Object.keys(physicsPresets).map(p => (
                <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
              ))}
            </select>
            <ClayButton size="sm" colorway="neutral" onClick={toggleTheme}>
              {theme === 'light' ? <MoonIcon /> : <SunIcon />}
            </ClayButton>
          </div>
        </div>

        <nav style={{
          maxWidth: 1200, margin: '0 auto', padding: '0 24px 12px',
          display: 'flex', gap: 8, overflowX: 'auto',
        }}>
          {sections.map(s => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              style={{
                padding: '8px 16px', borderRadius: 12, border: 'none',
                background: activeSection === s.id ? 'var(--mochi-mint)' : 'transparent',
                color: activeSection === s.id ? 'white' : 'var(--text-secondary)',
                fontSize: 14, fontWeight: 500, cursor: 'pointer',
                transition: 'all 0.2s', whiteSpace: 'nowrap',
              }}
            >{s.label}</button>
          ))}
        </nav>
      </header>

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: 32 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {snippets[activeSection] && (
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: 'var(--bg-card)', borderRadius: 12, padding: '10px 16px',
                marginBottom: 28, boxShadow: 'var(--shadow-clay)',
                fontFamily: 'monospace', fontSize: 13, color: 'var(--text-secondary)',
                gap: 12, overflow: 'hidden',
              }}>
                <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {snippets[activeSection].code.split('\n')[0]}
                </span>
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  onClick={() => copySnippet(snippets[activeSection].label, snippets[activeSection].code)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '6px 14px', borderRadius: 8, border: 'none',
                    background: copiedSnippet === snippets[activeSection].label
                      ? 'hsl(142deg 76% 45%)' : 'var(--mochi-mint)',
                    color: 'white', fontSize: 12, fontWeight: 600,
                    cursor: 'pointer', flexShrink: 0, transition: 'background 0.2s',
                  }}
                >
                  <CopyIcon />
                  {copiedSnippet === snippets[activeSection].label ? '✓ Copied!' : 'Copy'}
                </motion.button>
              </div>
            )}

            {/* BUTTONS */}
            {activeSection === 'buttons' && (
              <section>
                <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 24, color: 'var(--text-primary)' }}>
                  Buttons that demand to be pressed
                </h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 32, maxWidth: 600 }}>
                  Triple-shadow system with state-driven physics. Each button has compression,
                  overshoot, and settle phases synchronized with haptic feedback.
                </p>
                <div style={{ marginBottom: 48 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: 'var(--text-secondary)' }}>Colorways</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
                    {(['mint','blue','pink','lavender','peach','neutral'] as const).map(cw => (
                      <ClayButton key={cw} colorway={cw} onClick={triggerRebound}>
                        {cw.charAt(0).toUpperCase() + cw.slice(1)}
                      </ClayButton>
                    ))}
                  </div>
                </div>
                <div style={{ marginBottom: 48 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: 'var(--text-secondary)' }}>Sizes</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <ClayButton size="sm" colorway="mint">Small</ClayButton>
                    <ClayButton size="md" colorway="blue">Medium</ClayButton>
                    <ClayButton size="lg" colorway="pink">Large</ClayButton>
                  </div>
                </div>
                <div style={{ marginBottom: 48 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: 'var(--text-secondary)' }}>With Icons</h3>
                  <div style={{ display: 'flex', gap: 16 }}>
                    <ClayButton colorway="mint" icon={<SearchIcon />} iconPosition="leading">Search</ClayButton>
                    <ClayButton colorway="blue" icon={<BellIcon />} iconPosition="trailing">Notifications</ClayButton>
                  </div>
                </div>
                <div style={{ marginBottom: 48 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: 'var(--text-secondary)' }}>Clay Rebound Animation</h3>
                  <ClayRebound trigger={reboundTrigger}>
                    <ClayButton colorway="lavender" onClick={triggerRebound}>Trigger Rebound</ClayButton>
                  </ClayRebound>
                </div>
              </section>
            )}

            {/* CARDS */}
            {activeSection === 'cards' && (
              <section>
                <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 24, color: 'var(--text-primary)' }}>
                  Compartmentalizing with Clay Cards
                </h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 32, maxWidth: 600 }}>
                  4-layer shadow matrix creates floating depth. Cards tilt in 3D space on hover
                  and respond to mouse position with parallax.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
                  <ClayCard colorway="mint">
                    <div style={{ marginBottom: 12 }}><ClayBadge colorway="mint">Stats</ClayBadge></div>
                    <div style={{ fontSize: 48, fontWeight: 700, color: 'var(--mochi-mint)' }}>2,847</div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Total interactions this month</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                      <ChartIcon />
                      <span style={{ fontSize: 12, color: 'var(--mochi-mint)', fontWeight: 600 }}>+12.5% from last month</span>
                    </div>
                  </ClayCard>
                  <ClayCard colorway="blue">
                    <div style={{ marginBottom: 12 }}><ClayBadge colorway="blue">Revenue</ClayBadge></div>
                    <div style={{ fontSize: 48, fontWeight: 700, color: 'var(--mochi-sky-blue)' }}>$48.2K</div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Monthly recurring revenue</p>
                    <ClaySlider value={72} onChange={() => {}} colorway="blue" showTicks label="Goal progress" />
                  </ClayCard>
                  <ClayCard colorway="pink">
                    <div style={{ marginBottom: 12 }}><ClayBadge colorway="pink">Users</ClayBadge></div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <ClayAvatar size="lg" fallback="JD" status="online" />
                      <div>
                        <div style={{ fontWeight: 600 }}>John Doe</div>
                        <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Premium subscriber</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                      <ClayBadge colorway="mint" pulse>Active</ClayBadge>
                      <ClayBadge colorway="blue">Pro</ClayBadge>
                    </div>
                  </ClayCard>
                  <ClayCard colorway="lavender" variant="stats">
                    <h4 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)' }}>System Health</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {[{ label: 'API', value: 99.9 },{ label: 'Database', value: 98.2 },{ label: 'CDN', value: 99.5 }].map(item => (
                        <div key={item.label}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                            <span>{item.label}</span><span style={{ fontWeight: 600 }}>{item.value}%</span>
                          </div>
                          <div style={{ height: 6, borderRadius: 3, background: 'var(--bg-surface)', boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${item.value}%` }}
                              transition={{ duration: 1, delay: 0.2 }}
                              style={{ height: '100%', borderRadius: 3, background: item.value > 99 ? 'var(--mochi-mint)' : 'var(--mochi-peach)' }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </ClayCard>
                </div>
              </section>
            )}

            {/* INPUTS */}
            {activeSection === 'inputs' && (
              <section>
                <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 24, color: 'var(--text-primary)' }}>Sculpting Inputs</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 32, maxWidth: 600 }}>
                  Inset shadows create recessed channels. Focus states glow with spring-animated scale and color transitions.
                </p>
                <div style={{ maxWidth: 480, display: 'flex', flexDirection: 'column', gap: 24 }}>
                  <ClayInput placeholder="Search anything..." value={inputValue} onChange={setInputValue} icon={<SearchIcon />} label="Search" />
                  <ClayInput type="email" placeholder="your@email.com" label="Email" icon={<MessageIcon />} />
                  <ClayInput type="password" placeholder="Enter password" label="Password" error="Must be at least 8 characters" />
                  <ClayInput placeholder="Type a number..." type="number" label="Amount" />
                </div>
              </section>
            )}

            {/* TOGGLES */}
            {activeSection === 'toggles' && (
              <section>
                <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 24, color: 'var(--text-primary)' }}>State Changes: Visualizing the Press</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 32, maxWidth: 600 }}>
                  Three-state lifecycle with spring-animated knob movement. Granular haptic feedback on each state transition.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 400 }}>
                  {(['mint','blue','pink','lavender'] as const).map(cw => (
                    <ClayToggle key={cw} colorway={cw} label={`${cw.charAt(0).toUpperCase() + cw.slice(1)} Toggle`} checked={toggleChecked} onChange={setToggleChecked} />
                  ))}
                </div>
                <div style={{ marginTop: 48 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: 'var(--text-secondary)' }}>Size Variants</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                    <ClayToggle size="sm" label="Small" />
                    <ClayToggle size="md" label="Medium" />
                    <ClayToggle size="lg" label="Large" />
                  </div>
                </div>
              </section>
            )}

            {/* CHARTS */}
            {activeSection === 'charts' && (
              <section>
                <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 24, color: 'var(--text-primary)' }}>Sculpting Data</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 32, maxWidth: 600 }}>
                  Inflated 3D cylinders with volumetric shadows. Bars grow from bottom with spring physics and show tooltips on hover.
                </p>
                <ClayCard colorway="neutral" style={{ padding: 32 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: 300, gap: 24 }}>
                    {chartData.map((bar, i) => (
                      <ClayChartBar key={bar.label} value={bar.value} label={bar.label} colorway={bar.colorway} delay={i * 200} />
                    ))}
                  </div>
                </ClayCard>
                <div style={{ marginTop: 32 }}>
                  <ClaySlider value={sliderValue} onChange={setSliderValue} colorway="mint" showTicks label="Adjust data visualization" />
                </div>
              </section>
            )}

            {/* BENTO */}
            {activeSection === 'bento' && (
              <section>
                <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 24, color: 'var(--text-primary)' }}>Bento Grid Layout</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 32, maxWidth: 600 }}>
                  Japanese bento box inspired layout. No visible borders—depth defines separation.
                </p>
                <BentoGrid columns={4} gap={24}>
                  <BentoItem colSpan={1} rowSpan={2} delay={0}>
                    <ClayCard colorway="neutral" style={{ height: '100%' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                        <div><ClayBadge colorway="neutral">Overview</ClayBadge><div style={{ marginTop: 16 }}><ChartIcon /></div></div>
                        <div><div style={{ fontSize: 36, fontWeight: 700 }}>84%</div><div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Completion rate</div></div>
                      </div>
                    </ClayCard>
                  </BentoItem>
                  <BentoItem colSpan={2} rowSpan={1} delay={0.1}>
                    <ClayCard colorway="blue">
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div><div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Dashboard Header</div><div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Search and profile</div></div>
                        <ClayAvatar size="md" fallback="JD" status="online" />
                      </div>
                      <ClayInput placeholder="Search..." icon={<SearchIcon />} style={{ marginTop: 12 }} />
                    </ClayCard>
                  </BentoItem>
                  <BentoItem colSpan={1} rowSpan={1} delay={0.2}>
                    <ClayCard colorway="pink"><CalendarIcon /><div style={{ fontSize: 14, fontWeight: 600, marginTop: 8 }}>Upcoming</div><div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>3 events today</div></ClayCard>
                  </BentoItem>
                  <BentoItem colSpan={1} rowSpan={1} delay={0.3}>
                    <ClayCard colorway="mint"><MessageIcon /><div style={{ fontSize: 14, fontWeight: 600, marginTop: 8 }}>Messages</div><div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>12 unread</div></ClayCard>
                  </BentoItem>
                  <BentoItem colSpan={2} rowSpan={1} delay={0.4}>
                    <ClayCard colorway="lavender">
                      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                        <FloatingGroup staggerDelay={0.15} baseAmplitude={4}>
                          <ClayBadge colorway="mint">New</ClayBadge>
                          <ClayBadge colorway="blue">Beta</ClayBadge>
                          <ClayBadge colorway="pink">Hot</ClayBadge>
                        </FloatingGroup>
                      </div>
                    </ClayCard>
                  </BentoItem>
                </BentoGrid>
              </section>
            )}

            {/* PHYSICS */}
            {activeSection === 'physics' && (
              <section>
                <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 24, color: 'var(--text-primary)' }}>Dialing in the Perfect Clay Rebound</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 32, maxWidth: 600 }}>
                  At 0% bounce, a transition is entirely smooth and rigid. Higher bounce values inject the organic, elastic squish that defines Claymorphism.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24 }}>
                  {Object.entries(physicsPresets).map(([name, config]) => (
                    <ClayCard
                      key={name}
                      colorway={name === 'jelly' ? 'mint' : name === 'bouncy' ? 'pink' : name === 'snappy' ? 'blue' : name === 'luxurious' ? 'lavender' : 'neutral'}
                      onClick={() => changePreset(name as keyof typeof physicsPresets)}
                      style={{ border: physicsPreset === name ? '2px solid var(--mochi-mint)' : 'none' }}
                    >
                      <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{name.charAt(0).toUpperCase() + name.slice(1)}</div>
                      <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12 }}>Bounce: {config.bounce} | Duration: {config.duration}ms</div>
                      <ClayRebound trigger={physicsPreset === name}>
                        <div style={{ width: 60, height: 60, borderRadius: 16, background: 'var(--mochi-mint)', boxShadow: 'var(--shadow-clay)' }} />
                      </ClayRebound>
                    </ClayCard>
                  ))}
                </div>
                <div style={{ marginTop: 48 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: 'var(--text-secondary)' }}>Floating Animation Demo</h3>
                  <FloatingGroup staggerDelay={0.2} baseAmplitude={6}>
                    <ClayButton colorway="mint">Float 1</ClayButton>
                    <ClayButton colorway="blue">Float 2</ClayButton>
                    <ClayButton colorway="pink">Float 3</ClayButton>
                    <ClayButton colorway="lavender">Float 4</ClayButton>
                  </FloatingGroup>
                </div>
              </section>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer style={{ marginTop: 64, padding: '32px 24px', borderTop: '1px solid rgba(0,0,0,0.05)', textAlign: 'center', color: 'var(--text-secondary)', fontSize: 13 }}>
        <p>Mochi UI — Claymorphism Design System</p>
        <p style={{ marginTop: 4 }}>Built with Astro + Motion + Spring Physics</p>
      </footer>
    </div>
  );
};

const ShowcasePage: React.FC = () => (
  <ClayNotificationProvider>
    <ShowcaseInner />
  </ClayNotificationProvider>
);

export default ShowcasePage;
