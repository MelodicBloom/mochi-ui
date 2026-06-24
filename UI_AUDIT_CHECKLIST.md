# Mochi UI — Screen-by-Screen Audit Checklist

Run this checklist at 375px (mobile), 768px (tablet), and 1280px (desktop) in both light and dark mode.
Each item is **pass / fail / n-a**. File a GitHub issue for each failure.

---

## Global
- [ ] All `borderRadius` values in component files resolve to `var(--radius-squircle-*)` — no raw `px`
- [ ] No `hsl()` raw color strings in component source — all use `var(--mochi-*)` or `var(--bg-*)` or `var(--text-*)`
- [ ] No raw `px` spacing in component source — all use `var(--space-*)`
- [ ] All interactive elements have `min-height: 44px; min-width: 44px`
- [ ] `prefers-reduced-motion` disables all spring/keyframe animations
- [ ] Dark mode: all `--border-subtle` tokens are visibly distinct from `--bg-card`
- [ ] Focus rings: all focusable elements show `outline: 2px solid var(--mochi-mint-vivid); outline-offset: 2px`

---

## Header
- [ ] Logo squircle: `border-radius: var(--radius-squircle-sm)` — not `12px`
- [ ] Active nav pill: gradient + `--shadow-glow-mint` applied — not color-only change
- [ ] 375px: nav scrolls horizontally without visible scrollbar (`scrollbar-width: none`)
- [ ] 375px: GitHub CTA is visible, not clipped (collapses to icon-only or wraps)
- [ ] Sticky header `backdrop-filter` has `-webkit-backdrop-filter` prefix
- [ ] Progress bar gradient uses `--mochi-mint-vivid` and `--mochi-lavender-vivid`

---

## Hero
- [ ] Display headline: minimum `2.75rem` at 375px (clamp floor)
- [ ] Gradient text: `-webkit-background-clip: text` AND `background-clip: text` both present
- [ ] Floating badge: no overflow at 375px
- [ ] CTA buttons: full-width stacked at 375px (`flex-wrap: wrap; width: 100%` on each button)
- [ ] FloatingContainer: amplitude ≤ 3 when `prefers-reduced-motion` is on
- [ ] Hero gradient text animates on 8s loop (background-position keyframes)

---

## About Section
- [ ] Two-column grid collapses to single column below 600px
- [ ] Icon boxes: `var(--radius-squircle-sm)` — not `12px`
- [ ] All list items: minimum 44px height on mobile

---

## Features Grid
- [ ] Six-card grid: `min-width: 250px` → single column at 375px
- [ ] Card heights equalize via `align-items: stretch`
- [ ] Feature icon boxes: dark-mode background uses colorway at reduced opacity (not full vivid)
- [ ] Feature cards: stagger animation with `scale: 0.96→1` + `blur: 4px→0` on scroll-enter

---

## Components Section — Dashboard Widgets
- [ ] Stat font size: `clamp(1.8rem, 3.5vw, 2.4rem)` — 375px floor applies
- [ ] `ClaySlider` thumb: minimum 44px × 44px touch target (`min-width`/`min-height`)
- [ ] `ClayToggle`: minimum 44px tap target
- [ ] Numeric stats animate from 0 on scroll-enter (`useCountUp` hook)

---

## Components Section — Form
- [ ] `ClayInput` focus ring: `outline` not `box-shadow` only
- [ ] Password eye icon: `aria-label` updates between "Show password" / "Hide password"
- [ ] Toggle row: wraps on 375px without overflow

---

## Components Section — Chart
- [ ] `ClayChartBar`: bars animate from 0 on scroll-enter (`IntersectionObserver`, `once: true`)
- [ ] Chart slider label is visible text — not just `aria-label`

---

## MochiBounce Game
- [ ] Canvas fills full container width at all viewports
- [ ] DPR scaling: `Math.min(devicePixelRatio, 2)` applied
- [ ] Drag: `setPointerCapture` keeps drag active outside canvas bounds on mobile
- [ ] `touchAction: none` on wrapper prevents scroll hijack during game
- [ ] HUD panels: no collision at 375px (score + shot panels don't overlap)
- [ ] Ball launch trail: 6–8 ghost squircles with 80ms fade

---

## Teams Section
- [ ] Checklist items: `line-height: 1.5` — no clip on long lines
- [ ] Check marks: `color: var(--mochi-mint-vivid)` renders in dark mode
- [ ] Section padding responsive: `clamp(48px, 10vw, 80px)`

---

## Get Started / Install
- [ ] `npm install` command on single line at all widths ≥ 320px
- [ ] Copy button: visible `focus-visible` ring
- [ ] Copy button: icon swaps to ✓ on copy with `AnimatePresence`
- [ ] CTA buttons: stack at 375px

---

## Footer
- [ ] Link color `var(--text-tertiary)`: 3:1 contrast against `var(--bg-base)` in both themes
- [ ] Copyright year: dynamic via `new Date().getFullYear()`

---

## Audio System
- [ ] All `audio.*` calls use optional chaining (`audio.pop?.()` etc.)
- [ ] `audio.enable()` / `audio.disable()` state persists to localStorage
- [ ] No audio calls outside user-gesture handlers (no auto-play on mount)
- [ ] iOS Safari: `AudioContext.resume()` called inside `enable()` on user gesture

---

## Accessibility Pass
- [ ] All images have `alt` attributes
- [ ] All icon-only buttons have `aria-label`
- [ ] Modal has `role="dialog"`, `aria-modal="true"`, `aria-labelledby`
- [ ] Tooltip has `role="tooltip"`
- [ ] Color is never the sole means of conveying information
- [ ] Tab order follows visual reading order on all viewports
