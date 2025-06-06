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
  requires_deliverable: boolean;
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
  requires_deliverable: boolean;
  created_at: string;
  created_by: string;
  updated_at: string;
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
    requires_deliverable: dbMilestone.requires_deliverable,
    project_id: dbMilestone.project_id,
    created_at: dbMilestone.created_at,
    created_by: dbMilestone.created_by,
    updated_at: dbMilestone.updated_at
  };
};

export const convertMilestoneToDBMilestone = (milestone: Omit<Milestone, 'id'>): Omit<DBMilestone, 'id' | 'created_at' | 'updated_at' | 'created_by'> => {
  return {
    title: milestone.title,
    description: milestone.description,
    due_date: milestone.dueDate,
    status: milestone.status,
    is_complete: milestone.progress === 100,
    project_id: milestone.project_id || '',
    requires_deliverable: milestone.requires_deliverable
  };
};

export interface Deliverable {
  description: string;
  deliverable_type: 'file' | 'note' | 'link';
  content?: string;
}

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
  deliverables: Deliverable[];
  service_contract?: string;
} 
