import { createContext, useContext, useReducer, ReactNode } from 'react';
import { Project, Milestone, Task, Application, Payment, Review } from '@/types/database';

// State Types
export type ProjectState = {
  projects: Project[];
  selectedProject: Project | null;
  milestones: Milestone[];
  tasks: Task[];
  applications: Application[];
  payments: Payment[];
  reviews: Review[];
  isLoading: boolean;
  error: string | null;
};

// Action Types
export type ProjectAction =
  | { type: 'SET_PROJECTS'; payload: Project[] }
  | { type: 'SET_SELECTED_PROJECT'; payload: Project | null }
  | { type: 'SET_MILESTONES'; payload: Milestone[] }
  | { type: 'SET_TASKS'; payload: Task[] }
  | { type: 'SET_APPLICATIONS'; payload: Application[] }
  | { type: 'SET_PAYMENTS'; payload: Payment[] }
  | { type: 'SET_REVIEWS'; payload: Review[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'ADD_PROJECT'; payload: Project }
  | { type: 'UPDATE_PROJECT'; payload: Project }
  | { type: 'DELETE_PROJECT'; payload: string }
  | { type: 'ADD_MILESTONE'; payload: Milestone }
  | { type: 'UPDATE_MILESTONE'; payload: Milestone }
  | { type: 'DELETE_MILESTONE'; payload: string }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'ADD_APPLICATION'; payload: Application }
  | { type: 'UPDATE_APPLICATION'; payload: Application }
  | { type: 'DELETE_APPLICATION'; payload: string }
  | { type: 'ADD_PAYMENT'; payload: Payment }
  | { type: 'UPDATE_PAYMENT'; payload: Payment }
  | { type: 'DELETE_PAYMENT'; payload: string }
  | { type: 'ADD_REVIEW'; payload: Review }
  | { type: 'UPDATE_REVIEW'; payload: Review }
  | { type: 'DELETE_REVIEW'; payload: string };

// Context Type
export type ProjectContextType = {
  state: ProjectState;
  dispatch: React.Dispatch<ProjectAction>;
};

// Initial State
const initialState: ProjectState = {
  projects: [],
  selectedProject: null,
  milestones: [],
  tasks: [],
  applications: [],
  payments: [],
  reviews: [],
  isLoading: false,
  error: null
};

// Reducer
const projectReducer = (state: ProjectState, action: ProjectAction): ProjectState => {
  switch (action.type) {
    case 'SET_PROJECTS':
      return { ...state, projects: action.payload };
    case 'SET_SELECTED_PROJECT':
      return { ...state, selectedProject: action.payload };
    case 'SET_MILESTONES':
      return { ...state, milestones: action.payload };
    case 'SET_TASKS':
      return { ...state, tasks: action.payload };
    case 'SET_APPLICATIONS':
      return { ...state, applications: action.payload };
    case 'SET_PAYMENTS':
      return { ...state, payments: action.payload };
    case 'SET_REVIEWS':
      return { ...state, reviews: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'ADD_PROJECT':
      return { ...state, projects: [...state.projects, action.payload] };
    case 'UPDATE_PROJECT':
      return {
        ...state,
        projects: state.projects.map(project =>
          project.id === action.payload.id ? action.payload : project
        )
      };
    case 'DELETE_PROJECT':
      return {
        ...state,
        projects: state.projects.filter(project => project.id !== action.payload)
      };
    case 'ADD_MILESTONE':
      return { ...state, milestones: [...state.milestones, action.payload] };
    case 'UPDATE_MILESTONE':
      return {
        ...state,
        milestones: state.milestones.map(milestone =>
          milestone.id === action.payload.id ? action.payload : milestone
        )
      };
    case 'DELETE_MILESTONE':
      return {
        ...state,
        milestones: state.milestones.filter(milestone => milestone.id !== action.payload)
      };
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id ? action.payload : task
        )
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload)
      };
    case 'ADD_APPLICATION':
      return { ...state, applications: [...state.applications, action.payload] };
    case 'UPDATE_APPLICATION':
      return {
        ...state,
        applications: state.applications.map(application =>
          application.id === action.payload.id ? action.payload : application
        )
      };
    case 'DELETE_APPLICATION':
      return {
        ...state,
        applications: state.applications.filter(application => application.id !== action.payload)
      };
    case 'ADD_PAYMENT':
      return { ...state, payments: [...state.payments, action.payload] };
    case 'UPDATE_PAYMENT':
      return {
        ...state,
        payments: state.payments.map(payment =>
          payment.id === action.payload.id ? action.payload : payment
        )
      };
    case 'DELETE_PAYMENT':
      return {
        ...state,
        payments: state.payments.filter(payment => payment.id !== action.payload)
      };
    case 'ADD_REVIEW':
      return { ...state, reviews: [...state.reviews, action.payload] };
    case 'UPDATE_REVIEW':
      return {
        ...state,
        reviews: state.reviews.map(review =>
          review.id === action.payload.id ? action.payload : review
        )
      };
    case 'DELETE_REVIEW':
      return {
        ...state,
        reviews: state.reviews.filter(review => review.id !== action.payload)
      };
    default:
      return state;
  }
};

// Context
const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

// Provider
export const ProjectProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(projectReducer, initialState);

  return (
    <ProjectContext.Provider value={{ state, dispatch }}>
      {children}
    </ProjectContext.Provider>
  );
};

// Hook
export const useProject = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
}; 