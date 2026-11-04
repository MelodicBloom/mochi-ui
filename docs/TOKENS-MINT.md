# Mint token naming (gap-fix 2026-11-04)

| Name | Value | Meaning |
|---|---|---|
| `--mochi-mint` | `#A3E635` | **Legacy name, lime value.** Kept unchanged for back-compat. Alias: `--mochi-lime`. |
| `--mochi-mint-green` | `#4ADE80` | Green family "mint" (CSS). `_tokens.scss` previously used this name for the lime value; now aligned to CSS. |
| `--mochi-mint-soft` | `#8FE0B8` | **New.** Reference-matched soft mint (styleguide toggle/tabs/segmented). Use for mint UI fills. |

## Dual DTCG sources
- `src/tokens/tokens.json` (camelCase, `mochi.color.*`) — feeds `src/styles/tokens.css`.
- `design-tokens/tokens.json` (kebab-case, `color.rainbow.*`) — Figma/Tokens Studio export.
Both now carry the soft mint (`mintSoft` / `mint-soft`). They are **not** auto-synced; edit both until a single source is chosen (out of scope for this pass).

Not changed: the value of `--mochi-mint` (would recolor gradients/focus rings site-wide).
