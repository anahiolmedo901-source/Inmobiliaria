import React, { createContext, useContext, useMemo, useState } from 'react';
import type { ThemeMode } from './colors';
import { getTheme, type AppTheme } from './theme';

export type AuthRole = 'public' | 'agent' | 'admin';

type ThemeContextValue = {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  theme: AppTheme;
  role: AuthRole;
  setRole: (role: AuthRole) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({
  children,
  initialMode = 'dark',
  initialRole = 'public',
}: {
  children: React.ReactNode;
  initialMode?: ThemeMode;
  initialRole?: AuthRole;
}) {
  const [mode, setMode] = useState<ThemeMode>(initialMode);
  const [role, setRole] = useState<AuthRole>(initialRole);

  const value = useMemo<ThemeContextValue>(() => {
    return {
      mode,
      setMode,
      toggleTheme: () => setMode((prev) => (prev === 'dark' ? 'light' : 'dark')),
      theme: getTheme(mode),
      role,
      setRole,
    };
  }, [mode, role]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useAppTheme debe usarse dentro de ThemeProvider');
  return ctx;
}
