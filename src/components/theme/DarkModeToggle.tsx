import React from 'react';
import { useMochiTheme } from './MochiThemeProvider';

interface DarkModeToggleProps {
  className?: string;
}

export function DarkModeToggle({ className = '' }: DarkModeToggleProps) {
  const { resolvedMode, setColorMode } = useMochiTheme();
  const isDark = resolvedMode === 'dark';

  return (
    <button
      onClick={() => setColorMode(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={isDark}
      className={className}
      style={{
        minWidth: 44,
        minHeight: 44,
        borderRadius: 'var(--radius-full)',
        border: '1.5px solid var(--border-subtle)',
        background: 'var(--bg-surface)',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 20,
        transition: 'transform 200ms var(--ease-out-expo)',
      }}
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  );
}

export default DarkModeToggle;
