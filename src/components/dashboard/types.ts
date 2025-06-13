// Update types to match actual database schema
export interface Application {
  id: string;
  project_id: string;
  professional_id: string;
  cover_letter: string | null;
  proposal_message: string | null;
  bid_amount: number | null;
  availability: string | null;
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn' | null;
  created_at: string;
  updated_at: string;
  // Relations - these come from joins, not direct columns
  project?: {
    id: string;
    title: string;
    status: string;
    budget: number | null;
    created_at: string;
  };
  professional?: {
    id: string;
    first_name: string;
    last_name: string;
    rating: number | null;
    profile_image_url: string | null;
  };
}

export interface Review {
  id: string;
  rating: number | null;
  comment: string | null;
  status: 'pending' | 'approved' | 'rejected' | 'reported' | null;
  reported_at: string | null;
  reported_by: string | null;
  report_reason: string | null;
  created_at: string | null;
  updated_at: string | null;
  client_id: string | null;
  professional_id: string | null;
  project_id: string | null;
  communication_rating: number | null;
  quality_rating: number | null;
  timeliness_rating: number | null;
  professionalism_rating: number | null;
  is_verified: boolean;
  verification_method: string | null;
  moderated_at: string | null;
  moderated_by: string | null;
  moderation_notes: string | null;
}

export interface Project {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  budget: number | null;
  expected_timeline: string | null;
  location: string | null;
  urgency: string | null;
  requirements: string[] | null;
  recommended_skills: string[] | null;
  status: 'draft' | 'open' | 'assigned' | 'in_progress' | 'work_submitted' | 'work_revision_requested' | 'work_approved' | 'completed' | 'cancelled' | 'archived' | 'disputed' | null;
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
  service_contract: any | null;
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
  milestones?: Milestone[];
  deliverables?: Deliverable[];
}

export interface Milestone {
  id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  status: 'not_started' | 'in_progress' | 'completed' | 'on_hold' | 'overdue' | null;
  project_id: string;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  is_complete: boolean;
  requires_deliverable: boolean;
}

export interface Deliverable {
  id: string;
  description: string;
  deliverable_type: 'file' | 'text' | 'link';
  content: string | null;
  file_url: string | null;
  status: 'pending' | 'submitted' | 'approved' | 'rejected' | null;
  created_at: string | null;
  project_id: string;
  milestone_id: string | null;
  uploaded_by: string | null;
  reviewed_at: string | null;
  feedback: string | null;
}

export interface Payment {
  id: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded' | null;
  payment_method: string | null;
  transaction_id: string | null;
  created_at: string | null;
  paid_at: string | null;
  client_id: string | null;
  professional_id: string | null;
  project_id: string | null;
  project?: {
    id: string;
    title: string;
    status: string;
    budget: number | null;
  };
  professional?: {
    id: string;
    first_name: string;
    last_name: string;
    profile_image_url: string | null;
  };
  currency: string | null;
  metadata: any | null;
  payment_id: string | null;
  payment_method_id: string | null;
  payment_url: string | null;
}

export interface Client {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  location: string | null;
  account_type: 'client';
  profile_image_url: string | null;
  bio: string | null;
  rating: number | null;
  total_reviews: number | null;
  company_name: string | null;
  company_size: string | null;
  industry: string | null;
  website: string | null;
  social_media_links: any | null;
  notification_preferences: any | null;
  language_preferences: any | null;
  timezone: string | null;
  payment_methods: string[] | null;
  preferred_payment_method: string | null;
  tax_information: any | null;
  bank_account_details: any | null;
  stripe_customer_id: string | null;
  created_at: string;
  updated_at: string | null;
  verification_status: 'unverified' | 'pending' | 'verified';
  profile_visibility: boolean;
  show_email: boolean;
  show_phone: boolean;
  allow_messages: boolean;
  years_of_experience: number | null;
}

export interface ApplicationProject {
  id: string;
  title: string;
  status: string;
  budget: number | null;
  created_at: string;
}
