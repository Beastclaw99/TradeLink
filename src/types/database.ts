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
export type ProjectStatus = 
  | 'draft'
  | 'open'
  | 'assigned'
  | 'in_progress'
  | 'work_submitted'
  | 'work_revision_requested'
  | 'work_approved'
  | 'completed'
  | 'archived'
  | 'cancelled'
  | 'disputed';
export type ReviewStatus = Database['public']['Enums']['review_status_enum'];
export type TaskStatus = Database['public']['Enums']['task_status_enum'];
export type VerificationStatus = Database['public']['Enums']['verification_status_enum'];

// Re-export table types
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Project = {
  id: string;
  client_id: string;
  title: string;
  description: string | null;
  category: string | null;
  location: string | null;
  budget: number | null;
  timeline: string | null;
  urgency: 'low' | 'medium' | 'high' | 'urgent' | null;
  requirements: string[] | null;
  skills_needed: string[] | null;
  status: ProjectStatus;
  assigned_to: string | null;
  created_at: string | null;
  updated_at: string | null;
  professional_id: string | null;
  contract_template_id: string | null;
  deadline: string | null;
  industry_specific_fields: any | null;
  location_coordinates: any | null;
  project_start_time: string | null;
  rich_description: string | null;
  scope: string | null;
  service_contract: string | null;
  sla_terms: any | null;
  client?: {
    id: string;
    first_name: string;
    last_name: string;
    profile_image_url: string | null;
  };
  professional?: {
    id: string;
    first_name: string;
    last_name: string;
    rating: number | null;
    profile_image_url: string | null;
  };
};
export type Application = Database['public']['Tables']['applications']['Row'];
export type Payment = Database['public']['Tables']['payments']['Row'];
export type Review = Database['public']['Tables']['reviews']['Row'];
export type Message = Database['public']['Tables']['messages']['Row'];
export type Dispute = Database['public']['Tables']['disputes']['Row'];
export type ProjectMilestone = Database['public']['Tables']['project_milestones']['Row'];
export type ProjectDeliverable = Database['public']['Tables']['project_deliverables']['Row'];
export type ProjectTask = Database['public']['Tables']['project_tasks']['Row'];
export type ProjectUpdate = Database['public']['Tables']['project_updates']['Row'];
export type ProjectFile = Database['public']['Tables']['project_files']['Row'];

// Extended types with relationships
export interface ExtendedProject extends Project {
  client?: Pick<Profile, 'first_name' | 'last_name'>;
  professional?: Pick<Profile, 'first_name' | 'last_name' | 'rating' | 'profile_image_url'>;
  milestones?: ProjectMilestone[];
  deliverables?: ProjectDeliverable[];
  spent?: number;
  created_by?: string;
}

export interface ExtendedApplication extends Application {
  project?: Pick<Project, 'id' | 'title' | 'status' | 'budget' | 'created_at'>;
  professional?: Pick<Profile, 'first_name' | 'last_name' | 'skills' | 'rating'>;
}

export interface ExtendedPayment extends Payment {
  project?: Pick<Project, 'title'>;
  professional?: Pick<Profile, 'first_name' | 'last_name'>;
}

export interface ExtendedReview extends Review {
  client?: Pick<Profile, 'first_name' | 'last_name'>;
  professional?: Pick<Profile, 'first_name' | 'last_name'>;
  project?: Pick<Project, 'title'>;
}

export interface ExtendedDispute extends Dispute {
  initiator?: Pick<Profile, 'first_name' | 'last_name'>;
  respondent?: Pick<Profile, 'first_name' | 'last_name'>;
  project?: Pick<Project, 'title'>;
  mediator?: Pick<Profile, 'first_name' | 'last_name'>;
} 