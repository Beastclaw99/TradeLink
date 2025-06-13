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
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type ProjectMilestone = Database['public']['Tables']['project_milestones']['Row'];
export type ProjectTask = Database['public']['Tables']['project_tasks']['Row'];
export type ProjectStatusUpdate = Database['public']['Tables']['project_updates']['Row'];
export type Application = Database['public']['Tables']['applications']['Row'];
export type Review = Database['public']['Tables']['reviews']['Row'];
export type Dispute = Database['public']['Tables']['disputes']['Row'];
export type Payment = Database['public']['Tables']['payments']['Row'];
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