import {
  Project as DBProject,
  Application as DBApplication,
  Review as DBReview,
  Payment as DBPayment,
  Profile,
  ProjectStatus,
  ApplicationStatus,
  ReviewStatus,
  PaymentStatus,
  MilestoneStatus,
  DeliverableStatus
} from '@/types/database';

export interface Project {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  budget: number | null;
  expected_timeline: string | null;
  location: string | null;
  urgency: 'low' | 'normal' | 'high' | null;
  requirements: string[] | null;
  recommended_skills: string | null;
  status: string | null;
  created_at: string | null;
  updated_at: string | null;
  client_id: string | null;
  assigned_to: string | null;
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
    first_name: string | null;
    last_name: string | null;
    profile_image_url: string | null;
    rating: number | null;
    total_reviews: number | null;
  };
  milestones?: any[];
  deliverables?: any[];
  applications?: any[];
}

// Simplified project interface for applications
export interface ApplicationProject {
  id: string;
  title: string;
  status: ProjectStatus;
  budget: number | null;
  created_at: string | null;
}

export interface Application extends DBApplication {
  project?: ApplicationProject;
  professional?: {
    first_name?: string;
    last_name?: string;
    skills?: string[];
    rating?: number;
  };
}

export interface Client extends Profile {
  account_type: 'client';
}

export interface Review extends DBReview {
  client?: {
    first_name?: string;
    last_name?: string;
  };
  professional?: {
    first_name?: string;
    last_name?: string;
  };
  project?: {
    title?: string;
  };
}

export interface Payment extends DBPayment {
  project?: {
    title?: string;
  };
  professional?: {
    first_name?: string;
    last_name?: string;
  };
}
