
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
  project_id: string | null;
  professional_id: string | null;
  cover_letter: string | null;
  proposal_message: string | null;
  bid_amount: number | null;
  availability: string | null;
  status: string | null;
  created_at: string;
  updated_at: string;
  project?: ApplicationProject;
  professional?: {
    id: string;
    first_name?: string | null;
    last_name?: string | null;
    skills?: string[] | null;
    rating?: number | null;
  };
}

export interface Professional {
  id: string;
  first_name: string | null;
  last_name: string | null;
  account_type: 'professional' | 'client' | 'business';
  skills: string[] | null;
  rating: number | null;
  bio: string | null;
  location: string | null;
  phone: string | null;
  email: string | null;
  availability: string | null;
  certifications: string[] | null;
  completed_projects: number | null;
  response_rate: number | null;
  on_time_completion: number | null;
  profile_visibility: boolean | null;
  show_email: boolean | null;
  show_phone: boolean | null;
  allow_messages: boolean | null;
  profile_image: string | null;
  profile_image_url: string | null;
  verification_status: string | null;
  created_at: string;
  updated_at: string | null;
  hourly_rate: number | null;
  years_experience: number | null;
  portfolio_images: string[] | null;
  portfolio_urls: string[] | null;
  is_available: boolean | null;
  years_of_experience: number | null;
  business_name: string | null;
  business_description: string | null;
  specialties: string[] | null;
  service_areas: string[] | null;
  license_number: string | null;
  insurance_info: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  country: string | null;
}

export interface Client {
  id: string;
  first_name: string | null;
  last_name: string | null;
  account_type: 'client' | 'professional' | 'business';
  bio: string | null;
  location: string | null;
  phone: string | null;
  email: string | null;
  profile_visibility: boolean | null;
  show_email: boolean | null;
  show_phone: boolean | null;
  allow_messages: boolean | null;
  profile_image: string | null;
  profile_image_url: string | null;
  verification_status: string | null;
  created_at: string;
  updated_at: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  country: string | null;
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
  quality_rating: number | null;
  communication_rating: number | null;
  timeliness_rating: number | null;
  professionalism_rating: number | null;
  is_verified: boolean | null;
  verification_method: string | null;
  status: string | null;
  reported_by: string | null;
  reported_at: string | null;
  report_reason: string | null;
  moderated_by: string | null;
  moderated_at: string | null;
  moderation_notes: string | null;
}

export interface Payment {
  id: string;
  amount: number;
  status: string | null;
  payment_method_id: string | null;
  transaction_id: string | null;
  created_at: string;
  paid_at: string | null;
  client_id: string | null;
  professional_id: string | null;
  project_id: string | null;
  currency: string | null;
  payment_url: string | null;
  metadata: any | null;
  project?: {
    title?: string;
  };
  professional?: {
    first_name?: string | null;
    last_name?: string | null;
  };
}

export interface Notification {
  id: string;
  user_id: string | null;
  type: string;
  title: string;
  message: string;
  read: boolean | null;
  created_at: string;
  updated_at: string;
}

export interface Invoice {
  id: string;
  project_id: string | null;
  client_id: string | null;
  professional_id: string | null;
  amount: number;
  status: string | null;
  issued_at: string;
  paid_at: string | null;
}

export interface WorkVersion {
  id: string;
  project_id: string | null;
  version_number: number;
  status: string | null;
  submitted_by: string | null;
  submitted_at: string;
  reviewed_by: string | null;
  reviewed_at: string | null;
  feedback: string | null;
  metadata: any | null;
  created_at: string;
  updated_at: string;
}

export interface WorkVersionFile {
  id: string;
  version_id: string | null;
  file_name: string;
  file_url: string;
  file_type: string | null;
  file_size: number | null;
  uploaded_at: string;
  created_at: string;
}
