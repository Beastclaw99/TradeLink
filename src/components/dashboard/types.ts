
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
  client?: {
    first_name: string | null;
    last_name: string | null;
  };
  professional?: {
    first_name: string | null;
    last_name: string | null;
    rating?: number;
    skills?: string[];
  };
}

export interface Application {
  id: string;
  project_id: string;
  professional_id: string;
  cover_letter: string | null;
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn';
  created_at: string;
  updated_at: string;
  bid_amount: number | null;
  proposal_message: string | null;
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

export interface Professional {
  id: string;
  first_name?: string;
  last_name?: string;
  skills?: string[];
  rating?: number;
  account_type: 'professional';
  created_at: string;
  updated_at?: string;
}

export interface Client {
  id: string;
  first_name?: string;
  last_name?: string;
  account_type: 'client';
  created_at: string;
  updated_at?: string;
}

export interface Review {
  id: string;
  project_id: string;
  professional_id: string;
  client_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  project_id: string;
  client_id: string;
  professional_id: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  paid_at: string | null;
  created_at: string;
  project?: {
    title: string;
  };
  professional?: {
    first_name: string | null;
    last_name: string | null;
  };
}
