
import { ProjectStatus } from './projectUpdates';

export interface Project {
  id: string;
  title: string;
  description: string | null;
  status: ProjectStatus;
  created_at: string;
  updated_at: string | null;
  client_id: string | null;
  professional_id: string | null;
  assigned_to: string | null;
  budget: number | null;
  currency?: string;
  category: string | null;
  subcategory?: string;
  location: string | null;
  is_remote?: boolean;
  expected_timeline: string | null;
  deadline: string | null;
  project_start_time: string | null;
  urgency: string | null;
  requirements: string[] | null;
  recommended_skills: string | null;
  scope: string | null;
  rich_description: string | null;
  service_contract: string | null;
  sla_terms: any | null;
  industry_specific_fields: any | null;
  location_coordinates: any | null;
  contract_template_id: string | null;
  payment_id: string | null;
  payment_required: boolean | null;
  payment_status: string | null;
  payment_due_date: string | null;
  // Related data
  client?: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    email?: string | null;
  };
  professional?: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    skills?: string[] | null;
    rating?: number | null;
  };
  milestones?: Milestone[];
  deliverables?: ProjectDeliverable[];
}

export interface Milestone {
  id: string;
  project_id: string | null;
  title: string;
  description: string | null;
  due_date: string | null;
  status: 'not_started' | 'in_progress' | 'completed';
  is_complete: boolean | null;
  tasks: any | null; // jsonb field
  requires_deliverable: boolean | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface MilestoneTask {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  deadline?: string;
  dependencies: string[];
  status: 'todo' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
}

export interface ProjectDeliverable {
  id: string;
  project_id: string | null;
  milestone_id: string | null;
  title?: string;
  description: string | null;
  status: string | null;
  deliverable_type: string | null;
  file_url: string;
  content: string | null;
  uploaded_by: string | null;
  feedback: string | null;
  reviewed_at: string | null;
  created_at: string;
}

export interface ProjectArchive {
  id: string;
  project_id: string | null;
  archived_at: string;
  archived_by: string | null;
  archive_reason: string | null;
  archive_notes: string | null;
  metadata: any | null;
  created_at: string;
  updated_at: string;
}

export interface ProjectHistory {
  id: string;
  project_id: string | null;
  history_type: string;
  history_data: any;
  created_at: string;
  created_by: string | null;
  // Related profile data
  profiles?: {
    first_name: string | null;
    last_name: string | null;
    profile_image: string | null;
  };
}

export interface ProjectCompletionChecklist {
  id: string;
  project_id: string | null;
  item_type: string;
  item_name: string;
  is_required: boolean | null;
  is_completed: boolean | null;
  completed_at: string | null;
  completed_by: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}
