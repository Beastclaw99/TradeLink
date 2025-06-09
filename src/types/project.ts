import { ProjectStatus } from './projectUpdates';

export interface Project {
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  timeline: string;
  skills_needed: string[];
  created_at: string;
  updated_at: string;
  client_id: string;
  professional_id: string;
  budget: number;
  currency: string;
  category: string;
  subcategory: string;
  location: string;
  is_remote: boolean;
  experience_level: string;
  project_type: string;
  attachments: string[];
  tags: string[];
  milestones: Milestone[];
  deliverables: ProjectDeliverable[];
}

export interface Milestone {
  id: string;
  project_id: string;
  title: string;
  description: string;
  due_date: string;
  status: 'pending' | 'in_progress' | 'completed';
  assigned_to: string;
  tasks: MilestoneTask[];
  created_at: string;
  updated_at: string;
}

export interface MilestoneTask {
  id: string;
  milestone_id: string;
  title: string;
  description: string;
  completed: boolean;
  assigned_to: string;
  due_date: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectDeliverable {
  id: string;
  project_id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  due_date: string;
  assigned_to: string;
  attachments: string[];
  created_at: string;
  updated_at: string;
}

export interface ProjectArchive {
  id: string;
  project_id: string;
  archived_at: string;
  archived_by: string;
  archive_reason: string | null;
  archive_notes: string | null;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface ProjectHistory {
  id: string;
  project_id: string;
  history_type: string;
  history_data: Record<string, any>;
  created_at: string;
  created_by: string;
}

export interface ProjectCompletionChecklist {
  id: string;
  project_id: string;
  item_type: string;
  item_name: string;
  is_required: boolean;
  is_completed: boolean;
  completed_at: string | null;
  completed_by: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
} 