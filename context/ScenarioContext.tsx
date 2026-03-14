'use client';
import { createContext, useContext, useReducer, useCallback, type ReactNode } from 'react';

export interface ScenarioInputs {
  presentCost:   number;
  yearsToGoal:   number;
  inflationRate: number;
  annualReturn:  number;
  expenseRatio:  number;
  stepUpPct:     number;
  ltcgRate:      number;
  crashDepth:    number;
  crashAtYear:   number;
  recoveryMonths: number;
  salary:        number;
}

export type DepthId = 1 | 2 | 3 | 4 | 5 | 6 | 7;

interface ScenarioState {
  primary: ScenarioInputs;
  compare: ScenarioInputs | null;
  unlockedDepths: Set<DepthId>;
  compareMode: boolean;
  mode: 'calculator';
}

type Action =
  | { type: 'UPDATE_PRIMARY'; patch: Partial<ScenarioInputs> }
  | { type: 'UPDATE_COMPARE'; patch: Partial<ScenarioInputs> }
  | { type: 'UNLOCK_DEPTH'; depth: DepthId }
  | { type: 'TOGGLE_COMPARE' }
  | { type: 'SET_MODE'; mode: 'calculator' }
  | { type: 'PRESET'; inputs: Partial<ScenarioInputs> }
  | { type: 'RESET' };

const DEFAULT_INPUTS: ScenarioInputs = {
  presentCost: 2500000, yearsToGoal: 15, inflationRate: 6,
  annualReturn: 12, expenseRatio: 1.0, stepUpPct: 10,
  ltcgRate: 12.5, crashDepth: 40, crashAtYear: 5,
  recoveryMonths: 14, salary: 50000,
};

function initState(): ScenarioState {
  try {
    const saved = localStorage.getItem('fincal-scenario');
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...parsed,
        unlockedDepths: new Set(parsed.unlockedDepths ?? [1]),
        compareMode: false,
      };
    }
  } catch { /* */ }
  return {
    primary: { ...DEFAULT_INPUTS },
    compare: null,
    unlockedDepths: new Set([1] as DepthId[]),
    compareMode: false,
    mode: 'calculator',
  };
}

function reducer(state: ScenarioState, action: Action): ScenarioState {
  switch (action.type) {
    case 'UPDATE_PRIMARY':
      return { ...state, primary: { ...state.primary, ...action.patch } };
    case 'UPDATE_COMPARE':
      return { ...state, compare: { ...(state.compare ?? state.primary), ...action.patch } };
    case 'UNLOCK_DEPTH': {
      const next = new Set(state.unlockedDepths);
      next.add(action.depth);
      return { ...state, unlockedDepths: next };
    }
    case 'TOGGLE_COMPARE':
      return { ...state, compareMode: !state.compareMode, compare: state.compare ?? { ...state.primary } };
    case 'SET_MODE':
      return { ...state, mode: action.mode };
    case 'PRESET':
      return { ...state, primary: { ...state.primary, ...action.inputs } };
    case 'RESET':
      return { primary: { ...DEFAULT_INPUTS }, compare: null, unlockedDepths: new Set([1] as DepthId[]), compareMode: false, mode: state.mode };
    default: return state;
  }
}

interface ScenarioCtx {
  state: ScenarioState;
  update: (patch: Partial<ScenarioInputs>) => void;
  updateCompare: (patch: Partial<ScenarioInputs>) => void;
  unlockDepth: (d: DepthId) => void;
  toggleCompare: () => void;
  setMode: (m: 'calculator') => void;
  setPreset: (inputs: Partial<ScenarioInputs>) => void;
  reset: () => void;
  isUnlocked: (d: DepthId) => boolean;
}

const Ctx = createContext<ScenarioCtx | null>(null);

export function ScenarioProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, initState);

  const persist = useCallback((s: ScenarioState) => {
    try {
      localStorage.setItem('fincal-scenario', JSON.stringify({
        ...s,
        unlockedDepths: [...s.unlockedDepths],
        compareMode: false,
      }));
    } catch { /* */ }
  }, []);

  const update = useCallback((patch: Partial<ScenarioInputs>) => {
    dispatch({ type: 'UPDATE_PRIMARY', patch });
  }, []);
  const updateCompare = useCallback((patch: Partial<ScenarioInputs>) => {
    dispatch({ type: 'UPDATE_COMPARE', patch });
  }, []);
  const unlockDepth = useCallback((depth: DepthId) => {
    dispatch({ type: 'UNLOCK_DEPTH', depth });
    persist({ ...state, unlockedDepths: new Set([...state.unlockedDepths, depth]) });
  }, [state, persist]);
  const toggleCompare = useCallback(() => dispatch({ type: 'TOGGLE_COMPARE' }), []);
  const setMode = useCallback((mode: 'calculator') => dispatch({ type: 'SET_MODE', mode }), []);
  const setPreset = useCallback((inputs: Partial<ScenarioInputs>) => dispatch({ type: 'PRESET', inputs }), []);
  const reset = useCallback(() => { dispatch({ type: 'RESET' }); localStorage.removeItem('fincal-scenario'); }, []);
  const isUnlocked = useCallback((d: DepthId) => state.unlockedDepths.has(d), [state.unlockedDepths]);

  return (
    <Ctx.Provider value={{ state, update, updateCompare, unlockDepth, toggleCompare, setMode, setPreset, reset, isUnlocked }}>
      {children}
    </Ctx.Provider>
  );
}

export function useScenario() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useScenario must be inside ScenarioProvider');
  return ctx;
}
