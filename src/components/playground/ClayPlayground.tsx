'use client';
import React, { useState, useCallback } from 'react';
import { ClayCard, ClaySlider } from '../index';
import { SPRING_PRESETS } from '../../hooks/spring-physics';
import type { SpringConfig } from '../../hooks/spring-physics';
import { useReducedMotion } from '../../hooks/spring-hooks';
import { SpringGraph } from './SpringGraph';

interface PlaygroundState {
  borderRadius: number;
  shadowDepth: number;
  surfaceColor: string;
  springPreset: keyof typeof SPRING_PRESETS;
  customMass: number;
  customTension: number;
  customFriction: number;
}

const SURFACE_COLORS = [
  { name: 'Clay', value: '#fdf8f3' },
  { name: 'Sage', value: '#f4f7f4' },
  { name: 'Sand', value: '#faf8f5' },
  { name: 'Slate', value: '#f6f7f9' },
];

export const ClayPlayground: React.FC = () => {
  const [state, setState] = useState<PlaygroundState>({
    borderRadius: 16,
    shadowDepth: 8,
    surfaceColor: '#fdf8f3',
    springPreset: 'snappy',
    customMass: 0.6,
    customTension: 500,
    customFriction: 28,
  });
  const [activeTab, setActiveTab] = useState<'visual' | 'physics' | 'code'>('visual');
  const [isPressed, setIsPressed] = useState(false);
  const [scale, setScale] = useState(1);
  const prefersReducedMotion = useReducedMotion();

  const update = useCallback(<K extends keyof PlaygroundState>(
    key: K, value: PlaygroundState[K]
  ) => setState(prev => ({ ...prev, [key]: value })), []);

  const handlePress = () => { setIsPressed(true); setScale(prefersReducedMotion ? 1 : 0.93); };
  const handleRelease = () => { setIsPressed(false); setScale(1); };

  const activeConfig: SpringConfig = {
    mass: state.customMass,
    tension: state.customTension,
    friction: state.customFriction,
  };

  const generatedCode = [
    `import { ClayButton } from '@mochi-ui/react';`,
    ``,
    `export default function Preview() {`,
    `  return (`,
    `    <ClayButton`,
    `      style={{`,
    `        borderRadius: '${state.borderRadius}px',`,
    `        boxShadow: \``,
    `          ${state.shadowDepth}px ${state.shadowDepth}px ${state.shadowDepth * 2}px rgba(0,0,0,0.08),`,
    `          -${state.shadowDepth}px -${state.shadowDepth}px ${state.shadowDepth * 2}px rgba(255,255,255,0.9),`,
    `          inset 2px 2px 4px rgba(255,255,255,0.7),`,
    `          inset -2px -2px 4px rgba(0,0,0,0.04)`,
    `        \`,`,
    `      }}`,
    `    >`,
    `      Squish Me`,
    `    </ClayButton>`,
    `  );`,
    `}`,
  ].join('\n');

  const boxShadow = [
    `${state.shadowDepth}px ${state.shadowDepth}px ${state.shadowDepth * 2}px rgba(0,0,0,0.08)`,
    `-${state.shadowDepth}px -${state.shadowDepth}px ${state.shadowDepth * 2}px rgba(255,255,255,0.9)`,
    `inset 2px 2px 4px rgba(255,255,255,0.7)`,
    `inset -2px -2px 4px rgba(0,0,0,0.04)`,
    `0 0 0 1px rgba(255,255,255,0.5)`,
  ].join(', ');

  const tabs: Array<'visual' | 'physics' | 'code'> = ['visual', 'physics', 'code'];

  return (
    <div style={{ width: '100%', maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 800, marginBottom: 12, color: 'var(--text-primary)' }}>
          Clay Kiln
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 16, maxWidth: 480, margin: '0 auto', lineHeight: 1.6 }}>
          Mold your components in real-time. Adjust physics, shadows, and surface
          properties — see the spring react instantly.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 32 }}>
        <ClayCard colorway="neutral">
          <div style={{
            display: 'flex', gap: 4, marginBottom: 24, padding: 4,
            borderRadius: 14,
            background: 'var(--bg-surface)',
            boxShadow: 'inset 2px 2px 5px rgba(0,0,0,0.06), inset -2px -2px 5px rgba(255,255,255,0.8)',
          }}>
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  flex: 1, padding: '8px 0',
                  borderRadius: 10, border: 'none', cursor: 'pointer',
                  fontSize: 13, fontWeight: 600, textTransform: 'capitalize',
                  background: activeTab === tab ? 'var(--bg-card)' : 'transparent',
                  color: activeTab === tab ? 'var(--text-primary)' : 'var(--text-secondary)',
                  boxShadow: activeTab === tab ? 'var(--shadow-clay)' : 'none',
                  transition: 'all 0.2s',
                }}
              >{tab}</button>
            ))}
          </div>

          {activeTab === 'visual' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>
                  <span>Border Radius</span><span style={{ fontFamily: 'monospace' }}>{state.borderRadius}px</span>
                </div>
                <ClaySlider value={state.borderRadius} min={0} max={32} onChange={v => update('borderRadius', v)} colorway="mint" />
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>
                  <span>Shadow Depth</span><span style={{ fontFamily: 'monospace' }}>{state.shadowDepth}px</span>
                </div>
                <ClaySlider value={state.shadowDepth} min={0} max={24} onChange={v => update('shadowDepth', v)} colorway="blue" />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 10 }}>Surface Color</div>
                <div style={{ display: 'flex', gap: 10 }}>
                  {SURFACE_COLORS.map(c => (
                    <button
                      key={c.name}
                      title={c.name}
                      onClick={() => update('surfaceColor', c.value)}
                      style={{
                        width: 44, height: 44, borderRadius: 12,
                        background: c.value, border: 'none', cursor: 'pointer',
                        boxShadow: state.surfaceColor === c.value
                          ? '0 0 0 3px var(--mochi-mint), var(--shadow-clay)'
                          : 'var(--shadow-clay)',
                        transform: state.surfaceColor === c.value ? 'scale(1.1)' : 'scale(1)',
                        transition: 'all 0.2s',
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'physics' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 10 }}>Preset</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                  {(Object.keys(SPRING_PRESETS) as Array<keyof typeof SPRING_PRESETS>).map(p => (
                    <button
                      key={p}
                      onClick={() => {
                        const preset = SPRING_PRESETS[p];
                        setState(prev => ({
                          ...prev,
                          springPreset: p,
                          customMass: preset.mass,
                          customTension: preset.stiffness,
                          customFriction: preset.damping,
                        }));
                      }}
                      style={{
                        padding: '8px 4px', borderRadius: 10, border: 'none', cursor: 'pointer',
                        fontSize: 12, fontWeight: 600, textTransform: 'capitalize',
                        background: state.springPreset === p ? 'var(--mochi-mint)' : 'var(--bg-surface)',
                        color: state.springPreset === p ? 'white' : 'var(--text-secondary)',
                        boxShadow: 'var(--shadow-clay)', transition: 'all 0.2s',
                      }}
                    >{p}</button>
                  ))}
                </div>
              </div>
              {[['Mass', 'customMass', 0.1, 5] as const,
                ['Tension', 'customTension', 50, 700] as const,
                ['Friction', 'customFriction', 5, 60] as const,
              ].map(([label, key, min, max]) => (
                <div key={key}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>
                    <span>{label}</span><span style={{ fontFamily: 'monospace' }}>{Number(state[key]).toFixed(key === 'customMass' ? 1 : 0)}</span>
                  </div>
                  <ClaySlider value={state[key] as number} min={min} max={max} onChange={v => update(key, v as any)} colorway="lavender" />
                </div>
              ))}
              <div style={{ borderRadius: 12, overflow: 'hidden', padding: 12, background: 'var(--bg-surface)', boxShadow: 'inset 2px 2px 5px rgba(0,0,0,0.06)' }}>
                <SpringGraph config={activeConfig} />
              </div>
            </div>
          )}

          {activeTab === 'code' && (
            <div>
              <pre style={{
                padding: 16, borderRadius: 12, overflow: 'auto',
                background: '#1a1a2e', color: '#e2e8f0',
                fontSize: 12, fontFamily: 'monospace', lineHeight: 1.6,
                marginBottom: 0,
              }}><code>{generatedCode}</code></pre>
              <button
                onClick={() => navigator.clipboard.writeText(generatedCode)}
                style={{
                  width: '100%', padding: '10px', marginTop: 8,
                  borderRadius: 10, border: 'none', cursor: 'pointer',
                  background: 'var(--bg-surface)', color: 'var(--text-secondary)',
                  fontSize: 13, fontWeight: 600, boxShadow: 'var(--shadow-clay)',
                }}
              >Copy to Clipboard</button>
            </div>
          )}
        </ClayCard>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <ClayCard colorway="neutral" style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-secondary)', marginBottom: 16 }}>Live Preview</div>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              minHeight: 260, borderRadius: 12,
              background: state.surfaceColor,
              boxShadow: 'inset 2px 2px 8px rgba(0,0,0,0.04)',
              marginBottom: 20,
            }}>
              <button
                onPointerDown={handlePress}
                onPointerUp={handleRelease}
                onPointerLeave={handleRelease}
                style={{
                  padding: '18px 40px',
                  fontSize: 18, fontWeight: 700, cursor: 'pointer',
                  border: 'none',
                  borderRadius: state.borderRadius,
                  background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
                  color: '#333',
                  boxShadow: isPressed
                    ? `inset ${state.shadowDepth / 2}px ${state.shadowDepth / 2}px ${state.shadowDepth}px rgba(0,0,0,0.12), inset -${state.shadowDepth / 2}px -${state.shadowDepth / 2}px ${state.shadowDepth}px rgba(255,255,255,0.7)`
                    : boxShadow,
                  transform: `scale(${scale})`,
                  transition: prefersReducedMotion ? 'none' : `transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease`,
                  userSelect: 'none',
                }}
              >
                {isPressed ? 'Pressed!' : 'Squish Me'}
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {[['Mass', `${state.customMass.toFixed(1)}kg`], ['Tension', `${state.customTension}`], ['Friction', `${state.customFriction}`]].map(([label, val]) => (
                <div key={label} style={{
                  textAlign: 'center', padding: 12, borderRadius: 10,
                  background: 'var(--bg-surface)',
                  boxShadow: 'inset 2px 2px 5px rgba(0,0,0,0.05), inset -2px -2px 5px rgba(255,255,255,0.8)',
                }}>
                  <div style={{ fontSize: 15, fontWeight: 700, fontFamily: 'monospace' }}>{val}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
                </div>
              ))}
            </div>
          </ClayCard>
        </div>
      </div>
    </div>
  );
};

export default ClayPlayground;
