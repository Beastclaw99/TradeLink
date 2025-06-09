import { Milestone, Deliverable } from '../../../types/project';

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

// Helper functions to convert between types
export const convertDBMilestoneToMilestone = (dbMilestone: any): Milestone => {
  return {
    id: dbMilestone.id,
    title: dbMilestone.title,
    description: dbMilestone.description,
    due_date: dbMilestone.due_date,
    status: dbMilestone.status as Milestone['status'],
    is_complete: dbMilestone.is_complete,
    tasks: dbMilestone.tasks || [],
    deliverables: dbMilestone.deliverables || [],
    project_id: dbMilestone.project_id,
    created_at: dbMilestone.created_at,
    created_by: dbMilestone.created_by,
    updated_at: dbMilestone.updated_at,
    assigned_to: dbMilestone.assigned_to ? {
      id: dbMilestone.assigned_to.id,
      name: dbMilestone.assigned_to.name,
      avatar: dbMilestone.assigned_to.avatar
    } : undefined
  };
};

export const convertMilestoneToDBMilestone = (milestone: Milestone, projectId: string): any => {
  return {
    id: milestone.id || crypto.randomUUID(),
    title: milestone.title,
    description: milestone.description,
    due_date: milestone.due_date,
    status: milestone.status,
    is_complete: milestone.is_complete,
    project_id: projectId,
    created_by: milestone.created_by,
    created_at: milestone.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString(),
    assigned_to: milestone.assigned_to ? {
      id: milestone.assigned_to.id,
      name: milestone.assigned_to.name,
      avatar: milestone.assigned_to.avatar
    } : null
  };
}; 