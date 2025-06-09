
export interface Project {
  id: string;
  title: string;
  description: string;
  client_id: string;
  status: string;
  budget: number;
  created_at: string;
  updated_at: string;
  category?: string;
  location?: string;
  professional_id?: string;
  assigned_to?: string;
  deadline?: string;
  requirements?: string[];
  required_skills?: string[];
  urgency?: string;
  scope?: string;
  rich_description?: string;
  sla_terms?: any;
  industry_specific_fields?: any;
  location_coordinates?: any;
  project_start_time?: string;
  expected_timeline?: string;
  service_contract?: string;
  payment_status?: string;
  payment_required?: boolean;
  payment_due_date?: string;
  contract_template_id?: string;
  // Add missing properties that components expect
  client?: {
    id: string;
    first_name: string;
    last_name: string;
    email?: string;
  };
  professional?: {
    id: string;
    first_name: string;
    last_name: string;
    email?: string;
  };
}

export interface Application {
  id: string;
  professional_id: string;
  project_id: string;
  status: string;
  created_at: string;
  updated_at: string;
  cover_letter?: string;
  proposal_message?: string;
  availability?: string;
  bid_amount?: number;
  professional?: {
    id: string;
    first_name: string;
    last_name: string;
    email?: string;
    phone?: string;
    bio?: string;
    rating?: number;
    hourly_rate?: number;
    profile_image?: string;
    skills?: string[];
    years_experience?: number;
    location?: string;
    verification_status?: string;
  };
  project?: ApplicationProject;
}

export interface ApplicationProject {
  id: string;
  title: string;
  status: string;
  budget: number;
  created_at: string;
}

export interface Review {
  id: string;
  project_id: string;
  client_id: string;
  professional_id: string;
  rating: number;
  comment?: string;
  created_at: string;
  updated_at?: string;
  status: 'pending' | 'approved' | 'rejected' | 'reported';
  is_verified: boolean;
  communication_rating?: number;
  quality_rating?: number;
  timeliness_rating?: number;
  professionalism_rating?: number;
  verification_method?: string;
  reported_at?: string;
  reported_by?: string;
  report_reason?: string;
  moderated_at?: string;
  moderated_by?: string;
  moderation_notes?: string;
}

export interface Payment {
  id: string;
  project_id: string;
  client_id: string;
  professional_id: string;
  amount: number;
  status: string;
  created_at: string;
  paid_at?: string;
  payment_method_id?: string;
  currency?: string;
  transaction_id?: string;
  payment_url?: string;
  metadata?: any;
  project?: {
    id: string;
    title: string;
    status: string;
  };
}

export interface ProjectMember {
  id: string;
  project_id: string;
  user_id: string;
  role: 'client' | 'professional';
  created_at: string;
}

// Fixed PaymentsTabProps interface to match client PaymentsTab usage
export interface PaymentsTabProps {
  isLoading: boolean;
  projects: Project[];
  reviews: Review[];
  applications: Application[];
  projectToReview: Project | null;
  reviewData: { rating: number; comment: string };
  isSubmitting: boolean;
  handleReviewInitiate: (project: Project) => void;
  handleReviewCancel: () => void;
  handleReviewSubmit: () => Promise<void>;
  setReviewData: (data: { rating: number; comment: string }) => void;
}

// Add FileVersion interface with missing properties
export interface FileVersion {
  id: string;
  file_name: string;
  file_size: number;
  file_type: string;
  file_url: string;
  created_at: string;
  updated_at: string;
  project_id: string;
  uploaded_by: string;
  access_level?: string;
  version_number?: number;
  change_description?: string;
  metadata?: any;
}
