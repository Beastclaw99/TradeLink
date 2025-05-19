
export interface ProfileData {
  id: string;
  first_name: string | null;
  last_name: string | null;
  account_type: 'client' | 'professional';
  skills: string[] | null;
  rating: number | null;
  created_at: string;
  updated_at: string;
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
