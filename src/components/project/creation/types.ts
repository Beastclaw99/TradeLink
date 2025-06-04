export interface Milestone {
  title: string;
  description?: string;
  due_date?: string;
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