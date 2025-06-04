
export interface Project {
  id: string;
  title: string;
  description?: string;
  category?: string;
  budget?: number; // Changed from string to number to match database
  expected_timeline?: string;
  location?: string;
  urgency?: string;
  requirements?: string[];
  required_skills?: string;
  status: string;
  created_at: string;
  client_id?: string;
  assigned_to?: string;
  professional_id?: string;
  client?: {
    first_name?: string;
    last_name?: string;
  };
  professional?: {
    first_name?: string;
    last_name?: string;
  };
}

export interface Application {
  id: string;
  project_id: string;
  professional_id: string;
  cover_letter?: string;
  proposal_message?: string;
  bid_amount?: number;
  availability?: string;
  status: string;
  created_at: string;
  updated_at: string;
  project?: Project;
  professional?: {
    first_name?: string;
    last_name?: string;
    skills?: string[];
    rating?: number;
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
  rating?: number;
  comment?: string;
  client_id?: string;
  professional_id?: string;
  project_id?: string;
  created_at: string;
  updated_at?: string;
}

export interface Payment {
  id: string;
  amount: number;
  status: string;
  created_at: string;
  paid_at?: string;
  client_id?: string;
  professional_id?: string;
  project_id?: string;
  project?: {
    title?: string;
  };
  professional?: {
    first_name?: string;
    last_name?: string;
  };
}
