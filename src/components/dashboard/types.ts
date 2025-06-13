import {
  Project as BackendProject,
  Application as BackendApplication,
  Payment as BackendPayment,
  Review as BackendReview,
  Milestone,
  Task,
  Profile,
  ProjectStatus,
  PaymentStatus,
  MilestoneStatus,
  TaskStatus
} from '@/types/database';

// Augment backend Project type with frontend-only fields if needed
export type Project = BackendProject & {
  // Add only frontend-specific fields here if any
};

// Simplified project interface for applications (frontend only)
export interface ApplicationProject {
  id: string;
  title: string;
  status: ProjectStatus;
  budget: number | null;
  created_at: string | null;
}

// Augment backend Application type with frontend-only fields if needed
export type Application = BackendApplication & {
  project?: ApplicationProject;
  professional?: {
    first_name?: string;
    last_name?: string;
    skills?: string[];
    rating?: number;
  };
};

// Augment backend Review type with frontend-only fields if needed
export type Review = BackendReview & {
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
};

// Augment backend Payment type with frontend-only fields if needed
export type Payment = BackendPayment & {
  project?: {
    title?: string;
  };
  professional?: {
    first_name?: string;
    last_name?: string;
  };
};

export interface Client extends Profile {
  account_type: 'client';
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
  onStatusChange?: (status: MilestoneStatus) => void;
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
  onStatusChange?: (status: TaskStatus) => void;
  onViewDetails?: (taskId: string) => void;
  onViewMilestone?: (milestoneId: string) => void;
  onViewProject?: (projectId: string) => void;
  onViewFiles?: (taskId: string) => void;
  onViewTeam?: (taskId: string) => void;
  onViewSettings?: (taskId: string) => void;
};
