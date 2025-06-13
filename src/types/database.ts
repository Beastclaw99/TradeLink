import { Database } from '@/integrations/supabase/types';

// Re-export all enums from the database
export type AccountType = Database['public']['Enums']['account_type_enum'];
export type ApplicationStatus = Database['public']['Enums']['application_status'];
export type DeliverableStatus = Database['public']['Enums']['deliverable_status'];
export type DisputeCategory = Database['public']['Enums']['dispute_category'];
export type DisputeResolutionType = Database['public']['Enums']['dispute_resolution_type'];
export type DisputeStatus = Database['public']['Enums']['dispute_status'];
export type FileReviewStatus = Database['public']['Enums']['file_review_status_enum'];
export type MilestoneStatus = Database['public']['Enums']['milestone_status'];
export type PaymentStatus = Database['public']['Enums']['payment_status'];
export type ProjectStatus = Database['public']['Enums']['project_status_enum'];
export type ReviewStatus = Database['public']['Enums']['review_status_enum'];
export type TaskStatus = Database['public']['Enums']['task_status_enum'];
export type UserRole = Database['public']['Enums']['user_role'];
export type VerificationStatus = Database['public']['Enums']['verification_status_enum'];

// Re-export table types
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Project = Database['public']['Tables']['projects']['Row'];
export type Application = Database['public']['Tables']['applications']['Row'];
export type Review = Database['public']['Tables']['reviews']['Row'];
export type Dispute = Database['public']['Tables']['disputes']['Row'];
export type Payment = Database['public']['Tables']['payments']['Row'];
export type Invoice = Database['public']['Tables']['invoices']['Row'];
export type Message = Database['public']['Tables']['project_messages']['Row'];
export type Notification = Database['public']['Tables']['notifications']['Row'];

// Extended types for frontend use
export interface ExtendedProject extends Omit<Project, 'urgency'> {
  client?: Profile;
  professional?: Profile;
  milestones?: ExtendedProjectMilestone[];
  tasks?: ExtendedProjectTask[];
  updates?: ExtendedProjectStatusUpdate[];
  applications?: ExtendedApplication[];
  reviews?: ExtendedReview[];
  disputes?: Dispute[];
  payments?: ExtendedPayment[];
  invoices?: Invoice[];
  messages?: Message[];
  notifications?: Notification[];
  recommended_skills?: string[];
  project_start_time?: string | null;
  rich_description?: string | null;
  service_contract?: string | null;
  urgency?: 'high' | 'low' | 'normal' | null;
}

export interface ExtendedApplication extends Application {
  professional?: {
    id: string;
    first_name: string;
    last_name: string;
    profile_image_url: string | null;
    rating: number | null;
  } | null;
}

export interface ExtendedPayment extends Payment {
  professional?: {
    id: string;
    first_name: string;
    last_name: string;
  } | null;
}

export interface ExtendedReview extends Review {
  professional?: {
    id: string;
    first_name: string;
    last_name: string;
  } | null;
}

export interface ExtendedProjectTask {
  id: string;
  project_id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  assignee_id: string | null;
  due_date: string | null;
  created_at: string;
  updated_at: string;
  assignee?: {
    id: string;
    first_name: string;
    last_name: string;
    profile_image_url: string | null;
  } | null;
}

export interface ExtendedProjectMilestone {
  id: string;
  project_id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  status: MilestoneStatus;
  created_at: string;
  updated_at: string;
  tasks?: ExtendedProjectTask[];
}

export interface ExtendedProjectStatusUpdate {
  id: string;
  project_id: string;
  status: ProjectStatus;
  comment: string | null;
  created_at: string;
  updated_at: string;
  user: {
    id: string;
    first_name: string;
    last_name: string;
  };
}

export interface ExtendedProjectComment {
  id: string;
  project_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  user: {
    id: string;
    first_name: string;
    last_name: string;
    profile_image_url: string | null;
  };
}

export interface ExtendedProjectFile {
  id: string;
  project_id: string;
  title: string;
  description: string | null;
  file_url: string;
  file_type: string;
  file_size: number;
  created_at: string;
  updated_at: string;
}

export interface ExtendedProjectExpense {
  id: string;
  project_id: string;
  title: string;
  description: string | null;
  amount: number;
  status: PaymentStatus;
  created_at: string;
  updated_at: string;
}

export interface ExtendedProjectDeliverable {
  id: string;
  project_id: string;
  title: string;
  description: string | null;
  status: DeliverableStatus;
  due_date: string | null;
  created_at: string;
  updated_at: string;
}

// Task types
export interface Task {
  id: string;
  milestone_id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  assignee_id: string | null;
  created_at: string;
  updated_at: string;
  assignee?: {
    id: string;
    first_name: string;
    last_name: string;
  } | null;
}

export interface TaskInsert {
  project_id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  assignee_id?: string;
  due_date?: string;
  completed?: boolean;
  completion_date?: string;
  created_by?: string;
  dependencies?: string[];
  milestone_id?: string;
  priority: string;
  tags?: string[];
}

export interface TaskUpdate {
  title?: string;
  description?: string;
  status?: TaskStatus;
  assignee_id?: string;
  due_date?: string;
  completed?: boolean;
  completion_date?: string;
  created_by?: string;
  dependencies?: string[];
  milestone_id?: string;
  priority?: string;
  tags?: string[];
}

export type ProjectUpdate = {
  id: string;
  project_id: string;
  user_id: string;
  update_type: 'status_change' | 'milestone_complete' | 'payment_received' | 'application_updated' | 'review_posted';
  message: string;
  created_at: string;
  updated_at: string;
  metadata?: Record<string, any>;
};

export type Milestone = {
  id: string;
  project_id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  status: TaskStatus;
  created_at: string;
  updated_at: string;
};

export type ExpenseStatus = 'pending' | 'approved' | 'rejected';

export type ProjectMilestone = {
  id: string;
  project_id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  status: MilestoneStatus;
  created_at: string;
  updated_at: string;
};

export type ProjectDeliverable = {
  id: string;
  project_id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  due_date: string | null;
  created_at: string;
  updated_at: string;
};

export type ProjectExpense = {
  id: string;
  project_id: string;
  title: string;
  description: string | null;
  amount: number;
  status: ExpenseStatus;
  created_at: string;
  updated_at: string;
};

export type ProjectFile = {
  id: string;
  project_id: string;
  title: string;
  description: string | null;
  file_url: string;
  file_type: string;
  file_size: number;
  created_at: string;
  updated_at: string;
};

export type ProjectComment = {
  id: string;
  project_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  user: {
    id: string;
    first_name: string;
    last_name: string;
    profile_image_url: string | null;
  };
};

export type ProjectStatusUpdate = {
  id: string;
  project_id: string;
  status: ProjectStatus;
  comment: string | null;
  created_at: string;
  updated_at: string;
  user: {
    id: string;
    first_name: string;
    last_name: string;
  };
};

export type ProjectTask = {
  id: string;
  project_id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  assignee_id: string | null;
  due_date: string | null;
  created_at: string;
  updated_at: string;
  assignee: {
    id: string;
    first_name: string;
    last_name: string;
    profile_image_url: string | null;
  } | null;
}; 