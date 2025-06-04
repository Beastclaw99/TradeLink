
// Consolidated type definitions - single source of truth
export interface Project {
  id: string;
  title: string;
  description: string | null;
  budget: number | null;
  status: 'open' | 'applied' | 'assigned' | 'in-progress' | 'submitted' | 'revision' | 'completed' | 'paid' | 'archived' | 'disputed';
  client_id: string;
  created_at: string;
  updated_at: string;
  assigned_to: string | null;
  location: string | null;
  deadline: string | null;
  required_skills: string | null;
  professional_id: string | null;
  project_start_time: string | null;
  category: string | null;
  expected_timeline: string | null;
  urgency: string | null;
  requirements: string[] | null;
  scope: string | null;
  service_contract: string | null;
  client?: {
    first_name: string | null;
    last_name: string | null;
  };
}

export interface Application {
  id: string;
  project_id: string;
  professional_id: string;
  cover_letter: string | null;
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn';
  created_at: string;
  updated_at: string;
  bid_amount: number | null;
  proposal_message: string | null;
  availability: string | null;
  project?: {
    id: string;
    title: string;
    status: Project['status'];
    budget: number | null;
    created_at: string;
  };
  professional?: {
    first_name: string | null;
    last_name: string | null;
    rating?: number;
    skills?: string[];
  };
}

export interface Payment {
  id: string;
  project_id: string;
  client_id: string;
  professional_id: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  paid_at: string | null;
  created_at: string;
  project?: {
    title: string;
  };
  professional?: {
    first_name: string | null;
    last_name: string | null;
  };
}

export interface Review {
  id: string;
  project_id: string;
  professional_id: string;
  client_id: string;
  rating: number | null;
  comment: string | null;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  created_at: string;
  action_label?: string;
  action_url?: string;
}

// Project creation types - unified with main types
export interface Deliverable {
  id: string;
  title: string;
  description: string;
  deliverable_type: 'text' | 'file' | 'link';
  content: string;
  milestone_id: string;
  file_url?: string;
  file_name?: string;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  due_date?: string;
  deliverables: Deliverable[];
  is_complete: boolean;
  status?: 'not_started' | 'in_progress' | 'completed';
}

export interface ProjectData {
  title: string;
  description: string;
  category: string;
  budget: number;
  timeline: string;
  milestones: Milestone[];
  location: string;
  expectedTimeline: string;
  urgency: 'low' | 'medium' | 'high';
  recommended_skills: string[];
  requirements?: string[];
  skills?: string[];
  service_contract?: string;
  deliverables?: Deliverable[];
}

// Drag and Drop Types
export interface DragResult {
  draggableId: string;
  type: string;
  source: {
    droppableId: string;
    index: number;
  };
  destination: {
    droppableId: string;
    index: number;
  } | null;
  reason: 'DROP' | 'CANCEL';
}

// File Upload Types
export interface FileUploadResult {
  success: boolean;
  url?: string;
  error?: string;
  file?: File;
}

// Validation Types
export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}
