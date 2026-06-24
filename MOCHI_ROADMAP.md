# Mochi UI — Product Roadmap

> Last updated: June 2026
> The canonical build pathway from open-source demo to productized design system platform.

---

## Phase 0 — Foundation Integrity ✅ *In Progress*
**Goal:** Zero token violations in all clay primitives. Every pixel from a token.

### Milestone
All 13 clay components pass a grep scan — no hardcoded `hsl()`, no raw `px` radii outside the squircle system, no raw color strings.

### Deliverables
- [x] `tokens.css` — squircle radius family, numeric space scale, glow shadows, semantic surfaces, responsive clamp vars
- [x] `ClayButton` — tokenized colors, spacing, radius, ripple, 44px touch targets
- [x] `ClayCard` — tokenized colors + radius, removed hardcoded `hsl()` map
- [x] `ClayModal` — tokenized radius, padding, ARIA roles, 44px close button
- [x] `ClaySkeleton` — tokenized radius per variant, `var(--bg-inset)` shimmer
- [x] `ClayTooltip` — tokenized padding, font, radius, role="tooltip"
- [ ] `ClaySlider` — 44px thumb touch target, tokenized track + fill
- [ ] `ClayToggle` — 44px tap target minimum
- [ ] `ClayInput` — `outline` focus ring (not box-shadow only)
- [ ] `ClayBadge`, `ClayAvatar`, `ClayProgress`, `ClaySegmentedControl`, `ClayChartBar` — token pass
- [ ] GitHub Actions workflow: auto-runs on push to `scripts/` or `tokens.css`
- [ ] `MOCHI_ROADMAP.md` in repo ✓
- [ ] `UI_AUDIT_CHECKLIST.md` in repo ✓

---

## Phase 1 — Motion Layer *2–3 weeks*
**Goal:** Every interaction has a physics-justified response. The page feels like a living material.

### Milestone
Record a Loom of load-to-scroll. Every transition has a clear physical metaphor. Nothing is abrupt.

### Deliverables
- [ ] `useCountUp` hook — numeric stat animation on scroll-enter, ease-out 1200ms
- [ ] Gradient text keyframe loop — `background-position` shift on hero `Claymorphism` word
- [ ] Section blur-in entry — `filter: blur(8px)→0` + `y: 32→0` combined with stagger
- [ ] Feature grid stagger — `scale: 0.96→1` + `blur: 4→0` per card
- [ ] Scroll-linked parallax — AtmosphereCanvas background at 0.3× scroll speed
- [ ] Cursor orb — 32px glow follows pointer at 0.12 lerp, colorway-reactive on hover (desktop only)
- [ ] MochiBounce launch trail — ring buffer of 6–8 ghost squircles with 80ms fade
- [ ] `prefers-reduced-motion` — MochiLoader falls back to static wordmark

---

## Phase 2 — Component Expansion *3–4 weeks*
**Goal:** Complete the 30+ component count. Three new high-value additions.

### New components
- [ ] `ClayToast` / `ClayNotification` — spring-in from bottom-right (mobile) / top-right (desktop), stacked, auto-dismiss with progress bar
- [ ] `ClayCommandPalette` — `⌘K` triggered, fuzzy search, keyboard nav, categorized results
- [ ] `ClayDataTable` — sortable, paginated, spring-animated sort arrows, skeleton loading

### Existing upgrades
- [ ] `ClaySlider` — multi-thumb / range variant
- [ ] `ClayAvatar` — group overlap variant + `+N` overflow badge
- [ ] `ClayChartBar` — animated tooltip on hover using `ClayTooltip`

### Milestone
Public changelog page on site. First external contributor PR merged.

---

## Phase 3 — Productization *4–5 weeks*
**Goal:** Mochi becomes something people cite, install, and recommend — not just use.

### Deliverables
- [ ] Docs site (Astro + MDX) — Getting Started, Token Reference, Component API, Changelog
- [ ] Figma library — published to Figma Community, variables match token names
- [ ] `npm publish` — `@mochi-ui/react`, tree-shakeable ESM + CJS via tsup
- [ ] VS Code extension scaffold — token autocomplete in CSS/SCSS
- [ ] Landing page metrics bar — npm downloads, GitHub stars, Figma duplicates

### Milestone
First 100 npm weekly downloads. Featured in one design newsletter.

---

## Phase 4 — Enterprise & Scale *6–8 weeks*
**Goal:** Mochi can be adopted by teams building real products.

### Deliverables
- [ ] `createMochiTheme()` — generate custom token sheet from brand config
- [ ] Playwright component tests — keyboard nav, ARIA, reduced-motion coverage
- [ ] Performance audit — all bundle sizes documented, `ClayButton` < 3KB gzipped
- [ ] Server Components compatibility audit — `'use client'` boundaries documented
- [ ] `npx @mochi-ui/tokens export --format css|json|scss` CLI

### Milestone
One funded startup uses Mochi UI in production.

---

## Phase 5 — Monetization & Community *Ongoing*
**Goal:** Sustainable revenue + contributor ecosystem.

### Offerings
- Mochi Pro — $29/mo per seat (premium components, priority Figma updates, email support)
- Team license — $99/mo for ≤10 devs
- Agency license — $499/mo (white-label, unlimited client projects)
- Mochi Studio — browser-based visual token editor (long-term flagship product)

### Community
- Monthly "Clay drop" newsletter (new free component or effect)
- Discord `#show-and-tell` channel
- Open bounty program via OpenCollective ($25–$100 per merged `good-first-issue`)

---

## Architecture Invariants

These rules apply at all phases and are never overridden:

1. **Every pixel from a token.** No hardcoded colors, radii, or spacing in component files.
2. **44px minimum touch target.** All interactive elements on mobile.
3. **Reduced motion always degrades gracefully.** Static fallback exists for every animation.
4. **WCAG 2.1 AA by default.** Contrast, keyboard nav, focus rings, and ARIA ship with the component — not as an option.
5. **Token names are the API.** CSS variable names, TypeScript token keys, Figma variable names, and SCSS variable names are all derived from the same canonical `tokens.css` — no parallel naming systems.
