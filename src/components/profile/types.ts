export interface ProfileData {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  bio: string | null;
  location: string | null;
  phone: string | null;
  account_type: 'client' | 'professional';
  hourly_rate: number | null;
  availability: 'available' | 'busy' | 'unavailable' | null;
  skills: string[] | null;
  certifications: string[] | null;
  completed_projects: number | null;
  response_rate: number | null;
  on_time_completion: number | null;
  profile_visibility: boolean;
  show_email: boolean;
  show_phone: boolean;
  allow_messages: boolean;
  profile_image: string | null;
  verification_status: 'unverified' | 'pending' | 'verified' | null;
  years_experience: number | null;
  created_at: string;
  updated_at: string;
  rating: number | null;
  total_reviews: number | null;
  portfolio_url: string | null;
  business_name: string | null;
  business_address: string | null;
  business_phone: string | null;
  business_email: string | null;
  business_website: string | null;
  business_description: string | null;
  business_license: string | null;
  insurance_info: string | null;
  payment_methods: string[] | null;
  preferred_contact_method: 'email' | 'phone' | 'message' | null;
  notification_preferences: {
    email: boolean;
    sms: boolean;
    push: boolean;
    marketing: boolean;
  } | null;
}

export interface ProfessionalStats {
  completedProjects: number;
  activeProjects: number;
  totalEarnings: number;
  averageRating: number;
  totalReviews: number;
}

export interface ClientStats {
  postedProjects: number;
  completedProjects: number;
  activeProjects: number;
  totalSpent: number;
}
