
import { Milestone, ProjectDeliverable } from '../../../types/project';

export interface ProjectData {
  title: string;
  description: string;
  category: string;
  location: string;
  recommended_skills: string[];
  budget: number;
  expected_timeline: string;
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
    project_id: dbMilestone.project_id,
    title: dbMilestone.title,
    description: dbMilestone.description,
    due_date: dbMilestone.due_date,
    status: dbMilestone.status as Milestone['status'],
    is_complete: dbMilestone.is_complete,
    tasks: dbMilestone.tasks || null,
    requires_deliverable: dbMilestone.requires_deliverable,
    created_by: dbMilestone.created_by,
    created_at: dbMilestone.created_at,
    updated_at: dbMilestone.updated_at
  };
};

export const convertMilestoneToDBMilestone = (milestone: Milestone, projectId: string): any => {
  return {
    id: milestone.id || crypto.randomUUID(),
    project_id: projectId,
    title: milestone.title,
    description: milestone.description,
    due_date: milestone.due_date,
    status: milestone.status,
    is_complete: milestone.is_complete,
    tasks: milestone.tasks,
    requires_deliverable: milestone.requires_deliverable,
    created_by: milestone.created_by,
    created_at: milestone.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
};
