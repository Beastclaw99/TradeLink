export interface ProfileData {
  id: string;
  first_name: string | null;
  last_name: string | null;
  account_type: 'client' | 'professional';
  skills: string[] | null;
  rating: number | null;
  created_at: string;
  updated_at: string | null;
  bio: string | null;
  location: string | null;
  phone: string | null;
  email: string | null;
  hourly_rate: number | null;
  availability: 'available' | 'busy' | 'unavailable' | null;
  portfolio_images: string[] | null;
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
