import { Database } from '@/integrations/supabase/types';

// Re-export all enums from the database
export type AccountType = Database['public']['Enums']['account_type_enum'];
export type ApplicationStatus = Database['public']['Enums']['application_status'];
export type DeliverableStatus = Database['public']['Enums']['deliverable_status'];
export type DisputeCategory = Database['public']['Enums']['dispute_category'];
export type DisputeResolutionType = Database['public']['Enums']['dispute_resolution_type'];
export type DisputeStatus = Database['public']['Enums']['dispute_status'];
export type FileReviewStatus = Database['public']['Enums']['file_review_status_enum'];
export type MilestoneStatus = Database['public']['Enums']['milestone_status'];
export type PaymentStatus = Database['public']['Enums']['payment_status'];
export type ProjectStatus = Database['public']['Enums']['project_status_enum'];
export type ReviewStatus = Database['public']['Enums']['review_status_enum'];
export type TaskStatus = Database['public']['Enums']['task_status_enum'];
export type UserRole = Database['public']['Enums']['user_role'];
export type VerificationStatus = Database['public']['Enums']['verification_status_enum'];

// Re-export table types
export type Profile = {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  bio?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
  role: 'client' | 'professional';
  status: 'active' | 'inactive' | 'suspended';
  company_name?: string;
  company_website?: string;
  company_logo?: string;
  company_description?: string;
  company_address?: string;
  company_phone?: string;
  company_email?: string;
  company_social_media?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
  };
  skills?: string[];
  experience?: string;
  education?: string;
  certifications?: string[];
  languages?: string[];
  hourly_rate?: number;
  availability?: {
    monday?: boolean;
    tuesday?: boolean;
    wednesday?: boolean;
    thursday?: boolean;
    friday?: boolean;
    saturday?: boolean;
    sunday?: boolean;
  };
  timezone?: string;
  preferred_communication?: 'email' | 'phone' | 'both';
  notification_preferences?: {
    email?: boolean;
    push?: boolean;
    sms?: boolean;
  };
};

export type ProjectMilestone = Database['public']['Tables']['project_milestones']['Row'];
export type ProjectTask = Database['public']['Tables']['project_tasks']['Row'];
export type ProjectStatusUpdate = Database['public']['Tables']['project_updates']['Row'];
export type Application = {
  id: string;
  project_id: string;
  professional_id: string;
  cover_letter: string;
  proposed_budget: number;
  proposed_timeline: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  updated_at: string;
  attachments?: string[];
  questions?: {
    question: string;
    answer: string;
  }[];
};

export type Review = {
  id: string;
  project_id: string;
  reviewer_id: string;
  reviewee_id: string;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
  is_public: boolean;
  response?: string;
  response_date?: string;
};

export type Dispute = Database['public']['Tables']['disputes']['Row'];
export type Payment = {
  id: string;
  project_id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  payment_method: string;
  payment_date: string;
  created_at: string;
  updated_at: string;
  transaction_id?: string;
  receipt_url?: string;
  notes?: string;
};

export type Invoice = Database['public']['Tables']['invoices']['Row'];
export type Message = Database['public']['Tables']['project_messages']['Row'];
export type Notification = Database['public']['Tables']['notifications']['Row'];

// Base project type from Supabase
export type ProjectBase = Database['public']['Tables']['projects']['Row'];

// Extended project type for frontend use
export interface Project extends Omit<ProjectBase, 'urgency'> {
  client?: Profile;
  professional?: Profile;
  milestones?: ProjectMilestone[];
  tasks?: ProjectTask[];
  updates?: ProjectStatusUpdate[];
  applications?: Application[];
  reviews?: Review[];
  disputes?: Dispute[];
  payments?: Payment[];
  invoices?: Invoice[];
  messages?: Message[];
  notifications?: Notification[];
  recommended_skills?: string[];
  project_start_time?: string | null;
  rich_description?: string | null;
  service_contract?: string | null;
  urgency?: 'high' | 'low' | 'normal' | null;
}

// Task types
export interface Task {
  id: string;
  project_id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  assignee_id: string | null;
  due_date: string | null;
  created_at: string;
  updated_at: string;
  completed: boolean | null;
  completion_date: string | null;
  created_by: string | null;
  dependencies: string[] | null;
  milestone_id: string | null;
  priority: string;
  tags: string[] | null;
}

export interface TaskInsert {
  project_id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  assignee_id?: string;
  due_date?: string;
  completed?: boolean;
  completion_date?: string;
  created_by?: string;
  dependencies?: string[];
  milestone_id?: string;
  priority: string;
  tags?: string[];
}

export interface TaskUpdate {
  title?: string;
  description?: string;
  status?: TaskStatus;
  assignee_id?: string;
  due_date?: string;
  completed?: boolean;
  completion_date?: string;
  created_by?: string;
  dependencies?: string[];
  milestone_id?: string;
  priority?: string;
  tags?: string[];
}

export type ProjectUpdate = {
  id: string;
  project_id: string;
  user_id: string;
  update_type: 'status_change' | 'milestone_complete' | 'payment_received' | 'application_updated' | 'review_posted';
  message: string;
  created_at: string;
  updated_at: string;
  metadata?: Record<string, any>;
};

export type Milestone = {
  id: string;
  project_id: string;
  title: string;
  description: string;
  due_date: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
  completed_at?: string;
  completion_notes?: string;
  attachments?: string[];
  tasks?: Task[];
}; 