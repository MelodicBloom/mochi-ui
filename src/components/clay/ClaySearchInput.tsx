import React from 'react';

export interface ClaySearchInputProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
}

/**
 * Search field in a thick raised clay ring (~10px outer bevel per ref
 * "Search invoices") around an inset well.
 */
export const ClaySearchInput: React.FC<ClaySearchInputProps> = ({ placeholder = 'Search', onSearch }) => (
  <form
    role="search"
    onSubmit={e => { e.preventDefault(); onSearch?.(String(new FormData(e.currentTarget).get('q') ?? '')); }}
    style={{
      display: 'flex', padding: 10, borderRadius: 999,
      background: 'linear-gradient(160deg, #F4F1EC, #E6E1DA)',
      boxShadow: '0 1px 2px rgba(90,80,120,0.08), 0 6px 14px rgba(90,80,120,0.10), 0 18px 36px rgba(90,80,120,0.08), inset 0 2px 3px rgba(255,255,255,0.85), inset 0 -3px 6px rgba(80,60,120,0.10)',
    }}
  >
    <label className="clay-search__well" style={{
      flex: 1, display: 'flex', alignItems: 'center', gap: 8, padding: '12px 18px', borderRadius: 999,
      background: 'var(--mochi-clay-white, #F6F3EF)',
      boxShadow: 'inset 4px 4px 8px rgba(120,110,140,0.18), inset -4px -4px 8px rgba(255,255,255,0.95)',
    }}>
      <span aria-hidden style={{ opacity: 0.55 }}>⌕</span>
      <input name="q" type="search" placeholder={placeholder} aria-label={placeholder}
        style={{ border: 0, background: 'none', outline: 0, flex: 1, font: '400 15px var(--font-ui, inherit)' }} />
    </label>
  </form>
);

export default ClaySearchInput;
