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
  };
  requires_deliverable: boolean;
}

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
  requirements: string[];
  skills: string[];
  budget: number;
  timeline: string;
  urgency: string;
  milestones: Milestone[];
  deliverables: Deliverable[];
  service_contract?: string;
} 