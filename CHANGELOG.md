# Changelog

All notable changes to `@mochi-ui/react` are documented here.
This project adheres to [Semantic Versioning](https://semver.org/).

---

## [2.0.0] — 2026-07-06

### ⚠️ Breaking Changes

- Package renamed from `mochi-ui` to `@mochi-ui/react`
- Peer dependency on `tailwindcss >=3.0.0` now declared (was implicit)
- `ClayInput.onChange` signature changed from `(value: string) => void` to native `React.ChangeEventHandler<HTMLInputElement>` — use new `onValueChange` for the string convenience callback
- `ErrorBoundary` renamed to `ClayErrorBoundary` and exported from package root
- `ClayProgress` no longer accepts an `animated` prop — use `springConfig` to control animation feel
- `ClayToggle` is now strictly controlled: `checked` + `onChange` required; no `defaultChecked` uncontrolled mode

### ✨ New

- **Spring Physics Engine** — `SpringPhysics`, `MultiSpring` with 6 named presets; semi-implicit Euler integration
- **Physics sub-entry** — `@mochi-ui/react/physics` exports the engine without `'use client'`, safe for RSC and Node.js
- **13 Clay Components** — Button, Card, Toggle, Slider, Progress, Modal, Input, Badge, SegmentedControl, Tooltip, Avatar, AvatarStack, ErrorBoundary
- **ThemeProvider** — light/dark/system with localStorage persistence and `useTheme` hook
- **8 Spring Hooks** — `useSpring`, `useSprings`, `useSpringTransform`, `useScrollSpring`, `useMagnetic`, `useSquish`, `useStaggeredReveal`, `useReducedMotion`
- **Full token system** — complete `--mochi-*` CSS custom property surface including color scales, shadow system, spacing, typography, animation, and z-index
- **Dark mode** — all tokens have dark-theme overrides via `[data-theme="dark"]`

### 🐛 Bug Fixes

- `ClayCard` 3D tilt now works correctly (perspective moved to wrapper element)
- `ClayCard` `glowOnHover` prop implemented (was previously accepted but silently unused)
- `ClayToggle` spring syncs when external `checked` prop changes
- `ClayProgress` dual-animation conflict resolved (spring only)
- `ClayBadge` warning/error variants now use design tokens (previously hardcoded hex)
- `ClaySegmentedControl` items keyed on `value+index` to prevent DOM reuse on duplicate values; upgraded to `ResizeObserver` for indicator position
- `ClaySegmentedControl` options now support `disabled` per-item
- `ClayTooltip` `scale` moved from standalone CSS property into `transform` string; exit animation uses `onRest` gate
- `ClayModal` exit animation race condition fixed via `isMounted` state
- `ClayButton` conditional hook calls fixed (Rules of Hooks)
- `ClaySlider` `fillWidth` dep array fixed
- `ThemeProvider` visibility-hidden SSR flash removed
- `spring-physics` upgraded to semi-implicit Euler (energy-conserving)
- `tokens.css` completely rewritten — old file defined only legacy tokens that no component referenced; every component was rendering with no styles
- CI workflow now runs typecheck + lint + build on every push and PR

### 📦 Build

- `tsconfig.json` added (was missing, causing hard build failure)
- `tsup.config.ts` added with dual entry (main + physics), `'use client'` banner
- `package.json` `sideEffects` field added for CSS tree-shaking safety
- `scripts/build-css.js` replaces broken PostCSS glob invocation
- `@import './design-tokens.css'` in `clay.css` corrected to `./tokens.css`
