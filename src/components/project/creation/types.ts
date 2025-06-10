
export interface Task {
  id: string;
  title: string;
  completed: boolean;
}

export interface Milestone {
  id?: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'on_hold';
  deliverables: string[];
  tasks?: Task[];
  created_by?: string;
}

export interface ProjectData {
  title: string;
  description: string;
  category: string;
  budget: number;
  timeline: string;
  urgency: 'low' | 'medium' | 'high';
  location: string;
  requirements: string[];
  milestones: Milestone[];
  serviceContract: string;
}

export const convertMilestoneToDBMilestone = (milestone: Milestone, projectId: string) => {
  return {
    title: milestone.title,
    description: milestone.description,
    due_date: milestone.dueDate,
    status: milestone.status,
    project_id: projectId,
    created_by: milestone.created_by
  };
};
