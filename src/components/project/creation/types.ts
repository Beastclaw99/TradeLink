import {
  ProjectMilestone,
  ProjectDeliverable,
  MilestoneStatus,
  DeliverableStatus
} from '@/types/database';

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  created_at?: string;
  updated_at?: string;
  [key: string]: any; // Add index signature for JSON compatibility
}

export interface Deliverable extends Omit<ProjectDeliverable, 'created_at'> {
  file_name?: string;
  milestone_id?: string;
  uploaded_by?: string;
  created_at?: string | null;
  status?: DeliverableStatus;
  feedback?: string;
  reviewed_at?: string;
}

export interface Milestone extends Omit<ProjectMilestone, 'due_date'> {
  due_date?: string | null;
  progress?: number;
  deliverables: Deliverable[];
  tasks?: Task[];
}

export interface ProjectData {
  id?: string;
  title: string;
  description: string;
  category: string;
  location: string;
  budget: number;
  timeline: string;
  urgency: string;
  recommendedSkills: string[];
  milestones: Milestone[];
  deliverables: Deliverable[];
  service_contract?: string;
  requirements?: string[];
  rich_description?: string;
  expected_timeline?: string;
  scope?: string;
  sla_terms?: any;
  industry_specific_fields?: any;
  location_coordinates?: any;
  contract_template_id?: string;
  payment_required?: boolean;
  payment_due_date?: string;
  project_start_time?: string;
  client_id?: string;
  professional_id?: string;
  assigned_to?: string;
  status?: string;
  payment_status?: string;
  deadline?: string;
  created_at?: string;
  updated_at?: string;
  payment_id?: string;
}

// Database milestone interface for Supabase operations
export interface DBMilestone {
  id?: string;
  title: string;
  description?: string;
  due_date?: string;
  status: string;
  requires_deliverable?: boolean;
  project_id?: string;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
  is_complete?: boolean;
}

// Database deliverable interface for Supabase operations
export interface DBDeliverable {
  id?: string;
  description: string;
  deliverable_type: string;
  content?: string;
  file_url?: string;
  file_name?: string;
  milestone_id?: string;
  project_id?: string;
  uploaded_by?: string;
  created_at?: string;
  status?: string;
  feedback?: string;
  reviewed_at?: string;
}

export const convertDBMilestoneToMilestone = (dbMilestone: any): Milestone => {
  return {
    id: dbMilestone.id,
    title: dbMilestone.title || '',
    description: dbMilestone.description || '',
    dueDate: dbMilestone.due_date || dbMilestone.dueDate,
    status: dbMilestone.status || 'not_started',
    requires_deliverable: dbMilestone.requires_deliverable || false,
    progress: dbMilestone.progress || 0,
    deliverables: [],
    project_id: dbMilestone.project_id,
    created_by: dbMilestone.created_by,
    created_at: dbMilestone.created_at,
    updated_at: dbMilestone.updated_at,
    is_complete: dbMilestone.is_complete || false,
    tasks: dbMilestone.tasks || []
  };
};

export const convertMilestoneToDBMilestone = (milestone: Milestone, projectId?: string): DBMilestone => {
  return {
    id: milestone.id,
    title: milestone.title,
    description: milestone.description || '',
    due_date: milestone.dueDate,
    status: milestone.status,
    requires_deliverable: milestone.requires_deliverable || false,
    project_id: projectId || milestone.project_id,
    created_by: milestone.created_by,
    is_complete: milestone.is_complete || false
  };
};
