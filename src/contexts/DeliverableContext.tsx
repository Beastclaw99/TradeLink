import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { Deliverable } from '../types';

interface DeliverableState {
  deliverables: Deliverable[];
  loading: boolean;
  error: string | null;
}

type DeliverableAction =
  | { type: 'SET_DELIVERABLES'; payload: Deliverable[] }
  | { type: 'ADD_DELIVERABLE'; payload: Deliverable }
  | { type: 'UPDATE_DELIVERABLE'; payload: { id: string; deliverable: Deliverable } }
  | { type: 'DELETE_DELIVERABLE'; payload: string }
  | { type: 'REORDER_DELIVERABLES'; payload: { startIndex: number; endIndex: number } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

interface DeliverableContextType {
  state: DeliverableState;
  addDeliverable: (milestoneId: string, deliverable: Deliverable) => void;
  updateDeliverable: (milestoneId: string, deliverableId: string, deliverable: Deliverable) => void;
  deleteDeliverable: (milestoneId: string, deliverableId: string) => void;
  reorderDeliverables: (milestoneId: string, startIndex: number, endIndex: number) => void;
  setError: (error: string | null) => void;
}

const initialState: DeliverableState = {
  deliverables: [],
  loading: false,
  error: null,
};

const DeliverableContext = createContext<DeliverableContextType | undefined>(undefined);

const deliverableReducer = (state: DeliverableState, action: DeliverableAction): DeliverableState => {
  switch (action.type) {
    case 'SET_DELIVERABLES':
      return {
        ...state,
        deliverables: action.payload,
        loading: false,
        error: null,
      };
    case 'ADD_DELIVERABLE':
      return {
        ...state,
        deliverables: [...state.deliverables, action.payload],
        loading: false,
        error: null,
      };
    case 'UPDATE_DELIVERABLE':
      return {
        ...state,
        deliverables: state.deliverables.map((d) =>
          d.id === action.payload.id ? action.payload.deliverable : d
        ),
        loading: false,
        error: null,
      };
    case 'DELETE_DELIVERABLE':
      return {
        ...state,
        deliverables: state.deliverables.filter((d) => d.id !== action.payload),
        loading: false,
        error: null,
      };
    case 'REORDER_DELIVERABLES':
      const result = Array.from(state.deliverables);
      const [removed] = result.splice(action.payload.startIndex, 1);
      result.splice(action.payload.endIndex, 0, removed);
      return {
        ...state,
        deliverables: result,
        loading: false,
        error: null,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    default:
      return state;
  }
};

export const DeliverableProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(deliverableReducer, initialState);

  const addDeliverable = useCallback((milestoneId: string, deliverable: Deliverable) => {
    dispatch({ type: 'ADD_DELIVERABLE', payload: deliverable });
  }, []);

  const updateDeliverable = useCallback((milestoneId: string, deliverableId: string, deliverable: Deliverable) => {
    dispatch({ type: 'UPDATE_DELIVERABLE', payload: { id: deliverableId, deliverable } });
  }, []);

  const deleteDeliverable = useCallback((milestoneId: string, deliverableId: string) => {
    dispatch({ type: 'DELETE_DELIVERABLE', payload: deliverableId });
  }, []);

  const reorderDeliverables = useCallback((milestoneId: string, startIndex: number, endIndex: number) => {
    dispatch({ type: 'REORDER_DELIVERABLES', payload: { startIndex, endIndex } });
  }, []);

  const setError = useCallback((error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  }, []);

  const value = {
    state,
    addDeliverable,
    updateDeliverable,
    deleteDeliverable,
    reorderDeliverables,
    setError,
  };

  return (
    <DeliverableContext.Provider value={value}>
      {children}
    </DeliverableContext.Provider>
  );
};

export const useDeliverables = () => {
  const context = useContext(DeliverableContext);
  if (context === undefined) {
    throw new Error('useDeliverables must be used within a DeliverableProvider');
  }
  return context;
}; 