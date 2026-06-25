/**
 * ClayIcons — pre-styled SVG icons using the Mochi UI clay pill aesthetic.
 * Each icon is a rounded-rect background + white symbol at the given size.
 * Usage: <ClayIcon name="search" size={48} />
 */
import React from 'react';

export type ClayIconName =
  | 'search' | 'bell' | 'chart' | 'calendar'
  | 'message' | 'moon' | 'sun' | 'copy';

const COLORWAYS: Record<ClayIconName, { bg: string; glow: string }> = {
  search:   { bg: '#34d399', glow: 'rgba(52,211,153,0.35)'  },
  bell:     { bg: '#3b82f6', glow: 'rgba(59,130,246,0.35)'  },
  chart:    { bg: '#8b5cf6', glow: 'rgba(139,92,246,0.35)'  },
  calendar: { bg: '#ec4899', glow: 'rgba(236,72,153,0.35)'  },
  message:  { bg: '#f97316', glow: 'rgba(249,115,22,0.35)'  },
  moon:     { bg: '#6366f1', glow: 'rgba(99,102,241,0.35)'  },
  sun:      { bg: '#f59e0b', glow: 'rgba(245,158,11,0.40)'  },
  copy:     { bg: '#10b981', glow: 'rgba(16,185,129,0.35)'  },
};

const Glyphs: Record<ClayIconName, React.FC<{ size: number }>> = {
  search: ({ size }) => {
    const s = size * 0.5;
    const c = size / 2;
    const r = s * 0.38;
    return (
      <>
        <circle cx={c - s * 0.06} cy={c - s * 0.06} r={r} fill="none" stroke="white" strokeWidth={size * 0.07} strokeLinecap="round" />
        <line x1={c + r * 0.55} y1={c + r * 0.55} x2={c + r * 0.55 + size * 0.10} y2={c + r * 0.55 + size * 0.10} stroke="white" strokeWidth={size * 0.07} strokeLinecap="round" />
      </>
    );
  },
  bell: ({ size }) => {
    const c = size / 2;
    const w = size * 0.42;
    return (
      <>
        <path
          d={`M${c} ${c - size*0.28} C${c-w*0.5} ${c-size*0.28} ${c-w*0.5} ${c-size*0.04} ${c-w*0.5} ${c+size*0.06} C${c-w*0.5} ${c+size*0.20} ${c-w*0.62} ${c+size*0.26} ${c-w*0.62} ${c+size*0.26} L${c+w*0.62} ${c+size*0.26} C${c+w*0.62} ${c+size*0.26} ${c+w*0.5} ${c+size*0.20} ${c+w*0.5} ${c+size*0.06} C${c+w*0.5} ${c-size*0.04} ${c+w*0.5} ${c-size*0.28} ${c} ${c-size*0.28} Z`}
          fill="white"
        />
        <ellipse cx={c} cy={c + size * 0.30} rx={size * 0.08} ry={size * 0.05} fill="white" />
      </>
    );
  },
  chart: ({ size }) => {
    const b = size * 0.78;
    const left = size * 0.20;
    return (
      <>
        <rect x={left}            y={size*0.54} width={size*0.16} height={size*0.26} rx={size*0.03} fill="white" opacity={0.7}/>
        <rect x={left+size*0.22}  y={size*0.43} width={size*0.16} height={size*0.37} rx={size*0.03} fill="white" opacity={0.85}/>
        <rect x={left+size*0.44}  y={size*0.30} width={size*0.16} height={size*0.50} rx={size*0.03} fill="white" />
        <line x1={left-size*0.02} y1={size*0.76} x2={size*0.82} y2={size*0.76} stroke="white" strokeWidth={size*0.04} strokeLinecap="round" opacity={0.5}/>
      </>
    );
  },
  calendar: ({ size }) => {
    const c = size / 2;
    return (
      <>
        <rect x={size*0.22} y={size*0.30} width={size*0.56} height={size*0.44} rx={size*0.06} fill="white" opacity={0.9}/>
        <rect x={size*0.22} y={size*0.30} width={size*0.56} height={size*0.16} rx={size*0.06} fill="white"/>
        <line x1={size*0.36} y1={size*0.22} x2={size*0.36} y2={size*0.34} stroke="white" strokeWidth={size*0.06} strokeLinecap="round"/>
        <line x1={size*0.64} y1={size*0.22} x2={size*0.64} y2={size*0.34} stroke="white" strokeWidth={size*0.06} strokeLinecap="round"/>
      </>
    );
  },
  message: ({ size }) => {
    const c = size / 2;
    return (
      <path
        d={`M${size*0.24} ${size*0.28} C${size*0.18} ${size*0.28} ${size*0.14} ${size*0.32} ${size*0.14} ${size*0.38} L${size*0.14} ${size*0.60} C${size*0.14} ${size*0.66} ${size*0.18} ${size*0.70} ${size*0.24} ${size*0.70} L${size*0.40} ${size*0.70} L${size*0.35} ${size*0.80} L${size*0.35} ${size*0.70} L${size*0.76} ${size*0.70} C${size*0.82} ${size*0.70} ${size*0.86} ${size*0.66} ${size*0.86} ${size*0.60} L${size*0.86} ${size*0.38} C${size*0.86} ${size*0.32} ${size*0.82} ${size*0.28} ${size*0.76} ${size*0.28} Z`}
        fill="white" opacity={0.9}
      />
    );
  },
  moon: ({ size }) => {
    const c = size / 2;
    return (
      <path
        d={`M${c} ${size*0.20} C${c} ${size*0.20} ${c-size*0.22} ${size*0.27} ${c-size*0.22} ${c} C${c-size*0.22} ${size*0.73} ${c} ${size*0.80} ${c} ${size*0.80} C${c-size*0.32} ${size*0.80} ${size*0.18} ${size*0.68} ${size*0.18} ${c} C${size*0.18} ${size*0.32} ${c-size*0.32} ${size*0.20} ${c} ${size*0.20} Z`}
        fill="white"
      />
    );
  },
  sun: ({ size }) => {
    const c = size / 2;
    const r = size * 0.18;
    const r2 = size * 0.08;
    const lines = Array.from({ length: 8 }, (_, i) => {
      const angle = (i * Math.PI * 2) / 8;
      const x1 = c + Math.cos(angle) * (r + size * 0.06);
      const y1 = c + Math.sin(angle) * (r + size * 0.06);
      const x2 = c + Math.cos(angle) * (r + size * 0.16);
      const y2 = c + Math.sin(angle) * (r + size * 0.16);
      return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="white" strokeWidth={size * 0.06} strokeLinecap="round" />;
    });
    return <>{lines}<circle cx={c} cy={c} r={r} fill="white" /></>;
  },
  copy: ({ size }) => (
    <>
      <rect x={size*0.26} y={size*0.32} width={size*0.38} height={size*0.44} rx={size*0.06} fill="white" opacity={0.6}/>
      <rect x={size*0.36} y={size*0.24} width={size*0.38} height={size*0.44} rx={size*0.06} fill="white" opacity={0.95}/>
      <line x1={size*0.46} y1={size*0.38} x2={size*0.64} y2={size*0.38} stroke="#10b981" strokeWidth={size*0.04} strokeLinecap="round" opacity={0.5}/>
      <line x1={size*0.46} y1={size*0.46} x2={size*0.64} y2={size*0.46} stroke="#10b981" strokeWidth={size*0.04} strokeLinecap="round" opacity={0.5}/>
      <line x1={size*0.46} y1={size*0.54} x2={size*0.58} y2={size*0.54} stroke="#10b981" strokeWidth={size*0.04} strokeLinecap="round" opacity={0.5}/>
    </>
  ),
};

