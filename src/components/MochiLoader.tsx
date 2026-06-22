/**
 * MochiLoader — puffy squircle that multiplies left-to-right, then fades
 * Three orbs: 1 full-size center, then 2 smaller clones branch out left→right
 * Pure CSS keyframes via style injection, no external deps
 */
import React, { useEffect, useState } from 'react';

const STYLE_ID = 'mochi-loader-styles';

const css = `
  @keyframes mochiPulse {
    0%, 100% { transform: scale(1);   opacity: 1;   filter: blur(0px); }
    50%       { transform: scale(1.12); opacity: 0.85; filter: blur(0.5px); }
  }
  @keyframes mochiSpawnLeft {
    0%   { transform: translateX(0)   scale(0.1); opacity: 0; }
    40%  { transform: translateX(-52px) scale(0.72); opacity: 1; }
    70%  { transform: translateX(-64px) scale(0.68); opacity: 1; }
    100% { transform: translateX(-60px) scale(0.65); opacity: 1; }
  }
  @keyframes mochiSpawnRight {
    0%   { transform: translateX(0)   scale(0.1); opacity: 0; }
    40%  { transform: translateX(52px) scale(0.72); opacity: 1; }
    70%  { transform: translateX(64px) scale(0.68); opacity: 1; }
    100% { transform: translateX(60px) scale(0.65); opacity: 1; }
  }
  @keyframes mochiThirdLeft {
    0%   { transform: translateX(-60px) scale(0.0); opacity: 0; }
    50%  { transform: translateX(-112px) scale(0.42); opacity: 1; }
    80%  { transform: translateX(-122px) scale(0.38); opacity: 1; }
    100% { transform: translateX(-118px) scale(0.36); opacity: 1; }
  }
  @keyframes mochiThirdRight {
    0%   { transform: translateX(60px) scale(0.0); opacity: 0; }
    50%  { transform: translateX(112px) scale(0.42); opacity: 1; }
    80%  { transform: translateX(122px) scale(0.38); opacity: 1; }
    100% { transform: translateX(118px) scale(0.36); opacity: 1; }
  }
  @keyframes mochiFadeScreen {
    0%   { opacity: 1; }
    80%  { opacity: 1; }
    100% { opacity: 0; }
  }
  @keyframes mochiWordmark {
    0%   { opacity: 0; transform: translateY(8px); }
    100% { opacity: 1; transform: translateY(0px); }
  }
  .mochi-loader-screen {
    position: fixed;
    inset: 0;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #FAF8F5;
    animation: mochiFadeScreen 0.5s ease-out 2.1s forwards;
    pointer-events: none;
  }
  [data-theme="dark"] .mochi-loader-screen {
    background: #16162A;
  }
  .mochi-loader-stage {
    position: relative;
    width: 280px;
    height: 96px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .mochi-orb {
    position: absolute;
    border-radius: 42% 58% 55% 45% / 48% 52% 48% 52%;
    will-change: transform, opacity;
  }
  .mochi-orb-main {
    width: 64px;
    height: 64px;
    background: linear-gradient(135deg, #3DD68C 0%, #22C55E 60%, #86EFAC 100%);
    box-shadow:
      0 12px 32px rgba(61,214,140,0.36),
      inset 6px 6px 14px rgba(255,255,255,0.55),
      inset -6px -6px 14px rgba(0,0,0,0.06);
    animation:
      mochiPulse 1.1s ease-in-out infinite;
    z-index: 3;
  }
  .mochi-orb-left {
    width: 64px;
    height: 64px;
    background: linear-gradient(135deg, #C084FC 0%, #A855F7 60%, #E9D5FF 100%);
    box-shadow:
      0 8px 24px rgba(192,132,252,0.30),
      inset 5px 5px 12px rgba(255,255,255,0.45),
      inset -5px -5px 12px rgba(0,0,0,0.05);
    animation: mochiSpawnLeft 0.55s cubic-bezier(0.34,1.56,0.64,1) 0.25s both;
    z-index: 2;
  }
  .mochi-orb-right {
    width: 64px;
    height: 64px;
    background: linear-gradient(135deg, #7DD3FC 0%, #38BDF8 60%, #BAE6FD 100%);
    box-shadow:
      0 8px 24px rgba(56,189,248,0.30),
      inset 5px 5px 12px rgba(255,255,255,0.45),
      inset -5px -5px 12px rgba(0,0,0,0.05);
    animation: mochiSpawnRight 0.55s cubic-bezier(0.34,1.56,0.64,1) 0.25s both;
    z-index: 2;
  }
  .mochi-orb-third-left {
    width: 64px;
    height: 64px;
    background: linear-gradient(135deg, #FDA4AF 0%, #FB7185 60%, #FECDD3 100%);
    box-shadow:
      0 6px 18px rgba(251,113,133,0.28),
      inset 4px 4px 10px rgba(255,255,255,0.40),
      inset -4px -4px 10px rgba(0,0,0,0.04);
    animation: mochiThirdLeft 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.62s both;
    z-index: 1;
  }
  .mochi-orb-third-right {
    width: 64px;
    height: 64px;
    background: linear-gradient(135deg, #FCD34D 0%, #FB923C 60%, #FDE68A 100%);
    box-shadow:
      0 6px 18px rgba(251,146,60,0.28),
      inset 4px 4px 10px rgba(255,255,255,0.40),
      inset -4px -4px 10px rgba(0,0,0,0.04);
    animation: mochiThirdRight 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.62s both;
    z-index: 1;
  }
  .mochi-wordmark {
    margin-top: 28px;
    font-size: 15px;
    font-weight: 700;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: #5A5A78;
    animation: mochiWordmark 0.4s ease-out 0.9s both;
  }
  [data-theme="dark"] .mochi-wordmark {
    color: #9090B0;
  }
`;

export const MochiLoader: React.FC<{ onDone?: () => void }> = ({ onDone }) => {
  const [gone, setGone] = useState(false);

  useEffect(() => {
    // Inject styles once
    if (!document.getElementById(STYLE_ID)) {
      const tag = document.createElement('style');
      tag.id = STYLE_ID;
      tag.textContent = css;
      document.head.appendChild(tag);
    }
    const t = setTimeout(() => {
      setGone(true);
      onDone?.();
    }, 2650);
    return () => clearTimeout(t);
  }, [onDone]);

  if (gone) return null;

  return (
    <div className="mochi-loader-screen" aria-hidden="true" aria-label="Loading Mochi UI">
      <div className="mochi-loader-stage">
        {/* Third-level clones — furthest out, appear last */}
        <div className="mochi-orb mochi-orb-third-left" />
        <div className="mochi-orb mochi-orb-third-right" />
        {/* Second-level clones */}
        <div className="mochi-orb mochi-orb-left" />
        <div className="mochi-orb mochi-orb-right" />
        {/* Primary orb */}
        <div className="mochi-orb mochi-orb-main" />
      </div>
      <p className="mochi-wordmark">Mochi UI</p>
    </div>
  );
};

export default MochiLoader;
