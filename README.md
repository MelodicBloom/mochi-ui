# Mochi UI 🍡

> A **Claymorphism Design System** built with React and Motion — featuring spring physics, tactile haptic feedback, and Figma-native compatibility.

[![npm version](https://img.shields.io/npm/v/@mochiui/react)](https://www.npmjs.com/package/@mochiui/react)
[![npm downloads](https://img.shields.io/npm/dm/@mochiui/react)](https://www.npmjs.com/package/@mochiui/react)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## Install

```bash
npm install @mochiui/react
```

## Quick Start

```tsx
import { ClayButton, ClayCard, PhysicsProvider, physicsPresets } from '@mochiui/react';
import '@mochiui/react/styles';

export default function App() {
  return (
    <PhysicsProvider config={physicsPresets.clay}>
      <ClayCard>
        <ClayButton color="mint" size="md">
          Hello Mochi
        </ClayButton>
      </ClayCard>
    </PhysicsProvider>
  );
}
```

## ✨ Philosophy

**If it looks like clay, animates like clay, it must feel like clay.**

Mochi UI implements the complete tactile web playbook:
- **Pastel Psychology** — Reduced cognitive load through curated tints
- **Shadow Matrix** — 4-layer depth system (Base → Lift → Volume → Reflection)
- **Spring Physics** — Bounce + Perceptual Duration parameters (no Mass/Stiffness/Damping)
- **Haptic Synchronization** — Device hardware feedback mapped to visual states
- **Bento Grids** — Japanese bento-inspired compartmentalization

## 🧱 Components

### Clay Primitives

| Component | Features | Physics |
|-----------|----------|---------|
| `ClayButton` | Triple-shadow, 6 colorways, 3 sizes | Compression → Overshoot → Settle |
| `ClayCard` | 4-layer shadow, 3D tilt on hover, shine effect | Floating parallax |
| `ClayToggle` | Spring knob, track recess, haptic tick | Elastic snap |
| `ClaySlider` | Tactile knob, granular feedback, fill animation | Drag + release |
| `ClayInput` | Inset recess, glow focus, validation | Scale pulse |
| `ClayChartBar` | 3D cylinder, volumetric shadow, tooltip | Grow from bottom |
| `ClayBadge` | Pulse animation, micro-float | Scale bounce |
| `ClayAvatar` | Status indicator, rotation on hover | Tilt + scale |
| `ClayTooltip` | Spring entrance, arrow pointer | Scale + fade |
| `ClayModal` | Backdrop blur, spring open/close | Scale overshoot |
| `ClaySkeleton` | Shimmer animation | Pulse |
| `ClayProgress` | Fill animation, milestone pops | Spring fill |
| `ClaySegmentedControl` | Sliding indicator, haptic selection | Slide spring |

### Animation Systems

| Export | Purpose |
|--------|---------|
| `PhysicsProvider` | Wrap your app to configure global spring physics |
| `usePhysics` | Hook to read current physics config |
| `physicsPresets` | 6 presets: `jelly`, `clay`, `firm`, `snappy`, `luxurious`, `bouncy` |
| `ClayRebound` | 3-phase animation wrapper (Compression → Overshoot → Settle) |
| `FloatingContainer` | Ambient breathing animation |
| `FloatingGroup` | Staggered floating elements |
| `ParallaxLayer` | Mouse-driven depth parallax |
| `triggerHaptic` | Programmatic haptic feedback |

### Layout

| Export | Purpose |
|--------|---------|
| `BentoGrid` | Responsive bento-style grid container |
| `BentoItem` | Individual bento cell with span control |
| `BentoLayouts` | Preset layout configurations |

## 🎯 Physics Presets

```tsx
import { physicsPresets, PhysicsProvider } from '@mochiui/react';

const presets = {
  jelly:      { bounce: 0.8, duration: 500 },  // Maximum elasticity
  clay:       { bounce: 0.4, duration: 300 },  // Standard (default)
  firm:       { bounce: 0.15, duration: 200 }, // Minimal bounce
  snappy:     { bounce: 0.2, duration: 150 },  // Quick response
  luxurious:  { bounce: 0.5, duration: 600 },  // Slow elegance
  bouncy:     { bounce: 0.9, duration: 400 },  // Playful
};

<PhysicsProvider config={physicsPresets.jelly}>
  <App />
</PhysicsProvider>
```

## 📱 Haptic Feedback

```tsx
import { triggerHaptic } from '@mochiui/react';

triggerHaptic({ enabled: true, intensity: 'soft' });   // Button press
triggerHaptic({ enabled: true, intensity: 'medium' }); // Toggle
triggerHaptic({ enabled: true, intensity: 'firm' });   // Deep press
```

## 📐 Shadow Matrix

```css
.clay-surface {
  background: hsl(120deg 35% 82%);
  box-shadow:
    0 8px 16px rgba(0,0,0,0.1),              /* Lift */
    inset -10px -10px 20px rgba(0,0,0,0.05), /* Volume */
    inset 10px 10px 20px rgba(255,255,255,0.8); /* Reflection */
}
```

## 🌗 Dark Mode

```tsx
document.documentElement.setAttribute('data-theme', 'dark');
```

| Mode | Base | Surface | Card |
|------|------|---------|------|
| Light | `#F5E6D3` | `#FFF8F0` | `#FFFFFF` |
| Dark | `#1E1E2E` | `#2D2D44` | `#252538` |

## 🚀 Docs Site (local dev)

```bash
git clone https://github.com/qt314wink/mochi-ui
npm install
npm run dev
```

## 📄 License

MIT © 2026 Mochi UI
