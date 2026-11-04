# Clay structure notes (documented, not changed — gap-fix 2026-11-04)

- **Dual case trees:** `src/components/Clay/*.astro` (Astro primitives) and `src/components/clay/*.tsx` (React primitives) coexist. On case-insensitive filesystems (macOS/Windows default) these collide; do not add same-named files across both. A rename is deferred — it touches every import.
- **Dual motion models:** React primitives use `motion/react` springs; `packages/` spring engine and Astro primitives use CSS/own engine. Not unified in this pass.
- **Glass:** `.clay-glass` is a CSS approximation (backdrop blur + saturation + rim + inner/outer shadow). No refraction, caustics, or GPU parity is claimed.
