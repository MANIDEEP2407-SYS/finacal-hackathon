'use client';

import {
  createContext, useContext, useState,
  useEffect, type ReactNode
} from 'react';

export type Mode = 'learning' | 'planning';

interface ModeContextValue {
  mode: Mode;
  setMode: (mode: Mode) => void;
  isLearning: boolean;
  isPlanning: boolean;
}

const ModeContext = createContext<ModeContextValue | null>(null);

export function ModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<Mode>('learning');

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('fincal-mode') as Mode;
      if (saved === 'learning' || saved === 'planning') {
        setModeState(saved);
      }
    } catch { /* SSR / no localStorage */ }
  }, []);

  const setMode = (newMode: Mode) => {
    setModeState(newMode);
    try { localStorage.setItem('fincal-mode', newMode); } catch { /* */ }
  };

  return (
    <ModeContext.Provider value={{
      mode,
      setMode,
      isLearning: mode === 'learning',
      isPlanning: mode === 'planning',
    }}>
      {children}
    </ModeContext.Provider>
  );
}

export function useMode() {
  const ctx = useContext(ModeContext);
  if (!ctx) throw new Error('useMode must be inside ModeProvider');
  return ctx;
}
