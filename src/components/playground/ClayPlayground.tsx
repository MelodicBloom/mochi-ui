import React, { useState, useCallback } from 'react';
import { motion, useSpring, useTransform } from 'motion/react';
import { ClayButton } from '../clay/ClayButton';
import { ClayCard } from '../clay/ClayCard';
import { ClaySlider } from '../clay/ClaySlider';
import { ClayBadge } from '../clay/ClayBadge';
import { ClaySegmentedControl } from '../clay/ClaySegmentedControl';
import { physicsPresets, type PhysicsPreset } from '../animations/SpringPhysics';
import { SpringGraph } from './SpringGraph';

type ColorwayKey = 'mint' | 'blue' | 'pink' | 'lavender' | 'peach' | 'neutral';

const COLORWAYS: ColorwayKey[] = ['mint', 'blue', 'pink', 'lavender', 'peach', 'neutral'];

const PRESET_SPRING: Record<string, { mass: number; tension: number; friction: number }> = {
  jelly:      { mass: 1,   tension: 120, friction: 8  },
  clay:       { mass: 1,   tension: 180, friction: 20 },
  firm:       { mass: 1,   tension: 300, friction: 30 },
  snappy:     { mass: 0.5, tension: 400, friction: 22 },
  luxurious:  { mass: 2,   tension: 100, friction: 28 },
  bouncy:     { mass: 0.8, tension: 200, friction: 10 },
};

export const ClayPlayground: React.FC = () => {
  const [radius, setRadius]     = useState(20);
  const [shadow, setShadow]     = useState(60);
  const [colorway, setColorway] = useState<ColorwayKey>('mint');
  const [preset, setPreset]     = useState<PhysicsPreset>('clay');
  const [pressed, setPressed]   = useState(false);

  const spring = PRESET_SPRING[preset] ?? PRESET_SPRING.clay;

  const springScale = useSpring(1, { stiffness: spring.tension, damping: spring.friction, mass: spring.mass });
  const springY     = useSpring(0, { stiffness: spring.tension, damping: spring.friction, mass: spring.mass });

  const handlePress = useCallback(() => {
    setPressed(true);
    springScale.set(0.88);
    springY.set(4);
    setTimeout(() => { springScale.set(1); springY.set(0); setPressed(false); }, 180);
  }, [springScale, springY]);

  const shadowSize  = useTransform(springScale, [0.88, 1], [shadow * 0.4, shadow * 0.12]);
  const shadowOpacity = useTransform(springScale, [0.88, 1], [0.18, 0.28]);

  const shadowStyle = `0 ${shadow * 0.06}px ${shadow * 0.18}px rgba(0,0,0,0.13), 0 ${shadow * 0.02}px ${shadow * 0.06}px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.7)`;

  const code = `<ClayButton
  colorway="${colorway}"
  style={{ borderRadius: ${radius} }}
  transition={{ type: 'spring',
    mass: ${spring.mass},
    stiffness: ${spring.tension},
    damping: ${spring.friction} }}
/>`;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 32 }}>
      {/* Controls */}
      <ClayCard colorway="neutral" interactive={false}>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 20, color: 'var(--text-primary)' }}>Visual</h3>
        <div style={{ marginBottom: 20 }}>
          <ClaySlider value={radius} onChange={setRadius} min={4} max={40} label="Border radius" colorway="mint" showTicks />
        </div>
        <div style={{ marginBottom: 24 }}>
          <ClaySlider value={shadow} onChange={setShadow} min={10} max={100} label="Shadow depth" colorway="blue" showTicks />
        </div>
        <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 10 }}>Colorway</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {COLORWAYS.map(cw => (
            <motion.button
              key={cw}
              onClick={() => setColorway(cw)}
              whileTap={{ scale: 0.9 }}
              style={{
                padding: '6px 14px', borderRadius: 10, border: colorway === cw ? '2px solid var(--mochi-mint)' : '2px solid transparent',
                background: 'var(--bg-surface)', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)',
              }}
            >{cw}</motion.button>
          ))}
        </div>

        <h3 style={{ fontSize: 15, fontWeight: 700, margin: '24px 0 16px', color: 'var(--text-primary)' }}>Physics preset</h3>
        <ClaySegmentedControl
          options={Object.keys(PRESET_SPRING).map(k => ({ value: k, label: k }))}
          value={preset}
          onChange={(v) => setPreset(v as PhysicsPreset)}
          colorway="mint"
        />
      </ClayCard>

      {/* Live preview */}
      <ClayCard colorway="neutral" interactive={false}>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 20, color: 'var(--text-primary)' }}>Preview</h3>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 180, background: 'var(--bg-surface)', borderRadius: 16, marginBottom: 20 }}>
          <motion.button
            onPointerDown={handlePress}
            style={{
              padding: '16px 40px',
              borderRadius: radius,
              border: 'none',
              cursor: 'pointer',
              fontSize: 16,
              fontWeight: 700,
              color: 'white',
              background: `var(--mochi-${colorway === 'neutral' ? 'sage' : colorway})`,
              boxShadow: shadowStyle,
              scale: springScale,
              y: springY,
            }}
          >
            Press me
          </motion.button>
        </div>
        <SpringGraph mass={spring.mass} tension={spring.tension} friction={spring.friction} />
      </ClayCard>

      {/* Generated code */}
      <ClayCard colorway="neutral" interactive={false}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>Code</h3>
          <ClayBadge colorway="mint">Copy</ClayBadge>
        </div>
        <pre style={{
          background: 'var(--bg-surface)', borderRadius: 12, padding: 16,
          fontSize: 12, lineHeight: 1.7, color: 'var(--text-primary)', overflowX: 'auto',
          fontFamily: 'ui-monospace, monospace', whiteSpace: 'pre-wrap',
        }}>{code}</pre>
        <ClayButton
          colorway="mint"
          size="sm"
          style={{ marginTop: 12 }}
          onClick={() => navigator.clipboard.writeText(code)}
        >Copy snippet</ClayButton>
      </ClayCard>
    </div>
  );
};

export default ClayPlayground;
