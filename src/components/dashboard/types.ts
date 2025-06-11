import {
  Project as DBProject,
  Application as DBApplication,
  Review as DBReview,
  Payment as DBPayment,
  Profile,
  ProjectStatus,
  ApplicationStatus,
  ReviewStatus,
  PaymentStatus,
  MilestoneStatus,
  DeliverableStatus
} from '@/types/database';

export interface Project extends DBProject {
  client?: {
    first_name?: string;
    last_name?: string;
  };
  professional?: {
    first_name?: string;
    last_name?: string;
    rating?: number;
    profile_image?: string;
  };
  milestones?: {
    id: string;
    title: string;
    description: string | null;
    due_date: string | null;
    status: MilestoneStatus;
    tasks: {
      id: string;
      title: string;
      description: string | null;
      status: string | null;
      completed: boolean;
    }[];
  }[];
  deliverables?: {
    id: string;
    description: string;
    deliverable_type: string;
    content: string | null;
    file_url: string | null;
    status: DeliverableStatus;
    created_at: string | null;
  }[];
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
