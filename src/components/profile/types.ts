
export interface ProfileData {
  id: string;
  first_name: string | null;
  last_name: string | null;
  account_type: 'client' | 'professional' | 'business';
  skills: string[] | null;
  rating: number | null;
  created_at: string;
  updated_at: string | null;
  bio: string | null;
  location: string | null;
  phone: string | null;
  email: string | null;
  hourly_rate: number | null;
  availability: string | null;
  portfolio_images: string[] | null;
  portfolio_urls: string[] | null;
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
  years_experience: number | null;
  years_of_experience: number | null;
  is_available: boolean | null;
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
