
export interface ProjectData {
  title: string;
  description: string;
  category: string;
  location: string;
  recommended_skills: string[];
  budget: number;
  timeline: string;
  urgency: string;
  milestones: Milestone[];
  deliverables: Deliverable[];
  service_contract: string;
  requirements: string[];
  rich_description: string;
  expected_timeline: string;
  scope: string;
  industry_specific_fields: Record<string, any> | null;
  location_coordinates: { lat: number; lng: number } | null;
  contract_template_id: string;
  payment_required: boolean;
  payment_due_date: string;
  project_start_time: string;
  client_id?: string;
  sla_terms: Record<string, any> | null;
}

export interface Milestone {
  id?: string;
  title: string;
  description?: string;
  due_date?: string;
  dueDate?: string; // Support both formats for backwards compatibility
  status: string;
  requires_deliverable?: boolean;
}

export interface Deliverable {
  id?: string;
  description: string;
  type?: string;
  deliverable_type?: string; // Support both formats for backwards compatibility
  content?: string;
  file_url?: string;
}
