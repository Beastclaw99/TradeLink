export interface Milestone {
  id?: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'overdue';
  progress: number;
  tasks: {
    id: string;
    title: string;
    completed: boolean;
  }[];
  assignedTo?: {
    id: string;
    name: string;
    avatar?: string;
  };
  deliverables: {
    description: string;
    deliverable_type: 'file' | 'note' | 'link';
    content?: string;
  }[];
  project_id?: string;
  created_at?: string;
  created_by?: string;
  updated_at?: string;
}

// Database milestone type
export interface DBMilestone {
  id: string;
  title: string;
  description: string;
  due_date: string;
  status: string;
  is_complete: boolean;
  project_id: string;
  created_at: string;
  created_by: string;
  updated_at: string;
}

// Database deliverable type
export interface DBDeliverable {
  id: string;
  description: string;
  deliverable_type: string;
  content: string | null;
  file_url: string;
  milestone_id: string;
  project_id: string;
  uploaded_by: string | null;
  created_at: string;
}

// Helper functions to convert between types
export const convertDBMilestoneToMilestone = (dbMilestone: DBMilestone): Milestone => {
  return {
    id: dbMilestone.id,
    title: dbMilestone.title,
    description: dbMilestone.description,
    dueDate: dbMilestone.due_date,
    status: dbMilestone.status as Milestone['status'],
    progress: dbMilestone.is_complete ? 100 : 0,
    tasks: [],
    deliverables: [],
    project_id: dbMilestone.project_id,
    created_at: dbMilestone.created_at,
    created_by: dbMilestone.created_by,
    updated_at: dbMilestone.updated_at
  };
};

export const convertMilestoneToDBMilestone = (milestone: Milestone, projectId: string): DBMilestone => {
  return {
    id: milestone.id || crypto.randomUUID(),
    title: milestone.title,
    description: milestone.description,
    due_date: milestone.dueDate,
    status: milestone.status,
    is_complete: milestone.progress === 100,
    project_id: projectId,
    created_by: milestone.created_by || '',
    created_at: milestone.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
};

export interface ProjectData {
  title: string;
  description: string;
  category: string;
  location: string;
  recommendedSkills: string[];
  budget: number;
  timeline: string;
  urgency: string;
  milestones: Milestone[];
  service_contract: string;
  requirements: string[];
  scope: string;
  industry_specific_fields: Record<string, any> | null;
  location_coordinates: { latitude: number; longitude: number } | null;
  deadline: string;
  project_start_time: string;
  rich_description: string;
  sla_terms: string | null;
} 
