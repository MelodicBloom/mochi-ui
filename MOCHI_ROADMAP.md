# Mochi UI — Component Library Roadmap

> Last updated: 2026-06-24

---

## Phase 0 — Token Foundation ✅ COMPLETE

Every existing primitive receives the full token pass.

- [x] `tokens.css` expanded: squircle radius family, 8px-grid space scale, glow shadows, semantic typography, semantic surfaces, `--border-subtle/strong`, mono font stack, `--ease-out-expo`
- [x] `ClayButton` — token colorways, ripple, 44px min-height, `navigator.vibrate` safe
- [x] `ClayCard` — token colorways, `borderRadius: inherit` shine overlay
- [x] `ClayModal` — token radius/padding, `role=dialog`, `aria-modal`, `aria-labelledby`, 44px close button
- [x] `ClaySkeleton` — token radii, theme-aware shimmer via `--bg-inset`
- [x] `ClayTooltip` — token padding/font/radius, `role=tooltip`
- [x] `ClaySlider` — token gradients, 44px thumb, `role=slider` + full ARIA
- [x] `ClayToggle` — token colorways, `role=switch` + keyboard, 44px tap target
- [x] `ClayInput` — outline focus ring (never clipped), `useId()` label association, `aria-invalid`, password toggle with `aria-label`
- [x] `ClayBadge` — token colorways, dot prop, `role=button` + keyboard when onClick
- [x] `ClayAvatar` — token status/fallback bg, `onError` image fallback, `role=img`
- [x] `ClayProgress` — token gradient pairs, `role=progressbar` + ARIA, `scrollTrigger` prop
- [x] `ClaySegmentedControl` — token active bg, `role=radiogroup`/`role=radio`, arrow-key nav, `fullWidth` prop
- [x] `ClayChartBar` — token gradients, IntersectionObserver scroll trigger, hover tooltip, `role=img`
- [x] `src/components/clay/index.ts` barrel export (16 components)
- [x] `src/index.ts` package root barrel (13 primitives + 3 new + 3 motion + 3 hooks)
- [x] GitHub Actions workflow (`generate-components.yml`) — auto-regenerate on token change
- [x] `scripts/generate-tokens.js` — tokens.css → JSON / TS / SCSS / tokenMap
- [x] `scripts/generate-components.js` — idempotent component codegen

---

## Phase 1 — Motion Layer 🔄 IN PROGRESS

- [x] `useCountUp` — scroll-triggered numeric animation, ease-out-expo
- [x] `useReducedMotion` — central `prefers-reduced-motion` signal
- [x] `CursorOrb` — desktop-only spring-lag glow, `data-cursor-color` reactive
- [x] `SectionReveal` — blur + y-offset scroll fade-in
- [x] `StaggerGrid` — per-child stagger with scale+blur
- [ ] Add `data-cursor-color` attributes to hero CTA buttons, feature cards, testimonial cards in `EnhancedShowcasePage.tsx`
- [ ] Wire `useCountUp` to stats section (48.2K users, 2847 components, 99.1% satisfaction)
- [ ] Wire `SectionReveal` to every `<section>` in showcase page
- [ ] Wire `StaggerGrid` to features grid and team cards
- [ ] `MochiBounce` launch-trail particle component

---

## Phase 2 — New Components ✅ COMPLETE

- [x] `ClayToast` + `useToast` — notification stack, auto-dismiss progress bar
- [x] `ClayCommandPalette` — ⌘K, fuzzy search, category groups, full keyboard nav
- [x] `ClayDataTable` — sortable + paginated + skeleton-loading, spring sort arrows

---

## Phase 3 — Theme System

- [ ] `createMochiTheme(tokens)` — override any token at runtime
- [ ] `MochiThemeProvider` — Context-based theme injection
- [ ] Dark-mode class toggler with `localStorage` persistence
- [ ] Figma token export script (`tokens.json` → Figma Tokens plugin format)
- [ ] Contrast audit script — validate all colorway text against WCAG AA

---

## Phase 4 — Documentation Site

- [ ] Storybook with clay theme
- [ ] Per-component prop tables from TypeScript types
- [ ] Live playground (editable props, live preview)
- [ ] Copy-to-clipboard code examples
- [ ] Design token reference page

---

## Phase 5 — Package Release

- [ ] `package.json` as `@mochi-ui/react`
- [ ] ESM + CJS dual build via `tsup`
- [ ] Peer deps: `react@>=18`, `motion/react@>=11`
- [ ] Publish to npm
- [ ] GitHub Releases tied to semver tags

---

## Architecture Invariants

1. **Token-first** — no inline hardcoded color, radius, or spacing value survives a token pass. Everything resolves to a `var(--*)` token.
2. **44px touch targets** — every interactive element (button, thumb, toggle, close icon) has `minHeight` or `minWidth` of 44px.
3. **ARIA-complete** — every component ships with correct roles, labels, and keyboard event handlers by default, not as an afterthought.
4. **Reduced-motion aware** — all animation routes through `useReducedMotion()` or the CSS `prefers-reduced-motion` block in `tokens.css`.
5. **Idempotent codegen** — running `generate-components.js` twice produces bit-identical output.
