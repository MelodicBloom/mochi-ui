/**
 * MOCHI UI — ThemeProvider v2.0
 *
 * Manages theme state (light/dark/system), persists to localStorage,
 * and applies data-theme + .dark class to the document root.
 *
 * SSR behaviour: renders children immediately (no visibility:hidden gate)
 * and relies on suppressHydrationWarning on <html> to suppress the
 * inevitable data-theme mismatch on first paint. A tiny blocking inline
 * script in <head> can optionally be used to set the attribute before
 * React hydrates to eliminate the flash entirely.
 */

'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

type Theme = 'light' | 'dark' | 'system';
type ResolvedTheme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = (): ThemeContextType => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};

export interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme = 'system',
  storageKey = 'mochi-theme',
  enableSystem = true,
  disableTransitionOnChange = false,
}) => {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(storageKey) as Theme | null;
    if (stored) setThemeState(stored);
    setMounted(true);
  }, [storageKey]);

  useEffect(() => {
    if (!mounted) return;
    const resolved: ResolvedTheme =
      theme === 'system' && enableSystem
        ? window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
        : (theme as ResolvedTheme);

    setResolvedTheme(resolved);
    const root = document.documentElement;
    if (disableTransitionOnChange) root.classList.add('disable-transitions');
    root.setAttribute('data-theme', resolved);
    resolved === 'dark' ? root.classList.add('dark') : root.classList.remove('dark');
    if (disableTransitionOnChange) requestAnimationFrame(() => root.classList.remove('disable-transitions'));
  }, [theme, enableSystem, mounted, disableTransitionOnChange]);

  useEffect(() => {
    if (!enableSystem || theme !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setResolvedTheme(e.matches ? 'dark' : 'light');
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [theme, enableSystem]);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    localStorage.setItem(storageKey, t);
  }, [storageKey]);

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === 'light' ? 'dark' : 'light');
  }, [resolvedTheme, setTheme]);

  // Render children immediately — no visibility:hidden gate.
  // Add suppressHydrationWarning to your root <html> element to silence
  // the data-theme SSR mismatch warning on first hydration.
  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