export interface ClayIconProps {
  name: ClayIconName;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const ClayIcon: React.FC<ClayIconProps> = ({ name, size = 48, className, style }) => {
  const { bg, glow } = COLORWAYS[name];
  const Glyph = Glyphs[name];
  const radius = size * 0.25;
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      className={className}
      style={{
        filter: `drop-shadow(0 ${size*0.08}px ${size*0.18}px ${glow})`,
        flexShrink: 0,
        ...style,
      }}
    >
      {/* Background pill */}
      <defs>
        <linearGradient id={`grad-${name}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={bg} stopOpacity={0.85} />
          <stop offset="100%" stopColor={bg} />
        </linearGradient>
      </defs>
      <rect width={size} height={size} rx={radius} fill={`url(#grad-${name})`} />
      <rect width={size} height={size} rx={radius} fill="rgba(255,255,255,0.18)" />
      {/* Inner top highlight */}
      <rect x={size*0.08} y={size*0.05} width={size*0.84} height={size*0.18} rx={size*0.12} fill="rgba(255,255,255,0.28)" />
      {/* Glyph */}
      <Glyph size={size} />
    </svg>
  );
};

/** Convenience: render all 8 icons in a row */
export const ClayIconRow: React.FC<{ size?: number; gap?: number }> = ({ size = 48, gap = 12 }) => (
  <div style={{ display: 'flex', gap, flexWrap: 'wrap', alignItems: 'center' }}>
    {(['search','bell','chart','calendar','message','moon','sun','copy'] as ClayIconName[]).map(name => (
      <ClayIcon key={name} name={name} size={size} />
    ))}
  </div>
);

export default ClayIcon;
