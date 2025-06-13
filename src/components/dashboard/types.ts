import { 
  Project, 
  Application, 
  Payment, 
  Review, 
  Milestone, 
  Task, 
  Profile 
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

export type DashboardStats = {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalEarnings: number;
  pendingPayments: number;
  averageRating: number;
  totalReviews: number;
  totalApplications: number;
  pendingApplications: number;
  acceptedApplications: number;
  rejectedApplications: number;
};

export type ProjectCardProps = {
  project: Project;
  onStatusChange?: (status: Project['status']) => void;
  onEdit?: (project: Project) => void;
  onDelete?: (projectId: string) => void;
  onViewDetails?: (projectId: string) => void;
  onViewApplications?: (projectId: string) => void;
  onViewPayments?: (projectId: string) => void;
  onViewReviews?: (projectId: string) => void;
  onViewMilestones?: (projectId: string) => void;
  onViewTasks?: (projectId: string) => void;
  onViewUpdates?: (projectId: string) => void;
  onViewMessages?: (projectId: string) => void;
  onViewFiles?: (projectId: string) => void;
  onViewTeam?: (projectId: string) => void;
  onViewSettings?: (projectId: string) => void;
};

export type ApplicationCardProps = {
  application: Application;
  project: Project;
  professional: Profile;
  onStatusChange?: (status: Application['status']) => void;
  onViewDetails?: (applicationId: string) => void;
  onViewProfile?: (professionalId: string) => void;
  onViewProject?: (projectId: string) => void;
  onViewMessages?: (applicationId: string) => void;
  onViewFiles?: (applicationId: string) => void;
};

export type PaymentCardProps = {
  payment: Payment;
  project: Project;
  onStatusChange?: (status: Payment['status']) => void;
  onViewDetails?: (paymentId: string) => void;
  onViewProject?: (projectId: string) => void;
  onViewReceipt?: (paymentId: string) => void;
  onViewInvoice?: (paymentId: string) => void;
  onViewTransaction?: (paymentId: string) => void;
};

export type ReviewCardProps = {
  review: Review;
  project: Project;
  reviewer: Profile;
  reviewee: Profile;
  onViewDetails?: (reviewId: string) => void;
  onViewProject?: (projectId: string) => void;
  onViewProfile?: (profileId: string) => void;
  onViewResponse?: (reviewId: string) => void;
};

export type MilestoneCardProps = {
  milestone: Milestone;
  project: Project;
  onStatusChange?: (status: Milestone['status']) => void;
  onViewDetails?: (milestoneId: string) => void;
  onViewProject?: (projectId: string) => void;
  onViewTasks?: (milestoneId: string) => void;
  onViewFiles?: (milestoneId: string) => void;
  onViewTeam?: (milestoneId: string) => void;
  onViewSettings?: (milestoneId: string) => void;
};

export type TaskCardProps = {
  task: Task;
  milestone: Milestone;
  project: Project;
  assignedTo?: Profile;
  onStatusChange?: (status: Task['status']) => void;
  onViewDetails?: (taskId: string) => void;
  onViewMilestone?: (milestoneId: string) => void;
  onViewProject?: (projectId: string) => void;
  onViewFiles?: (taskId: string) => void;
  onViewTeam?: (taskId: string) => void;
  onViewSettings?: (taskId: string) => void;
};
