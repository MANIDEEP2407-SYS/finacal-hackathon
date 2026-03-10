'use client';

import {
  createContext, useContext, useReducer,
  useCallback, type ReactNode
} from 'react';

interface BotState {
  isOpen: boolean;
  currentNodeId: string;
  history: string[];
  category: string | null;
}

type BotAction =
  | { type: 'OPEN'; nodeId?: string }
  | { type: 'CLOSE' }
  | { type: 'NAVIGATE'; nodeId: string }
  | { type: 'BACK' }
  | { type: 'SET_CATEGORY'; category: string | null }
  | { type: 'RESET_HISTORY' };

const INITIAL_NODE = 'what-is-a-financial-goal';

function botReducer(state: BotState, action: BotAction): BotState {
  switch (action.type) {
    case 'OPEN':
      return {
        ...state,
        isOpen: true,
        currentNodeId: action.nodeId ?? state.currentNodeId,
        history: action.nodeId
          ? [action.nodeId]
          : state.history,
      };
    case 'CLOSE':
      return { ...state, isOpen: false };
    case 'NAVIGATE':
      return {
        ...state,
        currentNodeId: action.nodeId,
        history: [...state.history, action.nodeId],
      };
    case 'BACK': {
      if (state.history.length <= 1) return state;
      const newHistory = state.history.slice(0, -1);
      return {
        ...state,
        history: newHistory,
        currentNodeId: newHistory[newHistory.length - 1],
      };
    }
    case 'SET_CATEGORY':
      return { ...state, category: action.category };
    case 'RESET_HISTORY':
      return { ...state, history: [state.currentNodeId] };
    default:
      return state;
  }
}

interface BotContextValue {
  state: BotState;
  openBot: (nodeId?: string) => void;
  closeBot: () => void;
  navigateTo: (nodeId: string) => void;
  goBack: () => void;
  setCategory: (category: string | null) => void;
}

const BotContext = createContext<BotContextValue | null>(null);

export function BotProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(botReducer, {
    isOpen: false,
    currentNodeId: INITIAL_NODE,
    history: [INITIAL_NODE],
    category: null,
  });

  const openBot = useCallback((nodeId?: string) => {
    dispatch({ type: 'OPEN', nodeId });
  }, []);

  const closeBot = useCallback(() => {
    dispatch({ type: 'CLOSE' });
  }, []);

  const navigateTo = useCallback((nodeId: string) => {
    dispatch({ type: 'NAVIGATE', nodeId });
  }, []);

  const goBack = useCallback(() => {
    dispatch({ type: 'BACK' });
  }, []);

  const setCategory = useCallback((category: string | null) => {
    dispatch({ type: 'SET_CATEGORY', category });
  }, []);

  return (
    <BotContext.Provider value={{
      state, openBot, closeBot,
      navigateTo, goBack, setCategory,
    }}>
      {children}
    </BotContext.Provider>
  );
}

export function useBot() {
  const ctx = useContext(BotContext);
  if (!ctx) throw new Error('useBot must be inside BotProvider');
  return ctx;
}
