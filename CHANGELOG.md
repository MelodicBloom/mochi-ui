# Changelog

All notable changes to `@mochi-ui/react` are documented here.
Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

---

## [0.1.0] — 2026-06-24

### Added

#### Clay Primitives (Phase 0)
- `ClayButton` — token colorways, ripple, 44px touch target, `navigator.vibrate` safe
- `ClayCard` — 4-layer shadow matrix, 3D tilt on hover, bento/stats variants
- `ClayModal` — focus-trapped dialog, `role=dialog`, `aria-modal`, 44px close
- `ClaySkeleton` — theme-aware shimmer, token radii
- `ClayTooltip` — portal-rendered, `role=tooltip`, token spacing
- `ClaySlider` — 44px thumb, `role=slider`, full ARIA, token gradients
- `ClayToggle` — spring knob, `role=switch`, keyboard nav, 44px tap target
- `ClayInput` — outline focus ring, `useId()` label association, `aria-invalid`, password reveal
- `ClayBadge` — dot variant, token colorways, `role=button` when interactive
- `ClayAvatar` — status indicator, image fallback, `role=img`
- `ClayProgress` — scroll-triggered, `role=progressbar`, token gradient pairs
- `ClaySegmentedControl` — `role=radiogroup`, arrow-key nav, `fullWidth` prop
- `ClayChartBar` — IntersectionObserver entrance, hover tooltip, `role=img`

#### Phase 2 Components
- `ClayToast` + `useToast` — notification stack, auto-dismiss progress bar
- `ClayCommandPalette` — ⌘K overlay, fuzzy search, category groups, keyboard nav
- `ClayDataTable` — sortable, paginated, skeleton-loading, spring sort arrows

#### Motion Layer (Phase 1)
- `CursorOrb` — desktop-only spring-lag cursor glow, `data-cursor-color` reactive
- `SectionReveal` — blur + y-offset scroll fade-in
- `StaggerGrid` — per-child stagger with scale+blur
- `MochiBounce` — canvas particle system, mouse trail + click burst, reduced-motion aware
- `useCountUp` — scroll-triggered numeric animation, ease-out-expo
- `useReducedMotion` — central `prefers-reduced-motion` signal

#### Theme System (Phase 3)
- `MochiThemeProvider` — React context, `localStorage` persistence, `data-theme` on `<html>`
- `useMochiTheme` — hook for color mode + runtime token overrides
- `createMochiTheme(tokens)` — typed token override factory
- `DarkModeToggle` — accessible 44px button, `aria-pressed`, `aria-label`

#### Infrastructure
- Design token pipeline (`scripts/build-tokens.cjs`) → Figma export
- GitHub Actions: `tokenize.yml`, `deploy.yml`, `release.yml`
- `tsup` dual ESM + CJS build with TypeScript declarations
- GitHub Pages live at https://qt314wink.github.io/mochi-ui
