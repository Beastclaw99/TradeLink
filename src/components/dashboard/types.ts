import { Project } from '@/types/project';
import { ProjectStatus } from '@/types/projectUpdates';

// Re-export the Project type for backward compatibility
export type { Project };

// Simplified project interface for applications
export interface ApplicationProject {
  id: string;
  title: string;
  status: string | null;
  budget: number | null;
  created_at: string | null;
}

export interface Application {
  id: string;
  project_id: string;
  professional_id: string;
  cover_letter: string | null;
  proposal_message: string | null;
  bid_amount: number | null;
  availability: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  project?: ApplicationProject;
  professional?: {
    first_name?: string;
    last_name?: string;
    skills?: string[];
    rating?: number;
  };
}

export interface Professional {
  id: string;
  first_name: string | null;
  last_name: string | null;
  skills: string[] | null;
  rating: number | null;
  account_type: 'professional';
  bio: string | null;
  location: string | null;
  phone: string | null;
  email: string | null;
  availability: 'available' | 'busy' | 'unavailable' | null;
  certifications: string[] | null;
  completed_projects: number | null;
  response_rate: number | null;
  on_time_completion: number | null;
  profile_visibility: boolean | null;
  show_email: boolean | null;
  show_phone: boolean | null;
  allow_messages: boolean | null;
  profile_image: string | null;
  verification_status: 'unverified' | 'pending' | 'verified' | null;
  created_at: string;
  updated_at: string | null;
}

export interface Client {
  id: string;
  first_name: string | null;
  last_name: string | null;
  account_type: 'client';
  bio: string | null;
  location: string | null;
  phone: string | null;
  email: string | null;
  profile_visibility: boolean | null;
  show_email: boolean | null;
  show_phone: boolean | null;
  allow_messages: boolean | null;
  profile_image: string | null;
  verification_status: 'unverified' | 'pending' | 'verified' | null;
  created_at: string;
  updated_at?: string;
}

export interface Review {
  id: string;
  rating: number | null;
  comment: string | null;
  client_id: string | null;
  professional_id: string | null;
  project_id: string | null;
  created_at: string;
  updated_at: string | null;
}

export interface Payment {
  id: string;
  amount: number;
  status: string;
  payment_method: string | null;
  transaction_id: string | null;
  created_at: string;
  paid_at: string | null;
  client_id: string | null;
  professional_id: string | null;
  project_id: string | null;
  project?: {
    title?: string;
  };
  professional?: {
    first_name?: string;
    last_name?: string;
  };
}
