# Mochi UI

**Claymorphism Design System & React Component Library with Spring Physics**

🌐 **Live site:** [mochi-ui-two.vercel.app](https://mochi-ui-two.vercel.app)

---

## What is Mochi UI?

Mochi UI is a production-ready claymorphic component library built on Framer Motion spring physics. Every interaction — button presses, card tilts, toggle flips, slider drags — obeys real physical laws: mass, damping, and spring constants.

## Quick Start

```bash
npm install @mochi-ui/react motion
```

```tsx
import { ClayButton, ClayCard, ThemeProvider } from '@mochi-ui/react';
import '@mochi-ui/react/styles';

export default function App() {
  return (
    <ThemeProvider defaultTheme="system">
      <ClayButton variant="primary" magnetic>
        Get Started
      </ClayButton>
    </ThemeProvider>
  );
}
```

## Components

| Component | Description |
|---|---|
| `ClayButton` | Button with magnetic cursor pull, squish, and haptic ripple |
| `ClayCard` | 3D tilt card with spring hover elevation |
| `ClayToggle` | Switch with spring-physics thumb |
| `ClaySlider` | Range slider with draggable spring thumb and tooltip |
| `ClayProgress` | Animated progress bar with optional stripes |
| `ClayModal` | Focus-trapped modal with spring open/close |
| `ClayInput` | Floating-label input with focus spring |
| `ClayBadge` | Status badge with scale-in animation |
| `ClaySegmentedControl` | Tab selector with sliding spring indicator |
| `ClayTooltip` | Smart-positioned tooltip with spring entrance |
| `ClayAvatar` | Avatar with status dot and stack layout |

## Spring Hooks

```tsx
import {
  useSpring,
  useMagnetic,
  useSquish,
  useSpringTransform,
  useStaggeredReveal,
  useReducedMotion,
} from '@mochi-ui/react';
```

## Theming

Mochi UI uses CSS custom properties for all design tokens. Override them in your own `:root` block:

```css
:root {
  --mochi-terra-500: hsl(18deg 72% 52%);
  --mochi-radius-xl: 20px;
}
```

Dark mode is driven by `data-theme="dark"` on `<html>`. The `ThemeProvider` handles this automatically with `localStorage` persistence and `prefers-color-scheme` system detection.

## Tech Stack

- **Animation:** [Framer Motion](https://motion.dev) (`motion/react`)
- **Styling:** Tailwind CSS + CSS Custom Properties
- **Framework:** React 18+ with full SSR support
- **Docs site:** [Astro](https://astro.build)

## License

MIT
