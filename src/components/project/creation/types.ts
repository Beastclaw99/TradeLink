
export interface ProjectData {
  title: string;
  description: string;
  category: string;
  location: string;
  recommended_skills?: string[]; // Make optional and consistent
  budget: number;
  expected_timeline: string;
  urgency: string;
  milestones: Milestone[];
  deliverables: Deliverable[];
  service_contract?: string;
  requirements: string[];
  rich_description?: string;
  scope?: string;
  industry_specific_fields: Record<string, any> | null;
  location_coordinates: { lat: number; lng: number } | null;
  contract_template_id?: string;
  payment_required: boolean;
  payment_due_date?: string;
  project_start_time?: string;
  client_id?: string;
  sla_terms: Record<string, any> | null;
  status?: 'draft' | 'open' | 'assigned' | 'in_progress' | 'work_submitted' | 'work_revision_requested' | 'work_approved' | 'completed' | 'cancelled' | 'disputed' | 'archived';
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

// Helper function to prepare project data for database submission
export const prepareProjectDataForDB = (data: ProjectData) => {
  const dbData = {
    title: data.title,
    description: data.description,
    category: data.category,
    location: data.location,
    budget: data.budget,
    expected_timeline: data.expected_timeline,
    urgency: data.urgency,
    requirements: data.requirements,
    scope: data.scope || '',
    industry_specific_fields: data.industry_specific_fields,
    location_coordinates: data.location_coordinates,
    contract_template_id: data.contract_template_id,
    sla_terms: data.sla_terms,
    status: data.status || 'open',
    client_id: data.client_id
  };

  // Only include optional fields if they have values
  if (data.service_contract) {
    (dbData as any).service_contract = data.service_contract;
  }
  if (data.rich_description) {
    (dbData as any).rich_description = data.rich_description;
  }
  if (data.project_start_time) {
    (dbData as any).project_start_time = data.project_start_time;
  }
  if (data.payment_due_date) {
    (dbData as any).payment_due_date = data.payment_due_date;
  }

  return dbData;
};
