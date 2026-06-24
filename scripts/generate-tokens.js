#!/usr/bin/env node
/**
 * generate-tokens.js
 * Reads src/styles/tokens.css, parses all CSS custom property declarations,
 * and emits:
 *   src/styles/tokens.json          — W3C-style token object
 *   src/styles/tokens.d.ts          — TypeScript literal union of token names
 *   src/styles/tokens.scss          — SCSS variable mirror
 *   src/generated/tokenMap.ts       — importable JS object for component use
 */

const fs = require('fs');
const path = require('path');

const CSS_SRC  = path.resolve(__dirname, '../src/styles/tokens.css');
const OUT_DIR  = path.resolve(__dirname, '../src/styles');
const GEN_DIR  = path.resolve(__dirname, '../src/generated');

if (!fs.existsSync(GEN_DIR)) fs.mkdirSync(GEN_DIR, { recursive: true });

const css = fs.readFileSync(CSS_SRC, 'utf8');

// Parse every --token: value; declaration (multiline values included)
const tokenRe = /--([-\w]+)\s*:\s*([^;]+);/g;
const tokens = {};
let m;
while ((m = tokenRe.exec(css)) !== null) {
  const name  = m[1].trim();
  const value = m[2].replace(/\s+/g, ' ').trim();
  tokens[name] = value;
}

const names = Object.keys(tokens);
console.log(`[generate-tokens] Parsed ${names.length} tokens from tokens.css`);

// ── tokens.json ──────────────────────────────────────────────────────────────
const json = {};
names.forEach(n => { json[n] = { $value: tokens[n], $type: 'css-custom-property' }; });
fs.writeFileSync(path.join(OUT_DIR, 'tokens.json'), JSON.stringify(json, null, 2));
console.log('[generate-tokens] Wrote tokens.json');

// ── tokens.d.ts ──────────────────────────────────────────────────────────────
const dts = [
  '// Auto-generated — do not edit by hand',
  `export type MochiToken = ${names.map(n => `'--${n}'`).join('\n  | ')};`,
  '',
  'export declare const tokens: Record<MochiToken, string>;',
  '',
].join('\n');
fs.writeFileSync(path.join(OUT_DIR, 'tokens.d.ts'), dts);
console.log('[generate-tokens] Wrote tokens.d.ts');

// ── tokens.scss ──────────────────────────────────────────────────────────────
const scss = [
  '// Auto-generated — do not edit by hand',
  ...names.map(n => `$${n.replace(/-/g, '_')}: var(--${n});`),
  '',
].join('\n');
fs.writeFileSync(path.join(OUT_DIR, 'tokens.scss'), scss);
console.log('[generate-tokens] Wrote tokens.scss');

// ── src/generated/tokenMap.ts ────────────────────────────────────────────────
const tsMap = [
  '// Auto-generated — do not edit by hand',
  'export const tokenMap = {',
  ...names.map(n => `  '${n}': 'var(--${n})',`),
  '} as const;',
  '',
  'export type TokenKey = keyof typeof tokenMap;',
  '',
].join('\n');
fs.writeFileSync(path.join(GEN_DIR, 'tokenMap.ts'), tsMap);
console.log('[generate-tokens] Wrote src/generated/tokenMap.ts');

console.log('[generate-tokens] Done.');
