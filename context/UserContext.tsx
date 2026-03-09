'use client';
import { createContext, useContext, useReducer, useCallback, type ReactNode } from 'react';

export type UserLevel = 'beginner' | 'intermediate' | 'advanced';

interface UserState {
  level: UserLevel | null;
  onboardingDone: boolean;
  goalPreset: string | null;
  salary: number | null;
}

type Action =
  | { type: 'SET_LEVEL'; level: UserLevel }
  | { type: 'SKIP_ONBOARDING' }
  | { type: 'SET_PRESET'; preset: string }
  | { type: 'SET_SALARY'; salary: number }
  | { type: 'RESET' };

function load(): UserState {
  try {
    const s = localStorage.getItem('fincal-user');
    return s ? JSON.parse(s) : { level: null, onboardingDone: false, goalPreset: null, salary: null };
  } catch { return { level: null, onboardingDone: false, goalPreset: null, salary: null }; }
}

function reducer(state: UserState, action: Action): UserState {
  switch (action.type) {
    case 'SET_LEVEL':    return { ...state, level: action.level, onboardingDone: true };
    case 'SKIP_ONBOARDING': return { ...state, onboardingDone: true, level: state.level ?? 'beginner' };
    case 'SET_PRESET':  return { ...state, goalPreset: action.preset };
    case 'SET_SALARY':  return { ...state, salary: action.salary };
    case 'RESET':       return { level: null, onboardingDone: false, goalPreset: null, salary: null };
    default:            return state;
  }
}

interface UserCtx {
  state: UserState;
  setLevel: (level: UserLevel) => void;
  skipOnboarding: () => void;
  setPreset: (preset: string) => void;
  setSalary: (salary: number) => void;
  reset: () => void;
}

const UserContext = createContext<UserCtx | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, load);
  const save = useCallback((s: UserState) => {
    try { localStorage.setItem('fincal-user', JSON.stringify(s)); } catch { /* */ }
  }, []);

  const setLevel = useCallback((level: UserLevel) => {
    const next = reducer(state, { type: 'SET_LEVEL', level });
    dispatch({ type: 'SET_LEVEL', level }); save(next);
  }, [state, save]);
  const skipOnboarding = useCallback(() => {
    const next = reducer(state, { type: 'SKIP_ONBOARDING' });
    dispatch({ type: 'SKIP_ONBOARDING' }); save(next);
  }, [state, save]);
  const setPreset = useCallback((preset: string) => { dispatch({ type: 'SET_PRESET', preset }); }, []);
  const setSalary = useCallback((salary: number) => { dispatch({ type: 'SET_SALARY', salary }); }, []);
  const reset = useCallback(() => {
    dispatch({ type: 'RESET' }); try { localStorage.removeItem('fincal-user'); } catch { /* */ }
  }, []);

  return (
    <UserContext.Provider value={{ state, setLevel, skipOnboarding, setPreset, setSalary, reset }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be inside UserProvider');
  return ctx;
}

/* Quiz classification */
export function classifyLevel(answers: { q1: number; q2: number; q3: number }): UserLevel {
  // q1: 0=Never(0), 1=Few times(1), 2=Regularly(2)
  // q3: 0=Not familiar(0), 1=Heard(1), 2=Understands(2)
  const score = answers.q1 + answers.q3;
  if (score <= 1) return 'beginner';
  if (score <= 3) return 'intermediate';
  return 'advanced';
}
