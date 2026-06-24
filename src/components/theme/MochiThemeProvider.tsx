import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

export type ColorMode = 'light' | 'dark' | 'system';

export interface MochiTokenOverrides {
  [token: string]: string;
}

export interface MochiTheme {
  colorMode: ColorMode;
  resolvedMode: 'light' | 'dark';
  tokens: MochiTokenOverrides;
  setColorMode: (mode: ColorMode) => void;
  setToken: (token: string, value: string) => void;
  resetTokens: () => void;
}

const ThemeContext = createContext<MochiTheme | null>(null);

export function useMochiTheme(): MochiTheme {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useMochiTheme must be used inside MochiThemeProvider');
  return ctx;
}

interface MochiThemeProviderProps {
  children: React.ReactNode;
  defaultMode?: ColorMode;
  tokens?: MochiTokenOverrides;
}

export function MochiThemeProvider({
  children,
  defaultMode = 'system',
  tokens: initialTokens = {},
}: MochiThemeProviderProps) {
  const [colorMode, setColorModeState] = useState<ColorMode>(() => {
    if (typeof window === 'undefined') return defaultMode;
    return (localStorage.getItem('mochi-color-mode') as ColorMode) || defaultMode;
  });

  const [tokens, setTokens] = useState<MochiTokenOverrides>(initialTokens);

  const systemDark =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
      : false;

  const resolvedMode: 'light' | 'dark' =
    colorMode === 'system' ? (systemDark ? 'dark' : 'light') : colorMode;

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', resolvedMode);
    root.classList.toggle('dark', resolvedMode === 'dark');
  }, [resolvedMode]);

  useEffect(() => {
    const root = document.documentElement;
    for (const [token, value] of Object.entries(tokens)) {
      root.style.setProperty(token.startsWith('--') ? token : `--${token}`, value);
    }
  }, [tokens]);

  const setColorMode = useCallback((mode: ColorMode) => {
    setColorModeState(mode);
    localStorage.setItem('mochi-color-mode', mode);
  }, []);

  const setToken = useCallback((token: string, value: string) => {
    setTokens(prev => ({ ...prev, [token]: value }));
  }, []);

  const resetTokens = useCallback(() => setTokens(initialTokens), [initialTokens]);

  return (
    <ThemeContext.Provider
      value={{ colorMode, resolvedMode, tokens, setColorMode, setToken, resetTokens }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function createMochiTheme(overrides: MochiTokenOverrides): MochiTokenOverrides {
  return overrides;
}

export default MochiThemeProvider;
