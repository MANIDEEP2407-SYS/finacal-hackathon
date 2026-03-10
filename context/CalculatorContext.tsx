'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export interface CalculatorState {
  presentCost: number;
  years: number;
  inflationRate: number;
  annualReturn: number;
  expenseRatio: number;
  stepUpRate: number;
  goalLabel: string;
  // Computed results (raw numbers for bot variable injection)
  inflatedGoalValue: number;
  requiredMonthlySIP: number;
  totalInvested: number;
  wealthGained: number;
}

const DEFAULT_STATE: CalculatorState = {
  presentCost: 1500000,
  years: 12,
  inflationRate: 6,
  annualReturn: 12,
  expenseRatio: 1.0,
  stepUpRate: 10,
  goalLabel: 'your goal',
  inflatedGoalValue: 0,
  requiredMonthlySIP: 0,
  totalInvested: 0,
  wealthGained: 0,
};

interface CalculatorCtx {
  state: CalculatorState;
  updateState: (patch: Partial<CalculatorState>) => void;
}

const CalculatorContext = createContext<CalculatorCtx | null>(null);

export function CalculatorProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CalculatorState>(DEFAULT_STATE);

  const updateState = useCallback((patch: Partial<CalculatorState>) => {
    setState(prev => ({ ...prev, ...patch }));
  }, []);

  return (
    <CalculatorContext.Provider value={{ state, updateState }}>
      {children}
    </CalculatorContext.Provider>
  );
}

export function useCalculator() {
  const ctx = useContext(CalculatorContext);
  if (!ctx) throw new Error('useCalculator must be inside CalculatorProvider');
  return ctx;
}
