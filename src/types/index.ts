export interface Project {
  id: string;
  title: string;
  description: string | null;
  budget: number | null;
  status: 'open' | 'applied' | 'assigned' | 'in-progress' | 'submitted' | 'revision' | 'completed' | 'paid' | 'archived' | 'disputed';
  client_id: string;
  created_at: string;
  updated_at: string;
  assigned_to: string | null;
  location: string | null;
  deadline: string | null;
  required_skills: string | null;
  professional_id: string | null;
  project_start_time: string | null;
  category: string | null;
  expected_timeline: string | null;
  urgency: string | null;
  requirements: string[] | null;
  scope: string | null;
  service_contract: string | null;
}

export interface Application {
  id: string;
  project_id: string;
  professional_id: string;
  cover_letter: string | null;
  proposal_message: string | null;
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn';
  created_at: string;
  updated_at: string;
  bid_amount: number | null;
  availability: string | null;
  project?: {
    id: string;
    title: string;
    status: Project['status'];
    budget: number | null;
    created_at: string;
  };
  professional?: {
    first_name: string | null;
    last_name: string | null;
    rating?: number;
    skills?: string[];
  };
}

export interface Deliverable {
  id: string;
  title: string;
  description: string;
  deliverable_type: 'text' | 'file';
  content: string;
  milestone_id: string;
  file_name?: string;
  file_url?: string;
  created_at?: string;
  updated_at?: string;
} 