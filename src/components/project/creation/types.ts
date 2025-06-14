export type ProjectStatus = 
  | 'draft'
  | 'open'
  | 'assigned'
  | 'in_progress'
  | 'work_submitted'
  | 'work_revision_requested'
  | 'work_approved'
  | 'completed'
  | 'archived'
  | 'cancelled'
  | 'disputed';

export interface ProjectData {
  title: string;
  description: string;
  category: string;
  location: string;
  recommended_skills: string[];
  budget: number;
  timeline: string;
  urgency: 'low' | 'medium' | 'high' | 'urgent';
  milestones: Milestone[];
  deliverables: Deliverable[];
  service_contract: string;
  requirements: string[];
  rich_description: string;
  scope: string;
  industry_specific_fields: Record<string, any> | null;
  location_coordinates: { lat: number; lng: number } | null;
  contract_template_id: string;
  payment_required: boolean;
  payment_due_date: string;
  project_start_time: string;
  client_id?: string;
  sla_terms: Record<string, any> | null;
  status?: ProjectStatus;
}

export interface Milestone {
  id?: string;
  title: string;
  description?: string;
  due_date?: string;
  dueDate?: string; // Support both formats for backwards compatibility
  status: string;
  requires_deliverable?: boolean;
  deliverables: Deliverable[];
  tasks: Task[];
}

export interface Deliverable {
  id?: string;
  description: string;
  type?: string;
  deliverable_type?: string; // Support both formats for backwards compatibility
  content?: string;
  file_url?: string;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
}

export const convertDBMilestoneToMilestone = (milestone: any): Milestone => ({
  id: milestone?.id || '',
  title: milestone?.title || '',
  description: milestone?.description || '',
  due_date: milestone?.due_date || null,
  status: milestone?.status || 'not_started',
  deliverables: [],
  tasks: []
});

export const convertMilestoneToDBMilestone = (milestone: Milestone, projectId: string) => ({
  project_id: projectId,
  title: milestone.title,
  description: milestone.description,
  due_date: milestone.due_date || milestone.dueDate,
  status: milestone.status,
  requires_deliverable: milestone.requires_deliverable || false
});
