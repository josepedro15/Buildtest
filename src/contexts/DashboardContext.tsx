import { createContext, useContext, useReducer, ReactNode, useCallback } from 'react';
import { logger } from '@/lib/logger';

interface DashboardState {
  selectedDate: Date | null;
  filters: Record<string, any>;
  isLoading: boolean;
  lastUpdated: Date | null;
  refreshKey: number;
}

type DashboardAction = 
  | { type: 'SET_DATE'; payload: Date | null }
  | { type: 'SET_FILTERS'; payload: Record<string, any> }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_LAST_UPDATED'; payload: Date }
  | { type: 'INCREMENT_REFRESH_KEY' }
  | { type: 'RESET_STATE' };

const initialState: DashboardState = {
  selectedDate: null,
  filters: {},
  isLoading: false,
  lastUpdated: null,
  refreshKey: 0,
};

const dashboardReducer = (state: DashboardState, action: DashboardAction): DashboardState => {
  switch (action.type) {
    case 'SET_DATE':
      logger.info('Dashboard: Date filter changed', { date: action.payload });
      return { ...state, selectedDate: action.payload };
    
    case 'SET_FILTERS':
      logger.info('Dashboard: Filters changed', { filters: action.payload });
      return { ...state, filters: action.payload };
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_LAST_UPDATED':
      return { ...state, lastUpdated: action.payload };
    
    case 'INCREMENT_REFRESH_KEY':
      return { ...state, refreshKey: state.refreshKey + 1 };
    
    case 'RESET_STATE':
      logger.info('Dashboard: State reset');
      return initialState;
    
    default:
      return state;
  }
};

interface DashboardContextType {
  state: DashboardState;
  setSelectedDate: (date: Date | null) => void;
  setFilters: (filters: Record<string, any>) => void;
  setLoading: (loading: boolean) => void;
  refreshData: () => void;
  resetState: () => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(dashboardReducer, initialState);

  const setSelectedDate = useCallback((date: Date | null) => {
    dispatch({ type: 'SET_DATE', payload: date });
  }, []);

  const setFilters = useCallback((filters: Record<string, any>) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  }, []);

  const refreshData = useCallback(() => {
    logger.info('Dashboard: Manual refresh triggered');
    dispatch({ type: 'INCREMENT_REFRESH_KEY' });
    dispatch({ type: 'SET_LAST_UPDATED', payload: new Date() });
  }, []);

  const resetState = useCallback(() => {
    dispatch({ type: 'RESET_STATE' });
  }, []);

  const value: DashboardContextType = {
    state,
    setSelectedDate,
    setFilters,
    setLoading,
    refreshData,
    resetState,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within DashboardProvider');
  }
  return context;
};
