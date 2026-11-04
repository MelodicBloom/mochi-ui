import React from 'react';
import { useReducedMotion } from 'motion/react';

export interface ClayTabBarProps {
  tabs: string[];
  value: string;
  onChange: (value: string) => void;
  label: string;
}

/**
 * Underline tabs on a recessed clay track. The selected tab gets a partial
 * soft-mint fill segment on the track (ref styleguide), not a bare 4px line.
 */
export const ClayTabBar: React.FC<ClayTabBarProps> = ({ tabs, value, onChange, label }) => {
  const reduce = useReducedMotion();
  const t = reduce ? 'none' : 'background 250ms var(--ease-bounce, ease), color 250ms ease, box-shadow 250ms ease';
  return (
    <div role="tablist" aria-label={label} style={{ display: 'inline-flex', flexDirection: 'column', gap: 0 }}>
      <div style={{ display: 'flex', gap: 28 }}>
        {tabs.map(tab => {
          const on = tab === value;
          return (
            <button
              key={tab}
              role="tab"
              aria-selected={on}
              onClick={() => onChange(tab)}
              style={{
                border: 0, background: 'none', padding: '8px 2px 12px', cursor: 'pointer',
                font: '600 14px var(--font-ui, inherit)',
                color: on ? 'var(--text-primary, #333)' : 'var(--text-secondary, #888)',
                position: 'relative', transition: t,
              }}
            >
              {tab}
              <span aria-hidden style={{
                position: 'absolute', left: -6, right: -6, bottom: -4, height: 10, borderRadius: 999,
                background: on ? 'linear-gradient(180deg, #D6F7E6, var(--mochi-mint-soft, #8FE0B8))' : 'transparent',
                boxShadow: on ? '0 2px 6px color-mix(in srgb, var(--mochi-mint-soft, #8FE0B8) 55%, transparent), inset 0 1px 1px rgba(255,255,255,0.9)' : 'none',
                transition: t, zIndex: 1,
              }} />
            </button>
          );
        })}
      </div>
      {/* recessed track */}
      <div aria-hidden style={{
        height: 10, marginTop: -6, borderRadius: 999, background: 'var(--mochi-soft-taupe, #E7E3DE)',
        boxShadow: 'inset 2px 2px 4px rgba(120,110,140,0.18), inset -2px -2px 4px rgba(255,255,255,0.9)',
      }} />
    </div>
  );
};

export default ClayTabBar;
