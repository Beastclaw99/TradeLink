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
export type Project = Database['public']['Tables']['projects']['Row'];
export type ProjectInsert = Database['public']['Tables']['projects']['Insert'];
export type ProjectUpdate = Database['public']['Tables']['projects']['Update'];
export type ProjectMilestone = Database['public']['Tables']['project_milestones']['Row'];
export type ProjectTask = Database['public']['Tables']['project_tasks']['Row'];
export type ProjectStatusUpdate = Database['public']['Tables']['project_updates']['Row'];
export type Application = Database['public']['Tables']['applications']['Row'];
export type Review = Database['public']['Tables']['reviews']['Row'];
export type Dispute = Database['public']['Tables']['disputes']['Row'];
export type Payment = Database['public']['Tables']['payments']['Row'];
export type Invoice = Database['public']['Tables']['invoices']['Row'];
export type Message = Database['public']['Tables']['messages']['Row'];
export type Notification = Database['public']['Tables']['notifications']['Row'];

// Extended types for frontend use
export interface ExtendedProject extends Project {
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
} 